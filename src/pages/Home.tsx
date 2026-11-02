import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import HomeHero from "../components/hero/HomeHero";
import { Bento, TagList, Tile } from "../components/ui/Bento";
import { ArrowIcon } from "../components/ui/Button";
import { ContactBand } from "../components/ContactBand";
import { Container, Eyebrow, Section, SectionHeading } from "../components/ui/Section";
import { GridBackdrop } from "../components/ui/GridBackdrop";
import { CONTACT, CLIENT_NAMES } from "../content/site";
import { PROBLEM_ROWS, PROCESS, SERVICES } from "../content/services";
import { mmDesktopScreenshots, mmMobileScreenshots, sccScreenshots } from "../content/screenshots";
import { workPath } from "../content/work";
import { ORIGIN } from "../constants/seo";
import { cn } from "../components/ui/cn";

const sccRecord = sccScreenshots[9]!;
const sccForms = sccScreenshots[7]!;
const mmPhone = mmMobileScreenshots[1]!;
const mmManager = mmDesktopScreenshots[0]!;

function ClientStrip() {
  return (
    <section aria-label="Clients" className="border-y border-line">
      <Container className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-11">
        <span className="label whitespace-nowrap text-ink-subtle">Software &amp; websites for</span>
        <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-2 p-0 font-display text-[15px] font-semibold text-ink-subtle lg:gap-x-10 lg:text-base">
          {CLIENT_NAMES.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function SelectedWork() {
  return (
    <Section aria-labelledby="work-heading" className="pb-10 lg:pb-10">
      <Container className="flex flex-col gap-8 lg:gap-10">
        <SectionHeading
          id="work-heading"
          eyebrow="Selected work · Software"
          title="Software that replaced the spreadsheet."
          action={
            <Link to="/work" className="inline-flex min-h-11 items-center gap-2 font-semibold text-link no-underline hover:text-white">
              All case studies <ArrowIcon />
            </Link>
          }
        />
        <Bento rowHeight="160">
          <Tile
            to={workPath("street-cat-clinic")}
            variant="feature"
            span={{ md: 6, lg: 7 }}
            rows={{ lg: 3 }}
            className="flex flex-col gap-3.5 p-5 pb-0 sm:p-8 sm:pb-0"
          >
            <Eyebrow tone="subtle">01 · Records management platform</Eyebrow>
            <h3 className="display m-0 text-[22px] sm:text-[34px]">Street Cat Clinic</h3>
            <p className="m-0 max-w-[520px] text-[13px] leading-relaxed text-ink-muted sm:text-base">
              Patient records lived in spreadsheets and state TIP forms were filled out by hand. Now records, roles and
              the forms they produce live in one system.
            </p>
            <img src={sccRecord.src} alt={sccRecord.alt} loading="lazy" className="screenshot mt-auto rounded-b-none" />
          </Tile>
          <Tile span={{ md: 3, lg: 5 }} rows={{ lg: 2 }} className="flex flex-col gap-3 p-5 sm:p-6">
            <Eyebrow tone="fuchsia">Problem → Built</Eyebrow>
            <p className="display m-0 text-lg sm:text-[22px]">Forms generated from each record</p>
            <img src={sccForms.src} alt={sccForms.alt} loading="lazy" className="screenshot mt-auto" />
          </Tile>
          <Tile span={{ base: 1, md: 3, lg: 3 }} className="flex min-h-[110px] flex-col justify-between gap-3 p-4 sm:p-[22px]">
            <Eyebrow tone="subtle">Access</Eyebrow>
            <p className="display m-0 text-[15px] sm:text-[19px]">Staff and admin roles</p>
          </Tile>
          <Tile span={{ base: 1, md: 6, lg: 2 }} className="flex min-h-[110px] flex-col justify-between gap-3 p-4 sm:p-[22px]">
            <Eyebrow tone="subtle">Stack</Eyebrow>
            <p className="m-0 text-sm text-ink-muted">React · Firebase · PDF</p>
          </Tile>

          <Tile
            span={{ base: 1, md: 2, lg: 3 }}
            rows={{ lg: 2 }}
            className="flex flex-col items-center gap-2.5 px-4 pt-4 sm:px-5 sm:pt-5 max-md:order-last"
          >
            <Eyebrow tone="subtle" className="self-start">
              Trappers book on mobile
            </Eyebrow>
            <img
              src={mmPhone.src}
              alt={mmPhone.alt}
              loading="lazy"
              className="mt-auto block w-[78%] max-w-[180px] rounded-t-[18px] border-[6px] border-b-0 border-[#1f1830] lg:max-w-none"
            />
          </Tile>
          <Tile
            to={workPath("meowmax")}
            variant="feature"
            span={{ md: 4, lg: 9 }}
            rows={{ lg: 3 }}
            className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-7 lg:pb-0"
          >
            <div className="flex flex-col gap-3.5 lg:pb-8">
              <Eyebrow tone="subtle">02 · Scheduling platform</Eyebrow>
              <h3 className="display m-0 text-[22px] sm:text-[34px]">MeowMax for Cat Solutions 305</h3>
              <p className="m-0 text-[13px] leading-relaxed text-ink-muted sm:text-base">
                Clinic appointments used to be coordinated by calls and messages. Trappers now book and release their own
                slots, and staff see every day's capacity in real time, in English or Spanish.
              </p>
              <TagList items={["React", "Firestore", "Real-time", "i18n"]} className="mt-auto" />
            </div>
            <img src={mmManager.src} alt={mmManager.alt} loading="lazy" className="screenshot hidden self-end rounded-b-none lg:block" />
          </Tile>
          <Tile span={{ base: 1, md: 6, lg: 3 }} className="flex min-h-[110px] flex-col justify-between gap-3 p-4 sm:p-5 max-md:order-last">
            <Eyebrow tone="subtle">Capacity</Eyebrow>
            <p className="display m-0 text-[15px] sm:text-[19px]">Full days can't be overbooked</p>
          </Tile>
        </Bento>
      </Container>
    </Section>
  );
}

function ProblemsWeSolve() {
  return (
    <Section aria-labelledby="problems-heading" className="lg:py-20">
      <Container className="flex flex-col gap-9">
        <SectionHeading id="problems-heading" eyebrow="Problems we solve" title="The workflow first. Then the software that fits it." />
        <ul className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 md:grid-cols-[minmax(0,5fr)_80px_minmax(0,6fr)] md:gap-y-3.5">
          {PROBLEM_ROWS.map((row) => (
            <li key={row.today} className="contents">
              <div className="tile tile-open px-5 py-4 sm:px-6 sm:py-5">
                <p className="m-0 text-[13px] text-ink-subtle">Today</p>
                <p className="m-0 mt-1 text-base sm:text-lg">{row.today}</p>
              </div>
              <div aria-hidden="true" className="flex items-center justify-center max-md:h-6 max-md:flex-col md:justify-start">
                <span className="h-full w-px bg-[linear-gradient(180deg,rgb(196_181_253/0.15),var(--color-focus))] md:h-px md:w-auto md:flex-1 md:bg-[linear-gradient(90deg,rgb(196_181_253/0.15),var(--color-focus))]" />
                <span className="size-2 shrink-0 rounded-[2px] bg-focus shadow-[0_0_12px_var(--color-focus)]" />
              </div>
              <div className="tile px-5 py-4 max-md:mb-3 sm:px-6 sm:py-5">
                <p className="label m-0 text-fuchsia">
                  <span className="sr-only">becomes: </span>Fitted solution
                </p>
                <p className="m-0 mt-1 text-base sm:text-lg">{row.fitted}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function ServicesBento() {
  const [primary, ...rest] = SERVICES;
  const secondary = rest.filter((s) => s.tier === "secondary");
  const supporting = rest.find((s) => s.tier === "supporting");
  return (
    <Section aria-labelledby="services-heading" className="isolate lg:py-20" id="services">
      <GridBackdrop mask="left" />
      <Container className="flex flex-col gap-9">
        <SectionHeading
          id="services-heading"
          eyebrow="What we build"
          title="Services, assembled around one core."
          action={
            <Link to="/services" className="inline-flex min-h-11 items-center gap-2 font-semibold text-link no-underline hover:text-white">
              All services <ArrowIcon />
            </Link>
          }
        />
        <Bento rowHeight="150">
          {primary && (
            <Tile
              to={`/services#${primary.id}`}
              variant="feature"
              span={{ md: 6, lg: 7 }}
              rows={{ lg: 2 }}
              className="flex flex-col gap-3.5 p-5 sm:p-8"
            >
              <Eyebrow tone="fuchsia">Primary</Eyebrow>
              <h3 className="display m-0 text-[22px] sm:text-[32px]">{primary.title}</h3>
              <p className="m-0 max-w-[520px] text-[13px] leading-relaxed text-ink-muted sm:text-base">{primary.short}</p>
              <TagList items={["Dashboards", "Portals", "Records", "Scheduling", "Admin tools"]} className="mt-auto max-sm:hidden" />
            </Tile>
          )}
          {secondary.map((s) => (
            <Tile key={s.id} to={`/services#${s.id}`} span={{ base: 1, md: 3, lg: 5 }} className="flex min-h-[120px] flex-col justify-between gap-2 p-4 sm:p-6">
              <h3 className="display m-0 text-[15px] sm:text-[21px]">{s.title}</h3>
              <p className="m-0 text-xs leading-normal text-ink-subtle sm:text-[15px] sm:text-ink-muted">{s.short}</p>
            </Tile>
          ))}
          {supporting && (
            <Tile
              to={`/services#${supporting.id}`}
              variant="open"
              span={{ md: 6, lg: 12 }}
              className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-7 lg:h-24 lg:self-start lg:py-0"
            >
              <span className="flex flex-wrap items-center gap-x-[18px] gap-y-1">
                <span className="label hidden text-ink-subtle sm:inline">Also</span>
                <span className="display text-[15px] sm:text-[19px]">{supporting.title}</span>
                <span className="hidden text-[15px] text-ink-muted md:inline">{supporting.short}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 text-[13px] font-semibold text-link sm:text-base">
                Websites <ArrowIcon />
              </span>
            </Tile>
          )}
        </Bento>
      </Container>
    </Section>
  );
}

const STEP_HEIGHTS = ["lg:h-[190px]", "lg:h-[220px]", "lg:h-[250px]", "lg:h-[220px]", "lg:h-[190px]"];

function HowWeWork() {
  return (
    <Section aria-labelledby="process-heading" className="lg:pt-[60px] lg:pb-[100px]">
      <Container className="flex flex-col gap-9">
        <SectionHeading id="process-heading" eyebrow="How we work" title="Five steps. You're in every one." />
        <ol className="m-0 grid list-none grid-cols-2 gap-2.5 p-0 md:grid-cols-5 md:items-end md:gap-4">
          {PROCESS.map((p, i) => (
            <li
              key={p.step}
              className={cn(
                "tile flex min-h-[150px] flex-col justify-between gap-6 p-4 sm:p-[22px]",
                i === 2 && "tile-feature",
                i === 4 && "max-md:col-span-2 max-md:min-h-0",
                STEP_HEIGHTS[i],
              )}
            >
              <span className={cn("label", i === 2 ? "text-fuchsia" : "text-accent")}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="display m-0 text-lg sm:text-[21px]">{p.step}</p>
                <p className="m-0 mt-1.5 text-[13px] text-ink-muted sm:text-sm">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <SEO
        title="Custom Software Development"
        description="Solid Code Solutions builds custom software for businesses: records platforms, scheduling systems, client portals, integrations and workflow automation."
        path="/"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Solid Code Solutions LLC",
            url: `${ORIGIN}/`,
            logo: `${ORIGIN}/solid-code-solutions-llc-logo.png`,
            image: `${ORIGIN}/og-default.jpg`,
            email: CONTACT.email,
            telephone: CONTACT.phoneE164,
            description:
              "Custom software development: records platforms, scheduling systems, client portals, integrations and workflow automation.",
            areaServed: "US",
            knowsLanguage: ["en", "es"],
          }}
        />
      </SEO>
      <HomeHero />
      <ClientStrip />
      <SelectedWork />
      <ProblemsWeSolve />
      <ServicesBento />
      <HowWeWork />
      <ContactBand />
    </>
  );
}
