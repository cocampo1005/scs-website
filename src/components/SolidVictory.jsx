import { RotateCcw } from "lucide-react";
import { ArrowIcon, Button, LinkButton } from "./ui/Button";
import "./solid-victory.css";

/**
 * Arcade-style "stage clear" over the board when the wall is complete. Purely
 * decorative (the board itself is aria-hidden); the accessible payoff is the
 * SolidVictoryCta below the board.
 */
export function SolidVictoryBanner({ show }) {
  if (!show) return null;
  return (
    <div aria-hidden="true" className="victory pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[var(--radius-tile)]">
      <div className="victory-scanlines absolute inset-0" />
      <div className="victory-flash absolute inset-0" />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <p className="victory-blink label m-0 text-[13px] text-fuchsia sm:text-sm">Stage clear</p>
        <p className="victory-title display m-0 text-[44px] leading-none text-white sm:text-[72px] lg:text-[88px]">That’s SOLID.</p>
        <p className="victory-sub label m-0 text-ink-soft">7 / 7 pieces · structure stable</p>
      </div>
    </div>
  );
}

/** The payoff below the board: the win message, and the invitation it sets up */
export function SolidVictoryCta({ onReset }) {
  return (
    <section
      role="status"
      aria-labelledby="victory-heading"
      className="victory-cta tile tile-feature relative mt-6 overflow-hidden motion-safe:animate-reveal"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(520px_240px_at_80%_0%,rgb(192_38_211/0.3),transparent_70%),radial-gradient(400px_220px_at_10%_100%,rgb(124_58_237/0.3),transparent_70%)]" />
      <div aria-hidden="true" className="grid-motif absolute inset-0 opacity-50 [mask-image:linear-gradient(90deg,transparent,#000_40%,#000_60%,transparent)]" />
      <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:p-10">
        <div className="flex flex-col gap-3 lg:col-span-8">
          <p className="label m-0 text-fuchsia">Stage clear · 7 / 7 pieces</p>
          <h3 id="victory-heading" className="display m-0 text-[26px] leading-[1.1] sm:text-[32px]">
            That’s SOLID. Now imagine your software built the same way.
          </h3>
          <p className="m-0 max-w-[600px] text-[15px] leading-relaxed text-ink-muted sm:text-base">
            Every piece had a place and the wall held. That's how we build business applications: well-made parts
            that fit together and stay dependable as your business grows. Ready for the next level?
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-4">
          <LinkButton to="/contact">
            Press start on your project <ArrowIcon />
          </LinkButton>
          <Button variant="secondary" onClick={onReset}>
            <RotateCcw className="size-4" aria-hidden="true" /> Play again
          </Button>
        </div>
      </div>
    </section>
  );
}
