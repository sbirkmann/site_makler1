/**
 * Inhaltliche Migration beim Start (idempotent):
 * Die frueheren Ratgeber-Artikel zum Immobilienverkauf sind jetzt
 * Unterseiten von "Immobilie verkaufen" und werden aus der Datenbank
 * entfernt. Bleibt der Ratgeber danach leer, werden die allgemeinen
 * Ratgeber-Inhalte eingespielt.
 */
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";

const legacySlugs = [
  "immobilie-verkaufen-ablauf",
  "unterlagen-immobilienverkauf",
  "was-ist-meine-immobilie-wert",
  "maklerprovision-erklaert",
  "immobilie-geerbt-was-tun",
  "energieausweis-verstehen",
];

const prisma = new PrismaClient();

try {
  const removed = await prisma.blogPost.deleteMany({ where: { slug: { in: legacySlugs } } });
  if (removed.count > 0) {
    console.log(`→ ${removed.count} Verkaufs-Artikel aus dem Ratgeber entfernt (jetzt Unterseiten).`);
  }
  const remaining = await prisma.blogPost.count();
  if (remaining === 0) {
    console.log("→ Ratgeber ist leer, allgemeine Inhalte werden eingespielt …");
    execSync("npx tsx prisma/seed-blog.ts", { stdio: "inherit" });
  }
} catch (error) {
  console.error("→ Inhalts-Migration fehlgeschlagen:", error.message);
} finally {
  await prisma.$disconnect();
}
