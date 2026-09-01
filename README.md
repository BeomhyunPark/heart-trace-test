# OnGi

교회 공동체에서 사용하는 모바일 중심의 인터랙티브 콘텐츠 웹앱입니다. 기존 콘텐츠는 브라우저에서 독립적으로 동작하고, 소그룹 익명 자기소개 나눔은 Spring Boot API와 PostgreSQL을 사용합니다.

## 구조

```text
/
├── src/                 React + TypeScript frontend
├── tests/               Vitest frontend tests
├── backend/             Java 21 + Spring Boot API
├── compose.yaml         local PostgreSQL
└── docs/                architecture documents
```

운영 환경에서는 `ongi.greengroove.app`의 GitHub Pages frontend와 `api.ongi.greengroove.app`의 API를 분리합니다.

## 로컬 실행

요구 사항:

- Node.js 24
- Java 21
- Docker

환경변수 예시는 `.env.example`에 있습니다. 로컬 기본값으로 실행할 때는 별도 secret이 필요하지 않습니다.

```bash
docker compose up -d postgres

cd backend
./gradlew bootRun

# 별도 터미널, 저장소 루트
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Health check: `http://localhost:8080/actuator/health`
- PostgreSQL: `localhost:5432/ongi`

Flyway migration은 Backend 시작 시 자동 실행됩니다. 운영 DB에서 migration 파일을 수정하지 말고 새 migration을 추가해야 합니다.

## 주요 환경변수

| 변수 | 설명 | 로컬 기본값 |
|---|---|---|
| `DB_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/ongi` |
| `DB_USERNAME` | DB 사용자 | `ongi` |
| `DB_PASSWORD` | DB 비밀번호 | 로컬 개발 비밀번호 |
| `ONGI_ALLOWED_ORIGINS` | credential CORS 허용 origin | `http://localhost:5173` |
| `ONGI_SECURE_COOKIE` | HTTPS 전용 cookie | `false` |
| `ONGI_ROOM_ACTIVE_LIFETIME` | 활성 Room 만료 | `12h` |
| `ONGI_TOMBSTONE_RETENTION` | 종료 상태/session hash 유지 | `24h` |
| `ONGI_JOIN_ATTEMPTS_PER_MINUTE` | IP별 join 시도 제한 | `30` |
| `ONGI_JOIN_ATTEMPTS_PER_CODE_PER_MINUTE` | 같은 IP와 code 조합 제한 | `15` |
| `ONGI_TRUST_CLOUDFLARE_CONNECTING_IP` | Tunnel이 보장한 실제 client IP로 rate limit | `false` |
| `VITE_API_BASE_URL` | Frontend API origin | 개발 시 `http://localhost:8080` |

운영에서는 `DB_PASSWORD`를 repository나 image에 넣지 않고 배포 플랫폼 secret으로 주입합니다.

## API 개요

```text
POST /api/rooms
POST /api/room-joins

GET  /api/rooms/{roomId}/state
POST /api/rooms/{roomId}/lock
POST /api/rooms/{roomId}/unlock
POST /api/rooms/{roomId}/cancel
GET  /api/rooms/{roomId}/participants
GET  /api/rooms/{roomId}/participants/me

GET  /api/rooms/{roomId}/questions
GET  /api/rooms/{roomId}/responses/me
PUT  /api/rooms/{roomId}/responses
POST /api/rooms/{roomId}/responses/complete

POST /api/rooms/{roomId}/start-sharing
GET  /api/rooms/{roomId}/sharing/current
POST /api/rooms/{roomId}/sharing/reveal
POST /api/rooms/{roomId}/next
POST /api/rooms/{roomId}/complete

GET  /api/rooms/{roomId}/events
```

Room Code와 public Room ID는 credential이 아닙니다. 최초 join을 제외한 모든 Room API는 해당 Room에 속한 HttpOnly session cookie를 검증합니다. 변경 요청에는 `X-OnGi-Client: web` header가 필요합니다.

Host와 Participant token은 256-bit random 값이며 cookie에만 저장됩니다. DB에는 SHA-256 hash만 저장합니다. frontend 저장소에는 Room ID만 남습니다.

## SSE

`GET /api/rooms/{roomId}/events`는 다음 trigger를 보냅니다.

- `PARTICIPANT_JOINED`
- `PARTICIPANT_PROGRESS_CHANGED`
- `ROOM_ACCESS_CHANGED`
- `ROOM_CANCELLED`
- `SHARING_STARTED`
- `ROUND_CHANGED`
- `PROFILE_REVEALED`
- `ROOM_COMPLETED`

이벤트에 이름이나 답변은 포함하지 않습니다. client는 이벤트를 받으면 REST API에서 현재 상태를 다시 조회합니다. 모바일 background 전환이나 플랫폼 timeout으로 연결이 종료되면 `EventSource`가 재연결합니다.

## 개인정보 삭제

