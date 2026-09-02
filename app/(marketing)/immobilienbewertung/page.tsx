import type { Metadata } from "next";
import { site } from "@/lib/site";
import { FunnelLayout } from "@/components/funnel/FunnelLayout";
import { ValuationFunnel } from "@/components/funnel/ValuationFunnel";
import { FAQ } from "@/components/marketing/FAQ";
import { CTASection } from "@/components/marketing/CTASection";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { IconCompass, IconTrend, IconValuation } from "@/components/icons";

export const metadata: Metadata = {
  title: "Kostenlose Immobilienbewertung im Rheinland",
  description:
    "Was ist Ihre Immobilie wert? Kostenlose und unverbindliche Bewertung auf Basis tatsächlich erzielter Kaufpreise – für Köln, Bonn und das Rheinland.",
  alternates: { canonical: "/immobilienbewertung" },
  openGraph: {
    title: "Kostenlose Immobilienbewertung – WohnWert Immobilien",
    description:
      "Nachvollziehbare Wertermittlung mit Vergleichsobjekten statt Wunschpreisen aus Portalen.",
    url: `${site.url}/immobilienbewertung`,
  },
};

const methods = [
  {
    icon: IconTrend,
    title: "Vergleichswertverfahren",
    text: "Maßgeblich bei Wohnimmobilien: Wir ziehen tatsächlich erzielte Kaufpreise vergleichbarer Objekte aus der Kaufpreissammlung des Gutachterausschusses heran.",
  },
  {
    icon: IconValuation,
    title: "Ertragswertverfahren",
    text: "Bei vermieteten Objekten zählt der Ertrag: nachhaltig erzielbare Miete abzüglich Bewirtschaftungskosten, kapitalisiert über den Liegenschaftszinssatz.",
  },
  {
    icon: IconCompass,
    title: "Sachwertverfahren",
    text: "Für Objekte ohne echten Vergleichsmarkt: Herstellungskosten abzüglich Alterswertminderung, zuzüglich Bodenwert.",
  },
];

const valuationFaq = [
  {
    question: "Warum liegen Online-Rechner so oft daneben?",
    answer:
      "Ein Algorithmus, der nur PLZ, Fläche und Baujahr verarbeitet, kann das Objekt nicht sehen. Er weiß nicht, ob die Fenster nach Norden zeigen, wie laut die Straße nachts ist oder wann das Bad zuletzt erneuert wurde. Für eine Größenordnung reicht das – für eine Verkaufsentscheidung nicht.",
  },
  {
    question: "Muss jemand die Immobilie besichtigen?",
    answer:
      "Für eine belastbare Bewertung ja. Wir starten mit Ihren Angaben und einer Marktanalyse; für die finale Einschätzung sehen wir uns das Objekt an. Der Termin dauert etwa eine Stunde.",
  },
  {
    question: "Bekomme ich eine Zahl oder eine Spanne?",
    answer:
      "Eine Spanne, und zwar mit Begründung. Wer eine punktgenaue Zahl nennt, suggeriert eine Genauigkeit, die der Markt nicht hergibt. Wir zeigen Ihnen die Vergleichsobjekte, aus denen sich die Spanne ergibt.",
  },
  {
    question: "Ist die Bewertung wirklich kostenlos?",
    answer:
      "Ja, und sie ist an keine Bedingung geknüpft. Wir sehen sie als Teil der Beratung. Ob daraus ein Auftrag entsteht, entscheiden allein Sie.",
  },
];

export default function ValuationPage() {
  return (
    <>
      <FunnelLayout
        eyebrow="Immobilienbewertung"
        title="Was ist Ihre Immobilie wert?"
        description="Kostenlos, unverbindlich und ohne Verpflichtung. Beantworten Sie einige Fragen – wir erstellen daraus eine fundierte Einschätzung und erläutern Ihnen, wie sie zustande kommt."
        benefits={[
          "Basiert auf tatsächlich erzielten Kaufpreisen, nicht auf Angebotspreisen",
          "Ergebnis als nachvollziehbare Spanne mit Vergleichsobjekten",
          "Rückmeldung innerhalb eines Werktages",
          "Auch sinnvoll, wenn ein Verkauf noch weit entfernt ist",
        ]}
      >
        <ValuationFunnel variant="BEWERTUNG" />
      </FunnelLayout>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Methodik"
              title="Wie ein Immobilienwert entsteht"
              description="Drei anerkannte Verfahren – welches greift, hängt von Objekt und Nutzung ab."
            />
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {methods.map((m, i) => {
              const Icon = m.icon;
              return (
                <Reveal key={m.title} delay={i * 100}>
                  <div className="flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-primary-700">
                      <Icon size={22} />
                    </span>
                    <h3 className="text-[1.0625rem] font-medium text-primary-950">{m.title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">{m.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <FAQ
        items={valuationFaq}
        tone="muted"
        eyebrow="Häufige Fragen"
        title="Was Eigentümer zur Bewertung fragen"
      />

      <CTASection
        eyebrow="Lieber direkt sprechen?"
        title="Manches klärt ein Telefonat schneller."
        description="Wenn Sie Ihre Situation lieber persönlich schildern möchten: Wir nehmen uns die Zeit – auch abends nach Absprache."
        primaryLabel="Termin vereinbaren"
        primaryHref="/kontakt"
        secondaryLabel={site.contact.phone}
        secondaryHref={site.contact.phoneHref}
      />
    </>
  );
}
