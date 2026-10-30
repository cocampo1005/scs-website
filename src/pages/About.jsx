import Reveal, { Stagger } from "../components/Reveal";
import GlowCard from "../components/GlowCard";
import CTASection from "../components/CTASection";
import MissionVisionTabs from "../components/MissionVisionTabs";
import ApproachScroller from "../components/ApproachScroller";
import ValuesGrid from "../components/ValuesGrid";
import { Blocks, LifeBuoy, MessagesSquare, Workflow } from "lucide-react";
import heroImg from "../assets/images/stacked-blocks.webp";
import fitImg from "../assets/images/hex-tesselation-fit.webp";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import SolidPuzzle from "../components/SolidPuzzle";

const GLANCE = [
  {
    icon: Blocks,
    title: "Software first",
    text: "Records platforms, scheduling systems, client portals and the automation between them.",
  },
  {
    icon: Workflow,
    title: "Built around your process",
    text: "Each project starts from how your team actually works, not from a template.",
  },
  {
    icon: MessagesSquare,
    title: "Direct collaboration",
    text: "You work with the developer building your software, from discovery to launch.",
  },
  {
    icon: LifeBuoy,
    title: "Support after launch",
    text: "Maintenance, fixes and new features when you need them.",
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="Tailor made software and websites that fit your goals and your users. Learn our approach, values, and what we stand for."
        path="/about"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Solid Code Solutions",
            url: "https://solidcodesolutionsllc.com/about",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://solidcodesolutionsllc.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: "https://solidcodesolutionsllc.com/about",
              },
            ],
          }}
        />
      </SEO>

      <div className="min-h-screen">
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
          <GlowCard className="p-8">
            <Stagger>
              <Reveal
                as="h2"
                className="text-2xl md:text-3xl font-display font-bold text-accent-fuchsia-light"
              >
                What We Stand For
              </Reveal>
              <Reveal as="p" className="text-gray-300">
                We solve real-world problems with solutions that fit just right
                — clear strategy, clean engineering, and an eye for design.
                Every project is a collaboration built on purpose and precision,
                where thoughtful technology turns ideas into lasting impact.
              </Reveal>
            </Stagger>
          </GlowCard>
        </section>

        {/* At a Glance: what working with us looks like (no unverified figures) */}
        <section className="max-w-6xl mx-auto px-6 mt-12 mb-20" aria-labelledby="glance-heading">
          <Stagger gap={120} startAt={40}>
            <Reveal
              as="h2"
              id="glance-heading"
              className="text-4xl md:text-5xl font-bold font-logo text-center mb-10 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
            >
              At a Glance
            </Reveal>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {GLANCE.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <GlowCard className="h-full p-6">
                    <Icon className="mb-3 size-7 text-accent-fuchsia" aria-hidden="true" />
                    <h3 className="font-display text-lg font-bold text-fuchsia-100">{title}</h3>
                    <p className="mt-1 text-sm text-gray-300">{text}</p>
                  </GlowCard>
                </li>
              ))}
            </ul>
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
                className="w-full h-72 md:h-[400px] object-cover object-bottom"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-primary-dark-purple/80 via-primary-dark-purple/30 to-transparent"
              />
              {/* Right-aligned title + subheading */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <div className="ml-auto max-w-[42rem] text-right">
                  <p className="text-3xl md:text-5xl font-logo font-bold text-fuchsia-100">
                    Built To Fit
                  </p>
                  <p className="text-gray-200 mt-1">
                    Your needs, your users, your stack. We make the pieces
                    click.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider line inside same border */}
            <div className="border-t border-purple-500/30" />

            {/* Bottom: Our Story (still inside the same container/border) */}
            <GlowCard className="p-8 rounded-t-none rounded-b-3xl bg-transparent ring-0 shadow-none">
              <Stagger>
                <Reveal
                  as="h2"
                  className="text-3xl font-display font-bold mb-4 text-accent-fuchsia-light"
                >
                  Our Story
                </Reveal>
                <Reveal as="p" className="text-gray-300 leading-relaxed mb-3">
                  Solid Code Solutions began with a simple goal — to turn
                  complex ideas into tools people genuinely love to use. Whether
                  it’s a web experience or a full-scale software platform, we
                  bridge creativity and functionality through clean engineering,
                  thoughtful design, and strategic thinking.
                </Reveal>
                <Reveal as="p" className="text-gray-300 leading-relaxed mb-3">
                  We craft modern websites and custom applications that don’t
                  just look good — they perform, scale, and make everyday tasks
                  simpler. Every project reflects our belief that great digital
                  products should be both beautiful and dependable, built with
                  clarity, performance, and maintainability in mind.
                </Reveal>
                <Reveal as="p" className="text-gray-300 leading-relaxed">
                  From landing pages and prototypes to long-term systems and
                  data-driven platforms, we value clear communication,
                  measurable outcomes, and the kind of small details that create
                  lasting impact.
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
            Our name comes from the{" "}
            <span className="font-bold font-display">S O L I D</span> principles
            in programming. Stacked like blocks that form a stable structure,
            they keep products flexible and dependable as you grow.
          </Reveal>

          {/* Interactive SOLID wall (React Three Fiber) */}
          <Reveal delay={100}>
            <SolidPuzzle />
          </Reveal>
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
        <section className="max-w-6xl mx-auto px-6">
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
    </>
  );
}
