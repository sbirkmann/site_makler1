Deploy auf Coolify — Schritt-für-Schritt

Ziel: Die App inkl. SFTP (SFTPGo), dem OpenImmo-Importer und persistenter Upload/FTP-Storage in Coolify deployen.

Voraussetzungen
- Coolify-Zugang mit Berechtigung, eine App aus einem Docker-Compose-Repo zu erstellen.
- Repository in GitHub/GitLab (Coolify kann per Repo-URL deployen) oder ein ZIP-Upload.

Wichtige Dateien im Repo
- `docker-compose.coolify.yml` — Compose-Definition für Coolify (inkl. `sftpgo`, `postgres`, `openimmo-importer`, `app`).
- `coolify_deploy.dev.yml` — Vorlage / Hinweise für Secrets und Volumes in Coolify.
- `scripts/import-openimmo.ts` — Importer läuft als Worker und unterstützt `WORKER_CONCURRENCY` + `LOOP_DELAY`.

Empfohlene Secret-/Env-Namen (in Coolify anlegen)
- `POSTGRES_PASSWORD` (wird in `DATABASE_URL` benutzt)
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (lange, zufällige Zeichenkette)
- `SFTPGO_ADMIN_USERNAME`
- `SFTPGO_ADMIN_PASSWORD`
- optional: `BLOG_API_KEY`

Volumes (persistent) anlegen in Coolify
- `postgres`  → mapped zu `/var/lib/postgresql/data` in DB
- `ftp-imports` → mapped zu `/imports` in `sftpgo` und Importer
- `uploads` → mapped zu `/app/public/uploads` in `app` (persistente Bilder)

Ports / Netzwerk
- Externe Ingress / Ports: Coolify verwaltet Ingress; intern benutzt `sftpgo` Port 2121 (FTP) und HTTP-API Port 8080 (für SFTPGo API). Wenn du FTP extern erreichbar machen willst, konfiguriere Coolify entsprechend (Firewall/Portforward). Passive-Port-Range in Compose ist 50000-50010.

So richtest du die App in Coolify ein
1) Repository auswählen: Wähle dieses Git-Repository als Docker-Compose-Quelle.
2) Compose-Datei: Gib `docker-compose.coolify.yml` als Compose-File an.
3) Volumes: Erstelle die drei persistenten Volumes (`postgres`, `ftp-imports`, `uploads`) und mappe sie zu den in der Compose-Datei referenzierten Volumes.
4) Secrets/Env: Lege die oben empfohlenen Secrets in Coolify an und setze sie als Environment-Variablen für die `app` und `sftpgo` Services. Achte auf `DATABASE_URL` in `app` (Coolify ersetzt `${POSTGRES_PASSWORD}`).
5) Worker-Konfiguration: In der `app`-Service-Umgebung (oder `openimmo-importer`) setze `WORKER_CONCURRENCY` (z. B. `3` oder `4`) und `LOOP_DELAY` (ms). Der Importer startet automatisch (`pnpm import:openimmo`).
6) Deploy starten: Starte die App in Coolify.

Wichtig: Migrations und Start
- `package.json` enthält `start`-Script, das `prisma migrate deploy` ausführt und evtl. Seeds (`scripts/seed-if-empty.mjs`). Coolify führt den Container-Start; die Migrationen laufen beim Containerstart, sofern Coolify das `app`-Startscript nutzt.

Lokales Testen (vor Deploy)
```bash
export IMPORT_DIR=./storage/ftp-imports
export UPLOAD_DIR=./public/uploads
export WORKER_CONCURRENCY=3
export LOOP_DELAY=20000
pnpm install
pnpm dev # oder pnpm start nach Build/Migrate
# Oder nur Importer lokal testen:
pnpm import:openimmo
```

Deployment-Hinweis
- Ich kann das Repo hier nicht automatisch bei Coolify deployen, da dafür ein Coolify-Account/API-Token und Zugriff auf dein Coolify-Projekt nötig sind.
- Wenn du mir einen Coolify-API-Token geben willst (nicht empfohlen in Chat), kann ich optional curl-Beispiele erzeugen, die die App über die Coolify-API starten. Sicherer: folge den obigen Schritten im Coolify-UI.

Fehlerbehandlung & Monitoring
- Logs: Prüfe `openimmo-importer` Logs für Fehler beim Entpacken/DB-Operationen.
- DB-Locks: Importer benutzt atomisches `rename()` zum Claimen von Dateien; bei Problemen prüfe Dateirechte/Volume-Mounts.

Wenn du möchtest
- Lege ich eine kurze `docs/DEPLOY_COOLIFY_QUICK.md` mit Bildschriftschritten und genauen Feldern an. Soll ich das anlegen?
- Oder möchtest du, dass ich versuche, das Deployment per Coolify-API zu triggern (du müsstest ein API-Token bereitstellen)?
