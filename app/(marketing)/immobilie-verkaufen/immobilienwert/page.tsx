import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findSellTopic } from "@/lib/content/sell-topics";
import { SubpageHeader } from "@/components/marketing/SubpageHeader";
import { SellSubnav } from "@/components/marketing/SellSubnav";
import { SellTopicsGrid } from "@/components/marketing/SellTopicsGrid";
import { CTASection } from "@/components/marketing/CTASection";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconCheck, IconClose } from "@/components/icons";

const topic = findSellTopic("immobilienwert")!;

const excerpt =
  "Vergleichswert, Ertragswert, Sachwert: Welches Verfahren wann greift – und warum Online-Rechner systematisch danebenliegen.";

export const metadata: Metadata = {
  title: "Immobilienwert ermitteln: Vergleichs-, Ertrags- und Sachwert",
  description:
    "Wie der Wert einer Immobilie ermittelt wird: die drei anerkannten Verfahren, ihre Anwendungsfälle und die Grenzen von Online-Bewertungen.",
  alternates: { canonical: topic.href },
  openGraph: {
    title: "Was ist meine Immobilie wert? Die drei Verfahren erklärt – WohnWert Immobilien",
    description: excerpt,
    url: `${site.url}${topic.href}`,
  },
};

const methods = [
  {
    title: "Vergleichswertverfahren",
    when: "Selbstgenutzte Wohnimmobilien und Eigentumswohnungen – hier ist es maßgeblich.",
    how: "Herangezogen werden tatsächlich erzielte Kaufpreise vergleichbarer Objekte aus der Kaufpreissammlung des Gutachterausschusses.",
    note: "Entscheidend ist die Qualität der Vergleichsobjekte: gleiche Lage, ähnliche Größe, vergleichbares Baujahr und Ausstattungsniveau. Je weniger vergleichbare Verkäufe es gibt, desto unsicherer wird das Ergebnis.",
  },
  {
    title: "Ertragswertverfahren",
    when: "Vermietete Objekte – im Vordergrund steht nicht der Gebrauchswert, sondern der Ertrag.",
    how: "Ausgangspunkt ist die nachhaltig erzielbare Jahresnettokaltmiete, von der Bewirtschaftungskosten abgezogen werden. Das Ergebnis wird über einen Liegenschaftszinssatz kapitalisiert.",
  },
  {
    title: "Sachwertverfahren",
    when: "Vor allem Objekte ohne echten Vergleichsmarkt.",
    how: "Gerechnet wird, was es kosten würde, das Gebäude neu zu errichten – abzüglich Alterswertminderung, zuzüglich Bodenwert.",
  },
];

const factors = [
  "Zustand und Modernisierungsstand",
  "Grundriss und Nutzbarkeit der Fläche",
  "Energetische Qualität – seit 2022 mit deutlich gestiegenem Gewicht",
  "Ausstattungsniveau",
  "Besonderheiten wie Blick, Ausrichtung, Ruhe",
];

const online = {
  can: ["Verarbeitet PLZ, Fläche und Baujahr", "Liefert eine Größenordnung", "Kann für einen ersten Eindruck genügen"],
  cannot: [
    "Kann das Objekt nicht sehen",
    "Weiß nicht, dass die Fenster nach Norden zeigen",
    "Weiß nicht, dass die Straße nachts laut ist",
    "Weiß nicht, dass das Bad 1978 zuletzt erneuert wurde",
    "Reicht für eine Verkaufsentscheidung nicht aus",
  ],
};

const onsite = {
  can: [
    "Beruht auf einer Besichtigung",
    "Nennt konkrete Vergleichsobjekte",
    "Erklärt Zu- und Abschläge nachvollziehbar",
    "Gibt eine Spanne statt einer Punktzahl an",
    "Trägt eine Verkaufsentscheidung",
  ],
  cannot: ["Ist nicht in Sekunden erledigt – ein Termin vor Ort gehört dazu"],
};

const seriousChecklist = [
  { title: "Besichtigung", text: "Sie beruht auf einer Besichtigung des Objekts – nicht auf Formulardaten." },
  { title: "Vergleichsobjekte", text: "Sie nennt die Vergleichsobjekte, aus denen sich das Ergebnis ableitet." },
  { title: "Nachvollziehbare Zu- und Abschläge", text: "Sie erklärt, warum ein Merkmal den Wert hebt oder senkt." },
  { title: "Spanne statt Punktzahl", text: "Sie gibt eine Spanne an, keine scheingenaue Einzelzahl." },
  { title: "Unabhängigkeit", text: "Sie ist unabhängig davon, ob daraus ein Auftrag entsteht." },
];

