"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { PropertyCondition, PropertyType, SellingIntent } from "@prisma/client";
import { cn } from "@/lib/utils";
import { conditionLabels, propertyTypeLabels, sellingIntentLabels } from "@/lib/labels";
import { submitValuationRequest } from "@/lib/actions/inquiries";
import { initialFormState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, OptionCard } from "@/components/ui/Field";
import { ErrorNote, SuccessPanel } from "@/components/ui/FormStatus";
import { FunnelProgress } from "@/components/funnel/FunnelProgress";
import { PropertyTypeSelector } from "@/components/funnel/PropertyTypeSelector";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@/components/icons";

export type FunnelVariant = "VERKAUF" | "BEWERTUNG";

interface FunnelData {
  propertyType?: PropertyType;
  zipCode: string;
  city: string;
  street: string;
  livingArea: string;
  plotArea: string;
  rooms: string;
  yearBuilt: string;
  condition?: PropertyCondition;
  sellingIntent?: SellingIntent;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  privacyAccepted: boolean;
}

const emptyData: FunnelData = {
  zipCode: "",
  city: "",
  street: "",
  livingArea: "",
  plotArea: "",
  rooms: "",
  yearBuilt: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  privacyAccepted: false,
};

type StepId = "typ" | "standort" | "eckdaten" | "situation" | "kontakt" | "abschluss";

const stepLabels: Record<StepId, string> = {
  typ: "Immobilientyp",
  standort: "Standort",
  eckdaten: "Eckdaten",
  situation: "Ihre Situation",
  kontakt: "Kontaktdaten",
  abschluss: "Zusammenfassung",
};

const conditionOrder: PropertyCondition[] = [
  "NEUWERTIG",
  "SANIERT",
  "GEPFLEGT",
  "RENOVIERUNGSBEDUERFTIG",
  "ABRISSOBJEKT",
];

const intentOrder: SellingIntent[] = [
  "BALD_VERKAUFEN",
  "INFORMIEREN",
  "PROFESSIONELLE_BEWERTUNG",
  "KONKRETES_OBJEKT",
];

const currentYear = new Date().getFullYear();

/** Ein Grundstueck hat keine Wohnflaeche/Zimmer – der Schritt passt sich an. */
function isLand(type?: PropertyType) {
  return type === "GRUNDSTUECK";
}

