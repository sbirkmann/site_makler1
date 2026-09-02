"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/components/layout/nav";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { ButtonLink } from "@/components/ui/Button";
import { IconMenu, IconValuation } from "@/components/icons";

/**
 * Der Header liegt auf Seiten mit Bild-Hero transparent ueber dem Bild
 * (`overlay`) und wird beim Scrollen zu einer festen, hellen Leiste.
 */
export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ueber dem Bild wird hell gezeichnet, sobald die Leiste faellt dunkel.
  // Ueber dem Bild wird hell gezeichnet; sobald die Leiste faellt, dunkel.
  const onImage = overlay && !scrolled;

  return (
    <>
      <a
        href="#hauptinhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-200 focus:rounded-[var(--radius-sm)] focus:bg-primary-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Zum Hauptinhalt springen
      </a>

      <header
        className={cn(
          "z-90 transition-all duration-300",
          // Ueber dem Bild schwebt der Header im Freiraum oberhalb der Hero-Box.
          overlay && !scrolled && "absolute inset-x-0 top-8",
          !overlay && !scrolled && "sticky top-0 bg-surface",
          // Beim Scrollen wird daraus eine feste, helle Leiste.
          scrolled &&
            "fixed inset-x-0 top-0 bg-surface/92 backdrop-blur-xl shadow-[0_4px_24px_-14px_rgba(16,31,54,0.35)]",
        )}
      >
        <div className="mx-auto flex h-[var(--header-height)] w-full max-w-[1552px] items-center justify-between gap-3 px-4 sm:px-8">
          <Logo tone={onImage ? "light" : "dark"} className="min-w-0 flex-1 overflow-hidden xl:flex-none" />

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 xl:flex">
            {mainNav.map((item) => {
              const active =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              if (item.groups?.length) {
                return (
                  <NavDropdown key={item.href} item={item} active={active} onImage={onImage} />
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-[var(--radius-sm)] px-4 py-3 text-[1.125rem] font-medium transition-colors",
                    onImage
                      ? active
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                      : active
                        ? "text-primary-800"
                        : "text-ink-muted hover:text-primary-900",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px origin-left transition-transform duration-300",
                      onImage ? "bg-accent-300" : "bg-accent-400",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/immobilienbewertung"
              className={cn(
                "hidden items-center gap-2 rounded-[var(--radius-sm)] px-4 py-3 text-[1.125rem] font-medium transition-colors lg:flex",
                onImage ? "text-white/85 hover:text-white" : "text-ink-muted hover:text-primary-900",
              )}
            >
              <IconValuation size={20} className={onImage ? "text-accent-300" : "text-primary-600"} />
              Kostenlos bewerten
            </Link>

            <ButtonLink
              href="/kontakt"
              size="md"
              variant="accent"
              className="h-auto shrink-0 rounded-[1rem] px-3 py-2.5 text-[0.9375rem] font-semibold !text-ink sm:px-4 sm:py-4 sm:text-[1.125rem]"
            >
              Kontakt
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menü öffnen"
              aria-expanded={menuOpen}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border transition-colors xl:hidden",
                onImage
                  ? "border-white/30 text-white hover:border-white/60 hover:bg-white/10"
                  : "border-line-strong text-primary-900 hover:border-primary-400",
              )}
            >
              <IconMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
