import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { useHomeHero } from "../../hooks/useHomeHero";
import CubeLoader from "../CubeLoader";
import SceneBoundary from "../SceneBoundary";
import { ArrowIcon, LinkButton } from "../ui/Button";
import { Container, Eyebrow } from "../ui/Section";
import { cn } from "../ui/cn";
import { CircuitLayer } from "./CircuitLayer";
import { StoryStrip } from "./StoryStrip";
import { workPath } from "../../content/work";
import posterImg from "../../assets/images/hero-puzzle-solved.webp";

const HeroPuzzleCanvas = lazy(() => import("../hero3d/HeroPuzzleCanvas"));

// The assembled cube sits a little below the stage centre (the drag hint takes
// the top of the stage); the circuit starts from the cube
const CUBE_CENTRE_DROP = 0.13;

type StageGeometry = { height: number; offsetX: number; offsetY: number; originX: number; originY: number };

// Where the stage sits in the hero: the canvas spans the hero, and the camera
// frames the puzzle inside the stage
function useStageGeometry(sectionRef: RefObject<HTMLElement | null>, stageRef: RefObject<HTMLElement | null>) {
  const [stage, setStage] = useState<StageGeometry | null>(null);
  useEffect(() => {
    const section = sectionRef.current;
    const el = stageRef.current;
    if (!section || !el) return;
    const measure = () => {
      const s = section.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - s.left;
      const cy = r.top + r.height / 2 - s.top;
      const next: StageGeometry = {
        height: Math.round(r.height),
        offsetX: Math.round(cx - s.width / 2),
        offsetY: Math.round(cy - s.height / 2),
        originX: Math.round(cx),
        originY: Math.round(cy + r.height * CUBE_CENTRE_DROP),
      };
      setStage((prev) =>
        prev &&
        prev.height === next.height &&
        prev.offsetX === next.offsetX &&
        prev.offsetY === next.offsetY &&
        prev.originY === next.originY
          ? prev
          : next,
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

const CAPABILITIES = ["Records platforms", "Scheduling & booking", "Portals & dashboards", "Integrations"] as const;

export default function HomeHero() {
  const reducedMotion = Boolean(useReducedMotion());
  const hero = useHomeHero(reducedMotion);
  const { state, sceneAvailable } = hero;
  const stageRef = useRef<HTMLDivElement>(null);
  const stage = useStageGeometry(hero.containerRef, stageRef);
  // Without the 3D scene the poster shows the finished cube
  const solved = state.solved || !sceneAvailable;

  return (
    <section
      ref={hero.containerRef}
      aria-labelledby="hero-heading"
      className="relative isolate flex flex-col overflow-hidden pt-16 lg:min-h-[max(820px,min(100svh,940px))] lg:pt-[84px]"
    >
      {/* Ambient light, the engineering grid and the circuit, all behind the canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(760px_560px_at_74%_56%,rgb(139_92_246/0.26),transparent_70%),radial-gradient(520px_360px_at_82%_78%,rgb(232_121_249/0.16),transparent_70%),radial-gradient(900px_500px_at_10%_0%,rgb(124_58_237/0.1),transparent_70%)] max-lg:bg-[radial-gradient(320px_300px_at_50%_70%,rgb(139_92_246/0.3),transparent_70%),radial-gradient(600px_400px_at_50%_0%,rgb(124_58_237/0.12),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="grid-motif absolute inset-0 -z-20 [mask-image:linear-gradient(90deg,rgb(0_0_0/0.28)_0%,rgb(0_0_0/0.28)_36%,#000_62%),linear-gradient(180deg,#000_75%,transparent)] [mask-composite:intersect] max-lg:[mask-image:linear-gradient(180deg,rgb(0_0_0/0.22)_0%,rgb(0_0_0/0.22)_40%,#000_62%,transparent_100%)]"
        style={stage ? { backgroundPosition: `${stage.originX}px ${stage.originY}px` } : undefined}
      />
      <CircuitLayer state={state.circuit} origin={stage ? { x: stage.originX, y: stage.originY } : null} />

      {sceneAvailable && (
        <div className="absolute inset-0 -z-10 select-none" aria-hidden="true">
          <SceneBoundary fallback={null} onError={hero.handleFailure}>
            <Suspense fallback={null}>
              <HeroPuzzleCanvas
                active={hero.active}
                continuous={!reducedMotion}
                skipped={state.placing}
                restored={state.restored}
                replayKey={state.replayKey}
                reducedMotion={reducedMotion}
                stage={stage}
                onSolved={hero.handleSolved}
                onReady={hero.handleReady}
                onContextLost={hero.handleFailure}
              />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      <Container className="flex flex-1 flex-col">
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 lg:items-start">
          {/* The offer is readable before, during and after the puzzle */}
          <div className="relative z-10 flex flex-col gap-4 pt-6 text-left sm:items-center sm:pt-12 sm:text-center lg:items-start lg:gap-7 lg:pt-[104px] lg:text-left">
            <Eyebrow rule className="max-sm:[&>span]:hidden">
              Custom software development
            </Eyebrow>
            <h1
              id="hero-heading"
              className="display m-0 text-[38px] leading-[1.03] sm:text-[56px] lg:text-[clamp(56px,5.1vw,74px)] lg:leading-[1.02]"
            >
              Custom Software. <br className="hidden lg:inline" />
              Built Around <br className="hidden lg:inline" />
              <span className="text-gradient">Your Business.</span>
            </h1>
            <p className="m-0 max-w-[540px] text-[15px] leading-relaxed text-ink-muted sm:text-[17px] lg:text-[19px]">
              We build reliable applications that streamline your workflows, connect your tools, and solve the problems
              off-the-shelf products leave behind.
            </p>
            <div className="grid grid-cols-[1.4fr_1fr] gap-2.5 sm:flex sm:gap-3.5">
              <LinkButton to="/contact">
                Discuss your project <ArrowIcon className="hidden sm:block" />
              </LinkButton>
              <LinkButton to="/work" variant="secondary">
                <span className="sm:hidden">Our work</span>
                <span className="hidden sm:inline">Explore our work</span>
              </LinkButton>
            </div>
            <ul className="m-0 mt-2.5 hidden list-none gap-x-[26px] gap-y-2 p-0 text-sm text-ink-subtle lg:flex lg:flex-wrap">
              {CAPABILITIES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Stage: the camera frames the puzzle here (or the poster without 3D) */}
          <div className="relative flex flex-col items-center lg:h-full lg:min-h-[620px]">
            <div
              ref={stageRef}
              className="pointer-events-none relative h-[360px] w-full max-w-[440px] sm:h-[440px] lg:mt-4 lg:h-[560px] lg:max-w-none"
            >
              {sceneAvailable ? <CubeLoader ready={hero.ready} /> : <PuzzlePoster />}
            </div>
            <PuzzleControls
              sceneAvailable={sceneAvailable}
              solved={solved}
              placing={state.placing}
              onPlace={hero.place}
              onReplay={hero.replay}
            />
          </div>
        </div>
        <StoryStrip lit={solved && (state.storyLit || !sceneAvailable)} className="mt-6 mb-6 lg:mt-auto lg:mb-[22px]" />
      </Container>
    </section>
  );
}

function PuzzleControls({
  sceneAvailable,
  solved,
  placing,
  onPlace,
  onReplay,
}: {
  sceneAvailable: boolean;
  solved: boolean;
  placing: boolean;
  onPlace: () => void;
  onReplay: () => void;
}) {
  return (
    <div className="relative z-10 flex min-h-12 w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:justify-center">
      {sceneAvailable && !solved ? (
        <>
          <p className="m-0 text-[13px] text-ink-muted sm:text-sm">
            <span className="sm:hidden">Drag the cube down</span>
            <span className="hidden sm:inline">Fit the missing piece</span>
          </p>
          <button
            type="button"
            onClick={onPlace}
            disabled={placing}
            className="min-h-11 cursor-pointer rounded-[10px] border border-line-strong bg-white/[0.04] px-4 font-sans text-[13px] font-medium text-ink transition-colors hover:bg-white/[0.08] disabled:opacity-60"
          >
            Place it for me
          </button>
        </>
      ) : (
        <div className={cn("flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center", sceneAvailable && "motion-safe:animate-panel-in")}>
          <p className="m-0 text-sm font-medium text-ink" aria-live="polite">
            Every piece has a purpose. Every solution is built to fit.
          </p>
          {sceneAvailable ? (
            <button
              type="button"
              onClick={onReplay}
              className="min-h-11 cursor-pointer border-0 bg-transparent px-1.5 font-sans text-[13px] font-medium text-accent underline underline-offset-4 hover:text-white"
            >
              Replay the puzzle
            </button>
          ) : null}
          <Link to={workPath("street-cat-clinic")} className="inline-flex min-h-11 items-center gap-1 text-[13px] font-medium text-fuchsia no-underline hover:text-white">
            See one in practice <ArrowIcon className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
