import type { ComponentPropsWithoutRef, HTMLAttributes, PointerEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "./cn";

// Literal class names so Tailwind generates them. Phones use 2 columns,
// tablets 6 and desktops 12 (docs/design-review.md, responsive rules).
const BASE_COLS = { 1: "col-span-1", 2: "col-span-2" } as const;
const MD_COLS = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
} as const;
const LG_COLS = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
} as const;
const MD_ROWS = { 1: "md:row-span-1", 2: "md:row-span-2", 3: "md:row-span-3" } as const;
const LG_ROWS = { 1: "lg:row-span-1", 2: "lg:row-span-2", 3: "lg:row-span-3" } as const;

export type Span = {
  base?: keyof typeof BASE_COLS;
  md?: keyof typeof MD_COLS;
  lg?: keyof typeof LG_COLS;
};
export type RowSpan = { md?: keyof typeof MD_ROWS; lg?: keyof typeof LG_ROWS };

function spanClass(span: Span = {}, rows: RowSpan = {}) {
  return cn(
    BASE_COLS[span.base ?? 2],
    MD_COLS[span.md ?? 6],
    LG_COLS[span.lg ?? 12],
    rows.md && MD_ROWS[rows.md],
    rows.lg && LG_ROWS[rows.lg],
  );
}

type BentoProps = ComponentPropsWithoutRef<"div"> & {
  /** Fixed row height on desktop, for bentos built from row spans */
  rowHeight?: "auto" | "150" | "160";
};

export function Bento({ className, rowHeight = "auto", children, ...rest }: BentoProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2.5 md:grid-cols-6 md:gap-4 lg:grid-cols-12",
        rowHeight === "150" && "lg:auto-rows-[150px]",
        rowHeight === "160" && "lg:auto-rows-[160px]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type TileVariant = "default" | "feature" | "open";

type TileProps = {
  as?: "div" | "article" | "figure" | "section";
  /** Router path or external URL; the tile becomes a link */
  to?: string;
  variant?: TileVariant;
  span?: Span;
  rows?: RowSpan;
  /** Standalone tile, not placed in a Bento */
  standalone?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

// Spotlight position for interactive tiles, written straight to CSS variables
function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export function Tile({ as, to, variant = "default", span, rows, standalone, className, children, ...rest }: TileProps) {
  const interactive = Boolean(to);
  const classes = cn(
    "tile",
    variant === "feature" && "tile-feature",
    variant === "open" && "tile-open",
    interactive && "tile-interactive text-ink no-underline",
    !standalone && spanClass(span, rows),
    className,
  );

  if (to) {
    const external = /^https?:/.test(to);
    return external ? (
      <a href={to} target="_blank" rel="noreferrer" className={classes} onPointerMove={trackPointer}>
        {children}
      </a>
    ) : (
      <Link to={to} className={classes} onPointerMove={trackPointer}>
        {children}
      </Link>
    );
  }

  const Element = as ?? "div";
  return (
    <Element className={classes} {...rest}>
      {children}
    </Element>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function TagList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("m-0 flex list-none flex-wrap gap-1.5 p-0", className)} aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="tag">
          {t}
        </li>
      ))}
    </ul>
  );
}
