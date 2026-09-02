import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findBlogPostBySlug, findRelatedPosts } from "@/lib/repositories/blog";
import { formatDate } from "@/lib/utils";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/marketing/CTASection";
import { IconClock } from "@/components/icons";

// Seiten werden beim ersten Aufruf gerendert und danach zwischengespeichert.
// Kein generateStaticParams: der Build-Container hat keine Datenbankverbindung.
export const revalidate = 600;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlogPostBySlug(slug);
  if (!post) return { title: "Artikel nicht gefunden" };

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical: `/ratgeber/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      url: `${site.url}/ratgeber/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

/**
 * Sehr schlanker Markdown-Renderer fuer die Seed-Inhalte.
 * Bewusst ohne zusaetzliche Abhaengigkeit – unterstuetzt Ueberschriften,
 * Listen, Zitate und **fett**. Fuer redaktionelle Inhalte aus einem CMS
 * wuerde hier ein vollwertiger Parser stehen.
 */
function renderContent(content: string) {
  const blocks = content.split("\n\n");
  const nodes: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = (key: string) => {
    if (!listBuffer.length || !listType) return;
    const Tag = listType;
    nodes.push(
      <Tag key={key}>
        {listBuffer.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </Tag>,
    );
    listBuffer = [];
    listType = null;
  };

  blocks.forEach((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("### ")) {
      flushList(`l-${index}`);
      nodes.push(<h3 key={index}>{inline(trimmed.slice(4))}</h3>);
      return;
    }
    if (trimmed.startsWith("## ")) {
      flushList(`l-${index}`);
      nodes.push(<h2 key={index}>{inline(trimmed.slice(3))}</h2>);
      return;
    }
    if (trimmed.startsWith("> ")) {
      flushList(`l-${index}`);
      nodes.push(
        <blockquote key={index}>{inline(trimmed.replace(/^> ?/gm, ""))}</blockquote>,
      );
      return;
    }

    const lines = trimmed.split("\n");
    if (lines.every((l) => /^- /.test(l))) {
      flushList(`l-${index}`);
      listType = "ul";
      listBuffer = lines.map((l) => l.slice(2));
      flushList(`ul-${index}`);
      return;
    }
    if (lines.every((l) => /^\d+\.\s/.test(l))) {
      flushList(`l-${index}`);
      listType = "ol";
      listBuffer = lines.map((l) => l.replace(/^\d+\.\s/, ""));
      flushList(`ol-${index}`);
      return;
    }

    flushList(`l-${index}`);
    nodes.push(<p key={index}>{inline(trimmed)}</p>);
  });

  flushList("l-end");
  return nodes;
}

/** Unterstuetzt **fett** innerhalb eines Absatzes. */
function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default async function RatgeberArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await findBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await findRelatedPosts(post.id, post.categoryId);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author
      ? { "@type": "Person", name: `${post.author.firstName} ${post.author.lastName}` }
      : { "@type": "Organization", name: site.legalName },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
    mainEntityOfPage: `${site.url}/ratgeber/${post.slug}`,
  };

  return (
    <>
      <article>
        <Section className="pb-0 pt-10 sm:pt-14">
          <Container size="narrow">
            <nav
              aria-label="Brotkrumen"
              className="mb-6 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-subtle"
            >
              <Link href="/" className="hover:text-primary-800">Start</Link>
              <span aria-hidden="true">/</span>
              <Link href="/ratgeber" className="hover:text-primary-800">Ratgeber</Link>
              {post.category ? (
                <>
                  <span aria-hidden="true">/</span>
                  <Link
                    href={`/ratgeber?kategorie=${post.category.slug}`}
                    className="hover:text-primary-800"
                  >
                    {post.category.name}
                  </Link>
                </>
              ) : null}
            </nav>

            <h1 className="page-title text-balance text-primary-950">{post.title}</h1>

            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.875rem] text-ink-subtle">
              {post.author ? (
                <span className="flex items-center gap-2.5">
                  {post.author.imageUrl ? (
                    <Image
                      src={post.author.imageUrl}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : null}
                  <span className="text-ink-muted">
                    {post.author.firstName} {post.author.lastName}
                  </span>
                </span>
              ) : null}
              <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
              <span className="flex items-center gap-1.5">
                <IconClock size={15} />
                {post.readingMinutes} Min. Lesezeit
              </span>
            </p>
          </Container>
        </Section>

        {post.coverImage ? (
          <Section className="py-8">
            <Container size="wide">
              <div className="relative aspect-[16/8] overflow-hidden rounded-[var(--radius-xl)] bg-surface-sunken">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </Container>
          </Section>
        ) : null}

        <Section className="pt-8">
          <Container size="narrow">
            <p className="lead border-l-2 border-accent-400 pl-5">{post.excerpt}</p>
            <div className="prose-editorial mt-10">{renderContent(post.content)}</div>
          </Container>
        </Section>
      </article>

      {related.length > 0 ? (
        <Section tone="muted">
          <Container size="wide">
            <h2 className="display-2 text-primary-950">Weiterlesen</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.id} delay={i * 90}>
                  <article className="group flex h-full flex-col">
                    <Link
                      href={`/ratgeber/${item.slug}`}
                      className="relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] bg-surface-sunken"
                    >
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : null}
                    </Link>
                    <div className="mt-5">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-500">
                        {item.category?.name ?? "Ratgeber"}
                      </p>
                      <h3 className="mt-2.5 text-[1.0625rem] font-medium leading-snug text-primary-950">
                        <Link href={`/ratgeber/${item.slug}`} className="hover:text-primary-700">
                          {item.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CTASection
        eyebrow="Ihre Situation"
        title="Was bedeutet das konkret für Ihre Immobilie?"
        description="Allgemeine Antworten helfen bis zu einem gewissen Punkt. Für alles darüber hinaus nehmen wir uns Zeit."
        primaryLabel="Kostenlose Ersteinschätzung"
        primaryHref="/immobilienbewertung"
        secondaryLabel="Kontakt aufnehmen"
        secondaryHref="/kontakt"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
