import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findSellTopic } from "@/lib/content/sell-topics";
import { SubpageHeader } from "@/components/marketing/SubpageHeader";
import { SellSubnav } from "@/components/marketing/SellSubnav";
import { SellTopicsGrid } from "@/components/marketing/SellTopicsGrid";
import { CTASection } from "@/components/marketing/CTASection";
import { Container, Section } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { IconQuote } from "@/components/icons";

const topic = findSellTopic("ablauf")!;

const excerpt =
  "Vom ersten Gedanken bis zur Schlüsselübergabe vergehen im Rheinland im Schnitt vier bis sechs Monate. Was in dieser Zeit passiert – und wo die meisten Verkäufe ins Stocken geraten.";

export const metadata: Metadata = {
  title: "Immobilie verkaufen: Ablauf in 9 Schritten",
  description:
    "Wie ein Immobilienverkauf tatsächlich abläuft: Vorbereitung, Unterlagen, Preisfindung, Vermarktung, Notartermin und Übergabe – Schritt für Schritt erklärt.",
  alternates: { canonical: topic.href },
  openGraph: {
    title: "Immobilie verkaufen: Ablauf in 9 Schritten – WohnWert Immobilien",
    description: excerpt,
    url: `${site.url}${topic.href}`,
  },
};

const steps = [
  {
    title: "Klarheit über das eigene Ziel",
    text: "Bevor über Preise gesprochen wird, sollte eine andere Frage beantwortet sein: Was ist wichtiger – der höchstmögliche Preis oder ein sicherer Termin? Beides gleichzeitig gibt es selten. Wer bis zum Sommer verkauft haben muss, weil ein Umzug ansteht, verhandelt anders als jemand, der zwei Jahre Zeit hat.",
  },
  {
    title: "Unterlagen zusammentragen",
    text: "Dieser Schritt dauert fast immer länger als gedacht. Benötigt werden unter anderem Grundbuchauszug, Flurkarte, Baupläne, Wohnflächenberechnung, Energieausweis und – bei Eigentumswohnungen – Teilungserklärung sowie die Protokolle der letzten drei Eigentümerversammlungen.",
    note: "Rechnen Sie mit zwei bis vier Wochen, wenn Unterlagen bei Ämtern angefordert werden müssen.",
  },
  {
    title: "Wert ermitteln",
    text: "Der Marktwert ergibt sich aus drei Verfahren: Vergleichswert, Ertragswert und Sachwert. Für selbstgenutzte Wohnimmobilien ist das Vergleichswertverfahren maßgeblich – entscheidend sind also tatsächlich erzielte Preise vergleichbarer Objekte, nicht Angebotspreise aus Portalen.",
  },
  {
    title: "Über die Vermarktungsstrategie entscheiden",
    text: "Öffentlich oder diskret? Portale oder gezielte Ansprache vorgemerkter Interessenten? Für ungewöhnliche Objekte oder Verkäufe in sensiblen Situationen ist die diskrete Variante oft die bessere.",
  },
  {
    title: "Objekt vorbereiten",
    text: "Kleine Maßnahmen mit großer Wirkung: aufräumen, entrümpeln, defekte Leuchtmittel tauschen, Fenster putzen. Größere Renovierungen rechnen sich vor dem Verkauf dagegen selten – Käufer honorieren fremde Geschmacksentscheidungen kaum.",
  },
  {
    title: "Professionelle Aufbereitung",
    text: "Fotos, Grundrisse, Exposé. Der erste Eindruck entsteht heute auf einem Bildschirm. Objekte mit schlechten Fotos erhalten messbar weniger Anfragen – und erzielen im Schnitt niedrigere Preise.",
  },
  {
    title: "Besichtigungen",
    text: "Qualifizierte Interessenten statt Laufkundschaft. Vor dem Termin sollte geklärt sein, ob die Finanzierung grundsätzlich steht. Das erspart beiden Seiten Zeit.",
  },
  {
    title: "Verhandlung und Notartermin",
    text: "Nach der Einigung wird der Kaufvertragsentwurf erstellt. Zwischen Entwurf und Beurkundung müssen bei Verbrauchern zwei Wochen liegen. Der Notartermin selbst dauert etwa eine Stunde.",
  },
  {
    title: "Kaufpreiszahlung und Übergabe",
    text: "Die Zahlung erfolgt erst, wenn alle Voraussetzungen erfüllt sind – üblicherweise vier bis acht Wochen nach der Beurkundung. Bei der Übergabe werden Zählerstände protokolliert und Schlüssel übergeben.",
  },
];

