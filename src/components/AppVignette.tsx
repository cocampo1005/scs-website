import type { ApplicationType } from "../content/types";
import { cn } from "./ui/cn";

// Small UI-inspired drawings for the kinds of application we build. They are
// deliberately abstract: they suggest a screen, never a real product.

const ink = "rgb(245 241 251 / 0.55)";
const faint = "rgb(196 181 253 / 0.16)";
const line = "rgb(196 181 253 / 0.3)";
const accent = "var(--color-fuchsia)";
const violet = "var(--color-violet)";

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 132"
      className={cn("block h-auto w-full rounded-[10px] border border-[rgb(255_255_255/0.06)] bg-[rgb(8_6_13/0.55)]", className)}
    >
      <rect x="0" y="0" width="240" height="18" fill="rgb(255 255 255 / 0.03)" />
      <circle cx="12" cy="9" r="2.5" fill={line} />
      <circle cx="21" cy="9" r="2.5" fill={line} />
      <circle cx="30" cy="9" r="2.5" fill={line} />
      {children}
    </svg>
  );
}

function Records() {
  return (
    <Frame>
      <rect x="16" y="30" width="130" height="12" rx="4" fill={faint} />
      <rect x="22" y="34" width="40" height="4" rx="2" fill={ink} opacity="0.5" />
      <rect x="156" y="30" width="68" height="12" rx="4" fill={accent} opacity="0.8" />
      {[52, 68, 84, 100, 116].map((y, i) => (
        <g key={y}>
          <rect x="16" y={y} width="208" height="10" rx="3" fill={i === 1 ? "rgb(232 121 249 / 0.14)" : "rgb(255 255 255 / 0.03)"} />
          <rect x="22" y={y + 3} width="46" height="4" rx="2" fill={ink} opacity={i === 1 ? 1 : 0.7} />
          <rect x="84" y={y + 3} width="60" height="4" rx="2" fill={ink} opacity="0.45" />
          <rect x="160" y={y + 3} width="30" height="4" rx="2" fill={ink} opacity="0.45" />
          <rect x="204" y={y + 2} width="14" height="6" rx="3" fill={i % 2 ? violet : accent} opacity="0.8" />
        </g>
      ))}
    </Frame>
  );
}

function Calendar() {
  const cells = Array.from({ length: 21 }, (_, i) => i);
  const booked = new Set([3, 4, 8, 9, 10, 15, 17, 18]);
  const full = new Set([9, 17]);
  return (
    <Frame>
      {cells.map((i) => {
        const x = 16 + (i % 7) * 30;
        const y = 30 + Math.floor(i / 7) * 24;
        return (
          <g key={i}>
            <rect x={x} y={y} width="26" height="20" rx="4" fill={booked.has(i) ? (full.has(i) ? "rgb(232 121 249 / 0.35)" : "rgb(139 92 246 / 0.3)") : faint} />
            {booked.has(i) && <rect x={x + 4} y={y + 13} width={full.has(i) ? 18 : 10} height="3" rx="1.5" fill={full.has(i) ? accent : violet} />}
          </g>
        );
      })}
      <rect x="16" y="106" width="208" height="14" rx="4" fill="rgb(255 255 255 / 0.03)" />
      <rect x="22" y="111" width="60" height="4" rx="2" fill={ink} opacity="0.6" />
      <rect x="150" y="109" width="68" height="8" rx="4" fill={faint} />
      <rect x="150" y="109" width="46" height="8" rx="4" fill={accent} opacity="0.85" />
    </Frame>
  );
}

function Board() {
  const cols = [
    { x: 16, cards: [22, 28, 18] },
    { x: 88, cards: [30, 22] },
    { x: 160, cards: [20, 26, 22] },
  ];
  return (
    <Frame>
      {cols.map((c, ci) => {
        let y = 44;
        return (
          <g key={c.x}>
            <rect x={c.x} y="28" width="40" height="4" rx="2" fill={ink} opacity="0.6" />
            {c.cards.map((h, i) => {
              const card = (
                <g key={i}>
                  <rect x={c.x} y={y} width="64" height={h} rx="5" fill={ci === 1 && i === 0 ? "rgb(232 121 249 / 0.16)" : "rgb(255 255 255 / 0.04)"} stroke={ci === 1 && i === 0 ? accent : faint} strokeWidth="1" />
                  <rect x={c.x + 6} y={y + 6} width="36" height="3" rx="1.5" fill={ink} opacity="0.7" />
                  <rect x={c.x + 6} y={y + 12} width="26" height="3" rx="1.5" fill={ink} opacity="0.35" />
                  <circle cx={c.x + 56} cy={y + h - 7} r="3.5" fill={i % 2 ? violet : accent} opacity="0.8" />
                </g>
              );
              y += h + 6;
              return card;
            })}
          </g>
        );
      })}
    </Frame>
  );
}

