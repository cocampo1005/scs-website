import { Bento } from "./ui/Bento";
import { LinkButton } from "./ui/Button";
import { Container } from "./ui/Section";
import { CONTACT } from "../content/site";

/** Closing call to action with the email and WhatsApp tiles */
export function ContactBand({
  title = "Have a process that should be simpler?",
  text = "Tell us what slows your team down and the tools involved. We'll reply with practical next steps.",
  cta = "Discuss your project",
  to = "/contact",
}: {
  title?: string;
  text?: string;
  cta?: string;
  to?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" className="pb-16 md:pb-24 lg:pb-[100px]">
      <Container>
        <Bento>
          <div className="tile tile-feature col-span-2 flex flex-col gap-4 bg-[radial-gradient(600px_280px_at_85%_0%,rgb(192_38_211/0.28),transparent),linear-gradient(180deg,var(--color-surface),var(--color-surface-deep))] p-6 md:col-span-6 sm:p-10 lg:col-span-8 lg:p-12">
            <h2 id="cta-heading" className="display m-0 text-[26px] leading-[1.1] sm:text-4xl lg:text-[42px]">
              {title}
            </h2>
            <p className="m-0 max-w-[560px] text-base leading-relaxed text-ink-muted sm:text-lg">{text}</p>
            <div className="mt-2">
              <LinkButton to={to} className="max-sm:w-full">
                {cta}
              </LinkButton>
            </div>
          </div>
          <div className="col-span-2 grid gap-2.5 md:col-span-6 md:grid-cols-2 md:gap-4 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-2">
            <div className="tile flex flex-col justify-between gap-3 p-5 sm:p-6">
              <p className="label m-0 text-ink-subtle">Email</p>
              <a href={`mailto:${CONTACT.email}`} className="break-all text-[15px] text-link no-underline hover:text-white sm:text-base">
                {CONTACT.email}
              </a>
            </div>
            <div className="tile flex flex-col justify-between gap-3 p-5 sm:p-6">
              <p className="label m-0 text-ink-subtle">WhatsApp</p>
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="text-[15px] text-link no-underline hover:text-white sm:text-base">
                {CONTACT.whatsappDisplay}
              </a>
            </div>
          </div>
        </Bento>
      </Container>
    </section>
  );
}
