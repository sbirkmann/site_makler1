import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findSellTopic } from "@/lib/content/sell-topics";
import { SubpageHeader } from "@/components/marketing/SubpageHeader";
import { SellSubnav } from "@/components/marketing/SellSubnav";
import { SellTopicsGrid } from "@/components/marketing/SellTopicsGrid";
import { CTASection } from "@/components/marketing/CTASection";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const topic = findSellTopic("energieausweis")!;

const excerpt =
  "Verbrauchs- oder Bedarfsausweis, Effizienzklassen und die Frage, was ein schlechter Wert beim Verkauf tatsächlich kostet.";

export const metadata: Metadata = {
  title: "Energieausweis: Verbrauchs- vs. Bedarfsausweis, Klassen erklärt",
  description:
    "Energieausweis verstehen: Unterschied zwischen Verbrauchs- und Bedarfsausweis, Bedeutung der Effizienzklassen A+ bis H und Auswirkung auf den Verkaufspreis.",
  alternates: { canonical: topic.href },
  openGraph: {
    title: `${topic.title} – ${site.name}`,
    description: excerpt,
    url: `${site.url}${topic.href}`,
  },
};

const comparisonRows = [
  {
    label: "Basis",
    consumption: "Tatsächlicher Verbrauch der letzten drei Jahre.",
    demand: "Technische Berechnung von Gebäudehülle und Anlagentechnik – unabhängig vom Nutzerverhalten.",
  },
  {
    label: "Kosten",
    consumption: "80–150 €",
    demand: "300–500 €",
    figure: true,
  },
  {
    label: "Vor- / Nachteil",
    consumption:
      "Misst das Verhalten der Bewohner mit: Ein Haus mit einem sparsamen Rentnerpaar erscheint besser als dasselbe Haus mit einer fünfköpfigen Familie.",
    demand: "Aussagekräftiger, weil das Gebäude selbst bewertet wird.",
  },
  {
    label: "Pflicht",
    consumption: "Zulässig, wenn kein Bedarfsausweis vorgeschrieben ist.",
    demand:
      "Verpflichtend für Gebäude mit weniger als fünf Wohneinheiten und Bauantrag vor 1978 ohne entsprechende Sanierung.",
  },
];

/** Skala A+ bis H mit Farbverlauf gruen → rot (Endenergiebedarf in kWh/m²·a). */
const classes = [
  { cls: "A+", range: "unter 30", note: "Passivhausstandard", color: "#2f7d4a" },
  { cls: "A", range: "30–50", note: "Neubau nach aktuellem Standard", color: "#4f9a4f" },
  { cls: "B", range: "50–75", note: "Guter Neubau oder Vollsanierung", color: "#7fb14a" },
  { cls: "C", range: "75–100", note: "Sanierter Altbau", color: "#b5c23f" },
  { cls: "D", range: "100–130", note: "Durchschnitt des deutschen Bestands", color: "#e0c53a" },
  { cls: "E", range: "130–160", note: "", color: "#e9a534" },
  { cls: "F", range: "160–200", note: "", color: "#e07f2e" },
  { cls: "G", range: "200–250", note: "", color: "#cf5a2c" },
  { cls: "H", range: "über 250", note: "Unsanierter Altbau", color: "#a4362f" },
];

const measures = [
  {
    title: "Neue Heizung",
    cost: "25.000–40.000 €",
    effect: "Hebt die Klasse meist nur um eine Stufe – selten der wirtschaftlichste Schritt vor dem Verkauf.",
    tone: "muted" as const,
  },
  {
    title: "Bedarfsausweis statt schlechtem Verbrauchsausweis",
    cost: "300–500 €",
    effect: "Bewertet das Gebäude statt der Bewohner – oft die günstigste Verbesserung des Bildes.",
    tone: "default" as const,
  },
  {
    title: "Dämmung der obersten Geschossdecke",
    cost: "2.000–5.000 €",
    effect: "Spürbare Wirkung bei überschaubarem Aufwand.",
    tone: "default" as const,
  },
  {
    title: "Individueller Sanierungsfahrplan (iSFP)",
    cost: "rund 1.500 €",
    effect:
      "Wird zu 50 % gefördert und zeigt Käufern, was zu welchem Preis möglich ist. Erhöht den Förderbonus bei späteren Maßnahmen um 5 Prozentpunkte – ein Argument im Verkaufsgespräch.",
    tone: "default" as const,
  },
];

