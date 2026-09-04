import "server-only";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";

export interface OpeningHourRow {
  days: string;
  hours: string;
  closed: boolean;
}

/**
 * Öffnungszeiten aus der Verwaltung. Solange dort nichts gepflegt ist,
 * greift die Vorgabe aus `lib/site.ts` – so bleibt die Seite auch bei
 * leerer Tabelle vollstaendig.
 */
export async function findOpeningHours(): Promise<OpeningHourRow[]> {
  const rows = await prisma.openingHour.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { days: true, hours: true, closed: true },
  });

  if (rows.length > 0) return rows;

  return site.openingHours.map((row) => ({
    days: row.days,
    hours: row.hours,
    closed: /geschlossen/i.test(row.hours),
  }));
}

/** Alle Zeilen inklusive IDs fuer die Pflegemaske. */
export async function findOpeningHoursForAdmin() {
  return prisma.openingHour.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}
