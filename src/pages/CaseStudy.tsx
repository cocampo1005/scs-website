import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import NotFound from "./NotFound";
import { PageHeader } from "../components/layout/PageHeader";
import { ScreenshotGallery } from "../components/work/ScreenshotGallery";
import { Bento, TagList, Tile } from "../components/ui/Bento";
import { ArrowIcon, LinkButton } from "../components/ui/Button";
import { Container, Eyebrow } from "../components/ui/Section";
import { cn } from "../components/ui/cn";
import { findCaseStudy, nextCaseStudy, workPath } from "../content/work";
import type { CaseStudy as CaseStudyData, Device, Screenshot } from "../content/types";
import { ORIGIN } from "../constants/seo";
import { buildStartSimilarLink } from "../utils/similarProjectLinks";

function Points({ items }: { items: readonly string[] }) {
  return (
    <ul className="m-0 flex flex-col gap-1.5 pl-[18px] text-[15px] leading-relaxed text-ink-muted">
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

function Shot({ image, device, className }: { image: Screenshot; device: Device; className?: string }) {
  return device === "mobile" ? (
    <img
      src={image.src}
      alt={image.alt}
      loading="lazy"
      className={cn("mx-auto block w-[62%] max-w-[240px] rounded-t-[22px] border-[6px] border-b-0 border-[#1f1830]", className)}
    />
  ) : (
    <img src={image.src} alt={image.alt} loading="lazy" className={cn("screenshot", className)} />
  );
}

function CaseStudyView({ study }: { study: CaseStudyData }) {
  const next = nextCaseStudy(study.slug);
  const url = `${ORIGIN}${workPath(study.slug)}`;
  const [first, second] = study.keyScreens;

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
        title={study.title}
        lead={study.summary}
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
        <dl className="m-0 mt-9 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-4">
          {study.meta.map((m) => (
            <div key={m.label} className="tile p-4 sm:p-[18px]">
              <dt className="label text-ink-subtle">{m.label}</dt>
              <dd className="m-0 mt-1.5 text-sm sm:text-base">{m.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <section aria-label="Overview" className="pb-12 lg:pb-16">
        <Container>
          <figure className="m-0">
            <div className="tile tile-feature px-3 pt-3 sm:px-7 sm:pt-7">
              <Shot image={study.cover} device={study.cover.device} className="rounded-b-none" />
            </div>
            <figcaption className="mt-3 text-[13px] text-ink-subtle">{study.cover.caption}</figcaption>
          </figure>
        </Container>
      </section>

      <section aria-label="Problem and solution" className="pb-12 lg:pb-16">
        <Container>
          <Bento>
            <Tile span={{ md: 6, lg: 5 }} className="flex flex-col gap-3.5 p-6 sm:p-8">
              <Eyebrow>The problem</Eyebrow>
              <h2 className="display m-0 text-[22px] sm:text-[28px]">{study.problem.title}</h2>
              <Points items={study.problem.points} />
            </Tile>
            <Tile variant="feature" span={{ md: 6, lg: 7 }} className="flex flex-col gap-3.5 p-6 sm:p-8">
              <Eyebrow tone="fuchsia">What we built</Eyebrow>
              <h2 className="display m-0 text-[22px] sm:text-[28px]">{study.built.title}</h2>
              <Points items={study.built.points} />
            </Tile>
          </Bento>
        </Container>
      </section>

      <section aria-labelledby="screens-heading" className="pb-12 lg:pb-16">
        <Container className="flex flex-col gap-5">
          <h2 id="screens-heading" className="display m-0 text-2xl sm:text-[32px]">
            Key screens
          </h2>
          <Bento>
            {first && (
              <Tile as="figure" span={{ md: first.device === "mobile" ? 3 : 6, lg: first.device === "mobile" ? 5 : 7 }} className="m-0 flex flex-col gap-3 p-5 sm:p-[22px]">
                <figcaption>
                  <Eyebrow tone="subtle">{first.label}</Eyebrow>
                  <p className="display m-0 mt-1 text-lg sm:text-xl">{first.title}</p>
                </figcaption>
                <Shot image={first.image} device={first.device} className="mt-auto" />
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
                <Shot image={second.image} device={second.device} className="mt-auto" />
              </Tile>
            )}
            {study.notes.map((n) => (
              <Tile key={n.label} span={{ md: 3, lg: 4 }} className="flex flex-col gap-3 p-5 sm:p-[22px]">
                <Eyebrow tone="subtle">{n.label}</Eyebrow>
                <p className="m-0 text-[15px] leading-relaxed text-ink-muted">{n.text}</p>
              </Tile>
            ))}
            {/* The stack tile completes the row after zero, one or two notes */}
            <Tile
              span={{
                md: study.notes.length === 1 ? 3 : 6,
                lg: study.notes.length === 0 ? 12 : study.notes.length === 1 ? 8 : 4,
              }}
              className="flex flex-col gap-3 p-5 sm:p-[22px]"
            >
              <Eyebrow tone="subtle">Stack</Eyebrow>
              <TagList items={study.tech} />
            </Tile>
          </Bento>
        </Container>
      </section>

      <section aria-labelledby="gallery-heading" className="pb-12 lg:pb-16">
        <Container className="flex flex-col gap-6">
          <h2 id="gallery-heading" className="display m-0 text-2xl sm:text-[32px]">
            Screens in detail
          </h2>
          {study.gallery.map((g) => (
            <ScreenshotGallery key={g.title} title={g.title} device={g.device} images={g.images} />
          ))}
        </Container>
      </section>

      <section aria-labelledby="outcomes-heading" className="pb-12 lg:pb-16">
        <Container>
          <Bento>
            <Tile span={{ md: 6, lg: study.links ? 8 : 12 }} className="flex flex-col gap-3.5 p-6 sm:p-8">
              <h2 id="outcomes-heading" className="label m-0 font-medium text-accent">
                Outcomes
              </h2>
              <Points items={study.outcomes} />
            </Tile>
            {study.links && (
              <Tile span={{ md: 6, lg: 4 }} className="flex flex-col gap-2 p-6 sm:p-7">
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
          </Bento>
        </Container>
      </section>

      <section aria-labelledby="cta-heading" className="pb-16 lg:pb-[100px]">
        <Container>
          <Bento>
            <div className="tile tile-feature col-span-2 flex flex-col gap-3.5 bg-[radial-gradient(500px_240px_at_90%_0%,rgb(192_38_211/0.28),transparent),linear-gradient(180deg,var(--color-surface),var(--color-surface-deep))] p-6 sm:p-10 md:col-span-6 lg:col-span-8">
              <h2 id="cta-heading" className="display m-0 text-[26px] leading-[1.1] sm:text-[34px]">
                {study.cta.title}
              </h2>
              <p className="m-0 text-base text-ink-muted sm:text-[17px]">{study.cta.text}</p>
              <div className="mt-1.5">
                <LinkButton to={buildStartSimilarLink(study.slug, study.name)} className="max-sm:w-full">
                  Discuss a similar project
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
