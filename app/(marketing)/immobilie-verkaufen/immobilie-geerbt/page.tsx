import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findSellTopic } from "@/lib/content/sell-topics";
import { SubpageHeader } from "@/components/marketing/SubpageHeader";
import { SellSubnav } from "@/components/marketing/SellSubnav";
import { SellTopicsGrid } from "@/components/marketing/SellTopicsGrid";
import { CTASection } from "@/components/marketing/CTASection";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { IconCheck, IconClose } from "@/components/icons";

const topic = findSellTopic("immobilie-geerbt")!;

const excerpt =
  "Fristen, Erbengemeinschaft, Spekulationssteuer: Die wichtigsten Entscheidungen in den ersten Monaten nach dem Erbfall.";

export const metadata: Metadata = {
  title: "Immobilie geerbt: Fristen, Erbengemeinschaft, Steuern",
  description:
    "Was nach dem Erbfall einer Immobilie zu tun ist: Erbschein, Grundbuchberichtigung, Erbschaftsteuer, Erbengemeinschaft und die Frage Verkauf oder Behalten.",
  alternates: { canonical: topic.href },
  openGraph: {
    title: `${topic.title} – ${site.name}`,
    description: excerpt,
    url: `${site.url}${topic.href}`,
  },
};

const deadlines = [
  {
    figure: "6",
    unit: "Wochen",
    title: "Ausschlagungsfrist",
    text: "Ab Kenntnis des Erbfalls und der Berufung als Erbe. Bei überschuldeten Nachlässen die einzige Möglichkeit, nicht für Schulden einzustehen – bei Zweifeln an der Werthaltigkeit sofort prüfen.",
  },
  {
    figure: "3",
    unit: "Monate",
    title: "Anzeige beim Finanzamt",
    text: "Der Erwerb ist dem zuständigen Erbschaftsteuerfinanzamt anzuzeigen.",
  },
  {
    figure: "2",
    unit: "Jahre",
    title: "Grundbuch gebührenfrei",
    text: "Innerhalb von zwei Jahren nach dem Erbfall ist die Grundbuchberichtigung gebührenfrei. Benötigt wird ein Erbschein oder ein notarielles Testament mit Eröffnungsprotokoll. Ohne Berichtigung ist kein Verkauf möglich.",
  },
  {
    figure: "10",
    unit: "Jahre",
    title: "Familienheim selbst bewohnen",
    text: "So lange müssen Ehepartner oder Kinder das geerbte Familienheim selbst bewohnen, damit die Steuerbefreiung bestehen bleibt.",
  },
];

const allowances = [
  { who: "Ehepartner", amount: "500.000 €" },
  { who: "Kinder", amount: "400.000 €", note: "je Elternteil" },
  { who: "Enkel", amount: "200.000 €" },
  { who: "Eltern", amount: "100.000 €", note: "beim Erbfall" },
  { who: "Geschwister, Nichten, Neffen", amount: "20.000 €" },
];

const helps = [
  { title: "Früh sprechen", text: "Bevor Positionen sich verhärten – die laufenden Kosten des Haltens werden von Miterben häufig unterschätzt." },
  { title: "Unabhängige Bewertung einholen", text: "Eine neutrale Zahl nimmt der Diskussion den Streit über den Wert." },
  { title: "Optionen schriftlich gegenüberstellen", text: "Verkaufen, vermieten, auszahlen – nebeneinander mit Zahlen, nicht aus dem Gedächtnis." },
];

