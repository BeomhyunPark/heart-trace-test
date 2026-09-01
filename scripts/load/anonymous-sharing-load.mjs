import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';

const TARGET_URL = (process.env.TARGET_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const IS_LOCAL_TARGET = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(TARGET_URL);
const CONFIG = {
  targetUrl: TARGET_URL,
  origin: process.env.LOAD_TEST_ORIGIN ?? (IS_LOCAL_TARGET
    ? 'http://localhost:5173'
    : 'https://ongi.greengroove.app'),
  rooms: integerEnv('ROOMS', 2),
  participantsPerRoom: integerEnv('PARTICIPANTS_PER_ROOM', 5),
  joinRampMs: integerEnv('JOIN_RAMP_MS', 5_000),
  setupConcurrency: integerEnv('SETUP_CONCURRENCY', 100),
  answerStepDelayMs: integerEnv('ANSWER_STEP_DELAY_MS', 100),
  sseConnectTimeoutMs: integerEnv('SSE_CONNECT_TIMEOUT_MS', 30_000),
  sseReconnectDelayMs: integerEnv('SSE_RECONNECT_DELAY_MS', 3_000),
  sseSettleMs: integerEnv('SSE_SETTLE_MS', 2_000),
  soakMs: integerEnv('SOAK_MS', 0),
  roundPauseMs: integerEnv('ROUND_PAUSE_MS', 250),
  postTestHoldMs: integerEnv('POST_TEST_HOLD_MS', 2_000),
  requestTimeoutMs: integerEnv('REQUEST_TIMEOUT_MS', 20_000),
  outputDirectory: process.env.LOAD_TEST_OUTPUT_DIR ?? 'tests/load/results',
};

validateConfiguration();

const runId = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const startedAt = new Date();
const requestMetrics = new Map();
const pendingRefreshes = new Set();
const sseStats = {
  connectionAttempts: 0,
  connectedClients: 0,
  reconnects: 0,
  connectionErrors: 0,
  events: {},
};
const cleanupStats = {
  attempted: 0,
  cancelled: 0,
  failed: 0,
};
let rooms = [];
let sseClients = [];
let fatalError = null;

class ApiError extends Error {
  constructor(tag, status, body) {
    super(`${tag}: HTTP ${status} ${body}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

function integerEnv(name, fallback) {
  const value = Number.parseInt(process.env[name] ?? `${fallback}`, 10);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be an integer`);
  }
  return value;
}

function validateConfiguration() {
  if (!IS_LOCAL_TARGET && process.env.CONFIRM_LOAD_TEST !== 'ONGI_LOAD_TEST') {
    throw new Error('Remote load tests require CONFIRM_LOAD_TEST=ONGI_LOAD_TEST');
  }
  if (CONFIG.rooms < 1 || CONFIG.rooms > 40) {
    throw new Error('ROOMS must be between 1 and 40');
  }
  if (CONFIG.participantsPerRoom < 2 || CONFIG.participantsPerRoom > 10) {
    throw new Error('PARTICIPANTS_PER_ROOM must be between 2 and 10');
  }
  if (CONFIG.rooms * CONFIG.participantsPerRoom > 400) {
    throw new Error('This script refuses to create more than 400 participants');
  }
  if (CONFIG.setupConcurrency < 1 || CONFIG.setupConcurrency > 400) {
    throw new Error('SETUP_CONCURRENCY must be between 1 and 400');
  }
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

function increment(object, key) {
  object[key] = (object[key] ?? 0) + 1;
}

function recordMetric(tag, durationMs, failed) {
  const metric = requestMetrics.get(tag) ?? { count: 0, failures: 0, durationsMs: [] };
  metric.count += 1;
  metric.failures += failed ? 1 : 0;
  metric.durationsMs.push(durationMs);
  requestMetrics.set(tag, metric);
}

function mutationHeaders(body, cookie) {
  const headers = {
    Accept: 'application/json',
    Origin: CONFIG.origin,
    'X-OnGi-Client': 'web',
  };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (cookie) {
    headers.Cookie = cookie;
  }
  return headers;
}

async function apiRequest(tag, path, { method = 'GET', body, cookie } = {}) {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.requestTimeoutMs);
  try {
    const response = await fetch(`${CONFIG.targetUrl}${path}`, {
      method,
      headers: method === 'GET' || method === 'HEAD'
        ? { Accept: 'application/json', ...(cookie ? { Cookie: cookie } : {}) }
        : mutationHeaders(body, cookie),
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'error',
      signal: controller.signal,
    });
    const text = await response.text();
    recordMetric(tag, performance.now() - started, !response.ok);
    if (!response.ok) {
      throw new ApiError(tag, response.status, text.slice(0, 300));
    }
    return {
      data: text ? JSON.parse(text) : null,
      response,
    };
  } catch (error) {
    if (!(error instanceof ApiError)) {
      recordMetric(tag, performance.now() - started, true);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function extractCookie(response, cookieName) {
  const setCookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [response.headers.get('set-cookie')].filter(Boolean);
  for (const setCookie of setCookies) {
    const match = setCookie.match(new RegExp(`(?:^|,\\s*)${cookieName}=([^;,]+)`));
    if (match) {
      return `${cookieName}=${match[1]}`;
    }
  }
  throw new Error(`Missing ${cookieName} response cookie`);
}

async function mapConcurrent(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) {
        return;
      }
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  ));
  return results;
}

async function createRooms() {
  console.log(`Creating ${CONFIG.rooms} rooms...`);
  return mapConcurrent(
    Array.from({ length: CONFIG.rooms }, (_, index) => index),
    Math.min(CONFIG.setupConcurrency, CONFIG.rooms),
    async (roomIndex) => {
      const { data, response } = await apiRequest('room_create', '/api/rooms', {
        method: 'POST',
        body: { title: `부하테스트 ${runId.slice(11, 19)}-${roomIndex + 1}` },
      });
      return {
        index: roomIndex,
        roomId: data.roomId,
        roomCode: data.roomCode,
        hostCookie: extractCookie(response, 'ongi_host_session'),
        version: data.version,
        participants: [],
        current: null,
      };
    },
  );
}

async function joinParticipants() {
  const assignments = rooms.flatMap((room) => Array.from(
    { length: CONFIG.participantsPerRoom },
    (_, participantIndex) => ({ room, participantIndex }),
  ));
  console.log(`Joining ${assignments.length} participants over ${CONFIG.joinRampMs}ms...`);
  const joined = await Promise.all(assignments.map(async (assignment, index) => {
    const scheduledDelay = assignments.length <= 1
      ? 0
      : Math.floor((CONFIG.joinRampMs * index) / (assignments.length - 1));
    await delay(scheduledDelay);
    const { room, participantIndex } = assignment;
    const { data, response } = await apiRequest('participant_join', '/api/room-joins', {
      method: 'POST',
      body: {
        roomCode: room.roomCode,
        name: `테스트 ${participantIndex + 1}`,
      },
    });
    const participantCookie = extractCookie(response, 'ongi_participant_session');
    const cookie = participantIndex === 0
      ? `${room.hostCookie}; ${participantCookie}`
      : participantCookie;
    return {
      room,
      participantIndex,
      participantId: data.participant.id,
      cookie,
      questions: [],
    };
  }));
  for (const participant of joined) {
    participant.room.participants.push(participant);
  }
  for (const room of rooms) {
    room.participants.sort((left, right) => left.participantIndex - right.participantIndex);
  }
  return joined;
}

async function refreshForEvent(participant, eventType) {
  const started = performance.now();
  let failed = false;
  try {
    const { data: state } = await apiRequest('event_state', `/api/rooms/${participant.room.roomId}/state`, {
      cookie: participant.cookie,
    });
    const followUps = [];
    if (state.role === 'HOST' && state.status !== 'COMPLETED' && state.status !== 'SHARING') {
      followUps.push(apiRequest('event_participants', `/api/rooms/${participant.room.roomId}/participants`, {
        cookie: participant.cookie,
      }));
    }
    if (state.participantJoined
      && (state.status === 'WRITING' || state.status === 'LOCKED')
      && !state.responseCompleted) {
      followUps.push(
        apiRequest('event_questions', `/api/rooms/${participant.room.roomId}/questions`, {
          cookie: participant.cookie,
        }),
        apiRequest('event_responses', `/api/rooms/${participant.room.roomId}/responses/me`, {
          cookie: participant.cookie,
        }),
      );
    }
    if (state.status === 'SHARING') {
      followUps.push(apiRequest('event_current_sharing', `/api/rooms/${participant.room.roomId}/sharing/current`, {
        cookie: participant.cookie,
      }));
    }
    await Promise.all(followUps);
  } catch (error) {
    failed = true;
    console.error(`Event refresh failed (${eventType}):`, error.message);
  } finally {
    recordMetric('event_refresh_total', performance.now() - started, failed);
  }
}

function trackRefresh(promise) {
  pendingRefreshes.add(promise);
  promise.finally(() => pendingRefreshes.delete(promise));
}

function createSseClient(participant) {
  let stopped = false;
  let activeController = null;
  let hasConnected = false;
  let resolveFirstConnection;
  let rejectFirstConnection;
  const firstConnection = new Promise((resolveConnection, rejectConnection) => {
    resolveFirstConnection = resolveConnection;
    rejectFirstConnection = rejectConnection;
  });

  async function dispatchEvent(eventName) {
    if (!eventName) {
      return;
    }
    increment(sseStats.events, eventName);
    if (eventName === 'CONNECTED') {
      if (!hasConnected) {
        hasConnected = true;
        sseStats.connectedClients += 1;
        resolveFirstConnection();
      }
      return;
    }
    trackRefresh(refreshForEvent(participant, eventName));
  }

  async function consume(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let eventName = '';
    while (!stopped) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      while (buffer.includes('\n')) {
        const newline = buffer.indexOf('\n');
        const line = buffer.slice(0, newline).replace(/\r$/, '');
        buffer = buffer.slice(newline + 1);
        if (line === '') {
          await dispatchEvent(eventName);
          eventName = '';
        } else if (line.startsWith('event:')) {
          eventName = line.slice('event:'.length).trim();
        }
      }
    }
  }

  async function run() {
    while (!stopped) {
      sseStats.connectionAttempts += 1;
      if (hasConnected) {
        sseStats.reconnects += 1;
      }
      activeController = new AbortController();
      try {
        const response = await fetch(
          `${CONFIG.targetUrl}/api/rooms/${participant.room.roomId}/events`,
          {
            headers: {
              Accept: 'text/event-stream',
              Cookie: participant.cookie,
            },
            signal: activeController.signal,
          },
        );
        if (!response.ok || !response.body) {
          throw new Error(`SSE HTTP ${response.status}`);
        }
        await consume(response);
      } catch (error) {
        if (!stopped) {
          sseStats.connectionErrors += 1;
          if (!hasConnected && sseStats.connectionErrors > CONFIG.rooms * CONFIG.participantsPerRoom) {
            rejectFirstConnection(error);
          }
          await delay(CONFIG.sseReconnectDelayMs);
        }
      }
    }
  }

  const runPromise = run();
  return {
    waitUntilConnected: async () => {
      let timeout;
      try {
        await Promise.race([
          firstConnection,
          new Promise((_, reject) => {
            timeout = setTimeout(
              () => reject(new Error(`SSE connect timeout for participant ${participant.participantId}`)),
              CONFIG.sseConnectTimeoutMs,
            );
          }),
        ]);
      } finally {
        clearTimeout(timeout);
      }
    },
    stop: () => {
      stopped = true;
      activeController?.abort();
    },
    done: runPromise,
  };
}

