"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { propertyTypeLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { IconClose, IconFilter, IconSliders } from "@/components/icons";

const priceOptions = [
  { value: "", label: "beliebig" },
  { value: "200000", label: "200.000 €" },
  { value: "400000", label: "400.000 €" },
  { value: "600000", label: "600.000 €" },
  { value: "800000", label: "800.000 €" },
  { value: "1200000", label: "1.200.000 €" },
  { value: "2000000", label: "2.000.000 €" },
  { value: "3000000", label: "3.000.000 €" },
];

const rentOptions = [
  { value: "", label: "beliebig" },
  { value: "600", label: "600 €" },
  { value: "900", label: "900 €" },
  { value: "1200", label: "1.200 €" },
  { value: "1600", label: "1.600 €" },
  { value: "2200", label: "2.200 €" },
  { value: "4000", label: "4.000 €" },
];

const selectClass =
  "h-11 w-full appearance-none rounded-[var(--radius-md)] border border-line-strong bg-surface px-3.5 pr-9 " +
  "text-[0.875rem] text-ink transition-colors focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/15";

const labelClass = "mb-1.5 block text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-subtle";

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-[calc(50%+0.55rem)] -translate-y-1/2 text-ink-subtle"
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="m5.8 9.2 6.2 6 6.2-6" />
    </svg>
  );
}

