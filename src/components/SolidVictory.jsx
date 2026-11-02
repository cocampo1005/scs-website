import { RotateCcw, X } from "lucide-react";
import { ArrowIcon, Button, LinkButton } from "./ui/Button";
import "./solid-victory.css";

/**
 * Arcade-style "stage clear" over the board when the wall is complete. Purely
 * decorative (the board itself is aria-hidden); it hands over to the card.
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

/**
 * The payoff once the banner has faded: the win message and the invitation it
 * sets up. On tablets and desktops it sits at the foot of the board with the
 * finished wall glowing above it; on phones (`inline`), where the solved board
 * is short, it follows the board in the flow. `animated` delays it behind the
 * banner; without it (reduced motion) it appears at once.
 */
export function SolidVictoryCard({ animated, inline, onReset, onDismiss }) {
  return (
    <div
      className={`victory-card-wrap ${inline ? "relative mt-4" : "absolute inset-0 flex items-end justify-center p-4 sm:p-6"} ${animated ? "victory-card-wrap-animated" : ""}`}
    >
      {!inline && (
        <div aria-hidden="true" className="absolute inset-0 rounded-[var(--radius-tile)] bg-[linear-gradient(180deg,transparent_30%,rgb(8_6_13/0.9)_100%)]" />
      )}
      <section
        role="status"
        aria-labelledby="victory-heading"
        className={`victory-card tile tile-feature relative w-full overflow-hidden ${inline ? "" : "max-w-[600px]"}`}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(420px_220px_at_85%_0%,rgb(192_38_211/0.32),transparent_70%),radial-gradient(360px_200px_at_5%_100%,rgb(124_58_237/0.3),transparent_70%)]" />
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Show the finished wall"
          className="absolute top-3 right-3 z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-bg/60 text-ink-soft transition-colors hover:border-focus/60 hover:text-white"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
        <div className="relative flex flex-col gap-4 p-5 pr-14 sm:p-8">
          <p className="label m-0 text-fuchsia">Stage clear · 7 / 7 pieces</p>
          <h3 id="victory-heading" className="display m-0 text-[24px] leading-[1.1] sm:text-[30px]">
            That’s SOLID. Now imagine your software built the same way.
          </h3>
          <p className="m-0 text-[15px] leading-relaxed text-ink-muted sm:text-base">
            Every piece had a place and the wall held. That's how we build business applications: well-made parts
            that fit together and stay dependable as your business grows. Ready for the next level?
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <LinkButton to="/contact">
              Press start on your project <ArrowIcon />
            </LinkButton>
            <Button variant="secondary" onClick={onReset}>
              <RotateCcw className="size-4" aria-hidden="true" /> Play again
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Once the card is dismissed: a slim reminder under the board, so the invitation stays */
export function SolidVictoryBar({ onReset }) {
  return (
    <div role="status" className="tile tile-open mt-4 flex flex-col gap-3 px-4 py-3 motion-safe:animate-panel-in sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="m-0 text-sm text-ink-muted">
        <span className="label text-fuchsia">Stage clear</span>
        <span className="mx-2 text-ink-subtle" aria-hidden="true">
          ·
        </span>
        That’s SOLID. Want software built the same way?
      </p>
      <div className="flex items-center gap-3">
        <LinkButton to="/contact" size="sm">
          Press start on your project <ArrowIcon className="size-3.5" />
        </LinkButton>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 border-0 bg-transparent px-1 font-sans text-sm font-medium text-ink-soft hover:text-white"
        >
          <RotateCcw className="size-4" aria-hidden="true" /> Play again
        </button>
      </div>
    </div>
  );
}
