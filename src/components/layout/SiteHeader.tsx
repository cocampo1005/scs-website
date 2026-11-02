import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { PRIMARY_CTA, PRIMARY_NAV } from "../../content/site";
import { LinkButton } from "../ui/Button";
import { cn } from "../ui/cn";
import logo from "../../assets/logos/scs-logo-cube.svg";

function Wordmark() {
  return (
    <Link to="/" className="flex min-h-11 items-center gap-3 text-ink no-underline" aria-label="Solid Code Solutions, home">
      <img src={logo} alt="" width="40" height="40" className="size-9 lg:size-10" />
      <span className="font-logo text-xl font-bold tracking-[0.01em] max-[359px]:hidden lg:text-[22px]">
        Solid Code Solutions
      </span>
    </Link>
  );
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative py-2 text-[15px] no-underline transition-colors duration-150",
    isActive
      ? "text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-focus"
      : "text-ink-soft hover:text-white",
  );

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

/** Below 1024px: a full-height panel with the same links */
function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      // Keep Tab inside the panel and the menu button
      const focusable = [
        ...document.querySelectorAll<HTMLElement>("#mobile-nav a, [aria-controls='mobile-nav']"),
      ];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-nav"
      ref={panelRef}
      hidden={!open}
      className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-bg/[0.97] px-4 pt-6 pb-10 backdrop-blur-md sm:px-6 lg:hidden"
    >
      <nav aria-label="Mobile">
        <ul className="m-0 flex list-none flex-col p-0">
          {PRIMARY_NAV.map((item) => (
            <li key={item.to} className="border-b border-line">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn("display flex min-h-16 items-center justify-between text-[28px] no-underline", isActive ? "text-white" : "text-ink-soft")
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && <span aria-hidden="true" className="size-2 rounded-[2px] bg-focus shadow-[0_0_10px_var(--color-focus)]" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <LinkButton to={PRIMARY_CTA.to} className="mt-8 w-full">
        {PRIMARY_CTA.label}
      </LinkButton>
    </div>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // A solid bar once the page scrolls; transparent over each page's header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-250",
        scrolled || menuOpen ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[84px] lg:px-16">
        <Wordmark />
        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
          <LinkButton to={PRIMARY_CTA.to} size="sm" className="min-h-[42px] px-[18px]">
            {PRIMARY_CTA.label}
          </LinkButton>
        </nav>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-[10px] border border-line bg-white/[0.03] text-ink lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
