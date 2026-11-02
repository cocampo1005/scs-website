import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useConsent } from "./useConsent";

/**
 * First-visit notice: a compact sheet on phones, a corner card on tablets and
 * a slim bottom bar on desktops; it never covers the page's controls. Accepting and rejecting are the same size and
 * style, one click each; nothing optional runs until one is pressed.
 */
export function CookieBanner() {
  const { acceptAll, rejectAll, openSettings, gpc } = useConsent();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Let keyboard and screen-reader users find the notice without hunting for it
  useEffect(() => {
    const t = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 150);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      role="dialog"
      aria-labelledby="cookie-banner-heading"
      aria-describedby="cookie-banner-text"
      data-testid="cookie-banner"
      // Phones: a compact sheet; tablets: a corner card; from 1024px a slim bar
      // along the bottom edge, below the hero's copy and controls
      className="fixed inset-x-0 bottom-0 z-[55] p-3 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[440px] sm:p-0 lg:left-1/2 lg:w-[min(1180px,calc(100vw-48px))] lg:-translate-x-1/2 motion-safe:animate-panel-in"
    >
      <div className="tile tile-feature relative overflow-hidden bg-[linear-gradient(180deg,rgb(27_21_41/0.98),rgb(14_10_22/0.98))] p-4 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur-md sm:p-6 lg:px-6 lg:py-4">
        <div aria-hidden="true" className="grid-motif absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_100%_0%,#000,transparent)]" />
        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex flex-col gap-1.5 lg:flex-1">
            <h2 ref={headingRef} id="cookie-banner-heading" tabIndex={-1} className="display m-0 text-base outline-none sm:text-xl lg:text-base">
              Your privacy choices
            </h2>
            <p id="cookie-banner-text" className="m-0 text-[13px] leading-relaxed text-ink-muted sm:text-sm">
              <span className="sm:hidden lg:inline xl:hidden">
                The site works without optional cookies. Google Ads conversion measurement stays off unless you accept it.
              </span>
              <span className="max-sm:hidden lg:hidden xl:inline">
                This site works without optional cookies. The one optional category is Google Ads conversion measurement,
                which tells us when an ad brought you here if you send a message. It stays off until you accept it.
              </span>
            </p>
            {gpc && (
              <p className="m-0 rounded-lg border border-line bg-white/[0.03] px-3 py-2 text-[13px] leading-relaxed text-ink-soft">
                Your browser sends a Global Privacy Control signal, so advertising cookies are treated as rejected unless
                you choose otherwise here.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2.5 lg:flex-row-reverse lg:items-center lg:gap-4">
            <div className="grid grid-cols-2 gap-2.5 lg:w-[300px]">
              <Button variant="secondary" size="sm" className="sm:min-h-12 lg:min-h-11" onClick={rejectAll}>
                Reject all
              </Button>
              <Button variant="secondary" size="sm" className="sm:min-h-12 lg:min-h-11" onClick={acceptAll}>
                Accept all
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] lg:flex-nowrap lg:justify-end">
              <button
                type="button"
                onClick={openSettings}
                className="min-h-9 cursor-pointer border-0 bg-transparent p-0 font-sans font-medium text-link underline underline-offset-4 hover:text-white"
              >
                Customize
              </button>
              <Link to="/privacy" className="inline-flex min-h-9 items-center whitespace-nowrap text-ink-subtle hover:text-white">
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
