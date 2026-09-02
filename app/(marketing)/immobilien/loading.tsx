import { Container, Section } from "@/components/ui/Container";
import { PropertyGridSkeleton } from "@/components/property/PropertyGrid";

export default function Loading() {
  return (
    <Section>
      <Container size="wide">
        <div className="h-4 w-32 animate-pulse rounded bg-surface-sunken" />
        <div className="mt-5 h-10 w-80 max-w-full animate-pulse rounded bg-surface-sunken" />
        <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-surface-sunken" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[19rem_1fr] lg:gap-12">
          <div className="hidden h-[32rem] animate-pulse rounded-[var(--radius-lg)] bg-surface-sunken lg:block" />
          <PropertyGridSkeleton />
        </div>
      </Container>
    </Section>
  );
}
