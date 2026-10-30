import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useHeroPuzzle } from "../hooks/useHeroPuzzle";
import CubeLoader from "./CubeLoader";
import SceneBoundary from "./SceneBoundary";
import posterImg from "../assets/images/hero-puzzle-solved.webp";
const HeroPuzzleCanvas = lazy(() => import("./hero3d/HeroPuzzleCanvas"));

// Shown instead of the 3D puzzle when WebGL is unavailable or the scene fails
function PuzzlePoster() {
  return (
    <img
      src={posterImg}
      alt="The completed Solid Code Solutions cube, with the logo piece fitted into place"
      width="380"
      height="300"
      className="absolute inset-0 m-auto max-h-full w-auto object-contain [mask-image:radial-gradient(closest-side,#000_70%,transparent)]"
    />
  );
}

// Where the stage sits inside the hero, so the canvas (which spans the whole
// hero) can frame the puzzle there
function useStageGeometry(sectionRef, stageRef) {
  const [stage, setStage] = useState(null);
  useEffect(() => {
    const section = sectionRef.current;
    const el = stageRef.current;
    if (!section || !el) return;
    const measure = () => {
      const s = section.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const next = {
        height: Math.round(r.height),
        offsetY: Math.round(r.top + r.height / 2 - (s.top + s.height / 2)),
      };
      setStage((prev) =>
        prev && prev.height === next.height && prev.offsetY === next.offsetY ? prev : next
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sectionRef, stageRef]);
  return stage;
}

export default function HeroSection() {
  const {
    containerRef,
    sceneAvailable,
    showPoster,
    ready,
    solved,
    skipped,
    active,
    handleReady,
    handleSolved,
    handleFailure,
    skipPuzzle,
  } = useHeroPuzzle();
  const reducedMotion = useReducedMotion();
  const stageRef = useRef(null);
  const stage = useStageGeometry(containerRef, stageRef);

  return (
    <section
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden px-4 pt-28 pb-10 md:pt-32"
    >
      {/* 3D puzzle: the canvas spans the hero so its lighting and bubbles fill the
          background; the camera frames the puzzle inside the stage below the copy */}
      {sceneAvailable && (
        <div className="absolute inset-0 -z-10 select-none" aria-hidden="true">
          <SceneBoundary fallback={null} onError={handleFailure}>
            <Suspense fallback={null}>
              <HeroPuzzleCanvas
                active={active}
                continuous={!reducedMotion}
                skipped={skipped}
                reducedMotion={!!reducedMotion}
                stage={stage}
                onSolved={handleSolved}
                onReady={handleReady}
                onContextLost={handleFailure}
              />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      {/* The offer is readable before, during and after the puzzle */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent-purple-light md:text-sm">
          Custom software development
        </p>
        <h1
          id="hero-heading"
          className="mb-5 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text font-logo text-4xl font-bold leading-tight text-balance text-transparent md:text-[3.5rem]"
        >
          Custom Software. Built Around Your Business.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-gray-light md:text-xl">
          We build reliable applications that streamline your workflows, connect
          your tools, and solve the problems off-the-shelf products leave behind.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm md:gap-6 md:text-lg">
          <Link to="/contact" className="btn-primary">
            Discuss Your Project
          </Link>
          <Link to="/projects" className="btn-secondary">
            Explore Our Work
          </Link>
        </div>
      </div>

      {/* Stage: the puzzle is framed here (or its poster when 3D is unavailable) */}
      <div
        ref={stageRef}
        className="pointer-events-none relative z-0 mt-4 h-[clamp(300px,46svh,480px)] w-full max-w-3xl"
      >
        {showPoster ? <PuzzlePoster /> : <CubeLoader ready={ready} />}
      </div>

      {/* Hint and touch/keyboard alternative before; the story beat after */}
      <div className="relative z-10 flex min-h-12 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
        {!showPoster && !solved ? (
          <>
            <p className="text-sm text-gray-light md:text-base">
              Can’t find software that fits? Drag the missing piece into place.
            </p>
            <button
              type="button"
              onClick={skipPuzzle}
              disabled={skipped}
              className="min-h-11 rounded-lg border border-accent-purple/40 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-accent-fuchsia/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-fuchsia disabled:opacity-60"
            >
              Place it for me
            </button>
          </>
        ) : (
          <p
            className="flex flex-wrap items-center justify-center gap-x-3 text-sm text-gray-light md:text-base motion-safe:animate-panel-in"
            aria-live="polite"
          >
            <span className="font-semibold text-white">
              Every piece has a purpose. Every solution is built to fit.
            </span>
            <Link
              to="/projects?case=street-cat-clinic#featured"
              className="inline-flex items-center gap-1 text-accent-fuchsia-light underline-offset-4 hover:underline"
            >
              See one in practice <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[10vh] bg-gradient-to-t from-primary-dark-purple via-primary-dark-purple/50 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