async function openSseConnections(participants) {
  console.log(`Opening ${participants.length} SSE connections...`);
  sseClients = participants.map(createSseClient);
  await Promise.all(sseClients.map((client) => client.waitUntilConnected()));
  await delay(CONFIG.sseSettleMs);
}

async function saveAndCompleteAnswers(participants) {
  console.log('Loading questions...');
  await mapConcurrent(participants, CONFIG.setupConcurrency, async (participant) => {
    const { data } = await apiRequest('questions_initial', `/api/rooms/${participant.room.roomId}/questions`, {
      cookie: participant.cookie,
    });
    participant.questions = data.questions;
  });
  const questionCount = participants[0]?.questions.length ?? 0;
  for (let questionIndex = 0; questionIndex < questionCount; questionIndex += 1) {
    console.log(`Saving answer step ${questionIndex + 1}/${questionCount}...`);
    await mapConcurrent(participants, CONFIG.setupConcurrency, async (participant) => {
      const question = participant.questions[questionIndex];
      await apiRequest('response_save', `/api/rooms/${participant.room.roomId}/responses`, {
        method: 'PUT',
        cookie: participant.cookie,
        body: {
          answers: [{
            questionId: question.id,
            answer: `부하 테스트 답변 ${participant.participantIndex + 1}-${questionIndex + 1}`,
          }],
        },
      });
    });
    await delay(CONFIG.answerStepDelayMs);
  }
  console.log('Completing participant responses...');
  await mapConcurrent(participants, CONFIG.setupConcurrency, (participant) => apiRequest(
    'response_complete',
    `/api/rooms/${participant.room.roomId}/responses/complete`,
    { method: 'POST', cookie: participant.cookie },
  ));
  await drainRefreshes();
}

