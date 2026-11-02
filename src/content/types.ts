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

export type TitledText = { title: string; text: string };

/** A group of screens in a case study's product walkthrough */
export type TourGroup = {
  title: string;
  /** Why this part of the product matters */
  intro: string;
  device: Device;
  images: readonly Screenshot[];
};

export type CaseStudy = {
  slug: string;
  /** Old `/projects?case=<key>` values that redirect here */
  legacyKeys: readonly string[];
  /** Software case studies lead; websites are the secondary service */
  kind: "software" | "website";
  name: string;
  client: string;
  /** e.g. "Custom records management platform" */
  category: string;
  /** Page H1 */
  title: string;
  summary: string;
  /** Short description on featured cards (homepage, /work) */
  headline: string;
  /** One line for compact cards */
  teaser: string;
  meta: readonly { label: string; value: string }[];
  cover: Screenshot & { device: Device; caption: string };
  /** The challenge */
  problem: { title: string; points: readonly string[] };
  /** How we approached it */
  approach: TitledText;
  /** What we built */
  built: { title: string; points: readonly string[] };
  /** Important capabilities, as shown on cards and in the case study */
  highlights: readonly TitledText[];
  /** The practical benefit in one sentence */
  benefit: string;
  keyScreens: readonly { label: string; title: string; image: Screenshot; device: Device }[];
  notes: readonly LabelledText[];
  /** Factual outcomes only; no unsourced percentages or multipliers */
  outcomes: readonly string[];
  tech: readonly string[];
  links?: readonly { label: string; url: string }[];
  /** Product walkthrough, grouped by capability */
  tour: readonly TourGroup[];
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

export type ServiceTier = "primary" | "secondary";

export type Service = {
  /** Page anchor on /services, e.g. #custom */
  id: string;
  tier: ServiceTier;
  title: string;
  short: string;
  description: string;
  /** Examples of what the service covers */
  tags: readonly string[];
};

/** Kinds of application we can build; illustrated with a small UI vignette */
export type ApplicationType = {
  id: string;
  title: string;
  text: string;
  vignette: "records" | "calendar" | "board" | "portal" | "invoice" | "chart";
};

export type ProcessStep = {
  step: string;
  text: string;
};
