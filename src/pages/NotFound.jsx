import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page not found"
        description="The page you were looking for does not exist."
        noindex
      />
      <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center gap-6 px-6 pt-32 pb-20 text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-purple-light">
          404
        </p>
        <h1 className="bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text font-logo text-4xl font-bold text-transparent md:text-5xl">
          This piece doesn’t fit anywhere
        </h1>
        <p className="text-gray-light">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            Go to the homepage
          </Link>
          <Link to="/projects" className="btn-secondary">
            See our work
          </Link>
        </div>
      </section>
    </>
  );
}
