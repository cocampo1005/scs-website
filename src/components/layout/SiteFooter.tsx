import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { XLogoIcon } from "@phosphor-icons/react";
import { COMPANY_DESCRIPTION, CONTACT, PRIMARY_NAV, SOCIAL_LINKS } from "../../content/site";
import { SERVICES } from "../../content/services";
import logo from "../../assets/logos/scs-logo-cube.svg";
import { useConsent } from "../../consent/useConsent";

const SOCIAL_ICONS: Record<(typeof SOCIAL_LINKS)[number]["label"], ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
  "X (Twitter)": XLogoIcon,
};

const linkClass = "inline-flex min-h-9 items-center gap-1.5 text-[15px] text-ink-soft no-underline transition-colors hover:text-white";

function Column({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="label m-0 text-fuchsia">{label}</h2>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">{children}</ul>
    </div>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const { openSettings } = useConsent();

  return (
    <footer className="relative isolate overflow-hidden">
      {/* Gradient hairline, then a soft violet wash behind the whole footer */}
      <div aria-hidden="true" className="h-px w-full bg-[linear-gradient(90deg,transparent,rgb(232_121_249/0.45)_50%,transparent)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(900px_360px_at_15%_0%,rgb(124_58_237/0.16),transparent_70%),linear-gradient(180deg,rgb(14_10_22/0.6),var(--color-bg))]"
      />
      <div aria-hidden="true" className="grid-motif absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_50%_80%_at_85%_20%,#000,transparent)]" />

      <div className="mx-auto max-w-[1440px] px-4 pt-14 pb-8 sm:px-6 lg:px-16 lg:pt-[72px]">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5 md:col-span-5">
            <Link to="/" className="group inline-flex w-fit items-center gap-3 no-underline" aria-label="Solid Code Solutions, home">
              <img
                src={logo}
                alt=""
                width="56"
                height="56"
                className="size-12 drop-shadow-[0_0_14px_rgb(217_70_239/0.35)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none lg:size-14"
              />
              <span className="font-logo text-2xl font-bold leading-none text-ink lg:text-[28px]">Solid Code Solutions</span>
            </Link>
            <p className="m-0 max-w-[440px] text-[15px] leading-relaxed text-ink-muted">{COMPANY_DESCRIPTION}</p>
            <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0" aria-label="Social links">
              {SOCIAL_LINKS.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex size-11 items-center justify-center rounded-[10px] border border-line bg-white/[0.03] text-ink-soft transition-[border-color,background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-focus/60 hover:bg-white/[0.07] hover:text-white motion-reduce:transition-none"
                    >
                      <Icon className="size-[18px]" aria-hidden />
                      <span className="sr-only">{s.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Navigation and contact */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-[0.8fr_0.9fr_1.7fr]">
            <Column label="Explore">
              {PRIMARY_NAV.map((item) => (
                <li key={item.to}>
                  <Link className={linkClass} to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className={linkClass} to="/contact#faq">
                  FAQ
                </Link>
              </li>
            </Column>
            <Column label="Services">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link className={linkClass} to={`/services#${s.id}`}>
                    {s.id === "custom" ? "Custom software" : "Business websites"}
                  </Link>
                </li>
              ))}
              <li>
                <Link className={linkClass} to="/work">
                  Case studies
                </Link>
              </li>
            </Column>
            <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
              <h2 className="label m-0 text-fuchsia">Get in touch</h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--color-fuchsia-strong),var(--color-violet-strong))] text-white">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[13px] text-ink-subtle">Email</span>
                    <a href={`mailto:${CONTACT.email}`} className="break-all text-sm text-ink no-underline hover:text-white sm:text-[15px]">
                      {CONTACT.email}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--color-fuchsia-strong),var(--color-violet-strong))] text-white">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[13px] text-ink-subtle">Phone</span>
                    <a href={CONTACT.phoneTel} className="text-[15px] text-ink no-underline hover:text-white">
                      {CONTACT.phoneDisplay}
                    </a>
                  </span>
                </li>
              </ul>
              <p className="m-0 mt-1 flex items-center gap-2.5 text-sm italic text-ink-subtle">
                <img src={logo} alt="" width="16" height="16" className="size-4 opacity-70" />
                Building solid solutions that fit
              </p>
            </div>
          </nav>
        </div>

        {/* Legal bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-sm text-ink-subtle md:flex-row">
          <p className="m-0">
            © {year} <span className="text-ink-soft">Solid Code Solutions LLC</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="inline-flex min-h-9 items-center gap-1 text-ink-soft no-underline hover:text-white">
              Privacy Policy <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
            <Link to="/terms" className="inline-flex min-h-9 items-center gap-1 text-ink-soft no-underline hover:text-white">
              Terms <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={openSettings}
              className="inline-flex min-h-9 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-sans text-sm text-ink-soft hover:text-white"
            >
              Cookie settings
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 font-sans text-[13px] text-ink-soft transition-colors hover:border-focus/60 hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowUp className="size-3.5" aria-hidden />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
