"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Erweiterungspunkt: hier kann ein Error-Tracking angebunden werden.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-muted px-5 py-20 text-center">
      <h1 className="display-3 text-primary-950">Da ist etwas schiefgelaufen</h1>
      <p className="lead mt-4 max-w-md">
        Die Seite konnte nicht vollständig geladen werden. Bitte versuchen Sie es erneut – oder
        rufen Sie uns an, wenn es weiterhin nicht funktioniert.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          Erneut versuchen
        </Button>
        <ButtonLink href="/" size="lg" variant="outline">
          Zur Startseite
        </ButtonLink>
      </div>
      {error.digest ? (
        <p className="mt-8 text-[0.75rem] text-ink-subtle">Referenz: {error.digest}</p>
      ) : null}
    </div>
  );
}
