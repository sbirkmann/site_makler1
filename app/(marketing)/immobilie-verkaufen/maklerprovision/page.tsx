import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findSellTopic } from "@/lib/content/sell-topics";
import { SubpageHeader } from "@/components/marketing/SubpageHeader";
import { SellSubnav } from "@/components/marketing/SellSubnav";
import { SellTopicsGrid } from "@/components/marketing/SellTopicsGrid";
import { CTASection } from "@/components/marketing/CTASection";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { IconCheck, IconInfo } from "@/components/icons";

const topic = findSellTopic("maklerprovision")!;

const excerpt =
  "Seit 2020 gilt das Bestellerprinzip auch beim Kauf. Was das konkret bedeutet, wie hoch die Provision im Rheinland ist und wann sie überhaupt fällig wird.";

export const metadata: Metadata = {
  title: "Maklerprovision beim Immobilienverkauf: Höhe, Teilung, Fälligkeit",
  description:
    "Maklerprovision verständlich erklärt: gesetzliche Teilung seit 2020, übliche Sätze im Rheinland, Fälligkeit und was zur Leistung gehört.",
  alternates: { canonical: topic.href },
  openGraph: {
    title: `${topic.title} – ${site.name}`,
    description: excerpt,
    url: `${site.url}${topic.href}`,
  },
};

const models = [
  {
    number: "01",
    title: "Doppeltätigkeit mit Teilung",
    text: "Der Makler wird für beide Seiten tätig und erhält von beiden denselben Betrag.",
  },
  {
    number: "02",
    title: "Abwälzungsverbot",
    text: "Beauftragt nur eine Partei, darf sie höchstens die Hälfte ihrer Provision auf die andere übertragen – und die Zahlung der anderen Seite ist erst fällig, wenn die beauftragende Partei nachweislich gezahlt hat.",
  },
];

const conditions = [
  "ein wirksamer Maklervertrag",
  "eine Nachweis- oder Vermittlungsleistung des Maklers",
  "ein wirksam zustande gekommener Kaufvertrag",
];

const services = [
  "Wertermittlung mit nachvollziehbarer Herleitung",
  "Beschaffung und Prüfung sämtlicher Unterlagen",
  "Professionelle Fotos und Grundrisse",
  "Erstellung des Exposés",
  "Vermarktung und Anfragenqualifizierung",
  "Durchführung der Besichtigungen",
  "Bonitätsprüfung der Kaufinteressenten",
  "Verhandlungsführung",
  "Vorbereitung und Begleitung des Notartermins",
  "Übergabe mit Protokoll",
];

/** Rechenbeispiel: 500.000 € × 5,95 % = 29.750 €, je Seite die Hälfte. */
const example = {
  price: "500.000 €",
  rate: "5,95 %",
  total: "29.750 €",
  halfRate: "2,975 %",
  half: "14.875 €",
};

