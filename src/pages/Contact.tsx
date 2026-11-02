import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../styles/phone-input.css";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { PageHeader } from "../components/layout/PageHeader";
import { Accordion } from "../components/ui/Accordion";
import { Bento, Tile } from "../components/ui/Bento";
import { Button } from "../components/ui/Button";
import { Container, Eyebrow, SectionHeading } from "../components/ui/Section";
import { cn } from "../components/ui/cn";
import { CONTACT } from "../content/site";
import { CONTACT_FAQ } from "../content/services";
import { findCaseStudy } from "../content/work";
import { ORIGIN } from "../constants/seo";
import { useScrollToHash } from "../hooks/useScrollToHash";
import { MESSAGE_MAX, validateContact } from "../utils/contactValidation";
import { sendContactMessage } from "../utils/contactApi";

type FormState = {
  name: string;
  email: string;
  message: string;
  tools: string;
  website: string; // honeypot
  phoneDigits: string; // full international number, digits only
  phoneDial: string;
  phoneDisplay: string; // formatted for the email, e.g. +44 7700 900123
};

type FieldErrors = Partial<Record<"name" | "email" | "message" | "phone", string>>;

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  message: "",
  tools: "",
  website: "",
  phoneDigits: "",
  phoneDial: "",
  phoneDisplay: "",
};

// Google Ads conversion (see /privacy). Fires only after the server accepted
// the message.
const ADS_SEND_TO = "AW-17675252735/cPPICNvM37QbEP_nm-xB";
function fireAdsLead() {
  window.gtag?.("event", "conversion", { send_to: ADS_SEND_TO });
}

function sendErrorMessage(error: string) {
  switch (error) {
    case "validation":
      return "Please fix the highlighted fields.";
    case "rate_limited":
      return "Too many attempts. Please try again later or email us directly.";
    case "timeout":
      return "Network seems slow. Please try again in a moment.";
    default:
      return "Couldn't send the message right now. Please try again or email us directly.";
  }
}

/** The tools field travels inside the message; the server has one free-text field */
function composeMessage(message: string, tools: string) {
  const body = message.trim();
  return tools.trim() ? `${body}\n\nTools used today: ${tools.trim()}` : body;
}

const INPUT =
  "block w-full min-h-12 rounded-[var(--radius-control)] border bg-bg/60 px-3.5 font-sans text-[15px] text-ink placeholder:text-ink-subtle/80 transition-colors focus:border-transparent focus:outline-2 focus:outline-offset-1 focus:outline-focus";