function Portal() {
  return (
    <Frame>
      <rect x="16" y="28" width="60" height="92" rx="6" fill="rgb(255 255 255 / 0.03)" />
      <circle cx="46" cy="48" r="10" fill={violet} opacity="0.7" />
      <rect x="28" y="64" width="36" height="4" rx="2" fill={ink} opacity="0.8" />
      <rect x="32" y="72" width="28" height="3" rx="1.5" fill={ink} opacity="0.4" />
      {[90, 100, 110].map((y, i) => (
        <rect key={y} x="26" y={y} width="40" height="5" rx="2.5" fill={i === 0 ? "rgb(232 121 249 / 0.4)" : faint} />
      ))}
      <rect x="88" y="28" width="136" height="4" rx="2" fill={ink} opacity="0.7" />
      <rect x="88" y="36" width="90" height="3" rx="1.5" fill={ink} opacity="0.35" />
      {/* Progress steps */}
      {[0, 1, 2, 3].map((i) => {
        const x = 96 + i * 40;
        const done = i < 2;
        return (
          <g key={i}>
            {i < 3 && <rect x={x + 6} y="59" width="28" height="2" fill={done ? accent : faint} />}
            <circle cx={x} cy="60" r="6" fill={done ? accent : i === 2 ? "rgb(232 121 249 / 0.35)" : faint} stroke={i === 2 ? accent : "none"} strokeWidth="1.5" />
          </g>
        );
      })}
      <rect x="88" y="78" width="136" height="42" rx="6" fill="rgb(255 255 255 / 0.03)" stroke={faint} />
      <rect x="98" y="88" width="80" height="4" rx="2" fill={ink} opacity="0.7" />
      <rect x="98" y="97" width="110" height="3" rx="1.5" fill={ink} opacity="0.35" />
      <rect x="98" y="106" width="44" height="8" rx="4" fill={accent} opacity="0.85" />
    </Frame>
  );
}

function Invoice() {
  return (
    <Frame>
      <rect x="16" y="28" width="132" height="92" rx="6" fill="rgb(255 255 255 / 0.03)" stroke={faint} />
      <rect x="26" y="38" width="44" height="5" rx="2.5" fill={ink} opacity="0.8" />
      <rect x="112" y="38" width="26" height="5" rx="2.5" fill={ink} opacity="0.4" />
      {[54, 64, 74, 84].map((y, i) => (
        <g key={y}>
          <rect x="26" y={y} width={50 + (i % 2) * 14} height="3" rx="1.5" fill={ink} opacity="0.45" />
          <rect x="114" y={y} width="24" height="3" rx="1.5" fill={ink} opacity="0.45" />
        </g>
      ))}
      <rect x="26" y="98" width="112" height="1" fill={line} />
      <rect x="26" y="106" width="30" height="5" rx="2.5" fill={ink} opacity="0.8" />
      <rect x="104" y="105" width="34" height="7" rx="2" fill={accent} opacity="0.85" />
      {/* Approval chip and totals */}
      <rect x="160" y="28" width="64" height="24" rx="6" fill="rgb(108 233 166 / 0.12)" stroke="rgb(108 233 166 / 0.4)" />
      <circle cx="172" cy="40" r="4" fill="var(--color-success)" />
      <rect x="181" y="38" width="34" height="4" rx="2" fill={ink} opacity="0.7" />
      <rect x="160" y="62" width="64" height="58" rx="6" fill="rgb(255 255 255 / 0.03)" stroke={faint} />
      <rect x="168" y="72" width="30" height="3" rx="1.5" fill={ink} opacity="0.4" />
      <rect x="168" y="80" width="46" height="6" rx="2" fill={ink} opacity="0.85" />
      <rect x="168" y="96" width="30" height="3" rx="1.5" fill={ink} opacity="0.4" />
      <rect x="168" y="104" width="38" height="6" rx="2" fill={violet} opacity="0.85" />
    </Frame>
  );
}

function Chart() {
  const bars = [34, 52, 44, 68, 58, 80, 72];
  return (
    <Frame>
      <rect x="16" y="28" width="60" height="4" rx="2" fill={ink} opacity="0.7" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={16 + i * 46} y="40" width="40" height="22" rx="5" fill="rgb(255 255 255 / 0.03)" stroke={faint} />
          <rect x={22 + i * 46} y="46" width="18" height="3" rx="1.5" fill={ink} opacity="0.4" />
          <rect x={22 + i * 46} y="52" width="26" height="5" rx="2" fill={i === 1 ? accent : ink} opacity={i === 1 ? 0.9 : 0.8} />
        </g>
      ))}
      {bars.map((h, i) => (
        <rect key={i} x={16 + i * 20} y={120 - h * 0.6} width="12" height={h * 0.6} rx="3" fill={i === 5 ? accent : "rgb(139 92 246 / 0.55)"} />
      ))}
      <polyline points={bars.map((h, i) => `${22 + i * 20},${114 - h * 0.45}`).join(" ")} fill="none" stroke="#ffe4ff" strokeWidth="1.5" opacity="0.8" />
      <rect x="164" y="40" width="60" height="80" rx="6" fill="rgb(255 255 255 / 0.03)" stroke={faint} />
      <circle cx="194" cy="72" r="20" fill="none" stroke={faint} strokeWidth="7" />
      <circle cx="194" cy="72" r="20" fill="none" stroke={accent} strokeWidth="7" strokeDasharray="88 126" strokeLinecap="round" transform="rotate(-90 194 72)" />
      <rect x="178" y="102" width="32" height="4" rx="2" fill={ink} opacity="0.6" />
    </Frame>
  );
}

const VIGNETTES: Record<ApplicationType["vignette"], () => React.ReactElement> = {
  records: Records,
  calendar: Calendar,
  board: Board,
  portal: Portal,
  invoice: Invoice,
  chart: Chart,
};

export function AppVignette({ kind, className }: { kind: ApplicationType["vignette"]; className?: string }) {
  const V = VIGNETTES[kind];
  return (
    <div className={cn("[&>svg]:transition-transform [&>svg]:duration-500 [&>svg]:ease-[var(--ease-out)] group-hover:[&>svg]:-translate-y-0.5 motion-reduce:[&>svg]:transition-none", className)}>
      <V />
    </div>
  );
}
