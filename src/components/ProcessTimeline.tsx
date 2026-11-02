import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ProcessStep } from "../content/types";
import { cn } from "./ui/cn";

const DESKTOP = "(min-width: 768px)";

/**
 * Which step is current for the page's scroll position.
 *
 * Desktop (one row): the row lights up as it scrolls into view, one step at a
 * time, over about half a viewport of scrolling. Phones (a vertical timeline):
 * a step lights once it has passed the lower third of the viewport. Nothing is
 * pinned; scrolling back up reverses it. Under reduced motion every step is lit.
 */
function useActiveStep(ref: React.RefObject<HTMLOListElement | null>, count: number, reducedMotion: boolean) {
  const [active, setActive] = useState(reducedMotion ? count - 1 : -1);

  useEffect(() => {
    if (reducedMotion) {
      setActive(count - 1);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      let next: number;
      if (window.matchMedia(DESKTOP).matches) {
        const top = el.getBoundingClientRect().top;
        const progress = (vh * 0.85 - top) / (vh * 0.45);
        next = progress <= 0 ? -1 : Math.min(count - 1, Math.floor(progress * count));
      } else {
        const line = vh * 0.72;
        next = -1;
        Array.from(el.children).forEach((child, i) => {
          if (child.getBoundingClientRect().top < line) next = i;
        });
      }
      setActive((prev) => (prev === next ? prev : next));
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [ref, count, reducedMotion]);

  return active;
}

export function ProcessTimeline({ steps }: { steps: readonly ProcessStep[] }) {
  const reducedMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLOListElement>(null);
  const active = useActiveStep(ref, steps.length, reducedMotion);
  const fill = active <= 0 ? 0 : (active / (steps.length - 1)) * 100;

  return (
    <div className="relative">
      {/* Desktop track: a hairline across the row that fills up to the current step */}
      <div aria-hidden="true" className="absolute top-[22px] right-0 left-0 hidden h-px bg-[rgb(196_181_253/0.16)] md:block">
        <div
          className="h-full bg-[linear-gradient(90deg,var(--color-violet-strong),var(--color-focus))] shadow-[0_0_12px_rgb(232_121_249/0.6)] transition-[width] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none"
          style={{ width: `${fill}%` }}
        />
      </div>

      <ol ref={ref} data-active={active} className="relative m-0 flex list-none flex-col gap-8 p-0 md:grid md:grid-cols-5 md:gap-4 lg:gap-6">
        {steps.map((s, i) => {
          const lit = active >= i;
          const current = active === i;
          return (
            <li key={s.step} data-lit={lit} className="relative flex gap-4 md:flex-col md:items-center md:gap-6">
              {/* Phone rail: the segment down to the next step */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-12 -bottom-8 left-[21px] w-px transition-colors duration-500 motion-reduce:transition-none md:hidden",
                    active > i ? "bg-[linear-gradient(180deg,var(--color-focus),var(--color-violet-strong))]" : "bg-[rgb(196_181_253/0.16)]",
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "label relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border text-[13px] transition-[background-color,border-color,color,box-shadow,transform] duration-500 motion-reduce:transition-none",
                  lit
                    ? "border-transparent bg-[linear-gradient(135deg,var(--color-fuchsia-strong),var(--color-violet-strong))] text-white shadow-[0_0_24px_rgb(192_38_211/0.5)]"
                    : "border-line bg-bg text-ink-subtle",
                  current && "md:-translate-y-1",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className={cn(
                  "tile w-full p-4 transition-[opacity,border-color,box-shadow,transform] duration-500 motion-reduce:transition-none sm:p-5 md:min-h-[190px] md:text-center",
                  current && "tile-feature md:-translate-y-1",
                  !lit && "opacity-50",
                )}
              >
                <p className="display m-0 text-lg sm:text-xl">{s.step}</p>
                <p className="m-0 mt-2 text-sm leading-relaxed text-ink-muted">{s.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
