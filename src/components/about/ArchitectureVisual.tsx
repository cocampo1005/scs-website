import { useRef, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import "./architecture-visual.css";

// Three isometric layers of a system, people at the top, the process in the
// middle, the data underneath, joined by a vertical signal. The layers drift
// at different depths as the pointer moves over the hero.

const LAYERS = [
  { label: "People", depth: 1.0, y: 0, blocks: [[86, 52], [126, 32], [146, 62]] },
  { label: "Process", depth: 0.6, y: 92, blocks: [[70, 60], [110, 40], [150, 60], [110, 80]] },
  { label: "Data", depth: 0.3, y: 184, blocks: [[90, 56], [130, 56]] },
] as const;

// An isometric rhombus plate, 240 wide, with a short rim underneath
function Plate({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 240 150" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <path d="M120 10 L230 65 L120 120 L10 65 Z" className="arch-plate-top" />
      <path d="M10 65 L120 120 L120 134 L10 79 Z" className="arch-plate-left" />
      <path d="M230 65 L120 120 L120 134 L230 79 Z" className="arch-plate-right" />
      <path d="M120 10 L230 65 L120 120 L10 65 Z" className="arch-plate-grid" />
      <text x="24" y="40" className="arch-label">
        {label}
      </text>
    </svg>
  );
}

// A small isometric block sitting on a plate
function Block({ x, y, hot }: { x: number; y: number; hot?: boolean }) {
  const w = 22;
  const h = 14;
  const d = 11;
  return (
    <g transform={`translate(${x} ${y})`} className={hot ? "arch-block hot" : "arch-block"}>
      <path d={`M0 0 L${w} ${-d} L${w * 2} 0 L${w} ${d} Z`} className="arch-block-top" />
      <path d={`M0 0 L${w} ${d} L${w} ${d + h} L0 ${h} Z`} className="arch-block-left" />
      <path d={`M${w * 2} 0 L${w} ${d} L${w} ${d + h} L${w * 2} ${h} Z`} className="arch-block-right" />
    </g>
  );
}

export function ArchitectureVisual() {
  const reducedMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position in [-1, 1] written to CSS variables; no React state
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${(((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3)}`);
    el.style.setProperty("--py", `${(((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3)}`);
  };
  const onPointerLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="arch relative mx-auto aspect-[5/4] w-full max-w-[520px] select-none"
      data-motion={!reducedMotion}
      onPointerMove={reducedMotion ? undefined : onPointerMove}
      onPointerLeave={reducedMotion ? undefined : onPointerLeave}
    >
      <div className="arch-glow absolute inset-0" />
      {/* Signal through the stack */}
      <svg viewBox="0 0 240 320" className="arch-signal absolute inset-0 h-full w-full overflow-visible">
        <line x1="120" y1="28" x2="120" y2="300" className="arch-signal-line" />
        <line x1="120" y1="28" x2="120" y2="300" className="arch-signal-pulse" />
        {[62, 154, 246].map((y) => (
          <circle key={y} cx="120" cy={y} r="4" className="arch-signal-node" />
        ))}
      </svg>
      {LAYERS.map((layer, i) => (
        <div
          key={layer.label}
          className="arch-layer absolute inset-x-0"
          style={{ top: `${(layer.y / 320) * 100}%`, "--depth": layer.depth, "--i": i } as React.CSSProperties}
        >
          <div className="relative">
            <Plate label={layer.label} />
            <svg viewBox="0 0 240 150" className="absolute inset-0 h-full w-full overflow-visible">
              {layer.blocks.map(([x, y], b) => (
                <Block key={b} x={x} y={y} hot={i === 1 && b === 1} />
              ))}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
