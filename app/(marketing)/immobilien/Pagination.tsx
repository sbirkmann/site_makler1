import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildPropertyHref, type RawSearchParams } from "@/lib/search-params";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";

export function Pagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: RawSearchParams;
}) {
  if (pageCount <= 1) return null;

  // Kompakte Seitenliste: erste, letzte und die Umgebung der aktuellen Seite
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const visible = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  const linkClass =
    "flex h-10 min-w-10 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-[0.875rem] transition-colors";

  return (
    <nav aria-label="Seitennavigation" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={buildPropertyHref(searchParams, { seite: page - 1 })}
          rel="prev"
          aria-label="Vorherige Seite"
          className={cn(linkClass, "border-line-strong text-ink-muted hover:border-primary-400 hover:text-primary-800")}
        >
          <IconChevronLeft size={17} />
        </Link>
      ) : null}

      {visible.map((p, i) => {
        const prev = visible[i - 1];
        const gap = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {gap ? <span className="px-1 text-ink-subtle">…</span> : null}
            <Link
              href={buildPropertyHref(searchParams, { seite: p === 1 ? undefined : p })}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                linkClass,
                p === page
                  ? "border-primary-800 bg-primary-800 font-medium text-white"
                  : "border-line-strong text-ink-muted hover:border-primary-400 hover:text-primary-800",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}

      {page < pageCount ? (
        <Link
          href={buildPropertyHref(searchParams, { seite: page + 1 })}
          rel="next"
          aria-label="Nächste Seite"
          className={cn(linkClass, "border-line-strong text-ink-muted hover:border-primary-400 hover:text-primary-800")}
        >
          <IconChevronRight size={17} />
        </Link>
      ) : null}
    </nav>
  );
}
