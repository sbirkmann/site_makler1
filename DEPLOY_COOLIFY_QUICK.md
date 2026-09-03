Quick Deploy auf Coolify — UI + API-Snippets

Kurz: Diese Anleitung führt durch das UI und bietet optionale `curl`-Skripte, die du mit einem Coolify-API-Token ausführen kannst. Ich kann das Deployment nicht selbst anstoßen ohne deinen Coolify-Token.

1) UI-Schritte (empfohlen)
- Repository hinzufügen: Neues App-Deployment → Git-Repository auswählen (dieses Projekt).
- Compose-Datei: `docker-compose.coolify.yml` auswählen.
- Volumes erstellen:
  - `postgres` (persistent)
  - `ftp-imports` (persistent)
  - `uploads` (persistent)
- Secrets / Environment:
  - `POSTGRES_PASSWORD` (z. B. strong-password)
  - `ADMIN_PASSWORD` (Admin-Pw)
  - `ADMIN_SESSION_SECRET` (lange Random-String)
  - `SFTPGO_ADMIN_USERNAME`
  - `SFTPGO_ADMIN_PASSWORD`
  - optional: `BLOG_API_KEY`
- Environment-Mapping prüfen: `docker-compose.coolify.yml` referenziert `SFTPGO_API_URL`, `WORKER_CONCURRENCY`, etc. Stelle sicher, dass `app` und `openimmo-importer` diese Umgebungsvariablen übernehmen.
- Deploy starten.

2) Optional: Coolify API — vorbereiten
- Erzeuge in Coolify einen API-Token (im UI unter Account/API). Notiere `COOLIFY_TOKEN`.
- Finde die Deploy-Endpoint-URL in deiner Coolify-Instanz (z. B. `https://coolify.example/api/apps`).

3) Beispiel: App erstellen / deploy triggern (cURL)
Hinweis: Die genauen API-Pfade hängen von deiner Coolify-Version/Host ab. Ersetze `COOLIFY_HOST`, `COOLIFY_TOKEN`, `REPO_URL`, `COMPOSE_FILE`.

- Create / register app (Beispiel — Passe Felder an deine Coolify-API an):
```bash
COOLIFY_HOST=https://coolify.example
COOLIFY_TOKEN=ey...your_token...
REPO_URL=https://github.com/your/repo.git
COMPOSE_FILE=docker-compose.coolify.yml

curl -s -X POST "$COOLIFY_HOST/api/apps" \
  -H "Authorization: Bearer $COOLIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"makler-app\",\"repoUrl\":\"$REPO_URL\",\"composeFile\":\"$COMPOSE_FILE\"}" \
  | jq -r '.'
```

- Trigger a deploy (wenn App bereits existiert):
```bash
# Beispiel: POST /api/apps/:id/deploy — die exakte Route variiert, prüfe deine Coolify-API-Doku
APP_ID=your_app_id

curl -s -X POST "$COOLIFY_HOST/api/apps/$APP_ID/deploy" \
  -H "Authorization: Bearer $COOLIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"branch":"main"}' \
  | jq -r '.'
```

4) Wichtige Prüfungen nach Deploy
- Prüfe Logs der Services (`app`, `sftpgo`, `openimmo-importer`).
- Stelle sicher, dass `ftp-imports` und `uploads` Volumes tatsächlich per Coolify persistent sind. Schreib-/Lese-Rechte prüfen.
- Überprüfe, ob SFTP-Benutzer via Admin angelegt werden können (`/admin/schnittstellen`) und ob `openimmo-importer` ZIPs verarbeitet.

5) Hilfe: optionales Skript
Ich kann ein kleines `deploy/coolify-trigger.sh`-Skript anlegen, das die obigen `curl`-Aufrufe kapselt. Soll ich das anlegen? (ja/nein)

Limitierung
- Ich kann das Deployment nicht selbst ausführen ohne deinen Coolify-API-Token und App-Zugriff. Das ist aus Sicherheitsgründen so implementiert.

Wenn du bereit bist
- Sag "Skript anlegen" und ich erstelle das `deploy/coolify-trigger.sh` mit Platzhaltern, oder sag "UI starten" und ich führe dich Schritt-für-Schritt durch das Coolify-UI.