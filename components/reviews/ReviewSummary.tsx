import { cn } from "@/lib/utils";
import { RatingStars } from "@/components/reviews/RatingStars";

export function ReviewSummary({
  average,
  total,
  distribution,
  className,
}: {
  average: number;
  total: number;
  distribution: Record<number, number>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 rounded-[var(--radius-lg)] border border-line bg-surface p-7 sm:flex-row sm:items-center sm:gap-12 sm:p-9",
        className,
      )}
    >
      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-center">
        <p className="font-[family-name:var(--font-display)] text-[3.5rem] leading-none tracking-[-0.03em] text-primary-900">
          {average.toFixed(1).replace(".", ",")}
        </p>
        <RatingStars rating={average} size={20} />
        <p className="text-[0.875rem] text-ink-muted">
          aus {total} Bewertungen
        </p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = distribution[stars] ?? 0;
          const percent = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={stars} className="flex min-w-0 items-center gap-3">
              <span className="w-14 shrink-0 text-[0.8125rem] tabular-nums text-ink-muted">
                {stars} Sterne
              </span>
              <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                <span
                  className="block h-full rounded-full bg-accent-400 transition-[width] duration-700 [transition-timing-function:var(--ease-out-quint)]"
                  style={{ width: `${percent}%` }}
                />
              </span>
              <span className="w-6 shrink-0 text-right text-[0.8125rem] tabular-nums text-ink-subtle">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
