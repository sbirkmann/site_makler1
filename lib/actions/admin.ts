"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RequestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { adminLoginSchema, adminPropertySchema } from "@/lib/validations/forms";
import { createSession, destroySession, requireSession, verifyCredentials } from "@/lib/services/auth";
import { createSftpGoUser, deleteSftpGoUser } from "@/lib/services/sftpgo";
import { saveUploadedImage } from "@/lib/services/uploads";
import { addressChanged, geocodeAddress } from "@/lib/services/geocoding";
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

  // Koordinaten nur bestimmen, wenn noetig: bei neuen Objekten immer, bei
  // bestehenden nur, wenn sich die Adresse geaendert hat oder noch keine
  // Position hinterlegt ist. Das schont das Kontingent von Nominatim.
  const previous = id
    ? await prisma.property.findUnique({
        where: { id },
        select: { street: true, zipCode: true, city: true, region: true, latitude: true, longitude: true },
      })
    : null;

  const needsGeocoding =
    !id ||
    !previous ||
    previous.latitude === null ||
    previous.longitude === null ||
    addressChanged(previous, data);

  const position = needsGeocoding ? await geocodeAddress(data) : null;

  const dataWithPosition = {
    ...data,
    ...(position
      ? { latitude: position.latitude, longitude: position.longitude }
      : needsGeocoding && !id
        ? { latitude: null, longitude: null }
        : {}),
  };

  try {
    if (id) {
      await prisma.property.update({ where: { id }, data: dataWithPosition });
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
          ...dataWithPosition,
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

export async function createFtpAccountAction(formData: FormData) {
  await requireSession();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!/^[a-z0-9][a-z0-9_-]{2,63}$/.test(username) || password.length < 12) {
    redirect("/admin/schnittstellen?ftp=ungueltig");
  }
  const homeDir = process.env.SFTPGO_IMPORT_DIR ?? "/imports";
  try {
    await createSftpGoUser(username, password, homeDir);
    await prisma.ftpAccount.create({ data: { username, homeDir } });
  } catch {
    redirect("/admin/schnittstellen?ftp=fehler");
  }
  revalidatePath("/admin/schnittstellen");
  redirect("/admin/schnittstellen?ftp=erstellt");
}

export async function deleteFtpAccountAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const account = await prisma.ftpAccount.findUnique({ where: { id } });
  if (!account) return;
  await deleteSftpGoUser(account.username);
  await prisma.ftpAccount.delete({ where: { id } });
  revalidatePath("/admin/schnittstellen");
}

export async function saveLeadPushProvidersAction(formData: FormData) {
  await requireSession();
  const providers = ["ONOFFICE", "PROPSTACK", "FLOWFACT"];
  await Promise.all(providers.map((provider) => prisma.leadPushProvider.upsert({
    where: { provider },
    create: {
      provider,
      enabled: formData.get(`${provider}_enabled`) === "on",
      endpoint: String(formData.get(`${provider}_endpoint`) ?? "").trim() || null,
      apiKey: String(formData.get(`${provider}_apiKey`) ?? "").trim() || null,
    },
    update: {
      enabled: formData.get(`${provider}_enabled`) === "on",
      endpoint: String(formData.get(`${provider}_endpoint`) ?? "").trim() || null,
      apiKey: String(formData.get(`${provider}_apiKey`) ?? "").trim() || null,
    },
  })));
  revalidatePath("/admin/schnittstellen");
  redirect("/admin/schnittstellen?gespeichert=1");
}

export async function saveBlogAction(formData: FormData) {
  await requireSession();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !excerpt || !content || !/^[a-z0-9-]{3,160}$/.test(slug)) redirect("/admin/blog/neu?fehler=1");
  const upload = formData.get("coverImage");
  const coverImage = upload instanceof File && upload.size ? await saveUploadedImage(upload, "blog") : null;
  await prisma.blogPost.create({
    data: { title, slug, excerpt, content, coverImage, published: formData.get("published") === "on", publishedAt: formData.get("published") === "on" ? new Date() : null },
  });
  revalidatePath("/ratgeber");
  revalidatePath("/admin/blog");
  redirect("/admin/blog?gespeichert=1");
}

export async function saveBlogApiSettingsAction(formData: FormData) {
  await requireSession();
  await prisma.blogApiSettings.upsert({
    where: { id: "default" },
    create: { id: "default", enabled: formData.get("enabled") === "on", allowUnauthenticated: formData.get("allowUnauthenticated") === "on", apiKey: String(formData.get("apiKey") ?? "").trim() || null },
    update: { enabled: formData.get("enabled") === "on", allowUnauthenticated: formData.get("allowUnauthenticated") === "on", apiKey: String(formData.get("apiKey") ?? "").trim() || null },
  });
  revalidatePath("/admin/schnittstellen");
  redirect("/admin/schnittstellen?blogApi=gespeichert");
}
