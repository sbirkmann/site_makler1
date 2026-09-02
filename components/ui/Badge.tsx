import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "accent" | "muted" | "inverse" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-primary-50 text-primary-800",
  success: "bg-[color-mix(in_srgb,var(--color-success)_12%,white)] text-[var(--color-success)]",
  accent: "bg-accent-50 text-accent-700",
  muted: "bg-surface-sunken text-ink-muted",
  inverse: "bg-primary-900/85 text-white backdrop-blur-sm",
  outline: "border border-line-strong text-ink-muted",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
