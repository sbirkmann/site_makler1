import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center", action && "md:max-w-2xl")}>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <Tag className={cn(Tag === "h1" ? "display-1" : "display-2", "text-balance text-primary-950")}>
          {title}
        </Tag>
        {description ? (
          <p className={cn("lead text-pretty", align === "center" ? "max-w-2xl" : "max-w-xl")}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
