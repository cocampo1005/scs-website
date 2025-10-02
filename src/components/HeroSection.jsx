import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const Spline = lazy(() => import("@splinetool/react-spline"));
import HexagonLoader from "./HexagonLoader";
import { useSplineHero } from "../hooks/useSplineHero";

export default function HeroSection() {
  const { containerRef, ready, showUI, handleLoad, skipPuzzle } =
    useSplineHero();

  return (
    <section className="relative h-[100svh] md:min-h-[800px] overflow-hidden flex flex-col items-center justify-start pt-[10svh] md:pt-[clamp(10vh,18vh,24vh)]">
      {/* Spline background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          ref={containerRef}
          className={`h-full w-full spline-wrap overscroll-contain select-none ${
            showUI ? "touch-auto" : "touch-none"
          }`}
        >
          <Suspense fallback={null}>
            <Spline
              scene="https://prod.spline.design/7sWk3IF3iLADtCBs/scene.splinecode"
              onLoad={handleLoad}
              renderOnDemand
            />
          </Suspense>

          {/* Loader overlay */}
          <HexagonLoader ready={ready} />
        </div>
      </div>

      {/* Skip puzzle button for accessibility */}
      <button
        onClick={skipPuzzle}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-fuchsia focus:text-white focus:rounded-lg focus:font-semibold"
        aria-label="Skip interactive puzzle and view main content"
      >
        Skip to Main Content
      </button>

      {/* Pre-solve headline - Problem Question */}
      <div className="relative text-center max-w-5xl p-4 z-10">
        <div className={showUI ? "hidden" : "block"}>
          <h2 className="font-logo text-2xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-200 to-purple-300 bg-clip-text text-transparent">
            Can't Seem to Find a Digital Solution That Really Fits?
          </h2>
        </div>

        {/* Post-solve content - main H1 for SEO */}
        <div
          className={`transition-opacity duration-700 delay-100 ${
            showUI ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
        >
          <h1 className="font-logo text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent">
            The Missing Piece to Your Digital Solution
          </h1>
          <p className="font-sans text-lg md:text-xl text-gray-light mb-8 max-w-3xl mx-auto">
            Solid Code Solutions builds tailored websites and web applications
            that click into place for your brand, your users, and your goals.
          </p>
          <nav
            className="flex flex-nowrap text-sm md:text-lg gap-4 md:gap-10 justify-center"
            aria-label="Primary navigation"
          >
            <Link to="/contact" className="btn-primary">
              Start Your Project
            </Link>

            <Link to="/projects" className="btn-secondary">
              View Our Work
            </Link>
          </nav>
        </div>
      </div>

      {/* Scroll indicator */}
      {showUI && (
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("services");
            if (el) {
              const y =
                el.getBoundingClientRect().top + window.pageYOffset - 80;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }}
          className="absolute bottom-8 animate-bounce cursor-pointer"
          aria-label="Scroll to services"
        >
          <div className="w-6 h-10 border-2 border-accent-purple rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-accent-purple rounded-full mt-2"></div>
          </div>
        </button>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[10vh] z-10
                  bg-gradient-to-t from-primary-dark-purple via-primary-dark-purple/50 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
