import "server-only";
import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  const [
    propertyCount,
    publishedCount,
    featuredCount,
    newLeads,
    totalLeads,
    newValuations,
    totalValuations,
    newContacts,
    totalContacts,
    newSearchProfiles,
    totalSearchProfiles,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { publishedAt: { not: null } } }),
    prisma.property.count({ where: { featured: true } }),
    prisma.lead.count({ where: { status: "NEU" } }),
    prisma.lead.count(),
    prisma.valuationRequest.count({ where: { status: "NEU" } }),
    prisma.valuationRequest.count(),
    prisma.contactRequest.count({ where: { status: "NEU" } }),
    prisma.contactRequest.count(),
    prisma.savedSearch.count({ where: { status: "NEU" } }),
    prisma.savedSearch.count(),
  ]);

  return {
    propertyCount,
    publishedCount,
    featuredCount,
    newLeads,
    totalLeads,
    newValuations,
    totalValuations,
    newContacts,
    totalContacts,
    newSearchProfiles,
    totalSearchProfiles,
  };
}

export async function getRecentActivity() {
  const [leads, valuations, contacts, searchProfiles] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { property: { select: { title: true, slug: true } } },
    }),
    prisma.valuationRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.savedSearch.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return { leads, valuations, contacts, searchProfiles };
}

export async function getAdminProperties() {
  return prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      agent: { select: { firstName: true, lastName: true } },
      images: { take: 1, orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }] },
      _count: { select: { leads: true } },
    },
  });
}

export async function getAdminProperty(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }] } },
  });
}

export async function getAllRequests() {
  const [leads, valuations, contacts, searchProfiles] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { property: { select: { title: true, slug: true } } },
    }),
    prisma.valuationRequest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.savedSearch.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return { leads, valuations, contacts, searchProfiles };
}
