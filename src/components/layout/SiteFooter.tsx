import { Link } from "react-router-dom";
import { CONTACT, SOCIAL_LINKS } from "../../content/site";
import logo from "../../assets/logos/scs-logo-cube.svg";

const linkClass = "text-ink-soft no-underline hover:text-white min-h-8 inline-flex items-center";

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label} className="flex flex-col gap-2.5">
      <h2 className="label m-0 text-ink-subtle">{label}</h2>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">{children}</ul>
    </nav>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-10 px-4 py-12 text-sm sm:px-6 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] lg:px-16 lg:py-[52px]">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <span className="flex items-center gap-2.5 font-logo text-xl font-bold">
            <img src={logo} alt="" width="30" height="30" className="size-[30px]" />
            Solid Code Solutions LLC
          </span>
          <p className="m-0 text-ink-subtle">Custom software built to fit.</p>
          <p className="m-0 mt-4 text-xs text-ink-subtle">© {year} Solid Code Solutions LLC</p>
        </div>
        <Column label="Services">
          <li><Link className={linkClass} to="/services#custom">Custom software</Link></li>
          <li><Link className={linkClass} to="/services#automation">Automation</Link></li>
          <li><Link className={linkClass} to="/services#modernization">Modernization</Link></li>
          <li><Link className={linkClass} to="/services#websites">Websites</Link></li>
        </Column>
        <Column label="Company">
          <li><Link className={linkClass} to="/work">Work</Link></li>
          <li><Link className={linkClass} to="/about">About</Link></li>
          <li><Link className={linkClass} to="/privacy">Privacy</Link></li>
          <li><Link className={linkClass} to="/terms">Terms</Link></li>
        </Column>
        <Column label="Contact">
          <li><a className={linkClass} href={`mailto:${CONTACT.email}`}>Email</a></li>
          <li><a className={linkClass} href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a></li>
          {SOCIAL_LINKS.map((s) => (
            <li key={s.label}>
              <a className={linkClass} href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
            </li>
          ))}
        </Column>
      </div>
    </footer>
  );
}
