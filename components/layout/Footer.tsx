import Link from "next/link";
import { site } from "@/lib/site";
import { footerNav } from "@/components/layout/nav";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconLocation, IconMail, IconPhone } from "@/components/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-ink-inverse">
      {/* Abschliessender Conversion-Block */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-18">
          <div className="max-w-2xl">
            <h2 className="display-3 text-white">
              Sprechen wir über Ihre Immobilie.
            </h2>
            <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-white/65">
              Ob Verkauf, Kauf oder einfach eine Einschätzung: Das erste Gespräch ist
              unverbindlich und kostet Sie nichts außer zwanzig Minuten.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <ButtonLink href="/kontakt" size="lg" variant="inverse">
              Beratung vereinbaren
              <IconArrowRight size={18} />
            </ButtonLink>
            <ButtonLink
              href={site.contact.phoneHref}
              size="lg"
              variant="outline"
              className="border-white/25 text-white hover:border-white/50 hover:bg-white/5"
            >
              <IconPhone size={18} />
              {site.contact.phone}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12">
        <div className="flex flex-col gap-6">
          <Logo tone="light" />
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-white/60">
            {site.description}
          </p>
          <address className="flex flex-col gap-3 text-[0.9375rem] not-italic text-white/70">
            <span className="flex items-start gap-3">
              <IconLocation size={18} className="mt-0.5 shrink-0 text-accent-300" />
              <span>
                {site.address.street}
                <br />
                {site.address.zipCode} {site.address.city}
              </span>
            </span>
            <a
              href={site.contact.phoneHref}
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <IconPhone size={18} className="shrink-0 text-accent-300" />
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <IconMail size={18} className="shrink-0 text-accent-300" />
              {site.contact.email}
            </a>
          </address>
        </div>

        {Object.values(footerNav).map((group) => (
          <nav key={group.title} aria-label={group.title} className="flex flex-col gap-4">
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent-300">
              {group.title}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-white/65 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-6 text-[0.8125rem] text-white/45 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>
            © {year} {site.legalName}. Alle Rechte vorbehalten.
          </p>
          <p className="max-w-xl md:text-right">
            Musterprojekt: Objekte, Personen und Bewertungen auf dieser Seite dienen
            ausschließlich Demonstrationszwecken.
          </p>
        </div>
      </div>
    </footer>
  );
}
