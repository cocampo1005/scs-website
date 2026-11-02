import JsonLd from "../components/JsonLd";
import SEO from "../components/SEO";
import { CONSENT_MAX_AGE_DAYS } from "../consent/consent";
import { useConsent } from "../consent/useConsent";
import {
  CONTACT_EMAIL,
  PRIVACY_LAST_UPDATED,
  formatLegalDate,
} from "../constants/legal";

const H2 = "display text-xl sm:text-2xl mt-12 mb-3 text-ink";
const H3 = "display text-lg mt-8 mb-2 text-ink";
const LINK = "text-link underline underline-offset-2 hover:text-white";
const CODE = "font-mono text-[0.9em] text-ink-soft";

function Email() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
      {CONTACT_EMAIL}
    </a>
  );
}

function External({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {children}
    </a>
  );
}

// What the site stores in the browser. Keep in sync with src/consent and
// src/hooks/useHomeHero.ts; the privacy policy must describe what runs.
const STORAGE = [
  {
    name: "scs:consent",
    kind: "Local storage",
    purpose: "Remembers your cookie choice (what you chose, when, and which version of this notice you answered).",
    setBy: "This site",
    duration: `${Math.round(CONSENT_MAX_AGE_DAYS / 30)} months`,
    category: "Strictly necessary",
  },
  {
    name: "scs:hero-solved",
    kind: "Session storage",
    purpose: "Remembers that you completed the homepage puzzle, so it stays solved while you browse.",
    setBy: "This site",
    duration: "Until the tab is closed",
    category: "Strictly necessary",
  },
  {
    name: "_gcl_au and other Google Ads cookies",
    kind: "Cookies",
    purpose: "Google Ads conversion measurement: lets Google attribute an inquiry to an ad click.",
    setBy: "Google LLC",
    duration: "Set by Google; _gcl_au lasts about three months",
    category: "Advertising measurement (only with your consent)",
  },
];

