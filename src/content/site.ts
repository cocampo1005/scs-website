// Contact details and navigation shared by every page

export const CONTACT = {
  email: "christian@solidcodesolutionsllc.com",
  whatsappDisplay: "+1 (954) 559-2944",
  whatsappUrl: "https://wa.me/19545592944",
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

export const CLIENT_NAMES = [
  "Street Cat Clinic",
  "Cat Solutions 305",
  "Bio-Coatings",
  "Blast-It-Off",
  "Icon Group",
  "A & A Playgrounds",
  "ELC Real Estate",
] as const;
