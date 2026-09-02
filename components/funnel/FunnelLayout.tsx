import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { IconCheck, IconShield } from "@/components/icons";

export function FunnelLayout({
  eyebrow,
  title,
  description,
  benefits,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  children: ReactNode;
}) {
  return (
    <div className="bg-surface-muted py-10 sm:py-14 lg:py-18">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
          {/* Begleitende Argumentation – auf Mobile ueber dem Formular gekuerzt */}
          <aside className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="funnel-title mt-4 hyphens-auto break-words text-balance text-primary-950" lang="de">
              {title}
            </h1>
            <p className="lead mt-5">{description}</p>

            <ul className="mt-8 flex flex-col gap-3.5">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                    <IconCheck size={12} strokeWidth={3} />
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-muted">{benefit}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 flex items-start gap-2.5 border-t border-line pt-6 text-[0.8125rem] leading-relaxed text-ink-subtle">
              <IconShield size={16} className="mt-0.5 shrink-0 text-primary-500" />
              Ihre Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht
              an Dritte weitergegeben.
            </p>
          </aside>

          <div className="min-w-0 rounded-[var(--radius-xl)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
