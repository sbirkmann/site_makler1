import type {
  EnergyCertificateType,
  EnergyEfficiencyClass,
  HeatingType,
  LeadSource,
  MarketingType,
  PropertyCondition,
  PropertyStatus,
  PropertyType,
  RequestStatus,
  SellingIntent,
} from "@prisma/client";

export const propertyTypeLabels: Record<PropertyType, string> = {
  HAUS: "Haus",
  WOHNUNG: "Wohnung",
  MEHRFAMILIENHAUS: "Mehrfamilienhaus",
  GRUNDSTUECK: "Grundstück",
  GEWERBE: "Gewerbeimmobilie",
};

export const propertyTypePlural: Record<PropertyType, string> = {
  HAUS: "Häuser",
  WOHNUNG: "Wohnungen",
  MEHRFAMILIENHAUS: "Mehrfamilienhäuser",
  GRUNDSTUECK: "Grundstücke",
  GEWERBE: "Gewerbeimmobilien",
};

export const marketingTypeLabels: Record<MarketingType, string> = {
  KAUF: "Kauf",
  MIETE: "Miete",
};

export const statusLabels: Record<PropertyStatus, string> = {
  VERFUEGBAR: "Verfügbar",
  RESERVIERT: "Reserviert",
  VERKAUFT: "Verkauft",
  VERMIETET: "Vermietet",
  IN_VORBEREITUNG: "In Vorbereitung",
};

export const conditionLabels: Record<PropertyCondition, string> = {
  NEUWERTIG: "Neuwertig",
  SANIERT: "Saniert",
  GEPFLEGT: "Gepflegt",
  RENOVIERUNGSBEDUERFTIG: "Renovierungsbedürftig",
  ABRISSOBJEKT: "Abrissobjekt",
};

export const heatingLabels: Record<HeatingType, string> = {
  GAS: "Gasheizung",
  OEL: "Ölheizung",
  FERNWAERME: "Fernwärme",
  WAERMEPUMPE: "Wärmepumpe",
  PELLET: "Pelletheizung",
  SOLAR: "Solarthermie",
  BLOCKHEIZKRAFTWERK: "Blockheizkraftwerk",
  ELEKTRO: "Elektroheizung",
};

export const energyCertificateLabels: Record<EnergyCertificateType, string> = {
  VERBRAUCHSAUSWEIS: "Verbrauchsausweis",
  BEDARFSAUSWEIS: "Bedarfsausweis",
  NICHT_ERFORDERLICH: "Nicht erforderlich",
};

export const energyClassLabels: Record<EnergyEfficiencyClass, string> = {
  A_PLUS: "A+",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  H: "H",
};

export const sellingIntentLabels: Record<SellingIntent, string> = {
  BALD_VERKAUFEN: "Ich plane, bald zu verkaufen",
  INFORMIEREN: "Ich informiere mich zunächst",
  PROFESSIONELLE_BEWERTUNG: "Ich benötige eine professionelle Bewertung",
  KONKRETES_OBJEKT: "Ich habe bereits ein konkretes Vorhaben",
};

export const requestStatusLabels: Record<RequestStatus, string> = {
  NEU: "Neu",
  IN_BEARBEITUNG: "In Bearbeitung",
  KONTAKTIERT: "Kontaktiert",
  ABGESCHLOSSEN: "Abgeschlossen",
};

export const leadSourceLabels: Record<LeadSource, string> = {
  OBJEKTANFRAGE: "Objektanfrage",
  VERKAUFSFUNNEL: "Verkaufsfunnel",
  BEWERTUNGSFUNNEL: "Bewertungsfunnel",
  KONTAKTFORMULAR: "Kontaktformular",
  SUCHPROFIL: "Suchprofil",
};

/** Zeitlicher Rahmen eines Suchprofils. */
export const searchTimeframeLabels: Record<string, string> = {
  SOFORT: "Sofort – ich kann kurzfristig zugreifen",
  DREI_MONATE: "In den nächsten 3 Monaten",
  SECHS_MONATE: "In den nächsten 6 Monaten",
  JAHR: "Innerhalb eines Jahres",
  UNBESTIMMT: "Noch offen – ich schaue mich um",
};

/** Finanzierungsstand eines Suchprofils. */
export const searchFinancingLabels: Record<string, string> = {
  GESICHERT: "Finanzierung steht bzw. Kauf aus Eigenmitteln",
  IN_KLAERUNG: "Finanzierung ist in Klärung",
  OFFEN: "Finanzierung noch offen",
  BERATUNG: "Ich wünsche eine Finanzierungsberatung",
};

/** Farbzuordnung fuer Status-Badges. */
export const statusTone: Record<PropertyStatus, "success" | "accent" | "neutral" | "muted"> = {
  VERFUEGBAR: "success",
  RESERVIERT: "accent",
  VERKAUFT: "neutral",
  VERMIETET: "neutral",
  IN_VORBEREITUNG: "muted",
};

export const requestStatusTone: Record<RequestStatus, "success" | "accent" | "neutral" | "muted"> = {
  NEU: "accent",
  IN_BEARBEITUNG: "muted",
  KONTAKTIERT: "neutral",
  ABGESCHLOSSEN: "success",
};
