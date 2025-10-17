import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import ctaBG from "../assets/images/cta-bg1.webp";
import Reveal from "./Reveal";

export default function CTASection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Cursor spotlight across the whole section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // CSS variables for spotlight + tilt math
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [prefersReducedMotion]);

  // Lightweight tilt for the callout card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (prefersReducedMotion) return;

    let raf = 0;
    let running = false;

    // current smoothed rotation
    let cx = 0; // rotateY
    let cy = 0; // rotateX

    // target rotation
    let tx = 0;
    let ty = 0;

    const MAX = 8; // max degrees of tilt
    const SMOOTH = 0.12; // 0..1 (higher = snappier)
    const EPS = 0.01;

    const updateTargetFromMouse = (e) => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width; // 0..1
      const ny = (e.clientY - r.top) / r.height; // 0..1
      // map to -MAX..MAX, with X/Y swapped for intuitive pitch/yaw
      tx = (nx - 0.5) * (MAX * 2); // rotateY
      ty = (0.5 - ny) * (MAX * 2); // rotateX
      start();
    };

    const animate = () => {
      // lerp toward target
      cx += (tx - cx) * SMOOTH;
      cy += (ty - cy) * SMOOTH;

      card.style.transform = `perspective(800px) rotateX(${cy.toFixed(
        3
      )}deg) rotateY(${cx.toFixed(3)}deg) translateZ(0)`;

      if (Math.abs(tx - cx) > EPS || Math.abs(ty - cy) > EPS) {
        raf = requestAnimationFrame(animate);
      } else {
        running = false;
        raf = 0;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      // ease back to flat
      tx = 0;
      ty = 0;
      start();
    };

    card.addEventListener("mousemove", updateTargetFromMouse);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mousemove", updateTargetFromMouse);
      card.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-16 px-8 bg-primary-dark-purple bg-center bg-cover"
      aria-labelledby="cta-heading"
      style={{
        backgroundImage: `url(${ctaBG})`,
        backgroundPosition: `center calc(50% + var(--bgY, 0px))`,
      }}
    >
      {/* Dark overlay for readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-primary-dark-purple/60 z-[1]"
      />

      {/* Top fade */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary-dark-purple to-transparent z-[3]"
        aria-hidden="true"
      />

      {/* Cursor spotlight (GPU-friendly radial; no JS animation loop) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(217,70,239,0.18), transparent 40%)",
          transition: prefersReducedMotion ? "none" : "background 120ms linear",
        }}
      />

      <div className="relative z-[4] max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-6 items-stretch">
          {/* Left rail copy */}
          <div className="md:col-span-3">
            <Reveal
              as="h2"
              y={6}
              duration={450}
              id="cta-heading"
              className="text-4xl md:text-5xl font-bold font-logo bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent mb-6"
            >
              Custom Solutions. <br />
              Solid Results.
            </Reveal>
            <Reveal
              as="p"
              delay={120}
              y={4}
              duration={450}
              className="text-lg md:text-xl text-white/80 max-w-prose mb-0"
            >
              Partner with Solid Code Solutions for tailor-made software and
              websites that streamline operations and strengthen your online
              presence.
            </Reveal>
          </div>

          {/* Callout card */}
          <div
            ref={cardRef}
            className="md:col-span-2 relative rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-cyan-400/10 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.04)] will-change-transform"
          >
            {/* subtle outer ring */}
            <div
              className="absolute -inset-px rounded-2xl pointer-events-none opacity-70"
              style={{
                background:
                  "radial-gradient(600px circle at 50% -20%, rgba(168,85,247,.25), transparent 35%), radial-gradient(400px circle at 100% 120%, rgba(34,211,238,.18), transparent 40%)",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                padding: 1,
              }}
            />

            <div className="relative p-6 md:p-8 flex flex-col h-full gap-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Let’s scope your project
                </h3>
                <p className="text-white/75">
                  We’ll map your goals, budget, and timeline and propose a
                  right-sized plan. No boilerplate. No fluff.
                </p>
              </div>

              <Link
                to="/contact"
                className="btn-primary"
                aria-label="Go to contact page to start your project"
              >
                Get A Free Quote
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              {/* Professional microcopy */}
              <p className="text-xs text-white/60 mb-0">
                Avg response within 24 hours · NDA available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
