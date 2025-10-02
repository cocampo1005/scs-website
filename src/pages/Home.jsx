import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import GlowCard from "../components/GlowCard";
import ProjectCard from "../components/ProjectCard";
import { SERVICES, ADVANTAGES, PROJECTS } from "../constants/homeData";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-6"
        aria-labelledby="services-heading"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            id="services-heading"
            className="text-4xl md:text-5xl font-bold font-logo text-center bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
          >
            Solutions Built Around Your Needs
          </h2>
          <p className="text-center md:text-xl text-gray-light mb-16 max-w-3xl mx-auto">
            From custom software that optimizes operations to websites that
            amplify your brand, we deliver digital solutions that drive growth
            and impact.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <GlowCard key={index}>
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-[170px] object-cover object-center rounded-xl mb-4"
                />
                <h3 className="text-2xl font-bold mb-4 text-fuchsia-300">
                  {service.title}
                </h3>
                <p className="text-gray-300">{service.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility Section */}
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

        {/* Content */}
        <div className="relative z-10">
          <h2
            id="advantages-heading"
            className="text-4xl md:text-5xl font-bold font-logo text-center bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
          >
            The Solid Code Advantage
          </h2>
          <p className="text-center md:text-xl text-gray-light mb-16 max-w-3xl mx-auto">
            We go beyond code – combining technical expertise, creative design,
            and client-focused collaboration to deliver digital solutions that
            truly fit.
          </p>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {ADVANTAGES.map((item, index) => {
              const Icon = item.icon;
              return (
                <GlowCard key={index}>
                  <Icon
                    className="w-12 h-12 text-accent-fuchsia mb-4"
                    aria-hidden="true"
                  />
                  <h3 className="text-2xl font-bold mb-4 text-accent-fuchsia-light">
                    {item.title}
                  </h3>
                  <p className="text-gray-300">{item.description}</p>
                </GlowCard>
              );
            })}
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
          <h2
            id="projects-heading"
            className="text-4xl md:text-5xl font-bold font-logo text-center bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
          >
            Featured Projects
          </h2>
          <p className="text-center md:text-xl text-gray-light mb-16 max-w-3xl mx-auto">
            A few recent builds that show how we blend clean UX, solid
            engineering, and real-world results.
          </p>

          <div className="flex flex-col gap-8">
            {PROJECTS.map((p, index) => (
              <ProjectCard key={p.slug} {...p} index={index} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/projects"
              className="inline-block btn-secondary"
              aria-label="View all projects"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 rounded-3xl p-12 border border-purple-500/30">
          <h2 id="cta-heading" className="text-4xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how we can bring your ideas to life
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-accent-fuchsia-dark to-accent-purple-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-fuchsia-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
