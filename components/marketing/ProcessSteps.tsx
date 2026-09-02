"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconConsulting,
  IconValuation,
  IconCompass,
  IconCamera,
  IconHandshake,
} from "@/components/icons";

const steps = [
  {
    number: "01",
    icon: IconConsulting,
    title: "Kostenlose Erstberatung",
    description:
      "Wir lernen Ihre Situation und Ihre Immobilie kennen – ohne Verkaufsdruck und ohne Vertrag. Meist reicht ein Gespräch von zwanzig Minuten, um die richtigen Fragen zu klären.",
  },
  {
    number: "02",
    icon: IconValuation,
    title: "Professionelle Bewertung",
    description:
      "Analyse von Lage, Markt und Objekt. Sie erhalten eine nachvollziehbare Wertspanne mit Vergleichsobjekten – keine Zahl, die nur gut klingt.",
  },
  {
    number: "03",
    icon: IconCompass,
    title: "Individuelle Vermarktungsstrategie",
    description:
      "Öffentlich oder diskret, breit oder gezielt: Wir legen gemeinsam fest, wie Ihre Immobilie positioniert wird und wen wir ansprechen.",
  },
  {
    number: "04",
    icon: IconCamera,
    title: "Vermarktung & Besichtigungen",
    description:
      "Professionelle Fotos, Grundrisse und Exposé. Anfragen werden vorqualifiziert, damit nur Interessenten kommen, die auch kaufen können.",
  },
  {
    number: "05",
    icon: IconHandshake,
    title: "Erfolgreicher Abschluss",
    description:
      "Verhandlung, Kaufvertrag und Übergabe. Wir begleiten Sie bis zum Notartermin – und darüber hinaus bis zur protokollierten Schlüsselübergabe.",
  },
];

export function ProcessSteps() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target as HTMLLIElement);
            if (index >= 0) setActive(index);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol className="relative">
      {/* Verbindungslinie */}
      <span
        aria-hidden="true"
        className="absolute left-[1.4375rem] top-4 bottom-4 w-px bg-line lg:left-1/2 lg:-translate-x-1/2"
      />
      <span
        aria-hidden="true"
        className="absolute left-[1.4375rem] top-4 w-px bg-accent-400 transition-[height] duration-700 [transition-timing-function:var(--ease-out-quint)] lg:left-1/2 lg:-translate-x-1/2"
        style={{ height: `${((active + 1) / steps.length) * 100}%`, maxHeight: "calc(100% - 2rem)" }}
      />

      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i <= active;
        const alignRight = i % 2 === 1;

        return (
          <li
            key={step.number}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn(
              "relative grid gap-x-12 pb-12 last:pb-0",
              "grid-cols-[3rem_1fr] lg:grid-cols-[1fr_3rem_1fr]",
            )}
          >
            {/* Desktop: linke Spalte */}
            <div className={cn("hidden lg:block", alignRight ? "" : "lg:text-right")}>
              {!alignRight ? <StepContent step={step} active={isActive} align="right" /> : null}
            </div>

            {/* Marker */}
            <div className="relative flex justify-center lg:justify-center">
              <span
                className={cn(
                  "sticky top-1/2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-all duration-500",
                  isActive
                    ? "border-accent-400 text-primary-800 shadow-[var(--shadow-card)]"
                    : "border-line text-ink-subtle",
                )}
              >
                <Icon size={21} />
              </span>
            </div>

            {/* Mobile + Desktop rechte Spalte */}
            <div className="lg:hidden">
              <StepContent step={step} active={isActive} align="left" />
            </div>
            <div className="hidden lg:block">
              {alignRight ? <StepContent step={step} active={isActive} align="left" /> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StepContent({
  step,
  active,
  align,
}: {
  step: (typeof steps)[number];
  active: boolean;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "transition-opacity duration-500",
        active ? "opacity-100" : "opacity-55",
        align === "right" && "lg:text-right",
      )}
    >
      <span
        className={cn(
          "font-[family-name:var(--font-display)] text-[2.25rem] leading-none tracking-[-0.02em] transition-colors duration-500",
          active ? "text-accent-400" : "text-line-strong",
        )}
      >
        {step.number}
      </span>
      <h3 className="mt-3 text-[1.25rem] font-medium leading-snug text-primary-950">
        {step.title}
      </h3>
      <p
        className={cn(
          "mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-ink-muted",
          align === "right" && "lg:ml-auto",
        )}
      >
        {step.description}
      </p>
    </div>
  );
}
