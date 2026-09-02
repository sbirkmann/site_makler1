/**
 * Basis-URL robust bestimmen: Ein fehlender oder unvollstaendiger Wert
 * (z. B. weil die Variable im Build-Container nicht gesetzt ist) darf den
 * Build nicht abbrechen – `new URL()` in den Metadaten wuerde sonst werfen.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  const withProtocol = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return "http://localhost:3000";
  }
}

/**
 * Zentrale Marken- und Standortdaten.
 * Fuer ein neues Maklerprojekt reicht es, diese Datei anzupassen.
 */
export const site = {
  name: "WohnWert Immobilien",
  shortName: "WohnWert",
  claim: "Immobilien mit Haltung",
  legalName: "WohnWert Immobilien GmbH",
  description:
    "Persoenliche Immobilienberatung fuer Koeln, Bonn und das Rheinland. Verkauf, Vermietung und kostenlose Immobilienbewertung mit echter Marktkenntnis.",
  url: resolveSiteUrl(),
  locale: "de_DE",
  founded: 2009,
  address: {
    street: "Musterstraße 12",
    zipCode: "50667",
    city: "Koeln",
    country: "Deutschland",
  },
  // Telefonnummern stammen aus dem offiziellen Beispiel-Rufnummernblock
  // der Bundesnetzagentur (0..2312 1-0 bis -9) und koennen niemanden erreichen.
  contact: {
    phone: "+49 221 23125 100",
    phoneHref: "tel:+4922123125100",
    email: "willkommen@wohnwert-immobilien.example",
    whatsapp: "+49 221 23125 109",
  },
  openingHours: [
    { days: "Montag – Donnerstag", hours: "09:00 – 18:30 Uhr" },
    { days: "Freitag", hours: "09:00 – 17:00 Uhr" },
    { days: "Samstag", hours: "nach Vereinbarung" },
    { days: "Sonntag", hours: "geschlossen" },
  ],
  regions: ["Koeln", "Bonn", "Duesseldorf", "Leverkusen", "Bergisch Gladbach", "Rhein-Sieg-Kreis"],
  stats: {
    yearsExperience: 16,
    propertiesSold: 940,
    happyClients: 1180,
    averageRating: 4.9,
  },
  social: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    facebook: "https://facebook.com/",
  },
} as const;

export const isDemoSite = true;
