import { Link } from "react-router-dom";
import {
  Mail,
  ArrowUpRight,
  ArrowUp,
  Github,
  Linkedin,
  Instagram,
  Box,
} from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react";
import logo from "../assets/logos/scs-logo-cube.svg";
import GlowCard from "./GlowCard";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer role="contentinfo" className="relative text-white">
      {/* Top gradient hairline */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent"
      />

      {/* Body */}
      <GlowCard className="bg-gradient-to-br from-slate-950 via-accent-purple-dark/15 to-slate-950 rounded-none">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          <div className="grid gap-10 md:gap-14 md:grid-cols-12">
            {/* Brand */}
            <div className="md:col-span-5">
              <Link to="/" className="group inline-flex items-center gap-3">
                <img
                  src={logo}
                  alt="Solid Code Solutions logo"
                  className="w-16 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(217,70,239,0.35)]"
                />
                <span className="font-display text-2xl md:text-3xl font-semibold bg-gradient-to-r from-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
                  Solid Code Solutions
                </span>
              </Link>
              <p className="mt-4 text-gray-300 max-w-md">
                Tailor‑made web & software that fit like a glove—designed,
                built, and iterated around your goals.
              </p>

              {/* Socials */}
              <div
                className="mt-6 flex items-center gap-8 md:gap-4"
                aria-label="Social links"
              >
                <a
                  href="https://github.com/cocampo1005"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-white/5 px-3 py-2 hover:border-fuchsia-500/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                >
                  <Github className="h-4 md:w-4" aria-hidden />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/christianocampodev/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-white/5 px-3 py-2 hover:border-fuchsia-500/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                >
                  <Linkedin className="h-4 md:w-4" aria-hidden />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-white/5 px-3 py-2 hover:border-fuchsia-500/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                >
                  <Instagram className="h-4 md:w-4" aria-hidden />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>

            {/* Nav columns */}
            <nav
              aria-label="Footer"
              className="md:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-8"
            >
              <div>
                <h3 className="text-sm uppercase tracking-wider text-accent-fuchsia-light mb-3">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <Link className="hover:text-fuchsia-200" to="/about">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-fuchsia-200" to="/projects">
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-fuchsia-200" to="/contact">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-fuchsia-200" to="/contact#faq">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-fuchsia-200"
                      to="/projects#featured"
                    >
                      Featured Projects
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h3 className="text-sm uppercase tracking-wider text-accent-fuchsia-light mb-3">
                  Get in touch
                </h3>

                <ul className="space-y-4 text-gray-300">
                  {/* Email */}
                  <li>
                    <div className="flex items-center gap-3 mb-1">
                      <Mail
                        className="h-5 w-5 text-accent-fuchsia-light"
                        aria-hidden
                      />
                      <span className="font-semibold text-accent-fuchsia-light">
                        Email
                      </span>
                    </div>
                    <a
                      href="mailto:christian@solidcodesolutionsllc.com"
                      className="block ml-8 md:text-sm hover:text-fuchsia-200 break-all"
                    >
                      christian@solidcodesolutionsllc.com
                    </a>
                  </li>

                  {/* WhatsApp */}
                  <li>
                    <div className="flex items-center gap-3 mb-1">
                      <WhatsappLogo
                        className="h-5 w-5 text-accent-fuchsia-light"
                        aria-hidden
                      />
                      <span className="font-semibold text-accent-fuchsia-light">
                        WhatsApp
                      </span>
                    </div>
                    <a
                      href="https://wa.me/19545592944"
                      target="_blank"
                      rel="noreferrer"
                      className="block ml-8 md:text-sm hover:text-fuchsia-200"
                    >
                      +1 (954) 559-2944
                    </a>
                  </li>
                </ul>

                {/* Tagline */}
                <div className="mt-5 flex items-start gap-3">
                  <Box
                    className="h-5 w-5 text-accent-fuchsia-light mt-0.5"
                    aria-hidden
                  />
                  <span className="text-gray-400 italic">
                    Building Solid Solutions That Fit
                  </span>
                </div>
              </div>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              © {year}{" "}
              <span className="text-gray-300">Solid Code Solutions LLC</span>.
              All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="hover:text-fuchsia-200 inline-flex items-center gap-1"
              >
                Privacy
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                to="/terms"
                className="hover:text-fuchsia-200 inline-flex items-center gap-1"
              >
                Terms
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <button
                onClick={scrollToTop}
                className="group inline-flex hover:cursor-pointer items-center gap-2 rounded-full border border-purple-500/20 bg-white/5 px-3 py-1.5 hover:border-fuchsia-500/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4" aria-hidden />
                <span className="text-gray-300 group-hover:text-fuchsia-200">
                  Top
                </span>
              </button>
            </div>
          </div>
        </div>
      </GlowCard>
    </footer>
  );
}
