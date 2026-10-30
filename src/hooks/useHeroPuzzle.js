import { useCallback, useEffect, useRef, useState } from "react";

export function useHeroPuzzle() {
  const [ready, setReady] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(
    typeof document === "undefined" || document.visibilityState === "visible"
  );

  const containerRef = useRef(null);
  const solvedRef = useRef(false);

  // Pause rendering when the hero leaves the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause when the tab is hidden or the page is being unloaded (mobile Safari)
  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    const onPageHide = () => setPageVisible(false);
    const onPageShow = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  // Called once by the scene when the logo cube settles into its slot
  const handleSolved = useCallback(() => {
    if (solvedRef.current) return;
    solvedRef.current = true;
    setShowUI(true);
  }, []);

  const skipPuzzle = useCallback(() => {
    setSkipped(true);
    handleSolved();
  }, [handleSolved]);

  return {
    containerRef,
    ready,
    showUI,
    skipped,
    active: inView && pageVisible,
    handleReady,
    handleSolved,
    skipPuzzle,
  };
}
