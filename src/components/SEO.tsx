import type { ReactNode } from "react";
import { DEFAULT_OG_IMAGE, ORIGIN } from "../constants/seo";

export type OgImage = { url: string; width: number; height: number; alt: string };

function toAbs(url: string) {
  return url.startsWith("http") ? url : `${ORIGIN}${url}`;
}

type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: OgImage;
  canonical?: string;
  noindex?: boolean;
  locale?: string;
  siteName?: string;
  children?: ReactNode;
};

/**
 * Title, description, canonical, Open Graph and Twitter tags. React 19 hoists
 * these into <head>; there is no helmet library.
 */
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
}: SEOProps) {
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const url = canonical || toAbs(path);
  const ogImage = toAbs(image.url);

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {!noindex && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
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

      {noindex && <meta name="robots" content="noindex,follow" />}

      {children}
    </>
  );
}