export default function MaklerprovisionPage() {
  return (
    <>
      <SubpageHeader
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Immobilie verkaufen", href: "/immobilie-verkaufen" },
          { label: topic.label },
        ]}
        eyebrow="Immobilie verkaufen"
        title={topic.title}
        lead={excerpt}
      />

      <Section>
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
            <div className="flex flex-col gap-16">
              {/* Einleitung */}
              <p className="lead max-w-2xl">
                Seit dem 23. Dezember 2020 gilt bei der Vermittlung von Einfamilienhäusern und
                Eigentumswohnungen an Verbraucher: Beauftragt der Verkäufer einen Makler, muss
                dieser mindestens die Hälfte der Provision selbst tragen.
              </p>

              {/* Die zwei Modelle */}
              <section aria-labelledby="modelle">
                <span className="eyebrow">Die Regelung im Detail</span>
                <h2 id="modelle" className="display-3 mt-4 max-w-2xl text-ink">
                  Das Gesetz kennt zwei zulässige Modelle
                </h2>
                <div className="mt-8 grid gap-px bg-line md:grid-cols-2">
                  {models.map((m) => (
                    <article key={m.number} className="flex flex-col gap-4 bg-surface p-7 sm:p-8">
                      <span className="font-[family-name:var(--font-display)] text-[1.5rem] text-accent-500">
                        {m.number}
                      </span>
                      <h3 className="heading-4 text-ink">{m.title}</h3>
                      <p className="text-[0.9375rem] font-light leading-relaxed text-ink-muted">{m.text}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-px border border-line bg-surface-muted px-7 py-5 sm:px-8">
                  <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Was nicht mehr geht</p>
                  <p className="mt-2 text-[0.9375rem] font-light text-ink-muted">
                    <s className="decoration-accent-500 decoration-1">
                      Der Verkäufer beauftragt, der Käufer zahlt alles.
                    </s>
                  </p>
                </div>
              </section>

              {/* Rechenbeispiel */}
              <section aria-labelledby="hoehe">
                <span className="eyebrow">Übliche Höhe im Rheinland</span>
                <h2 id="hoehe" className="display-3 mt-4 max-w-2xl text-ink">
                  5,95 Prozent gesamt – geteilt 2,975 Prozent je Seite
                </h2>
                <p className="mt-4 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Im Raum Köln/Bonn liegt die Gesamtprovision aktuell bei 5,95 Prozent inklusive
                  Mehrwertsteuer. Bei höherpreisigen Objekten wird häufig eine niedrigere Rate
                  vereinbart.
                </p>
                <div className="mt-8 bg-primary-900 p-7 text-ink-inverse sm:p-10">
                  <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-accent-300">Rechenbeispiel</p>
                  <div className="mt-6 grid gap-8 sm:grid-cols-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-white/55">Kaufpreis</span>
                      <span className="font-[family-name:var(--font-display)] text-[2rem] leading-none text-white sm:text-[2.375rem]">
                        {example.price}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-white/15 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-white/55">
                        Gesamtprovision {example.rate}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[2rem] leading-none text-accent-300 sm:text-[2.375rem]">
                        {example.total}
                      </span>
                      <span className="text-[0.8125rem] font-light text-white/55">inkl. Mehrwertsteuer</span>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-white/15 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-white/55">
                        Je Seite {example.halfRate}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[2rem] leading-none text-white sm:text-[2.375rem]">
                        {example.half}
                      </span>
                      <span className="text-[0.8125rem] font-light text-white/55">Verkäufer und Käufer je</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Fälligkeit */}
              <section aria-labelledby="faelligkeit">
                <span className="eyebrow">Fälligkeit</span>
                <h2 id="faelligkeit" className="display-3 mt-4 max-w-2xl text-ink">
                  Wann wird die Provision fällig?
                </h2>
                <p className="mt-4 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Drei Voraussetzungen müssen zusammenkommen:
                </p>
                <ul className="mt-6 divide-y divide-line border-y border-line-strong">
                  {conditions.map((c, i) => (
                    <li key={c} className="flex items-center gap-5 py-4">
                      <span className="w-7 shrink-0 font-[family-name:var(--font-display)] text-[0.9375rem] tabular-nums text-accent-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-line-strong text-accent-500">
                        <IconCheck size={14} />
                      </span>
                      <span className="text-[0.9375rem] text-ink">{c}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Scheitert der Verkauf, entsteht kein Anspruch. Das ist der wesentliche Punkt: Die
                  Vergütung ist{" "}
                  <strong className="font-normal text-accent-600">vollständig erfolgsabhängig</strong>.
                </p>
              </section>

              {/* Leistungen */}
              <section aria-labelledby="leistung">
                <span className="eyebrow">Was zur Leistung gehört</span>
                <h2 id="leistung" className="display-3 mt-4 max-w-2xl text-ink">
                  Ein seriöser Maklervertrag beschreibt die Leistung konkret
                </h2>
                <p className="mt-4 max-w-2xl text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  Dazu sollten mindestens gehören:
                </p>
                <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                  {services.map((s, i) => (
                    <li key={s} className="flex items-start gap-4 border-b border-line pb-4">
                      <span className="mt-0.5 w-6 shrink-0 font-[family-name:var(--font-display)] text-[0.875rem] tabular-nums text-accent-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.9375rem] font-light text-ink">{s}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Ausnahmen */}
              <aside className="flex gap-5 border border-line bg-surface-muted p-7 sm:p-8">
                <span className="mt-0.5 shrink-0 text-accent-500">
                  <IconInfo size={22} />
                </span>
                <div>
                  <p className="heading-4 text-ink">Für Ausnahmen gilt anderes</p>
                  <p className="mt-2 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                    Bei Mehrfamilienhäusern, Grundstücken und Gewerbeobjekten sowie bei Verkäufen
                    zwischen Unternehmern greift die gesetzliche Teilung nicht. Hier ist die
                    Provisionsverteilung frei verhandelbar.
                  </p>
                  <ButtonLink href="/kontakt" variant="ghost" className="mt-5">
                    Ihren Fall besprechen
                  </ButtonLink>
                </div>
              </aside>
            </div>

            <SellSubnav current="maklerprovision" />
          </div>
        </Container>
      </Section>

      <SellTopicsGrid exclude="maklerprovision" />

      <CTASection
        eyebrow="Kostenlose Ersteinschätzung"
        title="Was ist Ihre Immobilie heute wert?"
        description="Bevor über Provisionen gesprochen wird, sollte der Wert stehen. Wir schätzen Ihre Immobilie kostenlos und nachvollziehbar ein – auf Basis tatsächlich erzielter Kaufpreise."
        primaryLabel="Bewertung starten"
        primaryHref="/immobilienbewertung"
        secondaryLabel="Beratung vereinbaren"
        secondaryHref="/kontakt"
      />
    </>
  );
}
