import Image from "next/image";
import Link from "next/link";
import type { PropertyCardData } from "@/lib/repositories/properties";
import { cn, formatArea, formatPrice, formatRooms } from "@/lib/utils";
import { marketingTypeLabels, propertyTypeLabels, statusLabels, statusTone } from "@/lib/labels";
import { Badge } from "@/components/ui/Badge";
import { IconArea, IconLocation, IconRooms } from "@/components/icons";

export function PropertyCard({
  property,
  priority = false,
  className,
}: {
  property: PropertyCardData;
  priority?: boolean;
  className?: string;
}) {
  const cover = property.images[0];
  const isRent = property.marketingType === "MIETE";
  const showStatus = property.status !== "VERFUEGBAR";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface",
        "transition-all duration-300 [transition-timing-function:var(--ease-out-quint)]",
        "hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-subtle">
            Kein Bild vorhanden
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="inverse">{marketingTypeLabels[property.marketingType]}</Badge>
            {property.featured ? <Badge tone="accent">Empfehlung</Badge> : null}
          </div>
          {showStatus ? (
            <Badge tone={statusTone[property.status] === "success" ? "success" : "inverse"}>
              {statusLabels[property.status]}
            </Badge>
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary-950/55 to-transparent" />
        <p className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 text-[0.8125rem] font-medium text-white">
          <IconLocation size={15} />
          {property.region ? `${property.region}, ${property.city}` : property.city}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-500">
          {propertyTypeLabels[property.propertyType]}
        </p>

        <h3 className="mt-2.5 text-[1.0625rem] font-medium leading-snug text-primary-950">
          <Link href={`/immobilien/${property.slug}`} className="before:absolute before:inset-0">
            <span className="line-clamp-2">{property.title}</span>
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 text-[0.875rem] leading-relaxed text-ink-muted">
          {property.shortDescription}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
          <p className="font-[family-name:var(--font-display)] text-[1.375rem] leading-none tracking-[-0.015em] text-primary-900">
            {property.priceOnRequest ? (
              <span className="text-[1.0625rem]">Preis auf Anfrage</span>
            ) : (
              <>
                {formatPrice(property.price)}
                {isRent ? (
                  <span className="ml-1 text-[0.8125rem] font-normal text-ink-subtle">/ Monat</span>
                ) : null}
              </>
            )}
          </p>

          <dl className="flex items-center gap-3.5 text-[0.8125rem] text-ink-muted">
            {property.livingArea || property.plotArea ? (
              <div className="flex items-center gap-1.5">
                <IconArea size={16} className="text-ink-subtle" />
                <dt className="sr-only">
                  {property.livingArea ? "Wohnfläche" : "Grundstücksfläche"}
                </dt>
                <dd>{formatArea(property.livingArea ?? property.plotArea)}</dd>
              </div>
            ) : null}
            {property.rooms ? (
              <div className="flex items-center gap-1.5">
                <IconRooms size={16} className="text-ink-subtle" />
                <dt className="sr-only">Zimmer</dt>
                <dd>{formatRooms(property.rooms)} Zi.</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </article>
  );
}
