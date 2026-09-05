import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findSellTopic } from "@/lib/content/sell-topics";
import { SubpageHeader } from "@/components/marketing/SubpageHeader";
import { SellSubnav } from "@/components/marketing/SellSubnav";
import { SellTopicsGrid } from "@/components/marketing/SellTopicsGrid";
import { CTASection } from "@/components/marketing/CTASection";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconCheck } from "@/components/icons";

const topic = findSellTopic("unterlagen")!;

const excerpt =
  "Welche Dokumente Sie brauchen, wo Sie sie bekommen, was sie kosten und wie lange die Beschaffung dauert.";

export const metadata: Metadata = {
  title: "Unterlagen für den Immobilienverkauf: Checkliste und Beschaffung",
  description:
    "Alle Unterlagen für den Immobilienverkauf im Überblick: Grundbuchauszug, Flurkarte, Energieausweis, Teilungserklärung – mit Bezugsquelle und Dauer.",
  alternates: { canonical: topic.href },
  openGraph: {
    title: "Unterlagen beim Immobilienverkauf: die vollständige Checkliste – WohnWert Immobilien",
    description: excerpt,
    url: `${site.url}${topic.href}`,
  },
};

interface DocRow {
  name: string;
  source: string;
  cost: string;
  duration: string;
  hint?: string;
}

interface DocGroup {
  title: string;
  intro?: string;
  rows: DocRow[];
}

const groups: DocGroup[] = [
  {
    title: "Für jede Immobilie",
    rows: [
      {
        name: "Grundbuchauszug",
        source: "Grundbuchamt am Amtsgericht",
        cost: "ca. 10–20 €",
        duration: "wenige Tage",
        hint: "Nicht älter als drei Monate.",
      },
      {
        name: "Flurkarte / Liegenschaftskarte",
        source: "Katasteramt",
        cost: "ca. 15–40 €",
        duration: "wenige Tage",
      },
      {
        name: "Energieausweis",
        source: "Aussteller je nach Typ",
        cost: "Verbrauchsausweis 80–150 €, Bedarfsausweis 300–500 €",
        duration: "2–4 Wochen",
        hint: "Muss spätestens bei der Besichtigung unaufgefordert vorgelegt werden.",
      },
      {
        name: "Grundriss und Baupläne",
        source: "Bauaktenarchiv der Gemeinde",
        cost: "30–100 €",
        duration: "1–4 Wochen",
      },
      {
        name: "Wohnflächenberechnung",
        source: "aus den Bauunterlagen oder neu zu erstellen",
        cost: "–",
        duration: "–",
      },
      {
        name: "Nachweise zu Modernisierungen",
        source: "eigene Rechnungen und Handwerkerbelege der letzten Jahre",
        cost: "–",
        duration: "–",
        hint: "Sie belegen den Zustand und rechtfertigen den Preis.",
      },
    ],
  },
  {
    title: "Zusätzlich bei Eigentumswohnungen",
    rows: [
      { name: "Teilungserklärung mit Aufteilungsplan", source: "Grundbuchamt oder Verwaltung", cost: "–", duration: "–" },
      {
        name: "Protokolle der Eigentümerversammlungen",
        source: "Verwaltung",
        cost: "–",
        duration: "–",
        hint: "Mindestens die letzten drei Jahre.",
      },
      { name: "Wirtschaftsplan und Jahresabrechnungen", source: "Verwaltung", cost: "–", duration: "–" },
      { name: "Nachweis über die Instandhaltungsrücklage", source: "Verwaltung", cost: "–", duration: "–" },
      { name: "Beschlusssammlung", source: "Verwaltung", cost: "–", duration: "–" },
    ],
  },
  {
    title: "Zusätzlich bei vermieteten Objekten",
    rows: [
      { name: "Mietverträge aller Einheiten", source: "–", cost: "–", duration: "–" },
      { name: "Mieterliste mit Laufzeiten und aktuellen Mieten", source: "–", cost: "–", duration: "–" },
      { name: "Nebenkostenabrechnungen der letzten zwei Jahre", source: "–", cost: "–", duration: "–" },
      { name: "Nachweise über Mietanpassungen", source: "–", cost: "–", duration: "–" },
    ],
  },
  {
    title: "Zusätzlich bei Häusern",
    rows: [
      { name: "Grundsteuerbescheid", source: "–", cost: "–", duration: "–" },
      { name: "Nachweise über Anliegerbeiträge", source: "–", cost: "–", duration: "–" },
      { name: "Wartungsnachweise für Heizung und Kamin", source: "–", cost: "–", duration: "–" },
      { name: "Bei Öltanks: Nachweis der letzten Prüfung", source: "–", cost: "–", duration: "–" },
      { name: "Baulastenverzeichnis-Auszug", source: "–", cost: "–", duration: "–" },
    ],
  },
];

const summary = [
  { figure: "4", unit: "Wochen", label: "Vorlauf realistisch – bei alten Bauakten auch mehr" },
  { figure: "3", unit: "Monate", label: "maximales Alter des Grundbuchauszugs" },
  { figure: "3", unit: "Jahre", label: "Versammlungsprotokolle bei Eigentumswohnungen" },
];

