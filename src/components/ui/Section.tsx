import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./cn";

/** Page width with the 16 / 24 / 64 px gutters */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16", className)}>{children}</div>;
}

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** Vertical rhythm: 64 / 96 / 120 px (default) or a tighter 40 / 56 / 72 */
  spacing?: "default" | "tight" | "none";
};

export function Section({ spacing = "default", className, children, ...rest }: SectionProps) {
  return (
    <section
      className={cn(
        "relative",
        spacing === "default" && "py-16 md:py-24 lg:py-[120px]",
        spacing === "tight" && "py-10 md:py-14 lg:py-[72px]",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

/** Mono caps label with the short rule in front */
export function Eyebrow({
  children,
  className,
  rule = false,
  tone = "accent",
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  rule?: boolean;
  tone?: "accent" | "fuchsia" | "subtle";
  as?: "p" | "span" | "div" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "label m-0 flex items-center gap-2.5",
        tone === "accent" && "text-accent",
        tone === "fuchsia" && "text-fuchsia",
        tone === "subtle" && "text-ink-subtle",
        className,
      )}
    >
      {rule && <span aria-hidden="true" className="h-px w-7 bg-current" />}
      {children}
    </Tag>
  );
}

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** A link shown at the end of the heading row on wide screens */
  action?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
  size?: "lg" | "md";
};

export function SectionHeading({ eyebrow, title, lead, action, id, as: H = "h2", className, size = "lg" }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10", className)}>
      <div className="flex max-w-[760px] flex-col gap-3.5">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <H
          id={id}
          className={cn(
            "display m-0 leading-[1.08]",
            size === "lg" ? "text-[28px] sm:text-4xl lg:text-[44px]" : "text-2xl sm:text-3xl lg:text-[34px]",
          )}
        >
          {title}
        </H>
        {lead && <p className="m-0 max-w-[620px] text-base leading-relaxed text-ink-muted md:text-[17px]">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
