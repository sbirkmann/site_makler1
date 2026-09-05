import Link from "next/link";
import { sellTopics } from "@/lib/content/sell-topics";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { IconArrowRight } from "@/components/icons";

/** Themenuebersicht der Verkaufs-Unterseiten – auf der Landingpage und als Weiterleser. */
export function SellTopicsGrid({
  exclude,
  eyebrow = "Wissen für Verkäufer",
  title = "Alles, was Sie vor dem Verkauf wissen sollten",
  tone = "muted",
}: {
  exclude?: string;
  eyebrow?: string;
  title?: string;
  tone?: "default" | "muted";
}) {
  const topics = sellTopics.filter((t) => t.slug !== exclude);
  return (
    <Section tone={tone}>
      <Container size="wide">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <Reveal key={topic.slug} as="li" delay={(i % 3) * 80} className="bg-surface">
              <Link href={topic.href} className="group flex h-full flex-col gap-4 p-7 transition-colors hover:bg-surface-muted sm:p-8">
                <span className="font-[family-name:var(--font-display)] text-[1.5rem] text-accent-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="heading-4 text-ink">{topic.title}</span>
                <span className="flex-1 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  {topic.teaser}
                </span>
                <span className="link-caps mt-2 self-start">
                  Mehr erfahren
                </span>
                <span className="sr-only">
                  <IconArrowRight size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
