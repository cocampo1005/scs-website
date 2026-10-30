import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import GlowCard from "./GlowCard";

// Letter tile for a principle; the brand mark for the logo piece (its 3D Logo
// Cube pops out on the board itself while this piece's info is open).
function PieceBadge({ piece, className = "" }) {
  if (piece.letter === null) {
    return <img src="/scs-logo-small.svg" alt="" className={`object-contain ${className}`} />;
  }
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center rounded-2xl font-logo font-bold text-white shadow-lg ${className}`}
      style={{
        background: `linear-gradient(145deg, ${piece.color}, color-mix(in oklab, ${piece.color}, black 35%))`,
        boxShadow: `0 10px 30px -8px ${piece.color}99`,
      }}
    >
      {piece.letter}
    </div>
  );
}

// Desktop: the one shared information panel, in the column beside the board.
// It shows the selected piece (or a prompt when nothing is open). The wrapper
// is a polite live region so screen readers hear each piece's text when it
// opens.
export default function SolidInfoPanel({ piece, hasPlaced, onClose }) {
  return (
    <section aria-label="Piece information">
      <GlowCard className="p-5 min-h-[17rem]">
        <div aria-live="polite" aria-atomic="true">
          {piece ? (
            <article key={piece.id} className="animate-panel-in">
              <div className="flex items-center gap-4 pr-8">
                <PieceBadge piece={piece} className="h-14 w-14 shrink-0 text-3xl" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-purple-light">
                    {piece.kicker}
                  </p>
                  <h3 className="mt-0.5 font-display text-xl xl:text-2xl font-bold leading-tight text-accent-fuchsia-light">
                    {piece.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-gray-200 leading-relaxed">{piece.description}</p>
              {piece.detail && (
                <p className="mt-3 border-l-2 border-accent-fuchsia/50 pl-3 text-sm text-gray-400 leading-relaxed">
                  {piece.detail}
                </p>
              )}

              <button
                type="button"
                onClick={onClose}
                className="absolute right-0 top-0 rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-accent-fuchsia transition-colors"
                aria-label={`Hide ${piece.title} information`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </article>
          ) : (
            <p className="animate-panel-in flex min-h-[14rem] items-center justify-center px-4 text-center text-gray-400">
              {hasPlaced
                ? "Click a placed piece on the board to see what it stands for."
                : "Place a piece to reveal what it stands for."}
            </p>
          )}
        </div>
      </GlowCard>
    </section>
  );
}

// The supporting definition, collapsed behind "More" in the compact sheet
function SheetDetail({ detail }) {
  const [open, setOpen] = useState(false);
  if (!detail) return null;
  return (
    <>
      {open && (
        <p className="mt-2 border-l-2 border-accent-fuchsia/50 pl-3 text-[0.8125rem] leading-relaxed text-gray-400">
          {detail}
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-1.5 text-xs font-semibold text-accent-fuchsia-light hover:text-white focus-visible:outline-2 focus-visible:outline-accent-fuchsia rounded"
      >
        {open ? "Less" : "More about this principle"}
      </button>
    </>
  );
}

// Mobile: a compact bottom sheet over the page, so the board stays in view.
// It never moves the page or changes layout. Portalled to <body> because the
// page's reveal animations put transforms on ancestors, which would otherwise
// pin a fixed element to the section instead of the screen. `minimized` shrinks it to a
// one-line bar (it does this on its own while a piece is being dragged); swiping
// the handle down minimizes, and again closes.
export function SolidInfoSheet({ piece, show, minimized, onMinimize, onExpand, onClose }) {
  const swipe = useRef(null);
  const visible = show && !!piece;

  const onPointerDown = (e) => {
    swipe.current = { y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dy = e.clientY - start.y;
    if (dy > 36) (minimized ? onClose : onMinimize)();
    else if (dy < -36 && minimized) onExpand();
  };

  return createPortal(
    <>
      {/* Announce each newly opened piece, whatever state the sheet is in */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {piece ? `${piece.title}. ${piece.description}` : ""}
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          visible ? "translate-y-0" : "pointer-events-none translate-y-[calc(100%+1rem)]"
        }`}
        aria-hidden={!visible}
        inert={!visible}
      >
        {piece && (
          <section
            aria-label="Piece information"
            className="mx-auto max-w-md overflow-hidden rounded-2xl border border-accent-fuchsia-dark/40 bg-[#1b0b2e]/95 shadow-[0_-12px_40px_-12px_rgba(217,70,239,0.45)] backdrop-blur-md"
          >
            {/* Handle + header: swipe target */}
            <div
              className="touch-none select-none px-3.5 pt-2"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipe.current = null)}
            >
              <div className="mx-auto h-1 w-10 rounded-full bg-white/25" aria-hidden="true" />
              <div key={piece.id} className="animate-panel-in flex items-center gap-3 py-2">
                <PieceBadge piece={piece} className="h-10 w-10 shrink-0 text-2xl rounded-xl" />
                <button
                  type="button"
                  onClick={minimized ? onExpand : onMinimize}
                  aria-expanded={!minimized}
                  className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-accent-fuchsia rounded"
                >
                  <span className="block truncate text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent-purple-light">
                    {piece.kicker}
                  </span>
                  <span className="block truncate font-display text-lg font-bold leading-tight text-accent-fuchsia-light">
                    {piece.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={minimized ? onExpand : onMinimize}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-accent-fuchsia"
                  aria-label={minimized ? "Show description" : "Minimize description"}
                >
                  {minimized ? (
                    <ChevronUp className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-accent-fuchsia"
                  aria-label={`Hide ${piece.title} information`}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {!minimized && (
              <div key={piece.id} className="max-h-[40svh] overflow-y-auto px-3.5 pb-3.5">
                <p className="text-sm leading-relaxed text-gray-200">{piece.description}</p>
                <SheetDetail detail={piece.detail} />
              </div>
            )}
          </section>
        )}
      </div>
    </>,
    document.body,
  );
}
