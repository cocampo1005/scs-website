// src/pages/Contact.jsx
import { useRef, useState } from "react";
import { Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../styles/phone-input.css";

import Reveal, { Stagger } from "../components/Reveal";
import GlowCard from "../components/GlowCard";
import heroImg from "../assets/images/contact-beam.webp";
import { WhatsappLogoIcon } from "@phosphor-icons/react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [status, setStatus] = useState({ sending: false, ok: false, err: "" });
  const [errors, setErrors] = useState({});
  const [lastSentAt, setLastSentAt] = useState(0);
  const [openIdx, setOpenIdx] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    phoneRaw: "",
    phoneDial: "",
    phoneLocal: "",
    message: "",
    website: "",
  });

  const formRef = useRef(null);

  const onlyDigits = (s = "") => s.replace(/\D/g, "");

  function isEmail(v = "") {
    // simple, robust email check for UI (server still enforces)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  }

  function validate(form) {
    const errs = {};
    if (!form.name || form.name.trim().length < 2)
      errs.name = "Please enter your name.";
    if (!form.email || !isEmail(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.message || form.message.trim().length < 10)
      errs.message = "Tell us a bit more — at least 10 characters.";

    // phone is optional — validate only if local digits exist
    if (form.phoneLocal) {
      if (form.phoneLocal.length !== 10) {
        errs.phone = "Please enter a 10-digit local number.";
      }
    }

    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus((s) => ({ ...s, err: "", ok: false }));
    setErrors({});

    // Honeypot
    if (formData.website) return;

    // Rate limit after a success (12s)
    const now = Date.now();
    if (now - lastSentAt < 12000) {
      setStatus({
        sending: false,
        ok: false,
        err: "Please wait a moment before sending another message.",
      });
      return;
    }

    // --- PHONE LOGIC ---
    const localDigits = formData.phoneLocal?.trim() || "";
    const dial = formData.phoneDial?.trim() || "";
    let humanPhone = "";
    let whatsAppNumber = "";

    if (localDigits) {
      const cleanLocal = localDigits.replace(/\D/g, ""); // digits only
      if (cleanLocal.length !== 10) {
        setErrors({ phone: "Please enter a 10-digit local number." });
        setStatus({
          sending: false,
          ok: false,
          err: "Please fix the highlighted fields.",
        });
        return;
      }

      // Build WhatsApp raw version (no +)
      whatsAppNumber = `${dial}${cleanLocal}`;

      // Build human-readable version like +1 (954) 559-2944
      const area = cleanLocal.slice(0, 3);
      const prefix = cleanLocal.slice(3, 6);
      const line = cleanLocal.slice(6);
      humanPhone = `+${dial} (${area}) ${prefix}-${line}`;
    }

    // --- NORMAL VALIDATION ---
    const v = {
      ...formData,
      phone: humanPhone, // human-readable for EmailJS
    };
    const errs = validate(v);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setStatus({
        sending: false,
        ok: false,
        err: "Please fix the highlighted fields.",
      });
      return;
    }

    try {
      setStatus({ sending: true, ok: false, err: "" });

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        name: v.name.trim(),
        email: v.email.trim(),
        phone: humanPhone || "—",
        whatsappNumber: whatsAppNumber || "",
        message: v.message.trim(),
        submitted_at: new Date().toLocaleString(),
      };

      // 12s safety timeout so the button can't get stuck
      const sendPromise = emailjs.send(serviceId, templateId, templateParams, {
        publicKey,
      });
      const timeout = new Promise((_, rej) =>
        setTimeout(() => rej(new Error("timeout")), 12000)
      );

      await Promise.race([sendPromise, timeout]);

      setStatus({ sending: false, ok: true, err: "" });
      setLastSentAt(Date.now());
      formRef.current?.reset();
      setFormData({
        name: "",
        email: "",
        phone: "",
        phoneRaw: "",
        phoneDial: "",
        phoneLocal: "",
        message: "",
        website: "",
      });
    } catch (err) {
      let msg =
        "Couldn't send the message right now. Please try again or email us directly.";
      const code = err?.status || err?.code || err?.message;

      if (code === 412)
        msg =
          "Email service isn't fully authorized. Try the email button while we fix it.";
      if (code === 429)
        msg = "Too many attempts. Please wait a moment and try again.";
      if (code === "timeout")
        msg = "Network seems slow. Please try again in a moment.";
      if (
        String(err?.text || "")
          .toLowerCase()
          .includes("invalid")
      ) {
        msg =
          "The email service configuration looks invalid. Use the email button for now.";
      }

      setStatus({ sending: false, ok: false, err: msg });
    }
  }

  const faq = [
    {
      q: "How long does a typical project take?",
      a: "Timelines vary depending on scope — small websites can launch within a few weeks, while full web applications may span several months. Once we understand your goals, we'll outline a clear timeline with milestones and deliverables.",
    },
    {
      q: "What kind of budget should I plan for?",
      a: "Every project is different, but we tailor each solution to fit your scale and goals. After an initial consultation, we'll provide transparent pricing and a detailed scope — ensuring you know exactly what you're getting.",
    },
    {
      q: "Do you work with existing websites or codebases?",
      a: "Yes. Many of our projects involve enhancing or rebuilding existing React, Firebase, or WordPress sites. We focus on improving performance, design consistency, and long-term maintainability without disrupting your current system.",
    },
    {
      q: "What happens after the launch?",
      a: "We provide flexible post-launch support — from ongoing maintenance and performance optimization to hosting and feature expansion. You can choose a maintenance retainer or reach out as needed for updates and improvements.",
    },
    {
      q: "How do we collaborate during the project?",
      a: "Communication is at the core of every successful build. We keep you in the loop through structured updates, shared milestones, and transparent feedback channels — ensuring your vision stays aligned every step of the way.",
    },
  ];

  return (
    <>
      {/* Hero with CTA style background */}
      <section
        className="relative overflow-hidden py-40 md:py-50 px-6 bg-primary-dark-purple bg-center bg-cover"
        aria-labelledby="about-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-primary-dark-purple/80 md:bg-primary-dark-purple/60"
        />
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-primary-dark-purple to-transparent"
        />
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-primary-dark-purple to-transparent"
        />

        <div className="relative z-[1] max-w-6xl mx-auto text-center">
          <Stagger>
            <Reveal
              as="h1"
              id="about-hero"
              className="font-logo text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent"
            >
              Let's Build Something Solid
            </Reveal>
            <Reveal
              as="p"
              className="md:text-xl text-gray-200 max-w-3xl mx-auto"
            >
              Whether you're refining an idea or scaling a product, reach out
              and let's shape it into something dependable, beautiful, and built
              to last.
            </Reveal>
          </Stagger>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        {/* LEFT: Contacts and Form */}
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3 space-y-6 min-w-0">
            <Reveal>
              <h2 className="text-2xl font-display font-bold text-fuchsia-200">
                Contacts
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Email */}
              <Reveal className="min-w-0">
                <GlowCard className="p-5 md:p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-700 ring-1 ring-purple-400/40 flex-shrink-0">
                      <Mail className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-fuchsia-100 mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:christian@solidcodesolutionsllc.com"
                        className="text-sm text-gray-200 hover:text-white underline underline-offset-4 break-words block"
                      >
                        christian@solidcodesolutionsllc.com
                      </a>
                      <p className="text-xs text-white/60 mt-2">
                        Avg response ~24 hrs
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </Reveal>

              {/* WhatsApp */}
              <Reveal delay={80}>
                <GlowCard className="p-5 md:p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 ring-1 ring-emerald-400/40 flex-shrink-0">
                      <WhatsappLogoIcon size={20} weight="fill" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-fuchsia-100 mb-1">
                        WhatsApp
                      </h3>
                      <a
                        href="https://wa.me/19545592944"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-200 hover:text-white underline underline-offset-4 block"
                      >
                        +1 (954) 559-2944
                      </a>
                      <p className="text-xs text-white/60 mt-2">
                        Mon—Fri, 9–6 ET
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal delay={120}>
              <GlowCard className="p-5 md:p-6">
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  noValidate
                >
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <Field label="Your Name *">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className={`w-full px-4 py-3 bg-white/5 border-1 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all
                ${
                  errors.name
                    ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/30"
                    : "border-purple-500/30"
                }`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "err-name" : undefined}
                      placeholder="Jane Doe"
                    />
                    {errors.name && (
                      <p id="err-name" className="mt-1 text-sm text-rose-300">
                        {errors.name}
                      </p>
                    )}
                  </Field>

                  <Field label="Email *">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className={`w-full px-4 py-3 bg-white/5 border-1 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all
                ${
                  errors.email
                    ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/30"
                    : "border-purple-500/30"
                }`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      placeholder="jane@company.com"
                    />
                    {errors.email && (
                      <p id="err-email" className="mt-1 text-sm text-rose-300">
                        {errors.email}
                      </p>
                    )}
                  </Field>

                  {/* PHONE (uses Field for consistent label + spacing) */}
                  <Field label="Phone *" full>
                    <PhoneInput
                      country="us"
                      value={formData.phoneRaw}
                      onChange={(value, country) => {
                        const digits = onlyDigits(value); // e.g. "17021234567"
                        const dial = country?.dialCode || ""; // e.g. "1"
                        const local = digits.startsWith(dial)
                          ? digits.slice(dial.length)
                          : digits; // fallback if user edits mid-string

                        // Build E.164 (+country + local) ONLY if user actually typed local digits
                        const combined = local ? `+${dial}${local}` : "";

                        setFormData((prev) => ({
                          ...prev,
                          phoneRaw: value,
                          phoneDial: dial,
                          phoneLocal: local,
                          phone: combined, // keep your readable +... string for EmailJS
                        }));
                      }}
                      enableSearch
                      disableDropdown={false}
                      inputProps={{ name: "phone", autoComplete: "tel" }}
                      containerClass="scs-phone w-full"
                      inputClass="scs-phone__input !w-full !bg-white/5 !text-white !placeholder-gray-500 !py-3 !pl-[4.5rem] !pr-4 !rounded-r-lg !border !border-purple-500/30 focus:!border-fuchsia-500 focus:!ring-2 focus:!ring-fuchsia-500/20 !transition-all"
                      buttonClass="scs-phone__btn !rounded-l-lg !border !border-purple-500/30"
                      dropdownClass="scs-phone__dropdown"
                      searchClass="scs-phone__search"
                    />
                    {errors.phone && (
                      <p id="err-phone" className="mt-1 text-sm text-rose-300">
                        {errors.phone}
                      </p>
                    )}
                  </Field>

                  <Field label="Tell us about your project *" full>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={7}
                      className={`w-full px-4 py-3 bg-white/5 border-1 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all resize-none
                ${
                  errors.message
                    ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/30"
                    : "border-purple-500/30"
                }`}
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "err-message" : undefined
                      }
                      placeholder="Goals, users, key features, and any links we should see…"
                    />
                    {errors.message && (
                      <p
                        id="err-message"
                        className="mt-1 text-sm text-rose-300"
                      >
                        {errors.message}
                      </p>
                    )}
                  </Field>

                  {/* Status */}
                  <div
                    className="sm:col-span-2 space-y-1"
                    role="status"
                    aria-live="polite"
                  >
                    {status.ok && (
                      <p className="text-emerald-300">
                        Thanks — we'll be in touch shortly.
                      </p>
                    )}
                    {status.err && (
                      <p className="text-rose-300">{status.err}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <a
                      href="mailto:christian@solidcodesolutionsllc.com"
                      className="btn-secondary inline-flex items-center justify-center gap-2"
                    >
                      <Mail className="size-4" />
                      Email Us Instead
                    </a>
                    <button
                      type="submit"
                      disabled={status.sending}
                      className="btn-primary inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-all"
                      aria-busy={status.sending}
                    >
                      {status.sending ? (
                        <motion.span
                          aria-hidden
                          animate={{ x: [0, 6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="inline-flex"
                        >
                          <Send className="size-4" />
                        </motion.span>
                      ) : (
                        <Send className="size-4" aria-hidden />
                      )}
                      {status.sending ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </form>
              </GlowCard>
            </Reveal>
          </div>

          {/* RIGHT: FAQ Accordion */}
          <div className="md:col-span-2 space-y-6">
            <Reveal>
              <h2 className="text-2xl font-display font-bold text-fuchsia-200 mb-2">
                FAQ
              </h2>
            </Reveal>

            {faq.map((item, idx) => {
              const open = openIdx === idx;
              return (
                <div key={idx} className="relative">
                  <Reveal y={8}>
                    <GlowCard
                      className="p-5 md:p-6 cursor-pointer select-none transition-colors hover:bg-white/5"
                      onClick={() => setOpenIdx(open ? null : idx)}
                      role="button"
                      aria-expanded={open}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpenIdx(open ? null : idx);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-white">{item.q}</p>
                        <span
                          className={`text-2xl transition-transform duration-300 ${
                            open ? "rotate-45" : ""
                          }`}
                          aria-hidden
                        >
                          +
                        </span>
                      </div>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-sm text-gray-300 mt-3">{item.a}</p>
                        </div>
                      </div>
                    </GlowCard>
                  </Reveal>

                  {/* Synapse connector (shows only when open) */}
                  {open && (
                    <div
                      aria-hidden
                      className="mx-auto h-6 w-px my-2 bg-gradient-to-b from-fuchsia-500/70 via-purple-400/60 to-transparent blur-[0.5px]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Small helper for consistent inputs ---------- */
function Field({ label, children, full }) {
  // Split label at '*' to color the asterisk separately
  const [mainLabel, isRequired] = label.split("*");

  return (
    <label className={`${full ? "sm:col-span-2" : ""} block`}>
      <span className="block text-sm font-semibold mb-2 text-gray-300">
        {mainLabel.trim()}
        {isRequired !== undefined && (
          <span className="text-accent-fuchsia"> *</span>
        )}
      </span>
      {children}
    </label>
  );
}
