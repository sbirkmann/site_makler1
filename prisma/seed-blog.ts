import { PrismaClient } from "@prisma/client";

/**
 * Ratgeber-Inhalte. Eigene Datei, damit sie sowohl vom Gesamt-Seed als
 * auch eigenstaendig (scripts/migrate-content.mjs) eingespielt werden
 * koennen. Verkaufsbezogene Themen sind keine Artikel mehr, sondern
 * Unterseiten von "Immobilie verkaufen" (lib/content/sell-topics.ts).
 */
const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

export const blogCategories = [
  { slug: "kaufen", name: "Kaufen", description: "Vom Suchprofil bis zum Notartermin – was Käufer wissen sollten." },
  { slug: "finanzieren", name: "Finanzieren", description: "Eigenkapital, Zinsbindung, Nebenkosten und Förderungen." },
  { slug: "wohnen-und-mieten", name: "Wohnen & Mieten", description: "Mietvertrag, Übergabe, Nebenkosten und Rechte beider Seiten." },
  { slug: "markt", name: "Markt & Region", description: "Preisentwicklung und Lagen im Rheinland – nüchtern eingeordnet." },
];

export const blogPosts = [
  {
    slug: "kaufnebenkosten-rheinland",
    title: "Kaufnebenkosten: Womit Käufer im Rheinland rechnen müssen",
    excerpt:
      "Grunderwerbsteuer, Notar, Grundbuch und Provision summieren sich in Nordrhein-Westfalen auf rund zwölf Prozent des Kaufpreises. Was dahintersteckt – und was sich davon beeinflussen lässt.",
    category: "finanzieren",
    readingMinutes: 6,
    coverImage: img("1554224155-6726b3ff858f"),
    author: 1,
    daysAgo: 5,
    seoTitle: "Kaufnebenkosten in NRW: Grunderwerbsteuer, Notar, Provision",
    seoDescription:
      "Alle Kaufnebenkosten beim Immobilienkauf in Nordrhein-Westfalen im Überblick: Grunderwerbsteuer 6,5 %, Notar und Grundbuch, Maklerprovision – mit Rechenbeispiel.",
    content: `Der Kaufpreis ist nur der größte Posten, nicht der einzige. Wer eine Immobilie im Rheinland erwirbt, sollte zusätzlich rund zwölf Prozent des Kaufpreises einplanen – und zwar aus Eigenkapital, denn Banken finanzieren Nebenkosten in der Regel nicht mit.

## Die vier Posten

**Grunderwerbsteuer** — In Nordrhein-Westfalen 6,5 Prozent des Kaufpreises. Fällig nach Erhalt des Steuerbescheids, meist vier bis sechs Wochen nach der Beurkundung. Ohne Zahlung stellt das Finanzamt keine Unbedenklichkeitsbescheinigung aus – und ohne diese keine Eigentumsumschreibung.

**Notar und Grundbuch** — Zusammen etwa 1,5 bis 2 Prozent. Der Notar beurkundet den Kaufvertrag, überwacht die Kaufpreiszahlung und veranlasst die Eintragung. Die Gebühren sind gesetzlich festgelegt und bei jedem Notar gleich.

**Maklerprovision** — Bei Wohnimmobilien seit 2020 hälftig geteilt, im Raum Köln/Bonn also 2,975 Prozent inklusive Mehrwertsteuer für den Käufer. Nur fällig, wenn der Kaufvertrag zustande kommt.

**Finanzierungsnebenkosten** — Grundschuldbestellung beim Notar (etwa 0,3 Prozent der Darlehenssumme), gegebenenfalls Bereitstellungszinsen und ein Wertgutachten der Bank.

## Rechenbeispiel

Bei einem Kaufpreis von 500.000 Euro ergeben sich: Grunderwerbsteuer 32.500 Euro, Notar und Grundbuch rund 9.000 Euro, Provision 14.875 Euro, Grundschuld rund 1.200 Euro. Zusammen etwa 57.500 Euro – also 11,5 Prozent.

## Was sich beeinflussen lässt

- Bewegliche Gegenstände wie Einbauküche, Markisen oder Gartenhaus können im Kaufvertrag gesondert ausgewiesen werden. Auf diesen Anteil fällt keine Grunderwerbsteuer an – realistisch bewertet, nicht als Steuertrick.
- Bei Neubau vom Bauträger fällt die Grunderwerbsteuer auf den Gesamtpreis inklusive Bauleistung an. Ein getrennter Grundstückskauf ändert daran nur unter engen Voraussetzungen etwas.
- Die Provision ist verhandelbar, insbesondere bei höherpreisigen Objekten.

> Planen Sie die Nebenkosten vom ersten Tag an mit ein. Die häufigste Finanzierungslücke entsteht nicht beim Kaufpreis, sondern bei den zwölf Prozent daneben.`,
  },
  {
    slug: "besichtigung-checkliste-kaeufer",
    title: "Besichtigung: Worauf Käufer wirklich achten sollten",
    excerpt:
      "Zwanzig Minuten entscheiden über eine Investition von mehreren hunderttausend Euro. Eine Checkliste für den Termin – von der Kellerwand bis zur Teilungserklärung.",
    category: "kaufen",
    readingMinutes: 7,
    coverImage: img("1560518883-ce09059eeffa"),
    author: 0,
    daysAgo: 16,
    seoTitle: "Besichtigung Checkliste: Worauf Immobilienkäufer achten müssen",
    seoDescription:
      "Checkliste für die Immobilienbesichtigung: Bausubstanz, Feuchtigkeit, Haustechnik, Unterlagen und die Fragen, die Käufer stellen sollten.",
    content: `Eine Besichtigung ist kein Rundgang, sondern eine Prüfung. Wer vorbereitet kommt, sieht mehr – und stellt die Fragen, die später Geld sparen.

## Vor dem Termin

- Exposé und Grundriss genau lesen: Stimmen Wohnfläche und Zimmeraufteilung mit den eigenen Anforderungen überein?
- Lage zu unterschiedlichen Tageszeiten ansehen. Eine ruhige Straße am Sonntagvormittag ist am Montag um acht möglicherweise eine andere.
- Energieausweis anfordern – er muss spätestens bei der Besichtigung vorliegen.

## Am Gebäude

**Dach und Fassade** — Fehlende Ziegel, verfärbte Stellen, Risse im Putz. Ein Dach hält je nach Eindeckung 40 bis 60 Jahre; das Baujahr des Hauses gibt einen Anhaltspunkt.

**Keller** — Der wichtigste Raum der Besichtigung. Feuchte Wände, Salzausblühungen, muffiger Geruch oder frisch gestrichene Stellen verdienen Nachfragen.

**Fenster** — Baujahr und Verglasung. Fenster vor 1995 sind meist nur zweifach verglast und ein erheblicher Kostenfaktor.

**Heizung** — Typ, Baujahr, letzte Wartung. Heizkessel älter als 30 Jahre unterliegen einer Austauschpflicht.

## In der Wohnung

- Böden auf Unebenheiten und Feuchtigkeit prüfen, besonders unter Fenstern und in Bädern.
- Leitungen: Wann wurden Elektrik und Wasserleitungen zuletzt erneuert? Ein Blick in den Sicherungskasten sagt viel.
- Schallschutz: Kurz still stehen und hören.

## Unterlagen, nach denen Sie fragen sollten

Bei Eigentumswohnungen: Teilungserklärung, Protokolle der letzten drei Eigentümerversammlungen, Wirtschaftsplan, Höhe der Instandhaltungsrücklage und beschlossene oder geplante Sanierungen. Bei Häusern: Baupläne, Nachweise über Modernisierungen, Baulastenverzeichnis.

## Die eine Frage, die immer hilft

„Warum wird verkauft?" Die Antwort ist selten der wahre Grund – aber die Art, wie sie gegeben wird, sagt oft mehr als das Exposé.`,
  },
  {
    slug: "finanzierung-vorbereiten",
    title: "Finanzierung vorbereiten: Was vor dem ersten Bankgespräch zu klären ist",
    excerpt:
      "Eigenkapital, Haushaltsrechnung, Zinsbindung: Wer die Antworten auf fünf Fragen kennt, führt ein anderes Gespräch – und bekommt in der Regel bessere Konditionen.",
    category: "finanzieren",
    readingMinutes: 8,
    coverImage: img("1450101499163-c8848c66ca85"),
    author: 3,
    daysAgo: 29,
    seoTitle: "Immobilienfinanzierung vorbereiten: Eigenkapital, Rate, Zinsbindung",
    seoDescription:
      "So bereiten Sie eine Baufinanzierung vor: Eigenkapitalquote, realistische Monatsrate, Zinsbindung, Tilgung und die Unterlagen für das Bankgespräch.",
    content: `Die Finanzierung entscheidet nicht nur darüber, ob ein Kauf gelingt, sondern wie es sich in den nächsten zwanzig Jahren damit lebt. Fünf Punkte sollten vor dem ersten Gespräch geklärt sein.

## 1. Wie viel Eigenkapital steht wirklich zur Verfügung?

Als Faustregel gelten die Kaufnebenkosten plus 10 bis 20 Prozent des Kaufpreises. Weniger ist möglich, kostet aber Zinsaufschläge. Was zählt: Guthaben, Wertpapiere, Bausparverträge, Lebensversicherungen mit Rückkaufswert – nicht das Auto und nicht die Erbschaft, die vielleicht kommt.

## 2. Welche Rate trägt der Haushalt dauerhaft?

Die Bank rechnet mit Pauschalen. Rechnen Sie selbst mit tatsächlichen Ausgaben der letzten zwölf Monate und behalten Sie einen Puffer von mindestens 200 bis 300 Euro monatlich für Instandhaltung. Eine Rate, die nur bei zwei vollen Gehältern funktioniert, ist keine tragfähige Rate.

## 3. Zinsbindung und Tilgung

Zehn, fünfzehn oder zwanzig Jahre? Längere Bindungen kosten einen kleinen Aufschlag und kaufen Planungssicherheit. Die anfängliche Tilgung sollte mindestens zwei, besser drei Prozent betragen – sonst ist nach der Zinsbindung noch der Großteil der Schuld offen.

Sondertilgungsrechte von fünf Prozent jährlich sind inzwischen Standard und sollten kostenfrei vereinbart werden.

## 4. Förderung prüfen

KfW-Programme für energieeffiziente Gebäude und Sanierungen, Wohn-Riester, regionale Programme der NRW.Bank. Nicht alles passt zu jedem Vorhaben, aber die Prüfung dauert eine Stunde und kann mehrere tausend Euro wert sein.

## 5. Unterlagen bereitlegen

- Gehaltsabrechnungen der letzten drei Monate, bei Selbstständigen Bilanzen oder Einnahmenüberschussrechnungen der letzten zwei Jahre
- aktueller Einkommensteuerbescheid
- Nachweise über Eigenkapital
- bestehende Kredite und Verpflichtungen
- Objektunterlagen: Exposé, Grundriss, Grundbuchauszug, Energieausweis, Wohnflächenberechnung

## Mehrere Angebote einholen

Hausbank, Direktbank, Vermittler. Die Unterschiede liegen oft bei 0,2 bis 0,4 Prozentpunkten – auf zwanzig Jahre gerechnet ein fünfstelliger Betrag. Eine Finanzierungsbestätigung vor der Besichtigungsphase verschafft zudem Vorteile in der Verhandlung: Verkäufer bevorzugen Käufer, deren Finanzierung steht.`,
  },
  {
    slug: "mietvertrag-worauf-achten",
    title: "Mietvertrag: Worauf Mieter und Vermieter achten sollten",
    excerpt:
      "Staffel- oder Indexmiete, Schönheitsreparaturen, Kaution und Übergabeprotokoll: die Klauseln, die später am häufigsten zu Streit führen – und wie man ihn vermeidet.",
    category: "wohnen-und-mieten",
    readingMinutes: 6,
    coverImage: img("1568992687947-868a62a9f521"),
    author: 2,
    daysAgo: 41,
    seoTitle: "Mietvertrag prüfen: Wichtige Klauseln für Mieter und Vermieter",
    seoDescription:
      "Die wichtigsten Klauseln im Mietvertrag verständlich erklärt: Mietart, Nebenkosten, Kaution, Schönheitsreparaturen, Kündigungsfristen und Übergabeprotokoll.",
    content: `Ein Mietvertrag wird meist in wenigen Minuten unterschrieben und über Jahre gelebt. Die folgenden Punkte lohnen einen zweiten Blick – auf beiden Seiten des Tisches.

## Mietart

**Standardmiete** — Erhöhungen nur im Rahmen der ortsüblichen Vergleichsmiete, höchstens 15 Prozent in drei Jahren (Kappungsgrenze in Köln, Bonn und Düsseldorf).

**Staffelmiete** — Feste Erhöhungen zu festen Terminen. Transparent, aber unabhängig von der Marktentwicklung.

**Indexmiete** — Anpassung nach dem Verbraucherpreisindex. In Zeiten hoher Inflation für Mieter teuer, für Vermieter planbar.

## Nebenkosten

Umlagefähig sind nur die in der Betriebskostenverordnung genannten Positionen – und nur, wenn der Vertrag sie ausdrücklich nennt. Verwaltungskosten und Instandhaltung gehören nicht dazu. Die Abrechnung muss innerhalb von zwölf Monaten nach Ende des Abrechnungszeitraums vorliegen, sonst sind Nachforderungen ausgeschlossen.

## Kaution

Höchstens drei Nettokaltmieten, zahlbar in drei Raten. Sie ist getrennt vom Vermögen des Vermieters anzulegen. Nach dem Auszug darf der Vermieter eine angemessene Prüffrist nutzen – in der Regel drei bis sechs Monate.

## Schönheitsreparaturen

Viele Standardklauseln sind unwirksam: starre Fristen, Pflicht zur Renovierung bei Auszug unabhängig vom Zustand, Übergabe einer unrenovierten Wohnung ohne Ausgleich. Ist die Klausel unwirksam, bleibt die Pflicht beim Vermieter.

## Kündigungsfristen

Mieter: drei Monate, unabhängig von der Wohndauer. Vermieter: drei bis neun Monate je nach Mietdauer – und nur mit berechtigtem Interesse wie Eigenbedarf. Ein Kündigungsverzicht kann für beide Seiten bis zu vier Jahre vereinbart werden.

## Das Übergabeprotokoll

Der unterschätzte Teil. Zählerstände, Zustand jedes Raums, vorhandene Mängel, Anzahl der Schlüssel – mit Fotos und beiden Unterschriften. Was hier nicht steht, lässt sich nach Jahren kaum noch belegen.`,
  },
];

export async function seedBlog(prisma: PrismaClient) {
  const cats: Record<string, string> = {};
  for (const c of blogCategories) {
    const row = await prisma.blogCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    cats[c.slug] = row.id;
  }

  const agents = await prisma.agent.findMany({ orderBy: { sortOrder: "asc" } });

  for (const p of blogPosts) {
    const { author, daysAgo: d, category, ...rest } = p;
    const exists = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (exists) continue;
    await prisma.blogPost.create({
      data: {
        ...rest,
        categoryId: cats[category],
        authorId: agents[author % Math.max(agents.length, 1)]?.id ?? null,
        published: true,
        publishedAt: daysAgo(d),
      },
    });
  }
}

// Eigenstaendiger Aufruf: `tsx prisma/seed-blog.ts`
if (process.argv[1]?.endsWith("seed-blog.ts")) {
  const prisma = new PrismaClient();
  seedBlog(prisma)
    .then(() => console.log("→ Ratgeber-Inhalte eingespielt."))
    .finally(() => prisma.$disconnect());
}
