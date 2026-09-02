import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findBlogCategories, findBlogPosts } from "@/lib/repositories/blog";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/marketing/CTASection";
import { IconArrowRight, IconClock } from "@/components/icons";

export const metadata: Metadata = {
  title: "Ratgeber für Eigentümer und Käufer",
  description:
    "Verständlich erklärt: Ablauf des Immobilienverkaufs, Wertermittlung, Maklerprovision, Unterlagen, Erbfall und Energieausweis.",
  alternates: { canonical: "/ratgeber" },
  openGraph: {
    title: "Immobilien-Ratgeber – WohnWert Immobilien",
    description: "Konkrete Antworten auf die häufigsten Fragen rund um Immobilien.",
    url: `${site.url}/ratgeber`,
  },
};

export const revalidate = 600;

export default async function RatgeberPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const [posts, categories] = await Promise.all([
    findBlogPosts({ category: kategorie }),
    findBlogCategories(),
  ]);

  const [lead, ...rest] = posts;

  return (
    <>
      <Section className="pb-0">
        <Container size="wide">
          <Reveal>
            <span className="eyebrow">Ratgeber</span>
            <h1 className="page-title mt-4 max-w-3xl text-balance text-primary-950">
              Wissen, das vor der Entscheidung hilft
            </h1>
            <p className="lead mt-5 max-w-2xl">
              Konkrete Antworten auf die Fragen, die uns Eigentümer und Käufer am häufigsten
              stellen – ohne Marketingfloskeln und mit belastbaren Zahlen.
            </p>
          </Reveal>

          {/* Kategoriefilter */}
          <Reveal delay={80}>
            <nav aria-label="Kategorien" className="mt-9 flex flex-wrap gap-2">
              <Link
                href="/ratgeber"
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                  !kategorie
                    ? "border-primary-800 bg-primary-800 text-white"
                    : "border-line-strong text-ink-muted hover:border-primary-300 hover:text-primary-800",
                )}
              >
                Alle Themen
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/ratgeber?kategorie=${c.slug}`}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                    kategorie === c.slug
                      ? "border-primary-800 bg-primary-800 text-white"
                      : "border-line-strong text-ink-muted hover:border-primary-300 hover:text-primary-800",
                  )}
                >
                  {c.name}
                  <span className="ml-1.5 text-[0.75rem] opacity-60">{c._count.posts}</span>
                </Link>
              ))}
            </nav>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-8">
        <Container size="wide">
          {posts.length === 0 ? (
            <p className="rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface-muted px-6 py-16 text-center text-ink-muted">
              In dieser Kategorie sind noch keine Artikel veröffentlicht.
            </p>
          ) : (
            <>
              {/* Aufmacher */}
              {lead ? (
                <Reveal>
                  <article className="group grid gap-8 overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface lg:grid-cols-2">
                    <Link
                      href={`/ratgeber/${lead.slug}`}
                      className="relative aspect-[16/10] overflow-hidden bg-surface-sunken lg:aspect-auto lg:min-h-80"
                    >
                      {lead.coverImage ? (
                        <Image
                          src={lead.coverImage}
                          alt=""
                          fill
                          priority
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </Link>
                    <div className="flex flex-col justify-center gap-4 p-7 sm:p-9 lg:pr-12">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-500">
                        {lead.category?.name ?? "Ratgeber"}
                      </p>
                      <h2 className="heading-4 text-balance text-primary-950">
                        <Link href={`/ratgeber/${lead.slug}`} className="hover:text-primary-700">
                          {lead.title}
                        </Link>
                      </h2>
                      <p className="text-[1rem] leading-relaxed text-ink-muted">{lead.excerpt}</p>
                      <p className="flex items-center gap-4 text-[0.8125rem] text-ink-subtle">
                        <span>{formatDate(lead.publishedAt)}</span>
                        <span className="flex items-center gap-1.5">
                          <IconClock size={14} />
                          {lead.readingMinutes} Min.
                        </span>
                      </p>
                      <Link
                        href={`/ratgeber/${lead.slug}`}
                        className="mt-1 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-primary-800"
                      >
                        Artikel lesen
                        <IconArrowRight
                          size={17}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ) : null}

              {rest.length > 0 ? (
                <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((post, i) => (
                    <Reveal key={post.id} delay={(i % 3) * 90}>
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
                              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                              className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.04]"
                            />
                          ) : null}
                        </Link>
                        <div className="mt-5 flex flex-1 flex-col">
                          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-500">
                            {post.category?.name ?? "Ratgeber"}
                          </p>
                          <h2 className="heading-4 mt-2.5 leading-snug text-primary-950">
                            <Link href={`/ratgeber/${post.slug}`} className="hover:text-primary-700">
                              {post.title}
                            </Link>
                          </h2>
                          <p className="mt-2.5 line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                            {post.excerpt}
                          </p>
                          <p className="mt-4 flex items-center gap-4 text-[0.8125rem] text-ink-subtle">
                            <span>{formatDate(post.publishedAt)}</span>
                            <span className="flex items-center gap-1.5">
                              <IconClock size={14} />
                              {post.readingMinutes} Min.
                            </span>
                          </p>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </Container>
      </Section>

      <CTASection
        eyebrow="Individuelle Frage?"
        title="Manches steht in keinem Ratgeber."
        description="Wenn Ihre Situation komplizierter ist als der Standardfall – Erbengemeinschaft, Scheidung, vermietetes Objekt – sprechen wir sie am besten persönlich durch."
        primaryLabel="Beratung vereinbaren"
        primaryHref="/kontakt"
        secondaryLabel="Immobilie bewerten lassen"
        secondaryHref="/immobilienbewertung"
      />
    </>
  );
}
