import { useEffect, useState } from "react";
import { useInViewOnce } from "../hooks/useInViewOnce";

/**
 * This small helper waits until the element enters the viewport,
 * then starts the Counter animation once revealed.
 */
export function CountOnReveal(props) {
  const { ref, inView } = useInViewOnce({ threshold: 0.25 });
  return (
    <span ref={ref}>
      <Counter {...props} start={inView} />
    </span>
  );
}

/**
 * Animated number counter with shuffle and ease-out.
 * Supports delayed start and custom duration.
 */
export function Counter({
  value = 0,
  duration = 1800, // slightly longer for smoother animation
  className = "",
  start = true,
  delay = 0,
}) {
  const [display, setDisplay] = useState("0");
  const target = String(value);

  useEffect(() => {
    if (!start) return; // wait until visible/revealed

    let rafId;
    let lastShuffle = 0; // <-- used to slow down random number refresh rate
    const t0 = performance.now() + delay;

    const tick = (t) => {
      if (t < t0) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const elapsed = t - t0;
      const p = Math.min(1, elapsed / duration);

      // Shuffle for first 70% of animation
      const shufflePhase = Math.max(0, 0.7 - p) / 0.7;

      if (shufflePhase > 0) {
        // Only update scrambled digits every ~60ms for slower flicker
        if (t - lastShuffle > 45) {
          lastShuffle = t;
          const scrambled = target
            .split("")
            .map((ch) =>
              /\d/.test(ch) ? String(Math.floor(Math.random() * 10)) : ch
            )
            .join("");
          setDisplay(scrambled);
        }
      } else {
        // Ease out to target number
        const eased = 1 - Math.pow(1 - p, 3);
        const digits = target.split("");
        const current = digits
          .map((ch) => {
            if (!/\d/.test(ch)) return ch;
            const final = Number(ch);
            const now = Math.round(final * eased);
            return String(now);
          })
          .join("");
        setDisplay(current);
      }

      if (p < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start, delay]);

  return <span className={className}>{display}</span>;
}