export function PropertyFilters({
  cities,
  activeCount,
}: {
  cities: string[];
  activeCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const read = (key: string) => searchParams.get(key) ?? "";
  const readAll = (key: string) => searchParams.getAll(key);

  const [marketing, setMarketing] = useState(read("marketing"));
  const [ort, setOrt] = useState(read("ort"));
  const [typen, setTypen] = useState<string[]>(readAll("typ"));
  const [preisMin, setPreisMin] = useState(read("preis_min"));
  const [preisMax, setPreisMax] = useState(read("preis_max"));
  const [zimmer, setZimmer] = useState(read("zimmer"));
  const [flaeche, setFlaeche] = useState(read("flaeche"));

  // Aendert sich die URL von aussen (Browser-Zurueck, geteilter Link), wird der
  // Formularzustand waehrend des Renderns nachgezogen – kein Effekt noetig.
  const urlKey = searchParams.toString();
  const [syncedKey, setSyncedKey] = useState(urlKey);
  if (urlKey !== syncedKey) {
    setSyncedKey(urlKey);
    setMarketing(read("marketing"));
    setOrt(read("ort"));
    setTypen(readAll("typ"));
    setPreisMin(read("preis_min"));
    setPreisMax(read("preis_max"));
    setZimmer(read("zimmer"));
    setFlaeche(read("flaeche"));
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function apply(e?: React.FormEvent) {
    e?.preventDefault();
    const sp = new URLSearchParams();
    if (marketing) sp.set("marketing", marketing);
    if (ort) sp.set("ort", ort);
    for (const t of typen) sp.append("typ", t);
    if (preisMin) sp.set("preis_min", preisMin);
    if (preisMax) sp.set("preis_max", preisMax);
    if (zimmer) sp.set("zimmer", zimmer);
    if (flaeche) sp.set("flaeche", flaeche);
    const sort = searchParams.get("sort");
    if (sort) sp.set("sort", sort);

    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `/immobilien?${qs}` : "/immobilien", { scroll: false });
      setOpen(false);
    });
  }

  function reset() {
    setMarketing("");
    setOrt("");
    setTypen([]);
    setPreisMin("");
    setPreisMax("");
    setZimmer("");
    setFlaeche("");
    startTransition(() => {
      router.push("/immobilien", { scroll: false });
      setOpen(false);
    });
  }

  function toggleTyp(value: string) {
    setTypen((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  }

  const isRent = marketing === "miete";
  const money = isRent ? rentOptions : priceOptions;

  const fields = (
    <div className="flex flex-col gap-5">
      <div>
        <span className={labelClass}>Vermarktung</span>
        <div className="flex rounded-[var(--radius-md)] border border-line-strong p-1">
          {[
            { value: "", label: "Alle" },
            { value: "kauf", label: "Kaufen" },
            { value: "miete", label: "Mieten" },
          ].map((o) => (
            <button
              key={o.value || "alle"}
              type="button"
              onClick={() => setMarketing(o.value)}
              className={cn(
                "flex-1 rounded-[var(--radius-sm)] px-3 py-2 text-[0.8125rem] font-medium transition-colors",
                marketing === o.value
                  ? "bg-primary-800 text-white"
                  : "text-ink-muted hover:bg-surface-muted",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={labelClass}>Immobilientyp</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(propertyTypeLabels).map(([value, label]) => {
            const active = typen.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleTyp(value)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium transition-all",
                  active
                    ? "border-primary-800 bg-primary-800 text-white"
                    : "border-line-strong text-ink-muted hover:border-primary-300 hover:text-primary-800",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <label className={labelClass} htmlFor="filter-ort">
          Ort / Region
        </label>
        <select
          id="filter-ort"
          value={ort}
          onChange={(e) => setOrt(e.target.value)}
          className={selectClass}
        >
          <option value="">Alle Orte</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Chevron />
      </div>

      <div>
        <span className={labelClass}>{isRent ? "Kaltmiete" : "Kaufpreis"}</span>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <select
              aria-label="Preis von"
              value={preisMin}
              onChange={(e) => setPreisMin(e.target.value)}
              className={selectClass}
            >
              {money.map((o) => (
                <option key={`min-${o.value}`} value={o.value}>
                  {o.value ? `ab ${o.label}` : "von beliebig"}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m5.8 9.2 6.2 6 6.2-6" /></svg>
          </div>
          <div className="relative">
            <select
              aria-label="Preis bis"
              value={preisMax}
              onChange={(e) => setPreisMax(e.target.value)}
              className={selectClass}
            >
              {money.map((o) => (
                <option key={`max-${o.value}`} value={o.value}>
                  {o.value ? `bis ${o.label}` : "bis beliebig"}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m5.8 9.2 6.2 6 6.2-6" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <label className={labelClass} htmlFor="filter-zimmer">
            Zimmer
          </label>
          <select
            id="filter-zimmer"
            value={zimmer}
            onChange={(e) => setZimmer(e.target.value)}
            className={selectClass}
          >
            <option value="">beliebig</option>
            {[1, 2, 3, 4, 5, 6].map((z) => (
              <option key={z} value={z}>
                ab {z}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
        <div className="relative">
          <label className={labelClass} htmlFor="filter-flaeche">
            Wohnfläche
          </label>
          <select
            id="filter-flaeche"
            value={flaeche}
            onChange={(e) => setFlaeche(e.target.value)}
            className={selectClass}
          >
            <option value="">beliebig</option>
            {[50, 80, 100, 130, 160, 200, 300].map((f) => (
              <option key={f} value={f}>
                ab {f} m²
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: Trigger */}
      <div className="flex items-center gap-3 lg:hidden">
        <Button
          variant="outline"
          size="md"
          onClick={() => setOpen(true)}
          className="flex-1"
        >
          <IconFilter size={17} />
          Filter
          {activeCount > 0 ? (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-800 px-1.5 text-[0.6875rem] font-semibold text-white">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </div>

      {/* Mobile: Sheet */}
      <div
        className={cn(
          "fixed inset-0 z-100 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-primary-950/45 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter"
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[var(--radius-2xl)] bg-surface shadow-[var(--shadow-float)]",
            "transition-transform duration-400 [transition-timing-function:var(--ease-out-quint)]",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 text-[1.0625rem] font-medium text-primary-950">
              <IconSliders size={19} className="text-primary-600" />
              Filter
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Filter schließen"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink-muted"
            >
              <IconClose size={17} />
            </button>
          </div>
          <form onSubmit={apply} className="flex-1 overflow-y-auto px-5 py-6">
            {fields}
          </form>
          <div className="flex gap-3 border-t border-line bg-surface-muted px-5 py-4">
            <Button variant="ghost" onClick={reset} className="shrink-0">
              Zurücksetzen
            </Button>
            <Button onClick={() => apply()} fullWidth disabled={pending}>
              Ergebnisse anzeigen
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: Sidebar */}
      <form
        onSubmit={apply}
        className="hidden lg:block lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]"
      >
        <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[var(--shadow-subtle)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[0.9375rem] font-medium text-primary-950">
              <IconSliders size={18} className="text-primary-600" />
              Filter
            </h2>
            {activeCount > 0 ? (
              <button
                type="button"
                onClick={reset}
                className="text-[0.8125rem] text-ink-subtle underline-offset-4 transition-colors hover:text-primary-800 hover:underline"
              >
                Zurücksetzen
              </button>
            ) : null}
          </div>
          {fields}
          <Button type="submit" fullWidth className="mt-6" disabled={pending}>
            {pending ? "Wird geladen …" : "Filter anwenden"}
          </Button>
        </div>
      </form>
    </>
  );
}
