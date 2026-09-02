"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/actions/form-state";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorNote } from "@/components/ui/FormStatus";
import { IconInfo } from "@/components/icons";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" fullWidth disabled={pending}>
      {pending ? "Wird geprüft …" : "Anmelden"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, action] = useActionState(loginAction, initialFormState);

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo href="/" />
        </div>

        <div className="mt-8 rounded-[var(--radius-xl)] border border-line bg-surface p-7 shadow-[var(--shadow-card)] sm:p-9">
          <h1 className="heading-4 text-primary-950">Anmeldung zur Verwaltung</h1>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
            Dieser Bereich ist nicht öffentlich zugänglich.
          </p>

          <form action={action} className="mt-7 flex flex-col gap-4">
            {state.status === "error" && state.message ? (
              <ErrorNote message={state.message} />
            ) : null}

            <Input
              label="E-Mail"
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue="admin@wohnwert-immobilien.example"
            />
            <Input
              label="Passwort"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
            <SubmitButton />
          </form>

          <p className="mt-6 flex items-start gap-2.5 rounded-[var(--radius-md)] border border-line bg-surface-muted px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-muted">
            <IconInfo size={16} className="mt-0.5 shrink-0 text-primary-500" />
            <span>
              <strong className="font-medium text-primary-900">Demo-Zugang:</strong>{" "}
              admin@wohnwert-immobilien.example / makler2024 – konfigurierbar über die Variablen
              <code className="mx-1 rounded bg-surface px-1 py-0.5 text-[0.75rem]">ADMIN_EMAIL</code>
              und
              <code className="mx-1 rounded bg-surface px-1 py-0.5 text-[0.75rem]">
                ADMIN_PASSWORD
              </code>
              .
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
