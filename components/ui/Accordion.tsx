"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconMinus, IconPlus } from "@/components/icons";

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="group flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "text-[1.0625rem] font-medium leading-snug transition-colors",
                    isOpen ? "text-primary-900" : "text-ink group-hover:text-primary-800",
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isOpen
                      ? "border-primary-800 bg-primary-800 text-white"
                      : "border-line-strong text-ink-muted group-hover:border-primary-400",
                  )}
                >
                  {isOpen ? <IconMinus size={14} /> : <IconPlus size={14} />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${index}`}
              hidden={!isOpen}
              className="pb-6 pr-12 text-[0.9375rem] leading-relaxed text-ink-muted"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
