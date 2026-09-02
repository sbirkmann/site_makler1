#!/bin/sh
set -eu

# ---------------------------------------------------------------------------
# Startskript des Containers:
#   1) auf die Datenbank warten
#   2) Migrationen anwenden
#   3) Demo-Daten einspielen, falls die Datenbank noch leer ist
#   4) Anwendung starten
# ---------------------------------------------------------------------------

if [ -z "${DATABASE_URL:-}" ]; then
  echo "FEHLER: DATABASE_URL ist nicht gesetzt." >&2
  exit 1
fi

echo "→ Warte auf die Datenbank …"
i=0
until node -e "
  const { PrismaClient } = require('@prisma/client');
  const p = new PrismaClient();
  p.\$queryRaw\`SELECT 1\`.then(() => process.exit(0)).catch(() => process.exit(1)).finally(() => p.\$disconnect());
" 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "FEHLER: Datenbank nach 60 Sekunden nicht erreichbar." >&2
    exit 1
  fi
  sleep 2
done
echo "→ Datenbank erreichbar."

echo "→ Migrationen werden angewendet …"
npx prisma migrate deploy

if [ "${SEED_ON_START:-true}" = "true" ]; then
  # Rueckgabewert 10 bedeutet: Datenbank ist leer und braucht Demo-Daten.
  set +e
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    p.property.count()
      .then((n) => {
        if (n > 0) { console.log('→ Bereits ' + n + ' Objekte vorhanden – Seed übersprungen.'); process.exit(0); }
        process.exit(10);
      })
      .catch((e) => { console.error('→ Prüfung fehlgeschlagen: ' + e.message); process.exit(1); })
      .finally(() => p.\$disconnect());
  "
  rc=$?
  set -e
  if [ "$rc" -eq 10 ]; then
    echo "→ Datenbank ist leer, Demo-Daten werden eingespielt …"
    npx tsx prisma/seed.ts
  elif [ "$rc" -ne 0 ]; then
    echo "FEHLER: Seed-Prüfung fehlgeschlagen." >&2
    exit 1
  fi
fi

echo "→ Anwendung wird gestartet."
exec "$@"
