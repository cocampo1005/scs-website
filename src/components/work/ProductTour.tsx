import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Lightbox from "../Lightbox";
import type { TourGroup } from "../../content/types";
import { DeviceFrame } from "./FeaturedProject";
import { cn } from "../ui/cn";

const SWIPE_PX = 40;

/**
 * A guided walkthrough of a product: one screen at a time with its title and
 * why it matters, grouped by capability. Previous/next buttons, thumbnails,
 * arrow keys while the tour has focus, a horizontal swipe on touch screens,
 * and a full-screen view that reuses the lightbox.
 */
export function ProductTour({ name, groups }: { name: string; groups: readonly TourGroup[] }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [enlarged, setEnlarged] = useState(false);
  const base = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const group = groups[groupIndex] ?? groups[0]!;
  const images = group.images;
  const count = images.length;
  const image = images[index] ?? images[0]!;
  const title = image.title ?? image.alt;

  const go = (next: number) => setIndex(((next % count) + count) % count);
  const pickGroup = (i: number) => {
    setGroupIndex(i);
    setIndex(0);
  };

  // Thumbnails scroll to keep the current one in view
  const thumbsRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = thumbsRef.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [index, groupIndex]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(count - 1);
    else return;
    e.preventDefault();
  };

  // Horizontal swipes change the screen; vertical touches still scroll the page
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? index + 1 : index - 1);
  };

  const navButton =
    "inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-bg/70 text-ink backdrop-blur transition-colors hover:border-focus/60 hover:bg-white/[0.08] disabled:cursor-default disabled:opacity-40";

  return (
    <div className="flex flex-col gap-5">
      {groups.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Parts of the product">
          {groups.map((g, i) => (
            <button
              key={g.title}
              type="button"
              aria-pressed={i === groupIndex}
              onClick={() => pickGroup(i)}
              className={cn(
                "min-h-11 cursor-pointer rounded-[10px] border px-4 font-sans text-sm font-medium transition-colors",
                i === groupIndex ? "border-focus/60 bg-focus/10 text-white" : "border-line bg-white/[0.03] text-ink-soft hover:border-line-strong hover:text-white",
              )}
            >
              {g.title}
            </button>
          ))}
        </div>
      )}

      <p className="m-0 max-w-[720px] text-[15px] leading-relaxed text-ink-muted">{group.intro}</p>

      <section
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name}: ${group.title}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="tile tile-feature flex flex-col gap-4 p-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:p-5 lg:grid lg:grid-cols-12 lg:items-center lg:gap-6 lg:p-6"
      >
        {/* The screen */}
        <div
          className={cn("relative lg:col-span-8", group.device === "mobile" && "px-4 pt-2 sm:pt-4")}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
        >
          <div aria-live="polite" aria-atomic="true">
            <figure key={`${groupIndex}-${index}`} className="m-0 motion-safe:animate-reveal">
              <DeviceFrame image={image} device={group.device} className={group.device === "mobile" ? "w-[56%] max-w-[250px]" : undefined} />
              <figcaption className="sr-only">
                Screen {index + 1} of {count}: {title}
              </figcaption>
            </figure>
          </div>
          {count > 1 && (
            <>
              <button type="button" aria-label="Previous screen" onClick={() => go(index - 1)} className={cn(navButton, "absolute top-1/2 left-2 -translate-y-1/2 sm:left-3")}>
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button type="button" aria-label="Next screen" onClick={() => go(index + 1)} className={cn(navButton, "absolute top-1/2 right-2 -translate-y-1/2 sm:right-3")}>
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </>
          )}
        </div>

        {/* Title, why it matters, controls */}
        <div className="flex flex-col gap-4 px-2 pb-2 lg:col-span-4 lg:px-0 lg:pb-0">
          <p className="label m-0 text-ink-subtle">
            {index + 1} / {count} · {group.title}
          </p>
          <h3 className="display m-0 text-xl sm:text-2xl">{title}</h3>
          {image.caption && <p className="m-0 text-[15px] leading-relaxed text-ink-muted">{image.caption}</p>}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEnlarged(true)}
              aria-label={`Full screen: ${title}`}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-line bg-white/[0.03] px-4 font-sans text-sm font-medium text-ink transition-colors hover:border-focus/60 hover:bg-white/[0.08]"
            >
              <Maximize2 className="size-4" aria-hidden /> Full screen
            </button>
            <span className="hidden text-[13px] text-ink-subtle md:inline">Arrow keys move between screens</span>
          </div>
        </div>
      </section>

      {/* Thumbnails */}
      {count > 1 && (
        <ul ref={thumbsRef} className="m-0 flex list-none gap-2.5 overflow-x-auto p-0 pb-1 [scrollbar-width:thin]" aria-label={`${group.title} screens`}>
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                id={`${base}-thumb-${i}`}
                aria-label={`Show screen ${i + 1}: ${img.title ?? img.alt}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className={cn(
                  "block cursor-pointer overflow-hidden rounded-[8px] border-2 bg-bg p-0.5 transition-[border-color,opacity]",
                  i === index ? "border-focus opacity-100" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img
                  src={img.src}
                  alt=""
                  loading="lazy"
                  className={cn("block rounded-[5px] object-cover object-top", group.device === "mobile" ? "h-[88px] w-[42px]" : "h-[54px] w-[88px]")}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {enlarged && (
          <Lightbox
            images={images}
            index={index}
            onClose={() => setEnlarged(false)}
            onPrev={() => go(index - 1)}
            onNext={() => go(index + 1)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
