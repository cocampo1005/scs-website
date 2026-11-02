import { useId, useState } from "react";
import { Bento, Tile } from "./Bento";
import { cn } from "./cn";

export type AccordionItem = { q: string; a: string };

/** Question tiles in two columns; one open at a time. */
export function Accordion({ items, defaultOpen = 0 }: { items: readonly AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();

  return (
    <Bento className="items-start">
      {items.map((item, i) => {
        const isOpen = open === i;
        const qId = `${base}-q-${i}`;
        const aId = `${base}-a-${i}`;
        return (
          <Tile key={item.q} variant={isOpen ? "feature" : "default"} span={{ md: 3, lg: 6 }} className="px-5 py-5 sm:px-6">
            <h3 className="m-0">
              <button
                type="button"
                id={qId}
                aria-expanded={isOpen}
                aria-controls={aId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-md border-0 bg-transparent p-0 text-left font-sans text-[15px] font-semibold text-ink"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-[22px] leading-none transition-transform duration-250 motion-reduce:transition-none",
                    isOpen ? "rotate-45 text-fuchsia" : "text-ink-muted",
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={aId}
              role="region"
              aria-labelledby={qId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-250 ease-[var(--ease-out)] motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="m-0 pt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
              </div>
            </div>
          </Tile>
        );
      })}
    </Bento>
  );
}
