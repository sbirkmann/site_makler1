import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Auszeichnungs-Leiste. Die Siegel sind eigene, rein typografische
 * Umsetzungen – bewusst ohne fremde Logos oder Markenzeichen.
 * Fuer ein echtes Projekt werden hier die tatsaechlichen Auszeichnungen
 * des Maklers hinterlegt.
 */
const awards = [
  { source: "Regionalreport", label: "Top Makler Rheinland", year: "2026" },
  { source: "Immobilien-Kompass", label: "Bestbewertet Köln", year: "2025" },
  { source: "Wirtschaft & Wohnen", label: "Beratungsqualität", year: "2025" },
  { source: "IHK Köln", label: "Zertifizierter Fachbetrieb", year: "seit 2011" },
];

function Seal({ source, label, year }: (typeof awards)[number]) {
  return (
    <div className="flex items-center gap-4">
      <span
        aria-hidden="true"
        className="relative flex h-14 w-14 shrink-0 items-center justify-center"
      >
        <svg viewBox="0 0 56 56" fill="none" className="absolute inset-0 h-full w-full">
          {/* Lorbeer-artige Klammer, eigenständig konstruiert */}
          <path
            d="M18 10c-6 4-9 10-9 18s3 14 9 18"
            stroke="var(--color-accent-400)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M38 10c6 4 9 10 9 18s-3 14-9 18"
            stroke="var(--color-accent-400)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="28" cy="28" r="9.5" stroke="var(--color-primary-300)" strokeWidth="1.2" />
          <path
            d="m24.4 28.2 2.6 2.6 5-5.6"
            stroke="var(--color-primary-700)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-ink-subtle">
          {source}
        </span>
        <span className="text-[0.9375rem] font-medium leading-snug text-primary-950">{label}</span>
        <span className="text-[0.75rem] text-ink-subtle">{year}</span>
      </span>
    </div>
  );
}

export function Credentials() {
  return (
    <section className="border-b border-line bg-surface py-12 sm:py-14 lg:py-16">
      <Container size="wide">
        <p className="text-center text-[0.8125rem] uppercase tracking-[0.14em] text-ink-subtle">
          Ausgezeichnete Beratungsqualität im Rheinland
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award, i) => (
            <Reveal key={award.label} delay={i * 80}>
              <Seal {...award} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
