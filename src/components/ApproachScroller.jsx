import { useEffect, useMemo, useRef, useState } from "react";
import GlowCard from "./GlowCard";

export default function ApproachScroller() {
  const steps = useMemo(
    () => [
      {
        n: "01",
        title: "Discover",
        copy: "We map goals, users, and constraints to define success.",
      },
      {
        n: "02",
        title: "Design",
        copy: "We prototype flows and interfaces that feel natural.",
      },
      {
        n: "03",
        title: "Build",
        copy: "We write clean, efficient code that’s tested and built to last.",
      },
      {
        n: "04",
        title: "Launch",
        copy: "We deploy, monitor, and resolve issues quickly.",
      },
      {
        n: "05",
        title: "Improve",
        copy: "We iterate based on data and real feedback.",
      },
    ],
    []
  );

  const [active, setActive] = useState(0);

  // --- Media query to know which layout is live ---
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  // --- DESKTOP tracking (same as yours) ---
  const desktopSectionRef = useRef(null);
  useEffect(() => {
    if (!isDesktop) return; // only run on desktop

    const handleScroll = () => {
      const section = desktopSectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * 0.7;
      const end = windowHeight * 0.6;

      if (rect.top <= start && rect.bottom >= end) {
        const progress = (start - rect.top) / (rect.height - (start - end));
        const clamped = Math.max(0, Math.min(1, progress || 0));
        const slowFactor = 0.6;
        const idx = Math.min(
          steps.length - 1,
          Math.floor(clamped * steps.length * slowFactor)
        );
        setActive(idx);
      } else if (rect.bottom < end) {
        setActive(steps.length - 1);
      } else if (rect.top > start) {
        setActive(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop, steps.length]);

  // --- MOBILE tracking: observe each step and pick the most visible one ---
  const mobileItemRefs = useRef([]);
  useEffect(() => {
    if (isDesktop) return; // only run on mobile

    // Clear existing refs on layout change
    mobileItemRefs.current = mobileItemRefs.current.slice(0, steps.length);

    const ratios = new Map(); // node -> intersectionRatio
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }
        // choose the highest ratio (most visible card)
        let bestIdx = 0;
        let bestRatio = -1;
        mobileItemRefs.current.forEach((el, i) => {
          const r = ratios.get(el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIdx = i;
          }
        });
        setActive(bestIdx);
      },
      {
        // focus on the middle-ish area of the viewport for nicer feel
        root: null,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10), // 0..1 by .1
        rootMargin: "-20% 0% -20% 0%", // shrink top/bottom to prefer center
      }
    );

    mobileItemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isDesktop, steps.length]);

  return (
    <>
      {/* Desktop: Horizontal sticky layout with spacers */}
      <div className="hidden md:block">
        <div ref={desktopSectionRef} className="relative">
          <div className="sticky top-20 py-12">
            {/* Progress line */}
            <div className="absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-900/30 via-fuchsia-900/30 to-purple-900/30">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${(active / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-5 gap-4">
              {steps.map((s, i) => (
                <div key={s.n} className="flex flex-col items-center">
                  {/* Number badge */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold mb-6 transition-all duration-500 ${
                      active >= i
                        ? "bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/50 scale-110"
                        : "bg-gray-800 text-gray-500 ring-1 ring-gray-700"
                    }`}
                  >
                    {s.n}
                  </div>

                  {/* Card */}
                  <GlowCard
                    className={`p-6 text-center transition-all duration-500 h-full ${
                      active === i
                        ? "ring-2 ring-fuchsia-400/70 shadow-xl shadow-fuchsia-500/25 scale-105"
                        : active > i
                        ? "ring-1 ring-fuchsia-400/40 shadow-md shadow-fuchsia-500/10 opacity-100"
                        : "opacity-40"
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-fuchsia-100 mb-3">
                      {s.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {s.copy}
                    </p>
                  </GlowCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Layout */}
      <div className="md:hidden space-y-12">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="relative"
            ref={(el) => (mobileItemRefs.current[i] = el)}
          >
            {/* Connecting line */}
            {i < steps.length - 1 && (
              <div
                className={`absolute left-6 top-12 bottom-0 w-[2px] transition-all duration-500 ${
                  active > i
                    ? "bg-gradient-to-b from-fuchsia-500 to-purple-600"
                    : "bg-gray-800"
                }`}
              />
            )}

            <div className="flex gap-4 relative">
              {/* Number badge */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 transition-all duration-500 ${
                  active >= i
                    ? "bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/50"
                    : "bg-gray-800 text-gray-500 ring-1 ring-gray-700"
                }`}
              >
                {s.n}
              </div>

              {/* Card */}
              <GlowCard
                className={`flex-1 p-5 transition-all duration-500 ${
                  active === i
                    ? "ring-2 ring-fuchsia-400/70 shadow-xl shadow-fuchsia-500/25 scale-[1.02]"
                    : active > i
                    ? "ring-1 ring-fuchsia-400/40 shadow-md shadow-fuchsia-500/10 opacity-100"
                    : "opacity-50"
                }`}
              >
                <h3 className="text-xl font-bold text-fuchsia-100 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {s.copy}
                </p>
              </GlowCard>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
