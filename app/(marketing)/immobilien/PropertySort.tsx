"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const options = [
  { value: "neueste", label: "Neueste zuerst" },
  { value: "preis-auf", label: "Preis aufsteigend" },
  { value: "preis-ab", label: "Preis absteigend" },
  { value: "flaeche", label: "Größte Wohnfläche" },
];

export function PropertySort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function change(value: string) {
    const sp = new URLSearchParams(searchParams.toString());
    if (value === "neueste") sp.delete("sort");
    else sp.set("sort", value);
    sp.delete("seite");
    const qs = sp.toString();
    startTransition(() => router.push(qs ? `/immobilien?${qs}` : "/immobilien", { scroll: false }));
  }

  return (
    <div className="relative shrink-0">
      <label className="sr-only" htmlFor="sortierung">
        Sortierung
      </label>
      <select
        id="sortierung"
        value={searchParams.get("sort") ?? "neueste"}
        onChange={(e) => change(e.target.value)}
        disabled={pending}
        className="h-11 w-full appearance-none rounded-[var(--radius-md)] border border-line-strong bg-surface pl-3.5 pr-9 text-[0.875rem] text-ink transition-colors focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"
      >
        <path d="m5.8 9.2 6.2 6 6.2-6" />
      </svg>
    </div>
  );
}
