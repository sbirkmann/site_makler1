import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Fact {
  icon: ReactNode;
  label: string;
  value: string;
}

export function PropertyFacts({ facts, className }: { facts: Fact[]; className?: string }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-2 bg-surface p-4 sm:p-5">
          <span className="text-primary-500">{fact.icon}</span>
          <dt className="text-[0.75rem] uppercase tracking-[0.08em] text-ink-subtle">
            {fact.label}
          </dt>
          <dd className="text-[1.0625rem] font-medium leading-none text-primary-950">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function FeatureList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-x-8 gap-y-3 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-ink">
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            className="mt-0.5 shrink-0 text-accent-500"
          >
            <path d="m4.8 12.6 4.6 4.6 9.8-10.4" />
          </svg>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