/** Dauer-Segmente in Wochen (Mittelwerte fuer die Breite der Balken). */
const phases = [
  { label: "Vorbereitung", range: "2–4 Wochen", weight: 3, detail: "Ziel klären, Unterlagen, Bewertung" },
  { label: "Vermarktung", range: "6–10 Wochen", weight: 8, detail: "Aufbereitung, Besichtigungen, Verhandlung" },
  { label: "Abwicklung", range: "4–8 Wochen", weight: 6, detail: "Notartermin, Kaufpreiszahlung, Übergabe" },
];
const phaseTotal = phases.reduce((sum, p) => sum + p.weight, 0);

const faq = [
  {
    question: "Wie lange dauert ein Immobilienverkauf insgesamt?",
    answer:
      "Von der Entscheidung bis zur Übergabe vergehen realistisch vier bis sechs Monate. Die Vermarktung selbst nimmt davon oft nur sechs bis zehn Wochen ein – der Rest entfällt auf Vorbereitung und die Abwicklung nach der Einigung.",
  },
  {
    question: "Warum zählen Angebotspreise aus Portalen nicht als Maßstab?",
    answer:
      "Angebotspreise sagen aus, was Verkäufer sich wünschen. Kaufpreissammlungen sagen aus, was Käufer tatsächlich bezahlt haben. Der Unterschied beträgt im Rheinland derzeit fünf bis zwölf Prozent – maßgeblich für den Marktwert sind daher tatsächlich erzielte Preise vergleichbarer Objekte.",
  },
  {
    question: "Lohnt sich eine Renovierung vor dem Verkauf?",
    answer:
      "Größere Renovierungen rechnen sich vor dem Verkauf selten, weil Käufer fremde Geschmacksentscheidungen kaum honorieren. Kleine Maßnahmen wirken dagegen: aufräumen, entrümpeln, defekte Leuchtmittel tauschen, Fenster putzen.",
  },
  {
    question: "Wann wird der Kaufpreis gezahlt?",
    answer:
      "Erst, wenn alle Voraussetzungen erfüllt sind – üblicherweise vier bis acht Wochen nach der Beurkundung. Zwischen Kaufvertragsentwurf und Notartermin müssen bei Verbrauchern zudem zwei Wochen liegen.",
  },
];

