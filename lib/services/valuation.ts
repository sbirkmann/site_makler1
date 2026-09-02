import "server-only";
import type { PropertyCondition, PropertyType } from "@prisma/client";

/**
 * Abstraktion fuer eine spaetere externe Bewertungs-API.
 *
 * Aktuell ist bewusst KEIN externer Dienst angebunden. Sobald ein Anbieter
 * feststeht, genuegt es, eine weitere Implementierung von `ValuationProvider`
 * zu ergaenzen und sie in `valuationService` zu registrieren
 * (gesteuert ueber VALUATION_API_URL / VALUATION_API_KEY).
 */
export interface ValuationInputData {
  propertyType: PropertyType;
  zipCode: string;
  city: string;
  livingArea?: number;
  plotArea?: number;
  rooms?: number;
  yearBuilt?: number;
  condition?: PropertyCondition;
}

export interface ValuationEstimate {
  min: number;
  max: number;
  currency: string;
  provider: string;
  confidence: "niedrig" | "mittel" | "hoch";
}

export interface ValuationProvider {
  readonly name: string;
  isAvailable(): boolean;
  estimate(input: ValuationInputData): Promise<ValuationEstimate | null>;
}

/**
 * Platzhalter-Provider: liefert bewusst keine Zahl, da eine seriose Bewertung
 * ohne Marktdaten nicht moeglich ist. Die Anfrage wird persistiert und
 * anschliessend persoenlich bearbeitet.
 */
class ManualValuationProvider implements ValuationProvider {
  readonly name = "manuell";
  isAvailable() {
    return true;
  }
  async estimate(): Promise<ValuationEstimate | null> {
    return null;
  }
}

/**
 * Beispielhafte HTTP-Implementierung – wird nur aktiv, wenn beide
 * Umgebungsvariablen gesetzt sind.
 */
class HttpValuationProvider implements ValuationProvider {
  readonly name = "external-api";

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  isAvailable() {
    return Boolean(this.baseUrl && this.apiKey);
  }

  async estimate(input: ValuationInputData): Promise<ValuationEstimate | null> {
    try {
      const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/valuations`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(input),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as Partial<ValuationEstimate>;
      if (typeof data.min !== "number" || typeof data.max !== "number") return null;
      return {
        min: data.min,
        max: data.max,
        currency: data.currency ?? "EUR",
        provider: this.name,
        confidence: data.confidence ?? "mittel",
      };
    } catch {
      // Ein Ausfall der externen API darf die Anfrage nie blockieren.
      return null;
    }
  }
}

function resolveProvider(): ValuationProvider {
  const url = process.env.VALUATION_API_URL;
  const key = process.env.VALUATION_API_KEY;
  if (url && key) return new HttpValuationProvider(url, key);
  return new ManualValuationProvider();
}

export const valuationService = {
  get provider() {
    return resolveProvider();
  },
  async estimate(input: ValuationInputData): Promise<ValuationEstimate | null> {
    const provider = resolveProvider();
    if (!provider.isAvailable()) return null;
    return provider.estimate(input);
  },
};
