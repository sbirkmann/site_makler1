"use client";

import type { PropertyType } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  IconApartment,
  IconBuilding,
  IconCheck,
  IconCommercial,
  IconHouse,
  IconLand,
} from "@/components/icons";

const options: {
  value: PropertyType;
  label: string;
  hint: string;
  Icon: typeof IconHouse;
}[] = [
  { value: "HAUS", label: "Haus", hint: "Einfamilien-, Doppel- oder Reihenhaus", Icon: IconHouse },
  { value: "WOHNUNG", label: "Wohnung", hint: "Eigentumswohnung oder Maisonette", Icon: IconApartment },
  {
    value: "MEHRFAMILIENHAUS",
    label: "Mehrfamilienhaus",
    hint: "Anlageobjekt ab drei Einheiten",
    Icon: IconBuilding,
  },
  { value: "GRUNDSTUECK", label: "Grundstück", hint: "Bau- oder Gartenland", Icon: IconLand },
  {
    value: "GEWERBE",
    label: "Gewerbeimmobilie",
    hint: "Büro, Halle, Ladenlokal",
    Icon: IconCommercial,
  },
];

export function PropertyTypeSelector({
  value,
  onChange,
}: {
  value?: PropertyType;
  onChange: (value: PropertyType) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map(({ value: v, label, hint, Icon }) => {
        const selected = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={selected}
            className={cn(
              "group relative flex items-start gap-4 rounded-[var(--radius-lg)] border p-5 text-left transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
              selected
                ? "border-primary-700 bg-primary-50/60 shadow-[var(--shadow-card)]"
                : "border-line-strong bg-surface hover:border-primary-300",
            )}
          >
            <span
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-colors",
                selected ? "bg-primary-800 text-white" : "bg-surface-sunken text-primary-700",
              )}
            >
              <Icon size={24} />
            </span>
            <span className="flex min-w-0 flex-col gap-1 pt-0.5 pr-6">
              <span className="font-medium text-primary-950">{label}</span>
              <span className="text-[0.8125rem] leading-relaxed text-ink-subtle">{hint}</span>
            </span>
            <span
              className={cn(
                "absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                selected ? "border-primary-800 bg-primary-800 text-white" : "border-line-strong",
              )}
            >
              <IconCheck
                size={12}
                strokeWidth={3}
                className={cn("transition-opacity", selected ? "opacity-100" : "opacity-0")}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
