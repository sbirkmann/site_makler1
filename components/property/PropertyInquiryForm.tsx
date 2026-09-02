"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitPropertyInquiry } from "@/lib/actions/inquiries";
import { initialFormState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Textarea } from "@/components/ui/Field";
import { ErrorNote, SuccessPanel } from "@/components/ui/FormStatus";
import { IconArrowRight } from "@/components/icons";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" fullWidth disabled={pending}>
      {pending ? "Wird gesendet …" : "Unverbindlich anfragen"}
      {pending ? null : <IconArrowRight size={18} />}
    </Button>
  );
}

export function PropertyInquiryForm({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const [state, action] = useActionState(submitPropertyInquiry, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  // Conversion-Tracking vorbereiten: ein Custom Event, das von GTM,
  // Plausible o. ae. aufgegriffen werden kann.
  useEffect(() => {
    if (state.status !== "success") return;
    window.dispatchEvent(
      new CustomEvent("makler:lead", {
        detail: { type: "objektanfrage", propertyId },
      }),
    );
    formRef.current?.reset();
  }, [state.status, propertyId]);

  if (state.status === "success") {
    return (
      <SuccessPanel
        title="Anfrage erfolgreich übermittelt"
        message={state.message ?? "Wir melden uns zeitnah bei Ihnen."}
      >
        <Link
          href="/immobilien"
          className="text-[0.875rem] font-medium text-primary-800 underline-offset-4 hover:underline"
        >
          Weitere Immobilien ansehen
        </Link>
      </SuccessPanel>
    );
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <input type="hidden" name="propertyId" value={propertyId} />

      {/* Honeypot gegen einfache Bots – fuer Menschen unsichtbar */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website-hp">Bitte nicht ausfüllen</label>
        <input id="website-hp" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? <ErrorNote message={state.message} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Vorname"
          name="firstName"
          autoComplete="given-name"
          error={state.errors?.firstName}
        />
        <Input
          label="Nachname"
          name="lastName"
          required
          autoComplete="family-name"
          error={state.errors?.lastName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="E-Mail"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={state.errors?.email}
        />
        <Input
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          hint="Für Rückfragen – optional"
          error={state.errors?.phone}
        />
      </div>

      <Textarea
        label="Ihre Nachricht"
        name="message"
        rows={4}
        defaultValue={`Guten Tag, ich interessiere mich für „${propertyTitle}“ und bitte um weitere Informationen.`}
        error={state.errors?.message}
      />

      <Checkbox
        name="privacyAccepted"
        required
        error={state.errors?.privacyAccepted}
        label={
          <>
            Ich habe die{" "}
            <Link href="/datenschutz" className="text-primary-800 underline underline-offset-2">
              Datenschutzerklärung
            </Link>{" "}
            gelesen und bin mit der Verarbeitung meiner Daten zur Bearbeitung dieser Anfrage
            einverstanden.
          </>
        }
      />

      <SubmitButton />

      <p className="text-center text-[0.75rem] text-ink-subtle">
        Ihre Anfrage ist unverbindlich und kostenfrei.
      </p>
    </form>
  );
}
