import { useRef, useState } from "react";

export function useSwipe({ onLeft, onRight, threshold = 40 } = {}) {
  const startX = useRef(null);
  const active = useRef(false);
  const fired = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e) => {
    active.current = true;
    fired.current = false;
    startX.current = e.clientX;
    setIsDragging(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!active.current || fired.current || startX.current == null) return;
    const dx = e.clientX - startX.current;

    // Mark as dragging if moved more than 5px
    if (Math.abs(dx) > 5) {
      setIsDragging(true);
      e.preventDefault();
      e.stopPropagation();
    }

    if (dx <= -threshold) {
      fired.current = true;
      onLeft?.();
    } else if (dx >= threshold) {
      fired.current = true;
      onRight?.();
    }
  };

  const onPointerUp = (e) => {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    active.current = false;
    startX.current = null;
    fired.current = false;
    // Reset dragging state after a short delay to allow click handler to check
    setTimeout(() => setIsDragging(false), 0);
  };

  // Spread these on any swipeable element
  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    className: "touch-none select-none",
    isDragging,
  };
}
