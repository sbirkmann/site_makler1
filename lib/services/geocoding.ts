/**
 * Geocoding ueber Nominatim (OpenStreetMap) – frei nutzbar, ohne API-Key.
 *
 * Die Nutzungsbedingungen von Nominatim verlangen zwingend:
 *   1. einen aussagekraeftigen User-Agent mit Kontaktmoeglichkeit,
 *   2. maximal eine Anfrage pro Sekunde,
 *   3. Zwischenspeicherung der Ergebnisse (wir schreiben sie in die DB).
 * Beides ist hier fest verdrahtet, damit kein Aufrufer es vergessen kann.
 *
 * Ueber GEOCODER_URL laesst sich eine eigene Nominatim-Instanz einhaengen,
 * falls das Importvolumen den oeffentlichen Dienst ueberfordert.
 */

const ENDPOINT = process.env.GEOCODER_URL ?? "https://nominatim.openstreetmap.org/search";
const CONTACT = process.env.GEOCODER_CONTACT ?? "kontakt@wohnwert-immobilien.de";
const USER_AGENT = process.env.GEOCODER_USER_AGENT ?? `WohnWertImmobilien/1.0 (${CONTACT})`;
const MIN_INTERVAL_MS = Number(process.env.GEOCODER_MIN_INTERVAL ?? "1100");
const TIMEOUT_MS = Number(process.env.GEOCODER_TIMEOUT ?? "10000");
const RETRY_BASE_MS = Number(process.env.GEOCODER_RETRY_DELAY ?? "2000");

export interface GeocodeAddress {
  street?: string | null;
  zipCode?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  /** Normalisierte Adresse, wie Nominatim sie zurueckmeldet. */
  displayName: string;
}

/**
 * Serialisiert alle Anfragen dieses Prozesses und haelt den Mindestabstand
 * ein. Jeder Aufruf haengt sich hinten an die Kette – dadurch kann auch ein
 * `Promise.all()` ueber viele Objekte das Limit nicht verletzen.
 */
let queue: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

function throttle<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequestAt = Date.now();
    return task();
  });
  // Fehler duerfen die Kette nicht unterbrechen, sonst blockiert der Worker.
  queue = run.catch(() => undefined);
  return run;
}

/**
 * Platzhalter, die der OpenImmo-Import setzt, wenn das Feld im Export fehlt.
 * Sie duerfen nicht in die Suche gehen: "Unbekannt" etwa liefert bei
 * Nominatim einen Strassennamen in Berlin.
 */
const PLACEHOLDER_CITIES = new Set(["unbekannt", "unknown", "n.n.", "nn", "-"]);
const PLACEHOLDER_ZIPS = new Set(["00000", "0", "-"]);

/** Baut die Adresszeile; ohne Ort oder PLZ ist eine Suche sinnlos. */
export function formatAddressQuery(address: GeocodeAddress): string | null {
  const rawCity = address.city?.trim();
  const rawZip = address.zipCode?.trim();

  const city = rawCity && !PLACEHOLDER_CITIES.has(rawCity.toLowerCase()) ? rawCity : undefined;
  const usableZip = rawZip && !PLACEHOLDER_ZIPS.has(rawZip) ? rawZip : undefined;
  if (!city && !usableZip) return null;

  return [
    address.street?.trim() || undefined,
    [usableZip, city].filter(Boolean).join(" ") || undefined,
    address.region?.trim() || undefined,
    address.country?.trim() || "Deutschland",
  ]
    .filter(Boolean)
    .join(", ");
}

async function request(query: string): Promise<GeocodeResult | null> {
  const url = new URL(ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "0");
  // Ergebnisse auf Deutschland eingrenzen – verhindert Treffer auf
  // gleichnamige Orte in anderen Laendern.
  url.searchParams.set("countrycodes", "de");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "de", Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      const error = new Error(`Nominatim antwortete mit ${response.status}`);
      // 403/429 und 5xx sind voruebergehend (Rate-Limit bzw. Stoerung) und
      // rechtfertigen einen zweiten Versuch; 400er sonst nicht.
      (error as Error & { retryable?: boolean }).retryable =
        response.status === 403 || response.status === 429 || response.status >= 500;
      throw error;
    }
    const results = (await response.json()) as Array<{
      lat?: string;
      lon?: string;
      display_name?: string;
    }>;
    const hit = Array.isArray(results) ? results[0] : undefined;
    if (!hit?.lat || !hit?.lon) return null;

    const latitude = Number(hit.lat);
    const longitude = Number(hit.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return { latitude, longitude, displayName: hit.display_name ?? query };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Ermittelt Koordinaten zu einer Adresse. Schlaegt die genaue Adresse fehl,
 * wird auf PLZ/Ort zurueckgefallen – eine Karte mit der richtigen Stadt ist
 * besser als gar keine Karte.
 *
 * Wirft nicht: Geocoding ist eine Zusatzinformation und darf weder das
 * Speichern im Backend noch einen Import scheitern lassen.
 */
export async function geocodeAddress(address: GeocodeAddress): Promise<GeocodeResult | null> {
  const precise = formatAddressQuery(address);
  if (!precise) return null;

  // Von genau nach grob: volle Adresse, dann ohne Strasse, zuletzt nur
  // PLZ/Ort. Die letzte Stufe laesst auch `region` weg – dort steht oft ein
  // Stadtteil statt eines Bundeslands, was die Suche sonst leerlaufen laesst.
  const attempts: string[] = [precise];
  for (const variant of [
    { ...address, street: null },
    { ...address, region: null },
    { ...address, street: null, region: null },
  ]) {
    const query = formatAddressQuery(variant);
    if (query && !attempts.includes(query)) attempts.push(query);
  }

  for (const query of attempts) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await throttle(() => request(query));
        if (result) return result;
        break; // Kein Treffer ist ein gueltiges Ergebnis – naechste Variante.
      } catch (error) {
        const retryable =
          error instanceof Error && (error as Error & { retryable?: boolean }).retryable === true;
        console.warn(
          `Geocoding fehlgeschlagen für "${query}"${retryable ? ` (Versuch ${attempt + 1}/3)` : ""}:`,
          error instanceof Error ? error.message : error,
        );
        if (!retryable || attempt === 2) break;
        // Linear wachsende Wartezeit, bevor der naechste Versuch startet.
        await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_MS * (attempt + 1)));
      }
    }
  }
  return null;
}

/** Vergleicht die adressrelevanten Felder zweier Datensaetze. */
export function addressChanged(a: GeocodeAddress, b: GeocodeAddress): boolean {
  const norm = (v?: string | null) => (v ?? "").trim().toLowerCase();
  return (
    norm(a.street) !== norm(b.street) ||
    norm(a.zipCode) !== norm(b.zipCode) ||
    norm(a.city) !== norm(b.city) ||
    norm(a.region) !== norm(b.region)
  );
}
