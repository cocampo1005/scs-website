import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { hasWebGL } from "../three/webgl";

// Homepage hero state (docs/design-review.md, decisions 2-4).
//
// - A deliberate solve (drag or "Place it for me") plays the circuit sequence
//   (about 2.2 s); afterwards the circuit settles into a faint ambient pulse
//   that keeps the solved hero alive. Reduced motion shows the still circuit.
// - Solving stores SESSION_KEY in sessionStorage. It is read after mount, so
//   the first render always matches prerendered HTML (the unsolved layout); a
//   restored session then jumps straight to the assembled cube and the ambient
//   state, with no sequence.
// - "Replay the puzzle" clears the flag and puts the pieces back.

export const SESSION_KEY = "scs:hero-solved";
export const CIRCUIT_MS = 2200;

/** off: unsolved · playing: the solve sequence · ambient: the solved idle pulse · static: solved, reduced motion */
export type CircuitState = "off" | "playing" | "ambient" | "static";

export type HeroState = {
  solved: boolean;
  /** Solved before this page view; the scene starts assembled */
  restored: boolean;
  /** "Place it for me" was pressed */
  placing: boolean;
  circuit: CircuitState;
  /** Bumped by replay: remounts the scene with the pieces at the start */
  replayKey: number;
};

export type HeroAction =
  | { type: "restore"; reducedMotion: boolean }
  | { type: "place" }
  | { type: "solved"; reducedMotion: boolean }
  | { type: "circuitDone" }
  | { type: "replay" };

export const initialHeroState: HeroState = {
  solved: false,
  restored: false,
  placing: false,
  circuit: "off",
  replayKey: 0,
};

const settled = (reducedMotion: boolean): CircuitState => (reducedMotion ? "static" : "ambient");

export function heroReducer(state: HeroState, action: HeroAction): HeroState {
  switch (action.type) {
    case "restore":
      return state.solved ? state : { ...state, solved: true, restored: true, circuit: settled(action.reducedMotion) };
    case "place":
      return state.solved ? state : { ...state, placing: true };
    case "solved":
      // The restored scene reports solved on its first frame: no sequence
      if (state.restored || state.solved) return state;
      return { ...state, solved: true, circuit: action.reducedMotion ? "static" : "playing" };
    case "circuitDone":
      return state.circuit === "playing" ? { ...state, circuit: "ambient" } : state;
    case "replay":
      return { ...initialHeroState, replayKey: state.replayKey + 1 };
  }
}

function readSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSession(solved: boolean) {
  try {
    if (solved) window.sessionStorage.setItem(SESSION_KEY, "1");
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage blocked (private mode, previews): the solve just isn't remembered
  }
}

export function useHomeHero(reducedMotion: boolean) {
  const [state, dispatch] = useReducer(heroReducer, initialHeroState);
  const [webgl] = useState(hasWebGL);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const containerRef = useRef<HTMLElement>(null);

  // After mount, so server/prerendered HTML and the first render agree
  useEffect(() => {
    if (readSession()) dispatch({ type: "restore", reducedMotion });
    // Only the first read matters; a later motion change is handled by the CSS
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause rendering when the hero leaves the viewport or the tab is hidden
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    const hide = () => setPageVisible(false);
    update();
    document.addEventListener("visibilitychange", update);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", update);
    };
  }, []);

  // The solve sequence hands over to the ambient pulse once it has played
  const { circuit } = state;
  useEffect(() => {
    if (circuit !== "playing") return;
    const t = window.setTimeout(() => dispatch({ type: "circuitDone" }), CIRCUIT_MS + 200);
    return () => window.clearTimeout(t);
  }, [circuit]);

  const handleSolved = useCallback(() => {
    dispatch({ type: "solved", reducedMotion });
    writeSession(true);
  }, [reducedMotion]);

  const place = useCallback(() => dispatch({ type: "place" }), []);
  const replay = useCallback(() => {
    writeSession(false);
    dispatch({ type: "replay" });
  }, []);
  const handleReady = useCallback(() => setReady(true), []);
  // Model failed to load, shader error or lost context: show the poster
  const handleFailure = useCallback(() => setFailed(true), []);

  const sceneAvailable = webgl && !failed;

  return {
    state,
    containerRef,
    sceneAvailable,
    ready: ready || !sceneAvailable,
    active: inView && pageVisible,
    handleSolved,
    handleReady,
    handleFailure,
    place,
    replay,
  };
}
