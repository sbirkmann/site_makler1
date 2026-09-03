#!/usr/bin/env bash
set -euo pipefail

# deploy/coolify-trigger.sh
# Usage: set COOLIFY_HOST, COOLIFY_TOKEN and optionally APP_ID or APP_NAME and run.
# This script attempts to register the repo as an app in Coolify (if APP_ID
# not given) and triggers a deploy. It does not set volumes or secrets — it
# prints recommended curl snippets to create secrets/volumes which you must run
# with a valid token or create in the Coolify UI.

COOLIFY_HOST=${COOLIFY_HOST:-}
COOLIFY_TOKEN=${COOLIFY_TOKEN:-}
APP_ID=${APP_ID:-}
APP_NAME=${APP_NAME:-makler-app}
REPO_URL=${REPO_URL:-}
COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.coolify.yml}
BRANCH=${BRANCH:-main}

if [[ -z "$COOLIFY_HOST" || -z "$COOLIFY_TOKEN" ]]; then
  echo "ERROR: Set COOLIFY_HOST and COOLIFY_TOKEN environment variables."
  exit 2
fi

if [[ -z "$REPO_URL" ]]; then
  echo "ERROR: Set REPO_URL (git repo url of this project)."
  exit 2
fi

api() {
  local method=$1; shift
  local path=$1; shift
  local data=${1:-}
  if [[ -n "$data" ]]; then
    curl -sS -X "$method" "$COOLIFY_HOST$path" \
      -H "Authorization: Bearer $COOLIFY_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data"
  else
    curl -sS -X "$method" "$COOLIFY_HOST$path" -H "Authorization: Bearer $COOLIFY_TOKEN"
  fi
}

echo "Using Coolify host: $COOLIFY_HOST"

if [[ -z "$APP_ID" ]]; then
  echo "Registering app '$APP_NAME' with repo $REPO_URL and compose file $COMPOSE_FILE..."
  resp=$(api POST "/api/apps" "{\"name\":\"$APP_NAME\",\"repoUrl\":\"$REPO_URL\",\"composeFile\":\"$COMPOSE_FILE\"}") || {
    echo "Failed to register app:"; echo "$resp"; exit 3
  }
  # extract id from resp using jq if available, otherwise attempt naive parse
  if command -v jq >/dev/null 2>&1; then
    APP_ID=$(echo "$resp" | jq -r '.id // ._id // .data.id // empty')
  else
    APP_ID=$(echo "$resp" | sed -n 's/.*"id"[: ]*"\([^"]\+\)".*/\1/p' | head -n1 || true)
  fi
  if [[ -z "$APP_ID" ]]; then
    echo "Could not determine APP_ID from response:"; echo "$resp"; exit 4
  fi
  echo "Registered app id: $APP_ID"
else
  echo "Using provided APP_ID: $APP_ID"
fi

echo "Triggering deploy for app $APP_ID (branch: $BRANCH)..."
deploy_resp=$(api POST "/api/apps/$APP_ID/deploy" "{\"branch\":\"$BRANCH\"}") || { echo "Deploy trigger failed:"; echo "$deploy_resp"; exit 5; }
echo "Deploy response:"; echo "$deploy_resp"

cat <<'INFO'

Next steps (secrets & volumes):

- Create persistent volumes in Coolify UI named: postgres, ftp-imports, uploads.
- Create the required environment variables / secrets in Coolify for the app:
  POSTGRES_PASSWORD, ADMIN_PASSWORD, ADMIN_SESSION_SECRET,
  SFTPGO_ADMIN_USERNAME, SFTPGO_ADMIN_PASSWORD, BLOG_API_KEY (optional)

If you prefer to create secrets via API, here are example curl snippets (run
them with COOLIFY_HOST and COOLIFY_TOKEN set). Adjust endpoint if your Coolify
instance exposes a different API path for secrets/variables.

Create a secret (example; may vary by Coolify version):
curl -X POST "$COOLIFY_HOST/api/secrets" \
  -H "Authorization: Bearer $COOLIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"POSTGRES_PASSWORD","value":"your-db-pass","type":"env"}'

Create volumes: use the Coolify UI to add persistent volumes named
`postgres`, `ftp-imports`, `uploads` and attach them to services.

INFO

echo "Done. Check the Coolify UI/logs to confirm service startup and that the
openimmo-importer and sftpgo services run correctly."

exit 0