export default function SellProcessPage() {
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
                Die meisten Eigentümer unterschätzen nicht den Aufwand des Verkaufs, sondern die
                Zeit, die zwischen den einzelnen Schritten vergeht. Wer den Ablauf kennt, plant
                realistischer – und trifft bessere Entscheidungen.
              </p>

              {/* Zeitleiste */}
              <div className="mt-14">
                <span className="eyebrow">Die neun Schritte</span>
                <ol className="relative mt-8">
                  <span
                    aria-hidden="true"
                    className="absolute left-[1.375rem] top-3 bottom-3 w-px bg-line-strong sm:left-[2rem]"
                  />
                  {steps.map((step, i) => (
                    <li
                      key={step.title}
                      className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-6 pb-10 last:pb-0 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-8"
                    >
                      <span className="relative z-10 flex h-[2.75rem] w-[2.75rem] items-center justify-center border border-accent-500 bg-surface font-[family-name:var(--font-display)] text-[1.25rem] leading-none text-accent-500 sm:h-16 sm:w-16 sm:text-[1.625rem]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="pt-1 sm:pt-3">
                        <h2 className="heading-4 text-ink">{step.title}</h2>
                        <p className="mt-2.5 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                          {step.text}
                        </p>
                        {step.note ? (
                          <p className="mt-3 max-w-2xl border-l border-accent-500 pl-4 text-[0.875rem] font-light leading-relaxed text-ink">
                            {step.note}
                          </p>
                        ) : null}

                        {i === 2 ? (
                          <blockquote className="mt-6 max-w-2xl bg-surface-muted p-6 sm:p-8">
                            <IconQuote size={22} className="text-accent-500" />
                            <p className="mt-4 font-[family-name:var(--font-display)] text-[1.25rem] leading-snug text-ink sm:text-[1.375rem]">
                              Angebotspreise sagen aus, was Verkäufer sich wünschen. Kaufpreissammlungen
                              sagen aus, was Käufer tatsächlich bezahlt haben. Der Unterschied beträgt im
                              Rheinland derzeit fünf bis zwölf Prozent.
                            </p>
                          </blockquote>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Dauer */}
              <div className="mt-16 border-t border-line-strong pt-12">
                <span className="eyebrow">Wie lange dauert das?</span>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="font-[family-name:var(--font-display)] text-[3rem] leading-none text-accent-500 sm:text-[3.75rem]">
                    4–6
                  </span>
                  <span className="display-3 text-ink">Monate von der Entscheidung bis zur Übergabe</span>
                </div>
                <p className="mt-4 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Die Vermarktung selbst nimmt davon oft nur sechs bis zehn Wochen ein – der Rest
                  entfällt auf Vorbereitung und die Abwicklung nach der Einigung.
                </p>

                <div className="mt-8 hidden gap-px bg-line-strong sm:flex">
                  {phases.map((phase, i) => (
                    <div
                      key={phase.label}
                      className={i === 1 ? "bg-accent-500 text-white" : "bg-surface-muted text-ink"}
                      style={{ flexBasis: `${(phase.weight / phaseTotal) * 100}%` }}
                    >
                      <div className="flex h-full min-w-0 flex-col gap-1 px-4 py-4">
                        <span
                          className={
                            "text-[0.6875rem] uppercase tracking-[0.14em] " +
                            (i === 1 ? "text-white/80" : "text-ink-subtle")
                          }
                        >
                          {phase.label}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[1.5rem] leading-none">
                          {phase.range}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {phases.map((phase) => (
                    <div
                      key={phase.label}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-4 sm:grid-cols-[10rem_minmax(0,1fr)_auto]"
                    >
                      <dt className="text-[0.9375rem] font-normal text-ink">{phase.label}</dt>
                      <dd className="col-span-2 order-last text-[0.875rem] font-light text-ink-muted sm:col-span-1 sm:order-none">
                        {phase.detail}
                      </dd>
                      <dd className="font-[family-name:var(--font-display)] text-[1.25rem] leading-none text-accent-500">
                        {phase.range}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* FAQ */}
              <div className="mt-16">
                <span className="eyebrow">Häufige Fragen</span>
                <Accordion items={faq} className="mt-6" />
              </div>
            </div>

            <SellSubnav current="ablauf" />
          </div>
        </Container>
      </Section>

      <SellTopicsGrid exclude="ablauf" />

      <CTASection
        eyebrow="Kostenlose Ersteinschätzung"
        title="Was ist Ihre Immobilie heute wert?"
        description="Der erste Schritt im Ablauf ist die realistische Einschätzung. Wir liefern sie kostenlos, auf Basis tatsächlich erzielter Kaufpreise – Rückmeldung innerhalb eines Werktages."
        primaryLabel="Bewertung starten"
        primaryHref="/immobilienbewertung"
        secondaryLabel="Beratung vereinbaren"
        secondaryHref="/kontakt"
      />
    </>
  );
}
