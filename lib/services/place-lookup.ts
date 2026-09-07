import { geocodeAddress } from "@/lib/services/geocoding";

/**
 * Ortsnamen bzw. PLZ aus der Suche in Koordinaten uebersetzen – Grundlage
 * der Umkreissuche.
 *
 * Nominatim erlaubt nur eine Anfrage pro Sekunde, deshalb liegt vor dem
 * Dienst ein prozessweiter Cache: dieselbe Eingabe wird nur einmal
 * nachgeschlagen. Ein Fehlschlag wird ebenfalls gemerkt (als `null`), damit
 * ein Tippfehler nicht bei jedem Seitenaufruf erneut anfragt.
 */
export interface PlaceCenter {
  latitude: number;
  longitude: number;
}

const cache = new Map<string, PlaceCenter | null>();
const MAX_ENTRIES = 500;

/** Nur Eingaben, die wie ein Ort oder eine PLZ aussehen, gehen an den Dienst. */
function normalize(input: string): string | null {
  const value = input.trim().replace(/\s+/g, " ");
  if (value.length < 2 || value.length > 80) return null;
  // Ziffernfolgen sind nur als deutsche PLZ sinnvoll.
  if (/^\d+$/.test(value) && value.length !== 5) return null;
  return value;
}

export async function lookupPlaceCenter(input: string): Promise<PlaceCenter | null> {
  const value = normalize(input);
  if (!value) return null;

  const key = value.toLowerCase();
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const isZip = /^\d{5}$/.test(value);
  const result = await geocodeAddress(
    isZip ? { zipCode: value, country: "Deutschland" } : { city: value, country: "Deutschland" },
  );

  const center = result ? { latitude: result.latitude, longitude: result.longitude } : null;

  // Einfache Groessenbegrenzung: aeltesten Eintrag verwerfen.
  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, center);
  return center;
}
