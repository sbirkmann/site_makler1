import { redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { findOpeningHoursForAdmin } from "@/lib/repositories/settings";
import { site } from "@/lib/site";
import { resetOpeningHoursAction, saveOpeningHoursAction } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export const metadata = { title: "Öffnungszeiten" };

/** Leerzeilen, damit sich ohne Zusatzklick neue Zeiten ergaenzen lassen. */
const EXTRA_ROWS = 3;

export default async function OpeningHoursPage() {
  if (!(await getSession())) redirect("/admin/login");

  const rows = await findOpeningHoursForAdmin();
  const usesDefaults = rows.length === 0;

  const input =
    "w-full rounded-[var(--radius-sm)] border border-line-strong bg-surface px-3 py-2 text-[0.875rem] text-primary-950";

  // Ist noch nichts gepflegt, die Vorgabe als Startbelegung anzeigen.
  const initial = usesDefaults
    ? site.openingHours.map((row) => ({
        id: "",
        days: row.days,
        hours: row.hours,
        closed: /geschlossen/i.test(row.hours),
      }))
    : rows;

  const editable = [
    ...initial,
    ...Array.from({ length: EXTRA_ROWS }, () => ({ id: "", days: "", hours: "", closed: false })),
  ];

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="display-3 text-primary-950">Öffnungszeiten</h1>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">
          Diese Zeiten erscheinen auf der Kontaktseite. Die Reihenfolge entspricht der Reihenfolge
          in dieser Liste; leere Zeilen werden beim Speichern entfernt.
        </p>
      </div>

      {usesDefaults ? (
        <p className="rounded-[var(--radius-md)] border border-line bg-surface-muted px-4 py-3 text-[0.875rem] text-ink-muted">
          Aktuell greift die Vorgabe aus der Konfiguration. Sobald Sie hier speichern, gelten
          ausschließlich die gepflegten Zeiten.
        </p>
      ) : null}

      <form action={saveOpeningHoursAction} className="flex flex-col gap-4">
        <div className="hidden gap-3 px-1 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-subtle sm:grid sm:grid-cols-[1fr_1fr_auto]">
          <span>Tag / Zeitraum</span>
          <span>Zeiten</span>
          <span>Geschlossen</span>
        </div>

        {editable.map((row, index) => (
          <div
            key={row.id || `neu-${index}`}
            className="grid gap-3 rounded-[var(--radius-md)] border border-line bg-surface p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
          >
            <input type="hidden" name="id" value={row.id} />
            <label className="flex flex-col gap-1 text-[0.8125rem] text-ink-muted">
              {/* Auf grossen Schirmen traegt die Kopfzeile die Beschriftung. */}
              <span className="sm:sr-only">Tag / Zeitraum</span>
              <input
                name="days"
                defaultValue={row.days}
                placeholder="z. B. Montag – Donnerstag"
                maxLength={120}
                className={input}
              />
            </label>
            <label className="flex flex-col gap-1 text-[0.8125rem] text-ink-muted">
              <span className="sm:sr-only">Zeiten</span>
              <input
                name="hours"
                defaultValue={row.hours}
                placeholder="z. B. 09:00 – 18:30 Uhr"
                maxLength={120}
                className={input}
              />
            </label>
            <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted sm:justify-center">
              <input type="checkbox" name={`closed-${index}`} defaultChecked={row.closed} />
              <span className="sm:sr-only">Geschlossen</span>
            </label>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <button className="rounded-[var(--radius-sm)] bg-primary-800 px-4 py-2 text-sm font-medium text-white">
            Öffnungszeiten speichern
          </button>
          <span className="text-[0.8125rem] text-ink-subtle">
            Zum Entfernen einer Zeile beide Felder leeren.
          </span>
        </div>
      </form>

      {!usesDefaults ? (
        <form action={resetOpeningHoursAction} className="border-t border-line pt-5">
          <button className="text-[0.875rem] text-red-700 underline-offset-4 hover:underline">
            Auf Vorgabe zurücksetzen
          </button>
        </form>
      ) : null}
    </div>
  );
}