export default function Privacy() {
  const { openSettings } = useConsent();
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="What information the Solid Code Solutions website collects, which cookies and services it uses, how consent works, and how to reach us about your information."
        path="/privacy"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            url: "https://solidcodesolutionsllc.com/privacy",
            dateModified: PRIVACY_LAST_UPDATED,
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
              {
                "@type": "ListItem",
                position: 2,
                name: "Privacy",
                item: "https://solidcodesolutionsllc.com/privacy",
              },
            ],
          }}
        />
      </SEO>

      <div className="min-h-screen">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 pt-28 lg:pt-40 text-ink-muted leading-relaxed">
          <h1 className="display text-[34px] sm:text-5xl leading-tight mb-3 text-ink">
            Privacy Policy
          </h1>
          <p className="label text-ink-subtle">
            Last updated:{" "}
            <time dateTime={PRIVACY_LAST_UPDATED}>
              {formatLegalDate(PRIVACY_LAST_UPDATED)}
            </time>
          </p>

          <p className="mt-6">
            This policy explains what information Solid Code Solutions LLC
            (“we”, “us”) collects through solidcodesolutionsllc.com, which
            services handle it, what the site stores in your browser, and the
            choices and rights you have. Questions can be sent to <Email />.
          </p>

          <h2 className={H2}>Information you send us</h2>
          <p>
            When you use the contact form, we collect the name, email address
            and message you enter, and a phone number if you choose to give
            one. The form is processed on our own web server and delivered to
            our inbox through our email provider, Hostinger; no other service
            receives it. If you email or call us directly, we receive the
            details you include there.
          </p>
          <p className="mt-3">
            To protect the form from spam and abuse, the server limits how many
            requests and messages can come from one connection. For that it
            briefly stores a pseudonymized (hashed) form of your IP address and
            the time of each request, and deletes these records within 24
            hours. It also keeps a short technical log of form requests (time,
            result and the hashed address) that never includes your name, email
            address or message, and that is overwritten as it grows.
          </p>
          <p className="mt-3">
            We use this information only to reply to you and to discuss or
            deliver the work you ask about. We do not sell it or share it for
            others’ marketing. We keep correspondence for as long as it is
            needed for that purpose and for our ordinary business records.
          </p>

          <h2 className={H2}>Cookies and browser storage</h2>
          <p>
            The site works without any optional cookies. It stores two small
            items that it needs in order to work, and, only if you accept it,
            lets Google set advertising-measurement cookies:
          </p>
          <div className="mt-4 overflow-x-auto" role="region" aria-label="Cookies and browser storage" tabIndex={0}>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  <th scope="col" className="label py-2 pr-4 font-medium text-ink-subtle">Name</th>
                  <th scope="col" className="label py-2 pr-4 font-medium text-ink-subtle">Purpose</th>
                  <th scope="col" className="label py-2 pr-4 font-medium text-ink-subtle">Set by</th>
                  <th scope="col" className="label py-2 pr-4 font-medium text-ink-subtle">Lasts</th>
                  <th scope="col" className="label py-2 font-medium text-ink-subtle">Category</th>
                </tr>
              </thead>
              <tbody>
                {STORAGE.map((row) => (
                  <tr key={row.name} className="border-b border-line align-top">
                    <td className="py-3 pr-4">
                      <span className={CODE}>{row.name}</span>
                      <span className="block text-[12px] text-ink-subtle">{row.kind}</span>
                    </td>
                    <td className="py-3 pr-4">{row.purpose}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{row.setBy}</td>
                    <td className="py-3 pr-4">{row.duration}</td>
                    <td className="py-3">{row.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Local storage and session storage are not cookies, but we list them
            here because they are information kept in your browser. Neither is
            sent to anyone. The site uses no analytics service.
          </p>

          <h2 className={H2}>Your consent choices</h2>
          <p>
            On your first visit a notice offers “Accept all”, “Reject all” and
            “Customize”, with equal weight. Nothing optional runs until you
            accept it, and the site works the same whichever you choose. You
            can change or withdraw your choice at any time from{" "}
            <button type="button" onClick={openSettings} className={`${LINK} cursor-pointer border-0 bg-transparent p-0 font-sans`}>
              Cookie settings
            </button>{" "}
            in the footer of every page. Withdrawing stops any further
            advertising measurement, deletes the Google cookies the site can
            reach, and tells Google’s tag that consent is denied. Your choice is
            kept for {Math.round(CONSENT_MAX_AGE_DAYS / 30)} months, or until this
            notice changes materially, and then we ask again.
          </p>
          <p className="mt-3">
            <strong>Global Privacy Control.</strong> If your browser sends the{" "}
            <External href="https://globalprivacycontrol.org/">Global Privacy Control</External>{" "}
            signal, we treat it as a request not to sell or share your
            information or to use it for targeted advertising: advertising
            measurement stays off unless you turn it on yourself in the cookie
            settings. We publish this commitment at{" "}
            <span className={CODE}>/.well-known/gpc.json</span>.
          </p>

          <h2 className={H2}>Advertising measurement (Google Ads)</h2>
          <p>
            We advertise with Google Ads and use its conversion measurement to
            learn which ads lead to inquiries. It is off by default. The Google
            tag (gtag.js, from googletagmanager.com) is loaded only after you
            accept advertising measurement; before that, no request is made to
            Google and no consent signal is sent to it. This follows Google’s
            Consent Mode in its “basic” form.
          </p>
          <p className="mt-3">
            When you accept, we tell Google’s tag that it may store advertising
            cookies and use advertising data for measurement (
            <span className={CODE}>ad_storage</span> and{" "}
            <span className={CODE}>ad_user_data</span>). We do not grant ad
            personalization or analytics storage (
            <span className={CODE}>ad_personalization</span> and{" "}
            <span className={CODE}>analytics_storage</span> stay denied), so the
            site is not used for remarketing. Google may then set cookies and
            receive information such as your IP address, browser and device
            details and the pages you visit. If you send the contact form while
            consent is on, the tag records a conversion; the content of your
            message is never sent to Google. No conversion is recorded for a
            message that fails to send, or while consent is off.
          </p>
          <p className="mt-3">
            Google’s use of this data is described in{" "}
            <External href="https://policies.google.com/technologies/partner-sites">
              How Google uses information from sites that use its services
            </External>{" "}
            and in{" "}
            <External href="https://business.safety.google/adscookies/">
              Google’s advertising cookies
            </External>
            . You can also control ad personalization in{" "}
            <External href="https://myadcenter.google.com/">My Ad Center</External>.
          </p>

          <h2 className={H2}>Other services the site relies on</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Fonts</strong>: the site’s typefaces are served from our
              own web server; no font provider receives your details.
            </li>
            <li>
              <strong>Hosting</strong>: the site is hosted by Hostinger, whose
              servers keep standard access logs (such as IP address, time and
              page requested) for security and operation.
            </li>
            <li>
              <strong>External links</strong>: links to LinkedIn, Instagram,
              Facebook, X and client websites take you to services with their
              own privacy policies.
            </li>
          </ul>

          <h2 className={H2}>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to ask what
            personal information we hold about you, to have it corrected or
            deleted, to restrict or object to how we use it, to receive a copy
            of it, and to withdraw consent you have given. We do not sell
            personal information, and we do not share it for cross-context
            behavioral advertising.
          </p>
          <h3 className={H3}>European Economic Area, United Kingdom and Switzerland</h3>
          <p>
            We process the information you send us because it is needed to
            respond to your inquiry and for our legitimate interest in running
            our business. Advertising measurement runs only on your consent,
            which you can withdraw at any time as described above. You can
            also lodge a complaint with your data protection authority.
          </p>
          <h3 className={H3}>California and other U.S. states</h3>
          <p>
            You may have the right to know what personal information we collect
            and how we use it, to delete or correct it, and to opt out of its
            sale, sharing or use for targeted advertising. We honor the Global
            Privacy Control signal as an opt-out, and the cookie settings let you
            turn advertising measurement off at any time. We will not treat you
            differently for exercising these rights.
          </p>
          <p className="mt-3">
            To exercise any of these rights, email <Email />. We may ask for
            enough information to confirm that a request concerns your own
            information, and we will reply within the time the applicable law
            allows.
          </p>

          <h2 className={H2}>Changes</h2>
          <p>
            If this policy changes, we will update this page and the date at
            the top. If the change affects what we ask your consent for, the
            cookie notice will ask you again.
          </p>
        </article>
      </div>
    </>
  );
}
