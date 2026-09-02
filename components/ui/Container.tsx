import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        // Wie in der Referenz gemessen: 1552 px Maximalbreite bei nur
        // 16 px Innenabstand – der Inhalt laeuft dadurch sehr weit nach aussen.
        "mx-auto w-full px-4",
        size === "wide" && "max-w-[1552px]",
        size === "default" && "max-w-[1552px]",
        size === "narrow" && "max-w-[68rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "sunken" | "dark";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        // Vertikaler Rhythmus exakt wie in der Referenz: 80 px oben und unten
        "py-12 sm:py-16 lg:py-20",
        // Abwechselnde Flaechen: "default" ist weiss, "muted" das warme Grau
        tone === "default" && "bg-surface",
        tone === "muted" && "bg-surface-muted",
        tone === "sunken" && "bg-surface-sunken",
        tone === "dark" && "bg-primary-950 text-ink-inverse",
        className,
      )}
    >
      {children}
    </section>
  );
}
