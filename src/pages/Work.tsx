import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { PageHeader } from "../components/layout/PageHeader";
import { ClosingCta } from "../components/ClosingCta";
import { FeaturedProject } from "../components/work/FeaturedProject";
import { Bento, Tile } from "../components/ui/Bento";
import { ArrowIcon } from "../components/ui/Button";
import { Container, Eyebrow, SectionHeading } from "../components/ui/Section";
import { OTHER_PROJECTS, SOFTWARE_CASES, WEBSITE_CASES, workPath } from "../content/work";
import { ORIGIN } from "../constants/seo";
import { useScrollToHash } from "../hooks/useScrollToHash";

export default function Work() {
  useScrollToHash();
  return (
    <>
      <SEO
        title="Work: Custom Software Case Studies"
        description="Custom software in daily use: a records management platform and a scheduling platform, each built around a real business process, plus the websites we've built for businesses."
        path="/work"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Work by Solid Code Solutions",
            url: `${ORIGIN}/work`,
            hasPart: [...SOFTWARE_CASES, ...WEBSITE_CASES].map((c) => ({
              "@type": "Article",
              headline: c.title,
              url: `${ORIGIN}${workPath(c.slug)}`,
            })),
          }}
        />
      </SEO>

      <PageHeader
        eyebrow="Work"
        title="Real systems, built around real processes."
        lead="Each software project below started with a process that generic tools couldn't handle. The websites that follow are the secondary service."
      />

      <section aria-labelledby="software" className="pb-16 lg:pb-24">
        <Container className="flex flex-col gap-8">
          <SectionHeading id="software" eyebrow="Custom software" title="Case studies" size="md" />
          <div className="flex flex-col gap-6 lg:gap-8">
            {SOFTWARE_CASES.map((c, i) => (
              <FeaturedProject key={c.slug} study={c} index={i} reverse={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </section>

      <section id="websites" aria-labelledby="websites-heading" className="scroll-mt-28 pb-16 lg:pb-24">
        <Container className="flex flex-col gap-6">
          <SectionHeading
            id="websites-heading"
            eyebrow="Business websites"
            title="Websites & web experiences"
            size="md"
            lead="Professional websites built for businesses that want to be found and contacted. A secondary service, shown here in brief."
          />
          <Bento>
            {WEBSITE_CASES.map((c) => (
              <Tile key={c.slug} to={workPath(c.slug)} span={{ md: 6, lg: 6 }} className="grid sm:grid-cols-[200px_minmax(0,1fr)]">
                <img src={c.cover.src} alt="" loading="lazy" className="h-40 w-full object-cover object-top sm:h-full" />
                <div className="flex flex-col gap-2 p-5 sm:p-[22px]">
                  <Eyebrow tone="subtle">{c.category}</Eyebrow>
                  <h3 className="display m-0 text-xl">{c.name}</h3>
                  <p className="m-0 text-sm text-ink-muted">{c.teaser}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-link">
                    Case study <ArrowIcon className="size-3.5" />
                  </span>
                </div>
              </Tile>
            ))}
            {OTHER_PROJECTS.map((p) => (
              <Tile key={p.name} to={p.url} span={{ base: 1, md: 3, lg: 6 }} className="grid sm:grid-cols-[200px_minmax(0,1fr)]">
                <img src={p.image.src} alt={p.image.alt} loading="lazy" className="h-40 w-full object-cover object-top sm:h-full" />
                <div className="flex flex-col gap-2 p-5 sm:p-[22px]">
                  <Eyebrow tone="subtle">{p.role}</Eyebrow>
                  <h3 className="display m-0 text-xl">{p.name}</h3>
                  <p className="m-0 text-sm text-ink-muted max-sm:hidden">{p.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-link">
                    Visit the site <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </div>
              </Tile>
            ))}
          </Bento>
        </Container>
      </section>

      <ClosingCta
        eyebrow="Your project"
        title="Have a process that should be simpler?"
        text="Tell us what slows your team down. We'll reply with questions and a practical first version to discuss."
        secondary={{ label: "Our services", to: "/services" }}
      />
    </>
  );
}
