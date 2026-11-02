import type { CSSProperties, PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowIcon, LinkButton } from "./ui/Button";
import { Container, Eyebrow } from "./ui/Section";
import { useInView } from "../hooks/useInView";
import "./closing-cta.css";

// A small network of nodes and orthogonal wires, in a 1200x480 box that is
// cropped to the panel. Positions are on a 40 px grid so the wires read as
// part of the engineering grid.
const NODES: readonly [number, number][] = [
  [120, 120], [320, 120], [320, 360], [560, 360], [80, 320], [1080, 120], [880, 120], [880, 360], [640, 80],
  [1120, 320], [1000, 440], [200, 440],
];
const WIRES: readonly [number, number][] = [
  [0, 1], [1, 2], [2, 3], [4, 2], [5, 6], [6, 7], [7, 3], [8, 6], [9, 7], [10, 7], [11, 2],
];

function orthogonal([ax, ay]: readonly [number, number], [bx, by]: readonly [number, number]) {
  return ax === bx || ay === by ? `M${ax} ${ay} L${bx} ${by}` : `M${ax} ${ay} V${by} H${bx}`;
}

function NodeField({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="cta-field absolute inset-0 h-full w-full"
      viewBox="0 0 1200 480"
      preserveAspectRatio="xMidYMid slice"
      data-active={active}
    >
      {WIRES.map(([a, b], i) => (
        <path key={i} d={orthogonal(NODES[a]!, NODES[b]!)} className="cta-wire" style={{ "--i": i } as CSSProperties} />
      ))}
      {NODES.map(([x, y], i) => (
        <g key={i} className="cta-node" style={{ "--i": i } as CSSProperties}>
          <circle cx={x} cy={y} r="14" className="cta-node-halo" />
          <circle cx={x} cy={y} r="3" className="cta-node-core" />
        </g>
      ))}
    </svg>
  );
}

// The pointer spotlight is written straight to CSS variables: no state, no re-render
function trackPointer(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
}

/**
 * The closing invitation at the end of most pages: a full-width panel with a
 * quietly animated node network, a pointer-reactive glow and two actions.
 */
export function ClosingCta({
  eyebrow = "Let's build your solution",
  title = "What could your business accomplish with software built just for it?",
  text = "Whether you have a complete idea or simply a problem you'd like to solve, let's explore what the right application could look like for your business.",
  primary = { label: "Discuss your project", to: "/contact" },
  secondary = { label: "Explore our work", to: "/work" },
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string } | null;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <section ref={ref} aria-labelledby="cta-heading" className="pb-16 md:pb-24 lg:pb-[100px]">
      <Container>
        <div
          className="cta-panel relative isolate overflow-hidden rounded-[var(--radius-tile)] border border-[rgb(232_121_249/0.3)] px-5 py-14 text-center sm:px-10 sm:py-20 lg:py-24"
          onPointerMove={reducedMotion ? undefined : trackPointer}
        >
          <div aria-hidden="true" className="cta-glow absolute inset-0 -z-10" />
          <div aria-hidden="true" className="grid-motif absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_70%_90%_at_50%_50%,#000,transparent)]" />
          <NodeField active={inView && !reducedMotion} />
          <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-5">
            <Eyebrow rule tone="fuchsia">
              {eyebrow}
            </Eyebrow>
            <h2 id="cta-heading" className="display m-0 text-[30px] leading-[1.08] sm:text-[40px] lg:text-[48px]">
              {title}
            </h2>
            <p className="m-0 max-w-[600px] text-base leading-relaxed text-ink-muted sm:text-lg">{text}</p>
            <div className="mt-3 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <LinkButton to={primary.to}>
                {primary.label} <ArrowIcon />
              </LinkButton>
              {secondary && (
                <LinkButton to={secondary.to} variant="secondary">
                  {secondary.label}
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
