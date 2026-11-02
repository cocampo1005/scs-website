import SEO from "../components/SEO";
import { LinkButton } from "../components/ui/Button";
import { Container, Eyebrow } from "../components/ui/Section";
import { GridBackdrop } from "../components/ui/GridBackdrop";

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="The page you were looking for does not exist." noindex />
      <section aria-labelledby="nf-title" className="relative isolate flex min-h-[78svh] items-center overflow-hidden pt-28 pb-20">
        <GridBackdrop mask="center" glow="corner" />
        <Container className="flex flex-col items-center gap-6 text-center">
          <Eyebrow>404</Eyebrow>
          <h1 id="nf-title" className="display m-0 max-w-[720px] text-[34px] leading-[1.06] sm:text-5xl">
            This piece doesn’t fit anywhere
          </h1>
          <p className="m-0 text-ink-muted">The page you’re looking for doesn’t exist or has moved.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton to="/">Go to the homepage</LinkButton>
            <LinkButton to="/work" variant="secondary">
              See our work
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
