import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { PageHeader } from "../components/layout/PageHeader";
import { ContactBand } from "../components/ContactBand";
import { Bento, TagList, Tile } from "../components/ui/Bento";
import { ArrowIcon } from "../components/ui/Button";
import { Container, Eyebrow } from "../components/ui/Section";
import { OTHER_PROJECTS, SOFTWARE_CASES, WEBSITE_CASES, workPath } from "../content/work";
import { ORIGIN } from "../constants/seo";
import { useScrollToHash } from "../hooks/useScrollToHash";

export default function Work() {
  useScrollToHash();
  return (
    <>
      <SEO
        title="Work: Custom Software Case Studies"
        description="Case studies of custom software in daily use, including a records platform and a scheduling app, plus the websites we've built for businesses."
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

      <PageHeader eyebrow="Work" title="Software in daily use, and the websites around it." />

      <section aria-labelledby="software" className="pb-16">
        <Container className="flex flex-col gap-5">
          <h2 id="software" className="label m-0 font-medium text-fuchsia">
            Software · case studies
          </h2>
          <Bento>
            {SOFTWARE_CASES.map((c, i) => (
              <Tile
                key={c.slug}
                to={workPath(c.slug)}
                variant="feature"
                span={{ md: i === 0 ? 6 : 6, lg: i === 0 ? 7 : 5 }}
                className="flex flex-col gap-3 p-6 pb-0 sm:p-8 sm:pb-0"
              >
                <Eyebrow tone="subtle">{c.category}</Eyebrow>
                <h3 className="display m-0 text-[26px] sm:text-[32px]">{c.name}</h3>
                <p className="m-0 leading-relaxed text-ink-muted">{c.teaser}</p>
                <TagList items={c.tech.slice(0, 3)} />
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-link">
                  Read the case study <ArrowIcon />
                </span>
                <img src={c.cover.src} alt={c.cover.alt} loading="lazy" className="screenshot mt-auto rounded-b-none pt-2" />
              </Tile>
            ))}
          </Bento>
        </Container>
      </section>

      <section id="websites" aria-labelledby="websites-heading" className="scroll-mt-28 pb-16 lg:pb-[72px]">
        <Container className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="websites-heading" className="label m-0 font-medium text-ink-subtle">
              Websites &amp; web experiences
            </h2>
            <span className="text-[13px] text-ink-subtle">Website development is a supporting service</span>
          </div>
          <Bento>
            {WEBSITE_CASES.map((c) => (
              <Tile key={c.slug} to={workPath(c.slug)} span={{ md: 6, lg: 6 }} className="grid sm:grid-cols-[200px_minmax(0,1fr)]">
                <img src={c.cover.src} alt="" loading="lazy" className="h-40 w-full object-cover object-top sm:h-full" />
                <div className="flex flex-col gap-2 p-5 sm:p-[22px]">
                  <Eyebrow tone="subtle">{c.category}</Eyebrow>
                  <h3 className="display m-0 text-xl">{c.name}</h3>
                  <p className="m-0 text-sm text-ink-muted">{c.teaser}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] text-link">
                    Case study <ArrowIcon className="size-3.5" />
                  </span>
                </div>
              </Tile>
            ))}
            {OTHER_PROJECTS.map((p) => (
              <Tile key={p.name} to={p.url} span={{ base: 2, md: 2, lg: 4 }} className="flex flex-col">
                <img src={p.image.src} alt={p.image.alt} loading="lazy" className="block h-[150px] w-full object-cover object-top" />
                <div className="flex flex-col gap-1 px-[18px] py-4">
                  <h3 className="display m-0 text-base">{p.name}</h3>
                  <p className="m-0 text-[13px] text-ink-subtle">
                    {p.role} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens the live site in a new tab)</span>
                  </p>
                </div>
              </Tile>
            ))}
          </Bento>
        </Container>
      </section>

      <ContactBand title="Have a process that should be simpler?" text="Tell us what slows your team down and the tools involved. We'll reply with practical next steps." />
    </>
  );
}
