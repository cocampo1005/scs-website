import { useCallback, useEffect, useRef, useState } from "react";
import { hasWebGL } from "../three/webgl";

export function useHeroPuzzle() {
  // null until checked after mount, so the prerendered HTML and the first
  // client render match
  const [webgl, setWebgl] = useState(null);
  useEffect(() => setWebgl(hasWebGL()), []);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [solved, setSolved] = useState(false);
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

  // The scene could not render (model failed to load, shader error, lost
  // context): show the static poster instead
  const handleFailure = useCallback(() => setFailed(true), []);

  // Called once by the scene when the logo cube settles into its slot
  const handleSolved = useCallback(() => {
    if (solvedRef.current) return;
    solvedRef.current = true;
    setSolved(true);
  }, []);

  // "Place it for me": the scene animates the same snap as a successful drag
  // and then reports solved
  const skipPuzzle = useCallback(() => setSkipped(true), []);

  const sceneAvailable = webgl === true && !failed;
  const showPoster = webgl === false || failed;

  return {
    containerRef,
    sceneAvailable,
    showPoster,
    ready: ready || showPoster,
    solved,
    skipped,
    active: inView && pageVisible,
    handleReady,
    handleSolved,
    handleFailure,
    skipPuzzle,
  };
}
