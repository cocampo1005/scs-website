import { lazy, Suspense, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import CubeLoader from "../CubeLoader";
import SceneBoundary from "../SceneBoundary";
import { hasWebGL } from "../../three/webgl";
import { useInView } from "../../hooks/useInView";
import { ArchitectureVisual } from "./ArchitectureVisual";

const StackCanvas = lazy(() => import("../about3d/StackCanvas"));

/**
 * The About hero's 3D stack. The pointer anywhere over the hero section turns
 * the rig (written to a ref, read by the frame loop); without WebGL, or after
 * a scene error, the flat version takes its place.
 */
export function AboutHeroVisual({ hostRef }: { hostRef: RefObject<HTMLElement | null> }) {
  const reducedMotion = Boolean(useReducedMotion());
  const [webgl] = useState(hasWebGL);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [stageRef, inView] = useInView<HTMLDivElement>({ threshold: 0.15 });
  const pointer = useRef({ x: 0, y: 0 });
  const handleFailure = useCallback(() => setFailed(true), []);
  const handleReady = useCallback(() => setReady(true), []);

  // Decorative: load the scene once the page has settled, so the three.js
  // bundle and shader compile don't compete with the first paint
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setArmed(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setArmed(true), 300);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [hostRef]);

  if (!webgl || failed) return <ArchitectureVisual />;

  return (
    <div ref={stageRef} aria-hidden="true" className="relative mx-auto aspect-[5/4] w-full max-w-[560px] select-none">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_55%,rgb(139_92_246/0.3),transparent_70%)] blur-xl" />
      <SceneBoundary fallback={<ArchitectureVisual />} onError={handleFailure}>
        {armed && (
          <Suspense fallback={null}>
            <StackCanvas active={inView} reducedMotion={reducedMotion} pointerRef={pointer} onReady={handleReady} onContextLost={handleFailure} />
          </Suspense>
        )}
        <CubeLoader ready={ready} size={56} />
      </SceneBoundary>
    </div>
  );
}
