import "server-only";
import type { LeadSource } from "@prisma/client";
import { prisma } from "@/lib/db";
import type {
  ContactInput,
  PropertyInquiryInput,
  SearchProfileInput,
  ValuationInput,
} from "@/lib/validations/forms";
import { propertyTypeLabels } from "@/lib/labels";
import { valuationService } from "@/lib/services/valuation";
import { pushLeadToConfiguredCrms } from "@/lib/services/lead-push";

/** Objektanfrage von einer Immobilien-Detailseite. */
export async function createPropertyLead(input: PropertyInquiryInput) {
  const property = await prisma.property.findUnique({
    where: { id: input.propertyId },
    select: { id: true, agentId: true, title: true },
  });

  if (!property) {
    throw new Error("Die angefragte Immobilie ist nicht mehr verfügbar.");
  }

  const lead = await prisma.lead.create({
    data: {
      source: "OBJEKTANFRAGE" satisfies LeadSource,
      firstName: input.firstName || null,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message || null,
      propertyId: property.id,
      agentId: property.agentId,
      privacyAccepted: true,
    },
  });
  void pushLeadToConfiguredCrms("property_inquiry", { ...lead, propertyTitle: property.title });
  return lead;
}

/** Verkaufs- und Bewertungsfunnel. */
export async function createValuationRequest(input: ValuationInput) {
  const request = await prisma.valuationRequest.create({
    data: {
      funnel: input.funnel,
      propertyType: input.propertyType,
      street: input.street || null,
      zipCode: input.zipCode,
      city: input.city,
      livingArea: input.livingArea ?? null,
      plotArea: input.plotArea ?? null,
      rooms: input.rooms ?? null,
      yearBuilt: input.yearBuilt ?? null,
      condition: input.condition ?? null,
      sellingIntent: input.sellingIntent ?? null,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message || null,
      privacyAccepted: true,
    },
  });

  // Zusaetzlich als Lead fuehren, damit alle Anfragen an einer Stelle sichtbar sind.
  await prisma.lead.create({
    data: {
      source: input.funnel === "VERKAUF" ? "VERKAUFSFUNNEL" : "BEWERTUNGSFUNNEL",
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      message:
        input.message ||
        `Anfrage aus dem ${input.funnel === "VERKAUF" ? "Verkaufsfunnel" : "Bewertungsfunnel"} – ${input.zipCode} ${input.city}`,
      privacyAccepted: true,
    },
  });

  // Optionale Schaetzung ueber das abstrahierte Bewertungs-Interface.
  const estimate = await valuationService.estimate({
    propertyType: input.propertyType,
    zipCode: input.zipCode,
    city: input.city,
    livingArea: input.livingArea,
    plotArea: input.plotArea,
    rooms: input.rooms,
    yearBuilt: input.yearBuilt,
    condition: input.condition,
  });

  if (estimate) {
    await prisma.valuationRequest.update({
      where: { id: request.id },
      data: {
        estimatedValueMin: estimate.min,
        estimatedValueMax: estimate.max,
        valuationProvider: estimate.provider,
      },
    });
  }

  void pushLeadToConfiguredCrms("valuation", { request, estimate });
  return { request, estimate };
}

export async function createContactRequest(input: ContactInput) {
  const contact = await prisma.contactRequest.create({
    data: {
      subject: input.subject || null,
      firstName: input.firstName || null,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message,
      privacyAccepted: true,
    },
  });

  await prisma.lead.create({
    data: {
      source: "KONTAKTFORMULAR",
      firstName: input.firstName || null,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message,
      privacyAccepted: true,
    },
  });

  void pushLeadToConfiguredCrms("contact", contact);
  return contact;
}

/**
 * Suchprofil aus dem Kontakt-Funnel. Wird zusaetzlich als Lead gefuehrt und –
 * sofern konfiguriert – an die angebundenen CRM-Systeme uebergeben.
 */
export async function createSearchProfile(input: SearchProfileInput) {
  const criteria = {
    marketingType: input.marketingType,
    propertyTypes: input.propertyTypes,
    regions: input.regions,
    zipCode: input.zipCode || null,
    radiusKm: input.radiusKm ?? null,
    priceMin: input.priceMin ?? null,
    priceMax: input.priceMax ?? null,
    roomsMin: input.roomsMin ?? null,
    areaMin: input.areaMin ?? null,
    plotAreaMin: input.plotAreaMin ?? null,
  };

  const label = buildSearchProfileLabel(input);

  const profile = await prisma.savedSearch.create({
    data: {
      label,
      // Rohkriterien fuer einen spaeteren automatischen Objektabgleich
      query: criteria,
      marketingType: input.marketingType,
      propertyTypes: input.propertyTypes,
      regions: input.regions,
      zipCode: input.zipCode || null,
      radiusKm: input.radiusKm ?? null,
      priceMin: input.priceMin ?? null,
      priceMax: input.priceMax ?? null,
      roomsMin: input.roomsMin ?? null,
      areaMin: input.areaMin ?? null,
      plotAreaMin: input.plotAreaMin ?? null,
      timeframe: input.timeframe ?? null,
      financing: input.financing ?? null,
      ownUse: input.ownUse,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message || null,
      notifyByEmail: input.notifyByEmail,
      privacyAccepted: true,
    },
  });

  // Auch als Lead fuehren, damit alle Anfragen an einer Stelle auflaufen.
  await prisma.lead.create({
    data: {
      source: "SUCHPROFIL",
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message || `Suchprofil: ${label}`,
      privacyAccepted: true,
    },
  });

  void pushLeadToConfiguredCrms("search_profile", { profile, criteria });
  return profile;
}

/** Kurzbeschreibung des Gesuchs, z. B. "Kauf · Haus, Wohnung · Köln bis 750.000 €". */
function buildSearchProfileLabel(input: SearchProfileInput): string {
  const types = input.propertyTypes.map((t) => propertyTypeLabels[t]).join(", ");
  const where = input.regions.length
    ? input.regions.join(", ")
    : input.zipCode
      ? `PLZ ${input.zipCode}`
      : "ohne Ortsangabe";
  const budget =
    input.priceMax !== undefined
      ? ` bis ${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(input.priceMax)}`
      : "";
  return `${input.marketingType === "MIETE" ? "Miete" : "Kauf"} · ${types} · ${where}${budget}`.slice(0, 200);
}
