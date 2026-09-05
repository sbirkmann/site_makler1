import Link from "next/link";
import { cn } from "@/lib/utils";
import { sellTopics } from "@/lib/content/sell-topics";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/icons";

/**
 * Seitenleiste auf den Verkaufs-Unterseiten: alle Themen der Rubrik,
 * das aktuelle hervorgehoben, darunter der Einstieg in die Bewertung.
 */
export function SellSubnav({ current, className }: { current: string; className?: string }) {
  return (
    <aside className={cn("lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]", className)}>
      <p className="font-[family-name:var(--font-display)] text-[0.9375rem] font-medium uppercase tracking-[0.16em] text-accent-500">
        Immobilie verkaufen
      </p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        <li>
          <Link
            href="/immobilie-verkaufen"
            className="flex items-center justify-between gap-3 py-3 text-[0.9375rem] font-light text-ink transition-colors hover:text-accent-600"
          >
            Überblick &amp; Ersteinschätzung
            <IconArrowRight size={14} className="shrink-0 text-ink-subtle" />
          </Link>
        </li>
        {sellTopics.map((topic) => {
          const active = topic.slug === current;
          return (
            <li key={topic.slug}>
              <Link
                href={topic.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 py-3 text-[0.9375rem] transition-colors",
                  active ? "font-normal text-accent-600" : "font-light text-ink hover:text-accent-600",
                )}
              >
                {topic.label}
                {active ? (
                  <span aria-hidden="true" className="h-px w-6 shrink-0 bg-accent-500" />
                ) : (
                  <IconArrowRight size={14} className="shrink-0 text-ink-subtle" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 bg-surface-muted p-6">
        <p className="text-[0.9375rem] font-normal text-ink">Was ist Ihre Immobilie wert?</p>
        <p className="mt-2 text-[0.875rem] font-light leading-relaxed text-ink-muted">
          Kostenlose Ersteinschätzung auf Basis tatsächlich erzielter Kaufpreise – Rückmeldung
          innerhalb eines Werktages.
        </p>
        <ButtonLink href="/immobilienbewertung" size="md" variant="primary" className="mt-5 w-full">
          Bewertung starten
        </ButtonLink>
      </div>
    </aside>
  );
}
