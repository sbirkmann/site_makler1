/**
 * Gemeinsamer Zustandstyp fuer Formular-Actions.
 * Bewusst in einem eigenen Modul ohne "use server", damit Client-Komponenten
 * den Startwert importieren koennen, ohne die Server Action beim ersten
 * Render auszuloesen.
 */
export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
}

export const initialFormState: FormState = { status: "idle" };
