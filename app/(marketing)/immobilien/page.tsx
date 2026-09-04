import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/lib/site";
import {
  findProperties,
  findPropertyCities,
  findPropertyMapMarkers,
} from "@/lib/repositories/properties";
import { countActiveFilters, parsePropertySearchParams, type RawSearchParams } from "@/lib/search-params";
import { formatArea, formatNumber, formatPrice, formatRooms } from "@/lib/utils";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  PropertyEmptyState,
  PropertyGrid,
  PropertyGridSkeleton,
} from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { CTASection } from "@/components/marketing/CTASection";
import { PropertyOverviewMap } from "@/components/map/PropertyOverviewMap";
import type { MapMarker } from "@/components/map/PropertyMap";
import { PropertySort } from "./PropertySort";
import { Pagination } from "./Pagination";

export const metadata: Metadata = {
  title: "Immobilienangebote in Köln, Bonn und dem Rheinland",
  description:
    "Aktuelle Häuser, Wohnungen, Grundstücke und Gewerbeimmobilien zum Kauf und zur Miete – kuratiert und persönlich betreut von WohnWert Immobilien.",
  alternates: { canonical: "/immobilien" },
  openGraph: {
    title: "Immobilienangebote im Rheinland",
    description:
      "Aktuelle Häuser, Wohnungen und Gewerbeimmobilien zum Kauf und zur Miete im Rheinland.",
    url: `${site.url}/immobilien`,
  },
};

export const revalidate = 120;

/**
 * Karte zu den aktuellen Filtern. Laeuft in einer eigenen Suspense-Grenze,
 * damit sie die Trefferliste nicht ausbremst.
 */
async function PropertyMapSection({ searchParams }: { searchParams: RawSearchParams }) {
  const query = parsePropertySearchParams(searchParams);
  const rows = await findPropertyMapMarkers(query);

  const markers: MapMarker[] = rows.map((row) => ({
    id: row.id,
    latitude: row.latitude as number,
    longitude: row.longitude as number,
    title: row.title,
    href: `/immobilien/${row.slug}`,
    imageUrl: row.images[0]?.url,
    subtitle: [
      row.priceOnRequest ? "Preis auf Anfrage" : formatPrice(row.price),
      row.livingArea ? formatArea(row.livingArea) : null,
      row.rooms ? `${formatRooms(row.rooms)} Zi.` : null,
      `${row.zipCode} ${row.city}`,
    ]
      .filter(Boolean)
      .join(" · "),
  }));

  return <PropertyOverviewMap markers={markers} className="mb-8" />;
}

async function PropertyResults({ searchParams }: { searchParams: RawSearchParams }) {
  const query = parsePropertySearchParams(searchParams);
  const { items, total, page, pageCount, perPage } = await findProperties(query);

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  if (items.length === 0) {
    return (
      <PropertyEmptyState
        action={
          <ButtonLink href="/immobilien" variant="outline">
            Filter zurücksetzen
          </ButtonLink>
        }
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-[0.875rem] text-ink-muted">
        <span className="font-medium text-primary-900">{formatNumber(total)}</span>{" "}
        {total === 1 ? "Objekt" : "Objekte"} gefunden
        {total > perPage ? (
          <span className="text-ink-subtle">
            {" "}
            · angezeigt {from}–{to}
          </span>
        ) : null}
      </p>

      <PropertyGrid properties={items} />

      <div className="mt-14">
        <Pagination page={page} pageCount={pageCount} searchParams={searchParams} />
      </div>
    </>
  );
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const cities = await findPropertyCities();
  const activeCount = countActiveFilters(params);

  // Suspense-Key: erzwingt einen neuen Ladezustand bei Filterwechsel
  const key = JSON.stringify(params);

  return (
    <>
      <Section className="pb-0">
        <Container size="wide">
          <Reveal>
            <span className="eyebrow">Aktuelle Angebote</span>
            <h1 className="page-title mt-4 max-w-3xl text-balance text-primary-950">
              Immobilien im Rheinland
            </h1>
            <p className="lead mt-5 max-w-2xl">
              Häuser, Wohnungen, Grundstücke und Gewerbeobjekte in Köln, Bonn, Düsseldorf und
              dem Umland. Ein Teil unserer Objekte wird ohne öffentliche Vermarktung vermittelt –
              sprechen Sie uns an, wenn Sie gezielt suchen.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-8">
        <Container size="wide">
          <div className="grid gap-8 lg:grid-cols-[19rem_1fr] lg:gap-12">
            <aside>
              <PropertyFilters cities={cities} activeCount={activeCount} />
            </aside>

            <div>
              <div className="mb-8 flex items-center justify-between gap-4 lg:justify-end">
                <PropertySort />
              </div>

              <Suspense key={`map-${key}`} fallback={null}>
                <PropertyMapSection searchParams={params} />
              </Suspense>

              <Suspense key={key} fallback={<PropertyGridSkeleton />}>
                <PropertyResults searchParams={params} />
              </Suspense>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        eyebrow="Noch nicht das Richtige gefunden?"
        title="Wir kennen Objekte, die nie öffentlich werden."
        description="Ein spürbarer Teil unserer Verkäufe findet ohne Portal statt. Sagen Sie uns, was Sie suchen – wir melden uns, sobald etwas Passendes in die Vermarktung geht."
        primaryLabel="Suchprofil hinterlegen"
        primaryHref="/suchprofil"
        secondaryLabel="Persönlich beraten lassen"
        secondaryHref="/kontakt"
      />
    </>
  );
}
