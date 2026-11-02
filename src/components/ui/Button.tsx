import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "quiet";
export type ButtonSize = "md" | "sm";

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-[var(--radius-control)] font-sans font-semibold whitespace-nowrap no-underline transition-[filter,border-color,background-color] duration-150 ease-[var(--ease-out)] disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  // gradient-brand: primary CTA only. Hover lifts brightness 12%, no scaling.
  primary:
    "bg-[linear-gradient(100deg,var(--color-fuchsia-strong),var(--color-violet-strong))] text-white shadow-[0_10px_30px_-10px_rgb(192_38_211/0.6)] hover:brightness-112",
  secondary:
    "border border-line-strong bg-white/[0.03] text-ink hover:border-accent/50 hover:bg-white/[0.06]",
  quiet:
    "border border-line-strong bg-white/[0.04] text-ink hover:bg-white/[0.08]",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-12 px-6 text-[15px] md:min-h-[50px]",
  sm: "min-h-11 px-4 text-sm",
};

function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant, size, className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />;
}

type LinkButtonProps = {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** External links open in a new tab */
  external?: boolean;
};

export function LinkButton({ to, variant, size, className, children, external }: LinkButtonProps) {
  const classes = buttonClass(variant, size, className);
  if (external || /^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a href={to} className={classes} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
