import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import HomeHero from "../components/hero/HomeHero";
import { AppVignette } from "../components/AppVignette";
import { ClosingCta } from "../components/ClosingCta";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { FeaturedProject } from "../components/work/FeaturedProject";
import { Bento, TagList, Tile } from "../components/ui/Bento";
import { ArrowIcon, LinkButton } from "../components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "../components/ui/Section";
import { GridBackdrop } from "../components/ui/GridBackdrop";
import { CONTACT } from "../content/site";
import { APPLICATION_TYPES, DIFFERENTIATORS, PROCESS, SERVICES } from "../content/services";
import { mmDesktopScreenshots } from "../content/screenshots";
import { SOFTWARE_CASES } from "../content/work";
import { ORIGIN } from "../constants/seo";
import { cn } from "../components/ui/cn";

const custom = SERVICES.find((s) => s.id === "custom")!;
const websites = SERVICES.find((s) => s.id === "websites")!;
const servicesShot = mmDesktopScreenshots[0]!;

/** What custom software can do: six kinds of application, as possibilities */
function WhatWeBuild() {
  return (
    <Section aria-labelledby="build-heading" className="isolate">
      <GridBackdrop mask="left" />
      <Container className="flex flex-col gap-9 lg:gap-12">
        <SectionHeading
          id="build-heading"
          eyebrow="What can custom software do for you?"
          title="If your business has a process, we can build a better way to run it."
          lead="Every business works differently. Whether you need to organize information, manage appointments, coordinate your team, serve customers or simplify day-to-day operations, we create applications designed around the way you actually work."
        />
        <ul className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {APPLICATION_TYPES.map((t, i) => (
            <li key={t.id} className={cn("group tile flex flex-col gap-4 p-4 sm:p-5", i === 0 && "tile-feature")}>
              <AppVignette kind={t.vignette} />
              <div className="flex flex-col gap-1.5">
                <h3 className="display m-0 text-lg sm:text-xl">{t.title}</h3>
                <p className="m-0 text-sm leading-relaxed text-ink-muted">{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="tile tile-open flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="m-0 text-[15px] text-ink-muted sm:text-base">
            <span className="text-ink">These are possibilities, not a fixed menu.</span> Have something different in mind?
          </p>
          <Link to="/contact" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-link no-underline hover:text-white">
            Let's talk about building it <ArrowIcon />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

/** Why Solid Code Solutions: a statement, then four pillars on a rail */
function WhyUs() {
  return (
    <Section aria-labelledby="why-heading" spacing="tight" className="relative isolate overflow-hidden lg:py-[100px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(900px_420px_at_20%_30%,rgb(124_58_237/0.2),transparent_70%),radial-gradient(700px_380px_at_85%_80%,rgb(192_38_211/0.14),transparent_70%)]"
      />
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-5 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow rule>Why Solid Code Solutions</Eyebrow>
          <h2 id="why-heading" className="display m-0 text-[30px] leading-[1.06] sm:text-[40px] lg:text-[46px]">
            Your business isn't a template. <span className="text-fuchsia">Your software shouldn't be either.</span>
          </h2>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-ink-muted md:text-[17px]">
            We work with you to understand your goals, the people using the system and the details that make your
            business different. Then we design and develop a solution that fits, with quality, security and long-term
            usability considered from the beginning.
          </p>
        </div>
        <ol className="relative m-0 flex list-none flex-col p-0 lg:col-span-7">
          <span aria-hidden="true" className="absolute top-3 bottom-3 left-[21px] w-px bg-[linear-gradient(180deg,transparent,var(--color-focus)_15%,var(--color-violet-strong)_85%,transparent)] opacity-60" />
          {DIFFERENTIATORS.map((d, i) => (
            <li key={d.title} className="group relative flex gap-5 py-5 sm:gap-7 sm:py-7 lg:py-8">
              <span
                aria-hidden="true"
                className="label relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-focus/40 bg-bg text-[13px] text-fuchsia shadow-[0_0_20px_rgb(232_121_249/0.15)] transition-[box-shadow,border-color] duration-300 group-hover:border-focus group-hover:shadow-[0_0_28px_rgb(232_121_249/0.4)] motion-reduce:transition-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2 border-b border-line pb-5 sm:pb-7 lg:pb-8 group-last:border-b-0">
                <h3 className="display m-0 text-xl sm:text-[24px]">{d.title}</h3>
                <p className="m-0 max-w-[520px] text-[15px] leading-relaxed text-ink-muted sm:text-base">{d.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/** The two services, custom software with the weight */
function ServicesPreview() {
  return (
    <Section aria-labelledby="services-heading" id="services" spacing="tight" className="lg:py-[100px]">
      <Container className="flex flex-col gap-9">
        <SectionHeading
          id="services-heading"
          eyebrow="What we offer"
          title="The right digital solution starts with what your business needs."
          action={
            <Link to="/services" className="inline-flex min-h-11 items-center gap-2 font-semibold text-link no-underline hover:text-white">
              All services <ArrowIcon />
            </Link>
          }
        />
        <Bento>
          <Tile
            to={`/services#${custom.id}`}
            variant="feature"
            span={{ md: 6, lg: 8 }}
            className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,5fr)] lg:gap-8 lg:p-9 lg:pb-0"
          >
            <div className="flex flex-col gap-4 lg:pb-9">
              <Eyebrow tone="fuchsia">Primary service</Eyebrow>
              <h3 className="display m-0 text-[26px] sm:text-[32px]">{custom.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-ink-muted sm:text-base">{custom.short}</p>
              <TagList items={custom.tags} className="mt-1" />
              <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-link">
                How we build software <ArrowIcon />
              </span>
            </div>
            <img src={servicesShot.src} alt={servicesShot.alt} loading="lazy" className="screenshot hidden self-end rounded-b-none lg:block" />
          </Tile>
          <Tile to={`/services#${websites.id}`} span={{ md: 6, lg: 4 }} className="flex flex-col gap-4 p-5 sm:p-8">
            <Eyebrow tone="subtle">Also</Eyebrow>
            <h3 className="display m-0 text-[22px] sm:text-[26px]">{websites.title}</h3>
            <p className="m-0 text-[15px] leading-relaxed text-ink-muted sm:text-base">{websites.short}</p>
            <TagList items={websites.tags.slice(0, 3)} className="mt-1" />
            <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-link">
              Website development <ArrowIcon />
            </span>
          </Tile>
        </Bento>
      </Container>
    </Section>
  );
}

function HowWeWork() {
  return (
    <Section aria-labelledby="process-heading" className="isolate lg:py-[100px]">
      <GridBackdrop mask="center" />
      <Container className="flex flex-col gap-10 lg:gap-14">
        <SectionHeading
          id="process-heading"
          eyebrow="How we work"
          title="Five stages. You're part of every one."
          lead="A clear process keeps the project understandable from the first conversation to launch, with your feedback shaping each stage."
        />
        <ProcessTimeline steps={PROCESS} />
      </Container>
    </Section>
  );
}

function FeaturedWork() {
  return (
    <Section aria-labelledby="work-heading" spacing="tight" className="lg:py-[100px]">
      <Container className="flex flex-col gap-9">
        <SectionHeading
          id="work-heading"
          eyebrow="Featured software projects"
          title="Real systems, solving real business problems."
          lead="Two custom applications in daily use. Each started with a process that generic tools couldn't handle."
          action={
            <Link to="/work" className="inline-flex min-h-11 items-center gap-2 font-semibold text-link no-underline hover:text-white">
              All case studies <ArrowIcon />
            </Link>
          }
        />
        <div className="flex flex-col gap-6 lg:gap-8">
          {SOFTWARE_CASES.map((c, i) => (
            <FeaturedProject key={c.slug} study={c} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
        <div className="flex justify-center lg:hidden">
          <LinkButton to="/work" variant="secondary">
            See all our work
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <SEO
        title="Custom Software Development"
        description="Solid Code Solutions designs and builds custom software for businesses: records systems, scheduling and booking, portals, finance and admin tools, dashboards and the professional websites to go with them."
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
              "Custom software development for businesses: purpose-built web applications designed around each client's processes, plus professional business websites.",
            areaServed: "US",
            knowsLanguage: ["en", "es"],
            makesOffer: SERVICES.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.title, description: s.short, url: `${ORIGIN}/services#${s.id}` },
            })),
          }}
        />
      </SEO>
      <HomeHero />
      <WhatWeBuild />
      <WhyUs />
      <ServicesPreview />
      <HowWeWork />
      <FeaturedWork />
      <ClosingCta />
    </>
  );
}