function Field({
  label,
  optional,
  error,
  errorId,
  className,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  errorId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="flex flex-col gap-2 text-sm font-medium text-ink-soft">
        <span>
          {label}
          {optional && <span className="font-normal text-ink-subtle"> (optional)</span>}
        </span>
        {children}
      </label>
      {error && (
        <p id={errorId} className="m-0 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({ sending: false, ok: false, err: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [lastSentAt, setLastSentAt] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  // When the visitor started filling the form; the server treats near-instant sends as bots
  const startedAtRef = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useScrollToHash();

  // "Discuss a similar project" links prefill the message
  useEffect(() => {
    if (searchParams.get("intent") !== "start-similar") return;
    const title = searchParams.get("title") || findCaseStudy(searchParams.get("project") ?? undefined)?.name || "your featured project";
    const seed = `Hello, I'd like to discuss a project similar to ${title}. Here's what we need:`;
    setForm((s) => ({ ...s, message: s.message.trim() ? s.message : seed }));
  }, [searchParams]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus((s) => ({ ...s, err: "", ok: false }));
    setErrors({});
    if (form.website) return; // honeypot

    if (Date.now() - lastSentAt < 12000) {
      setStatus({ sending: false, ok: false, err: "Please wait a moment before sending another message." });
      return;
    }

    const message = composeMessage(form.message, form.tools);
    const errs: FieldErrors = validateContact({
      name: form.name,
      email: form.email,
      message: form.message,
      phone: { digits: form.phoneDigits, dialCode: form.phoneDial },
    });
    if (!errs.message && [...message].length > MESSAGE_MAX) {
      errs.message = "Please keep your message under 5,000 characters.";
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      setStatus({ sending: false, ok: false, err: "Please fix the highlighted fields." });
      return;
    }

    const hasPhone = form.phoneDigits && form.phoneDigits !== form.phoneDial;
    setStatus({ sending: true, ok: false, err: "" });
    const result = await sendContactMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      message,
      phone: hasPhone ? { digits: form.phoneDigits, dialCode: form.phoneDial, display: form.phoneDisplay } : null,
      website: form.website,
      elapsedMs: Date.now() - startedAtRef.current,
    });

    if (!result.ok) {
      setErrors(result.fields || {});
      setStatus({ sending: false, ok: false, err: sendErrorMessage(result.error) });
      return;
    }

    setStatus({ sending: false, ok: true, err: "" });
    setLastSentAt(Date.now());
    startedAtRef.current = Date.now();
    fireAdsLead();
    formRef.current?.reset();
    setForm(EMPTY_FORM);
  }

  const invalid = (field: keyof FieldErrors) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `err-${field}` : undefined,
  });
  const border = (field: keyof FieldErrors) => (errors[field] ? "border-danger" : "border-[rgb(196_181_253/0.22)]");

  return (
    <>
      <SEO
        title="Contact"
        description="Tell us about the process you want to improve. Reach Solid Code Solutions through the form, by email or on WhatsApp."
        path="/contact"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Solid Code Solutions",
            url: `${ORIGIN}/contact`,
            publisher: { "@type": "Organization", name: "Solid Code Solutions LLC", url: `${ORIGIN}/` },
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: CONTACT.email,
                telephone: CONTACT.phoneE164,
                areaServed: "US, CO",
                availableLanguage: ["en", "es"],
              },
            ],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
              { "@type": "ListItem", position: 2, name: "Contact", item: `${ORIGIN}/contact` },
            ],
          }}
        />
      </SEO>

      <PageHeader
        eyebrow="Contact"
        title="Tell us about the process you want to improve."
        lead="A few sentences is enough. We'll reply by email with questions or practical next steps."
        className="lg:pb-10"
      />

      <section aria-label="Contact form and details" className="pb-16 lg:pb-[72px]">
        <Container>
          <Bento>
            <Tile variant="feature" span={{ md: 6, lg: 8 }} rows={{ lg: 3 }} className="p-5 sm:p-9">
              <form id="form" ref={formRef} onSubmit={onSubmit} noValidate className="grid scroll-mt-28 grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Honeypot: hidden from people, filled in by bots */}
                <input type="text" name="website" value={form.website} onChange={onChange} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                <Field label="Name" error={errors.name} errorId="err-name">
                  <input type="text" name="name" required value={form.name} onChange={onChange} autoComplete="name" placeholder="Jane Rivera" className={cn(INPUT, border("name"))} {...invalid("name")} />
                </Field>
                <Field label="Work email" error={errors.email} errorId="err-email">
                  <input type="email" name="email" required value={form.email} onChange={onChange} autoComplete="email" placeholder="jane@company.com" className={cn(INPUT, border("email"))} {...invalid("email")} />
                </Field>
                <Field label="What should the software help with?" error={errors.message} errorId="err-message" className="sm:col-span-2">
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={onChange}
                    placeholder="How the work runs today, who's involved, and what keeps going wrong…"
                    className={cn(INPUT, "min-h-[150px] resize-y py-3", border("message"))}
                    {...invalid("message")}
                  />
                </Field>
                <Field label="Tools you use today" optional errorId="err-tools">
                  <input type="text" name="tools" value={form.tools} onChange={onChange} placeholder="Google Sheets, Jotform…" className={cn(INPUT, "border-[rgb(196_181_253/0.22)]")} />
                </Field>
                <Field label="Phone or WhatsApp" optional error={errors.phone} errorId="err-phone">
                  <PhoneInput
                    country="us"
                    value={form.phoneDigits}
                    onChange={(value, country, _event, formatted) => {
                      const dial = country && "dialCode" in country ? country.dialCode : "";
                      setForm((s) => ({ ...s, phoneDigits: value, phoneDial: dial, phoneDisplay: formatted }));
                    }}
                    enableSearch
                    inputProps={{ name: "phone", autoComplete: "tel", ...invalid("phone") }}
                    containerClass="scs-phone w-full"
                    inputClass={cn(
                      "scs-phone__input !w-full !min-h-12 !rounded-r-[var(--radius-control)] !bg-bg/60 !pl-[4.5rem] !font-sans !text-[15px] !text-ink",
                      errors.phone ? "!border-danger" : "!border-[rgb(196_181_253/0.22)]",
                    )}
                    buttonClass="scs-phone__btn !rounded-l-[var(--radius-control)] !border-[rgb(196_181_253/0.22)]"
                    dropdownClass="scs-phone__dropdown"
                    searchClass="scs-phone__search"
                  />
                </Field>

                <div role="status" aria-live="polite" className="sm:col-span-2 empty:hidden">
                  {status.ok && <p className="m-0 font-medium text-success">Thanks — we'll be in touch shortly.</p>}
                  {status.err && <p className="m-0 text-danger">{status.err}</p>}
                </div>

                <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="m-0 max-w-[440px] text-[13px] leading-normal text-ink-subtle">
                    Sent securely to our inbox and used only to reply to you. See the{" "}
                    <Link to="/privacy" className="text-link">
                      privacy policy
                    </Link>
                    .
                  </p>
                  <Button type="submit" disabled={status.sending} aria-busy={status.sending} className="max-sm:w-full">
                    {status.sending ? "Sending…" : "Send message"}
                  </Button>
                </div>
              </form>
            </Tile>

            <Tile span={{ md: 3, lg: 4 }} className="flex flex-col gap-2 p-6">
              <Eyebrow tone="subtle">Email</Eyebrow>
              <a href={`mailto:${CONTACT.email}`} className="break-all text-base text-link no-underline hover:text-white sm:text-[17px]">
                {CONTACT.email}
              </a>
            </Tile>
            <Tile span={{ md: 3, lg: 4 }} className="flex flex-col gap-2 p-6">
              <Eyebrow tone="subtle">WhatsApp</Eyebrow>
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="text-base text-link no-underline hover:text-white sm:text-[17px]">
                {CONTACT.whatsappDisplay}
              </a>
            </Tile>
            <Tile span={{ md: 6, lg: 4 }} className="flex flex-col gap-2.5 p-6">
              <Eyebrow tone="fuchsia">What happens next</Eyebrow>
              <ol className="m-0 flex flex-col gap-1 pl-[18px] text-sm leading-[1.7] text-ink-muted">
                <li>We read your message and reply by email.</li>
                <li>A short call to understand the workflow.</li>
                <li>A written proposal with scope and milestones.</li>
              </ol>
            </Tile>
          </Bento>
        </Container>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-28 pb-16 lg:pb-[100px]">
        <Container className="flex flex-col gap-6">
          <SectionHeading id="faq-heading" title="Questions" size="md" />
          <Accordion items={CONTACT_FAQ} />
        </Container>
      </section>
    </>
  );
}
