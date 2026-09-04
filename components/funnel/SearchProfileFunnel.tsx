"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { MarketingType, PropertyType } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  propertyTypeLabels,
  searchFinancingLabels,
  searchTimeframeLabels,
} from "@/lib/labels";
import { submitSearchProfile } from "@/lib/actions/inquiries";
import { initialFormState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, OptionCard, Textarea } from "@/components/ui/Field";
import { ErrorNote, SuccessPanel } from "@/components/ui/FormStatus";
import { FunnelProgress } from "@/components/funnel/FunnelProgress";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@/components/icons";

interface ProfileData {
  marketingType: MarketingType;
  propertyTypes: PropertyType[];
  regions: string;
  zipCode: string;
  radiusKm: string;
  priceMin: string;
  priceMax: string;
  roomsMin: string;
  areaMin: string;
  plotAreaMin: string;
  timeframe?: string;
  financing?: string;
  ownUse: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  notifyByEmail: boolean;
  privacyAccepted: boolean;
}

const emptyData: ProfileData = {
  marketingType: "KAUF",
  propertyTypes: [],
  regions: "",
  zipCode: "",
  radiusKm: "",
  priceMin: "",
  priceMax: "",
  roomsMin: "",
  areaMin: "",
  plotAreaMin: "",
  ownUse: true,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  notifyByEmail: true,
  privacyAccepted: false,
};

type StepId = "art" | "typ" | "ort" | "budget" | "rahmen" | "kontakt";

const steps: StepId[] = ["art", "typ", "ort", "budget", "rahmen", "kontakt"];

const stepLabels: Record<StepId, string> = {
  art: "Kauf oder Miete",
  typ: "Immobilientyp",
  ort: "Wunschlage",
  budget: "Budget & Größe",
  rahmen: "Zeitrahmen",
  kontakt: "Kontaktdaten",
};

const typeOrder: PropertyType[] = [
  "HAUS",
  "WOHNUNG",
  "MEHRFAMILIENHAUS",
  "GRUNDSTUECK",
  "GEWERBE",
];

const timeframeOrder = ["SOFORT", "DREI_MONATE", "SECHS_MONATE", "JAHR", "UNBESTIMMT"];
const financingOrder = ["GESICHERT", "IN_KLAERUNG", "OFFEN", "BERATUNG"];

/** Nur Ziffern und Trennzeichen – erlaubt Eingaben wie "750.000". */
function toNumberString(value: string) {
  return value.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", ".");
}

