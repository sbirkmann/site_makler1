"use server";

import { revalidatePath } from "next/cache";
import {
  contactSchema,
  propertyInquirySchema,
  valuationSchema,
} from "@/lib/validations/forms";
import type { FormState } from "@/lib/actions/form-state";
import {
  createContactRequest,
  createPropertyLead,
  createValuationRequest,
} from "@/lib/services/leads";


function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Objektanfrage von einer Immobilien-Detailseite. */
export async function submitPropertyInquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = propertyInquirySchema.safeParse({
    propertyId: formData.get("propertyId"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    privacyAccepted: formData.get("privacyAccepted") ?? false,
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Bitte prüfen Sie die markierten Felder.",
      errors: fieldErrors(parsed.error),
    };
  }

  try {
    await createPropertyLead(parsed.data);
    revalidatePath("/admin");
    return {
      status: "success",
      message:
        "Vielen Dank für Ihre Anfrage. Wir melden uns in der Regel innerhalb eines Werktages bei Ihnen.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error && error.message.includes("nicht mehr verfügbar")
          ? error.message
          : "Die Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
    };
  }
}

/** Verkaufs- und Bewertungsfunnel. */
export async function submitValuationRequest(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = valuationSchema.safeParse({
    ...raw,
    privacyAccepted: formData.get("privacyAccepted") ?? false,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Bitte prüfen Sie die markierten Felder.",
      errors: fieldErrors(parsed.error),
    };
  }

  try {
    await createValuationRequest(parsed.data);
    revalidatePath("/admin");
    return {
      status: "success",
      message: "Ihre Anfrage wurde erfolgreich übermittelt.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Ihre Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
    };
  }
}

/** Allgemeines Kontaktformular. */
export async function submitContactRequest(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    subject: formData.get("subject"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    privacyAccepted: formData.get("privacyAccepted") ?? false,
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Bitte prüfen Sie die markierten Felder.",
      errors: fieldErrors(parsed.error),
    };
  }

  try {
    await createContactRequest(parsed.data);
    revalidatePath("/admin");
    return {
      status: "success",
      message:
        "Vielen Dank für Ihre Nachricht. Wir melden uns zeitnah bei Ihnen zurück.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Ihre Nachricht konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
    };
  }
}
