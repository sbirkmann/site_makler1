import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-muted px-5 py-20 text-center">
      <p className="font-[family-name:var(--font-display)] text-[5rem] font-bold leading-none text-primary-200">
        404
      </p>
      <h1 className="display-3 mt-6 text-primary-950">Diese Seite gibt es nicht</h1>
      <p className="lead mt-4 max-w-md">
        Möglicherweise wurde das Objekt bereits vermittelt oder die Adresse hat sich geändert.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/immobilien" size="lg">
          Aktuelle Immobilien
          <IconArrowRight size={18} />
        </ButtonLink>
        <ButtonLink href="/" size="lg" variant="outline">
          Zur Startseite
        </ButtonLink>
      </div>
      <Link
        href="/kontakt"
        className="mt-8 text-[0.875rem] text-ink-muted underline-offset-4 hover:text-primary-800 hover:underline"
      >
        Sie suchen etwas Bestimmtes? Sprechen Sie uns an.
      </Link>
    </div>
  );
}