async function lockAndStartRooms() {
  console.log('Locking rooms...');
  await mapConcurrent(rooms, CONFIG.setupConcurrency, async (room) => {
    const { data: state } = await apiRequest('host_state_before_lock', `/api/rooms/${room.roomId}/state`, {
      cookie: room.hostCookie,
    });
    const { data: locked } = await apiRequest('room_lock', `/api/rooms/${room.roomId}/lock`, {
      method: 'POST',
      cookie: room.hostCookie,
      body: { expectedVersion: state.version },
    });
    room.version = locked.version;
  });
  await drainRefreshes();

  console.log('Starting sharing in every room...');
  await mapConcurrent(rooms, CONFIG.setupConcurrency, async (room) => {
    const { data } = await apiRequest('sharing_start', `/api/rooms/${room.roomId}/start-sharing`, {
      method: 'POST',
      cookie: room.hostCookie,
      body: { expectedVersion: room.version },
    });
    room.current = data;
  });
  await drainRefreshes();
}

async function findCurrentAuthors() {
  await Promise.all(rooms.map(async (room) => {
    const candidates = await Promise.all(room.participants.map(async (participant) => {
      const { data } = await apiRequest(
        'author_current_lookup',
        `/api/rooms/${room.roomId}/sharing/current`,
        { cookie: participant.cookie },
      );
      return { participant, current: data };
    }));
    const author = candidates.find(({ current }) => current.canReveal);
    if (!author) {
      throw new Error(`Current author not found for room ${room.index + 1}`);
    }
    room.author = author.participant;
    room.current = author.current;
  }));
}

