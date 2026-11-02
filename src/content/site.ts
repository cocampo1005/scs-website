// Contact details and navigation shared by every page

export const CONTACT = {
  email: "christian@solidcodesolutionsllc.com",
  phoneDisplay: "+1 (954) 559-2944",
  phoneTel: "tel:+19545592944",
  phoneE164: "+1-954-559-2944",
} as const;

export const SOCIAL_LINKS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/solid-code-solutions-llc" },
  { label: "Instagram", url: "https://www.instagram.com/solidcodesolutions" },
  { label: "Facebook", url: "https://www.facebook.com/solidcodesolutions" },
  { label: "X (Twitter)", url: "https://x.com/SolidCodeSol" },
] as const;

export const PRIMARY_NAV = [
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const PRIMARY_CTA = { label: "Discuss your project", to: "/contact" } as const;

export const TAGLINE = "Custom software built around the way your business works.";

export const COMPANY_DESCRIPTION =
  "We design and build custom web applications for businesses whose work doesn't fit a generic product, and professional websites for businesses that want to be found.";
