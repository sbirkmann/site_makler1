import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { findAllPropertySlugs } from "@/lib/repositories/properties";
import { findAllPostSlugs } from "@/lib/repositories/blog";

export const revalidate = 3600;
// Zur Laufzeit erzeugen – der Build-Container hat keine Datenbankverbindung.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, posts] = await Promise.all([findAllPropertySlugs(), findAllPostSlugs()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/immobilien`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${site.url}/immobilie-verkaufen`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/immobilienbewertung`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/suchprofil`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${site.url}/ueber-uns`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/bewertungen`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site.url}/ratgeber`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/kontakt`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticRoutes,
    ...properties.map((p) => ({
      url: `${site.url}/immobilien/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/ratgeber/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
