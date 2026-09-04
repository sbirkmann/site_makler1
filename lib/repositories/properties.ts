import "server-only";
import { Prisma, type MarketingType, type PropertyType } from "@prisma/client";
import { prisma } from "@/lib/db";

export const propertyCardSelect = {
  id: true,
  slug: true,
  title: true,
  shortDescription: true,
  marketingType: true,
  propertyType: true,
  status: true,
  price: true,
  priceOnRequest: true,
  livingArea: true,
  plotArea: true,
  rooms: true,
  city: true,
  region: true,
  zipCode: true,
  latitude: true,
  longitude: true,
  featured: true,
  publishedAt: true,
  images: {
    orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }],
    take: 1,
    select: { url: true, alt: true },
  },
} satisfies Prisma.PropertySelect;

export type PropertyCardData = Prisma.PropertyGetPayload<{
  select: typeof propertyCardSelect;
}>;

export type PropertySort = "neueste" | "preis-auf" | "preis-ab" | "flaeche";

export interface PropertyQuery {
  marketingType?: MarketingType;
  propertyType?: PropertyType[];
  city?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  minArea?: number;
  featuredOnly?: boolean;
  sort?: PropertySort;
  page?: number;
  perPage?: number;
}

function buildWhere(query: PropertyQuery): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {
    publishedAt: { not: null, lte: new Date() },
  };

  if (query.marketingType) where.marketingType = query.marketingType;
  if (query.propertyType?.length) where.propertyType = { in: query.propertyType };
  if (query.featuredOnly) where.featured = true;

  if (query.city) {
    where.OR = [
      { city: { contains: query.city, mode: "insensitive" } },
      { region: { contains: query.city, mode: "insensitive" } },
      { zipCode: { startsWith: query.city } },
    ];
  }

  if (query.q) {
    where.AND = [
      {
        OR: [
          { title: { contains: query.q, mode: "insensitive" } },
          { shortDescription: { contains: query.q, mode: "insensitive" } },
          { city: { contains: query.q, mode: "insensitive" } },
        ],
      },
    ];
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined ? { gte: new Prisma.Decimal(query.minPrice) } : {}),
      ...(query.maxPrice !== undefined ? { lte: new Prisma.Decimal(query.maxPrice) } : {}),
    };
  }

  if (query.minRooms !== undefined) where.rooms = { gte: query.minRooms };
  if (query.minArea !== undefined) where.livingArea = { gte: query.minArea };

  return where;
}

function buildOrderBy(sort: PropertySort = "neueste"): Prisma.PropertyOrderByWithRelationInput[] {
  switch (sort) {
    // Objekte ohne Preis ("auf Anfrage") sollen bei Preissortierung
    // immer ans Ende, nicht ans Anfang der Liste.
    case "preis-auf":
      return [{ price: { sort: "asc", nulls: "last" } }, { publishedAt: "desc" }];
    case "preis-ab":
      return [{ price: { sort: "desc", nulls: "last" } }, { publishedAt: "desc" }];
    case "flaeche":
      return [{ livingArea: { sort: "desc", nulls: "last" } }, { publishedAt: "desc" }];
    default:
      return [{ featured: "desc" }, { publishedAt: "desc" }];
  }
}

export async function findProperties(query: PropertyQuery) {
  const perPage = Math.min(Math.max(query.perPage ?? 9, 1), 48);
  const page = Math.max(query.page ?? 1, 1);
  const where = buildWhere(query);

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      select: propertyCardSelect,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
    pageCount: Math.max(Math.ceil(total / perPage), 1),
  };
}

export async function findFeaturedProperties(take = 6) {
  return prisma.property.findMany({
    where: { publishedAt: { not: null }, featured: true },
    orderBy: [{ publishedAt: "desc" }],
    select: propertyCardSelect,
    take,
  });
}

export async function findLatestProperties(take = 6) {
  return prisma.property.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ publishedAt: "desc" }],
    select: propertyCardSelect,
    take,
  });
}

export async function findPropertyBySlug(slug: string) {
  return prisma.property.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: {
      images: { orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }] },
      documents: { orderBy: { createdAt: "asc" } },
      agent: true,
    },
  });
}

export async function findSimilarProperties(property: {
  id: string;
  propertyType: PropertyType;
  marketingType: MarketingType;
  city: string;
}) {
  const sameCity = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      publishedAt: { not: null },
      marketingType: property.marketingType,
      OR: [{ city: property.city }, { propertyType: property.propertyType }],
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    select: propertyCardSelect,
    take: 3,
  });

  if (sameCity.length >= 3) return sameCity;

  const fill = await prisma.property.findMany({
    where: {
      id: { notIn: [property.id, ...sameCity.map((p) => p.id)] },
      publishedAt: { not: null },
    },
    orderBy: [{ publishedAt: "desc" }],
    select: propertyCardSelect,
    take: 3 - sameCity.length,
  });

  return [...sameCity, ...fill];
}

export async function findAllPropertySlugs() {
  return prisma.property.findMany({
    where: { publishedAt: { not: null } },
    select: { slug: true, updatedAt: true },
  });
}

/** Distinkte Staedte fuer Filter-Dropdowns. */
export async function findPropertyCities() {
  const rows = await prisma.property.findMany({
    where: { publishedAt: { not: null } },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return rows.map((r) => r.city);
}

export async function countProperties() {
  return prisma.property.count({ where: { publishedAt: { not: null } } });
}

/**
 * Objekte mit bekannter Position fuer die Uebersichtskarte. Bewusst ohne
 * Paginierung: die Karte soll alle Treffer der aktuellen Filter zeigen,
 * die Obergrenze schuetzt vor uebergrossen Antworten.
 */
export async function findPropertyMapMarkers(query: PropertyQuery, take = 300) {
  return prisma.property.findMany({
    where: {
      ...buildWhere(query),
      latitude: { not: null },
      longitude: { not: null },
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      city: true,
      zipCode: true,
      price: true,
      priceOnRequest: true,
      marketingType: true,
      livingArea: true,
      rooms: true,
      latitude: true,
      longitude: true,
      images: {
        orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }],
        take: 1,
        select: { url: true },
      },
    },
    take,
  });
}

export type PropertyMapMarkerData = Awaited<ReturnType<typeof findPropertyMapMarkers>>[number];

/** Anzahl der Objekte ohne Geokoordinaten (fuer das Backend-Dashboard). */
export async function countPropertiesWithoutCoordinates() {
  return prisma.property.count({
    where: { OR: [{ latitude: null }, { longitude: null }] },
  });
}
