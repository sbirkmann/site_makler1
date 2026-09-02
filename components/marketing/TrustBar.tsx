import { site } from "@/lib/site";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { IconAward, IconCompass, IconHandshake, IconUsers } from "@/components/icons";

const items = [
  {
    icon: IconAward,
    value: `${site.stats.yearsExperience} Jahre`,
    label: "am rheinischen Markt",
    detail: "Gegründet 2009 in Köln",
  },
  {
    icon: IconHandshake,
    value: `${site.stats.propertiesSold}+`,
    label: "vermittelte Immobilien",
    detail: "Wohnen, Gewerbe, Anlage",
  },
  {
    icon: IconUsers,
    value: `${site.stats.happyClients}+`,
    label: "begleitete Kundinnen und Kunden",
    detail: "Käufer wie Verkäufer",
  },
  {
    icon: IconCompass,
    value: "6 Regionen",
    label: "mit belastbarer Marktkenntnis",
    detail: "Köln, Bonn, Düsseldorf und Umland",
  },
];

export function TrustBar() {
  return (
    <Section className="py-12 sm:py-14">
      <Container size="wide">
        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={i * 80}>
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line bg-surface text-primary-600">
                    <Icon size={21} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <dt className="sr-only">{item.label}</dt>
                    <dd className="font-[family-name:var(--font-display)] text-[1.5rem] leading-none tracking-[-0.015em] text-primary-900">
                      {item.value}
                    </dd>
                    <p className="text-[0.9375rem] font-medium leading-snug text-primary-950">
                      {item.label}
                    </p>
                    <p className="text-[0.8125rem] text-ink-subtle">{item.detail}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </Container>
    </Section>
  );
}
