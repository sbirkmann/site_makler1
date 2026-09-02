import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconCheckCircle, IconInfo } from "@/components/icons";

export function SuccessPanel({
  title,
  message,
  children,
  className,
}: {
  title: string;
  message: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-line bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,white)] text-[var(--color-success)]">
        <IconCheckCircle size={32} strokeWidth={1.4} />
      </span>
      <div className="max-w-md">
        <h3 className="heading-4 text-primary-950">{title}</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">{message}</p>
      </div>
      {children}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-danger)_35%,white)] bg-[color-mix(in_srgb,var(--color-danger)_6%,white)] px-4 py-3 text-[0.875rem] leading-relaxed text-[var(--color-danger)]"
    >
      <IconInfo size={17} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}
