"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Leichtgewichtiges Scroll-Reveal ueber IntersectionObserver.
 * Kein Animations-Framework noetig; respektiert prefers-reduced-motion
 * (siehe globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  // Startwert muss auf Server und Client identisch sein, sonst weicht das
  // hydrierte Markup ab. Sichtbarkeit wird ausschliesslich im Effekt gesetzt –
  // der laeuft nur im Browser.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Ohne IntersectionObserver (aeltere Browser) sofort einblenden,
    // damit der Inhalt nicht dauerhaft unsichtbar bleibt.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    // Beobachtet auch bereits sichtbare Elemente: der Observer meldet diese
    // unmittelbar nach dem Start, daher genuegt ein einziger Pfad.
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