Host가 Room을 종료하면 같은 DB transaction에서 다음 정보를 즉시 hard delete합니다.

- 모든 답변
- 참여자 이름과 Participant record
- 나눔 순서
- Participant와 session의 연결

완료 화면 복구와 code 재사용 방지를 위해 `COMPLETED` Room과 익명화된 session hash만 기본 24시간 유지한 뒤 삭제합니다. 종료되지 않은 Room은 생성 12시간 후 전체 삭제합니다.

나눔 시작 전 Host가 `방 없애기`를 확인하면 Room, session, 참여자와 작성 중 답변을 같은 transaction에서 즉시 삭제합니다. 이 취소 동작에는 tombstone을 남기지 않습니다.

DB backup에는 backup 보존 기간 동안 과거 block이 남을 수 있으므로 운영 backup retention과 접근 권한을 별도로 관리해야 합니다.

## 테스트

```bash
npm test
npm run build

cd backend
./gradlew test
```

Backend integration test는 Testcontainers PostgreSQL을 사용하므로 Docker가 실행 중이어야 합니다.

## Surface Pro 홈서버 배포

기존 Cloudflare Tunnel이 Windows에서 실행 중이라는 전제의 구성입니다. PostgreSQL은 Docker 내부에서만 접근할 수 있고, Backend는 Surface 자신의 `127.0.0.1:8080`에만 공개됩니다. 공유기 포트포워딩은 사용하지 않습니다.

Surface에서 repository를 받은 뒤 PowerShell로 실행합니다.

```powershell
Copy-Item .env.home-server.example .env.home-server
notepad .env.home-server
```

`ONGI_POSTGRES_PASSWORD`를 충분히 긴 임의의 값으로 바꾼 다음 실행합니다.

```powershell
docker compose --env-file .env.home-server -f compose.home-server.yaml up -d --build
docker compose --env-file .env.home-server -f compose.home-server.yaml ps
Invoke-RestMethod http://localhost:8080/actuator/health/readiness
```

Cloudflare Tunnel public hostname은 다음과 같이 연결합니다.

```text
Hostname: api.ongi.greengroove.app
Service:  http://localhost:8080
```

`cloudflared` 자체도 별도 Docker container 안에서 실행 중이라면 `localhost` 대신 다음 주소를 사용합니다.

```text
http://host.docker.internal:8080
```

외부 연결을 확인합니다.

```powershell
Invoke-RestMethod https://api.ongi.greengroove.app/actuator/health/readiness
```

운영 명령:

```powershell
# 로그 확인
docker compose --env-file .env.home-server -f compose.home-server.yaml logs -f backend

# 새 코드를 받은 뒤 재배포
docker compose --env-file .env.home-server -f compose.home-server.yaml up -d --build

# 컨테이너만 중지 (DB volume 유지)
docker compose --env-file .env.home-server -f compose.home-server.yaml down
```

`down -v`는 PostgreSQL volume까지 삭제하므로 사용하지 않습니다. Docker Desktop은 Windows 로그인 시 자동 시작하도록 설정하고 Surface의 절전 및 최대 절전 모드를 꺼야 합니다. `ONGI_TRUST_CLOUDFLARE_CONNECTING_IP=true`는 Backend가 Tunnel을 통해서만 공개되는 이 구성에서만 사용합니다.

Frontend GitHub Pages build에는 repository variable을 설정합니다.

```text
VITE_API_BASE_URL=https://api.ongi.greengroove.app
```

## Railway 배포

MVP는 Singapore region의 단일 Backend instance와 같은 project의 PostgreSQL을 사용합니다.

1. Railway project에 PostgreSQL service를 추가합니다.
2. Backend service의 source root를 `/backend`로 지정합니다. `Dockerfile`이 자동 감지됩니다.
3. Backend와 PostgreSQL을 같은 Singapore region에 둡니다.
4. Backend에서 DB reference variables로 다음 값을 설정합니다.
   - `DB_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}`
   - `DB_USERNAME=${{Postgres.PGUSER}}`
   - `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
5. `ONGI_ALLOWED_ORIGINS=https://ongi.greengroove.app`
6. `ONGI_SECURE_COOKIE=true`
7. Health check path를 `/actuator/health/readiness`로 설정합니다.
8. Serverless/App Sleeping을 끄고 replica를 1개로 유지합니다.
9. custom domain `api.ongi.greengroove.app`을 연결합니다.
10. GitHub repository variable `VITE_API_BASE_URL=https://api.ongi.greengroove.app`을 설정합니다.

현재 SSE subscriber registry는 단일 process 메모리에 있습니다. Backend를 둘 이상의 replica로 늘리기 전에는 PostgreSQL LISTEN/NOTIFY 같은 cross-instance event 전달 수단을 추가해야 합니다.

상세 설계는 `docs/ongi-sharing-mvp.md`를 참고하세요.
