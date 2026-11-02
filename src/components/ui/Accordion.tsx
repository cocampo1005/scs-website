import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "./cn";

export type AccordionItem = { q: string; a: string };

/**
 * Questions on a connected rail: each item has a node on the left, the rail
 * lights between the open item and the next, and one answer is open at a
 * time. Arrow keys move between questions; Home/End jump to the ends.
 */
export function Accordion({
  items,
  defaultOpen = 0,
  className,
}: {
  items: readonly AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const last = items.length - 1;
    const go = (n: number) => {
      e.preventDefault();
      buttons.current[n]?.focus();
    };
    if (e.key === "ArrowDown") go(i === last ? 0 : i + 1);
    else if (e.key === "ArrowUp") go(i === 0 ? last : i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(last);
  };

  return (
    <ul className={cn("faq relative m-0 flex list-none flex-col gap-3 p-0", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const qId = `${base}-q-${i}`;
        const aId = `${base}-a-${i}`;
        return (
          <li key={item.q} className="relative pl-7 sm:pl-9" data-open={isOpen}>
            {/* Node and the rail segment down to the next question */}
            <span aria-hidden="true" className="faq-node absolute top-[22px] left-0 size-3 rounded-[3px] sm:left-1" />
            {i < items.length - 1 && <span aria-hidden="true" className="faq-rail absolute top-[34px] -bottom-3 left-[5.5px] w-px sm:left-[9.5px]" />}
            <div className={cn("tile transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none", isOpen && "tile-feature")}>
              <h3 className="m-0">
                <button
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  type="button"
                  id={qId}
                  aria-expanded={isOpen}
                  aria-controls={aId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-[var(--radius-tile-sm)] border-0 bg-transparent px-5 py-3.5 text-left font-sans text-[15px] font-semibold text-ink sm:px-6 sm:text-base"
                >
                  {item.q}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex size-7 shrink-0 items-center justify-center rounded-full border text-[20px] leading-none transition-[transform,border-color,color] duration-300 motion-reduce:transition-none",
                      isOpen ? "rotate-45 border-focus/60 text-fuchsia" : "border-line text-ink-muted",
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
                  "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="m-0 px-5 pb-5 text-[15px] leading-relaxed text-ink-muted sm:px-6">{item.a}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
