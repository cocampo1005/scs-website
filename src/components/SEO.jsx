import { DEFAULT_OG_IMAGE, ORIGIN } from "../constants/seo";

function toAbs(url) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${ORIGIN}${url}`;
}

export default function SEO({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  canonical,
  noindex = false,
  locale = "en_US",
  siteName = "Solid Code Solutions",
  children,
}) {
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const url = canonical || toAbs(path);
  const ogImage = toAbs(image.url);

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {url && !noindex && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(image.width)} />
      <meta property="og:image:height" content={String(image.height)} />
      <meta property="og:image:alt" content={image.alt} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={image.alt} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,follow" />}

      {children}
    </>
  );
}
