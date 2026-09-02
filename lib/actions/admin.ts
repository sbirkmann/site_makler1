"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RequestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { adminLoginSchema, adminPropertySchema } from "@/lib/validations/forms";
import { createSession, destroySession, requireSession, verifyCredentials } from "@/lib/services/auth";
import type { FormState } from "@/lib/actions/form-state";

function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Bitte E-Mail und Passwort eingeben." };
  }

  if (!verifyCredentials(parsed.data.email, parsed.data.password)) {
    // Bewusst unspezifisch, um keine Rueckschluesse zu erlauben.
    return { status: "error", message: "E-Mail oder Passwort ist nicht korrekt." };
  }

  await createSession(parsed.data.email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/** Liste aus einem Textfeld: eine Angabe pro Zeile. */
function toList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function savePropertyAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const raw = Object.fromEntries(formData.entries());

  const parsed = adminPropertySchema.safeParse({
    ...raw,
    priceOnRequest: formData.get("priceOnRequest") === "on",
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Bitte prüfen Sie die markierten Felder.",
      errors: fieldErrors(parsed.error),
    };
  }

  const d = parsed.data;
  const imageUrls = toList(d.imageUrls);

  const data = {
    title: d.title,
    slug: d.slug,
    shortDescription: d.shortDescription,
    description: d.description,
    marketingType: d.marketingType,
    propertyType: d.propertyType,
    status: d.status,
    price: d.priceOnRequest || d.price === undefined ? null : d.price,
    priceOnRequest: d.priceOnRequest,
    livingArea: d.livingArea ?? null,
    plotArea: d.plotArea ?? null,
    rooms: d.rooms ?? null,
    bedrooms: d.bedrooms ?? null,
    bathrooms: d.bathrooms ?? null,
    yearBuilt: d.yearBuilt ?? null,
    street: d.street || null,
    zipCode: d.zipCode,
    city: d.city,
    region: d.region || null,
    featured: d.featured,
    agentId: d.agentId || null,
    highlights: toList(d.highlights),
    features: toList(d.features),
  };

  try {
    if (id) {
      await prisma.property.update({ where: { id }, data });
      if (imageUrls.length) {
        // Bilder vollstaendig ersetzen, wenn welche angegeben wurden
        await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
        await prisma.propertyImage.createMany({
          data: imageUrls.map((url, i) => ({
            propertyId: id,
            url,
            alt: `${d.title} – Ansicht ${i + 1}`,
            sortOrder: i,
            isCover: i === 0,
          })),
        });
      }
    } else {
      const created = await prisma.property.create({
        data: {
          ...data,
          publishedAt: new Date(),
          images: {
            create: imageUrls.map((url, i) => ({
              url,
              alt: `${d.title} – Ansicht ${i + 1}`,
              sortOrder: i,
              isCover: i === 0,
            })),
          },
        },
      });
      revalidatePath("/admin/immobilien");
      revalidatePath("/immobilien");
      redirect(`/admin/immobilien/${created.id}?gespeichert=1`);
    }
  } catch (error) {
    // redirect() wirft intern – diesen Fall nicht als Fehler behandeln
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return {
        status: "error",
        message: "Dieser Slug ist bereits vergeben.",
        errors: { slug: "Bitte einen anderen Slug wählen." },
      };
    }
    return { status: "error", message: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/admin/immobilien");
  revalidatePath("/immobilien");
  revalidatePath(`/immobilien/${d.slug}`);
  return { status: "success", message: "Änderungen gespeichert." };
}

export async function deletePropertyAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.property.delete({ where: { id } });
  revalidatePath("/admin/immobilien");
  revalidatePath("/immobilien");
  redirect("/admin/immobilien");
}

const validStatus: RequestStatus[] = ["NEU", "IN_BEARBEITUNG", "KONTAKTIERT", "ABGESCHLOSSEN"];

export async function updateRequestStatusAction(formData: FormData) {
  await requireSession();

  const kind = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as RequestStatus;

  if (!id || !validStatus.includes(status)) return;

  if (kind === "lead") {
    await prisma.lead.update({ where: { id }, data: { status } });
  } else if (kind === "valuation") {
    await prisma.valuationRequest.update({ where: { id }, data: { status } });
  } else if (kind === "contact") {
    await prisma.contactRequest.update({ where: { id }, data: { status } });
  }

  revalidatePath("/admin/anfragen");
  revalidatePath("/admin");
}
