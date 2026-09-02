"use client";

import { cn } from "@/lib/utils";
import { IconCheck } from "@/components/icons";

export function FunnelProgress({
  steps,
  current,
  onStepClick,
  maxReached,
}: {
  steps: string[];
  current: number;
  onStepClick?: (index: number) => void;
  maxReached: number;
}) {
  const percent = ((current + 1) / steps.length) * 100;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.875rem] font-medium text-primary-900">
          Schritt {current + 1} von {steps.length}
        </p>
        <p className="text-[0.8125rem] text-ink-subtle">{steps[current]}</p>
      </div>

      {/* Fortschrittsbalken */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label="Fortschritt"
      >
        <div
          className="h-full rounded-full bg-accent-400 transition-[width] duration-500 [transition-timing-function:var(--ease-out-quint)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Schrittmarken – nur bereits erreichte Schritte sind anklickbar */}
      <ol className="hidden items-center justify-between gap-2 sm:flex">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= maxReached;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <button
                type="button"
                disabled={!reachable || !onStepClick}
                onClick={() => onStepClick?.(i)}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.6875rem] font-semibold transition-colors",
                  done
                    ? "border-accent-400 bg-accent-400 text-white"
                    : active
                      ? "border-primary-800 bg-primary-800 text-white"
                      : "border-line-strong text-ink-subtle",
                  reachable && onStepClick ? "cursor-pointer" : "cursor-default",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <IconCheck size={12} strokeWidth={3} /> : i + 1}
              </button>
              <span
                className={cn(
                  "truncate text-[0.75rem]",
                  active ? "font-medium text-primary-900" : "text-ink-subtle",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