async function runSharingRounds() {
  const totalRounds = CONFIG.participantsPerRoom;
  for (let round = 0; round < totalRounds; round += 1) {
    console.log(`Sharing round ${round + 1}/${totalRounds}: finding authors...`);
    await findCurrentAuthors();

    console.log(`Sharing round ${round + 1}/${totalRounds}: revealing...`);
    await Promise.all(rooms.map(async (room) => {
      const { data } = await apiRequest('sharing_reveal', `/api/rooms/${room.roomId}/sharing/reveal`, {
        method: 'POST',
        cookie: room.author.cookie,
      });
      room.current = data;
    }));
    await drainRefreshes();
    await delay(CONFIG.roundPauseMs);

    console.log(`Sharing round ${round + 1}/${totalRounds}: moving next...`);
    await Promise.all(rooms.map(async (room) => {
      const { data } = await apiRequest('sharing_next', `/api/rooms/${room.roomId}/next`, {
        method: 'POST',
        cookie: room.hostCookie,
        body: {
          expectedVersion: room.current.roomVersion,
          expectedRound: room.current.sequence,
        },
      });
      room.current = data;
    }));
    await drainRefreshes();
  }
}

async function completeRooms() {
  console.log('Completing rooms and deleting participant answers...');
  await Promise.all(rooms.map(async (room) => {
    const { data } = await apiRequest('room_complete', `/api/rooms/${room.roomId}/complete`, {
      method: 'POST',
      cookie: room.hostCookie,
      body: { expectedVersion: room.current.roomVersion },
    });
    room.completed = data.status === 'COMPLETED';
  }));
  await drainRefreshes();
}

