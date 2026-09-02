import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findFeaturedProperties, findPropertyCities } from "@/lib/repositories/properties";
import { findReviews, getReviewSummary } from "@/lib/repositories/reviews";
import { findBlogPosts } from "@/lib/repositories/blog";
import { formatDate } from "@/lib/utils";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PropertyCarousel } from "@/components/property/PropertyGrid";
import { Hero } from "@/components/marketing/Hero";
import { TrustBar } from "@/components/marketing/TrustBar";
import { Credentials } from "@/components/marketing/Credentials";
import { Services } from "@/components/marketing/Services";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQ } from "@/components/marketing/FAQ";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { RatingStars } from "@/components/reviews/RatingStars";
import { IconArrowRight, IconShield, IconTrend, IconValuation } from "@/components/icons";

export const metadata: Metadata = {
  title: `${site.name} – Immobilienmakler in Köln, Bonn und dem Rheinland`,
  description: site.description,
  alternates: { canonical: "/" },
};

// Wird zur Laufzeit gerendert und danach zwischengespeichert:
// der Build-Container hat keine Datenbankverbindung.
export const revalidate = 300;
export const dynamic = "force-dynamic";

const values = [
  {
    icon: IconShield,
    title: "Ehrlich statt optimistisch",
    text: "Wir nennen den Preis, der erzielbar ist – nicht den, der einen Auftrag sichert. Das kostet uns gelegentlich Mandate und erspart Ihnen Monate auf dem Markt.",
  },
  {
    icon: IconTrend,
    title: "Marktkenntnis mit Belegen",
    text: "Jede Einschätzung stützt sich auf tatsächlich erzielte Kaufpreise aus der Kaufpreissammlung, nicht auf Angebotspreise aus Portalen.",
  },
  {
    icon: IconValuation,
    title: "Ein Ansprechpartner",
    text: "Von der Bewertung bis zur Schlüsselübergabe betreut Sie dieselbe Person. Keine Übergaben, keine wechselnden Zuständigkeiten.",
  },
];

export default async function HomePage() {
  const [featured, cities, reviews, summary, posts] = await Promise.all([
    findFeaturedProperties(6),
    findPropertyCities(),
    findReviews(3),
    getReviewSummary(),
    findBlogPosts({ take: 3 }),
  ]);

  return (
    <>
      <Hero cities={cities} />

      <Credentials />

      <Services />

      <TrustBar />

      {/* Ausgewaehlte Objekte */}
      <Section tone="muted">
        <Container size="wide">
          <Reveal>
            <SectionHeading
              eyebrow="Aktuelle Auswahl"
              title="Objekte, die wir derzeit betreuen"
              description="Ein Ausschnitt unseres Portfolios. Ein Teil unserer Immobilien wird ohne öffentliche Vermarktung vermittelt – sprechen Sie uns an, wenn Sie gezielt suchen."
              action={
                <ButtonLink href="/immobilien" variant="outline" size="md">
                  Alle Immobilien
                  <IconArrowRight size={17} />
                </ButtonLink>
              }
            />
          </Reveal>
          <PropertyCarousel properties={featured} className="mt-8" />
        </Container>
      </Section>

      {/* Werte */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <SectionHeading
                eyebrow="Unsere Arbeitsweise"
                title="Warum Eigentümer sich für uns entscheiden"
                description="Immobilienverkauf ist kein Massengeschäft. Wir nehmen wenige Mandate an und betreuen diese dafür vollständig."
              />
            </Reveal>
            <div className="flex flex-col gap-8">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <Reveal key={value.title} delay={i * 100}>
                    <div className="flex gap-5 border-b border-line pb-8 last:border-0 last:pb-0">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface text-primary-600 shadow-[var(--shadow-subtle)]">
                        <Icon size={22} />
                      </span>
                      <div>
                        <h3 className="text-[1.125rem] font-medium text-primary-950">
                          {value.title}
                        </h3>
                        <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-ink-muted">
                          {value.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* Bewertungs-CTA */}
      <CTASection
        variant="split"
        eyebrow="Kostenlose Ersteinschätzung"
        title="Was ist Ihre Immobilie heute wert?"
        description="In fünf Minuten beantworten Sie ein paar Fragen zu Ihrer Immobilie. Wir melden uns innerhalb von 24 Stunden mit einer fundierten Einschätzung – nachvollziehbar hergeleitet und ohne Verpflichtung."
        primaryLabel="Bewertung starten"
        primaryHref="/immobilienbewertung"
        secondaryLabel="So gehen wir vor"
        secondaryHref="/ratgeber/was-ist-meine-immobilie-wert"
        image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Wohnraum mit Blick in den Garten"
      />

      {/* Prozess */}
      <Section id="ablauf" tone="muted">
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

      {/* Bewertungen-Teaser */}
      <Section>
        <Container size="wide">
          <Reveal>
            <SectionHeading
              eyebrow="Erfahrungen unserer Kunden"
              title="Was Eigentümer über uns sagen"
              description={
                <span className="flex flex-wrap items-center gap-3">
                  <RatingStars rating={summary.average} size={18} />
                  <span>
                    <strong className="font-medium text-primary-900">
                      {summary.average.toFixed(1).replace(".", ",")} von 5
                    </strong>{" "}
                    aus {summary.total} Bewertungen
                  </span>
                </span>
              }
              action={
                <ButtonLink href="/bewertungen" variant="outline" size="md">
                  Alle Bewertungen
                  <IconArrowRight size={17} />
                </ButtonLink>
              }
            />
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delay={i * 100}>
                <ReviewCard review={review} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Ratgeber */}
      <Section tone="muted">
        <Container size="wide">
          <Reveal>
            <SectionHeading
              eyebrow="Ratgeber"
              title="Wissen, das vor der Entscheidung hilft"
              description="Konkrete Antworten auf die Fragen, die uns Eigentümer am häufigsten stellen."
              action={
                <ButtonLink href="/ratgeber" variant="outline" size="md">
                  Alle Artikel
                  <IconArrowRight size={17} />
                </ButtonLink>
              }
            />
          </Reveal>
          <ul className="hide-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2">
            {posts.map((post) => (
              <li key={post.id} className="w-[335px] shrink-0 snap-start">
                <article className="group flex h-full flex-col">
                  <Link
                    href={`/ratgeber/${post.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] bg-surface-sunken"
                  >
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </Link>
                  <div className="mt-5 flex flex-1 flex-col">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-500">
                      {post.category?.name ?? "Ratgeber"}
                    </p>
                    <h3 className="heading-4 mt-2.5 leading-snug text-primary-950">
                      <Link href={`/ratgeber/${post.slug}`} className="hover:text-primary-700">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 text-[0.8125rem] text-ink-subtle">
                      {formatDate(post.publishedAt)} · {post.readingMinutes} Min. Lesezeit
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FAQ />

      <CTASection
        eyebrow="Persönlich statt anonym"
        title="Lassen Sie sich persönlich beraten."
        description="Ein Gespräch verpflichtet zu nichts – klärt aber oft mehr als drei Wochen Recherche. Wir nehmen uns die Zeit."
        primaryLabel="Termin vereinbaren"
        primaryHref="/kontakt"
        secondaryLabel={site.contact.phone}
        secondaryHref={site.contact.phoneHref}
      />
    </>
  );
}
