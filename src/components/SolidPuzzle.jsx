import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import CubeLoader from "./CubeLoader";
import SceneBoundary from "./SceneBoundary";
import { hasWebGL } from "../three/webgl";
import SolidInfoPanel, { SolidInfoSheet } from "./SolidInfoPanel";
import { LAYOUTS, SOLID_PIECES, SOLID_PIECE_BY_ID } from "../constants/solidPuzzleData";
import { useMediaQuery, useSolidPuzzle } from "../hooks/useSolidPuzzle";

const SolidPuzzleCanvas = lazy(() => import("./solid3d/SolidPuzzleCanvas"));

const FALLBACK_NOTE = (
  <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-ink-muted">
    The interactive board isn’t available on this device. Read the principles below instead.
  </p>
);

export default function SolidPuzzle() {
  const reducedMotion = !!useReducedMotion();
  // Board layout: wide (tablet/desktop) or a tall stage with a tray (phones).
  // Info: a column beside the board on desktop, a bottom sheet below that.
  const isWide = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const layout = isWide ? "wide" : "tall";

  const total = SOLID_PIECES.length;
  const puzzle = useSolidPuzzle(total);
  const { attempt, seed, placedIds, activeInfoId, placedCount, solved } = puzzle;
  const activePiece = activeInfoId ? SOLID_PIECE_BY_ID[activeInfoId] : null;

  const [webglSupported] = useState(hasWebGL);
  // A lost context (GPU reset, driver issue) also falls back to the text version
  const [contextLost, setContextLost] = useState(false);
  const handleContextLost = useCallback(() => setContextLost(true), []);
  const webgl = webglSupported && !contextLost;
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  // Only load the 3D board once it is near the viewport, and pause it when it
  // leaves or the tab is hidden.
  const stageRef = useRef(null);
  const [nearView, setNearView] = useState(false);
  const [inView, setInView] = useState(false);
  const [boardOnScreen, setBoardOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setNearView(true);
      },
      { rootMargin: "200px" },
    );
    // Stricter check for the mobile sheet: only show it while the board itself
    // is meaningfully on screen
    const onScreen = new IntersectionObserver(
      ([entry]) => setBoardOnScreen(entry.intersectionRatio >= 0.15),
      { threshold: [0, 0.15, 0.3] },
    );
    io.observe(el);
    onScreen.observe(el);
    return () => {
      io.disconnect();
      onScreen.disconnect();
    };
  }, []);
  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    const hide = () => setPageVisible(false);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", update);
    };
  }, []);

  // Phones: the stage height follows the tray, which shrinks as pieces are
  // placed. The scene reports the height in scene units; scale it by the
  // board's width (the camera is width-fitted there).
  const [stageUnitsH, setStageUnitsH] = useState(LAYOUTS.tall.initialH);
  const handleStageChange = useCallback((h) => {
    if (h) setStageUnitsH(h);
  }, []);
  const [stageWidth, setStageWidth] = useState(0);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const tallHeight = stageWidth ? (stageWidth * stageUnitsH) / LAYOUTS.tall.box.w : undefined;

  // Keyboard / assistive placement goes through the same snap as a drop
  const commandsRef = useRef(null);
  // Before the board has loaded, or without WebGL, the placement is recorded
  // directly; a board that loads later starts with those pieces in the wall.
  const placeWithKeyboard = (id) => {
    if (commandsRef.current) commandsRef.current.place(id);
    else puzzle.place(id);
  };

  const onChipClick = (piece) => {
    if (placedIds.includes(piece.id)) puzzle.toggleInfo(piece.id);
    else placeWithKeyboard(piece.id);
  };

  // Mobile sheet: minimized as soon as the visitor touches the board (they're
  // back to playing, and it must not cover pieces in the tray), or when they
  // minimize it themselves. It is tied to the piece it was
  // minimized for, so newly placed or selected pieces always open expanded.
  const [minimizedFor, setMinimizedFor] = useState(null);
  const handleDragChange = useCallback(
    (dragging) => {
      if (dragging && activeInfoId) setMinimizedFor(activeInfoId);
    },
    [activeInfoId],
  );

  // Keep the last piece while the sheet slides away so it doesn't empty first
  const lastPiece = useRef(null);
  if (activePiece) lastPiece.current = activePiece;

  return (
    <div>
      {/* Instructions + progress */}
      <div className="mb-5 text-center">
        <p className="mx-auto max-w-2xl text-ink-muted">
          Drag each floating piece into its matching outline to discover the principles behind Solid
          Code Solutions.
        </p>
        <p className="mx-auto mt-1 max-w-2xl text-sm text-ink-subtle">
          <span className="hidden md:inline">Tap or click a placed piece to show or hide its description.</span>
          <span className="md:hidden">Tap a placed piece to show or hide its description.</span>{" "}
          Prefer a keyboard? Use the piece buttons to place pieces.
        </p>
      </div>

      <div
        className={
          isDesktop ? "grid grid-cols-[minmax(0,1fr)_22rem] items-start gap-6" : undefined
        }
      >
      {/* Board */}
      <div
        ref={stageRef}
        onPointerDownCapture={() => {
          if (!isDesktop && activeInfoId) setMinimizedFor(activeInfoId);
        }}
        className={`relative mx-auto w-full overflow-hidden rounded-[var(--radius-tile)] border border-focus/35 shadow-[0_30px_80px_-40px_rgb(192_38_211/0.5)] select-none ${
          isWide
            ? "aspect-[1120/900]"
            : `transition-[height] duration-500 ease-out motion-reduce:transition-none ${tallHeight ? "" : "aspect-[700/1160]"}`
        }`}
        style={{
          height: isWide ? undefined : tallHeight,
          backgroundColor: "#0e0a16",
          backgroundImage:
            "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(139,92,246,0.3), transparent 72%)",
        }}
        aria-hidden="true"
      >
        {webgl ? (
          <SceneBoundary fallback={FALLBACK_NOTE}>
            {nearView && (
              <Suspense fallback={null}>
                <SolidPuzzleCanvas
                  active={inView && pageVisible}
                  reducedMotion={reducedMotion}
                  layout={layout}
                  attempt={attempt}
                  seed={seed}
                  activeId={activeInfoId}
                  onPlace={puzzle.place}
                  onSelect={puzzle.toggleInfo}
                  onReady={handleReady}
                  onDragChange={handleDragChange}
                  onStageChange={handleStageChange}
                  placedIds={placedIds}
                  commandsRef={commandsRef}
                  onContextLost={handleContextLost}
                />
              </Suspense>
            )}
            <CubeLoader ready={ready} />
          </SceneBoundary>
        ) : (
          FALLBACK_NOTE
        )}
      </div>

      {/* Progress, reset, keyboard-operable piece buttons and (desktop) the
          info panel, beside the board so the info is always in view */}
      <div className={`flex flex-col items-center gap-4 ${isDesktop ? "" : "mt-5"}`}>
        <div className="flex w-full max-w-md items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Pieces placed"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={placedCount}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-strong to-violet transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${(placedCount / total) * 100}%` }}
            />
          </div>
          <span className="w-24 text-right text-sm font-semibold tabular-nums text-ink-soft">
            {placedCount} / {total} placed
          </span>
        </div>

        <ul className="flex flex-wrap justify-center gap-2" aria-label="Puzzle pieces">
          {SOLID_PIECES.map((piece) => {
            const placed = placedIds.includes(piece.id);
            const open = activeInfoId === piece.id;
            return (
              <li key={piece.id}>
                <button
                  type="button"
                  onClick={() => onChipClick(piece)}
                  aria-pressed={placed ? open : undefined}
                  aria-label={
                    placed
                      ? `${piece.title}, placed. ${open ? "Hide" : "Show"} description`
                      : `Place the ${piece.title} piece in its outline`
                  }
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                    placed
                      ? open
                        ? "border-focus bg-focus/15 text-white"
                        : "border-line-strong bg-white/10 text-ink hover:bg-white/15"
                      : "border-dashed border-white/25 text-ink-muted hover:border-focus/60 hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 rounded-sm ${placed ? "" : "opacity-40"}`}
                    style={{ backgroundColor: piece.color }}
                  />
                  {piece.chip}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex min-h-[2.5rem] flex-wrap items-center justify-center gap-3">
          {solved && (
            <p
              role="status"
              className="animate-panel-in inline-flex items-center gap-2 text-ink font-semibold"
            >
              <Sparkles className="h-5 w-5 text-fuchsia" aria-hidden="true" />
              That’s SOLID. All seven pieces fit together.
            </p>
          )}
          <button
            type="button"
            onClick={puzzle.reset}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-line-strong bg-white/[0.04] px-4 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.08]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset puzzle
          </button>
        </div>

        {isDesktop && (
          <div className="w-full">
            <SolidInfoPanel
              piece={activePiece}
              hasPlaced={placedCount > 0}
              onClose={() => puzzle.toggleInfo(activeInfoId)}
            />
          </div>
        )}
      </div>
      </div>

      {/* Below desktop: a compact bottom sheet over the page */}
      {!isDesktop && (
        <SolidInfoSheet
          piece={activePiece ?? lastPiece.current}
          show={!!activePiece && boardOnScreen}
          minimized={minimizedFor === activeInfoId}
          onMinimize={() => setMinimizedFor(activeInfoId)}
          onExpand={() => setMinimizedFor(null)}
          onClose={() => puzzle.toggleInfo(activeInfoId)}
        />
      )}

      {/* Accessible text alternative (works without WebGL or JavaScript-driven 3D) */}
      <details
        className="mx-auto mt-6 max-w-3xl rounded-xl border border-line bg-surface-deep p-4"
        open={!webgl || undefined}
      >
        <summary className="cursor-pointer select-none text-sm md:text-base font-semibold text-white/70 hover:text-white/100 transition-colors duration-300 ease-in-out">
          Accessible text version of the SOLID pieces
          <span className="sr-only">
            {" "}
            — expands to reveal descriptions for screen readers and keyboard users
          </span>
        </summary>

        <dl className="mt-3 space-y-3 text-sm text-ink-soft" id="solid-a11y">
          {SOLID_PIECES.map((piece) => (
            <div key={piece.id}>
              <dt className="font-semibold text-white">
                {piece.letter && piece.letter !== "+" ? `${piece.letter} — ` : ""}
                {piece.title}
              </dt>
              <dd>
                {piece.description} {piece.detail}
              </dd>
            </div>
          ))}
        </dl>
      </details>

      <noscript>
        <div className="mx-auto mt-6 max-w-3xl text-sm text-ink-soft">
          <p>Interactive 3D is disabled. Here’s the SOLID summary:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {SOLID_PIECES.map((piece) => (
              <li key={piece.id}>
                <strong>{piece.title}</strong> — {piece.description}
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </div>
  );
}
