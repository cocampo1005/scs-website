import JsonLd from "../components/JsonLd";
import SEO from "../components/SEO";
import { TERMS_LAST_UPDATED, formatLegalDate } from "../constants/legal";

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms and conditions for using the Solid Code Solutions website."
        path="/terms"
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            url: "https://solidcodesolutionsllc.com/terms",
            dateModified: TERMS_LAST_UPDATED,
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
                name: "Terms",
                item: "https://solidcodesolutionsllc.com/terms",
              },
            ],
          }}
        />
      </SEO>

      <div className="min-h-screen">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 pt-28 lg:pt-40 text-ink-muted leading-relaxed">
          <h1 className="display text-[34px] sm:text-5xl leading-tight mb-6 text-ink">
            Terms of Service
          </h1>
          <p className="mb-4">
            By accessing and using the Solid Code Solutions website, you agree
            to the following terms and conditions.
          </p>

          <h2 className="display text-xl sm:text-2xl mt-12 mb-3 text-ink">
            Use of Content
          </h2>
          <p className="mb-4">
            All content on this site, including text, graphics, and code
            samples, is the property of Solid Code Solutions LLC. You may not
            copy, reproduce, or distribute it without written permission.
          </p>

          <h2 className="display text-xl sm:text-2xl mt-12 mb-3 text-ink">
            No Warranties
          </h2>
          <p className="mb-4">
            This site is provided “as is” for informational purposes only. While
            we strive for accuracy, we make no guarantees that the information
            is complete, current, or free of errors.
          </p>

          <h2 className="display text-xl sm:text-2xl mt-12 mb-3 text-ink">
            Third-Party Links
          </h2>
          <p className="mb-4">
            Our website may contain links to third-party sites. Solid Code
            Solutions is not responsible for the content or privacy practices of
            those sites.
          </p>

          <h2 className="display text-xl sm:text-2xl mt-12 mb-3 text-ink">
            Limitation of Liability
          </h2>
          <p className="mb-4">
            Solid Code Solutions LLC will not be held liable for any damages or
            losses arising from the use or inability to use this site.
          </p>

          <h2 className="display text-xl sm:text-2xl mt-12 mb-3 text-ink">
            Contact
          </h2>
          <p className="mb-4">
            If you have questions about these terms, please contact us at{" "}
            <a
              href="mailto:christian@solidcodesolutionsllc.com"
              className="text-link underline underline-offset-2 hover:text-white"
            >
              christian@solidcodesolutionsllc.com
            </a>
            .
          </p>

          <p className="mt-12 label text-ink-subtle">
            Last updated:{" "}
            <time dateTime={TERMS_LAST_UPDATED}>
              {formatLegalDate(TERMS_LAST_UPDATED)}
            </time>
          </p>
        </section>
      </div>
    </>
  );
}
