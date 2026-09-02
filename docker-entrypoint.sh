#!/bin/sh
set -e

# Migrationen anwenden. Schlaegt das fehl, startet die Anwendung nicht –
# das ist gewollt, damit kein Container mit veraltetem Schema laeuft.
echo "→ Datenbankmigrationen werden angewendet …"
npx prisma migrate deploy

# Demo-Daten nur einspielen, wenn die Datenbank noch leer ist.
if [ "${SEED_ON_START:-true}" = "true" ]; then
  COUNT=$(npx prisma db execute --stdin <<'SQL' 2>/dev/null && echo ok || echo fail
SELECT 1;
SQL
)
  echo "→ Prüfe, ob Demo-Daten benötigt werden …"
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    p.property.count()
      .then(async (n) => {
        if (n > 0) { console.log('→ Datenbank enthält bereits ' + n + ' Objekte – Seed übersprungen.'); process.exit(0); }
        console.log('→ Datenbank ist leer, Demo-Daten werden eingespielt …');
        process.exit(10);
      })
      .catch((e) => { console.error('Prüfung fehlgeschlagen:', e.message); process.exit(1); })
      .finally(() => p.\$disconnect());
  " || if [ $? -eq 10 ]; then npx tsx prisma/seed.ts; fi
fi

echo "→ Anwendung wird gestartet."
exec "$@"