export function ValuationFunnel({ variant }: { variant: FunnelVariant }) {
  const steps: StepId[] = useMemo(
    () =>
      variant === "VERKAUF"
        ? ["typ", "standort", "eckdaten", "situation", "kontakt", "abschluss"]
        : ["typ", "standort", "eckdaten", "kontakt", "abschluss"],
    [variant],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [data, setData] = useState<FunnelData>(emptyData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState(initialFormState);
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLDivElement>(null);

  const step = steps[stepIndex];

  const update = useCallback(<K extends keyof FunnelData>(key: K, value: FunnelData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  // Nach einem Schrittwechsel den Fokus in den neuen Schritt setzen
  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  /** Validierung pro Schritt – blockiert nur den jeweils aktuellen Schritt. */
  function validate(current: StepId): boolean {
    const e: Record<string, string> = {};

    if (current === "typ" && !data.propertyType) {
      e.propertyType = "Bitte wählen Sie einen Immobilientyp.";
    }

    if (current === "standort") {
      if (!/^\d{5}$/.test(data.zipCode.trim())) {
        e.zipCode = "Bitte eine 5-stellige Postleitzahl angeben.";
      }
      if (data.city.trim().length < 2) e.city = "Bitte den Ort angeben.";
    }

    if (current === "eckdaten") {
      const land = isLand(data.propertyType);
      if (land) {
        if (!data.plotArea.trim()) e.plotArea = "Bitte die Grundstücksfläche angeben.";
      } else {
        if (!data.livingArea.trim()) e.livingArea = "Bitte die Wohnfläche angeben.";
        if (!data.rooms.trim()) e.rooms = "Bitte die Zimmerzahl angeben.";
      }
      const numeric: [keyof FunnelData, string][] = land
        ? [["plotArea", "Grundstücksfläche"]]
        : [
            ["livingArea", "Wohnfläche"],
            ["rooms", "Zimmerzahl"],
          ];
      for (const [key, label] of numeric) {
        const raw = String(data[key] ?? "").replace(",", ".").trim();
        if (raw && (Number.isNaN(Number(raw)) || Number(raw) <= 0)) {
          e[key as string] = `Bitte ${label} als Zahl angeben.`;
        }
      }
      if (data.yearBuilt.trim()) {
        const y = Number(data.yearBuilt);
        if (!Number.isInteger(y) || y < 1500 || y > currentYear + 3) {
          e.yearBuilt = `Bitte ein Baujahr zwischen 1500 und ${currentYear + 3} angeben.`;
        }
      }
    }

    if (current === "situation" && !data.sellingIntent) {
      e.sellingIntent = "Bitte wählen Sie eine Option.";
    }

    if (current === "kontakt") {
      if (data.firstName.trim().length < 2) e.firstName = "Bitte Vornamen angeben.";
      if (data.lastName.trim().length < 2) e.lastName = "Bitte Nachnamen angeben.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(data.email.trim())) {
        e.email = "Bitte eine gültige E-Mail-Adresse angeben.";
      }
      if (data.phone.trim() && !/^[0-9+()/\s.-]{5,}$/.test(data.phone.trim())) {
        e.phone = "Bitte eine gültige Telefonnummer angeben.";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setStepIndex((i) => {
      const n = Math.min(i + 1, steps.length - 1);
      setMaxReached((m) => Math.max(m, n));
      return n;
    });
  }

  function back() {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function submit() {
    if (!data.privacyAccepted) {
      setErrors({ privacyAccepted: "Bitte stimmen Sie der Datenschutzerklärung zu." });
      return;
    }

    const fd = new FormData();
    fd.set("funnel", variant);
    fd.set("propertyType", data.propertyType ?? "");
    fd.set("zipCode", data.zipCode.trim());
    fd.set("city", data.city.trim());
    fd.set("street", data.street.trim());
    fd.set("livingArea", data.livingArea.trim());
    fd.set("plotArea", data.plotArea.trim());
    fd.set("rooms", data.rooms.trim());
    fd.set("yearBuilt", data.yearBuilt.trim());
    if (data.condition) fd.set("condition", data.condition);
    if (data.sellingIntent) fd.set("sellingIntent", data.sellingIntent);
    fd.set("firstName", data.firstName.trim());
    fd.set("lastName", data.lastName.trim());
    fd.set("email", data.email.trim());
    fd.set("phone", data.phone.trim());
    fd.set("message", data.message.trim());
    fd.set("privacyAccepted", "on");

    startTransition(async () => {
      const result = await submitValuationRequest(initialFormState, fd);
      setState(result);
      if (result.status === "error" && result.errors) setErrors(result.errors);
      if (result.status === "success") {
        window.dispatchEvent(
          new CustomEvent("makler:lead", {
            detail: { type: variant === "VERKAUF" ? "verkaufsfunnel" : "bewertungsfunnel" },
          }),
        );
      }
    });
  }

  if (state.status === "success") {
    return (
      <SuccessPanel
        title="Ihre Anfrage wurde erfolgreich übermittelt."
        message={
          variant === "VERKAUF"
            ? "Wir sichten Ihre Angaben und melden uns innerhalb eines Werktages mit einer ersten Einschätzung – telefonisch oder per E-Mail, ganz wie es Ihnen lieber ist."
            : "Wir bereiten Ihre Bewertung vor und melden uns innerhalb eines Werktages bei Ihnen. Für eine belastbare Einschätzung stimmen wir vorher noch kurz einige Details ab."
        }
        className="border-0 shadow-none"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/immobilien"
            className="text-[0.875rem] font-medium text-primary-800 underline-offset-4 hover:underline"
          >
            Aktuelle Immobilien ansehen
          </Link>
          <span className="hidden text-ink-subtle sm:inline">·</span>
          <Link
            href="/ratgeber"
            className="text-[0.875rem] font-medium text-primary-800 underline-offset-4 hover:underline"
          >
            Ratgeber lesen
          </Link>
        </div>
      </SuccessPanel>
    );
  }

  const land = isLand(data.propertyType);

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <FunnelProgress
        steps={steps.map((s) => stepLabels[s])}
        current={stepIndex}
        maxReached={maxReached}
        onStepClick={(i) => {
          if (i < stepIndex) setStepIndex(i);
        }}
      />

      <div
        ref={headingRef}
        tabIndex={-1}
        key={step}
        className="min-w-0 animate-[funnel-in_0.4s_var(--ease-out-quint)] outline-none"
      >
        {step === "typ" ? (
          <section>
            <h2 className="heading-4 text-primary-950">Um welche Immobilie geht es?</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">
              Wählen Sie die Art Ihrer Immobilie – danach folgen nur noch wenige Fragen.
            </p>
            <div className="mt-6">
              <PropertyTypeSelector
                value={data.propertyType}
                onChange={(v) => update("propertyType", v)}
              />
            </div>
            {errors.propertyType ? (
              <p className="mt-3 text-[0.8125rem] text-[var(--color-danger)]" role="alert">
                {errors.propertyType}
              </p>
            ) : null}
          </section>
        ) : null}

        {step === "standort" ? (
          <section>
            <h2 className="heading-4 text-primary-950">Wo liegt die Immobilie?</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">
              Die Lage ist der wichtigste Einzelfaktor für den Wert. Die Straße ist optional.
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
                <Input
                  label="Postleitzahl"
                  required
                  inputMode="numeric"
                  maxLength={5}
                  autoComplete="postal-code"
                  value={data.zipCode}
                  onChange={(e) => update("zipCode", e.target.value.replace(/\D/g, ""))}
                  error={errors.zipCode}
                />
                <Input
                  label="Ort"
                  required
                  autoComplete="address-level2"
                  value={data.city}
                  onChange={(e) => update("city", e.target.value)}
                  error={errors.city}
                />
              </div>
              <Input
                label="Straße und Hausnummer"
                hint="Optional – hilft uns bei der Einordnung der Mikrolage"
                autoComplete="street-address"
                value={data.street}
                onChange={(e) => update("street", e.target.value)}
                error={errors.street}
              />
            </div>
          </section>
        ) : null}

        {step === "eckdaten" ? (
          <section>
            <h2 className="heading-4 text-primary-950">Die wichtigsten Eckdaten</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">
              Ungefähre Angaben genügen – wir präzisieren gemeinsam.
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {!land ? (
                  <Input
                    label="Wohnfläche in m²"
                    required
                    inputMode="decimal"
                    value={data.livingArea}
                    onChange={(e) => update("livingArea", e.target.value)}
                    error={errors.livingArea}
                  />
                ) : null}
                {land || data.propertyType === "HAUS" || data.propertyType === "MEHRFAMILIENHAUS" ? (
                  <Input
                    label="Grundstücksfläche in m²"
                    required={land}
                    inputMode="decimal"
                    value={data.plotArea}
                    onChange={(e) => update("plotArea", e.target.value)}
                    error={errors.plotArea}
                  />
                ) : null}
                {!land ? (
                  <Input
                    label="Zimmer"
                    required
                    inputMode="decimal"
                    value={data.rooms}
                    onChange={(e) => update("rooms", e.target.value)}
                    error={errors.rooms}
                  />
                ) : null}
                {!land ? (
                  <Input
                    label="Baujahr"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="z. B. 1998"
                    value={data.yearBuilt}
                    onChange={(e) => update("yearBuilt", e.target.value.replace(/\D/g, ""))}
                    error={errors.yearBuilt}
                  />
                ) : null}
              </div>

              {!land ? (
                <fieldset className="mt-2">
                  <legend className="mb-3 text-[0.8125rem] font-medium text-ink-muted">
                    Zustand der Immobilie
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {conditionOrder.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update("condition", c)}
                        aria-pressed={data.condition === c}
                        className={cn(
                          "rounded-full border px-4 py-2.5 text-[0.875rem] font-medium transition-all",
                          data.condition === c
                            ? "border-primary-800 bg-primary-800 text-white"
                            : "border-line-strong text-ink-muted hover:border-primary-300 hover:text-primary-800",
                        )}
                      >
                        {conditionLabels[c]}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}
            </div>
          </section>
        ) : null}

        {step === "situation" ? (
          <section>
            <h2 className="heading-4 text-primary-950">Wo stehen Sie gerade?</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">
              So können wir das Gespräch auf Ihre Situation zuschneiden.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {intentOrder.map((intent) => (
                <OptionCard
                  key={intent}
                  selected={data.sellingIntent === intent}
                  title={sellingIntentLabels[intent]}
                  onClick={() => update("sellingIntent", intent)}
                />
              ))}
            </div>
            {errors.sellingIntent ? (
              <p className="mt-3 text-[0.8125rem] text-[var(--color-danger)]" role="alert">
                {errors.sellingIntent}
              </p>
            ) : null}
          </section>
        ) : null}

        {step === "kontakt" ? (
          <section>
            <h2 className="heading-4 text-primary-950">Wie dürfen wir Sie erreichen?</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">
              Wir melden uns innerhalb eines Werktages – ohne automatisierte Werbung.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input
                label="Vorname"
                required
                autoComplete="given-name"
                value={data.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                error={errors.firstName}
              />
              <Input
                label="Nachname"
                required
                autoComplete="family-name"
                value={data.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                error={errors.lastName}
              />
              <Input
                label="E-Mail"
                type="email"
                required
                autoComplete="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />
              <Input
                label="Telefon"
                type="tel"
                autoComplete="tel"
                hint="Optional – beschleunigt die Rückmeldung"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                error={errors.phone}
              />
            </div>
          </section>
        ) : null}

        {step === "abschluss" ? (
          <section>
            <h2 className="heading-4 text-primary-950">Ihre Angaben im Überblick</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">
              Bitte prüfen Sie kurz – über &bdquo;Zurück&ldquo; können Sie jederzeit korrigieren.
            </p>

            <dl className="mt-6 divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line">
              <SummaryRow
                label="Immobilientyp"
                value={data.propertyType ? propertyTypeLabels[data.propertyType] : "–"}
              />
              <SummaryRow
                label="Standort"
                value={[data.street, `${data.zipCode} ${data.city}`].filter(Boolean).join(", ")}
              />
              {!land ? (
                <>
                  <SummaryRow label="Wohnfläche" value={data.livingArea ? `${data.livingArea} m²` : "–"} />
                  <SummaryRow label="Zimmer" value={data.rooms || "–"} />
                  <SummaryRow label="Baujahr" value={data.yearBuilt || "–"} />
                  <SummaryRow
                    label="Zustand"
                    value={data.condition ? conditionLabels[data.condition] : "–"}
                  />
                </>
              ) : null}
              {data.plotArea ? (
                <SummaryRow label="Grundstücksfläche" value={`${data.plotArea} m²`} />
              ) : null}
              {data.sellingIntent ? (
                <SummaryRow label="Ihre Situation" value={sellingIntentLabels[data.sellingIntent]} />
              ) : null}
              <SummaryRow label="Name" value={`${data.firstName} ${data.lastName}`} />
              <SummaryRow label="E-Mail" value={data.email} />
              {data.phone ? <SummaryRow label="Telefon" value={data.phone} /> : null}
            </dl>

            <div className="mt-6 flex flex-col gap-4">
              {state.status === "error" && state.message ? (
                <ErrorNote message={state.message} />
              ) : null}

              <Checkbox
                checked={data.privacyAccepted}
                onChange={(e) => update("privacyAccepted", e.target.checked)}
                error={errors.privacyAccepted}
                label={
                  <>
                    Ich habe die{" "}
                    <Link href="/datenschutz" className="text-primary-800 underline underline-offset-2">
                      Datenschutzerklärung
                    </Link>{" "}
                    gelesen und bin mit der Verarbeitung meiner Daten zur Bearbeitung dieser Anfrage
                    einverstanden.
                  </>
                }
              />
            </div>
          </section>
        ) : null}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {stepIndex > 0 ? (
          <Button variant="ghost" onClick={back} disabled={pending}>
            <IconArrowLeft size={17} />
            Zurück
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {step === "abschluss" ? (
          <Button size="lg" onClick={submit} disabled={pending} className="sm:min-w-72">
            {pending ? (
              "Wird übermittelt …"
            ) : (
              <>
                <IconCheck size={18} />
                {variant === "VERKAUF"
                  ? "Kostenlose Immobilienbewertung anfordern"
                  : "Bewertung jetzt anfordern"}
              </>
            )}
          </Button>
        ) : (
          <Button size="lg" onClick={next} className="sm:min-w-48">
            Weiter
            <IconArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 px-5 py-3.5">
      <dt className="text-[0.875rem] text-ink-muted">{label}</dt>
      <dd className="text-right text-[0.875rem] font-medium text-primary-950">{value || "–"}</dd>
    </div>
  );
}
