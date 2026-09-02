import type { MarketingType, PropertyType } from "@prisma/client";
import type { PropertyQuery, PropertySort } from "@/lib/repositories/properties";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const validTypes: PropertyType[] = [
  "HAUS",
  "WOHNUNG",
  "MEHRFAMILIENHAUS",
  "GRUNDSTUECK",
  "GEWERBE",
];

const validSorts: PropertySort[] = ["neueste", "preis-auf", "preis-ab", "flaeche"];

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.trim() ? v.trim() : undefined;
}

function all(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : value.split(",");
  return arr.map((v) => v.trim()).filter(Boolean);
}

function num(value: string | string[] | undefined): number | undefined {
  const v = first(value);
  if (!v) return undefined;
  const n = Number(v.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/** URL-Parameter → typisierte Repository-Query. */
export function parsePropertySearchParams(params: RawSearchParams): PropertyQuery {
  const marketingRaw = first(params.marketing)?.toUpperCase();
  const marketingType: MarketingType | undefined =
    marketingRaw === "KAUF" || marketingRaw === "MIETE" ? marketingRaw : undefined;

  const propertyType = all(params.typ)
    .map((t) => t.toUpperCase())
    .filter((t): t is PropertyType => validTypes.includes(t as PropertyType));

  const sortRaw = first(params.sort) as PropertySort | undefined;
  const sort = sortRaw && validSorts.includes(sortRaw) ? sortRaw : "neueste";

  return {
    marketingType,
    propertyType: propertyType.length ? propertyType : undefined,
    city: first(params.ort),
    q: first(params.q),
    minPrice: num(params.preis_min),
    maxPrice: num(params.preis_max),
    minRooms: num(params.zimmer),
    minArea: num(params.flaeche),
    sort,
    page: num(params.seite) ?? 1,
    perPage: 9,
  };
}

/** Baut eine URL fuer /immobilien mit veraenderten Parametern. */
export function buildPropertyHref(
  current: RawSearchParams,
  changes: Record<string, string | string[] | number | undefined>,
): string {
  const sp = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    if (key in changes) continue;
    for (const v of all(value)) sp.append(key, v);
  }

  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) continue;
    if (Array.isArray(value)) {
      for (const v of value) sp.append(key, v);
    } else {
      sp.set(key, String(value));
    }
  }

  // Seite zuruecksetzen, sobald sich ein Filter aendert
  if (!("seite" in changes)) sp.delete("seite");

  const qs = sp.toString();
  return qs ? `/immobilien?${qs}` : "/immobilien";
}

export function countActiveFilters(params: RawSearchParams): number {
  const keys = ["marketing", "typ", "ort", "q", "preis_min", "preis_max", "zimmer", "flaeche"];
  return keys.reduce((acc, key) => acc + (all(params[key]).length > 0 ? 1 : 0), 0);
}
