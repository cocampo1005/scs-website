import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import NotFound from "./NotFound";
import { PageHeader } from "../components/layout/PageHeader";
import { DeviceFrame } from "../components/work/FeaturedProject";
import { ProductTour } from "../components/work/ProductTour";
import { Bento, TagList, Tile } from "../components/ui/Bento";
import { ArrowIcon, LinkButton } from "../components/ui/Button";
import { Container, Eyebrow, Section } from "../components/ui/Section";
import { GridBackdrop } from "../components/ui/GridBackdrop";
import { findCaseStudy, nextCaseStudy, workPath } from "../content/work";
import type { CaseStudy as CaseStudyData } from "../content/types";
import { ORIGIN } from "../constants/seo";
import { buildStartSimilarLink } from "../utils/similarProjectLinks";

function Points({ items }: { items: readonly string[] }) {
  return (
    <ul className="m-0 flex flex-col gap-2 p-0 pl-[18px] text-[15px] leading-relaxed text-ink-muted">
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

function Chapter({ n, label }: { n: number; label: string }) {
  return (
    <Eyebrow tone="subtle" as="span">
      {String(n).padStart(2, "0")} · {label}
    </Eyebrow>
  );
}

/**
 * The story of a project: the challenge, our approach, what we built, the
 * important features, a product walkthrough, then the practical outcomes.
 */
function CaseStudyView({ study }: { study: CaseStudyData }) {
  const next = nextCaseStudy(study.slug);
  const url = `${ORIGIN}${workPath(study.slug)}`;
  const [first, second] = study.keyScreens;
  const similar = buildStartSimilarLink(study.slug, study.name);

  return (
    <>
      <SEO title={study.seo.title} description={study.seo.description} path={workPath(study.slug)} image={{ url: "/og-default.jpg", width: 1200, height: 630, alt: study.cover.alt }}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: study.title,
            description: study.seo.description,
            url,
            image: `${ORIGIN}/og-default.jpg`,
            about: { "@type": "Organization", name: study.client },
            author: { "@type": "Organization", name: "Solid Code Solutions LLC", url: `${ORIGIN}/` },
            publisher: { "@type": "Organization", name: "Solid Code Solutions LLC", url: `${ORIGIN}/` },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
              { "@type": "ListItem", position: 2, name: "Work", item: `${ORIGIN}/work` },
              { "@type": "ListItem", position: 3, name: study.name, item: url },
            ],
          }}
        />
      </SEO>

      <PageHeader
        eyebrow={study.category}
        title={study.title}
        lead={study.summary}
        className="lg:pb-10"
        above={
          <nav aria-label="Breadcrumb" className="label text-ink-subtle">
            <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              <li>
                <Link to="/work" className="text-ink-subtle no-underline hover:text-white">
                  Work
                </Link>
                <span aria-hidden="true"> /</span>
              </li>
              <li aria-current="page" className="text-ink-soft">
                {study.name}
              </li>
            </ol>
          </nav>
        }
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LinkButton to={similar}>
            Start a similar project <ArrowIcon />
          </LinkButton>
          <LinkButton to="#walkthrough" variant="secondary">
            See the product
          </LinkButton>
        </div>
        <dl className="m-0 mt-9 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-4">
          {study.meta.map((m) => (
            <div key={m.label} className="tile p-4 sm:p-[18px]">
              <dt className="label text-ink-subtle">{m.label}</dt>
              <dd className="m-0 mt-1.5 text-sm sm:text-base">{m.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Overview screenshot */}
      <section aria-label="Overview" className="relative isolate pb-14 lg:pb-20">
        <GridBackdrop mask="center" />
        <Container>
          <figure className="m-0">
            <div className="tile tile-feature bg-[radial-gradient(600px_300px_at_50%_100%,rgb(139_92_246/0.25),transparent_70%)] px-3 pt-3 sm:px-8 sm:pt-8">
              <DeviceFrame image={study.cover} device={study.cover.device} priority className="rounded-b-none border-b-0" />
            </div>
            <figcaption className="mt-3 text-[13px] text-ink-subtle">{study.cover.caption}</figcaption>
          </figure>
        </Container>
      </section>

      {/* 01 The challenge · 02 Our approach */}
      <section aria-label="The challenge and our approach" className="pb-14 lg:pb-20">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <Chapter n={1} label="The challenge" />
            <h2 className="display m-0 text-[26px] leading-[1.1] sm:text-[32px]">{study.problem.title}</h2>
            <Points items={study.problem.points} />
          </div>
          <div className="tile tile-feature flex flex-col gap-4 p-6 sm:p-8 lg:col-span-7">
            <Chapter n={2} label="Our approach" />
            <h2 className="display m-0 text-[24px] leading-[1.1] sm:text-[28px]">{study.approach.title}</h2>
            <p className="m-0 text-[15px] leading-relaxed text-ink-muted sm:text-base">{study.approach.text}</p>
            {study.notes.map((n) => (
              <p key={n.label} className="m-0 border-t border-line pt-4 text-sm leading-relaxed text-ink-muted">
                <span className="font-semibold text-ink-soft">{n.label}. </span>
                {n.text}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* 03 What we built · 04 Important features */}
      <Section aria-label="What we built and its important features" spacing="tight" className="isolate border-y border-line bg-[rgb(255_255_255/0.015)]">
        <Container className="flex flex-col gap-8 lg:gap-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-4 lg:col-span-5">
              <Chapter n={3} label="What we built" />
              <h2 className="display m-0 text-[26px] leading-[1.1] sm:text-[32px]">{study.built.title}</h2>
              <Points items={study.built.points} />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-7">
              <Chapter n={4} label="Important features" />
              <ul className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-2 md:gap-4">
                {study.highlights.map((h) => (
                  <li key={h.title} className="tile flex flex-col gap-1.5 p-4 sm:p-5">
                    <span aria-hidden="true" className="size-2 rounded-[2px] bg-focus shadow-[0_0_10px_var(--color-focus)]" />
                    <h3 className="display m-0 mt-1 text-lg">{h.title}</h3>
                    <p className="m-0 text-sm leading-relaxed text-ink-muted">{h.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {(first || second) && (
            <Bento>
              {first && (
                <Tile as="figure" span={{ md: first.device === "mobile" ? 3 : 6, lg: first.device === "mobile" ? 5 : 7 }} className="m-0 flex flex-col gap-3 p-5 sm:p-[22px]">
                  <figcaption>
                    <Eyebrow tone="subtle">{first.label}</Eyebrow>
                    <p className="display m-0 mt-1 text-lg sm:text-xl">{first.title}</p>
                  </figcaption>
                  <DeviceFrame image={first.image} device={first.device} className="mt-auto" />
                </Tile>
              )}
              {second && (
                <Tile
                  as="figure"
                  span={{ md: first?.device === "mobile" ? 3 : 6, lg: first?.device === "mobile" ? 7 : 5 }}
                  className="m-0 flex flex-col gap-3 p-5 sm:p-[22px]"
                >
                  <figcaption>
                    <Eyebrow tone="subtle">{second.label}</Eyebrow>
                    <p className="display m-0 mt-1 text-lg sm:text-xl">{second.title}</p>
                  </figcaption>
                  <DeviceFrame image={second.image} device={second.device} className="mt-auto" />
                </Tile>
              )}
            </Bento>
          )}
        </Container>
      </Section>

      {/* 05 Product walkthrough */}
      <section id="walkthrough" aria-labelledby="walkthrough-heading" className="scroll-mt-28 py-14 lg:py-20">
        <Container className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Chapter n={5} label="Product walkthrough" />
            <h2 id="walkthrough-heading" className="display m-0 text-[26px] sm:text-[32px]">
              {study.name}, screen by screen.
            </h2>
            <p className="m-0 max-w-[640px] text-[15px] text-ink-muted">
              {study.kind === "software" ? "Shown with fictional demonstration data." : "Pages from the live site."}
            </p>
          </div>
          <ProductTour name={study.name} groups={study.tour} />
        </Container>
      </section>

      {/* 06 Outcomes */}
      <section aria-labelledby="outcomes-heading" className="pb-14 lg:pb-20">
        <Container>
          <Bento>
            <Tile variant="feature" span={{ md: 6, lg: study.links ? 7 : 8 }} className="flex flex-col gap-4 p-6 sm:p-8">
              <Chapter n={6} label="Practical outcomes" />
              <h2 id="outcomes-heading" className="display m-0 text-[24px] sm:text-[28px]">
                Outcomes
              </h2>
              <Points items={study.outcomes} />
              <p className="m-0 mt-2 border-l-2 border-focus/60 pl-3.5 text-[15px] italic leading-relaxed text-ink-muted">{study.benefit}</p>
            </Tile>
            <div className="col-span-2 grid gap-2.5 md:col-span-6 md:grid-cols-2 md:gap-4 lg:col-span-5 lg:grid-cols-1">
              {study.links && (
                <Tile className="flex flex-col gap-2 p-6">
                  <Eyebrow tone="subtle">Live sites</Eyebrow>
                  <ul className="m-0 flex list-none flex-col gap-1 p-0">
                    {study.links.map((l) => (
                      <li key={l.url}>
                        <a href={l.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-link no-underline hover:text-white">
                          {l.label} <span aria-hidden="true">↗</span>
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Tile>
              )}
              <Tile className="flex flex-col gap-3 p-6">
                <Eyebrow tone="subtle">Built with</Eyebrow>
                <TagList items={study.tech} />
              </Tile>
            </div>
          </Bento>
        </Container>
      </section>

      {/* Calls to action */}
      <section aria-labelledby="cta-heading" className="pb-16 lg:pb-[100px]">
        <Container>
          <Bento>
            <div className="tile tile-feature col-span-2 flex flex-col gap-4 bg-[radial-gradient(500px_240px_at_90%_0%,rgb(192_38_211/0.28),transparent),linear-gradient(180deg,var(--color-surface),var(--color-surface-deep))] p-6 sm:p-10 md:col-span-6 lg:col-span-8">
              <h2 id="cta-heading" className="display m-0 text-[26px] leading-[1.1] sm:text-[34px]">
                {study.cta.title}
              </h2>
              <p className="m-0 text-base text-ink-muted sm:text-[17px]">{study.cta.text}</p>
              <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
                <LinkButton to={similar}>
                  Start a similar project <ArrowIcon />
                </LinkButton>
                <LinkButton to="/work" variant="secondary">
                  View other projects
                </LinkButton>
              </div>
            </div>
            <Tile to={workPath(next.slug)} span={{ md: 6, lg: 4 }} className="flex min-h-[160px] flex-col justify-between gap-6 p-6 sm:p-7">
              <Eyebrow tone="subtle">Next case study</Eyebrow>
              <div>
                <p className="display m-0 text-2xl">{next.name}</p>
                <p className="m-0 mt-1.5 inline-flex items-center gap-2 text-sm text-ink-muted">
                  {next.category} <ArrowIcon className="size-3.5" />
                </p>
              </div>
            </Tile>
          </Bento>
        </Container>
      </section>
    </>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const study = findCaseStudy(slug);
  return study ? <CaseStudyView key={study.slug} study={study} /> : <NotFound />;
}
