import { useCallback, useEffect, useRef, useState } from "react";

const newSeed = () => Math.floor(Math.random() * 2 ** 31);

// Placement + information state for the SOLID puzzle.
//
//   placedIds     ids in the order they were placed
//   activeInfoId  the one piece whose information is showing (or null)
//
// Placing a piece opens its info (replacing whatever was open). Selecting a
// placed piece toggles it: same piece closes, another piece switches. Pieces
// that aren't placed yet can't open anything. `seed` fixes the random start
// arrangement for one attempt; reset draws a new one.
export function useSolidPuzzle(total) {
  const [attempt, setAttempt] = useState(0);
  const [seed, setSeed] = useState(newSeed);
  const [placedIds, setPlacedIds] = useState([]);
  const [activeInfoId, setActiveInfoId] = useState(null);
  const placedRef = useRef(new Set());

  const place = useCallback((id) => {
    if (placedRef.current.has(id)) return;
    placedRef.current.add(id);
    setPlacedIds((prev) => [...prev, id]);
    setActiveInfoId(id);
  }, []);

  const toggleInfo = useCallback((id) => {
    if (!placedRef.current.has(id)) return;
    setActiveInfoId((current) => (current === id ? null : id));
  }, []);

  const reset = useCallback(() => {
    placedRef.current = new Set();
    setPlacedIds([]);
    setActiveInfoId(null);
    setSeed(newSeed());
    setAttempt((a) => a + 1);
  }, []);

  return {
    attempt,
    seed,
    placedIds,
    activeInfoId,
    placedCount: placedIds.length,
    solved: placedIds.length === total,
    place,
    toggleInfo,
    reset,
  };
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => false, // read after mount so prerendered HTML matches the first render
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
