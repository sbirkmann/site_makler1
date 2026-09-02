import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/icons";

export function CTASection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  image,
  imageAlt,
  variant = "dark",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
  imageAlt?: string;
  variant?: "dark" | "light" | "split";
  className?: string;
  children?: ReactNode;
}) {
  if (variant === "split" && image) {
    return (
      <section className={cn("py-12 sm:py-16 lg:py-20", className)}>
        <Container size="wide">
          <div className="grid overflow-hidden rounded-[var(--radius-2xl)] bg-primary-950 lg:grid-cols-2">
            <div className="relative min-h-72 lg:min-h-0">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 lg:p-14">
              {eyebrow ? (
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-accent-300">
                  {eyebrow}
                </span>
              ) : null}
              <h2 className="display-3 text-balance text-white">{title}</h2>
              <p className="max-w-lg text-[1.0625rem] leading-relaxed text-white/65">
                {description}
              </p>
              {children}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={primaryHref} size="lg" variant="inverse">
                  {primaryLabel}
                  <IconArrowRight size={18} />
                </ButtonLink>
                {secondaryLabel && secondaryHref ? (
                  <ButtonLink
                    href={secondaryHref}
                    size="lg"
                    variant="outline"
                    className="border-white/25 text-white hover:border-white/50 hover:bg-white/5"
                  >
                    {secondaryLabel}
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const dark = variant === "dark";

  return (
    <section
      className={cn("py-12 sm:py-16 lg:py-20", dark ? "bg-primary-900" : "bg-surface-muted", className)}
    >
      <Container>
        <div className="flex flex-col gap-6">
          {eyebrow ? (
            <span
              className={cn(
                "text-[0.75rem] font-semibold uppercase tracking-[0.16em]",
                dark ? "text-accent-300" : "text-primary-500",
              )}
            >
              {eyebrow}
            </span>
          ) : null}
          <h2 className={cn("display-2 max-w-3xl text-balance", dark ? "text-white" : "text-primary-950")}>
            {title}
          </h2>
          <p
            className={cn(
              "max-w-2xl text-[1.0625rem] leading-relaxed text-pretty",
              dark ? "text-white/65" : "text-ink-muted",
            )}
          >
            {description}
          </p>
          {children}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primaryHref} size="lg" variant={dark ? "inverse" : "primary"}>
              {primaryLabel}
              <IconArrowRight size={18} />
            </ButtonLink>
            {secondaryLabel && secondaryHref ? (
              <ButtonLink
                href={secondaryHref}
                size="lg"
                variant="outline"
                className={dark ? "border-white/25 text-white hover:border-white/50 hover:bg-white/5" : ""}
              >
                {secondaryLabel}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
