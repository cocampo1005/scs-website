import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { hasWebGL } from "../three/webgl";

// Homepage hero state (docs/design-review.md, decisions 2-4).
//
// - A deliberate solve (drag or "Place it for me") plays the circuit sequence
//   and lights the story strip 1.9 s later (at once with reduced motion).
// - Solving stores SESSION_KEY in sessionStorage. It is read after mount, so
//   the first render always matches prerendered HTML (the unsolved layout); a
//   restored session then jumps straight to the assembled cube, no circuit.
// - "Replay the puzzle" clears the flag and puts the pieces back.

export const SESSION_KEY = "scs:hero-solved";
export const CIRCUIT_MS = 2200;
export const STORY_DELAY_MS = 1900;
export const STORY_DELAY_REDUCED_MS = 300;

export type CircuitState = "off" | "playing" | "static";

export type HeroState = {
  solved: boolean;
  /** Solved before this page view; the scene starts assembled */
  restored: boolean;
  /** "Place it for me" was pressed */
  placing: boolean;
  circuit: CircuitState;
  storyLit: boolean;
  /** Bumped by replay: remounts the scene with the pieces at the start */
  replayKey: number;
};

export type HeroAction =
  | { type: "restore" }
  | { type: "place" }
  | { type: "solved"; reducedMotion: boolean }
  | { type: "circuitDone" }
  | { type: "lightStory" }
  | { type: "replay" };

export const initialHeroState: HeroState = {
  solved: false,
  restored: false,
  placing: false,
  circuit: "off",
  storyLit: false,
  replayKey: 0,
};

export function heroReducer(state: HeroState, action: HeroAction): HeroState {
  switch (action.type) {
    case "restore":
      return state.solved ? state : { ...state, solved: true, restored: true, storyLit: true };
    case "place":
      return state.solved ? state : { ...state, placing: true };
    case "solved":
      // The restored scene reports solved on its first frame: no sequence
      if (state.restored || state.solved) return state;
      return { ...state, solved: true, circuit: action.reducedMotion ? "static" : "playing" };
    case "circuitDone":
      return state.circuit === "playing" ? { ...state, circuit: "off" } : state;
    case "lightStory":
      return state.solved ? { ...state, storyLit: true } : state;
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
    if (readSession()) dispatch({ type: "restore" });
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

  // Sequence timers for a deliberate solve
  const { circuit, solved, restored, storyLit } = state;
  useEffect(() => {
    if (!solved || restored || storyLit) return;
    const t = window.setTimeout(
      () => dispatch({ type: "lightStory" }),
      reducedMotion ? STORY_DELAY_REDUCED_MS : STORY_DELAY_MS,
    );
    return () => window.clearTimeout(t);
  }, [solved, restored, storyLit, reducedMotion]);

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
