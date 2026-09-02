import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "accent" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-[-0.005em] " +
  "transition-all duration-200 ease-out select-none " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-800 text-white shadow-[var(--shadow-subtle)] hover:bg-primary-900 hover:shadow-[var(--shadow-card)] active:translate-y-px focus-visible:outline-primary-800",
  secondary:
    "bg-surface-sunken text-primary-900 hover:bg-line-strong/60 active:translate-y-px focus-visible:outline-primary-600",
  outline:
    "border border-line-strong bg-transparent text-primary-900 hover:border-primary-700 hover:bg-primary-50/60 active:translate-y-px focus-visible:outline-primary-600",
  ghost:
    "bg-transparent text-primary-800 hover:bg-primary-50 active:translate-y-px focus-visible:outline-primary-600",
  accent:
    "bg-accent-400 text-ink shadow-[var(--shadow-subtle)] hover:bg-accent-500 hover:shadow-[var(--shadow-card)] active:translate-y-px focus-visible:outline-accent-600",
  inverse:
    "bg-white text-primary-900 shadow-[var(--shadow-subtle)] hover:bg-secondary-50 active:translate-y-px focus-visible:outline-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-[var(--radius-sm)] px-3.5 text-[0.8125rem]",
  md: "h-11 rounded-[var(--radius-md)] px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] rounded-[var(--radius-md)] px-7 text-base",
};

export interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: ButtonBaseProps = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonBaseProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  href,
  ...props
}: ButtonBaseProps & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}
