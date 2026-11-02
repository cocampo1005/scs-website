import type { CSSProperties } from "react";
import type { CircuitState } from "../../hooks/useHomeHero";
import "./circuit.css";

type PathDef = { d: string; delay: number; branch?: boolean; node?: [number, number] };

// Paths run along the grid from the cube's centre. Desktop: 56 px cells, six
// paths and four branches from 1280 px, five paths from 640 px. Phones: 40 px
// cells, three paths, no branches.
const WIDE: PathDef[] = [
  { d: "M0 0 H280 V-224 H616", delay: 0, node: [280, 0] },
  { d: "M0 0 H-224 V-168 H-560", delay: 0.08, node: [-224, 0] },
  { d: "M0 0 V224 H224 V504", delay: 0.15, node: [0, 224] },
  { d: "M0 0 V-280 H-112 V-560", delay: 0.05 },
  { d: "M0 0 H-168 V280 H-448", delay: 0.22 },
];
const FULL_ONLY: PathDef[] = [
  { d: "M0 0 V-336 H168 V-616", delay: 0.3, node: [280, -224] },
  { d: "M280 0 V168 H448", delay: 0.55, branch: true },
  { d: "M-224 0 V112 H-336", delay: 0.6, branch: true },
  { d: "M0 224 H-112 V392", delay: 0.7, branch: true },
  { d: "M280 -224 V-392", delay: 0.85, branch: true },
];
const PHONE: PathDef[] = [
  { d: "M0 0 H120 V-120 H240", delay: 0 },
  { d: "M0 0 H-120 V120 H-240", delay: 0.1 },
  { d: "M0 0 V-160 H-80 V-320", delay: 0.05 },
];

function Paths({ paths, className }: { paths: PathDef[]; className?: string }) {
  return (
    <g className={className}>
      {paths.map((p) => (
        <path key={p.d} d={p.d} className={p.branch ? "branch" : undefined} style={{ "--d": `${p.delay}s` } as CSSProperties} />
      ))}
      {paths
        .filter((p) => p.node)
        .map((p) => (
          <circle key={`n${p.d}`} cx={p.node?.[0]} cy={p.node?.[1]} r="3.5" style={{ "--d": `${p.delay}s` } as CSSProperties} />
        ))}
    </g>
  );
}

export function CircuitLayer({ state, origin }: { state: CircuitState; origin: { x: number; y: number } | null }) {
  if (!origin) return null;
  const style = { "--ox": `${origin.x}px`, "--oy": `${origin.y}px` } as CSSProperties;
  return (
    <div
      aria-hidden="true"
      // Same mask as the hero grid: faint behind the copy, full strength around the cube
      className="circuit grid-motif !bg-none [mask-image:linear-gradient(90deg,rgb(0_0_0/0.22)_0%,rgb(0_0_0/0.22)_38%,#000_60%)] max-lg:[mask-image:linear-gradient(180deg,rgb(0_0_0/0.2)_0%,rgb(0_0_0/0.2)_42%,#000_60%)]"
      data-state={state}
      style={style}
    >
      <div className="circuit-hot" />
      <div className="circuit-wave" />
      <svg className="circuit-paths hidden sm:block" width="1" height="1">
        <Paths paths={WIDE} />
        <Paths paths={FULL_ONLY} className="hidden xl:inline" />
      </svg>
      <svg className="circuit-paths sm:hidden" width="1" height="1">
        <Paths paths={PHONE} />
      </svg>
    </div>
  );
}
