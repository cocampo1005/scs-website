export default function Privacy() {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-20 pt-20 md:pt-30 text-gray-200">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
        Privacy Policy
      </h1>
      <p className="mb-4">
        Solid Code Solutions respects your privacy. This website is primarily an
        informational portfolio and does not collect personal data such as
        names, emails, or payment details.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-3 text-fuchsia-300">
        Information We Collect
      </h2>
      <p className="mb-4">
        We do not actively collect personal information. Any data shared through
        the contact form (such as your name or email) is used solely for the
        purpose of responding to your inquiry and is not stored, sold, or shared
        with third parties.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-3 text-fuchsia-300">
        Cookies & Analytics
      </h2>
      <p className="mb-4">
        We may use basic website analytics (such as Google Analytics) to
        understand general site traffic. These tools collect anonymized,
        non-personally identifiable information like page views or browser type.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-3 text-fuchsia-300">
        Your Rights
      </h2>
      <p className="mb-4">
        If you contact us and later wish to have your information deleted, you
        can request this at any time by emailing{" "}
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
