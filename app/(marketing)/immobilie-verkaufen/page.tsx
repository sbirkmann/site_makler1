import type { Metadata } from "next";
import { site } from "@/lib/site";
import { FunnelLayout } from "@/components/funnel/FunnelLayout";
import { ValuationFunnel } from "@/components/funnel/ValuationFunnel";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { FAQ } from "@/components/marketing/FAQ";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SellTopicsGrid } from "@/components/marketing/SellTopicsGrid";

export const metadata: Metadata = {
  title: "Immobilie verkaufen in Köln, Bonn und dem Rheinland",
  description:
    "In wenigen Schritten zur kostenlosen Ersteinschätzung: Wir begleiten Ihren Immobilienverkauf von der Bewertung bis zur Schlüsselübergabe – ehrlich und vollständig.",
  alternates: { canonical: "/immobilie-verkaufen" },
  openGraph: {
    title: "Immobilie verkaufen – WohnWert Immobilien",
    description:
      "Kostenlose Ersteinschätzung und persönliche Begleitung beim Immobilienverkauf im Rheinland.",
    url: `${site.url}/immobilie-verkaufen`,
  },
};

const sellFaq = [
  {
    question: "Was kostet mich die Ersteinschätzung?",
    answer:
      "Nichts. Die Einschätzung ist kostenlos und unverbindlich – auch dann, wenn Sie sich danach gegen einen Verkauf oder gegen uns entscheiden.",
  },
  {
    question: "Muss ich mich nach der Anfrage zu etwas verpflichten?",
    answer:
      "Nein. Ein Maklervertrag entsteht erst, wenn Sie ihn ausdrücklich unterschreiben. Bis dahin sprechen wir unverbindlich.",
  },
  {
    question: "Wie schnell melden Sie sich?",
    answer:
      "In der Regel innerhalb eines Werktages. Wenn Sie eine Telefonnummer hinterlassen, rufen wir an – sonst antworten wir per E-Mail.",
  },
  {
    question: "Was, wenn ich noch gar nicht sicher bin, ob ich verkaufe?",
    answer:
      "Das ist der häufigste Fall. Viele Eigentümer sprechen ein bis zwei Jahre vor einem möglichen Verkauf mit uns. Genau dafür ist die Ersteinschätzung gedacht.",
  },
];

export default function SellPage() {
  return (
    <>
      <FunnelLayout
        eyebrow="Immobilie verkaufen"
        title="Was Ihre Immobilie heute wert ist – in fünf Minuten geklärt"
        description="Beantworten Sie ein paar Fragen zu Ihrer Immobilie. Wir melden uns mit einer nachvollziehbaren Einschätzung und sagen Ihnen ehrlich, was am Markt erzielbar ist."
        benefits={[
          "Kostenlos und unverbindlich – ohne Maklervertrag",
          "Einschätzung auf Basis tatsächlich erzielter Kaufpreise",
          "Persönliche Rückmeldung innerhalb eines Werktages",
          "Keine automatisierte Werbung, keine Weitergabe an Dritte",
        ]}
      >
        <ValuationFunnel variant="VERKAUF" />
      </FunnelLayout>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="So funktioniert es"
              title="Von der ersten Frage bis zur Schlüsselübergabe"
              description="Fünf Schritte, die wir bei jedem Mandat gehen – in Ihrem Tempo, mit klaren Zwischenständen."
            />
          </Reveal>
          <div className="mt-8">
            <ProcessSteps />
          </div>
        </Container>
      </Section>

      <SellTopicsGrid />

      <FAQ
        items={sellFaq}
        tone="default"
        eyebrow="Häufige Fragen"
        title="Was Eigentümer vor dem ersten Gespräch wissen wollen"
      />
    </>
  );
}
