#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
STATE_DIR="$PROJECT_DIR/.deployment/backend"
MARKER="# ongi-backend-autodeploy"
CRON_ENTRY="* * * * * $SCRIPT_DIR/watch-backend.sh --once >> $STATE_DIR/watch.log 2>&1 $MARKER"

mkdir -p "$STATE_DIR"
temp_crontab="$(mktemp)"
trap 'rm -f "$temp_crontab"' EXIT

crontab -l 2>/dev/null | grep -Fv "$MARKER" >"$temp_crontab" || true

if [[ "${1:-}" == "--remove" ]]; then
  crontab "$temp_crontab"
  printf 'Removed Ongi backend automatic deployment from the user crontab.\n'
  exit 0
elif [[ $# -gt 0 ]]; then
  printf 'usage: %s [--remove]\n' "$0" >&2
  exit 2
fi

printf '%s\n' "$CRON_ENTRY" >>"$temp_crontab"
crontab "$temp_crontab"

# Fetch immediately and establish the tracked remote revision. If this checkout
# is behind, the current remote backend is deployed without touching local work.
"$SCRIPT_DIR/watch-backend.sh" --once >>"$STATE_DIR/watch.log" 2>&1

printf 'Installed Ongi backend automatic deployment in the user crontab.\n'
printf 'Log: %s/watch.log\n' "$STATE_DIR"
