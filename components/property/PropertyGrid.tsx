import type { PropertyCardData } from "@/lib/repositories/properties";
import { cn } from "@/lib/utils";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";

export function PropertyGrid({
  properties,
  className,
  animate = true,
  priorityCount = 3,
}: {
  properties: PropertyCardData[];
  className?: string;
  animate?: boolean;
  priorityCount?: number;
}) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {properties.map((property, i) =>
        animate ? (
          <Reveal key={property.id} delay={(i % 3) * 90}>
            <PropertyCard property={property} priority={i < priorityCount} className="h-full" />
          </Reveal>
        ) : (
          <PropertyCard
            key={property.id}
            property={property}
            priority={i < priorityCount}
            className="h-full"
          />
        ),
      )}
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface"
        >
          <div className="aspect-[4/3] animate-pulse bg-surface-sunken" />
          <div className="flex flex-col gap-3 p-6">
            <div className="h-3 w-20 animate-pulse rounded bg-surface-sunken" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-surface-sunken" />
            <div className="h-3 w-full animate-pulse rounded bg-surface-sunken" />
            <div className="mt-4 h-6 w-32 animate-pulse rounded bg-surface-sunken" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PropertyEmptyState({
  title = "Keine passenden Immobilien gefunden",
  description = "Passen Sie die Filter an oder lassen Sie sich benachrichtigen, sobald ein passendes Objekt in die Vermarktung geht.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface-muted px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-ink-subtle shadow-[var(--shadow-subtle)]">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="10.6" cy="10.6" r="6.1" />
          <path d="m15.1 15.1 4.6 4.6M8.4 10.6h4.4" />
        </svg>
      </div>
      <div className="max-w-md">
        <h3 className="heading-4 text-primary-950">{title}</h3>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

/**
 * Horizontal scrollbare Reihe – wie in der Referenz fuer die
 * Objekt-Teaser auf der Startseite verwendet.
 */
export function PropertyCarousel({
  properties,
  className,
}: {
  properties: PropertyCardData[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2",
        className,
      )}
    >
      {properties.map((property, i) => (
        <li key={property.id} className="w-[335px] shrink-0 snap-start sm:w-[380px]">
          <PropertyCard property={property} priority={i < 3} className="h-full" />
        </li>
      ))}
    </ul>
  );
}
