import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findReviews, getReviewSummary } from "@/lib/repositories/reviews";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { CTASection } from "@/components/marketing/CTASection";
import { IconInfo } from "@/components/icons";

export const metadata: Metadata = {
  title: "Erfahrungen unserer Kunden",
  description:
    "Was Eigentümer und Käufer über die Zusammenarbeit mit WohnWert Immobilien berichten – Bewertungen aus Verkauf, Kauf, Vermietung und Bewertung.",
  alternates: { canonical: "/bewertungen" },
  openGraph: {
    title: "Erfahrungen unserer Kunden – WohnWert Immobilien",
    description: "Kundenbewertungen aus Verkauf, Kauf, Vermietung und Immobilienbewertung.",
    url: `${site.url}/bewertungen`,
  },
};

// Wird zur Laufzeit gerendert und danach zwischengespeichert:
// der Build-Container hat keine Datenbankverbindung.
export const revalidate = 600;
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [reviews, summary] = await Promise.all([findReviews(), getReviewSummary()]);

  return (
    <>
      <Section className="pb-0">
        <Container size="wide">
          <Reveal>
            <span className="eyebrow">Erfahrungen unserer Kunden</span>
            <h1 className="page-title mt-4 max-w-3xl text-balance text-primary-950">
              Was Eigentümer über uns sagen
            </h1>
            <p className="lead mt-5 max-w-2xl">
              Jede Bewertung stammt von einer Person, die wir tatsächlich begleitet haben –
              beim Verkauf, beim Kauf, bei der Vermietung oder bei einer Bewertung. Auch die
              kritischen Stimmen lassen wir stehen.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10">
              <ReviewSummary
                average={summary.average}
                total={summary.total}
                distribution={summary.distribution}
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-8">
        <Container size="wide">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delay={(i % 3) * 90}>
                <ReviewCard review={review} className="h-full" />
              </Reveal>
            ))}
          </div>

          {/* Transparenzhinweis: Demo-Daten klar kennzeichnen */}
          <p className="mt-12 flex items-start gap-3 rounded-[var(--radius-md)] border border-line bg-surface-muted px-5 py-4 text-[0.8125rem] leading-relaxed text-ink-muted">
            <IconInfo size={17} className="mt-0.5 shrink-0 text-primary-500" />
            <span>
              <strong className="font-medium text-primary-900">Hinweis zu diesem Musterprojekt:</strong>{" "}
              Die hier gezeigten Bewertungen sind Beispieldaten und dienen ausschließlich der
              Demonstration. In einem produktiven Einsatz werden an dieser Stelle ausschließlich
              echte, verifizierte Kundenbewertungen ausgegeben.
            </span>
          </p>
        </Container>
      </Section>

      <CTASection
        eyebrow="Jetzt Beratung vereinbaren"
        title="Möchten Sie ähnliche Erfahrungen machen?"
        description="Das erste Gespräch ist unverbindlich und kostet Sie nichts außer zwanzig Minuten. Danach wissen Sie, woran Sie sind."
        primaryLabel="Beratung vereinbaren"
        primaryHref="/kontakt"
        secondaryLabel="Immobilie bewerten lassen"
        secondaryHref="/immobilienbewertung"
      />
    </>
  );
}
