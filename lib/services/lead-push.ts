import "server-only";
import { prisma } from "@/lib/db";

type PushPayload = Record<string, unknown>;

/**
 * Liefert neue Anfragen an aktivierte CRM-Endpunkte. Die konkrete Ziel-URL und
 * der API-Schlüssel werden im Admin gepflegt; dadurch bleiben Anbieterwechsel
 * ohne Code-Deployment möglich. Fehler blockieren nie die Anfrage des Kunden.
 */
export async function pushLeadToConfiguredCrms(kind: string, payload: PushPayload) {
  const providers = await prisma.leadPushProvider.findMany({ where: { enabled: true, endpoint: { not: null } } });
  await Promise.allSettled(
    providers.map(async (provider) => {
      const response = await fetch(provider.endpoint!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}`, "X-API-Key": provider.apiKey } : {}),
        },
        body: JSON.stringify({ source: "website", type: kind, ...payload }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(`${provider.provider}: HTTP ${response.status}`);
    }),
  );
}