const keep = ["Laufende Mieteinnahmen", "Eine gute Lage", "Ein guter Bauzustand"];
const sell = [
  "Anstehender Sanierungsstau",
  "Erbengemeinschaft mit unterschiedlichen Interessen",
  "Unklar, wer sich tatsächlich um die Immobilie kümmert",
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

export default function ImmobilieGeerbtPage() {
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
                Ein Erbfall bringt Entscheidungen mit sich, die niemand vorbereitet trifft – oft in
                einer Situation, in der andere Dinge wichtiger sind. Dieser Überblick sortiert die
                zeitkritischen Punkte.
              </p>

              {/* Fristen-Timeline */}
              <section aria-labelledby="fristen">
                <SectionIntro eyebrow="Fristen" id="fristen" title="Was in den ersten Monaten zählt" />
                <ol className="mt-8 grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
                  {deadlines.map((d, i) => (
                    <li key={d.title} className="relative flex flex-col gap-3 bg-surface p-6 sm:p-7">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-px w-full bg-line-strong"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute left-6 top-0 h-px w-8 bg-accent-500 sm:left-7"
                      />
                      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">
                        Schritt {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex items-baseline gap-2">
                        <span className="font-[family-name:var(--font-display)] text-[2.75rem] leading-none text-accent-500">
                          {d.figure}
                        </span>
                        <span className="text-[0.875rem] uppercase tracking-[0.12em] text-ink-muted">{d.unit}</span>
                      </span>
                      <span className="heading-4 text-ink">{d.title}</span>
                      <p className="text-[0.875rem] font-light leading-relaxed text-ink-muted">{d.text}</p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Freibeträge */}
              <section aria-labelledby="freibetraege">
                <SectionIntro eyebrow="Erbschaftsteuer" id="freibetraege" title="Die Freibeträge" />
                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[20rem] border-y border-line-strong text-left">
                      <caption className="sr-only">Erbschaftsteuer-Freibeträge nach Verwandtschaftsgrad</caption>
                      <thead>
                        <tr className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">
                          <th scope="col" className="py-3 font-normal">Erbe</th>
                          <th scope="col" className="py-3 text-right font-normal">Freibetrag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {allowances.map((a) => (
                          <tr key={a.who}>
                            <td className="py-4 pr-4 text-[0.9375rem] font-light text-ink">
                              {a.who}
                              {a.note ? (
                                <span className="ml-2 text-[0.8125rem] text-ink-subtle">({a.note})</span>
                              ) : null}
                            </td>
                            <td className="whitespace-nowrap py-4 text-right font-[family-name:var(--font-display)] text-[1.375rem] leading-none text-ink">
                              {a.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-primary-900 p-7 text-ink-inverse sm:p-8">
                    <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-accent-300">Sonderregelung Familienheim</p>
                    <p className="mt-4 text-[0.9375rem] font-light leading-relaxed text-white/80">
                      Ehepartner und Kinder erben das selbstgenutzte Familienheim steuerfrei, wenn
                      sie unverzüglich selbst einziehen und die Immobilie zehn Jahre lang selbst
                      bewohnen.
                    </p>
                    <dl className="mt-6 grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
                      <div>
                        <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-white/55">Selbstnutzung</dt>
                        <dd className="mt-2 font-[family-name:var(--font-display)] text-[1.75rem] leading-none text-white">
                          10 Jahre
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-white/55">Grenze bei Kindern</dt>
                        <dd className="mt-2 font-[family-name:var(--font-display)] text-[1.75rem] leading-none text-white">
                          200 m²
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-6 text-[0.8125rem] font-light leading-relaxed text-white/55">
                      Wird innerhalb der zehn Jahre verkauft oder vermietet, entfällt die Befreiung
                      rückwirkend.
                    </p>
                  </div>
                </div>
              </section>

              {/* Erbengemeinschaft */}
              <section aria-labelledby="erbengemeinschaft">
                <SectionIntro eyebrow="Mehrere Erben" id="erbengemeinschaft" title="Die Erbengemeinschaft" />
                <p className="mt-4 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Mehrere Erben bilden eine Gesamthandsgemeinschaft. Das bedeutet praktisch:
                  Verkauft werden kann nur einstimmig. Wenn keine Einigung gelingt, bleibt die
                  Teilungsversteigerung – ein Verfahren, das fast immer zu deutlich niedrigeren
                  Erlösen führt.
                </p>
                <p className="mt-8 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Was hilft</p>
                <ol className="mt-3 grid gap-px bg-line md:grid-cols-3">
                  {helps.map((h, i) => (
                    <li key={h.title} className="flex flex-col gap-3 bg-surface-muted p-6">
                      <span className="font-[family-name:var(--font-display)] text-[1.5rem] text-accent-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="heading-4 text-ink">{h.title}</span>
                      <p className="text-[0.875rem] font-light leading-relaxed text-ink-muted">{h.text}</p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Spekulationssteuer */}
              <section aria-labelledby="spekulation">
                <SectionIntro eyebrow="Beim Verkauf" id="spekulation" title="Spekulationssteuer" />
                <div className="mt-8 grid gap-px bg-line md:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="flex flex-col justify-center gap-2 bg-surface-muted p-7 md:min-w-[14rem]">
                    <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Maßgeblich</span>
                    <span className="font-[family-name:var(--font-display)] text-[2rem] leading-none text-ink">
                      10 Jahre
                    </span>
                    <span className="text-[0.8125rem] font-light text-ink-muted">ab Anschaffung durch den Erblasser</span>
                  </div>
                  <div className="flex flex-col gap-4 bg-surface p-7">
                    <p className="text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                      Die Zehnjahresfrist läuft nicht neu an – maßgeblich ist der
                      Anschaffungszeitpunkt des Erblassers. Hatte dieser die Immobilie länger als
                      zehn Jahre, ist der Verkauf einkommensteuerfrei.
                    </p>
                    <p className="border-l-2 border-accent-500 pl-4 text-[0.9375rem] font-light leading-relaxed text-ink">
                      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-accent-600">Ausnahme </span>
                      Bei durchgehender Selbstnutzung im Verkaufsjahr und den beiden Vorjahren
                      entfällt die Steuer ebenfalls.
                    </p>
                  </div>
                </div>
              </section>

              {/* Verkaufen oder behalten */}
              <section aria-labelledby="entscheidung">
                <SectionIntro eyebrow="Die Entscheidung" id="entscheidung" title="Verkaufen oder behalten?" />
                <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-2">
                  <div className="bg-surface p-7">
                    <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Für das Behalten spricht</p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {keep.map((k) => (
                        <li key={k} className="flex items-center gap-3 text-[0.9375rem] font-light text-ink">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-line-strong text-[var(--color-success)]">
                            <IconCheck size={12} />
                          </span>
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-surface p-7">
                    <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Dagegen spricht</p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {sell.map((s) => (
                        <li key={s} className="flex items-center gap-3 text-[0.9375rem] font-light text-ink">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-line-strong text-[var(--color-danger)]">
                            <IconClose size={12} />
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-6 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Rechnen Sie beides durch, bevor Sie entscheiden – inklusive der
                  Instandhaltungskosten der nächsten zehn Jahre.
                </p>
                <ButtonLink href="/immobilienbewertung" variant="ghost" className="mt-5">
                  Unabhängige Bewertung anfragen
                </ButtonLink>
              </section>
            </div>

            <SellSubnav current="immobilie-geerbt" />
          </div>
        </Container>
      </Section>

      <SellTopicsGrid exclude="immobilie-geerbt" />

      <CTASection
        eyebrow="Kostenlose Ersteinschätzung"
        title="Was ist Ihre Immobilie heute wert?"
        description="Eine neutrale Zahl ist die Grundlage jeder Entscheidung in der Erbengemeinschaft. Wir schätzen die geerbte Immobilie kostenlos und nachvollziehbar ein."
        primaryLabel="Bewertung starten"
        primaryHref="/immobilienbewertung"
        secondaryLabel="Beratung vereinbaren"
        secondaryHref="/kontakt"
      />
    </>
  );
}
