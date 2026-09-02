/**
 * Spielt die Demo-Daten nur ein, wenn die Datenbank noch keine Objekte
 * enthaelt. So bleibt ein Neustart des Containers folgenlos.
 */
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";

const prisma = new PrismaClient();

try {
  const count = await prisma.property.count();
  if (count > 0) {
    console.log(`→ Bereits ${count} Objekte vorhanden – Seed übersprungen.`);
  } else {
    console.log("→ Datenbank ist leer, Demo-Daten werden eingespielt …");
    execSync("pnpm exec tsx prisma/seed.ts", { stdio: "inherit" });
  }
} catch (error) {
  console.error("→ Seed-Prüfung fehlgeschlagen:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
