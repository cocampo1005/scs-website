import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import SolidPuzzle from "../components/SolidPuzzle";
import { ArchitectureVisual } from "../components/about/ArchitectureVisual";
import { ClosingCta } from "../components/ClosingCta";
import { ArrowIcon, LinkButton } from "../components/ui/Button";
import { Container, Eyebrow, Section } from "../components/ui/Section";
import { GridBackdrop } from "../components/ui/GridBackdrop";
import { ABOUT_DIFFERENTIATORS, MISSION, VISION } from "../content/services";
import { ORIGIN } from "../constants/seo";

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="Solid Code Solutions builds custom software around the people, processes and goals of each business. Learn what makes us different and the SOLID principles behind our name."
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

      {/* Hero: the statement, and a system built in layers around people */}
      <section aria-labelledby="page-title" className="relative isolate overflow-hidden pt-[104px] pb-12 lg:pt-[140px] lg:pb-20">
        <GridBackdrop mask="hero" glow="hero" />
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-6">
            <Eyebrow rule>About Solid Code Solutions</Eyebrow>
            <h1 id="page-title" className="display m-0 text-[36px] leading-[1.04] sm:text-[48px] lg:text-[58px]">
              Software should adapt to people. <span className="text-gradient">Not the other way around.</span>
            </h1>
            <p className="m-0 max-w-[560px] text-[17px] leading-relaxed text-ink-muted lg:text-[19px]">
              Solid Code Solutions creates custom digital solutions for businesses that need more than a generic
              application. Our focus is understanding the people, processes and goals behind each project, then
              building dependable software designed around them.
            </p>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <LinkButton to="/contact">
                Discuss your project <ArrowIcon />
              </LinkButton>
              <LinkButton to="/work" variant="secondary">
                See what we've built
              </LinkButton>
            </div>
          </div>
          <div className="lg:col-span-6">
            <ArchitectureVisual />
          </div>
        </Container>
      </section>

      {/* Mission and vision: two statements, not two cards */}
      <Section aria-label="Mission and vision" spacing="tight" className="border-y border-line bg-[rgb(255_255_255/0.015)] lg:py-[88px]">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow rule tone="fuchsia">
              Our mission
            </Eyebrow>
            <p className="display m-0 text-[24px] leading-[1.25] sm:text-[30px] lg:text-[32px]">{MISSION}</p>
          </div>
          <div className="flex flex-col gap-4 lg:border-l lg:border-line lg:pl-16">
            <Eyebrow rule>Our vision</Eyebrow>
            <p className="display m-0 text-[24px] leading-[1.25] text-ink-soft sm:text-[30px] lg:text-[32px]">{VISION}</p>
          </div>
        </Container>
      </Section>

      {/* What makes us different */}
      <Section aria-labelledby="different-heading" className="isolate lg:py-[100px]">
        <GridBackdrop mask="left" />
        <Container className="flex flex-col gap-10 lg:gap-14">
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <Eyebrow>What makes us different</Eyebrow>
              <h2 id="different-heading" className="display m-0 text-[30px] leading-[1.06] sm:text-[40px] lg:text-[46px]">
                Not a subscription to fit into. A solution built for you.
              </h2>
            </div>
            <p className="m-0 text-base leading-relaxed text-ink-muted md:text-[17px] lg:col-span-5 lg:self-end">
              We don't sell an off-the-shelf product and ask every business to adapt to it. We take the time to
              understand each project, then build the application around it.
            </p>
          </div>
          <ol className="m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2 lg:gap-x-16 lg:gap-y-12">
            {ABOUT_DIFFERENTIATORS.map((d, i) => (
              <li key={d.title} className="flex flex-col gap-3 border-t border-line pt-5">
                <span aria-hidden="true" className="display text-[40px] leading-none text-fuchsia/70 sm:text-[48px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display m-0 text-xl sm:text-[24px]">{d.title}</h3>
                <p className="m-0 max-w-[460px] text-[15px] leading-relaxed text-ink-muted sm:text-base">{d.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* The SOLID principles behind the name, as a puzzle */}
      <Section aria-labelledby="solid-heading" spacing="tight" className="isolate border-t border-line pb-16 lg:pb-24">
        <GridBackdrop mask="center" />
        <Container>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3">
              <Eyebrow>Why “Solid”</Eyebrow>
              <h2 id="solid-heading" className="display m-0 text-[28px] sm:text-4xl lg:text-[42px]">
                Software built from well-made pieces.
              </h2>
            </div>
            <p className="m-0 max-w-[520px] text-[15px] leading-relaxed text-ink-muted">
              Our name comes from the SOLID principles of software design: five habits that keep an application
              flexible and dependable as it grows. They are why a solution we build can change with your business
              instead of being replaced by it. Rebuild the wall to meet each one; no programming knowledge required.
            </p>
          </div>
          <SolidPuzzle />
        </Container>
      </Section>

      <ClosingCta
        eyebrow="Work with us"
        title="Want to work with the person who builds it?"
        text="Tell us about the process you want to improve. You'll hear back from the developer, not a sales team."
      />
    </>
  );
}
