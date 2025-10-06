export default function Terms() {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-20 pt-20 md:pt-30 text-gray-200">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
        Terms of Service
      </h1>
      <p className="mb-4">
        By accessing and using the Solid Code Solutions website, you agree to
        the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-fuchsia-300">
        Use of Content
      </h2>
      <p className="mb-4">
        All content on this site, including text, graphics, and code samples, is
        the property of Solid Code Solutions LLC. You may not copy, reproduce,
        or distribute it without written permission.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-fuchsia-300">
        No Warranties
      </h2>
      <p className="mb-4">
        This site is provided “as is” for informational purposes only. While we
        strive for accuracy, we make no guarantees that the information is
        complete, current, or free of errors.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-fuchsia-300">
        Third-Party Links
      </h2>
      <p className="mb-4">
        Our website may contain links to third-party sites. Solid Code Solutions
        is not responsible for the content or privacy practices of those sites.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-fuchsia-300">
        Limitation of Liability
      </h2>
      <p className="mb-4">
        Solid Code Solutions LLC will not be held liable for any damages or
        losses arising from the use or inability to use this site.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-fuchsia-300">
        Contact
      </h2>
      <p className="mb-4">
        If you have questions about these terms, please contact us at{" "}
        <a
          href="mailto:christian@solidcodesolutionsllc.com"
          className="text-fuchsia-300 underline hover:text-fuchsia-200"
        >
          christian@solidcodesolutionsllc.com
        </a>
        .
      </p>

      <p className="mt-12 text-sm text-gray-400">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </section>
  );
}
