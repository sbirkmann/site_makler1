# syntax=docker/dockerfile:1

###############################################################################
# 1) Abhaengigkeiten installieren
###############################################################################
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json ./
COPY prisma ./prisma
# postinstall ruft "prisma generate" auf – dafuer muss prisma/ vorhanden sein
RUN npm ci

###############################################################################
# 2) Anwendung bauen
###############################################################################
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Zur Bauzeit wird keine echte Datenbank benoetigt; Next.js prerendert
# Seiten mit Datenzugriff erst zur Laufzeit (siehe next.config.ts).
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN npx prisma generate
RUN npm run build

###############################################################################
# 3) Laufzeit-Abbild
###############################################################################
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Standalone-Ausgabe enthaelt nur die tatsaechlich benoetigten Module
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma-CLI und Seed benoetigen den vollstaendigen Abhaengigkeitsbaum.
# Ein selektives Kopieren einzelner Pakete laesst transitive Abhaengigkeiten
# zurueck und bricht zur Laufzeit (MODULE_NOT_FOUND).
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