const facts = [
  { figure: "2014", text: "Seitdem muss der Ausweis bei jeder Besichtigung unaufgefordert vorgelegt werden." },
  { figure: "2021", text: "Seitdem sind die Angaben in jeder Immobilienanzeige verpflichtend." },
  { figure: "10.000 €", text: "Bußgeld, das bei Verstößen droht – bis zu." },
  { figure: "10 Jahre", text: "Gültigkeit ab Ausstellung. Danach ist ein neuer Ausweis erforderlich." },
];

function SectionIntro({ eyebrow, id, title }: { eyebrow: string; id: string; title: string }) {
  return (
    <>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id} className="display-3 mt-4 max-w-2xl text-ink">
        {title}
      </h2>
    </>
  );
}

export default function EnergieausweisPage() {
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
            <div className="flex flex-col gap-16">
              <p className="lead max-w-2xl">
                Seit 2014 muss der Energieausweis bei jeder Besichtigung unaufgefordert vorgelegt
                werden, seit 2021 gehören die Angaben in jede Immobilienanzeige. Wer das versäumt,
                riskiert ein Bußgeld von bis zu 10.000 Euro.
              </p>

              {/* Vergleich */}
              <section aria-labelledby="arten">
                <SectionIntro eyebrow="Zwei Arten, ein Dokument" id="arten" title="Verbrauchsausweis oder Bedarfsausweis?" />
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full min-w-[40rem] border-y border-line-strong text-left">
                    <caption className="sr-only">Vergleich von Verbrauchs- und Bedarfsausweis</caption>
                    <thead>
                      <tr>
                        <th scope="col" className="w-32 py-4 pr-4 align-bottom text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-ink-subtle" />
                        <th scope="col" className="py-4 pr-6 align-bottom">
                          <span className="block text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Variante A</span>
                          <span className="heading-4 mt-1 block text-ink">Verbrauchsausweis</span>
                        </th>
                        <th scope="col" className="py-4 align-bottom">
                          <span className="block text-[0.6875rem] uppercase tracking-[0.14em] text-accent-600">Variante B</span>
                          <span className="heading-4 mt-1 block text-ink">Bedarfsausweis</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line border-t border-line">
                      {comparisonRows.map((row) => (
                        <tr key={row.label} className="align-top">
                          <th scope="row" className="py-5 pr-4 text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-ink-subtle">
                            {row.label}
                          </th>
                          <td
                            className={
                              row.figure
                                ? "py-5 pr-6 font-[family-name:var(--font-display)] text-[1.5rem] leading-none text-ink"
                                : "py-5 pr-6 text-[0.9375rem] font-light leading-relaxed text-ink-muted"
                            }
                          >
                            {row.consumption}
                          </td>
                          <td
                            className={
                              row.figure
                                ? "py-5 font-[family-name:var(--font-display)] text-[1.5rem] leading-none text-ink"
                                : "py-5 text-[0.9375rem] font-light leading-relaxed text-ink-muted"
                            }
                          >
                            {row.demand}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Skala + Abschlag */}
              <section aria-labelledby="klassen">
                <SectionIntro eyebrow="Die Effizienzklassen" id="klassen" title="Von A+ bis H" />
                <p className="mt-4 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Die Skala bezieht sich auf den Endenergiebedarf in kWh pro m² und Jahr.
                </p>
                <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
                  <ol className="flex flex-col gap-px">
                    {classes.map((c, i) => (
                      <li key={c.cls} className="flex items-stretch">
                        <span
                          className="flex shrink-0 items-center justify-center font-[family-name:var(--font-display)] text-[1.125rem] text-white"
                          style={{ backgroundColor: c.color, width: `${3.5 + i * 0.35}rem` }}
                        >
                          {c.cls}
                        </span>
                        <div className="flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line py-3 pl-4">
                          <span className="font-[family-name:var(--font-display)] text-[1.0625rem] text-ink">
                            {c.range}
                            <span className="ml-1 text-[0.75rem] text-ink-subtle">kWh/m²·a</span>
                          </span>
                          {c.note ? (
                            <span className="text-[0.875rem] font-light text-ink-muted">{c.note}</span>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="flex flex-col gap-4 self-start bg-primary-900 p-7 text-ink-inverse">
                    <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-accent-300">
                      Was ein schlechter Wert kostet
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[2.75rem] leading-none text-white">
                      15–25 %
                    </span>
                    <span className="text-[0.8125rem] uppercase tracking-[0.12em] text-white/70">
                      Abschlag bei Klasse G/H
                    </span>
                    <p className="border-t border-white/15 pt-4 text-[0.875rem] font-light leading-relaxed text-white/70">
                      Gegenüber vergleichbaren Objekten der Klasse C – seit 2022 deutlich
                      verstärkt. Nicht wegen der Heizkosten, sondern wegen der erwarteten
                      Sanierungskosten.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sanieren */}
              <section aria-labelledby="sanieren">
                <SectionIntro eyebrow="Vor dem Verkauf" id="sanieren" title="Lohnt sich Sanieren?" />
                <p className="mt-4 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Selten vollständig, oft punktuell. Wirtschaftlicher als die große Maßnahme sind
                  häufig die kleinen.
                </p>
                <ul className="mt-8 divide-y divide-line border-y border-line-strong">
                  {measures.map((m) => (
                    <li
                      key={m.title}
                      className={
                        m.tone === "muted"
                          ? "grid gap-2 bg-surface-muted px-5 py-5 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-8"
                          : "grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-8"
                      }
                    >
                      <div>
                        <p className="heading-4 text-ink">{m.title}</p>
                        <p className="mt-1 text-[0.875rem] font-light leading-relaxed text-ink-muted">{m.effect}</p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Kosten</span>
                        <span className="mt-1 block font-[family-name:var(--font-display)] text-[1.375rem] leading-none text-ink">
                          {m.cost}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/kontakt" variant="ghost" className="mt-6">
                  Sanierungsfrage besprechen
                </ButtonLink>
              </section>

              {/* Pflichten & Gültigkeit */}
              <section aria-labelledby="pflichten">
                <SectionIntro eyebrow="Pflichten & Gültigkeit" id="pflichten" title="Die Zahlen, die Sie kennen sollten" />
                <dl className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
                  {facts.map((f) => (
                    <div key={f.figure} className="flex flex-col gap-3 bg-surface-muted p-6">
                      <dt className="font-[family-name:var(--font-display)] text-[1.75rem] leading-none text-accent-500">
                        {f.figure}
                      </dt>
                      <dd className="text-[0.875rem] font-light leading-relaxed text-ink-muted">{f.text}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            <SellSubnav current="energieausweis" />
          </div>
        </Container>
      </Section>

      <SellTopicsGrid exclude="energieausweis" />

      <CTASection
        eyebrow="Kostenlose Ersteinschätzung"
        title="Was ist Ihre Immobilie heute wert?"
        description="Energetischer Zustand, Lage und Ausstattung in einer nachvollziehbaren Spanne – kostenlos und auf Basis tatsächlich erzielter Kaufpreise."
        primaryLabel="Bewertung starten"
        primaryHref="/immobilienbewertung"
        secondaryLabel="Beratung vereinbaren"
        secondaryHref="/kontakt"
      />
    </>
  );
}
