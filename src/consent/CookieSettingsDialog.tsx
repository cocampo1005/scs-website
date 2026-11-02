import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../components/ui/cn";
import { CONSENT_MAX_AGE_DAYS } from "./consent";
import { useConsent } from "./useConsent";

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Switch({ id, checked, disabled, onChange, label }: { id: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 motion-reduce:transition-none disabled:cursor-not-allowed",
        checked ? "border-transparent bg-[linear-gradient(90deg,var(--color-fuchsia-strong),var(--color-violet-strong))]" : "border-line-strong bg-white/[0.06]",
        disabled && "opacity-70",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute top-0.5 size-[22px] rounded-full bg-white shadow transition-transform duration-200 motion-reduce:transition-none", checked ? "translate-x-[22px]" : "translate-x-0.5")}
      />
    </button>
  );
}

/**
 * Modal settings: each category with what it stores and for how long, a
 * switch for the optional one, and Save / Accept all / Reject all. Focus is
 * trapped while open, Escape closes, and focus returns to the opener.
 */
export function CookieSettingsDialog({ onClose }: { onClose: () => void }) {
  const { consent, save, gpc } = useConsent();
  const [advertising, setAdvertising] = useState(Boolean(consent?.advertising));
  const dialogRef = useRef<HTMLDivElement>(null);
  const base = useId();

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("h2")?.focus(), 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const decided = consent ? new Date(consent.decidedAt) : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-bg/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${base}-title`}
        aria-describedby={`${base}-desc`}
        data-testid="cookie-settings"
        onKeyDown={onKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="tile tile-feature relative max-h-[92svh] w-full max-w-[640px] overflow-y-auto rounded-b-none bg-[linear-gradient(180deg,rgb(27_21_41/0.99),rgb(14_10_22/0.99))] sm:rounded-b-[var(--radius-tile)] motion-safe:animate-panel-in"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cookie settings"
          className="absolute top-4 right-4 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-bg/60 text-ink-soft transition-colors hover:border-focus/60 hover:text-white"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="flex flex-col gap-5 p-5 sm:p-8">
          <div className="flex flex-col gap-2 pr-12">
            <p className="label m-0 text-fuchsia">Cookie settings</p>
            <h2 id={`${base}-title`} tabIndex={-1} className="display m-0 text-[24px] outline-none sm:text-[28px]">
              Choose what this site may store
            </h2>
            <p id={`${base}-desc`} className="m-0 text-sm leading-relaxed text-ink-muted">
              Nothing optional runs until you turn it on. You can change or withdraw your choice at any time from
              “Cookie settings” in the footer. A choice is kept in this browser for {Math.round(CONSENT_MAX_AGE_DAYS / 30)} months, then we ask again.
              {decided && <> Your current choice is from {decided.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.</>}
            </p>
          </div>

          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li className="tile flex items-start justify-between gap-4 p-4 sm:p-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${base}-necessary`} className="display text-base sm:text-lg">
                  Strictly necessary <span className="label ml-2 text-ink-subtle">Always on</span>
                </label>
                <p className="m-0 text-[13px] leading-relaxed text-ink-muted">
                  What the site needs to work: this cookie choice (<code className="font-mono text-ink-soft">scs:consent</code>, in local
                  storage) and the homepage puzzle’s solved state for the current tab session. No tracking, no third parties.
                </p>
              </div>
              <Switch id={`${base}-necessary`} checked disabled label="Strictly necessary, always on" />
            </li>
            <li className="tile flex items-start justify-between gap-4 p-4 sm:p-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${base}-advertising`} className="display text-base sm:text-lg">
                  Advertising measurement
                </label>
                <p className="m-0 text-[13px] leading-relaxed text-ink-muted">
                  Google Ads conversion measurement, so we can tell which ads lead to inquiries. Turning it on loads Google’s
                  tag and lets Google set cookies such as <code className="font-mono text-ink-soft">_gcl_au</code>; ad personalization stays
                  off. Provider: Google LLC, see{" "}
                  <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-link underline underline-offset-2 hover:text-white">
                    how Google uses this data
                  </a>
                  .
                </p>
                {gpc && (
                  <p className="m-0 text-[13px] leading-relaxed text-ink-soft">
                    Your browser’s Global Privacy Control signal is on; this stays off unless you turn it on yourself.
                  </p>
                )}
              </div>
              <Switch id={`${base}-advertising`} checked={advertising} onChange={setAdvertising} label="Advertising measurement" />
            </li>
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-2.5 sm:flex">
              <Button variant="secondary" onClick={() => save({ advertising: false })}>
                Reject all
              </Button>
              <Button variant="secondary" onClick={() => save({ advertising: true })}>
                Accept all
              </Button>
            </div>
            <Button onClick={() => save({ advertising })}>Save preferences</Button>
          </div>
          <p className="m-0 text-[13px] text-ink-subtle">
            Details in the{" "}
            <Link to="/privacy" onClick={onClose} className="text-link underline underline-offset-2 hover:text-white">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
