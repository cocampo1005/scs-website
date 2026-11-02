import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { PageHeader } from "../components/layout/PageHeader";
import { ContactBand } from "../components/ContactBand";
import { Accordion } from "../components/ui/Accordion";
import { Bento, TagList, Tile } from "../components/ui/Bento";
import { ArrowIcon } from "../components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "../components/ui/Section";
import { PROBLEMS_SOLVED, PROCESS, SERVICES, SERVICE_FAQ } from "../content/services";
import { mmDesktopScreenshots } from "../content/screenshots";
import { workPath } from "../content/work";
import { ORIGIN } from "../constants/seo";
import type { Service } from "../content/types";
import { useScrollToHash } from "../hooks/useScrollToHash";

const byId = (id: string) => SERVICES.find((s) => s.id === id) as Service;
const custom = byId("custom");
const automation = byId("automation");
const modernization = byId("modernization");
const websites = byId("websites");
const shot = mmDesktopScreenshots[0]!;

function SecondaryService({ service }: { service: Service }) {
  return (
    <Tile id={service.id} as="article" aria-labelledby={`${service.id}-title`} span={{ md: 3, lg: 6 }} className="flex scroll-mt-28 flex-col gap-3 p-6 sm:p-8">
      <Eyebrow>Secondary service</Eyebrow>
      <h2 id={`${service.id}-title`} className="display m-0 text-[22px] sm:text-[28px]">
        {service.title}
      </h2>
      <p className="m-0 leading-relaxed text-ink-muted">{service.description}</p>
      <TagList items={service.tags} className="mt-1.5" />
    </Tile>
  );
}

export default function Services() {
  useScrollToHash();
  return (
    <>
      <SEO
        title="Custom Software Development Services"
        description="Custom software development, workflow automation and integrations, software modernization and support, and website development for businesses."
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
        title="Custom software development, and the work that keeps it connected."
        lead="We design and build applications around the way your business already works, then connect them to your other tools and keep them improving."
      >
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2.5">
          {SERVICES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="tag min-h-10 px-3 py-2 no-underline hover:border-accent/50 hover:text-white">
              {s.id === "custom" ? "Custom software" : s.id === "websites" ? "Websites" : s.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <section id="custom" aria-labelledby="custom-title" className="scroll-mt-28 pb-16 lg:pb-[72px]">
        <Container>
          <Bento className="lg:auto-rows-[minmax(150px,auto)]">
            <Tile as="article" variant="feature" span={{ md: 6, lg: 7 }} rows={{ lg: 3 }} className="flex flex-col gap-4 p-6 pb-0 sm:p-9 sm:pb-0">
              <Eyebrow tone="fuchsia">Primary service</Eyebrow>
              <h2 id="custom-title" className="display m-0 text-[28px] leading-[1.08] sm:text-[38px]">
                {custom.title}
              </h2>
              <p className="m-0 max-w-[560px] leading-relaxed text-ink-muted">{custom.description}</p>
              <h3 className="label m-0 mt-2 font-medium text-ink-subtle">What we build</h3>
              <TagList items={custom.tags} />
              <img src={shot.src} alt={shot.alt} loading="lazy" className="screenshot mt-auto rounded-b-none pt-4" />
            </Tile>
            <Tile span={{ md: 3, lg: 5 }} className="flex flex-col gap-3 p-6 sm:p-7">
              <h3 className="label m-0 font-medium text-ink-subtle">Problems this solves</h3>
              <ul className="m-0 flex flex-col gap-1.5 pl-[18px] text-[15px] leading-relaxed text-ink-muted">
                {PROBLEMS_SOLVED.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Tile>
            <Tile span={{ md: 3, lg: 5 }} className="flex flex-col gap-3 p-6 sm:p-7">
              <h3 className="label m-0 font-medium text-ink-subtle">How a project runs</h3>
              <ol className="m-0 flex flex-col gap-1.5 pl-[18px] text-[15px] leading-relaxed text-ink-muted">
                {PROCESS.slice(0, 4).map((p) => (
                  <li key={p.step}>
                    <span className="text-ink">{p.step}:</span> {p.text.charAt(0).toLowerCase() + p.text.slice(1)}
                  </li>
                ))}
              </ol>
            </Tile>
            <Tile to={workPath("street-cat-clinic")} span={{ md: 6, lg: 5 }} className="flex items-center justify-between gap-4 px-6 py-6 sm:px-7">
              <span>
                <span className="label block text-ink-subtle">See it in practice</span>
                <span className="display mt-1 block text-lg sm:text-xl">Street Cat Clinic · MeowMax</span>
              </span>
              <ArrowIcon className="size-5 shrink-0" />
            </Tile>
          </Bento>
        </Container>
      </section>

      <section aria-label="More services" className="pb-16 lg:pb-[72px]">
        <Container>
          <Bento>
            <SecondaryService service={automation} />
            <SecondaryService service={modernization} />
            <Tile
              id="websites"
              as="article"
              aria-labelledby="websites-title"
              variant="open"
              span={{ md: 6, lg: 12 }}
              className="grid scroll-mt-28 gap-3 p-6 sm:px-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_auto] lg:items-center lg:gap-7"
            >
              <div>
                <Eyebrow tone="subtle">Supporting service</Eyebrow>
                <h2 id="websites-title" className="display m-0 mt-1.5 text-[22px]">
                  {websites.title}
                </h2>
              </div>
              <p className="m-0 text-[15px] leading-relaxed text-ink-muted">{websites.description}</p>
              <Link to="/work#websites" className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-semibold text-link no-underline hover:text-white">
                Website work <ArrowIcon />
              </Link>
            </Tile>
          </Bento>
        </Container>
      </section>

      <Section aria-labelledby="faq-heading" spacing="none" className="pb-16 lg:pb-[72px]">
        <Container className="flex flex-col gap-6">
          <SectionHeading id="faq-heading" title="Common questions" size="md" />
          <Accordion items={SERVICE_FAQ} />
        </Container>
      </Section>

      <ContactBand text="Describe the workflow and the tools involved. We'll reply with practical next steps." />
    </>
  );
}
