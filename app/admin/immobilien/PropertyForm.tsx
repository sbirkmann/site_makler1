"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Property, PropertyImage } from "@prisma/client";
import { savePropertyAction, deletePropertyAction } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/actions/form-state";
import { toNumber, slugify } from "@/lib/utils";
import { marketingTypeLabels, propertyTypeLabels, statusLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { ErrorNote } from "@/components/ui/FormStatus";
import { IconCheckCircle, IconTrash } from "@/components/icons";

type PropertyWithImages = Property & { images: PropertyImage[] };

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Wird gespeichert …" : isNew ? "Immobilie anlegen" : "Änderungen speichern"}
    </Button>
  );
}

export function PropertyForm({
  property,
  agents,
  saved,
}: {
  property?: PropertyWithImages;
  agents: { id: string; firstName: string; lastName: string }[];
  saved?: boolean;
}) {
  const [state, action] = useActionState(savePropertyAction, initialFormState);
  const isNew = !property;

  return (
    <div className="flex flex-col gap-6">
      {(state.status === "success" || saved) && (
        <p
          role="status"
          className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-success)_30%,white)] bg-[color-mix(in_srgb,var(--color-success)_7%,white)] px-4 py-3 text-[0.875rem] text-[var(--color-success)]"
        >
          <IconCheckCircle size={18} />
          {state.message ?? "Änderungen gespeichert."}
        </p>
      )}

      <form action={action} className="flex flex-col gap-8">
        {property ? <input type="hidden" name="id" value={property.id} /> : null}

        {state.status === "error" && state.message ? <ErrorNote message={state.message} /> : null}

        {/* Basisdaten */}
        <fieldset className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-7">
          <legend className="px-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
            Basisdaten
          </legend>
          <div className="mt-4 flex flex-col gap-4">
            <Input
              label="Titel"
              name="title"
              required
              defaultValue={property?.title}
              error={state.errors?.title}
              onChange={(e) => {
                // Slug beim Anlegen automatisch vorschlagen
                if (!isNew) return;
                const form = e.currentTarget.form;
                const slugField = form?.elements.namedItem("slug") as HTMLInputElement | null;
                if (slugField && !slugField.dataset.touched) {
                  slugField.value = slugify(e.currentTarget.value);
                }
              }}
            />
            <Input
              label="Slug (URL)"
              name="slug"
              required
              defaultValue={property?.slug}
              hint="Nur Kleinbuchstaben, Zahlen und Bindestriche"
              error={state.errors?.slug}
              onChange={(e) => {
                e.currentTarget.dataset.touched = "1";
              }}
            />
            <Textarea
              label="Kurzbeschreibung"
              name="shortDescription"
              required
              rows={3}
              defaultValue={property?.shortDescription}
              hint="Erscheint auf der Übersichtskarte"
              error={state.errors?.shortDescription}
            />
            <Textarea
              label="Beschreibung"
              name="description"
              required
              rows={10}
              defaultValue={property?.description}
              hint="Absätze mit einer Leerzeile trennen"
              error={state.errors?.description}
            />
          </div>
        </fieldset>

        {/* Einordnung */}
        <fieldset className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-7">
          <legend className="px-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
            Einordnung
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Vermarktung"
              name="marketingType"
              className="select-field"
              defaultValue={property?.marketingType ?? "KAUF"}
            >
              {Object.entries(marketingTypeLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
            <Select
              label="Immobilientyp"
              name="propertyType"
              className="select-field"
              defaultValue={property?.propertyType ?? "HAUS"}
            >
              {Object.entries(propertyTypeLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
            <Select
              label="Status"
              name="status"
              className="select-field"
              defaultValue={property?.status ?? "VERFUEGBAR"}
            >
              {Object.entries(statusLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
            <Select
              label="Ansprechpartner"
              name="agentId"
              className="select-field"
              defaultValue={property?.agentId ?? ""}
            >
              <option value="">– nicht zugeordnet –</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.firstName} {a.lastName}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-5 flex flex-wrap gap-6">
            <Checkbox
              name="featured"
              defaultChecked={property?.featured}
              label="Als Empfehlung auf der Startseite hervorheben"
            />
          </div>
        </fieldset>

        {/* Preis & Flaechen */}
        <fieldset className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-7">
          <legend className="px-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
            Preis & Flächen
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Preis in €"
              name="price"
              inputMode="decimal"
              defaultValue={toNumber(property?.price ?? null) ?? ""}
              error={state.errors?.price}
            />
            <Input
              label="Wohnfläche m²"
              name="livingArea"
              inputMode="decimal"
              defaultValue={property?.livingArea ?? ""}
              error={state.errors?.livingArea}
            />
            <Input
              label="Grundstück m²"
              name="plotArea"
              inputMode="decimal"
              defaultValue={property?.plotArea ?? ""}
              error={state.errors?.plotArea}
            />
            <Input
              label="Zimmer"
              name="rooms"
              inputMode="decimal"
              defaultValue={property?.rooms ?? ""}
              error={state.errors?.rooms}
            />
            <Input
              label="Schlafzimmer"
              name="bedrooms"
              inputMode="numeric"
              defaultValue={property?.bedrooms ?? ""}
              error={state.errors?.bedrooms}
            />
            <Input
              label="Badezimmer"
              name="bathrooms"
              inputMode="numeric"
              defaultValue={property?.bathrooms ?? ""}
              error={state.errors?.bathrooms}
            />
            <Input
              label="Baujahr"
              name="yearBuilt"
              inputMode="numeric"
              defaultValue={property?.yearBuilt ?? ""}
              error={state.errors?.yearBuilt}
            />
          </div>
          <div className="mt-5">
            <Checkbox
              name="priceOnRequest"
              defaultChecked={property?.priceOnRequest}
              label="Preis auf Anfrage (überschreibt den Preis)"
            />
          </div>
        </fieldset>

        {/* Lage */}
        <fieldset className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-7">
          <legend className="px-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
            Lage
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Straße"
              name="street"
              defaultValue={property?.street ?? ""}
              error={state.errors?.street}
            />
            <Input
              label="PLZ"
              name="zipCode"
              required
              inputMode="numeric"
              maxLength={5}
              defaultValue={property?.zipCode}
              error={state.errors?.zipCode}
            />
            <Input
              label="Stadt"
              name="city"
              required
              defaultValue={property?.city}
              error={state.errors?.city}
            />
            <Input
              label="Stadtteil / Region"
              name="region"
              defaultValue={property?.region ?? ""}
              error={state.errors?.region}
            />
          </div>
        </fieldset>

        {/* Inhalte */}
        <fieldset className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-7">
          <legend className="px-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
            Highlights, Ausstattung & Bilder
          </legend>
          <div className="mt-4 flex flex-col gap-4">
            <Textarea
              label="Highlights"
              name="highlights"
              rows={4}
              defaultValue={property?.highlights.join("\n")}
              hint="Eine Angabe pro Zeile"
            />
            <Textarea
              label="Ausstattung"
              name="features"
              rows={5}
              defaultValue={property?.features.join("\n")}
              hint="Eine Angabe pro Zeile"
            />
            <Textarea
              label="Bild-URLs"
              name="imageUrls"
              rows={5}
              defaultValue={property?.images.map((i) => i.url).join("\n")}
              hint="Eine URL pro Zeile – die erste wird zum Titelbild. Beim Speichern werden vorhandene Bilder ersetzt, sofern hier etwas steht."
            />
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton isNew={isNew} />
          <Link
            href="/admin/immobilien"
            className="text-[0.875rem] text-ink-muted underline-offset-4 hover:text-primary-800 hover:underline"
          >
            Abbrechen
          </Link>
          {property ? (
            <Link
              href={`/immobilien/${property.slug}`}
              target="_blank"
              className="ml-auto text-[0.875rem] text-ink-muted underline-offset-4 hover:text-primary-800 hover:underline"
            >
              Auf der Website ansehen ↗
            </Link>
          ) : null}
        </div>
      </form>

      {/* Loeschen bewusst als eigenes Formular ausserhalb des Speicher-Formulars */}
      {property ? (
        <form
          action={deletePropertyAction}
          className="mt-4 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-danger)_28%,white)] bg-[color-mix(in_srgb,var(--color-danger)_4%,white)] p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <input type="hidden" name="id" value={property.id} />
          <div>
            <p className="text-[0.9375rem] font-medium text-[var(--color-danger)]">
              Immobilie löschen
            </p>
            <p className="mt-1 text-[0.8125rem] text-ink-muted">
              Entfernt das Objekt samt Bildern dauerhaft. Zugehörige Anfragen bleiben erhalten.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-danger)] px-4 py-2.5 text-[0.875rem] font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)] hover:text-white"
          >
            <IconTrash size={16} />
            Endgültig löschen
          </button>
        </form>
      ) : null}
    </div>
  );
}
