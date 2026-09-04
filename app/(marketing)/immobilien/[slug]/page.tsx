import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findPropertyBySlug, findSimilarProperties } from "@/lib/repositories/properties";
import {
  conditionLabels,
  energyCertificateLabels,
  energyClassLabels,
  heatingLabels,
  marketingTypeLabels,
  propertyTypeLabels,
  statusLabels,
} from "@/lib/labels";
import { formatArea, formatNumber, formatPrice, formatRooms, toNumber } from "@/lib/utils";
import { Container, Section } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyFacts, FeatureList, type Fact } from "@/components/property/PropertyFacts";
import { PropertyInquiryForm } from "@/components/property/PropertyInquiryForm";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyMap } from "@/components/map/PropertyMap";
import {
  IconArea,
  IconBath,
  IconBed,
  IconDocument,
  IconEnergy,
  IconHeating,
  IconLand,
  IconLocation,
  IconMail,
  IconPhone,
  IconRooms,
  IconYear,
} from "@/components/icons";

// Seiten werden beim ersten Aufruf gerendert und danach zwischengespeichert.
// Kein generateStaticParams: der Build-Container hat keine Datenbankverbindung.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await findPropertyBySlug(slug);
  if (!property) return { title: "Immobilie nicht gefunden" };

  const price = property.priceOnRequest ? "Preis auf Anfrage" : formatPrice(property.price);
  const cover = property.images[0];

  return {
    title: property.title,
    description: property.shortDescription,
    alternates: { canonical: `/immobilien/${property.slug}` },
    openGraph: {
      type: "article",
      title: `${property.title} – ${price}`,
      description: property.shortDescription,
      url: `${site.url}/immobilien/${property.slug}`,
      images: cover ? [{ url: cover.url, alt: cover.alt }] : undefined,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await findPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await findSimilarProperties(property);
  const isRent = property.marketingType === "MIETE";

  const facts = ([
    property.livingArea
      ? { icon: <IconArea size={20} />, label: "Wohnfläche", value: formatArea(property.livingArea) }
      : null,
    property.plotArea
      ? { icon: <IconLand size={20} />, label: "Grundstück", value: formatArea(property.plotArea) }
      : null,
    property.usableArea
      ? { icon: <IconArea size={20} />, label: "Nutzfläche", value: formatArea(property.usableArea) }
      : null,
    property.rooms
      ? { icon: <IconRooms size={20} />, label: "Zimmer", value: formatRooms(property.rooms) }
      : null,
    property.bedrooms
      ? { icon: <IconBed size={20} />, label: "Schlafzimmer", value: String(property.bedrooms) }
      : null,
    property.bathrooms
      ? { icon: <IconBath size={20} />, label: "Badezimmer", value: String(property.bathrooms) }
      : null,
    property.yearBuilt
      ? { icon: <IconYear size={20} />, label: "Baujahr", value: String(property.yearBuilt) }
      : null,
    property.condition
      ? {
          icon: <IconDocument size={20} />,
          label: "Zustand",
          value: conditionLabels[property.condition],
        }
      : null,
  ] as (Fact | null)[]).filter((f): f is Fact => f !== null);

  const energyRows = [
    property.energyCertificateType
      ? { label: "Ausweistyp", value: energyCertificateLabels[property.energyCertificateType] }
      : null,
    property.energyEfficiencyClass
      ? { label: "Effizienzklasse", value: energyClassLabels[property.energyEfficiencyClass] }
      : null,
    property.energyConsumption
      ? {
          label: "Endenergiebedarf",
          value: `${formatNumber(property.energyConsumption, 0)} kWh/(m²·a)`,
        }
      : null,
    property.heatingType
      ? { label: "Heizungsart", value: heatingLabels[property.heatingType] }
      : null,
  ].filter((r): r is { label: string; value: string } => r !== null);

  const priceNumber = toNumber(property.price);
  const hasPosition =
    typeof property.latitude === "number" && typeof property.longitude === "number";

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": isRent ? "RentAction" : "Residence",
    name: property.title,
    description: property.shortDescription,
    url: `${site.url}/immobilien/${property.slug}`,
    image: property.images.map((i) => i.url),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.street ?? undefined,
      postalCode: property.zipCode,
      addressLocality: property.city,
      addressRegion: property.region ?? undefined,
      addressCountry: "DE",
    },
    ...(property.latitude && property.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          },
        }
      : {}),
    ...(property.livingArea
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: property.livingArea,
            unitCode: "MTK",
          },
        }
      : {}),
    ...(property.rooms ? { numberOfRooms: property.rooms } : {}),
    ...(priceNumber && !property.priceOnRequest
      ? {
          offers: {
            "@type": "Offer",
            price: priceNumber,
            priceCurrency: property.currency,
            availability:
              property.status === "VERFUEGBAR"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };

  return (
    <>
      {/* Kopfbereich */}
      <Section className="pb-0">
        <Container size="wide">
          <nav aria-label="Brotkrumen" className="mb-6 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-subtle">
            <Link href="/" className="hover:text-primary-800">Start</Link>
            <span aria-hidden="true">/</span>
            <Link href="/immobilien" className="hover:text-primary-800">Immobilien</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink-muted">{property.city}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{marketingTypeLabels[property.marketingType]}</Badge>
            <Badge tone="muted">{propertyTypeLabels[property.propertyType]}</Badge>
            {property.status !== "VERFUEGBAR" ? (
              <Badge tone="accent">{statusLabels[property.status]}</Badge>
            ) : null}
            {property.featured ? <Badge tone="accent">Empfehlung</Badge> : null}
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-3xl">
              <h1 className="page-title text-balance text-primary-950">{property.title}</h1>
              <p className="mt-4 flex items-center gap-2 text-[0.9375rem] text-ink-muted">
                <IconLocation size={17} className="shrink-0 text-primary-500" />
                {[property.street, `${property.zipCode} ${property.city}`, property.region]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            <div className="shrink-0 lg:text-right">
              <p className="font-[family-name:var(--font-display)] text-[2.25rem] leading-none tracking-[-0.02em] text-primary-900">
                {property.priceOnRequest ? "Auf Anfrage" : formatPrice(property.price)}
              </p>
              <p className="mt-2 text-[0.8125rem] text-ink-subtle">
                {isRent ? "Kaltmiete monatlich" : "Kaufpreis"}
                {isRent && property.serviceCharge
                  ? ` · zzgl. ${formatPrice(property.serviceCharge)} Nebenkosten`
                  : ""}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <PropertyGallery images={property.images} title={property.title} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_23rem] lg:gap-16">
            {/* Hauptspalte */}
            <div className="flex flex-col gap-14">
              <Reveal>
                <h2 className="sr-only">Eckdaten</h2>
                <PropertyFacts facts={facts} />
              </Reveal>

              <Reveal>
                <section>
                  <h2 className="heading-4 text-primary-950">Objektbeschreibung</h2>
                  <div className="prose-editorial mt-5">
                    {property.description.split("\n\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              </Reveal>

              {property.highlights.length > 0 ? (
                <Reveal>
                  <section>
                    <h2 className="heading-4 text-primary-950">Auf einen Blick</h2>
                    <ul className="mt-5 flex flex-col gap-3">
                      {property.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-3.5 rounded-[var(--radius-md)] border border-line bg-surface-muted px-4 py-3.5"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                          <span className="text-[0.9375rem] leading-relaxed text-ink">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              ) : null}

              {property.features.length > 0 ? (
                <Reveal>
                  <section>
                    <h2 className="heading-4 text-primary-950">Ausstattung</h2>
                    <FeatureList items={property.features} className="mt-5" />
                  </section>
                </Reveal>
              ) : null}

              {property.locationDescription || hasPosition ? (
                <Reveal>
                  <section>
                    <h2 className="heading-4 text-primary-950">Lage</h2>
                    {property.locationDescription ? (
                      <p className="mt-5 max-w-[68ch] text-[1.0625rem] leading-[1.78] text-ink">
                        {property.locationDescription}
                      </p>
                    ) : null}

                    {hasPosition ? (
                      <>
                        <PropertyMap
                          className="mt-6 aspect-[16/9] w-full"
                          approximate
                          zoom={14}
                          markers={[
                            {
                              id: property.id,
                              latitude: property.latitude as number,
                              longitude: property.longitude as number,
                              title: property.title,
                              subtitle: `${property.zipCode} ${property.city}`,
                            },
                          ]}
                        />
                        <p className="mt-3 text-[0.8125rem] text-ink-subtle">
                          Der markierte Bereich zeigt die ungefähre Lage. Die genaue Adresse
                          teilen wir im Rahmen der Besichtigung mit.
                        </p>
                      </>
                    ) : (
                      <div className="mt-6 flex aspect-[16/7] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface-muted">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <IconLocation size={26} className="text-primary-400" />
                          <p className="text-[0.875rem] font-medium text-ink-muted">
                            {property.zipCode} {property.city}
                            {property.region ? ` · ${property.region}` : ""}
                          </p>
                          <p className="max-w-xs text-[0.8125rem] text-ink-subtle">
                            Die genaue Adresse teilen wir im Rahmen der Besichtigung mit.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                </Reveal>
              ) : null}

              {energyRows.length > 0 ? (
                <Reveal>
                  <section>
                    <h2 className="heading-4 flex items-center gap-2.5 text-primary-950">
                      <IconEnergy size={22} className="text-accent-500" />
                      Energieinformationen
                    </h2>
                    <dl className="mt-5 divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line">
                      {energyRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between gap-6 px-5 py-4"
                        >
                          <dt className="text-[0.9375rem] text-ink-muted">{row.label}</dt>
                          <dd className="text-[0.9375rem] font-medium text-primary-950">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {property.heatingType ? (
                      <p className="mt-3 flex items-center gap-2 text-[0.8125rem] text-ink-subtle">
                        <IconHeating size={15} />
                        Angaben gemäß Gebäudeenergiegesetz (GEG).
                      </p>
                    ) : null}
                  </section>
                </Reveal>
              ) : null}

              {property.documents.length > 0 ? (
                <Reveal>
                  <section>
                    <h2 className="heading-4 text-primary-950">Grundriss & Dokumente</h2>
                    <ul className="mt-5 flex flex-col gap-3">
                      {property.documents.map((doc) => (
                        <li key={doc.id}>
                          <span className="flex items-center gap-4 rounded-[var(--radius-md)] border border-line px-5 py-4">
                            <IconDocument size={20} className="shrink-0 text-primary-600" />
                            <span className="flex-1 text-[0.9375rem] text-ink">{doc.title}</span>
                            <span className="text-[0.75rem] uppercase tracking-[0.08em] text-ink-subtle">
                              nach Anfrage
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[0.8125rem] text-ink-subtle">
                      Unterlagen stellen wir Ihnen nach kurzer Rücksprache vollständig zur Verfügung.
                    </p>
                  </section>
                </Reveal>
              ) : null}
            </div>

            {/* Seitenspalte: Ansprechpartner */}
            <aside className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
              {property.agent ? (
                <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-500">
                    Ihr Ansprechpartner
                  </p>
                  <div className="mt-5 flex items-center gap-4">
                    {property.agent.imageUrl ? (
                      <Image
                        src={property.agent.imageUrl}
                        alt={`${property.agent.firstName} ${property.agent.lastName}`}
                        width={72}
                        height={72}
                        className="h-18 w-18 shrink-0 rounded-full object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="text-[1.0625rem] font-medium text-primary-950">
                        {property.agent.firstName} {property.agent.lastName}
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-snug text-ink-muted">
                        {property.agent.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
                    {property.agent.phone ? (
                      <a
                        href={`tel:${property.agent.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-3 text-[0.875rem] text-ink-muted transition-colors hover:text-primary-800"
                      >
                        <IconPhone size={17} className="shrink-0 text-primary-500" />
                        {property.agent.phone}
                      </a>
                    ) : null}
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center gap-3 break-all text-[0.875rem] text-ink-muted transition-colors hover:text-primary-800"
                    >
                      <IconMail size={17} className="shrink-0 text-primary-500" />
                      {property.agent.email}
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 rounded-[var(--radius-lg)] border border-line bg-surface-muted p-6">
                <h2 className="heading-4 text-primary-950">Interesse an dieser Immobilie?</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
                  Schreiben Sie uns kurz – wir senden Ihnen das vollständige Exposé und stimmen
                  einen Besichtigungstermin ab.
                </p>
                <div className="mt-6">
                  <PropertyInquiryForm propertyId={property.id} propertyTitle={property.title} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {similar.length > 0 ? (
        <Section tone="muted">
          <Container size="wide">
            <h2 className="display-2 text-primary-950">Ähnliche Immobilien</h2>
            <PropertyGrid properties={similar} className="mt-8" priorityCount={0} />
          </Container>
        </Section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
    </>
  );
}
