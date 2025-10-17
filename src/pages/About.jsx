import Reveal, { Stagger } from "../components/Reveal";
import GlowCard from "../components/GlowCard";
import CTASection from "../components/CTASection";

// Assets
import heroImg from "../assets/images/stacked-blocks.webp";
import fitImg from "../assets/images/hex-tesselation-fit.webp";

// Icons
import { ArrowBigDown } from "lucide-react";

// Spline
import { lazy, Suspense } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));
import CubeLoader from "../components/CubeLoader";
import { useSplineSimple } from "../hooks/useSplineSimple";
import { CountOnReveal } from "../utils/Counter";
import MissionVisionTabs from "../components/MissionVisionTabs";
import ApproachScroller from "../components/ApproachScroller";
import ValuesGrid from "../components/ValuesGrid";

export default function About() {
  const { ready, handleLoad, handleWheelCapture } = useSplineSimple();

  return (
    <div className="min-h-screen text-white">
      {/* Hero with CTA style background */}
      <section
        className="relative overflow-hidden py-40 md:py-50 px-6 bg-primary-dark-purple bg-center bg-cover"
        aria-labelledby="about-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-primary-dark-purple/80 md:bg-primary-dark-purple/60"
        />
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-primary-dark-purple to-transparent"
        />
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-primary-dark-purple to-transparent"
        />

        <div className="relative z-[1] max-w-6xl mx-auto text-center">
          <Stagger>
            <Reveal
              as="h1"
              id="about-hero"
              className="font-logo text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
            >
              About Solid Code Solutions
            </Reveal>
            <Reveal
              as="p"
              className="md:text-xl text-gray-200 max-w-3xl mx-auto"
            >
              Tailor made software and websites that click into place for your
              goals and your users.
            </Reveal>
          </Stagger>
        </div>
      </section>

      {/* Mission Vision as tabs */}
      <section className="max-w-6xl mx-auto px-6 mt-14 grid md:grid-cols-2 gap-6">
        <MissionVisionTabs />
        <GlowCard>
          <Stagger>
            <Reveal
              as="h2"
              className="text-2xl md:text-3xl font-display font-bold text-accent-fuchsia-light"
            >
              What We Stand For
            </Reveal>
            <Reveal as="p" className="text-gray-300">
              We solve real-world problems with solutions that fit just right —
              clear strategy, clean engineering, and an eye for design. Every
              project is a collaboration built on purpose and precision, where
              thoughtful technology turns ideas into lasting impact.
            </Reveal>
          </Stagger>
        </GlowCard>
      </section>

      {/* At a Glance with animated counters */}
      <section className="max-w-6xl mx-auto px-6 mt-12 mb-20">
        <Stagger gap={120} startAt={40}>
          <Reveal
            as="h2"
            className="text-4xl md:text-5xl font-bold font-logo text-center mb-10 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
          >
            At a Glance
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Reveal>
              <GlowCard className="text-center py-8">
                <CountOnReveal
                  value={15}
                  delay={200}
                  className="text-4xl font-bold text-fuchsia-200"
                />
                <span className="text-4xl font-bold text-fuchsia-200 pl-1">
                  +
                </span>
                <div className="text-sm text-gray-300 mt-1">
                  Industries served
                </div>
              </GlowCard>
            </Reveal>

            <Reveal>
              <GlowCard className="text-center py-8">
                <CountOnReveal
                  value={4}
                  delay={200}
                  className="text-4xl font-bold text-fuchsia-200"
                />
                <span className="ml-1 text-4xl font-bold text-fuchsia-200">
                  -
                </span>
                <CountOnReveal
                  value={12}
                  delay={200}
                  className="text-4xl font-bold text-fuchsia-200"
                />
                <div className="text-sm text-gray-300 mt-1">Week timeline</div>
              </GlowCard>
            </Reveal>

            <Reveal>
              <GlowCard className="text-center py-8">
                <CountOnReveal
                  value={100}
                  delay={200}
                  className="text-4xl font-bold text-fuchsia-200"
                />
                <span className="text-2xl align-top text-fuchsia-200">%</span>
                <div className="text-sm text-gray-300 mt-1">Custom builds</div>
              </GlowCard>
            </Reveal>

            <Reveal>
              <GlowCard className="text-center py-8">
                <CountOnReveal
                  value={24}
                  delay={200}
                  className="text-4xl font-bold text-fuchsia-200"
                />
                <span className="text-2xl font-bold text-fuchsia-200 pl-1">
                  hr
                </span>
                <div className="text-sm text-gray-300 mt-1">
                  Avg response time
                </div>
              </GlowCard>
            </Reveal>
          </div>
        </Stagger>
      </section>

      {/* Built To Fit with image overlay */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        {/* One container = one border for both parts */}
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-purple-500/30">
          {/* Top: image with overlay */}
          <div className="relative">
            <img
              src={fitImg}
              alt="Hexagonal tessellation that fits together"
              className="w-full h-72 md:h-[500px] object-cover object-bottom"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-primary-dark-purple/80 via-primary-dark-purple/30 to-transparent"
            />
            {/* Right-aligned title + subheading */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <div className="ml-auto max-w-[42rem] text-right">
                <h3 className="text-3xl md:text-5xl font-logo font-bold text-fuchsia-100">
                  Built To Fit
                </h3>
                <p className="text-gray-200 mt-1">
                  Your needs, your users, your stack. We make the pieces click.
                </p>
              </div>
            </div>
          </div>

          {/* Divider line inside same border */}
          <div className="border-t border-purple-500/30" />

          {/* Bottom: Our Story (still inside the same container/border) */}
          <GlowCard className="p-0 rounded-t-none rounded-b-3xl bg-transparent ring-0 shadow-none">
            <Stagger>
              <Reveal
                as="h2"
                className="text-3xl font-display font-bold mb-4 text-accent-fuchsia-light"
              >
                Our Story
              </Reveal>
              <Reveal as="p" className="text-gray-300 leading-relaxed mb-3">
                Solid Code Solutions began with a simple goal — to turn complex
                ideas into tools people genuinely love to use. Whether it’s a
                web experience or a full-scale software platform, we bridge
                creativity and functionality through clean engineering,
                thoughtful design, and strategic thinking.
              </Reveal>
              <Reveal as="p" className="text-gray-300 leading-relaxed mb-3">
                We craft modern websites and custom applications that don’t just
                look good — they perform, scale, and make everyday tasks
                simpler. Every project reflects our belief that great digital
                products should be both beautiful and dependable, built with
                clarity, performance, and maintainability in mind.
              </Reveal>
              <Reveal as="p" className="text-gray-300 leading-relaxed">
                From landing pages and prototypes to long-term systems and
                data-driven platforms, we value clear communication, measurable
                outcomes, and the kind of small details that create lasting
                impact.
              </Reveal>
            </Stagger>
          </GlowCard>
        </div>
      </section>

      {/* Why Solid Code with Tetris stack */}
      <section
        className="max-w-6xl mx-auto px-6 mb-20"
        aria-labelledby="why-solid-title"
      >
        <Reveal
          as="h2"
          id="why-solid-title"
          className="text-4xl md:text-5xl font-bold font-logo text-center mb-4 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
        >
          Why "Solid" Code
        </Reveal>

        <Reveal
          as="p"
          id="solid-intro"
          className="text-center text-gray-300 max-w-3xl mx-auto mb-10"
        >
          Our name comes from the S O L I D principles. Stacked like blocks that
          form a stable structure, they keep products flexible and dependable as
          you grow.
        </Reveal>

        {/* Instruction text */}
        <div
          className="animate-float relative flex flex-col items-center gap-3"
          id="solid-instructions"
        >
          <p className="text-sm md:text-base font-medium text-accent-fuchsia/90 tracking-wide text-center">
            <span className="hidden md:inline">Hover over the pieces</span>
            <span className="inline md:hidden">Tap and hold the pieces</span>
          </p>
          <ArrowBigDown className="w-7 h-7 md:w-8 md:h-8 text-accent-fuchsia animate-bob drop-shadow-[0_0_12px_rgba(216,70,239,0.45)] pointer-events-none" />
        </div>

        {/* Spline scene — hidden from assistive tech since we provide a full text alt */}
        <Reveal delay={100}>
          <div
            className="relative w-full h-[400px] md:min-h-[710px] select-none touch-pan-y"
            aria-hidden="true"
            onWheelCapture={handleWheelCapture}
          >
            <Suspense fallback={null}>
              <Spline
                scene="https://prod.spline.design/mcVwR6VPMi2iZIXS/scene.splinecode"
                onLoad={handleLoad}
                renderOnDemand
              />
            </Suspense>
            <CubeLoader ready={ready} />
          </div>
        </Reveal>

        {/* Accessible text alternative (visible toggle + SR content) */}
        <details className="mx-auto max-w-3xl mb-6 rounded-xl border border-white/10 bg-white/5 p-4 open:bg-white/7">
          <summary className="cursor-pointer select-none text-sm md:text-base font-semibold text-white/70 hover:text-white/100 transition-colors duration-300 ease-in-out">
            Accessible text version of the SOLID pieces
            <span className="sr-only">
              {" "}
              — expands to reveal descriptions for screen readers and keyboard
              users
            </span>
          </summary>

          {/* Semantic definitions list */}
          <dl className="mt-3 space-y-3 text-sm text-gray-200" id="solid-a11y">
            <div>
              <dt className="font-semibold text-white">
                S — Single Responsibility
              </dt>
              <dd>
                Each part has one clear job. Simpler updates and fewer issues.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">O — Open / Closed</dt>
              <dd>
                Add new ideas without breaking what already works. Fast, safe
                progress.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">
                L — Liskov Substitution
              </dt>
              <dd>
                Pieces swap in cleanly. Things stay consistent and dependable.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">
                I — Interface Segregation
              </dt>
              <dd>
                Only what’s needed — no clutter. Cleaner connections, quicker
                builds.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">
                D — Dependency Inversion
              </dt>
              <dd>
                Big-picture logic is separate from small details. Smooth,
                stress-free upgrades.
              </dd>
            </div>
          </dl>
        </details>

        {/* No-JS fallback */}
        <noscript>
          <div className="mx-auto max-w-3xl mt-6 text-sm text-gray-200">
            <p>Interactive 3D is disabled. Here’s the SOLID summary:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>S</strong> — Each part has one clear job. Simpler
                updates, fewer issues.
              </li>
              <li>
                <strong>O</strong> — Add new ideas safely without breaking what
                works.
              </li>
              <li>
                <strong>L</strong> — Pieces swap cleanly. Consistent and
                dependable.
              </li>
              <li>
                <strong>I</strong> — Only what’s needed. Clean connections,
                quick builds.
              </li>
              <li>
                <strong>D</strong> — Strong architecture; details can change
                freely.
              </li>
            </ul>
          </div>
        </noscript>
      </section>

      {/* Our Approach with scroll follower highlight */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <Reveal
          as="h2"
          className="text-4xl md:text-5xl font-bold font-logo text-center mb-12 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
        >
          Our Approach
        </Reveal>
        <ApproachScroller />
      </section>

      {/* Core Values with Lucide and layered effects */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <Reveal
          as="h2"
          className="text-4xl md:text-5xl font-bold font-logo text-center mb-12 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
        >
          Our Core Values
        </Reveal>
        <ValuesGrid />
      </section>

      {/* Sitewide CTA */}
      <Reveal as="div" y={8}>
        <CTASection />
      </Reveal>
    </div>
  );
}
