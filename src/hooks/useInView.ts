import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Whether an element is on screen (and the tab visible). Decorative loops use
 * it to pause while they can't be seen.
 */
export function useInView<T extends HTMLElement>(options: IntersectionObserverInit = { threshold: 0.1 }): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), options);
    io.observe(el);
    return () => io.disconnect();
    // `options` is a literal at each call site; re-observing on every render would thrash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return [ref, inView && visible];
}
