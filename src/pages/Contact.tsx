import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../styles/phone-input.css";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { PageHeader } from "../components/layout/PageHeader";
import { Accordion } from "../components/ui/Accordion";
import { Button } from "../components/ui/Button";
import { Container, Eyebrow } from "../components/ui/Section";
import { cn } from "../components/ui/cn";
import { CONTACT } from "../content/site";
import { CONTACT_FAQ } from "../content/services";
import { findCaseStudy } from "../content/work";
import { ORIGIN } from "../constants/seo";
import { useScrollToHash } from "../hooks/useScrollToHash";
import { MESSAGE_MAX, validateContact } from "../utils/contactValidation";
import { sendContactMessage } from "../utils/contactApi";
import { similarProjectMessage } from "../utils/similarProjectLinks";
// Google Ads conversion (see /privacy): only after the server accepted the
// message, and only with advertising consent
import { recordConversion } from "../consent/googleTag";

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
  hint,
  error,
  errorId,
  className,
  children,
}: {
  label: string;
  optional?: boolean;
  hint?: string;
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
      {hint && !error && <p className="m-0 text-[13px] text-ink-subtle">{hint}</p>}
      {error && (
        <p id={errorId} className="m-0 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function ContactDetail({ icon, label, href, value, external }: { icon: ReactNode; label: string; href: string; value: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="tile tile-interactive flex items-center gap-4 p-4 text-ink no-underline sm:p-5"
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-fuchsia-strong),var(--color-violet-strong))] text-white shadow-[0_10px_24px_-12px_rgb(192_38_211/0.8)]">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="label text-ink-subtle">{label}</span>
        <span className="mt-1 break-all text-[15px] font-medium sm:text-base">{value}</span>
      </span>
    </a>
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

  // "Start a similar project" links prefill the message with the project's context
  useEffect(() => {
    if (searchParams.get("intent") !== "start-similar") return;
    const study = findCaseStudy(searchParams.get("project") ?? undefined);
    const seed = similarProjectMessage(study, searchParams.get("title"));
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
    recordConversion();
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
        description="Tell Solid Code Solutions about the project, problem or idea you have in mind. Reach us through the form, by email or by phone."
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
        title="Let's talk about what you want to build."
        lead="Have a project in mind, a recurring business challenge, or an idea you're not sure how to approach? Tell us a little about it, and we'll explore the possibilities together."
        className="lg:pb-10"
      >
        <div className="mt-8 grid gap-2.5 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:gap-4 lg:max-w-[820px]" aria-label="Contact details">
          <ContactDetail icon={<Mail className="size-5" aria-hidden />} label="Email" href={`mailto:${CONTACT.email}`} value={CONTACT.email} />
          <ContactDetail icon={<Phone className="size-5" aria-hidden />} label="Phone" href={CONTACT.phoneTel} value={CONTACT.phoneDisplay} />
        </div>
      </PageHeader>

      <section aria-label="Contact form and questions" className="pb-16 lg:pb-[100px]">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Form */}
          <div className="tile tile-feature p-5 sm:p-8 lg:col-span-7 lg:p-9">
            <form id="form" ref={formRef} onSubmit={onSubmit} noValidate className="grid scroll-mt-28 grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Honeypot: hidden from people, filled in by bots */}
              <input type="text" name="website" value={form.website} onChange={onChange} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <Field label="Name" error={errors.name} errorId="err-name">
                <input type="text" name="name" required value={form.name} onChange={onChange} autoComplete="name" placeholder="Jane Rivera" className={cn(INPUT, border("name"))} {...invalid("name")} />
              </Field>
              <Field label="Email" error={errors.email} errorId="err-email">
                <input type="email" name="email" required value={form.email} onChange={onChange} autoComplete="email" placeholder="jane@company.com" className={cn(INPUT, border("email"))} {...invalid("email")} />
              </Field>
              <Field
                label="What would you like to build or improve?"
                hint="No technical details needed. The problem, the people involved and what you'd like to be easier is plenty."
                error={errors.message}
                errorId="err-message"
                className="sm:col-span-2"
              >
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={onChange}
                  placeholder="For example: how the work runs today, who's involved, and what keeps going wrong…"
                  className={cn(INPUT, "min-h-[150px] resize-y py-3", border("message"))}
                  {...invalid("message")}
                />
              </Field>
              <Field label="Phone" optional error={errors.phone} errorId="err-phone">
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
              <Field label="Tools you use today" optional hint="Only if it's relevant, e.g. spreadsheets or a booking app." errorId="err-tools">
                <input type="text" name="tools" value={form.tools} onChange={onChange} placeholder="Google Sheets, Jotform…" className={cn(INPUT, "border-[rgb(196_181_253/0.22)]")} />
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
          </div>

          {/* Questions */}
          <aside id="faq" aria-labelledby="faq-heading" className="scroll-mt-28 flex flex-col gap-5 lg:col-span-5">
            <div className="flex flex-col gap-2">
              <Eyebrow>Questions</Eyebrow>
              <h2 id="faq-heading" className="display m-0 text-[26px] sm:text-[30px]">
                Before you write
              </h2>
            </div>
            <Accordion items={CONTACT_FAQ} />
          </aside>
        </Container>
      </section>
    </>
  );
}