const cellBase = "px-4 py-4 align-top text-[0.9375rem] font-light leading-relaxed";

export default function SellDocumentsPage() {
  return (
    <>
      <SubpageHeader
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Immobilie verkaufen", href: "/immobilie-verkaufen" },
          { label: topic.label },
        ]}
        eyebrow="Immobilie verkaufen"
        title={topic.title}
        lead={excerpt}
      />

      <Section>
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
            <div>
              <p className="lead max-w-2xl">
                Unvollständige Unterlagen sind der häufigste Grund für Verzögerungen. Banken
                finanzieren nicht ohne Nachweise, Notare beurkunden nicht ohne Grundbuchauszug,
                und Käufer werden misstrauisch, wenn Dokumente fehlen.
              </p>

              {/* Kennzahlen */}
              <dl className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
                {summary.map((item) => (
                  <div key={item.label} className="flex flex-col gap-2 bg-surface-muted p-6">
                    <dt className="order-last text-[0.875rem] font-light leading-relaxed text-ink-muted">
                      {item.label}
                    </dt>
                    <dd className="flex items-baseline gap-2">
                      <span className="font-[family-name:var(--font-display)] text-[2.75rem] leading-none text-accent-500">
                        {item.figure}
                      </span>
                      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">
                        {item.unit}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Checklisten */}
              {groups.map((group) => (
                <div key={group.title} className="mt-14">
                  <span className="eyebrow">{group.title}</span>
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[40rem] border-collapse border-y border-line-strong text-left">
                      <thead>
                        <tr className="border-b border-line text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">
                          <th scope="col" className="w-10 px-4 py-3 font-normal">
                            <span className="sr-only">Erledigt</span>
                          </th>
                          <th scope="col" className="px-4 py-3 font-normal">Dokument</th>
                          <th scope="col" className="px-4 py-3 font-normal">Bezugsquelle</th>
                          <th scope="col" className="px-4 py-3 font-normal">Kosten</th>
                          <th scope="col" className="px-4 py-3 font-normal">Dauer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {group.rows.map((row) => (
                          <tr key={row.name}>
                            <td className={cellBase}>
                              <span className="flex h-6 w-6 items-center justify-center border border-accent-500 text-accent-500">
                                <IconCheck size={13} strokeWidth={1.75} />
                              </span>
                            </td>
                            <th scope="row" className={`${cellBase} font-normal text-ink`}>
                              {row.name}
                              {row.hint ? (
                                <span className="mt-1 block text-[0.8125rem] font-light text-ink-subtle">
                                  {row.hint}
                                </span>
                              ) : null}
                            </th>
                            <td className={`${cellBase} text-ink-muted`}>{row.source}</td>
                            <td className={`${cellBase} whitespace-nowrap text-ink-muted`}>
                              {row.cost.includes(",") ? (
                                row.cost.split(", ").map((part) => (
                                  <span key={part} className="block">
                                    {part}
                                  </span>
                                ))
                              ) : (
                                row.cost
                              )}
                            </td>
                            <td className={`${cellBase} whitespace-nowrap font-[family-name:var(--font-display)] text-[1.0625rem] text-ink`}>
                              {row.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Hinweis */}
              <div className="mt-14 border-l-2 border-accent-500 bg-surface-muted p-6 sm:p-8">
                <span className="eyebrow !text-[1rem]">Praktischer Hinweis</span>
                <p className="mt-3 max-w-2xl text-[1.0625rem] font-light leading-relaxed text-ink">
                  Beginnen Sie mit der Beschaffung, sobald der Verkauf grundsätzlich feststeht –
                  nicht erst, wenn ein Interessent gefunden ist. Vier Wochen Vorlauf sind
                  realistisch, bei alten Bauakten auch mehr.
                </p>
              </div>

              {/* Service-Box */}
              <div className="mt-8 flex flex-col gap-6 border border-line-strong p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="heading-4 text-ink">
                    Wir übernehmen die Beschaffung – Sie unterschreiben lediglich die Vollmacht.
                  </p>
                  <p className="mt-2 max-w-xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                    Grundbuchamt, Katasteramt, Bauaktenarchiv, Verwaltung: Wir fordern die Unterlagen
                    an, prüfen sie auf Vollständigkeit und stellen sie für Käufer und Notar zusammen.
                  </p>
                </div>
                <ButtonLink href="/kontakt" size="lg" variant="primary" className="shrink-0">
                  Beratung vereinbaren
                  <IconArrowRight size={18} />
                </ButtonLink>
              </div>
            </div>

            <SellSubnav current="unterlagen" />
          </div>
        </Container>
      </Section>

      <SellTopicsGrid exclude="unterlagen" />

      <CTASection
        eyebrow="Kostenlose Ersteinschätzung"
        title="Was ist Ihre Immobilie heute wert?"
        description="Während die Unterlagen zusammenkommen, klären wir die wichtigste Frage: Was ist am Markt erzielbar? Kostenlos, auf Basis tatsächlich erzielter Kaufpreise."
        primaryLabel="Bewertung starten"
        primaryHref="/immobilienbewertung"
        secondaryLabel="Beratung vereinbaren"
        secondaryHref="/kontakt"
      />
    </>
  );
}
