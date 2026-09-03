import { createHash, randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";
import { prisma } from "../lib/db";
import type { PropertyType } from "@prisma/client";

const importDir = process.env.IMPORT_DIR ?? path.join(process.cwd(), "storage", "ftp-imports");
const uploadsDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");
const many = <T>(v: T | T[] | undefined): T[] => v === undefined ? [] : Array.isArray(v) ? v : [v];
const value = (v: unknown): string => typeof v === "string" ? v.trim() : typeof v === "object" && v && "#text" in v ? String((v as Record<string, unknown>)["#text"] ?? "").trim() : "";
const one = (v: unknown) => value(Array.isArray(v) ? v[0] : v);
const num = (v: unknown) => { const n = Number(one(v).replace(",", ".")); return Number.isFinite(n) ? n : null; };
const slug = (v: string) => v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140) || randomUUID();

function category(v: Record<string, unknown>): PropertyType {
  const s = JSON.stringify(v).toLowerCase();
  if (s.includes("grundst")) return "GRUNDSTUECK"; if (s.includes("mehrfamil")) return "MEHRFAMILIENHAUS";
  if (s.includes("wohnung")) return "WOHNUNG"; if (s.includes("gewerbe")) return "GEWERBE"; return "HAUS";
}

async function importAgent(provider: Record<string, unknown>) {
  // OpenImmo legt den Ansprechpartner im anbieter-Block ab. Direkte Werte
  // haben Vorrang, zentrale Kontaktwerte sind der sinnvolle Fallback.
  const firstName = one(provider.vorname) || "OpenImmo";
  const lastName = one(provider.nachname) || one(provider.firma) || "Ansprechpartner";
  const email = one(provider.email_direkt) || one(provider.email_zentrale);
  if (!email || !email.includes("@")) return null;
  const phone = one(provider.tel_durchw) || one(provider.tel_zentrale) || null;
  const agentSlug = `openimmo-${slug(email).slice(0, 120)}`;
  return prisma.agent.upsert({
    where: { slug: agentSlug },
    create: { slug: agentSlug, firstName, lastName, role: one(provider.firma) || "Ansprechpartner", email, phone, active: true },
    update: { firstName, lastName, role: one(provider.firma) || "Ansprechpartner", email, phone, active: true },
    select: { id: true },
  });
}

async function images(zip: AdmZip, item: Record<string, unknown>, title: string) {
  const attachments = many((item.anhaenge as Record<string, unknown> | undefined)?.anhang);
  const output: { url: string; alt: string; sortOrder: number; isCover: boolean }[] = [];
  await mkdir(path.join(uploadsDir, "openimmo"), { recursive: true });
  for (const attachment of attachments) {
    const location = String((attachment as Record<string, unknown>)["@_location"] ?? "").replace(/\\/g, "/");
    if (!location || location.includes("..")) continue;
    const entry = zip.getEntry(location) ?? zip.getEntries().find((e) => e.entryName.endsWith(`/${location}`));
    if (!entry || entry.isDirectory || !/\.(jpe?g|png|webp|avif)$/i.test(entry.entryName)) continue;
    const name = `${randomUUID()}${path.extname(entry.entryName).toLowerCase()}`;
    await writeFile(path.join(uploadsDir, "openimmo", name), entry.getData());
    output.push({ url: `/uploads/openimmo/${name}`, alt: title, sortOrder: output.length, isCover: output.length === 0 });
  }
  return output;
}

