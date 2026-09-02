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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