async function cleanupIncompleteRooms() {
  const incompleteRooms = rooms.filter((room) => !room.completed);
  if (incompleteRooms.length === 0) {
    return;
  }

  console.log(`Cancelling ${incompleteRooms.length} incomplete test rooms...`);
  await Promise.all(incompleteRooms.map(async (room) => {
    cleanupStats.attempted += 1;
    try {
      const { data: state } = await apiRequest(
        'cleanup_state',
        `/api/rooms/${room.roomId}/state`,
        { cookie: room.hostCookie },
      );
      if (!['CREATED', 'WRITING', 'LOCKED'].includes(state.status)) {
        throw new Error(`Room ${room.index + 1} is not cancellable in ${state.status}`);
      }
      await apiRequest('cleanup_cancel', `/api/rooms/${room.roomId}/cancel`, {
        method: 'POST',
        cookie: room.hostCookie,
        body: { expectedVersion: state.version },
      });
      cleanupStats.cancelled += 1;
    } catch (error) {
      cleanupStats.failed += 1;
      console.error(`Cleanup failed for room ${room.index + 1}:`, error.message);
    }
  }));
}

async function drainRefreshes() {
  while (pendingRefreshes.size > 0) {
    await Promise.allSettled([...pendingRefreshes]);
  }
}

function percentile(values, percentileValue) {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.ceil((percentileValue / 100) * sorted.length) - 1,
  );
  return Number(sorted[Math.max(0, index)].toFixed(2));
}

function summarizeMetrics() {
  return Object.fromEntries([...requestMetrics.entries()].map(([tag, metric]) => [tag, {
    count: metric.count,
    failures: metric.failures,
    failureRate: Number((metric.failures / metric.count).toFixed(6)),
    p50Ms: percentile(metric.durationsMs, 50),
    p95Ms: percentile(metric.durationsMs, 95),
    p99Ms: percentile(metric.durationsMs, 99),
    maxMs: Number(Math.max(...metric.durationsMs).toFixed(2)),
  }]));
}

async function writeResult() {
  const metrics = summarizeMetrics();
  const allMetrics = [...requestMetrics.values()];
  const totalRequests = allMetrics.reduce((sum, metric) => sum + metric.count, 0);
  const totalFailures = allMetrics.reduce((sum, metric) => sum + metric.failures, 0);
  const eventRefresh = metrics.event_refresh_total ?? { p95Ms: 0, p99Ms: 0 };
  const result = {
    runId,
    startedAt: startedAt.toISOString(),
    completedAt: new Date().toISOString(),
    config: CONFIG,
    outcome: {
      passed: fatalError === null
        && totalFailures / Math.max(1, totalRequests) < 0.01
        && eventRefresh.p95Ms < 2_000
        && sseStats.connectedClients === CONFIG.rooms * CONFIG.participantsPerRoom,
      fatalError: fatalError?.stack ?? null,
      totalRequests,
      totalFailures,
      failureRate: Number((totalFailures / Math.max(1, totalRequests)).toFixed(6)),
      eventRefreshP95Ms: eventRefresh.p95Ms,
      eventRefreshP99Ms: eventRefresh.p99Ms,
      completedRooms: rooms.filter((room) => room.completed).length,
    },
    sse: sseStats,
    cleanup: cleanupStats,
    metrics,
  };
  const outputDirectory = resolve(CONFIG.outputDirectory);
  await mkdir(outputDirectory, { recursive: true });
  const outputPath = resolve(
    outputDirectory,
    `${runId}-${CONFIG.rooms}rooms-${CONFIG.rooms * CONFIG.participantsPerRoom}users.json`,
  );
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(`Load-test result: ${outputPath}`);
  console.log(JSON.stringify(result.outcome, null, 2));
}

async function main() {
  const totalParticipants = CONFIG.rooms * CONFIG.participantsPerRoom;
  console.log(JSON.stringify({
    target: CONFIG.targetUrl,
    rooms: CONFIG.rooms,
    participants: totalParticipants,
    joinRampMs: CONFIG.joinRampMs,
    soakMs: CONFIG.soakMs,
  }, null, 2));
  try {
    rooms = await createRooms();
    const participants = await joinParticipants();
    await openSseConnections(participants);
    await saveAndCompleteAnswers(participants);
    await lockAndStartRooms();
    if (CONFIG.soakMs > 0) {
      console.log(`Holding SSE connections for ${CONFIG.soakMs}ms...`);
      await delay(CONFIG.soakMs);
    }
    await runSharingRounds();
    await completeRooms();
    await delay(CONFIG.postTestHoldMs);
  } catch (error) {
    fatalError = error;
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (fatalError !== null) {
      await cleanupIncompleteRooms();
    }
    sseClients.forEach((client) => client.stop());
    await Promise.allSettled(sseClients.map((client) => client.done));
    await drainRefreshes();
    await writeResult();
  }
}

await main();
