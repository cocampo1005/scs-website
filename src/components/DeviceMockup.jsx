import { ChevronLeft, ChevronRight } from "lucide-react";
import { toImageItem } from "../utils/imageItem";
import { useSwipe } from "../hooks/useSwipe";

export default function DeviceMockup({
  type,
  images = [],
  currentIndex = 0,
  onPrev,
  onNext,
  onImageClick,
}) {
  const item = toImageItem(images[currentIndex] || {});
  const swipe = useSwipe({ onLeft: onNext, onRight: onPrev });

  // ----------------------------
  // MOBILE MOCKUP
  // ----------------------------
  if (type === "mobile") {
    return (
      <div className="relative mx-auto w-full max-w-[340px] aspect-[340/740] select-none">
        {/* Frame */}
        <div className="absolute inset-0 rounded-[2rem] shadow-2xl border-[6px] border-primary-dark-purple">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-2 bg-primary-dark-purple rounded-b-3xl z-10" />

          {/* Screen (swipe + hover controls) */}
          <div className="absolute inset-0 rounded-[1.6rem] overflow-hidden group/device">
            <img
              {...swipe}
              src={item.src}
              alt={item.alt || item.title || "Project image"}
              className="w-full h-full object-cover cursor-pointer"
              onClick={(e) => {
                // Only trigger if not dragging
                if (!swipe.isDragging) {
                  onImageClick?.(item);
                }
              }}
              draggable={false}
            />

            {/* Chevron buttons (desktop hover only) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onPrev();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="hidden md:flex cursor-pointer absolute left-2 top-1/2 -translate-y-1/2
                         bg-primary-dark-purple/60 hover:bg-primary-dark-purple/80 text-white p-2 rounded-full
                         opacity-0 transition-opacity group-hover/device:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onNext();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="hidden md:flex cursor-pointer absolute right-2 top-1/2 -translate-y-1/2
                         bg-primary-dark-purple/60 hover:bg-primary-dark-purple/80 text-white p-2 rounded-full
                         opacity-0 transition-opacity group-hover/device:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onNext?.(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? "bg-fuchsia-400 w-6" : "bg-white/30"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------
  // DESKTOP MOCKUP
  // ----------------------------
  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      <div className="bg-primary-dark-purple rounded-2xl shadow-2xl border-8 border-primary-dark-purple">
        {/* Screen (swipe + hover controls) */}
        <div className="aspect-video relative overflow-hidden rounded-xl group/monitor">
          <img
            {...swipe}
            src={item.src}
            alt={item.alt || item.title || "Project image"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={(e) => {
              // Only trigger if not dragging
              if (!swipe.isDragging) {
                onImageClick?.(item);
              }
            }}
            draggable={false}
          />

          {/* Chevron buttons (desktop hover only) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onPrev();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="hidden md:flex cursor-pointer absolute left-4 top-1/2 -translate-y-1/2
                       bg-primary-dark-purple/60 hover:bg-primary-dark-purple/80 text-white p-2 rounded-full
                       opacity-0 transition-opacity group-hover/monitor:opacity-100 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onNext();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="hidden md:flex cursor-pointer absolute right-4 top-1/2 -translate-y-1/2
                       bg-primary-dark-purple/60 hover:bg-primary-dark-purple/80 text-white p-2 rounded-full
                       opacity-0 transition-opacity group-hover/monitor:opacity-100 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stand */}
      <div className="flex flex-col items-center">
        <div className="w-32 h-20 bg-gray-700 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-gray-500" />
        </div>
        <div className="w-48 h-3 bg-gray-700 rounded-full" />
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => onNext?.(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? "bg-fuchsia-400 w-6" : "bg-white/30"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
