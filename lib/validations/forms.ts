import { z } from "zod";

const requiredString = (label: string, min = 2) =>
  z.string().trim().min(min, `Bitte ${label} angeben.`).max(200);

export const privacySchema = z
  .union([z.literal("on"), z.literal("true"), z.boolean()])
  .transform(() => true)
  .refine((v) => v === true, "Bitte stimmen Sie der Datenschutzerklärung zu.");

const emailSchema = z
  .string()
  .trim()
  .min(1, "Bitte E-Mail-Adresse angeben.")
  .email("Bitte eine gültige E-Mail-Adresse angeben.")
  .max(200);

const phoneSchema = z
  .string()
  .trim()
  .max(60)
  .regex(/^[0-9+()/\s.-]{5,}$/, "Bitte eine gültige Telefonnummer angeben.");

const optionalPhone = z
  .union([phoneSchema, z.literal("")])
  .optional()
  .transform((v) => (v ? v : undefined));

/** Honeypot: von Menschen nie ausgefuellt. */
export const honeypotSchema = z
  .string()
  .max(0, "Ungültige Eingabe.")
  .optional()
  .or(z.literal(""));

/* ---------------------------------------------------------------- Objekt */

export const propertyInquirySchema = z.object({
  propertyId: z.string().min(1),
  firstName: z.string().trim().max(100).optional().or(z.literal("")),
  lastName: requiredString("Ihren Namen"),
  email: emailSchema,
  phone: optionalPhone,
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  privacyAccepted: privacySchema,
  website: honeypotSchema,
});
export type PropertyInquiryInput = z.infer<typeof propertyInquirySchema>;

/* --------------------------------------------------------------- Kontakt */

export const contactSchema = z.object({
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  firstName: z.string().trim().max(100).optional().or(z.literal("")),
  lastName: requiredString("Ihren Namen"),
  email: emailSchema,
  phone: optionalPhone,
  message: z.string().trim().min(10, "Bitte beschreiben Sie Ihr Anliegen kurz.").max(4000),
  privacyAccepted: privacySchema,
  website: honeypotSchema,
});
export type ContactInput = z.infer<typeof contactSchema>;

/* ---------------------------------------------------------------- Funnel */

export const propertyTypeEnum = z.enum([
  "HAUS",
  "WOHNUNG",
  "MEHRFAMILIENHAUS",
  "GRUNDSTUECK",
  "GEWERBE",
]);

export const conditionEnum = z.enum([
  "NEUWERTIG",
  "SANIERT",
  "GEPFLEGT",
  "RENOVIERUNGSBEDUERFTIG",
  "ABRISSOBJEKT",
]);

export const sellingIntentEnum = z.enum([
  "BALD_VERKAUFEN",
  "INFORMIEREN",
  "PROFESSIONELLE_BEWERTUNG",
  "KONKRETES_OBJEKT",
]);

const numberFromInput = (label: string, min: number, max: number) =>
  z
    .union([z.number(), z.string()])
    .transform((v) => {
      if (typeof v === "number") return v;
      const cleaned = v.replace(/\./g, "").replace(",", ".").trim();
      if (!cleaned) return NaN;
      return Number(cleaned);
    })
    .refine((v) => Number.isFinite(v), `Bitte ${label} als Zahl angeben.`)
    .refine((v) => v >= min && v <= max, `Bitte ${label} realistisch angeben.`);

/**
 * Optionales Zahlenfeld: leerer String, null und fehlender Wert ergeben
 * `undefined`; alles andere wird geparst und geprueft.
 */
const optionalNumber = (label: string, min: number, max: number) =>
  z
    .union([z.literal(""), z.null(), numberFromInput(label, min, max)])
    .optional()
    .transform((v) => (v === "" || v === null || v === undefined ? undefined : (v as number)));

export const valuationSchema = z.object({
  funnel: z.enum(["BEWERTUNG", "VERKAUF"]).default("BEWERTUNG"),
  propertyType: propertyTypeEnum,
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Bitte eine 5-stellige Postleitzahl angeben."),
  city: requiredString("den Ort"),
  street: z.string().trim().max(200).optional().or(z.literal("")),
  livingArea: optionalNumber("die Wohnfläche", 5, 100000),
  plotArea: optionalNumber("die Grundstücksfläche", 10, 1000000),
  rooms: optionalNumber("die Zimmerzahl", 1, 100),
  yearBuilt: optionalNumber("das Baujahr", 1500, new Date().getFullYear() + 3),
  condition: conditionEnum.optional(),
  sellingIntent: sellingIntentEnum.optional(),
  firstName: requiredString("Ihren Vornamen"),
  lastName: requiredString("Ihren Nachnamen"),
  email: emailSchema,
  phone: optionalPhone,
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  privacyAccepted: privacySchema,
  website: honeypotSchema,
});
export type ValuationInput = z.infer<typeof valuationSchema>;

/* ----------------------------------------------------------------- Admin */

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(4, "Bitte Passwort eingeben."),
});

export const adminPropertySchema = z.object({
  title: requiredString("einen Titel", 4),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.")
    .min(3)
    .max(160),
  shortDescription: requiredString("eine Kurzbeschreibung", 10),
  description: requiredString("eine Beschreibung", 20),
  marketingType: z.enum(["KAUF", "MIETE"]),
  propertyType: propertyTypeEnum,
  status: z.enum(["VERFUEGBAR", "RESERVIERT", "VERKAUFT", "VERMIETET", "IN_VORBEREITUNG"]),
  price: optionalNumber("den Preis", 0, 1_000_000_000),
  priceOnRequest: z.coerce.boolean().default(false),
  livingArea: optionalNumber("die Wohnfläche", 0, 100000),
  plotArea: optionalNumber("die Grundstücksfläche", 0, 1000000),
  rooms: optionalNumber("die Zimmerzahl", 0, 200),
  bedrooms: optionalNumber("die Schlafzimmer", 0, 100),
  bathrooms: optionalNumber("die Badezimmer", 0, 100),
  yearBuilt: optionalNumber("das Baujahr", 1200, new Date().getFullYear() + 5),
  street: z.string().trim().max(200).optional().or(z.literal("")),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Bitte eine 5-stellige Postleitzahl angeben."),
  city: requiredString("die Stadt"),
  region: z.string().trim().max(120).optional().or(z.literal("")),
  featured: z.coerce.boolean().default(false),
  agentId: z.string().trim().optional().or(z.literal("")),
  imageUrls: z.string().trim().max(4000).optional().or(z.literal("")),
  highlights: z.string().trim().max(2000).optional().or(z.literal("")),
  features: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type AdminPropertyInput = z.infer<typeof adminPropertySchema>;
