import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Wortmarke mit eigenem Bildzeichen: zwei ineinandergreifende Dachformen,
 * die den Anfangsbuchstaben andeuten. Bewusst geometrisch und flexibel.
 */
export function Logo({
  className,
  tone = "dark",
  href = "/",
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string | null;
}) {
  const content = (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      <svg
        width="44"
        height="44"
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 sm:h-11 sm:w-11"
      >
        <rect
          width="34"
          height="34"
          rx="9"
          className={tone === "light" ? "fill-white/12" : "fill-primary-900"}
        />
        <path
          d="M8 20.4 13.4 14l3.6 4.3 3.6-4.3L26 20.4"
          stroke={tone === "light" ? "#ffffff" : "#e5ac6b"}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6 20.4v4.2h10.8v-4.2"
          stroke={tone === "light" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.72)"}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "truncate font-[family-name:var(--font-display)] text-[1.125rem] font-bold tracking-[-0.015em] sm:text-[1.5rem]",
            tone === "light" ? "text-white" : "text-primary-950",
          )}
        >
          {site.name}
        </span>
        <span
          className={cn(
            "mt-[3px] hidden truncate text-[0.8125rem] font-normal tracking-[0.01em] sm:block",
            tone === "light" ? "text-white/55" : "text-ink-subtle",
          )}
        >
          {site.claim}
        </span>
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${site.name} – Startseite`}
      className={cn("min-w-0 max-w-full rounded-[var(--radius-sm)]", className)}
    >
      {content}
    </Link>
  );
}
