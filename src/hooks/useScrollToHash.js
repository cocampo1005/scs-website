import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToHash(offsetPx = 0, headerSelector = "nav") {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // wait for page content to render
    const t = setTimeout(() => {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      // auto-measure header if present
      const header = headerSelector
        ? document.querySelector(headerSelector)
        : null;
      const headerOffset = header?.offsetHeight ?? offsetPx ?? 0;

      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 60);

    return () => clearTimeout(t);
  }, [hash, offsetPx, headerSelector]);
}
