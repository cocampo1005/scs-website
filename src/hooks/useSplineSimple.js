// hooks/useSplineSimple.js
import { useCallback, useState } from "react";

export function useSplineSimple() {
  const [ready, setReady] = useState(false);

  const handleLoad = useCallback(() => {
    setReady(true);
  }, []);

  const handleWheelCapture = useCallback((e) => {
    // If user is pinch-zooming on trackpad, avoid page zoom
    if (e.ctrlKey) {
      e.preventDefault();
    }
    // Stop the wheel event from reaching the Spline canvas listeners
    // This prevents camera zoom, while default page scroll still occurs
    e.stopPropagation();
  }, []);

  return { ready, handleLoad, handleWheelCapture };
}
