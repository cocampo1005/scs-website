import { useState, useRef, useEffect } from "react";

export function useSplineHero() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [showUI, setShowUI] = useState(false);

  const appRef = useRef(null);
  const rafRef = useRef(null);
  const solvedRef = useRef(false);
  const containerRef = useRef(null);

  // Pause/resume Spline when the hero leaves/enters the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        const app = appRef.current;
        if (!app) return;
        entry.isIntersecting ? app.play() : app.stop();
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause when the tab is hidden
  useEffect(() => {
    const onVis = () => {
      const app = appRef.current;
      if (!app) return;
      if (document.visibilityState === "visible" && visible) app.play();
      else app.stop();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [visible]);

  // Safety: stop the render loop on page hide (mobile Safari, etc.)
  useEffect(() => {
    const onPageHide = () => appRef.current?.stop();
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function startWatchingSolved() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const tick = () => {
      const app = appRef.current;
      let solved = false;
      try {
        solved = app?.getVariable ? app.getVariable("puzzleSolved") : false;
      } catch {
        solved = false;
      }

      if (solved && !solvedRef.current) {
        solvedRef.current = true;
        setShowUI(true);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  function handleLoad(app) {
    appRef.current = app;
    setReady(true);
    startWatchingSolved();
    if (!visible) app.stop();
  }

  function skipPuzzle() {
    solvedRef.current = true;
    setShowUI(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  return {
    containerRef,
    ready,
    showUI,
    handleLoad,
    skipPuzzle,
  };
}
