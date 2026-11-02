import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { toImageItem } from "../utils/imageItem";
import { useSwipe } from "../hooks/useSwipe";

/**
 * @param {{
 *   images?: ReadonlyArray<{ src: string; alt?: string; title?: string; caption?: string }>;
 *   index?: number;
 *   onClose?: () => void;
 *   onPrev?: () => void;
 *   onNext?: () => void;
 * }} props
 */
export default function Lightbox({
  images = [],
  index = 0,
  onClose,
  onPrev,
  onNext,
}) {
  const item = toImageItem(images[index] || {});
  const total = images.length || 1;

  // Swipe (left → next, right → prev)
  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    className: swipeClass,
  } = useSwipe({ onLeft: onNext, onRight: onPrev, threshold: 40 });

  const closeBtnRef = useRef(null);
  const dialogRef = useRef(null);

  // Modal behaviour: focus the close button, lock page scroll, and return
  // focus to whatever opened the lightbox when it closes
  useEffect(() => {
    const opener = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, []);

  // Keyboard: Escape closes, arrows navigate, Tab stays inside the dialog
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = [
          ...dialogRef.current.querySelectorAll("button:not([disabled]), [href]"),
        ].filter((el) => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!dialogRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, onNext, onPrev]);

  return (
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.title ? undefined : "Screenshot viewer"}
        aria-labelledby={item.title ? "lb-title" : undefined}
        aria-describedby={item.caption ? "lb-caption" : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-fuchsia-strong cursor-pointer transition-colors duration-200 ease-in-out rounded"
          aria-label="Close lightbox"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Image + navigation */}
        <div
          className="relative w-full max-w-[min(1100px,95vw)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile swipe hint - above image */}
          {total > 1 && (
            <div className="md:hidden text-white/70 text-sm text-center mb-2">
              Swipe left or right to navigate
            </div>
          )}

          {/* Image surface (swipe-enabled) */}
          <div className="relative flex items-center justify-center">
            {/* Chevron nav (desktop) - positioned outside swipe zone */}
            {total > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onPrev();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2
                             bg-bg/60 hover:bg-bg/80 border border-line text-white p-2 rounded-full z-20 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onNext();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2
                             bg-bg/60 hover:bg-bg/80 border border-line text-white p-2 rounded-full z-20 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}

            {/* Image with swipe handlers */}
            <motion.img
              key={item.src}
              src={item.src}
              alt={item.alt || item.title || "Expanded image"}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`${swipeClass} max-w-full max-h-[72svh] object-contain mx-auto rounded-lg`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              draggable={false}
            />
          </div>

          {/* Caption card */}
          {(item.title || item.caption || total > 1) && (
            <div
              className="mt-3 mx-auto w-full md:w-[min(900px,95vw)]
                         rounded-[var(--radius-tile-sm)] border border-line bg-surface-deep/90 backdrop-blur-md p-4"
            >
              {item.title && (
                <h3
                  id="lb-title"
                  className="display text-white text-base md:text-lg"
                >
                  {item.title}
                </h3>
              )}
              {item.caption && (
                <p
                  id="lb-caption"
                  className="text-white/80 text-sm md:text-base mt-1"
                >
                  {item.caption}
                </p>
              )}
              {total > 1 && (
                <div className="text-white/70 text-xs md:text-sm mt-2">
                  {index + 1} / {total}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
  );
}
