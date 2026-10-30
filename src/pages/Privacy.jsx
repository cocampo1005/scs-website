import JsonLd from "../components/JsonLd";
import SEO from "../components/SEO";
import {
  CONTACT_EMAIL,
  PRIVACY_LAST_UPDATED,
  formatLegalDate,
} from "../constants/legal";

const H2 = "text-xl font-semibold mt-10 mb-3 text-fuchsia-300";
const LINK = "text-fuchsia-300 underline hover:text-fuchsia-200";

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

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="What information the Solid Code Solutions website collects, which services process it, and how to reach us about it."
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
        <article className="max-w-3xl mx-auto px-6 pb-20 pt-28 md:pt-36 text-gray-200 leading-relaxed">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">
            Last updated:{" "}
            <time dateTime={PRIVACY_LAST_UPDATED}>
              {formatLegalDate(PRIVACY_LAST_UPDATED)}
            </time>
          </p>

          <p className="mt-6">
            This policy explains what information Solid Code Solutions LLC
            (“we”, “us”) collects through solidcodesolutionsllc.com, which
            services handle it, and the choices you have. Questions can be sent
            to <Email />.
          </p>

          <h2 className={H2}>Information you send us</h2>
          <p>
            When you use the contact form, we collect the name, email address
            and message you enter, and a phone or WhatsApp number if you choose
            to give one. The form is processed on our own web server and
            delivered to our inbox through our email provider, Hostinger; no
            other service receives it. If you email us or message us on
            WhatsApp directly, we receive the details you include there.
          </p>
          <p className="mt-3">
            To protect the form from spam and abuse, the server limits how many
            requests and messages can come from one connection. For that it
            briefly stores a pseudonymized (hashed) form of your IP address and
            the time of each request, and deletes these records within 24
            hours. It also keeps a
            short technical log of form requests (time, result and the hashed
            address) that never includes your name, email address or message,
            and that is overwritten as it grows.
          </p>
          <p className="mt-3">
            We use this information only to reply to you and to discuss or
            deliver the work you ask about. We do not sell it or share it for
            others’ marketing. We keep correspondence for as long as it is
            needed for that purpose and for our ordinary business records.
          </p>

          <h2 className={H2}>Advertising measurement (Google Ads)</h2>
          <p>
            Every page loads Google’s tag (gtag.js) for Google Ads conversion
            measurement. Google may set cookies and receive information such as
            your IP address, browser and device details, and the pages you
            visit. When you send the contact form, the tag records a conversion
            so we can see which ads lead to inquiries; the content of your
            message is not sent to Google. Google’s use of this data is
            described in{" "}
            <External href="https://policies.google.com/technologies/partner-sites">
              How Google uses information from sites that use its services
            </External>
            . You can limit ad personalization in{" "}
            <External href="https://myadcenter.google.com/">My Ad Center</External>{" "}
            and block cookies in your browser settings.
          </p>

          <h2 className={H2}>Other services the site relies on</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google Fonts</strong>: typefaces load from Google’s
              servers, which receive your IP address and browser details.
            </li>
            <li>
              <strong>Hosting</strong>: the site is hosted by Hostinger, whose
              servers keep standard access logs (such as IP address, time and
              page requested) for security and operation.
            </li>
            <li>
              <strong>External links</strong>: links to WhatsApp, LinkedIn,
              Instagram, Facebook, X and client websites take you to services
              with their own privacy policies.
            </li>
          </ul>
          <p className="mt-3">
            The site itself does not use analytics beyond the Google tag above
            and does not store information in your browser’s local storage.
          </p>

          <h2 className={H2}>Your choices</h2>
          <p>
            You can ask us what information we hold about you, ask us to correct
            or delete it, or withdraw from further contact, by emailing{" "}
            <Email />.
          </p>

          <h2 className={H2}>Changes</h2>
          <p>
            If this policy changes, we will update this page and the date at
            the top.
          </p>
        </article>
      </div>
    </>
  );
}
