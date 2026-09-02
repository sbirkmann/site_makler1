"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { mainNav } from "@/components/layout/nav";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconClose, IconMail, IconPhone } from "@/components/icons";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  // Menue bei Navigation schliessen
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Scroll sperren und Escape abfangen, solange das Menue offen ist
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-primary-950/45 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hauptmenü"
        className={cn(
          "absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto bg-surface",
          "rounded-b-[var(--radius-2xl)] shadow-[var(--shadow-float)]",
          "transition-transform duration-400 [transition-timing-function:var(--ease-out-quint)]",
          open ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Menü schließen"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-colors hover:border-primary-400 hover:text-primary-800"
          >
            <IconClose size={19} />
          </button>
        </div>

        <nav className="flex flex-col px-5 py-3">
          {mainNav.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between gap-4 border-b border-line py-4 last:border-0",
                  "transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out-quint)]",
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
                style={{ transitionDelay: open ? `${70 + i * 45}ms` : "0ms" }}
              >
                <span className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-[1.0625rem] font-medium",
                      active ? "text-primary-700" : "text-primary-950",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="text-[0.8125rem] text-ink-subtle">{item.description}</span>
                  ) : null}
                </span>
                <IconArrowRight
                  size={18}
                  className="shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 border-t border-line bg-surface-muted px-5 py-6">
          <ButtonLink href="/immobilienbewertung" size="lg" fullWidth variant="primary">
            Immobilie kostenlos bewerten
            <IconArrowRight size={18} />
          </ButtonLink>
          <div className="mt-1 grid grid-cols-2 gap-3">
            <a
              href={site.contact.phoneHref}
              className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-line-strong bg-surface py-3 text-[0.8125rem] font-medium text-primary-900"
            >
              <IconPhone size={16} /> Anrufen
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-line-strong bg-surface py-3 text-[0.8125rem] font-medium text-primary-900"
            >
              <IconMail size={16} /> E-Mail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
