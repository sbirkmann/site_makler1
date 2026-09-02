"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconChevronDown } from "@/components/icons";

const controlBase =
  "w-full rounded-[var(--radius-md)] border bg-surface text-[0.9375rem] text-ink " +
  "placeholder:text-ink-subtle transition-colors duration-150 " +
  "focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/15 " +
  "disabled:bg-surface-muted disabled:text-ink-subtle";

function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-[0.8125rem] font-medium text-ink-muted"
        >
          {label}
          {required ? <span className="ml-0.5 text-accent-600">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-[0.8125rem] text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[0.8125rem] text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({
  label,
  hint,
  error,
  className,
  containerClassName,
  id,
  ...props
}: ComponentPropsWithoutRef<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={props.required}
      className={containerClassName}
    >
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={cn(
          controlBase,
          "h-11 px-3.5",
          error ? "border-[var(--color-danger)]" : "border-line-strong",
          className,
        )}
        {...props}
      />
    </FieldShell>
  );
}

export function Textarea({
  label,
  hint,
  error,
  className,
  containerClassName,
  id,
  rows = 5,
  ...props
}: ComponentPropsWithoutRef<"textarea"> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={props.required}
      className={containerClassName}
    >
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          controlBase,
          "resize-y px-3.5 py-3 leading-relaxed",
          error ? "border-[var(--color-danger)]" : "border-line-strong",
          className,
        )}
        {...props}
      />
    </FieldShell>
  );
}

export function Select({
  label,
  hint,
  error,
  className,
  containerClassName,
  id,
  children,
  ...props
}: ComponentPropsWithoutRef<"select"> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={props.required}
      className={containerClassName}
    >
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={error ? true : undefined}
          className={cn(
            controlBase,
            "h-11 appearance-none pr-10 pl-3.5",
            error ? "border-[var(--color-danger)]" : "border-line-strong",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <IconChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle"
        />
      </div>
    </FieldShell>
  );
}

export function Checkbox({
  label,
  error,
  className,
  id,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label: ReactNode;
  error?: string;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={fieldId} className="group flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center">
          <input
            id={fieldId}
            type="checkbox"
            className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[var(--radius-xs)] border border-line-strong bg-surface transition-colors checked:border-primary-800 checked:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            aria-invalid={error ? true : undefined}
            {...props}
          />
          <IconCheck
            size={12}
            strokeWidth={2.75}
            className="pointer-events-none relative text-white opacity-0 transition-opacity peer-checked:opacity-100"
          />
        </span>
        <span className="text-[0.8125rem] leading-relaxed text-ink-muted">{label}</span>
      </label>
      {error ? (
        <p className="pl-[1.875rem] text-[0.8125rem] text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Grosse, klickbare Auswahlkachel fuer die Funnels. */
export function OptionCard({
  selected,
  icon,
  title,
  description,
  onClick,
  className,
}: {
  selected?: boolean;
  icon?: ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-start gap-4 rounded-[var(--radius-lg)] border p-5 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
        selected
          ? "border-primary-700 bg-primary-50/70 shadow-[var(--shadow-card)]"
          : "border-line-strong bg-surface hover:border-primary-300",
        className,
      )}
    >
      {icon ? (
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-colors",
            selected ? "bg-primary-800 text-white" : "bg-surface-sunken text-primary-700",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col gap-1 pt-0.5">
        <span className="font-medium text-primary-950">{title}</span>
        {description ? (
          <span className="text-[0.8125rem] leading-relaxed text-ink-muted">{description}</span>
        ) : null}
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
}
