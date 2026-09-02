#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
STATE_DIR="$PROJECT_DIR/.deployment/backend"
RELEASES_DIR="$STATE_DIR/releases"
OBSERVED_REMOTE_FILE="$STATE_DIR/observed.remote"
OBSERVED_ENV_FILE="$STATE_DIR/observed-env.sha256"
DEPLOYED_REMOTE_FILE="$STATE_DIR/deployed.remote"
REMOTE="${ONGI_DEPLOY_REMOTE:-origin}"
BRANCH="${ONGI_DEPLOY_BRANCH:-master}"
POLL_SECONDS="${ONGI_DEPLOY_POLL_SECONDS:-3}"
DEBOUNCE_SECONDS="${ONGI_DEPLOY_DEBOUNCE_SECONDS:-5}"
RUN_ONCE=false
TEMP_RELEASE=""

if [[ "${1:-}" == "--once" ]]; then
  RUN_ONCE=true
elif [[ $# -gt 0 ]]; then
  printf 'usage: %s [--once]\n' "$0" >&2
  exit 2
fi

log() {
  printf '%s [backend-watch] %s\n' "$(date --iso-8601=seconds)" "$*"
}

cleanup() {
  if [[ -n "$TEMP_RELEASE" && -d "$TEMP_RELEASE" ]]; then
    rm -rf -- "$TEMP_RELEASE"
  fi
}
trap cleanup EXIT

env_fingerprint() {
  if [[ -f "$PROJECT_DIR/.env.home-server" ]]; then
    sha256sum "$PROJECT_DIR/.env.home-server" | awk '{print $1}'
  else
    printf 'missing\n'
  fi
}

fetch_remote() {
  git -C "$PROJECT_DIR" fetch --quiet "$REMOTE" \
    "+refs/heads/$BRANCH:refs/remotes/$REMOTE/$BRANCH"
}

prepare_release() {
  local revision="$1"
  local release_dir="$RELEASES_DIR/$revision"

  if [[ ! -d "$release_dir" ]]; then
    TEMP_RELEASE="$(mktemp -d "$RELEASES_DIR/.${revision}.XXXXXX")"
    git -C "$PROJECT_DIR" archive "$revision" -- backend compose.home-server.yaml \
      | tar -x -C "$TEMP_RELEASE"
    mv -- "$TEMP_RELEASE" "$release_dir"
    TEMP_RELEASE=""
  fi

  printf '%s\n' "$release_dir"
}

remote_changes_backend() {
  local before="$1"
  local after="$2"

  if [[ -z "$before" ]] || ! git -C "$PROJECT_DIR" cat-file -e "$before^{commit}" 2>/dev/null; then
    return 0
  fi

  ! git -C "$PROJECT_DIR" diff --quiet "$before" "$after" -- backend compose.home-server.yaml
}

mkdir -p "$STATE_DIR" "$RELEASES_DIR"
exec 8>"$STATE_DIR/watch.lock"
if ! flock -n 8; then
  log "another watcher is already running; skipping"
  exit 0
fi

while true; do
  if ! fetch_remote; then
    log "ERROR: failed to fetch $REMOTE/$BRANCH; will retry"
    if [[ "$RUN_ONCE" == "true" ]]; then
      exit 1
    fi
    sleep "$POLL_SECONDS"
    continue
  fi

  remote_ref="refs/remotes/$REMOTE/$BRANCH"
  remote_revision="$(git -C "$PROJECT_DIR" rev-parse "$remote_ref")"
  env_revision="$(env_fingerprint)"
  observed_remote="$(cat "$OBSERVED_REMOTE_FILE" 2>/dev/null || git -C "$PROJECT_DIR" rev-parse HEAD)"
  observed_env="$(cat "$OBSERVED_ENV_FILE" 2>/dev/null || printf '%s' "$env_revision")"

  remote_changed=false
  env_changed=false
  [[ "$remote_revision" != "$observed_remote" ]] && remote_changed=true
  [[ "$env_revision" != "$observed_env" ]] && env_changed=true

  if [[ "$remote_changed" == "false" && "$env_changed" == "false" ]]; then
    if [[ ! -f "$OBSERVED_REMOTE_FILE" ]]; then
      printf '%s\n' "$remote_revision" >"$OBSERVED_REMOTE_FILE"
      printf '%s\n' "$env_revision" >"$OBSERVED_ENV_FILE"
      log "baseline recorded at ${remote_revision:0:12}; watching $REMOTE/$BRANCH"
    fi
    if [[ "$RUN_ONCE" == "true" ]]; then
      exit 0
    fi
    sleep "$POLL_SECONDS"
    continue
  fi

  if [[ "$remote_changed" == "true" ]]; then
    log "remote change detected: ${observed_remote:0:12} -> ${remote_revision:0:12}"
  else
    log "home-server environment change detected"
  fi
  sleep "$DEBOUNCE_SECONDS"

  # Record one attempt per revision/configuration. A later push or env edit
  # triggers another attempt without retrying a broken release forever.
  printf '%s\n' "$remote_revision" >"$OBSERVED_REMOTE_FILE"
  printf '%s\n' "$env_revision" >"$OBSERVED_ENV_FILE"

  if [[ "$env_changed" == "false" ]] && ! remote_changes_backend "$observed_remote" "$remote_revision"; then
    log "remote change has no backend files; deployment skipped"
  else
    release_dir="$(prepare_release "$remote_revision")"
    if ONGI_DEPLOY_SOURCE_DIR="$release_dir" "$SCRIPT_DIR/deploy-backend.sh"; then
      printf '%s\n' "$remote_revision" >"$DEPLOYED_REMOTE_FILE"
      log "automatic deployment completed at ${remote_revision:0:12}"
    else
      log "automatic deployment failed for ${remote_revision:0:12}; waiting for the next change"
    fi
  fi

  if [[ "$RUN_ONCE" == "true" ]]; then
    exit 0
  fi
done
