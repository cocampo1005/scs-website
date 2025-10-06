// Reveal.jsx
import React, { useMemo } from "react";
import { useInViewOnce } from "../hooks/useInViewOnce";

// Global defaults tweaked for a slower, smoother feel
const DEFAULTS = {
  y: 24, // larger float distance
  duration: 1000, // ~1s
  delay: 0,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)", // gentle easeOut
  threshold: 0.12,
  once: true,
  inertWhileHidden: true,
};

export default function Reveal({
  as: Tag = "div",
  y = DEFAULTS.y,
  duration = DEFAULTS.duration,
  delay = DEFAULTS.delay,
  easing = DEFAULTS.easing,
  threshold = DEFAULTS.threshold,
  once = DEFAULTS.once,
  inertWhileHidden = DEFAULTS.inertWhileHidden,
  className = "",
  children,
  ...rest
}) {
  // Respect reduced motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { ref, inView } = useInViewOnce({ threshold, once });
  const shown = prefersReduced ? true : inView;

  // When hidden, set inert for better a11y focus handling
  const inertProps = !shown && inertWhileHidden ? { inert: true } : {};

  const style = useMemo(() => {
    if (prefersReduced) {
      return {
        opacity: 1,
        transform: "none",
        transition: "none",
      };
    }
    const d = `${duration}ms ${easing} ${delay}ms`;
    return {
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity ${d}, transform ${d}`,
      willChange: "opacity, transform",
    };
  }, [shown, prefersReduced, duration, delay, easing, y]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      {...inertProps}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Simple stagger helper that applies incremental delays to children
export function Stagger({
  children,
  startAt = 120, // default works nicely with 1000ms duration
  gap = 160, // a bit wider so items don’t stack visually
  y = DEFAULTS.y,
  duration = DEFAULTS.duration,
  easing = DEFAULTS.easing,
  as: Wrapper = React.Fragment,
  ...rest
}) {
  const items = React.Children.toArray(children);
  return (
    <Wrapper {...rest}>
      {items.map((child, i) => (
        <Reveal
          key={child.key ?? i}
          delay={startAt + i * gap}
          y={y}
          duration={duration}
          easing={easing}
        >
          {child}
        </Reveal>
      ))}
    </Wrapper>
  );
}
