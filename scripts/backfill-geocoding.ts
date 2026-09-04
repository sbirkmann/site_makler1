/**
 * Traegt Koordinaten fuer alle Immobilien nach, die noch keine haben.
 *
 * Laeuft beim Start des Containers (siehe package.json "start") und kann
 * jederzeit manuell wiederholt werden – bereits geocodierte Objekte werden
 * uebersprungen, der Lauf ist also gefahrlos wiederholbar.
 *
 * Nominatim erlaubt nur eine Anfrage pro Sekunde; die Drosselung steckt im
 * Geocoding-Service. Bei vielen Objekten dauert der Lauf entsprechend, er
 * blockiert den Anwendungsstart aber nicht (siehe unten: Aufruf im
 * Hintergrund bzw. Begrenzung ueber GEOCODE_BACKFILL_LIMIT).
 */
import { prisma } from "../lib/db";
import { geocodeAddress } from "../lib/services/geocoding";

const limit = Number(process.env.GEOCODE_BACKFILL_LIMIT ?? "500");

async function main() {
  const pending = await prisma.property.findMany({
    where: { OR: [{ latitude: null }, { longitude: null }] },
    select: { id: true, title: true, street: true, zipCode: true, city: true, region: true, country: true },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  if (pending.length === 0) {
    console.log("→ Geocoding: alle Objekte haben bereits Koordinaten.");
    return;
  }

  console.log(`→ Geocoding: ${pending.length} Objekt(e) ohne Koordinaten werden nachgetragen …`);
  let resolved = 0;

  for (const property of pending) {
    const position = await geocodeAddress(property);
    if (!position) {
      console.warn(`  · keine Position gefunden für "${property.title}" (${property.zipCode} ${property.city})`);
      continue;
    }
    await prisma.property.update({
      where: { id: property.id },
      data: { latitude: position.latitude, longitude: position.longitude },
    });
    resolved++;
    console.log(`  · ${property.title} → ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`);
  }

  console.log(`→ Geocoding abgeschlossen: ${resolved} von ${pending.length} Objekt(en) verortet.`);
}

main()
  .catch((error) => {
    // Ein fehlgeschlagener Nachtrag darf den Start nicht verhindern.
    console.error("→ Geocoding-Nachtrag fehlgeschlagen:", error instanceof Error ? error.message : error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
