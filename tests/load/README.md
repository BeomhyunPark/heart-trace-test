# 익명 나눔 부하 테스트

`scripts/load/anonymous-sharing-load.mjs`는 실제 API를 사용해 Room 생성, 참가자 입장, 질문별 중간 저장, 작성 완료, SSE 연결, 공개, 다음 이야기, Room 종료까지 수행합니다. 테스트 답변과 Participant는 정상 종료 시 Backend에서 즉시 삭제됩니다.

부하 생성기는 Surface가 아닌 외부 PC에서 실행합니다. 운영 중인 실제 모임이 없을 때만 실행하고, 가능하면 별도 test hostname과 별도 PostgreSQL volume을 사용합니다.

## 안전 장치

- 원격 주소는 `CONFIRM_LOAD_TEST=ONGI_LOAD_TEST`가 없으면 실행되지 않습니다.
- Room당 참가자는 2~10명만 허용합니다.
- 기본 최대 40개 Room, 총 400명까지만 허용합니다.
- 400명을 초과하는 한계 테스트는 `CONFIRM_LARGE_LOAD_TEST=ONGI_LARGE_LOAD_TEST`를 추가해야 하며, 최대 100개 Room과 총 1,000명까지 허용합니다.
- 결과 JSON에는 session cookie, 이름, 답변 내용, Room Code를 기록하지 않습니다.
- 나눔 시작 전 오류가 발생하면 생성한 테스트 Room을 Host session으로 자동 취소하고 cleanup 결과도 JSON에 기록합니다.

## 실행 순서

PowerShell:

```powershell
$env:TARGET_URL = "https://ongi-api.greengroove.app"
$env:CONFIRM_LOAD_TEST = "ONGI_LOAD_TEST"
$env:PARTICIPANTS_PER_ROOM = "10"

# Smoke: 1 Room, 10명
$env:ROOMS = "1"
$env:JOIN_RAMP_MS = "5000"
npm run load:anonymous-sharing

# 100명
$env:ROOMS = "10"
$env:JOIN_RAMP_MS = "30000"
npm run load:anonymous-sharing

# 200명
$env:ROOMS = "20"
$env:JOIN_RAMP_MS = "45000"
npm run load:anonymous-sharing

# 300명 + Backend SSE 10분 timeout 이후 재연결 확인
$env:ROOMS = "30"
$env:JOIN_RAMP_MS = "60000"
$env:SOAK_MS = "720000"
$env:SETUP_CONCURRENCY = "300"
npm run load:anonymous-sharing
```

macOS/zsh:

```bash
TARGET_URL=https://ongi-api.greengroove.app \
CONFIRM_LOAD_TEST=ONGI_LOAD_TEST \
ROOMS=1 \
PARTICIPANTS_PER_ROOM=10 \
JOIN_RAMP_MS=5000 \
npm run load:anonymous-sharing
```

각 실행 결과는 `tests/load/results/*.json`에 남습니다. 기본 합격 기준은 전체 요청 실패율 1% 미만, SSE 전원 연결, event-triggered refresh p95 2초 미만입니다. 다음 단계는 이전 단계가 통과하고 Backend/PostgreSQL container restart나 OOM이 없을 때만 진행합니다.

Surface에서는 부하 테스트 시작 직전에 별도 PowerShell 창에서 Docker 지표 수집기를 실행합니다. `DurationSeconds`는 외부 테스트 예상 시간보다 길게 잡습니다.

```powershell
powershell -ExecutionPolicy Bypass -File scripts/load/capture-docker-stats.ps1 `
  -DurationSeconds 900 `
  -IntervalSeconds 2 `
  -ContainerNamePattern "ongi-*"
```

부하 결과와 서버 지표 모두 `tests/load/results/`에 JSON으로 남고 Git에는 커밋되지 않습니다. 실행 중 상태와 로그도 함께 확인할 수 있습니다.

```powershell
docker stats
docker compose --env-file .env.home-server -f compose.home-server.yaml ps
docker compose --env-file .env.home-server -f compose.home-server.yaml logs -f backend
```
