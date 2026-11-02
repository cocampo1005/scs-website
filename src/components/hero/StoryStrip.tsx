import { cn } from "../ui/cn";

const STEPS = [
  { label: "Input", text: "Sheets, forms, messages" },
  { label: "Process", text: "Your workflow, mapped" },
  { label: "Software", text: "One system that fits" },
] as const;

/** "Input → Process → Software": a thin, non-interactive band at the bottom of the hero */
export function StoryStrip({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <div
      role="group"
      aria-label="How a fitted solution comes together"
      data-lit={lit}
      className={cn(
        "story grid grid-cols-[1fr_14px_1fr_14px_1fr] items-center gap-1 border-t border-line pt-4 sm:gap-3.5 lg:grid-cols-[auto_auto_1fr_auto_1fr_auto] lg:px-5 lg:pt-0",
        "lg:h-14",
        className,
      )}
    >
      <span className="label hidden text-ink-subtle lg:inline">How it fits</span>
      {STEPS.map((step, i) => (
        <StepItem key={step.label} index={i} {...step} />
      ))}
    </div>
  );
}

function StepItem({ label, text, index }: { label: string; text: string; index: number }) {
  const delay = index === 1 ? "s2" : index === 2 ? "s3" : "";
  return (
    <>
      {index > 0 && <span aria-hidden="true" className={cn("story-wire h-px", delay)} />}
      <span
        className={cn(
          "story-step flex min-w-0 items-center gap-2.5 text-[11px] leading-tight sm:text-[13px]",
          "max-lg:flex-col max-lg:items-start max-lg:gap-1 max-lg:rounded-xl max-lg:border max-lg:border-line max-lg:bg-surface-deep max-lg:p-2 sm:max-lg:p-3",
          delay,
        )}
      >
        <span aria-hidden="true" className={cn("story-dot hidden size-2 shrink-0 rounded-[2px] lg:inline-block", index === 2 && "hot")} />
        <span className={cn("label text-[9px] sm:text-[10px]", index === 2 ? "text-fuchsia" : "text-ink-subtle")}>{label}</span>
        <span className="text-ink-muted lg:text-ink">
          <span className="sr-only">: </span>
          {text}
        </span>
      </span>
    </>
  );
}
