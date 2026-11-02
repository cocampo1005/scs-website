import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lightbox from "../Lightbox";
import type { Device, Screenshot } from "../../content/types";
import { cn } from "../ui/cn";

/** Thumbnails that open the keyboard-accessible lightbox */
export function ScreenshotGallery({ images, device, title }: { images: readonly Screenshot[]; device: Device; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const count = images.length;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="label m-0 font-medium text-ink-subtle">
        {title} <span className="text-ink-subtle/70">· {count}</span>
      </h3>
      <ul
        className={cn(
          "m-0 grid list-none gap-2.5 p-0 sm:gap-4",
          device === "mobile" ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-3",
        )}
      >
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Enlarge screenshot: ${img.title ?? img.alt}`}
              className="group tile tile-interactive block w-full cursor-zoom-in p-1.5 text-left sm:p-2"
            >
              <img
                src={img.src}
                alt=""
                loading="lazy"
                className={cn(
                  "block w-full rounded-[10px] object-cover object-top transition-opacity group-hover:opacity-90",
                  device === "mobile" ? "aspect-[9/19]" : "aspect-[16/10]",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {open !== null && (
          <Lightbox
            images={images}
            index={open}
            onClose={() => setOpen(null)}
            onPrev={() => setOpen((i) => ((i ?? 0) - 1 + count) % count)}
            onNext={() => setOpen((i) => ((i ?? 0) + 1) % count)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
