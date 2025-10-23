import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { toImageItem } from "../utils/imageItem";
import { useSwipe } from "../hooks/useSwipe";

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

  // Focus the close button on open
  useEffect(() => {
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={item.title ? "lb-title" : undefined}
        aria-describedby={item.caption ? "lb-caption" : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-accent-fuchsia cursor-pointer focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition-colors duration-200 ease-in-out rounded"
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
                             bg-primary-dark-purple/40 hover:bg-primary-dark-purple/60 text-white p-2 rounded-full z-20 cursor-pointer"
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
                             bg-primary-dark-purple/40 hover:bg-primary-dark-purple/60 text-white p-2 rounded-full z-20 cursor-pointer"
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
                         rounded-xl border border-white/15 bg-white/8 backdrop-blur-md p-4"
            >
              {item.title && (
                <h3
                  id="lb-title"
                  className="text-white font-semibold text-base md:text-lg"
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
    </AnimatePresence>
  );
}
