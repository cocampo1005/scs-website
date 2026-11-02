// Content model for the site. Page components render these; copy lives in
// src/content/*, never in the components.

export type Screenshot = {
  src: string;
  /** Required: every screenshot is described for screen readers */
  alt: string;
  title?: string;
  caption?: string;
};

export type Device = "desktop" | "mobile";

export type LabelledText = { label: string; text: string };

export type CaseStudy = {
  slug: string;
  /** Old `/projects?case=<key>` values that redirect here */
  legacyKeys: readonly string[];
  /** Software case studies lead; websites are a supporting service */
  kind: "software" | "website";
  name: string;
  client: string;
  category: string;
  /** Page H1 */
  title: string;
  summary: string;
  /** Card copy on the homepage and /work */
  teaser: string;
  meta: readonly { label: string; value: string }[];
  cover: Screenshot & { device: Device; caption: string };
  problem: { title: string; points: readonly string[] };
  built: { title: string; points: readonly string[] };
  keyScreens: readonly { label: string; title: string; image: Screenshot; device: Device }[];
  notes: readonly LabelledText[];
  /** Factual outcomes only; no unsourced percentages or multipliers */
  outcomes: readonly string[];
  tech: readonly string[];
  links?: readonly { label: string; url: string }[];
  gallery: readonly { title: string; device: Device; images: readonly Screenshot[] }[];
  cta: { title: string; text: string };
  seo: { title: string; description: string };
};

export type OtherProject = {
  name: string;
  role: string;
  summary: string;
  image: Screenshot;
  url: string;
};

export type ServiceTier = "primary" | "secondary" | "supporting";

export type Service = {
  /** Page anchor on /services, e.g. #custom */
  id: string;
  tier: ServiceTier;
  title: string;
  short: string;
  description: string;
  tags: readonly string[];
};
