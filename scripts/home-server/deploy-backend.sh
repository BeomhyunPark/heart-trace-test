#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
STATE_DIR="$PROJECT_DIR/.deployment/backend"
SOURCE_DIR="${ONGI_DEPLOY_SOURCE_DIR:-$PROJECT_DIR}"
ENV_FILE="$PROJECT_DIR/.env.home-server"
COMPOSE_FILE="$SOURCE_DIR/compose.home-server.yaml"
ROLLBACK_IMAGE="ongi-backend:home-rollback"

log() {
  printf '%s [backend-deploy] %s\n' "$(date --iso-8601=seconds)" "$*"
}

fail() {
  log "ERROR: $*"
  exit 1
}

mkdir -p "$STATE_DIR"
exec 9>"$STATE_DIR/deploy.lock"
if ! flock -n 9; then
  log "another deployment is already running; skipping"
  exit 0
fi

[[ -f "$ENV_FILE" ]] || fail "$ENV_FILE is missing"
[[ -f "$COMPOSE_FILE" ]] || fail "$COMPOSE_FILE is missing"
[[ -x "$SOURCE_DIR/backend/gradlew" ]] || fail "$SOURCE_DIR/backend/gradlew is missing or not executable"
command -v docker >/dev/null || fail "docker is not installed"

cd "$PROJECT_DIR"
COMPOSE=(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE")

if [[ "${ONGI_DEPLOY_RUN_TESTS:-true}" == "true" ]]; then
  log "running backend tests"
  "$SOURCE_DIR/backend/gradlew" --no-daemon -p "$SOURCE_DIR/backend" test
fi

previous_container="$("${COMPOSE[@]}" ps -q backend 2>/dev/null || true)"
previous_image=""
if [[ -n "$previous_container" ]]; then
  previous_image="$(docker inspect --format '{{.Image}}' "$previous_container")"
  docker image tag "$previous_image" "$ROLLBACK_IMAGE"
  log "saved rollback image $previous_image"
fi

log "building backend image"
"${COMPOSE[@]}" build backend

log "replacing backend container"
if "${COMPOSE[@]}" up -d --no-deps --force-recreate --wait --wait-timeout "${ONGI_DEPLOY_HEALTH_TIMEOUT:-120}" backend; then
  deployed_container="$("${COMPOSE[@]}" ps -q backend)"
  deployed_image="$(docker inspect --format '{{.Image}}' "$deployed_container")"
  log "deployment healthy: $deployed_image"
  exit 0
fi

if [[ -z "$previous_image" ]]; then
  fail "new backend did not become healthy and no rollback image exists"
fi

log "new backend did not become healthy; restoring $previous_image"
docker image tag "$previous_image" ongi-backend:home
if "${COMPOSE[@]}" up -d --no-deps --force-recreate --wait --wait-timeout "${ONGI_DEPLOY_HEALTH_TIMEOUT:-120}" backend; then
  fail "deployment failed; previous backend was restored successfully"
fi

fail "deployment and automatic rollback both failed; inspect compose logs"
