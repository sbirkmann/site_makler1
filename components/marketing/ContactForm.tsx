"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContactRequest } from "@/lib/actions/inquiries";
import { initialFormState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { ErrorNote, SuccessPanel } from "@/components/ui/FormStatus";
import { IconArrowRight } from "@/components/icons";

const subjects = [
  "Allgemeine Anfrage",
  "Ich möchte verkaufen",
  "Ich möchte vermieten",
  "Ich suche eine Immobilie",
  "Suchprofil hinterlegen",
  "Immobilienbewertung",
  "Anlage & Investment",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" fullWidth disabled={pending}>
      {pending ? "Wird gesendet …" : "Nachricht senden"}
      {pending ? null : <IconArrowRight size={18} />}
    </Button>
  );
}

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, action] = useActionState(submitContactRequest, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    window.dispatchEvent(
      new CustomEvent("makler:lead", { detail: { type: "kontaktformular" } }),
    );
    formRef.current?.reset();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <SuccessPanel
        title="Nachricht erhalten"
        message={state.message ?? "Wir melden uns zeitnah bei Ihnen zurück."}
        className="border-0 shadow-none"
      />
    );
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-hp">Bitte nicht ausfüllen</label>
        <input id="contact-hp" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? <ErrorNote message={state.message} /> : null}

      <Select
        label="Ihr Anliegen"
        name="subject"
        defaultValue={defaultSubject ?? subjects[0]}
        className="select-field"
        error={state.errors?.subject}
      >
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>

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
          hint="Optional"
          error={state.errors?.phone}
        />
      </div>

      <Textarea
        label="Ihre Nachricht"
        name="message"
        required
        rows={6}
        placeholder="Beschreiben Sie kurz Ihr Anliegen – je konkreter, desto gezielter können wir antworten."
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
    </form>
  );
}
