// src/pages/Projects.jsx
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ExternalLink, ChevronDown } from "lucide-react";
import { href, Link } from "react-router-dom";

import heroImg from "../assets/images/hex-bg.webp";
import Reveal, { Stagger } from "../components/Reveal";
import GlowCard from "../components/GlowCard";

import CTASection from "../components/CTASection";
import Gallery from "../components/Gallery";
import {
  CASE_STUDIES,
  OTHER_PROJECTS,
  clientLogos,
} from "../constants/projectsData";
import Lightbox from "../components/Lightbox";
import { CountOnReveal } from "../utils/Counter";
import LogoLoop from "../components/LogoLoop";

export default function Projects() {
  const [active, setActive] = useState(CASE_STUDIES[0].key);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState(null);

  // Lightbox handlers
  const openLightbox = ({ images, index }) =>
    setLightboxState({ images, index });

  const closeLightbox = () => setLightboxState(null);

  // prev/next for Lightbox
  const prevLightbox = () =>
    setLightboxState((s) =>
      !s
        ? s
        : { ...s, index: (s.index - 1 + s.images.length) % s.images.length }
    );

  const nextLightbox = () =>
    setLightboxState((s) =>
      !s ? s : { ...s, index: (s.index + 1) % s.images.length }
    );

  const activeProject = useMemo(
    () => CASE_STUDIES.find((t) => t.key === active),
    [active]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero — matches About’s hero style */}
      <section
        className="relative overflow-hidden py-40 md:py-50 px-6 bg-primary-dark-purple bg-center bg-cover"
        aria-labelledby="projects-hero"
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
              id="projects-hero"
              className="font-logo text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
            >
              Projects & Case Studies
            </Reveal>
            <Reveal
              as="p"
              className="md:text-xl text-gray-200 max-w-3xl mx-auto"
            >
              Behind the builds — the process, precision, and polish that make
              each project stand out.
            </Reveal>
          </Stagger>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-4xl md:text-5xl font-bold font-logo text-center mb-10 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
          Featured Case Studies
        </h2>

        {/* Desktop Tabs — inside a GlowCard */}
        <div className="hidden md:block">
          <GlowCard className="p-4">
            <div className="relative grid grid-cols-3 gap-4">
              {CASE_STUDIES.map((t, i) => {
                const isActive = t.key === active;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActive(t.key)}
                    className={[
                      "relative cursor-pointer overflow-hidden rounded-xl px-4 py-3 text-left transition-all",
                      isActive
                        ? "bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 ring-1 ring-fuchsia-400/40"
                        : "bg-white/5 hover:bg-white/10 ring-1 ring-purple-500/30 hover:ring-fuchsia-500/50",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/70">
                          {i + 1 < 10 ? `0${i + 1}` : i + 1}
                        </p>
                        <p className="font-semibold">{t.title}</p>
                        <p className="text-sm text-white/70 line-clamp-2">
                          {t.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlowCard>
        </div>

        {/* Mobile Dropdown — wrapped by GlowCard */}
        <div className="md:hidden mb-6">
          <GlowCard className="p-2">
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="w-full px-3 py-3 bg-white/5 border border-purple-500/30 rounded-xl flex items-center justify-between"
            >
              <span className="font-semibold">{activeProject.title}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  mobileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {mobileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2 p-2">
                    {CASE_STUDIES.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => {
                          setActive(t.key);
                          setMobileDropdownOpen(false);
                        }}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          t.key === active
                            ? "bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <p className="font-semibold">{t.title}</p>
                        <p className="text-sm text-white/70">{t.subtitle}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlowCard>
        </div>

        {/* Active Panel — full-bleed hero + GlowCard body */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24 }}
            >
              {/* Outer wrapper controls the rounded shape. Image sits OUTSIDE GlowCard. */}
              <div className="rounded-2xl overflow-hidden bg-white/0 ring-1 ring-purple-500/20">
                {/* Full-bleed Hero */}
                <figure className="relative">
                  <img
                    src={activeProject.heroImage}
                    alt=""
                    className="w-full h-64 md:h-90 object-cover object-left-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark-purple/90 to-transparent" />
                  <figcaption className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-fuchsia-100">
                      {activeProject.title}
                    </h3>
                    <p className="text-white/80">{activeProject.subtitle}</p>
                  </figcaption>
                </figure>

                {/* Body in a GlowCard (top corners removed so it butts to image cleanly) */}
                <GlowCard className="rounded-t-none p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Text Content */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm uppercase tracking-wide text-white/70 mb-2">
                          Context
                        </p>
                        <p className="text-gray-200">{activeProject.context}</p>
                      </div>

                      {activeProject.links && (
                        <div className="mt-6">
                          <p className="text-sm uppercase tracking-wide text-white/60 mb-3">
                            Visit the websites
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {activeProject.links.map(({ label, url }) => (
                              <a
                                key={label}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center gap-2 rounded-full px-4 py-2
                     bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20
                     text-fuchsia-300 font-medium text-sm
                     hover:from-fuchsia-500/40 hover:to-purple-500/40
                     hover:text-white transition-all duration-300
                     shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                              >
                                <span className="relative z-10">{label}</span>
                                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-6">
                        <GlowCard className="p-4">
                          <p className="text-sm uppercase tracking-wide text-white/70 mb-2">
                            Problems
                          </p>
                          <ul className="list-disc list-inside text-gray-200/90 space-y-2 text-sm">
                            {activeProject.problems.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </GlowCard>

                        <GlowCard className="p-4">
                          <p className="text-sm uppercase tracking-wide text-white/70 mb-2">
                            Solutions
                          </p>
                          <ul className="list-disc list-inside text-gray-200/90 space-y-2 text-sm">
                            {activeProject.solution.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </GlowCard>
                      </div>

                      {/* Stack */}
                      <div>
                        <p className="text-sm uppercase tracking-wide text-white/70 mb-2">
                          Stack
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.tech.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-purple-500/30 text-fuchsia-200/90"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Gallery + Metrics */}
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-sm uppercase tracking-wide text-white/70 mb-2">
                          Screenshots
                        </p>
                        <p className="text-gray-200">
                          Click the images to learn more.
                        </p>
                      </div>
                      <Gallery
                        images={activeProject.gallery}
                        deviceType={activeProject.deviceType}
                        dualDevice={activeProject.dualDevice}
                        onImageClick={openLightbox}
                      />

                      <div
                        className="
        grid
        grid-cols-[repeat(auto-fit,minmax(130px,1fr))]
        md:grid-cols-3
        gap-3
      "
                      >
                        {activeProject.metrics.map(
                          ({ icon: Icon, label, value }) => (
                            <GlowCard
                              key={label}
                              className="p-3 sm:p-4 text-center"
                            >
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-2 opacity-80" />
                              <p
                                className="
              text-[11px] sm:text-xs uppercase
              tracking-normal sm:tracking-wide
              text-white/70 mb-1 leading-snug
              break-words
            "
                              >
                                {label}
                              </p>
                              <p className="text-lg sm:text-xl font-bold">
                                {/* ✅ Animated counter */}
                                <CountOnReveal value={value} />
                              </p>
                            </GlowCard>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end w-full">
                    <Link
                      to="/contact"
                      className="btn-primary w-full md:w-auto"
                    >
                      Start a similar project
                      <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                    </Link>
                  </div>
                </GlowCard>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />
      </div>

      <LogoLoop
        logos={clientLogos}
        speed={40}
        direction="left"
        logoHeight={100}
        gap={70}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#0c0216"
        ariaLabel="Technology partners"
        className="my-14"
      />

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />
      </div>

      {/* Other Projects — each card uses GlowCard */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-4xl md:text-5xl font-bold font-logo text-center mb-10 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
          Other Projects
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OTHER_PROJECTS.map((p) => (
            <div key={p.title} className="group rounded-2xl overflow-hidden">
              {/* Full-bleed image header */}
              <figure className="relative h-40">
                <img
                  src={p.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <figcaption className="absolute bottom-3 left-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-sm text-white">
                    {p.role}
                  </span>
                </figcaption>
              </figure>

              {/* Text body uses GlowCard so it matches site chrome, but no border around the image */}
              <GlowCard className="rounded-t-none p-5">
                <Link
                  to={p.url}
                  target="_blank"
                  className="text-lg flex items-center gap-2 font-semibold font-display text-accent-fuchsia-light hover:text-white"
                >
                  {p.title} <ExternalLink className="w-5 h-5" />
                </Link>
                <p className="mt-2 text-sm text-gray-300">{p.summary}</p>
                <div className="pt-3 flex justify-end">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-accent-fuchsia-light hover:text-white transition-colors text-sm"
                  >
                    Start something similar <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </section>
      <CTASection />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxState && (
          <Lightbox
            images={lightboxState.images}
            index={lightboxState.index}
            onClose={closeLightbox}
            onPrev={prevLightbox}
            onNext={nextLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
