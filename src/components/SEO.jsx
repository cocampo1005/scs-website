const ORIGIN = "https://solidcodesolutionsllc.com";

function toAbs(url) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${ORIGIN}${url}`;
}

export default function SEO({
  title,
  description,
  path = "/",
  image = "/assets/og/og-default.webp",
  canonical, // optional absolute override
  noindex = false,
  children, // extra tags like JSON-LD
}) {
  const fullTitle = title
    ? `${title} | Solid Code Solutions`
    : "Solid Code Solutions";
  const url = canonical || toAbs(path);
  const ogImage = toAbs(image);

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      {url && <link rel="canonical" href={url} />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {children}
    </>
  );
}
