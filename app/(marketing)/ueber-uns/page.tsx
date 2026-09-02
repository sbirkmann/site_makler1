import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { findAgents } from "@/lib/repositories/agents";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/marketing/CTASection";
import { IconCompass, IconMail, IconPhone, IconShield, IconTrend, IconUsers } from "@/components/icons";

export const metadata: Metadata = {
  title: "Über uns – das Team hinter WohnWert Immobilien",
  description:
    "Wer wir sind, wie wir arbeiten und warum wir bewusst wenige Mandate annehmen. Das Team von WohnWert Immobilien in Köln, Bonn und dem Rheinland.",
  alternates: { canonical: "/ueber-uns" },
  openGraph: {
    title: "Über uns – WohnWert Immobilien",
    description: "Markenstory, Team, Werte und Arbeitsweise von WohnWert Immobilien.",
    url: `${site.url}/ueber-uns`,
  },
};

// Wird zur Laufzeit gerendert und danach zwischengespeichert:
// der Build-Container hat keine Datenbankverbindung.
export const revalidate = 600;
export const dynamic = "force-dynamic";

const values = [
  {
    icon: IconShield,
    title: "Ehrlichkeit vor Auftrag",
    text: "Wir nennen den Preis, der erzielbar ist – nicht den, der ein Mandat sichert. Das kostet uns gelegentlich Aufträge und erspart unseren Kunden Monate auf dem Markt.",
  },
  {
    icon: IconTrend,
    title: "Belege statt Behauptungen",
    text: "Jede Einschätzung stützt sich auf tatsächlich erzielte Kaufpreise. Wenn wir etwas nicht wissen, sagen wir das – statt es zu schätzen und sicher klingen zu lassen.",
  },
  {
    icon: IconUsers,
    title: "Wenige Mandate, volle Betreuung",
    text: "Wir nehmen bewusst nicht jedes Objekt an. Wer bei uns unterschreibt, wird von Anfang bis Ende von derselben Person betreut – ohne Übergaben.",
  },
  {
    icon: IconCompass,
    title: "Lokale Marktkenntnis",
    text: "Wir arbeiten dort, wo wir uns auskennen: Köln, Bonn, Düsseldorf und das Umland. Für Objekte außerhalb sagen wir offen, wenn jemand anders besser passt.",
  },
];

export default async function AboutPage() {
  const agents = await findAgents();

  return (
    <>
      {/* Markenstory */}
      <Section className="pb-0">
        <Container size="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal>
              <span className="eyebrow">Über uns</span>
              <h1 className="page-title mt-4 text-balance text-primary-950">
                Immobilien sind selten nur eine Frage des Preises.
              </h1>
              <div className="prose-editorial mt-6">
                <p>
                  {site.name} wurde {site.founded} in Köln gegründet – von jemandem, der zehn Jahre
                  in der Projektentwicklung gearbeitet hatte und dabei gesehen hat, wie oft
                  Eigentümer schlecht beraten werden. Nicht aus bösem Willen, sondern weil ein
                  optimistischer Preis leichter zu einem Auftrag führt als ein realistischer.
                </p>
                <p>
                  Wir haben uns entschieden, es anders zu machen: weniger Mandate, dafür
                  vollständige Betreuung. Eine Einschätzung, die wir begründen können. Und die
                  Bereitschaft, auch dann etwas zu sagen, wenn es gegen den Abschluss spricht.
                </p>
                <p>
                  Seither haben wir über {site.stats.propertiesSold} Immobilien vermittelt – vom
                  Reihenhaus in Endenich bis zum Anlageobjekt in Nippes.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-surface-sunken">
                  <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                    alt="Heller Wohnraum mit Blick in den Garten"
                    fill
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-surface-sunken">
                  <Image
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80"
                    alt="Besprechungssituation in hellen Büroräumen"
                    fill
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Werte */}
      <Section>
        <Container size="wide">
          <Reveal>
            <SectionHeading
              eyebrow="Werte & Arbeitsweise"
              title="Woran wir uns messen lassen"
              description="Vier Grundsätze, die wir im Alltag tatsächlich anwenden – auch dann, wenn sie unbequem sind."
            />
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line md:grid-cols-2">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} delay={(i % 2) * 90}>
                  <div className="flex h-full flex-col gap-4 bg-surface p-7 sm:p-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-primary-700">
                      <Icon size={22} />
                    </span>
                    <h3 className="text-[1.125rem] font-medium text-primary-950">{value.title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">{value.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Team */}
      <Section id="team" tone="muted">
        <Container size="wide">
          <Reveal>
            <SectionHeading
              eyebrow="Das Team"
              title="Die Menschen, mit denen Sie sprechen"
              description="Bei uns betreut Sie eine Person – von der ersten Einschätzung bis zur Schlüsselübergabe."
            />
          </Reveal>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {agents.map((agent, i) => (
              <Reveal key={agent.id} delay={(i % 4) * 80}>
                <article className="flex h-full flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-surface-sunken">
                    {agent.imageUrl ? (
                      <Image
                        src={agent.imageUrl}
                        alt={`${agent.firstName} ${agent.lastName}`}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="mt-5 flex flex-1 flex-col">
                    <h3 className="text-[1.0625rem] font-medium text-primary-950">
                      {agent.firstName} {agent.lastName}
                    </h3>
                    <p className="mt-1 text-[0.8125rem] leading-snug text-primary-600">
                      {agent.role}
                    </p>
                    {agent.bio ? (
                      <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
                        {agent.bio}
                      </p>
                    ) : null}

                    {agent.focus.length > 0 ? (
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {agent.focus.map((f) => (
                          <li
                            key={f}
                            className="rounded-full bg-surface px-2.5 py-1 text-[0.6875rem] font-medium text-ink-muted"
                          >
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : null}

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
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Marktkenntnis */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Lokale Marktkenntnis"
              title="Wo wir zu Hause sind"
              description="Wir arbeiten dort, wo wir die Straßen kennen – nicht nur die Postleitzahlen."
            />
          </Reveal>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {site.regions.map((region, i) => (
              <Reveal key={region} delay={i * 60}>
                <li className="rounded-full border border-line bg-surface px-5 py-2.5 text-[0.9375rem] text-primary-900">
                  {region}
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <CTASection
        eyebrow="Kennenlernen"
        title="Lassen Sie uns über Ihre Immobilie sprechen."
        description="Ein Gespräch verpflichtet zu nichts – klärt aber oft mehr als drei Wochen Recherche."
        primaryLabel="Termin vereinbaren"
        primaryHref="/kontakt"
        secondaryLabel={site.contact.phone}
        secondaryHref={site.contact.phoneHref}
      />
    </>
  );
}
