export interface NavItem {
  label: string;
  href: string;
  description?: string;
  /** Optionales Aufklapp-Menue mit gruppierten Unterpunkten. */
  groups?: NavGroup[];
  /** Hervorgehobener Hinweis am Fuss des Aufklapp-Menues. */
  teaser?: { title: string; text: string; href: string };
}

export interface NavGroup {
  title: string;
  items: { label: string; href: string }[];
}

export const mainNav: NavItem[] = [
  {
    label: "Immobilie finden",
    href: "/immobilien",
    description: "Aktuelle Angebote im Rheinland",
    groups: [
      {
        title: "Kaufen",
        items: [
          { label: "Wohnung", href: "/immobilien?marketing=kauf&typ=WOHNUNG" },
          { label: "Haus", href: "/immobilien?marketing=kauf&typ=HAUS" },
          { label: "Kapitalanlage", href: "/immobilien?marketing=kauf&typ=MEHRFAMILIENHAUS" },
          { label: "Grundstück", href: "/immobilien?marketing=kauf&typ=GRUNDSTUECK" },
          { label: "Gewerbe", href: "/immobilien?marketing=kauf&typ=GEWERBE" },
        ],
      },
      {
        title: "Mieten",
        items: [
          { label: "Wohnung", href: "/immobilien?marketing=miete&typ=WOHNUNG" },
          { label: "Haus", href: "/immobilien?marketing=miete&typ=HAUS" },
          { label: "Gewerbe", href: "/immobilien?marketing=miete&typ=GEWERBE" },
        ],
      },
      {
        title: "Überblick",
        items: [{ label: "Alle Immobilienangebote", href: "/immobilien" }],
      },
    ],
    teaser: {
      title: "Suchprofil hinterlegen",
      text: "Passende Objekte erfahren Sie von uns, bevor sie öffentlich vermarktet werden.",
      href: "/kontakt?anliegen=suchprofil",
    },
  },
  {
    label: "Für Eigentümer",
    href: "/immobilie-verkaufen",
    description: "In fünf Minuten zur Einschätzung",
    groups: [
      {
        title: "Verkaufen",
        items: [
          { label: "Immobilie verkaufen", href: "/immobilie-verkaufen" },
          { label: "Ablauf des Verkaufs", href: "/ratgeber/immobilie-verkaufen-ablauf" },
          { label: "Benötigte Unterlagen", href: "/ratgeber/unterlagen-immobilienverkauf" },
        ],
      },
      {
        title: "Bewerten",
        items: [
          { label: "Kostenlose Bewertung", href: "/immobilienbewertung" },
          { label: "Wie ein Wert entsteht", href: "/ratgeber/was-ist-meine-immobilie-wert" },
          { label: "Energieausweis verstehen", href: "/ratgeber/energieausweis-verstehen" },
        ],
      },
      {
        title: "Besondere Situationen",
        items: [
          { label: "Immobilie geerbt", href: "/ratgeber/immobilie-geerbt-was-tun" },
          { label: "Maklerprovision erklärt", href: "/ratgeber/maklerprovision-erklaert" },
        ],
      },
    ],
    teaser: {
      title: "Kostenlose Ersteinschätzung",
      text: "In fünf Minuten beantwortet – Rückmeldung innerhalb eines Werktages.",
      href: "/immobilienbewertung",
    },
  },
  { label: "Über uns", href: "/ueber-uns", description: "Team, Werte und Arbeitsweise" },
  { label: "Ratgeber", href: "/ratgeber", description: "Wissen für Eigentümer und Käufer" },
  { label: "Kontakt", href: "/kontakt", description: "Persönlich erreichbar" },
];

export const footerNav = {
  leistungen: {
    title: "Leistungen",
    items: [
      { label: "Immobilien kaufen", href: "/immobilien?marketing=kauf" },
      { label: "Immobilien mieten", href: "/immobilien?marketing=miete" },
      { label: "Immobilie verkaufen", href: "/immobilie-verkaufen" },
      { label: "Immobilienbewertung", href: "/immobilienbewertung" },
      { label: "Kundenbewertungen", href: "/bewertungen" },
    ],
  },
  unternehmen: {
    title: "Unternehmen",
    items: [
      { label: "Über uns", href: "/ueber-uns" },
      { label: "Team", href: "/ueber-uns#team" },
      { label: "Ratgeber", href: "/ratgeber" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  rechtliches: {
    title: "Rechtliches",
    items: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "Widerrufsbelehrung", href: "/widerruf" },
    ],
  },
} as const;
