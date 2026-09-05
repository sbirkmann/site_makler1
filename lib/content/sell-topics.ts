/**
 * Unterseiten von "Immobilie verkaufen". Jede Seite ist individuell
 * aufgebaut (app/(marketing)/immobilie-verkaufen/<slug>/page.tsx);
 * diese Liste speist Navigation, Themenuebersicht, Unter-Navigation
 * und Sitemap.
 */
export interface SellTopic {
  slug: string;
  href: string;
  label: string;
  title: string;
  teaser: string;
  /** Frueherer Ratgeber-Slug – wird per Redirect auf die neue Seite geleitet. */
  legacySlug: string;
}

const base = "/immobilie-verkaufen";

export const sellTopics: SellTopic[] = [
  {
    slug: "ablauf",
    href: `${base}/ablauf`,
    label: "Ablauf des Verkaufs",
    title: "Der Verkauf in neun Schritten",
    teaser:
      "Von der ersten Entscheidung bis zur Schlüsselübergabe – was wann passiert und wo Verkäufe ins Stocken geraten.",
    legacySlug: "immobilie-verkaufen-ablauf",
  },
  {
    slug: "unterlagen",
    href: `${base}/unterlagen`,
    label: "Benötigte Unterlagen",
    title: "Unterlagen für den Verkauf",
    teaser:
      "Welche Dokumente Sie brauchen, wo Sie sie bekommen, was sie kosten und wie lange die Beschaffung dauert.",
    legacySlug: "unterlagen-immobilienverkauf",
  },
  {
    slug: "immobilienwert",
    href: `${base}/immobilienwert`,
    label: "Wie ein Wert entsteht",
    title: "Was Ihre Immobilie wert ist",
    teaser:
      "Vergleichswert, Ertragswert, Sachwert: welches Verfahren wann greift – und warum Online-Rechner danebenliegen.",
    legacySlug: "was-ist-meine-immobilie-wert",
  },
  {
    slug: "maklerprovision",
    href: `${base}/maklerprovision`,
    label: "Maklerprovision",
    title: "Maklerprovision: Wer zahlt was",
    teaser:
      "Gesetzliche Teilung seit 2020, übliche Sätze im Rheinland, Fälligkeit und was zur Leistung gehört.",
    legacySlug: "maklerprovision-erklaert",
  },
  {
    slug: "immobilie-geerbt",
    href: `${base}/immobilie-geerbt`,
    label: "Immobilie geerbt",
    title: "Immobilie geerbt – was jetzt zu tun ist",
    teaser:
      "Fristen, Erbengemeinschaft, Erbschaft- und Spekulationssteuer: die Entscheidungen der ersten Monate.",
    legacySlug: "immobilie-geerbt-was-tun",
  },
  {
    slug: "energieausweis",
    href: `${base}/energieausweis`,
    label: "Energieausweis",
    title: "Energieausweis verstehen",
    teaser:
      "Verbrauchs- oder Bedarfsausweis, Effizienzklassen und was ein schlechter Wert beim Verkauf tatsächlich kostet.",
    legacySlug: "energieausweis-verstehen",
  },
];

export function findSellTopic(slug: string) {
  return sellTopics.find((t) => t.slug === slug);
}
