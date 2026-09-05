import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

/**
 * Seitenkopf fuer Inhaltsseiten: Brotkrumen, Serifen-Versalien als
 * Rubrik, helle Grotesk-Headline und Einleitung. Optional ein
 * randabfallendes Bild darunter.
 */
export function SubpageHeader({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
  children,
  className,
}: {
  breadcrumbs: { label: string; href?: string }[];
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("bg-surface pt-10 sm:pt-14 lg:pt-18", className)}>
      <Container size="narrow" className="flex flex-col items-center text-center">
        <nav aria-label="Brotkrumen" className="mb-6">
          <ol className="flex flex-wrap items-center justify-center gap-x-2 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">
            {breadcrumbs.map((crumb, i) => (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true" className="text-accent-500">/</span> : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-accent-600">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink-muted">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-title mt-4 max-w-3xl text-balance text-ink">{title}</h1>
        {lead ? <p className="lead mt-5 max-w-2xl text-pretty">{lead}</p> : null}
        {children}
      </Container>
      {image ? (
        <div className="mx-auto mt-10 w-full max-w-[1630px] px-5 sm:px-8 lg:mt-14 lg:px-10">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface-sunken">
            <Image src={image} alt={imageAlt ?? ""} fill sizes="100vw" className="object-cover" priority />
          </div>
        </div>
      ) : null}
    </header>
  );
}