export function SearchProfileFunnel() {
  const [stepIndex, setStepIndex] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [data, setData] = useState<ProfileData>(emptyData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState(initialFormState);
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLDivElement>(null);

  const step = steps[stepIndex];
  const isRent = data.marketingType === "MIETE";

  const update = useCallback(<K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  function toggleType(type: PropertyType) {
    setErrors((prev) => {
      if (!prev.propertyTypes) return prev;
      const next = { ...prev };
      delete next.propertyTypes;
      return next;
    });
    setData((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  }

  /** Validierung pro Schritt – blockiert nur den jeweils aktuellen Schritt. */
  function validate(current: StepId): boolean {
    const e: Record<string, string> = {};

    if (current === "typ" && data.propertyTypes.length === 0) {
      e.propertyTypes = "Bitte wählen Sie mindestens einen Immobilientyp.";
    }

    if (current === "ort") {
      if (!data.regions.trim() && !data.zipCode.trim()) {
        e.regions = "Bitte geben Sie mindestens einen Ort oder eine Postleitzahl an.";
      }
      if (data.zipCode.trim() && !/^\d{5}$/.test(data.zipCode.trim())) {
        e.zipCode = "Bitte eine 5-stellige Postleitzahl angeben.";
      }
    }

    if (current === "budget") {
      const min = Number(toNumberString(data.priceMin));
      const max = Number(toNumberString(data.priceMax));
      if (data.priceMin.trim() && (Number.isNaN(min) || min < 0)) {
        e.priceMin = "Bitte einen gültigen Betrag angeben.";
      }
      if (data.priceMax.trim() && (Number.isNaN(max) || max <= 0)) {
        e.priceMax = "Bitte einen gültigen Betrag angeben.";
      }
      if (data.priceMin.trim() && data.priceMax.trim() && min > max) {
        e.priceMax = "Der Höchstpreis muss über dem Mindestpreis liegen.";
      }
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
    if (!validate("kontakt")) return;
    if (!data.privacyAccepted) {
      setErrors({ privacyAccepted: "Bitte stimmen Sie der Datenschutzerklärung zu." });
      return;
    }

    const fd = new FormData();
    fd.set("marketingType", data.marketingType);
    fd.set("propertyTypes", data.propertyTypes.join(","));
    fd.set(
      "regions",
      data.regions
        .split(/[,;\n]/)
        .map((r) => r.trim())
        .filter(Boolean)
        .join(","),
    );
    fd.set("zipCode", data.zipCode.trim());
    fd.set("radiusKm", toNumberString(data.radiusKm));
    fd.set("priceMin", toNumberString(data.priceMin));
    fd.set("priceMax", toNumberString(data.priceMax));
    fd.set("roomsMin", toNumberString(data.roomsMin));
    fd.set("areaMin", toNumberString(data.areaMin));
    fd.set("plotAreaMin", toNumberString(data.plotAreaMin));
    if (data.timeframe) fd.set("timeframe", data.timeframe);
    if (data.financing) fd.set("financing", data.financing);
    if (data.ownUse) fd.set("ownUse", "on");
    fd.set("firstName", data.firstName.trim());
    fd.set("lastName", data.lastName.trim());
    fd.set("email", data.email.trim());
    fd.set("phone", data.phone.trim());
    fd.set("message", data.message.trim());
    if (data.notifyByEmail) fd.set("notifyByEmail", "on");
    fd.set("privacyAccepted", "on");

    startTransition(async () => {
      const result = await submitSearchProfile(initialFormState, fd);
      setState(result);
      if (result.status === "error" && result.errors) setErrors(result.errors);
      if (result.status === "success") {
        window.dispatchEvent(
          new CustomEvent("makler:lead", { detail: { type: "suchprofil" } }),
        );
      }
    });
  }

  if (state.status === "success") {
    return (
      <SuccessPanel
        title="Ihr Suchprofil ist hinterlegt."
        message="Wir gleichen Ihre Kriterien mit unserem Bestand ab – auch mit Objekten, die wir nicht öffentlich inserieren. Sobald etwas Passendes dabei ist, melden wir uns bei Ihnen."
        className="border-0 shadow-none"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/immobilien"
            className="text-[0.875rem] font-medium text-primary-800 underline-offset-4 hover:underline"
          >
            Aktuelle Angebote ansehen
          </Link>
        </div>
      </SuccessPanel>
    );
  }

  const isLast = step === "kontakt";

  return (
    <div className="flex flex-col gap-8">
      <FunnelProgress
        steps={steps.map((s) => stepLabels[s])}
        current={stepIndex}
        maxReached={maxReached}
        onStepClick={(i) => {
          if (i <= maxReached) {
            setErrors({});
            setStepIndex(i);
          }
        }}
      />

      <div ref={headingRef} tabIndex={-1} className="outline-none">
        {step === "art" ? (
          <Fieldset
            title="Möchten Sie kaufen oder mieten?"
            description="Danach richten sich Auswahl und Budgetangaben."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {(["KAUF", "MIETE"] as const).map((type) => (
                <OptionCard
                  key={type}
                  selected={data.marketingType === type}
                  title={type === "KAUF" ? "Kaufen" : "Mieten"}
                  description={
                    type === "KAUF"
                      ? "Eigentum zur Selbstnutzung oder Kapitalanlage"
                      : "Wohnung oder Haus zur Miete"
                  }
                  onClick={() => update("marketingType", type)}
                />
              ))}
            </div>
          </Fieldset>
        ) : null}

        {step === "typ" ? (
          <Fieldset
            title="Was suchen Sie?"
            description="Mehrfachauswahl möglich – wir berücksichtigen alle gewählten Objektarten."
            error={errors.propertyTypes}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {typeOrder.map((type) => (
                <OptionCard
                  key={type}
                  selected={data.propertyTypes.includes(type)}
                  title={propertyTypeLabels[type]}
                  onClick={() => toggleType(type)}
                />
              ))}
            </div>
          </Fieldset>
        ) : null}

        {step === "ort" ? (
          <Fieldset
            title="Wo soll die Immobilie liegen?"
            description="Nennen Sie uns Orte, Stadtteile oder eine Postleitzahl mit Umkreis."
          >
            <div className="flex flex-col gap-5">
              <Input
                label="Orte oder Stadtteile"
                hint="Mehrere Angaben mit Komma trennen, z. B. Köln-Sülz, Bonn, Rösrath"
                value={data.regions}
                error={errors.regions}
                onChange={(e) => update("regions", e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Postleitzahl (optional)"
                  inputMode="numeric"
                  maxLength={5}
                  value={data.zipCode}
                  error={errors.zipCode}
                  onChange={(e) => update("zipCode", e.target.value)}
                />
                <Input
                  label="Umkreis in km (optional)"
                  inputMode="numeric"
                  value={data.radiusKm}
                  error={errors.radiusKm}
                  onChange={(e) => update("radiusKm", e.target.value)}
                />
              </div>
            </div>
          </Fieldset>
        ) : null}

        {step === "budget" ? (
          <Fieldset
            title={isRent ? "Welche Miete und Größe passen?" : "Welches Budget und welche Größe?"}
            description="Alle Angaben sind optional – sie helfen uns, gezielter vorzuschlagen."
          >
            <div className="flex flex-col gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={isRent ? "Miete ab (€)" : "Kaufpreis ab (€)"}
                  inputMode="numeric"
                  value={data.priceMin}
                  error={errors.priceMin}
                  onChange={(e) => update("priceMin", e.target.value)}
                />
                <Input
                  label={isRent ? "Miete bis (€)" : "Kaufpreis bis (€)"}
                  inputMode="numeric"
                  value={data.priceMax}
                  error={errors.priceMax}
                  onChange={(e) => update("priceMax", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Zimmer ab"
                  inputMode="decimal"
                  value={data.roomsMin}
                  error={errors.roomsMin}
                  onChange={(e) => update("roomsMin", e.target.value)}
                />
                <Input
                  label="Wohnfläche ab (m²)"
                  inputMode="numeric"
                  value={data.areaMin}
                  error={errors.areaMin}
                  onChange={(e) => update("areaMin", e.target.value)}
                />
                <Input
                  label="Grundstück ab (m²)"
                  inputMode="numeric"
                  value={data.plotAreaMin}
                  error={errors.plotAreaMin}
                  onChange={(e) => update("plotAreaMin", e.target.value)}
                />
              </div>
            </div>
          </Fieldset>
        ) : null}

        {step === "rahmen" ? (
          <Fieldset
            title="Wie ist Ihr zeitlicher Rahmen?"
            description="So können wir einschätzen, wie dringend wir Sie informieren sollten."
          >
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-3">
                {timeframeOrder.map((key) => (
                  <OptionCard
                    key={key}
                    selected={data.timeframe === key}
                    title={searchTimeframeLabels[key]}
                    onClick={() => update("timeframe", key)}
                  />
                ))}
              </div>

              {!isRent ? (
                <div className="flex flex-col gap-3">
                  <p className="text-[0.875rem] font-medium text-primary-900">
                    Wie ist die Finanzierung geplant?
                  </p>
                  {financingOrder.map((key) => (
                    <OptionCard
                      key={key}
                      selected={data.financing === key}
                      title={searchFinancingLabels[key]}
                      onClick={() => update("financing", key)}
                    />
                  ))}
                </div>
              ) : null}

              <Checkbox
                label="Ich suche zur Eigennutzung (nicht als Kapitalanlage)."
                checked={data.ownUse}
                onChange={(e) => update("ownUse", e.target.checked)}
              />
            </div>
          </Fieldset>
        ) : null}

        {step === "kontakt" ? (
          <Fieldset
            title="Wie erreichen wir Sie?"
            description="Wir melden uns, sobald ein passendes Objekt in die Vermarktung geht."
          >
            <div className="flex flex-col gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Vorname"
                  required
                  value={data.firstName}
                  error={errors.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
                <Input
                  label="Nachname"
                  required
                  value={data.lastName}
                  error={errors.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="E-Mail"
                  type="email"
                  required
                  value={data.email}
                  error={errors.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                <Input
                  label="Telefon (optional)"
                  type="tel"
                  value={data.phone}
                  error={errors.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <Textarea
                label="Was ist Ihnen besonders wichtig? (optional)"
                rows={4}
                value={data.message}
                onChange={(e) => update("message", e.target.value)}
              />

              <Checkbox
                label="Benachrichtigen Sie mich per E-Mail über passende neue Objekte."
                checked={data.notifyByEmail}
                onChange={(e) => update("notifyByEmail", e.target.checked)}
              />
              <Checkbox
                label={
                  <>
                    Ich habe die{" "}
                    <Link href="/datenschutz" className="underline underline-offset-2" target="_blank">
                      Datenschutzerklärung
                    </Link>{" "}
                    gelesen und bin mit der Verarbeitung meiner Daten einverstanden.
                  </>
                }
                checked={data.privacyAccepted}
                error={errors.privacyAccepted}
                onChange={(e) => update("privacyAccepted", e.target.checked)}
              />
            </div>
          </Fieldset>
        ) : null}
      </div>

      {state.status === "error" && state.message ? <ErrorNote message={state.message} /> : null}

      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        {stepIndex > 0 ? (
          <Button type="button" variant="ghost" onClick={back} disabled={pending}>
            <IconArrowLeft size={16} />
            Zurück
          </Button>
        ) : (
          <span />
        )}

        {isLast ? (
          <Button type="button" onClick={submit} disabled={pending}>
            {pending ? "Wird gesendet …" : "Suchprofil hinterlegen"}
            <IconCheck size={16} />
          </Button>
        ) : (
          <Button type="button" onClick={next}>
            Weiter
            <IconArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}

function Fieldset({
  title,
  description,
  error,
  children,
}: {
  title: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="heading-4 text-primary-950">{title}</h2>
        {description ? <p className="mt-2 text-[0.9375rem] text-ink-muted">{description}</p> : null}
      </div>
      {children}
      {error ? (
        <p className={cn("text-[0.8125rem] text-[var(--color-danger)]")} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