async function processZip(filePath: string) {
  const raw = await readFile(filePath);
  const checksum = createHash("sha256").update(raw).digest("hex");
  if (await prisma.openImmoImport.findUnique({ where: { checksum } })) { await rm(filePath); return; }
  try {
    const zip = new AdmZip(raw);
    const xml = zip.getEntries().find((e) => /(^|\/)openimmo\.xml$/i.test(e.entryName));
    if (!xml) throw new Error("openimmo.xml fehlt im ZIP.");
    const parsed = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", trimValues: true }).parse(xml.getData().toString("utf8"));
    const providers = many((parsed.openimmo as Record<string, unknown> | undefined)?.anbieter);
    const objects = providers.flatMap((p) => many((p as Record<string, unknown>).immobilie).map((object) => ({ object, provider: p as Record<string, unknown> })));
    if (!objects.length) throw new Error("Keine Immobilien in openimmo.xml gefunden.");
    let propertyCount = 0;
    for (const entry of objects) {
      const object = entry.object as Record<string, unknown>; const technical = (object.verwaltung_techn ?? {}) as Record<string, unknown>;
      const externalId = one(technical.objektnr_extern) || one(object.objektnr_extern) || createHash("sha1").update(JSON.stringify(object)).digest("hex");
      if (one(technical.aktion).toUpperCase() === "DELETE") { await prisma.property.deleteMany({ where: { importSource: "OPENIMMO_FTP", externalId } }); propertyCount++; continue; }
      const free = (object.freitexte ?? {}) as Record<string, unknown>; const geo = (object.geo ?? {}) as Record<string, unknown>;
      const title = one(free.objekttitel) || `Importiertes Objekt ${externalId}`; const description = one(free.objektbeschreibung) || "Aus OpenImmo importiert.";
      const agent = await importAgent(entry.provider);
      const data = { title, slug: `${slug(title)}-${slug(externalId).slice(0, 16)}`, shortDescription: description.slice(0, 300), description, marketingType: JSON.stringify(object.vermarktungsart ?? {}).toLowerCase().includes("miete") ? "MIETE" as const : "KAUF" as const, propertyType: category((object.objektkategorie ?? {}) as Record<string, unknown>), status: "VERFUEGBAR" as const, livingArea: num((object.flaechen as Record<string, unknown> | undefined)?.wohnflaeche), rooms: num((object.flaechen as Record<string, unknown> | undefined)?.anzahl_zimmer), street: one(geo.strasse) || null, zipCode: one(geo.plz) || "00000", city: one(geo.ort) || "Unbekannt", region: one(geo.bundesland) || null, importSource: "OPENIMMO_FTP", externalId, agentId: agent?.id ?? null, publishedAt: new Date() };
      const existing = await prisma.property.findFirst({ where: { importSource: "OPENIMMO_FTP", externalId } }); const importedImages = await images(zip, object, title);
      if (existing) { await prisma.property.update({ where: { id: existing.id }, data }); if (importedImages.length) { await prisma.propertyImage.deleteMany({ where: { propertyId: existing.id } }); await prisma.propertyImage.createMany({ data: importedImages.map((image) => ({ ...image, propertyId: existing.id })) }); } }
      else await prisma.property.create({ data: { ...data, images: { create: importedImages } } }); propertyCount++;
    }
    const originalName = path.basename(filePath).replace(/\.processing[-][0-9a-fA-F-]+$/, "");
    await prisma.openImmoImport.create({ data: { fileName: originalName, checksum, status: "PROCESSED", propertyCount } });
    await rm(filePath);
  } catch (error) { await prisma.openImmoImport.upsert({ where: { checksum }, create: { fileName, checksum, status: "FAILED", error: error instanceof Error ? error.message : "Unbekannter Fehler" }, update: { status: "FAILED", error: error instanceof Error ? error.message : "Unbekannter Fehler" } }); }
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function claimFile(srcPath: string) {
  const target = `${srcPath}.processing-${randomUUID()}`;
  try {
    await rename(srcPath, target);
    return target;
  } catch {
    return null;
  }
}

async function runWorker() {
  const concurrency = Number(process.env.WORKER_CONCURRENCY ?? "3");
  const delay = Number(process.env.LOOP_DELAY ?? "20000");
  await mkdir(importDir, { recursive: true });

  while (true) {
    try {
      const files = (await readdir(importDir)).filter((f) => /\.zip$/i.test(f));
      const tasks: Promise<void>[] = [];
      for (const file of files) {
        const src = path.join(importDir, file);
        const claimed = await claimFile(src);
        if (!claimed) continue;
        tasks.push(processZip(claimed).catch((err) => { console.error(`Fehler beim Verarbeiten ${claimed}:`, err); }));
        if (tasks.length >= concurrency) {
          await Promise.allSettled(tasks);
          tasks.length = 0;
        }
      }
      if (tasks.length) await Promise.allSettled(tasks);
    } catch (err) {
      console.error("Worker-Loop-Fehler:", err);
    }
    await sleep(delay);
  }
}

runWorker().catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exitCode = 1; });
