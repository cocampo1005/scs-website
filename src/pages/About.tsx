import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import SolidPuzzle from "../components/SolidPuzzle";
import { ContactBand } from "../components/ContactBand";
import { Bento, Tile } from "../components/ui/Bento";
import { Container, Eyebrow, Section } from "../components/ui/Section";
import { GridBackdrop } from "../components/ui/GridBackdrop";
import { ORIGIN } from "../constants/seo";

const VALUES = [
  { title: "Precision", text: "Every detail supports the whole." },
  { title: "Maintainable by design", text: "Readable, typed, tested code that is easy to extend." },
  { title: "Transparent process", text: "Shared milestones and plain-language updates." },
] as const;

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="Solid Code Solutions is a hands-on software partner. Learn how we work and the SOLID engineering principles behind our name."
        path="/about"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Solid Code Solutions",
            url: `${ORIGIN}/about`,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
              { "@type": "ListItem", position: 2, name: "About", item: `${ORIGIN}/about` },
            ],
          }}
        />
      </SEO>

      <section aria-labelledby="page-title" className="relative isolate overflow-hidden pt-[104px] pb-10 lg:pt-[156px]">
        <GridBackdrop mask="corner" glow="corner" />
        <Container className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-4">
          <div className="flex flex-col gap-[18px] lg:col-span-7">
            <Eyebrow>About</Eyebrow>
            <h1 id="page-title" className="display m-0 text-[34px] leading-[1.06] sm:text-5xl lg:text-[58px] lg:leading-[1.04]">
              A hands-on software partner, named after the principles we build by.
            </h1>
          </div>
          <p className="m-0 text-[17px] leading-relaxed text-ink-muted lg:col-span-5">
            Solid Code Solutions designs and builds custom software for businesses whose work doesn't fit a template.
            You work directly with the developer building it, from first conversation to launch and beyond.
          </p>
        </Container>
      </section>

      <Section aria-labelledby="solid-heading" spacing="tight" className="isolate">
        <GridBackdrop mask="center" />
        <Container>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3">
              <Eyebrow>Why “Solid”</Eyebrow>
              <h2 id="solid-heading" className="display m-0 text-[28px] sm:text-4xl lg:text-[42px]">
                Build something SOLID.
              </h2>
            </div>
            <p className="m-0 max-w-[460px] text-[15px] leading-relaxed text-ink-muted">
              Our name comes from the SOLID principles of software design: five rules that keep software flexible and
              dependable as it grows.
            </p>
          </div>
          <SolidPuzzle />
        </Container>
      </Section>

      <Section aria-label="How we work" spacing="tight" className="pb-16 lg:pb-[72px]">
        <Container>
          <Bento>
            <Tile span={{ md: 6, lg: 6 }} className="flex flex-col gap-3 p-6 sm:p-8">
              <h2 className="label m-0 font-medium text-accent">Our story</h2>
              <p className="m-0 text-base leading-[1.7] text-ink-muted">
                Solid Code Solutions began with a simple goal: turn complex processes into tools people genuinely like to
                use. Today that means records platforms, scheduling systems and the integrations between them, built with
                clean engineering and maintained after launch.
              </p>
            </Tile>
            <Tile span={{ base: 1, md: 3, lg: 3 }} className="flex flex-col justify-between gap-6 p-5 sm:p-6">
              <h3 className="label m-0 font-medium text-ink-subtle">Collaboration</h3>
              <p className="display m-0 text-[17px] sm:text-xl">You work with the developer building it</p>
            </Tile>
            <Tile span={{ base: 1, md: 3, lg: 3 }} className="flex flex-col justify-between gap-6 p-5 sm:p-6">
              <h3 className="label m-0 font-medium text-ink-subtle">After launch</h3>
              <p className="display m-0 text-[17px] sm:text-xl">Maintenance, fixes and new features</p>
            </Tile>
            {VALUES.map((v) => (
              <Tile key={v.title} span={{ md: 2, lg: 4 }} className="p-5 sm:p-6">
                <h3 className="display m-0 text-[19px]">{v.title}</h3>
                <p className="m-0 mt-1.5 text-sm text-ink-muted">{v.text}</p>
              </Tile>
            ))}
          </Bento>
        </Container>
      </Section>

      <ContactBand title="Want to work with the people who build it?" text="Tell us about the process you want to improve. You'll hear back from the developer, not a sales team." />
    </>
  );
}
