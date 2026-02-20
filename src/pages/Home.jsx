import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import CTASection from "../components/CTASection";
import GlowCard from "../components/GlowCard";
import HeroSection from "../components/HeroSection";
import ProjectCard from "../components/ProjectCard";
import Reveal, { Stagger } from "../components/Reveal";
import { ADVANTAGES, PROJECTS, SERVICES } from "../constants/homeData";

export default function Home() {
  return (
    <>
      <SEO
        title="The missing piece to your digital solution"
        description="Tailored websites and web apps that click perfectly into place for your brand, your users, and your goals."
        path="/"
        image="/assets/og/og-default.webp"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Solid Code Solutions LLC",
            url: "https://solidcodesolutionsllc.com/",
            publisher: {
              "@type": "Organization",
              name: "Solid Code Solutions LLC",
              logo: {
                "@type": "ImageObject",
                url: "https://solidcodesolutionsllc.com/scs-logo-small.svg",
              },
            },
            potentialAction: {
              "@type": "SearchAction",
              target: "https://solidcodesolutionsllc.com/search?q={query}",
              "query-input": "required name=query",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://solidcodesolutionsllc.com/",
              },
            ],
          }}
        />
      </SEO>

      <div className="min-h-screen">
        <HeroSection />

        {/* Services Section */}
        <section
          id="services"
          className="py-20 px-6"
          aria-labelledby="services-heading"
        >
          <div className="max-w-6xl mx-auto">
            <Reveal
              as="h2"
              y={6}
              duration={450}
              id="services-heading"
              className="text-4xl md:text-5xl font-bold font-logo text-center bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
            >
              Solutions Built Around Your Needs
            </Reveal>

            <Reveal
              as="p"
              delay={120}
              y={4}
              duration={450}
              className="text-center md:text-xl text-gray-light mb-16 max-w-3xl mx-auto"
            >
              From custom software that optimizes operations to websites that
              amplify your brand, we deliver digital solutions that drive growth
              and impact.
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              <Stagger gap={120} startAt={80}>
                {SERVICES.map((service, index) => (
                  <Reveal key={service.title} y={8}>
                    <GlowCard className="p-8">
                      <img
                        src={service.image}
                        alt={service.alt}
                        className="w-full h-[170px] object-cover object-center rounded-xl mb-4"
                      />
                      <h3 className="text-2xl font-display font-bold mb-4 text-fuchsia-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-300">{service.description}</p>
                    </GlowCard>
                  </Reveal>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        {/* Credibility / Advantage Section */}
        <section
          className="relative py-25 px-6 overflow-hidden"
          aria-labelledby="advantages-heading"
        >
          {/* Gradient Background */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-dark-purple/50 via-purple-900/50 to-primary-dark-purple/50"
            aria-hidden="true"
          />
          <div
            className="absolute top-0 left-0 right-0 w-full h-20 bg-gradient-to-b from-primary-dark-purple to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 right-0 w-full h-20 bg-gradient-to-t from-primary-dark-purple to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <Reveal
              as="h2"
              y={6}
              duration={450}
              id="advantages-heading"
              className="text-4xl md:text-5xl font-bold font-logo text-center bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
            >
              The Solid Code Advantage
            </Reveal>

            <Reveal
              as="p"
              delay={120}
              y={4}
              duration={450}
              className="text-center md:text-xl text-gray-light mb-16 max-w-3xl mx-auto"
            >
              We go beyond code – combining technical expertise, creative
              design, and client-focused collaboration to deliver digital
              solutions that truly fit.
            </Reveal>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              <Stagger gap={140} startAt={80}>
                {ADVANTAGES.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Reveal key={item.title} y={8}>
                      <GlowCard className="p-8">
                        <Icon
                          className="w-12 h-12 text-accent-fuchsia mb-4"
                          aria-hidden="true"
                        />
                        <h3 className="text-2xl font-display font-bold mb-4 text-accent-fuchsia-light">
                          {item.title}
                        </h3>
                        <p className="text-gray-300">{item.description}</p>
                      </GlowCard>
                    </Reveal>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section
          id="featured-projects"
          className="py-20 px-6"
          aria-labelledby="projects-heading"
        >
          <div className="max-w-6xl mx-auto">
            <Reveal
              as="h2"
              y={6}
              duration={450}
              id="projects-heading"
              className="text-4xl md:text-5xl font-bold font-logo text-center bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
            >
              Featured Projects
            </Reveal>

            <Reveal
              as="p"
              delay={120}
              y={4}
              duration={450}
              className="text-center md:text-xl text-gray-light mb-16 max-w-3xl mx-auto"
            >
              A few recent builds that show how we blend clean UX, solid
              engineering, and real-world results.
            </Reveal>

            <div className="flex flex-col gap-8">
              <Stagger gap={160} startAt={80}>
                {PROJECTS.map((p, index) => (
                  <Reveal key={p.slug ?? p.key ?? index} y={10}>
                    <ProjectCard {...p} index={index} />
                  </Reveal>
                ))}
              </Stagger>
            </div>

            <Reveal as="div" delay={200} y={4} className="mt-12 text-center">
              <Link
                to="/projects"
                className="inline-block btn-secondary"
                aria-label="View all projects"
              >
                View All Projects
              </Link>
            </Reveal>
          </div>
        </section>

        {/* CTA Section */}
        <Reveal as="div" y={8}>
          <CTASection />
        </Reveal>
      </div>
    </>
  );
}
