import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { PageHeader } from "../components/layout/PageHeader";
import { AppVignette } from "../components/AppVignette";
import { ClosingCta } from "../components/ClosingCta";
import { Accordion } from "../components/ui/Accordion";
import { Bento, TagList, Tile } from "../components/ui/Bento";
import { ArrowIcon, LinkButton } from "../components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "../components/ui/Section";
import { GridBackdrop } from "../components/ui/GridBackdrop";
import { DeviceFrame } from "../components/work/FeaturedProject";
import { APPLICATION_TYPES, PROCESS, SERVICES, SERVICE_FAQ } from "../content/services";
import { SOFTWARE_CASES, WEBSITE_CASES, workPath } from "../content/work";
import { ORIGIN } from "../constants/seo";
import { useScrollToHash } from "../hooks/useScrollToHash";
import { cn } from "../components/ui/cn";

const custom = SERVICES.find((s) => s.id === "custom")!;
const websites = SERVICES.find((s) => s.id === "websites")!;

const SOFTWARE_BENEFITS = [
  { title: "Designed around the people who use it", text: "Screens, language and steps follow how your team already works, so the application feels natural from the first day." },
  { title: "One place for the work", text: "Information that used to live in spreadsheets, inboxes and paper lives in one system with clear rules and access by role." },
  { title: "Built to be understood", text: "Clean, maintainable code and a clear data model, so the application can be extended later instead of replaced." },
] as const;

const WEBSITE_POINTS = [
  "Clear structure and copy that explains what you do",
  "Works on phones, tablets and desktops",
  "Fast to load and ready for search engines",
  "Contact and quote forms that reach your inbox",
  "WordPress when you want to edit it yourself; custom React when the design asks for it",
] as const;

