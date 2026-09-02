"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/layout/nav";
import { IconArrowRight, IconChevronDown } from "@/components/icons";

/**
 * Aufklapp-Menue im Kopfbereich.
 * Geometrie an der Referenz ausgerichtet: Panel unterhalb des Auslösers,
 * oben links kantig, sonst 20 px Radius, 28/32 px Innenabstand.
 *
 * Bedienung: Öffnen per Zeiger (mit kurzer Verzögerung beim Verlassen,
 * damit der Weg zum Panel nicht abreißt) sowie per Tastatur.
 */
export function NavDropdown({
  item,
  active,
  onImage,
}: {
  item: NavItem;
  active: boolean;
  onImage: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => cancelClose(), []);

  // Schliessen bei Escape und bei Klick ausserhalb
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex items-center gap-1.5 rounded-[var(--radius-sm)] px-4 py-3 text-[1.125rem] font-medium transition-colors",
          onImage
            ? active || open
              ? "text-white"
              : "text-white/80 hover:text-white"
            : active || open
              ? "text-primary-800"
              : "text-ink-muted hover:text-primary-900",
        )}
      >
        {item.label}
        <IconChevronDown
          size={16}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[33rem]",
          "rounded-b-[1.25rem] rounded-tr-[1.25rem] bg-surface px-8 py-7",
          "shadow-[0_2px_4px_rgba(0,0,0,0.1),0_18px_44px_-20px_rgba(16,31,54,0.35)]",
        )}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {item.groups?.map((group) => (
            <div key={group.title}>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                {group.title}
              </p>
              <ul className="mt-3 flex flex-col gap-1">
                {group.items.map((sub) => (
                  <li key={sub.href}>
                    <Link
                      href={sub.href}
                      className="-mx-2 block rounded-[var(--radius-sm)] px-2 py-1.5 text-[1rem] text-primary-950 transition-colors hover:bg-surface-muted hover:text-primary-700"
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {item.teaser ? (
          <Link
            href={item.teaser.href}
            className="group mt-7 flex items-start gap-4 rounded-[1rem] bg-primary-950 p-5 text-white transition-colors hover:bg-primary-900"
          >
            <span className="flex-1">
              <span className="block text-[1rem] font-medium">{item.teaser.title}</span>
              <span className="mt-1 block text-[0.875rem] font-light leading-relaxed text-white/70">
                {item.teaser.text}
              </span>
            </span>
            <IconArrowRight
              size={18}
              className="mt-0.5 shrink-0 text-accent-300 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
