"use client";

import { useRef } from "react";
import type { RequestStatus } from "@prisma/client";
import { updateRequestStatusAction } from "@/lib/actions/admin";
import { requestStatusLabels } from "@/lib/labels";

/**
 * Statuswechsel ohne eigenen Speichern-Button:
 * Das Formular wird bei Auswahl direkt abgeschickt.
 */
export function StatusSelect({
  kind,
  id,
  status,
}: {
  kind: "lead" | "valuation" | "contact";
  id: string;
  status: RequestStatus;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateRequestStatusAction}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        Status ändern
      </label>
      <select
        id={`status-${id}`}
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="select-field h-9 rounded-[var(--radius-sm)] border border-line-strong bg-surface pl-3 text-[0.8125rem] text-ink transition-colors focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/15"
      >
        {Object.entries(requestStatusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </form>
  );
}
