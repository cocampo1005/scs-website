import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import DeviceMockup from "./DeviceMockup";

// Slideshow state for one device. Advances on its own (WCAG 2.2.2: with a
// visible pause control), pauses while hovered or focused, stops once the
// visitor navigates by hand, and never auto-advances with reduced motion.
function useSlideshow(count, intervalMs) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const autoplay = playing && !reducedMotion && count > 1;

  useEffect(() => {
    if (!autoplay || held) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [autoplay, held, count, intervalMs]);

  const goTo = (i) => {
    setIndex(((i % count) + count) % count);
    setPlaying(false);
  };

  return {
    index,
    autoplay,
    canAutoplay: !reducedMotion && count > 1,
    togglePlaying: () => setPlaying((p) => !p),
    goTo,
    holdProps: {
      onMouseEnter: () => setHeld(true),
      onMouseLeave: () => setHeld(false),
      onFocus: () => setHeld(true),
      onBlur: () => setHeld(false),
    },
  };
}

function Slideshow({ type, images, intervalMs, label, onImageClick }) {
  const show = useSlideshow(images.length, intervalMs);
  return (
    <div className="relative" {...show.holdProps}>
      <DeviceMockup
        type={type}
        images={images}
        currentIndex={show.index}
        label={label}
        onPrev={() => show.goTo(show.index - 1)}
        onNext={(i) => show.goTo(typeof i === "number" ? i : show.index + 1)}
        onImageClick={() => onImageClick({ images, index: show.index })}
      />
      {show.canAutoplay && (
        <button
          type="button"
          onClick={show.togglePlaying}
          className="absolute right-0 -bottom-1 inline-flex size-9 items-center justify-center rounded-full bg-white/5 text-gray-300 ring-1 ring-purple-500/30 hover:text-white focus-visible:outline-2 focus-visible:outline-accent-fuchsia"
          aria-label={show.autoplay ? `Pause ${label} slideshow` : `Play ${label} slideshow`}
        >
          {show.autoplay ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}

export default function Gallery({
  images,
  deviceType,
  onImageClick, // expects ({ images, index })
  dualDevice,
}) {
  if (dualDevice?.desktop && dualDevice?.mobile) {
    const order = dualDevice.order ?? ["desktop", "mobile"];
    return (
      <div className="grid grid-cols-1 gap-6">
        {order.map((key) => (
          <Slideshow
            key={key}
            type={dualDevice[key].type}
            images={dualDevice[key].images}
            intervalMs={key === "desktop" ? 3200 : 3000}
            label={`${key} screenshots`}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    );
  }

  if (!images?.length) return null;
  return (
    <Slideshow
      type={deviceType}
      images={images}
      intervalMs={3000}
      label="screenshots"
      onImageClick={onImageClick}
    />
  );
}
