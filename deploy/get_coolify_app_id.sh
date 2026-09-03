#!/usr/bin/env bash
set -euo pipefail

# deploy/get_coolify_app_id.sh
# Usage:
#   export COOLIFY_HOST=http://88.99.140.47:8000
#   export COOLIFY_TOKEN=ey...your_token...
#   REPO_URL="https://github.com/your/repo.git" ./deploy/get_coolify_app_id.sh
#   or
#   APP_NAME="makler-app" ./deploy/get_coolify_app_id.sh

COOLIFY_HOST=${COOLIFY_HOST:-}
COOLIFY_TOKEN=${COOLIFY_TOKEN:-}
REPO_URL=${REPO_URL:-}
APP_NAME=${APP_NAME:-}

if [[ -z "$COOLIFY_HOST" || -z "$COOLIFY_TOKEN" ]]; then
  echo "ERROR: Set COOLIFY_HOST and COOLIFY_TOKEN environment variables." >&2
  exit 2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required. Install jq and retry." >&2
  exit 3
fi

echo "Querying Coolify apps at $COOLIFY_HOST..."
resp=$(curl -sS -H "Authorization: Bearer $COOLIFY_TOKEN" "$COOLIFY_HOST/api/apps")

if [[ -n "$REPO_URL" ]]; then
  echo "Searching for apps with repo matching: $REPO_URL"
  echo "$resp" | jq -r --arg repo "$REPO_URL" '.[] | select((.repoUrl // .repository // "") | test($repo)) | {id: .id, name: .name, repo: (.repoUrl // .repository // "") }'
  exit 0
fi

if [[ -n "$APP_NAME" ]]; then
  echo "Searching for apps named: $APP_NAME"
  echo "$resp" | jq -r --arg name "$APP_NAME" '.[] | select(.name == $name) | {id: .id, name: .name, repo: (.repoUrl // .repository // "") }'
  exit 0
fi

echo "No filter provided — listing apps (id, name, repo):"
echo "$resp" | jq -r '.[] | {id: .id, name: .name, repo: (.repoUrl // .repository // "") }'

exit 0
