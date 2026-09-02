import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export const generalFaq: AccordionItem[] = [
  {
    question: "Was kostet die Immobilienbewertung?",
    answer:
      "Die Bewertung ist für Sie kostenlos und unverbindlich – auch dann, wenn Sie sich anschließend gegen einen Verkauf oder gegen uns entscheiden. Wir sehen sie als Teil der Beratung, nicht als Verkaufsinstrument.",
  },
  {
    question: "Wie hoch ist die Maklerprovision?",
    answer:
      "Im Raum Köln/Bonn liegt die Gesamtprovision bei 5,95 % inklusive Mehrwertsteuer und wird seit der Gesetzesänderung von 2020 bei Wohnimmobilien hälftig zwischen Käufer und Verkäufer geteilt. Die Provision wird ausschließlich im Erfolgsfall fällig – scheitert der Verkauf, entstehen Ihnen keine Kosten.",
  },
  {
    question: "Wie lange dauert ein Verkauf im Durchschnitt?",
    answer:
      "Von der Beauftragung bis zur Beurkundung vergehen bei marktgerechter Preisfindung im Schnitt acht bis zwölf Wochen. Rechnen Sie zusätzlich zwei bis vier Wochen für die Beschaffung der Unterlagen und vier bis acht Wochen von der Beurkundung bis zur Übergabe.",
  },
  {
    question: "Kann meine Immobilie diskret vermarktet werden?",
    answer:
      "Ja. Bei einem Teil unserer Objekte verzichten wir vollständig auf Portale und Schilder und sprechen ausschließlich vorgemerkte Interessenten an. Das ist besonders dann sinnvoll, wenn Nachbarn, Mieter oder Mitarbeitende nicht informiert werden sollen.",
  },
  {
    question: "Welche Unterlagen benötige ich für den Verkauf?",
    answer:
      "Mindestens Grundbuchauszug, Flurkarte, Baupläne, Wohnflächenberechnung und Energieausweis; bei Eigentumswohnungen zusätzlich Teilungserklärung, Protokolle der letzten Eigentümerversammlungen und die Jahresabrechnungen. Wir übernehmen die Beschaffung für Sie – Sie unterschreiben lediglich die Vollmacht.",
  },
  {
    question: "Arbeiten Sie auch außerhalb von Köln und Bonn?",
    answer:
      "Unser Kerngebiet umfasst Köln, Bonn, Düsseldorf, Leverkusen, den Rhein-Sieg-Kreis und das Bergische Land. Objekte in der Eifel und im weiteren Umland betreuen wir ebenfalls, sprechen die Machbarkeit aber vorher offen mit Ihnen ab.",
  },
];

export function FAQ({
  items = generalFaq,
  eyebrow = "Häufige Fragen",
  title = "Was Eigentümer uns am häufigsten fragen",
  description,
  tone = "default",
}: {
  items?: AccordionItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "default" | "muted";
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <Section tone={tone}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          </Reveal>
          <Reveal delay={120}>
            <Accordion items={items} />
          </Reveal>
        </div>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </Section>
  );
}
