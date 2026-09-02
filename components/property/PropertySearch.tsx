"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { propertyTypeLabels } from "@/lib/labels";
import { IconChevronRight, IconSearch, IconSliders, IconValuation } from "@/components/icons";

type Tab = "" | "kauf" | "miete";

const tabs: { id: Tab; label: string }[] = [
  { id: "", label: "Alle" },
  { id: "kauf", label: "Kaufen" },
  { id: "miete", label: "Mieten" },
];

const bareSelect =
  "h-full w-full appearance-none bg-transparent pr-8 text-[0.9375rem] text-ink " +
  "focus:outline-none focus-visible:outline-none";

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle"
      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="m5.8 9.2 6.2 6 6.2-6" />
    </svg>
  );
}

/**
 * Suchleiste im Hero: eine durchgehende Zeile aus Umschaltern und Feldern.
 * Auf schmalen Viewports bricht sie in gestapelte Bloecke um.
 */
export function PropertySearch({
  cities,
  className,
}: {
  cities: string[];
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("");
  const [typ, setTyp] = useState("");
  const [ort, setOrt] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [preisMax, setPreisMax] = useState("");
  const [zimmer, setZimmer] = useState("");

  const isRent = tab === "miete";
  const priceSteps = isRent
    ? ["600", "900", "1200", "1600", "2200", "4000"]
    : ["300000", "500000", "750000", "1000000", "1500000", "2500000"];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (tab) sp.set("marketing", tab);
    if (typ) sp.set("typ", typ);
    if (ort) sp.set("ort", ort);
    if (preisMax) sp.set("preis_max", preisMax);
    if (zimmer) sp.set("zimmer", zimmer);
    const qs = sp.toString();
    startTransition(() => router.push(qs ? `/immobilien?${qs}` : "/immobilien"));
  }

  return (
    <div className={cn("mx-auto w-full max-w-[1210px]", className)}>
      <form
        onSubmit={submit}
        className="rounded-[1rem] bg-surface p-1"
      >
        <div className="flex flex-col lg:h-12 lg:flex-row lg:items-stretch">
          {/* Umschalter */}
          <div
            role="tablist"
            aria-label="Vermarktungsart"
            className="flex shrink-0 gap-1 border-b border-line pb-2 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-2"
          >
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id || "alle"}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex-1 rounded-[0.75rem] px-5 text-[1rem] transition-colors lg:flex-none lg:py-0",
                    "py-2.5 lg:leading-[3rem]",
                    active
                      ? "bg-accent-400 text-ink"
                      : "text-ink-muted hover:bg-surface-muted hover:text-primary-900",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Immobilientyp */}
          <div className="relative border-b border-line px-4 py-3.5 lg:flex-1 lg:border-b-0 lg:border-r lg:py-0">
            <label className="sr-only" htmlFor="hero-typ">
              Immobilientyp
            </label>
            <select
              id="hero-typ"
              value={typ}
              onChange={(e) => setTyp(e.target.value)}
              className={cn(bareSelect, "lg:h-12")}
            >
              <option value="">Immobilientyp</option>
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Chevron />
          </div>

          {/* Ort */}
          <div className="relative border-b border-line px-4 py-3.5 lg:flex-1 lg:border-b-0 lg:border-r lg:py-0">
            <label className="sr-only" htmlFor="hero-ort">
              Ort oder Region
            </label>
            <select
              id="hero-ort"
              value={ort}
              onChange={(e) => setOrt(e.target.value)}
              className={cn(bareSelect, "lg:h-12")}
            >
              <option value="">Ort aussuchen</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Chevron />
          </div>

          {/* Weitere Filter */}
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            className="flex shrink-0 items-center justify-center gap-2 border-b border-line px-5 py-3.5 text-[1rem] text-ink-muted transition-colors hover:text-primary-900 lg:border-b-0 lg:py-0"
          >
            <IconSliders size={18} />
            weitere Filter
          </button>

          {/* Suche */}
          <div className="pt-2 lg:flex lg:items-center lg:pl-2 lg:pt-0">
            <button
              type="submit"
              disabled={pending}
              aria-label="Immobilien suchen"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[0.75rem] bg-accent-400 text-white transition-colors hover:bg-accent-500 disabled:opacity-60 lg:aspect-square lg:h-12 lg:w-auto lg:px-0"
            >
              <IconSearch size={20} />
              <span className="lg:sr-only">
                {pending ? "Wird gesucht …" : "Immobilien finden"}
              </span>
            </button>
          </div>
        </div>

        {/* Ausklappbare Zusatzfilter */}
        {showMore ? (
          <div className="grid gap-4 border-t border-line bg-surface-muted p-4 sm:grid-cols-2 lg:p-5">
            <div className="relative">
              <label
                className="mb-1.5 block text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-subtle"
                htmlFor="hero-preis"
              >
                {isRent ? "Kaltmiete bis" : "Kaufpreis bis"}
              </label>
              <select
                id="hero-preis"
                value={preisMax}
                onChange={(e) => setPreisMax(e.target.value)}
                className="h-11 w-full appearance-none rounded-[var(--radius-md)] border border-line-strong bg-surface px-3.5 pr-9 text-[0.9375rem] focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/15"
              >
                <option value="">beliebig</option>
                {priceSteps.map((p) => (
                  <option key={p} value={p}>
                    bis {new Intl.NumberFormat("de-DE").format(Number(p))} €
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label
                className="mb-1.5 block text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-subtle"
                htmlFor="hero-zimmer"
              >
                Zimmer
              </label>
              <select
                id="hero-zimmer"
                value={zimmer}
                onChange={(e) => setZimmer(e.target.value)}
                className="h-11 w-full appearance-none rounded-[var(--radius-md)] border border-line-strong bg-surface px-3.5 pr-9 text-[0.9375rem] focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/15"
              >
                <option value="">beliebig</option>
                {[1, 2, 3, 4, 5, 6].map((z) => (
                  <option key={z} value={z}>
                    ab {z} Zimmer
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}
      </form>

      {/* Eigentuemer-Teaser direkt unter der Suche */}
      <Link
        href="/immobilie-verkaufen"
        className="group mx-3 flex items-center gap-3 rounded-b-[0.75rem] bg-black/10 px-4 py-4 text-[0.875rem] text-white backdrop-blur-lg transition-colors hover:bg-black/20 sm:mx-8 lg:mx-[51px]"
      >
        <IconValuation size={19} className="shrink-0 text-white/80" />
        <span className="flex-1 leading-snug">
          <strong className="font-medium">Sie sind Eigentümer?</strong> Kostenlose
          Immobilienbewertung, Marktbericht und Verkaufsberatung.
        </span>
        <IconChevronRight
          size={18}
          className="shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
