import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import { findAgents } from "@/lib/repositories/agents";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/marketing/ContactForm";
import { IconClock, IconLocation, IconMail, IconPhone, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Sprechen Sie mit uns: Telefon, E-Mail oder Kontaktformular. WohnWert Immobilien in Köln – persönlich erreichbar von Montag bis Freitag.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt – WohnWert Immobilien",
    description: "Persönlich erreichbar in Köln, Bonn und dem Rheinland.",
    url: `${site.url}/kontakt`,
  },
};

export const revalidate = 600;

const subjectMap: Record<string, string> = {
  suchprofil: "Suchprofil hinterlegen",
  verkauf: "Ich möchte verkaufen",
  bewertung: "Immobilienbewertung",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ anliegen?: string }>;
}) {
  const { anliegen } = await searchParams;
  const agents = await findAgents();
  const defaultSubject = anliegen ? subjectMap[anliegen] : undefined;

  return (
    <>
      <Section className="pb-0">
        <Container size="wide">
          <Reveal>
            <span className="eyebrow">Kontakt</span>
            <h1 className="page-title mt-4 max-w-3xl text-balance text-primary-950">
              Sprechen wir über Ihre Immobilie
            </h1>
            <p className="lead mt-5 max-w-2xl">
              Rufen Sie an, schreiben Sie oder nutzen Sie das Formular. Wir antworten in der Regel
              innerhalb eines Werktages – und leiten Sie an die Person weiter, die Ihr Thema am
              besten kennt.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-8">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            {/* Kontaktinformationen */}
            <div className="flex flex-col gap-8">
              <Reveal>
                <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-7">
                  <h2 className="heading-4 text-primary-950">So erreichen Sie uns</h2>
                  <div className="mt-6 flex flex-col gap-5">
                    <a
                      href={site.contact.phoneHref}
                      className="group flex items-start gap-4 transition-colors"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-primary-700 transition-colors group-hover:bg-primary-800 group-hover:text-white">
                        <IconPhone size={20} />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                          Telefon
                        </span>
                        <span className="text-[1.0625rem] font-medium text-primary-950">
                          {site.contact.phone}
                        </span>
                      </span>
                    </a>

                    <a
                      href={`mailto:${site.contact.email}`}
                      className="group flex items-start gap-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-primary-700 transition-colors group-hover:bg-primary-800 group-hover:text-white">
                        <IconMail size={20} />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                          E-Mail
                        </span>
                        <span className="break-all text-[1.0625rem] font-medium text-primary-950">
                          {site.contact.email}
                        </span>
                      </span>
                    </a>

                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-primary-700">
                        <IconWhatsApp size={20} />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                          WhatsApp
                        </span>
                        <span className="text-[1.0625rem] font-medium text-primary-950">
                          {site.contact.whatsapp}
                        </span>
                      </span>
                    </div>

                    <address className="flex items-start gap-4 not-italic">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-primary-700">
                        <IconLocation size={20} />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                          Büro
                        </span>
                        <span className="text-[1.0625rem] font-medium leading-snug text-primary-950">
                          {site.address.street}
                          <br />
                          {site.address.zipCode} {site.address.city}
                        </span>
                      </span>
                    </address>
                  </div>
                </div>
              </Reveal>

              {/* Oeffnungszeiten */}
              <Reveal delay={90}>
                <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-7">
                  <h2 className="heading-4 flex items-center gap-2.5 text-primary-950">
                    <IconClock size={20} className="text-primary-600" />
                    Öffnungszeiten
                  </h2>
                  <dl className="mt-5 divide-y divide-line">
                    {site.openingHours.map((row) => (
                      <div key={row.days} className="flex justify-between gap-4 py-3">
                        <dt className="text-[0.9375rem] text-ink-muted">{row.days}</dt>
                        <dd className="text-[0.9375rem] font-medium text-primary-950">
                          {row.hours}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-subtle">
                    Besichtigungen und Beratungstermine bieten wir auf Wunsch auch abends und
                    samstags an.
                  </p>
                </div>
              </Reveal>

              {/* Kartenplatzhalter */}
              <Reveal delay={140}>
                <div className="flex aspect-[16/9] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface-muted">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <IconLocation size={26} className="text-primary-400" />
                    <p className="text-[0.875rem] font-medium text-ink-muted">
                      {site.address.street}, {site.address.zipCode} {site.address.city}
                    </p>
                    <p className="max-w-xs text-[0.8125rem] text-ink-subtle">
                      Kartenplatzhalter – hier lässt sich eine datenschutzkonforme Karte einbinden.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Formular */}
            <Reveal delay={60}>
              <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
                <h2 className="heading-4 text-primary-950">Schreiben Sie uns</h2>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  Je konkreter Ihr Anliegen, desto gezielter können wir antworten.
                </p>
                <div className="mt-7">
                  <ContactForm defaultSubject={defaultSubject} />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Ansprechpartner */}
      <Section tone="muted">
        <Container size="wide">
          <h2 className="display-2 text-primary-950">Ihre Ansprechpartner</h2>
          <p className="lead mt-4 max-w-2xl">
            Sie können sich auch direkt an die Person wenden, die Ihr Thema betreut.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {agents.map((agent, i) => (
              <Reveal key={agent.id} delay={(i % 4) * 80}>
                <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-6">
                  <div className="flex items-center gap-4">
                    {agent.imageUrl ? (
                      <Image
                        src={agent.imageUrl}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <p className="truncate text-[0.9375rem] font-medium text-primary-950">
                        {agent.firstName} {agent.lastName}
                      </p>
                      <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-subtle">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
                    {agent.phone ? (
                      <a
                        href={`tel:${agent.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2.5 text-[0.8125rem] text-ink-muted transition-colors hover:text-primary-800"
                      >
                        <IconPhone size={15} className="shrink-0 text-primary-500" />
                        {agent.phone}
                      </a>
                    ) : null}
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-2.5 break-all text-[0.8125rem] text-ink-muted transition-colors hover:text-primary-800"
                    >
                      <IconMail size={15} className="shrink-0 text-primary-500" />
                      {agent.email}
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
