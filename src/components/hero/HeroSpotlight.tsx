import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import "./hero-spotlight.css";

type Spark = { id: number; d: string; x: number; y: number };

const MAX_SPARKS = 14;
const SPARK_MS = 1000;

// A random L-shaped run along the grid from an intersection: one to three
// cells one way, then one to two cells the other way
function sparkPath(cell: number, rng: () => number) {
  const sign = () => (rng() < 0.5 ? -1 : 1);
  const a = (1 + Math.floor(rng() * 3)) * cell * sign();
  const b = (1 + Math.floor(rng() * 2)) * cell * sign();
  return rng() < 0.5 ? `M0 0 H${a} V${b}` : `M0 0 V${a} H${b}`;
}

/**
 * The pointer lights a patch of the hero grid. Before the solve it is a faint
 * highlight; after it the patch is brighter and the pointer leaves a trail of
 * small circuit runs along the grid (none under reduced motion). The spotlight
 * position goes straight to CSS variables on the hero; only the sparks touch
 * React state, and only when the pointer crosses into a new grid cell.
 */
export function HeroSpotlight({
  hostRef,
  solved,
  reducedMotion,
  origin,
  cell,
}: {
  hostRef: RefObject<HTMLElement | null>;
  solved: boolean;
  reducedMotion: boolean;
  /** The grid's anchor point in the hero (px), so sparks sit on its lines */
  origin: { x: number; y: number } | null;
  cell: number;
}) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const lastCell = useRef<string>("");
  const nextId = useRef(0);
  const live = useRef({ solved, reducedMotion, origin, cell });
  live.current = { solved, reducedMotion, origin, cell };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const timers = new Set<number>();
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      host.style.setProperty("--mx", `${x}px`);
      host.style.setProperty("--my", `${y}px`);
      host.dataset.pointer = "true";

      const { solved, reducedMotion, origin, cell } = live.current;
      if (!solved || reducedMotion || !origin || e.pointerType === "touch") return;
      // Snap to the nearest grid intersection; one spark per cell crossed
      const gx = Math.round((x - origin.x) / cell);
      const gy = Math.round((y - origin.y) / cell);
      const key = `${gx},${gy}`;
      if (key === lastCell.current) return;
      lastCell.current = key;
      const id = nextId.current++;
      const rng = () => Math.random();
      const spark: Spark = { id, x: origin.x + gx * cell, y: origin.y + gy * cell, d: sparkPath(cell, rng) };
      setSparks((s) => [...s.slice(-(MAX_SPARKS - 1)), spark]);
      const t = window.setTimeout(() => {
        timers.delete(t);
        setSparks((s) => s.filter((sp) => sp.id !== id));
      }, SPARK_MS);
      timers.add(t);
    };
    const onLeave = () => {
      host.dataset.pointer = "false";
      lastCell.current = "";
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [hostRef]);

  const gridStyle = origin ? { backgroundPosition: `${origin.x}px ${origin.y}px` } : undefined;

  return (
    <div aria-hidden="true" className="hero-spot absolute inset-0 -z-10" data-solved={solved}>
      <div className="hero-spot-glow absolute inset-0" />
      {/* grid-motif supplies --cell; the lit lines and mask come from hero-spotlight.css */}
      <div className="hero-spot-grid grid-motif absolute inset-0" style={gridStyle} />
      {sparks.length > 0 && (
        <svg className="hero-sparks absolute inset-0 h-full w-full overflow-visible">
          {sparks.map((s) => (
            <g key={s.id} className="hero-spark" style={{ "--sx": `${s.x}px`, "--sy": `${s.y}px` } as CSSProperties}>
              <path d={s.d} />
              <circle r="3" />
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}
