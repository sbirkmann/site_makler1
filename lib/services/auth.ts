import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Bewusst schlanke Session-Loesung fuer die Admin-Grundlage:
 * signiertes Cookie ohne externe Abhaengigkeit.
 *
 * Erweiterungspunkt: `getSession()` / `createSession()` kapseln den Zugriff –
 * ein Wechsel auf Auth.js, Clerk o. ae. betrifft nur diese Datei sowie die
 * Login-Action.
 */

const COOKIE_NAME = "makler_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 Stunden

export interface AdminSession {
  email: string;
  expiresAt: number;
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function verifyCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "admin@wohnwert-immobilien.example";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "makler2024";
  return (
    safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase()) &&
    safeEqual(password, expectedPassword)
  );
}

export async function createSession(email: string): Promise<void> {
  const session: AdminSession = {
    email,
    expiresAt: Date.now() + MAX_AGE_SECONDS * 1000,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const value = `${payload}.${sign(payload)}`;

  const store = await cookies();
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    if (!session.expiresAt || session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
