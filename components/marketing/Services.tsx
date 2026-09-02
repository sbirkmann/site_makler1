import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  IconArrowUpRight,
  IconCamera,
  IconCompass,
  IconDashboard,
  IconKey,
  IconTrend,
  IconValuation,
} from "@/components/icons";

const services = [
  {
    icon: IconValuation,
    title: "Datenbasierte Wertermittlung",
    text: "Wir arbeiten mit der Kaufpreissammlung des Gutachterausschusses statt mit Angebotspreisen aus Portalen. Sie erhalten eine Spanne mit Vergleichsobjekten – nachvollziehbar hergeleitet.",
    href: "/immobilienbewertung",
    linkLabel: "Bewertung anfordern",
  },
  {
    icon: IconCamera,
    title: "Professionelle Aufbereitung",
    text: "Architekturfotografie, maßstabsgetreue Grundrisse und auf Wunsch Home Staging. Der erste Eindruck entsteht heute auf einem Bildschirm – dort entscheidet sich, wer überhaupt anfragt.",
    href: "/immobilie-verkaufen",
    linkLabel: "Zum Verkaufsprozess",
  },
  {
    icon: IconCompass,
    title: "Diskrete Vermarktung",
    text: "Ein Teil unserer Objekte wird ohne Portal und ohne Schild vermittelt – ausschließlich an vorgemerkte Interessenten. Sinnvoll, wenn Nachbarn oder Mieter nicht informiert werden sollen.",
    href: "/kontakt",
    linkLabel: "Beratung anfragen",
  },
  {
    icon: IconDashboard,
    title: "Transparenter Zwischenstand",
    text: "Sie erfahren wöchentlich, wie viele Anfragen eingegangen sind, wie viele Besichtigungen stattfanden und was Interessenten zurückgemeldet haben. Auch dann, wenn es keine gute Nachricht ist.",
    href: "/ueber-uns",
    linkLabel: "Unsere Arbeitsweise",
  },
  {
    icon: IconKey,
    title: "Vermietung mit Auswahl",
    text: "Bonitätsprüfung, Einzelbesichtigungen statt Massenandrang und ein Mietvertrag, der beiden Seiten standhält. Wir übergeben protokolliert und mit Zählerständen.",
    href: "/immobilien?marketing=miete",
    linkLabel: "Mietobjekte ansehen",
  },
  {
    icon: IconTrend,
    title: "Anlage & Investment",
    text: "Für Anlageobjekte rechnen wir Rendite, Instandhaltungsrückstau und realistische Mietentwicklung durch – auch dann, wenn das Ergebnis gegen den Kauf spricht.",
    href: "/immobilien?typ=MEHRFAMILIENHAUS",
    linkLabel: "Anlageobjekte",
  },
];

export function Services() {
  return (
    <Section tone="muted">
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow="Leistungen"
            title="Zählen Sie auf eine Begleitung, die vollständig ist"
            description="Vom ersten Gespräch bis zur Schlüsselübergabe übernehmen wir jeden Schritt – und geben ehrlich zurück, was wir sehen."
          />
        </Reveal>

        <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={(i % 3) * 90}>
                <Link
                  href={service.href}
                  className="group flex h-full flex-col gap-4 bg-surface p-7 transition-colors duration-300 hover:bg-primary-50/50 sm:p-8"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-primary-700 transition-colors duration-300 group-hover:bg-primary-800 group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="text-[1.125rem] font-medium leading-snug text-primary-950">
                    {service.title}
                  </h3>
                  <p className="flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {service.text}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-primary-800">
                    {service.linkLabel}
                    <IconArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