function CompareList({ items, tone }: { items: string[]; tone: "can" | "cannot" }) {
  const Icon = tone === "can" ? IconCheck : IconClose;
  return (
    <ul className="mt-3 flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
          <span
            className={
              "mt-1 flex h-5 w-5 shrink-0 items-center justify-center border " +
              (tone === "can" ? "border-accent-500 text-accent-500" : "border-line-strong text-ink-subtle")
            }
          >
            <Icon size={11} strokeWidth={1.75} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PropertyValuePage() {
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
                Der Satz „Meine Nachbarn haben für ihr Haus 780.000 Euro bekommen“ ist der
                häufigste Einstieg in ein Bewertungsgespräch. Er ist auch der häufigste Irrtum –
                denn zwei Häuser in derselben Straße können sich im Wert um 30 Prozent
                unterscheiden.
              </p>

              {/* Drei Verfahren */}
              <div className="mt-14">
                <span className="eyebrow">Die drei anerkannten Verfahren</span>
                <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-3">
                  {methods.map((m, i) => (
                    <article key={m.title} className="flex flex-col gap-5 bg-surface p-6 sm:p-7">
                      <span className="font-[family-name:var(--font-display)] text-[1.75rem] leading-none text-accent-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="heading-4 text-ink">{m.title}</h2>
                      <div className="border-t border-line pt-4">
                        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-accent-500">Wann?</p>
                        <p className="mt-1.5 text-[0.9375rem] font-light leading-relaxed text-ink-muted">{m.when}</p>
                      </div>
                      <div className="border-t border-line pt-4">
                        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-accent-500">Wie?</p>
                        <p className="mt-1.5 text-[0.9375rem] font-light leading-relaxed text-ink-muted">{m.how}</p>
                      </div>
                      {m.note ? (
                        <p className="mt-auto border-l border-accent-500 pl-4 text-[0.875rem] font-light leading-relaxed text-ink">
                          {m.note}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>

              {/* Was den Wert bewegt */}
              <div className="mt-16 border-t border-line-strong pt-12">
                <span className="eyebrow">Was den Wert bewegt</span>
                <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12">
                  <div className="bg-surface-muted p-6 sm:p-8">
                    <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Faktor Nr. 1</p>
                    <p className="mt-3 font-[family-name:var(--font-display)] text-[3.25rem] leading-none text-accent-500 sm:text-[4rem]">
                      40–60 %
                    </p>
                    <p className="mt-3 display-3 text-ink">Die Lage</p>
                    <p className="mt-2 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                      Die Lage bestimmt bei Wohnimmobilien 40 bis 60 Prozent des Wertes. Danach
                      folgen in dieser Reihenfolge fünf weitere Faktoren.
                    </p>
                  </div>
                  <ol className="divide-y divide-line border-y border-line">
                    {factors.map((f, i) => (
                      <li key={f} className="flex items-baseline gap-5 py-4">
                        <span className="w-8 shrink-0 font-[family-name:var(--font-display)] text-[1.25rem] leading-none text-accent-500">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <span className="text-[0.9375rem] font-light leading-relaxed text-ink">{f}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Online vs. vor Ort */}
              <div className="mt-16 border-t border-line-strong pt-12">
                <span className="eyebrow">Online-Rechner vs. Bewertung vor Ort</span>
                <p className="mt-4 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Ein Algorithmus, der PLZ, Fläche und Baujahr verarbeitet, kann kein Objekt sehen.
                  Solche Rechner liefern eine Größenordnung, keine Bewertung.
                </p>
                <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-2">
                  <div className="bg-surface p-6 sm:p-7">
                    <h3 className="heading-4 text-ink">Online-Rechner</h3>
                    <p className="mt-1 text-[0.8125rem] font-light text-ink-subtle">PLZ, Fläche, Baujahr</p>
                    <p className="mt-5 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Kann</p>
                    <CompareList items={online.can} tone="can" />
                    <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Kann nicht</p>
                    <CompareList items={online.cannot} tone="cannot" />
                  </div>
                  <div className="bg-surface-muted p-6 sm:p-7">
                    <h3 className="heading-4 text-ink">Bewertung vor Ort</h3>
                    <p className="mt-1 text-[0.8125rem] font-light text-ink-subtle">Besichtigung, Vergleichsobjekte, Spanne</p>
                    <p className="mt-5 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Kann</p>
                    <CompareList items={onsite.can} tone="can" />
                    <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Kann nicht</p>
                    <CompareList items={onsite.cannot} tone="cannot" />
                  </div>
                </div>
              </div>

              {/* Seriöse Bewertung */}
              <div className="mt-16 border-t border-line-strong pt-12">
                <span className="eyebrow">Was eine seriöse Bewertung ausmacht</span>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {seriousChecklist.map((item) => (
                    <li key={item.title} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[1.5rem_14rem_minmax(0,1fr)] sm:gap-6">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center border border-accent-500 text-accent-500">
                        <IconCheck size={13} strokeWidth={1.75} />
                      </span>
                      <span className="text-[0.9375rem] font-normal text-ink">{item.title}</span>
                      <span className="col-start-2 text-[0.9375rem] font-light leading-relaxed text-ink-muted sm:col-start-3">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                    Genau so arbeiten wir: kostenlos, mit Vergleichsobjekten und einer begründeten
                    Spanne – unabhängig davon, ob daraus ein Auftrag entsteht.
                  </p>
                  <ButtonLink href="/immobilienbewertung" size="lg" variant="primary" className="shrink-0">
                    Bewertung starten
                    <IconArrowRight size={18} />
                  </ButtonLink>
                </div>
              </div>
            </div>

            <SellSubnav current="immobilienwert" />
          </div>
        </Container>
      </Section>

      <SellTopicsGrid exclude="immobilienwert" />

      <CTASection
        eyebrow="Kostenlose Ersteinschätzung"
        title="Was ist Ihre Immobilie heute wert?"
        description="Keine Punktzahl aus dem Algorithmus, sondern eine nachvollziehbare Spanne mit Vergleichsobjekten – kostenlos und unverbindlich."
        primaryLabel="Bewertung starten"
        primaryHref="/immobilienbewertung"
        secondaryLabel="Beratung vereinbaren"
        secondaryHref="/kontakt"
      />
    </>
  );
}