export default function Services() {
  useScrollToHash();
  return (
    <>
      <SEO
        title="Custom Software & Website Development Services"
        description="Custom software development for businesses, designed around your processes: records systems, scheduling, portals, finance tools and dashboards. Plus professional business websites."
        path="/services"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Solid Code Solutions services",
            itemListElement: SERVICES.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Service",
                name: s.title,
                description: s.description,
                url: `${ORIGIN}/services#${s.id}`,
                provider: { "@type": "Organization", name: "Solid Code Solutions LLC", url: `${ORIGIN}/` },
              },
            })),
          }}
        />
      </SEO>

      <PageHeader
        eyebrow="Services"
        title="Digital solutions designed around your business."
        lead="From custom business applications to professional websites, we build digital tools that solve real problems and support the way you work."
      >
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2.5">
          <a href="#custom" className="tag min-h-10 px-3 py-2 no-underline hover:border-accent/50 hover:text-white">
            Custom software
          </a>
          <a href="#websites" className="tag min-h-10 px-3 py-2 no-underline hover:border-accent/50 hover:text-white">
            Business websites
          </a>
          <a href="#faq" className="tag min-h-10 px-3 py-2 no-underline hover:border-accent/50 hover:text-white">
            Questions
          </a>
        </nav>
      </PageHeader>

      {/* Custom software: the page's main feature */}
      <section id="custom" aria-labelledby="custom-title" className="relative isolate scroll-mt-28 pb-16 lg:pb-[88px]">
        <GridBackdrop mask="left" />
        <Container className="flex flex-col gap-10 lg:gap-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-5 lg:col-span-6">
              <Eyebrow rule tone="fuchsia">
                Primary service · {custom.title}
              </Eyebrow>
              <h2 id="custom-title" className="display m-0 text-[30px] leading-[1.06] sm:text-[40px] lg:text-[48px]">
                Software that fits your business, <span className="text-gradient">not the other way around.</span>
              </h2>
              <p className="m-0 max-w-[560px] text-base leading-relaxed text-ink-muted md:text-[17px]">{custom.description}</p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <LinkButton to="/contact">
                  Discuss your project <ArrowIcon />
                </LinkButton>
                <LinkButton to={workPath("street-cat-clinic")} variant="secondary">
                  See a software case study
                </LinkButton>
              </div>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 lg:col-span-6 lg:gap-4">
              {SOFTWARE_BENEFITS.map((b, i) => (
                <li key={b.title} className={cn("tile flex gap-4 p-5 sm:p-6", i === 0 && "tile-feature")}>
                  <span aria-hidden="true" className="label mt-0.5 shrink-0 text-fuchsia">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="display m-0 text-lg sm:text-xl">{b.title}</h3>
                    <p className="m-0 mt-1.5 text-sm leading-relaxed text-ink-muted sm:text-[15px]">{b.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h3 className="display m-0 text-2xl sm:text-[28px]">Kinds of application we build</h3>
              <p className="m-0 text-sm text-ink-subtle">Examples, not a product menu. Most well-defined processes qualify.</p>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {APPLICATION_TYPES.map((t) => (
                <li key={t.id} className="group tile flex flex-col gap-4 p-4 sm:p-5">
                  <AppVignette kind={t.vignette} />
                  <div>
                    <h4 className="display m-0 text-lg">{t.title}</h4>
                    <p className="m-0 mt-1.5 text-sm leading-relaxed text-ink-muted">{t.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* How a project comes together: a compact version of the process */}
      <Section aria-labelledby="project-heading" spacing="tight" className="isolate border-y border-line bg-[rgb(255_255_255/0.015)]">
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Eyebrow>How a custom project comes together</Eyebrow>
            <h2 id="project-heading" className="display m-0 text-[26px] sm:text-[32px]">
              Collaborative from the first conversation.
            </h2>
            <p className="m-0 text-[15px] leading-relaxed text-ink-muted">
              You work directly with the developer building your application. The stages below keep the project clear,
              and your feedback shapes each one.
            </p>
            <Link to="/#process-heading" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-link no-underline hover:text-white">
              The process in detail <ArrowIcon />
            </Link>
          </div>
          <ol className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-5 lg:gap-3">
            {PROCESS.map((p, i) => (
              <li key={p.step} className="tile flex flex-col gap-3 p-4">
                <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="display m-0 text-[17px]">{p.step}</p>
                <p className="m-0 text-[13px] leading-relaxed text-ink-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Websites: the secondary service */}
      <section id="websites" aria-labelledby="websites-title" className="scroll-mt-28 py-16 lg:py-[88px]">
        <Container>
          <Bento>
            <Tile as="article" span={{ md: 6, lg: 7 }} className="flex flex-col gap-5 p-5 sm:p-8 lg:p-10">
              <Eyebrow tone="subtle">Secondary service · {websites.title}</Eyebrow>
              <h2 id="websites-title" className="display m-0 text-[28px] leading-[1.08] sm:text-[36px]">
                A website that represents your business at its best.
              </h2>
              <p className="m-0 max-w-[560px] text-base leading-relaxed text-ink-muted">{websites.description}</p>
              <ul className="m-0 flex flex-col gap-2 p-0 pl-5 text-[15px] leading-relaxed text-ink-soft">
                {WEBSITE_POINTS.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <TagList items={websites.tags} />
              <div className="mt-auto pt-2">
                <LinkButton to="/contact" variant="secondary">
                  Talk about a website
                </LinkButton>
              </div>
            </Tile>
            <div className="col-span-2 flex flex-col gap-2.5 md:col-span-6 md:gap-4 lg:col-span-5">
              {WEBSITE_CASES.map((c) => (
                <Tile key={c.slug} to={workPath(c.slug)} className="grid gap-4 p-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:p-5">
                  <img src={c.cover.src} alt="" loading="lazy" className="screenshot aspect-[16/10] object-cover object-top" />
                  <div className="flex flex-col gap-1.5">
                    <Eyebrow tone="subtle">{c.category}</Eyebrow>
                    <h3 className="display m-0 text-lg">{c.name}</h3>
                    <p className="m-0 text-sm text-ink-muted">{c.teaser}</p>
                    <span className="inline-flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-link">
                      Case study <ArrowIcon className="size-3.5" />
                    </span>
                  </div>
                </Tile>
              ))}
              <Link to="/work#websites" className="inline-flex min-h-11 items-center gap-2 self-start px-1 text-sm font-semibold text-link no-underline hover:text-white">
                All website work <ArrowIcon />
              </Link>
            </div>
          </Bento>
        </Container>
      </section>

      {/* Relevant work */}
      <Section aria-labelledby="proof-heading" spacing="tight" className="pb-16 lg:pb-[88px]">
        <Container className="flex flex-col gap-8">
          <SectionHeading
            id="proof-heading"
            eyebrow="Custom software in daily use"
            title="Two applications built around a real process."
            size="md"
            action={
              <Link to="/work" className="inline-flex min-h-11 items-center gap-2 font-semibold text-link no-underline hover:text-white">
                All case studies <ArrowIcon />
              </Link>
            }
          />
          <Bento>
            {SOFTWARE_CASES.map((c) => (
              <Tile key={c.slug} to={workPath(c.slug)} variant="feature" span={{ md: 6, lg: 6 }} className="flex flex-col gap-4 p-5 pb-0 sm:p-7 sm:pb-0">
                <Eyebrow tone="subtle">{c.category}</Eyebrow>
                <h3 className="display m-0 text-[24px] sm:text-[28px]">{c.name}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-ink-muted">{c.teaser}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-link">
                  Read the case study <ArrowIcon />
                </span>
                <DeviceFrame image={c.cover} device="desktop" className="mt-auto rounded-b-none border-b-0 pt-0" />
              </Tile>
            ))}
          </Bento>
        </Container>
      </Section>

      <Section id="faq" aria-labelledby="faq-heading" spacing="none" className="scroll-mt-28 pb-16 lg:pb-[88px]">
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Questions</Eyebrow>
            <h2 id="faq-heading" className="display m-0 text-[26px] sm:text-[32px]">
              What clients usually ask first.
            </h2>
            <p className="m-0 text-[15px] leading-relaxed text-ink-muted">
              Anything else? Send a message and you'll get a straight answer from the developer who would build it.
            </p>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={SERVICE_FAQ} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        eyebrow="Start a conversation"
        title="Tell us about the process you'd like to improve."
        text="A few sentences about the problem is enough to start. We'll reply with questions and practical next steps."
      />
    </>
  );
}
