import type { Prisma } from "@prisma/client";

export type ClassValue = string | number | bigint | null | undefined | false | ClassValue[];

/** Minimaler Klassen-Merger (bewusst ohne zusaetzliche Abhaengigkeit). */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return;
    if (Array.isArray(v)) return v.forEach(walk);
    out.push(String(v));
  };
  inputs.forEach(walk);
  return out.join(" ");
}

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eurPrecise = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Numeric = number | string | Prisma.Decimal | null | undefined;

export function toNumber(value: Numeric): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value.toString());
  return Number.isFinite(n) ? n : null;
}

export function formatPrice(value: Numeric, opts?: { precise?: boolean }): string {
  const n = toNumber(value);
  if (n === null) return "Preis auf Anfrage";
  return opts?.precise ? eurPrecise.format(n) : eur.format(n);
}

export function formatNumber(value: Numeric, fractionDigits = 0): string {
  const n = toNumber(value);
  if (n === null) return "–";
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);
}

export function formatArea(value: Numeric): string {
  const n = toNumber(value);
  if (n === null) return "–";
  return `${formatNumber(n, Number.isInteger(n) ? 0 : 1)} m²`;
}

export function formatRooms(value: Numeric): string {
  const n = toNumber(value);
  if (n === null) return "–";
  return formatNumber(n, Number.isInteger(n) ? 0 : 1);
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "–";
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(value: Date | string | null | undefined): string {
  if (!value) return "–";
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initialsFrom(first: string, last?: string): string {
  return `${first.charAt(0)}${last?.charAt(0) ?? ""}`.toUpperCase();
}
