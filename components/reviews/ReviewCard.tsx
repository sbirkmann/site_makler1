import type { Review } from "@prisma/client";
import { cn, formatDate } from "@/lib/utils";
import { propertyTypeLabels } from "@/lib/labels";
import { RatingStars } from "@/components/reviews/RatingStars";
import { IconQuote } from "@/components/icons";

export function ReviewCard({ review, className }: { review: Review; className?: string }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-card)] sm:p-7",
        className,
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-4">
        <RatingStars rating={review.rating} size={17} />
        <IconQuote size={26} className="text-secondary-200" />
      </div>

      {review.title ? (
        <h3 className="mt-5 text-[1.0625rem] font-medium leading-snug text-primary-950">
          {review.title}
        </h3>
      ) : null}

      <blockquote className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
        {review.body}
      </blockquote>

      <figcaption className="mt-6 flex flex-wrap items-center gap-x-3.5 gap-y-2 border-t border-line pt-5">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-800 text-[0.875rem] font-medium tracking-wide text-white"
        >
          {review.initials}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[0.9375rem] font-medium text-primary-950">
            {review.authorName}
          </span>
          <span className="truncate text-[0.8125rem] text-ink-subtle">
            {[
              review.serviceType,
              review.propertyType ? propertyTypeLabels[review.propertyType] : null,
              review.city,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
        <time
          dateTime={review.reviewedAt.toISOString()}
          className="shrink-0 text-[0.75rem] text-ink-subtle"
        >
          {formatDate(review.reviewedAt)}
        </time>
      </figcaption>
    </figure>
  );
}
