import type { CaseStudy, OtherProject } from "./types";
import {
  bioCoatingsScreenshots,
  blastItOffScreenshots,
  lmsycScreenshots,
  mmDesktopScreenshots,
  mmMobileScreenshots,
  sccScreenshots,
} from "./screenshots";
import iconGroupCover from "../assets/images/icon-group-website-cover.webp";
import aaPlaygroundsCover from "../assets/images/aaplaygrounds-website-cover.webp";
import elcRealEstateCover from "../assets/images/elc-real-estate-website-cover.webp";

// Pick a screenshot by index; the arrays are fixed content, so a miss is a bug
function shot<T>(list: readonly T[], i: number): T {
  const item = list[i];
  if (!item) throw new Error(`Missing screenshot ${i}`);
  return item;
}

const streetCatClinic: CaseStudy = {
  slug: "street-cat-clinic",
  legacyKeys: ["street-cat-clinic"],
  kind: "software",
  name: "Street Cat Clinic",
  client: "Street Cat Clinic",
  category: "Records management platform",
  title: "From spreadsheets and hand-filled forms to one records platform.",
  summary:
    "Street Cat Clinic tracks every cat it treats and files state TIP forms for those that qualify. We built a desktop-first system that holds the records, applies the clinic's rules and produces the forms.",
  teaser:
    "Patient records lived in spreadsheets and state TIP forms were filled out by hand. Now records, roles and the forms they produce live in one system.",
  meta: [
    { label: "Client", value: "Street Cat Clinic" },
    { label: "Type", value: "Records management platform" },
    { label: "Users", value: "Clinic staff · administrators" },
    { label: "Stack", value: "React · Firebase · PDF engine" },
  ],
  cover: {
    ...shot(sccScreenshots, 9),
    device: "desktop",
    caption:
      "Record detail. TIP qualification and outcome come from data the team already enters. Shown with fictional demo data.",
  },
  problem: {
    title: "Paperwork grew with every patient.",
    points: [
      "TIP forms were filled out by hand for every qualifying cat.",
      "Spreadsheets made search, filters and batch exports slow.",
      "There were no shared rules for records, forms and staff permissions.",
    ],
  },
  built: {
    title: "One system shaped around the clinic's rules.",
    points: [
      "Structured records with staff and admin roles.",
      "TIP PDFs generated from each record and exported in batches.",
      "Autofill and dosage rules that cut re-typing and errors.",
      "Admin settings for charts and dropdown options, with no code changes.",
    ],
  },
  keyScreens: [
    { label: "Forms", title: "Batch export by month", image: shot(sccScreenshots, 6), device: "desktop" },
    { label: "Intake", title: "New entry with rule-based autofill", image: shot(sccScreenshots, 0), device: "desktop" },
  ],
  notes: [
    {
      label: "How it's built",
      text: "React and Firebase, with admin and staff roles and a structured data model for records, forms and users. A custom PDF engine fills the state TIP form from each record.",
    },
    {
      label: "Why desktop-first",
      text: "It mirrors the clinic's patient sheets, so dense tables and long forms stay familiar to staff.",
    },
  ],
  outcomes: [
    "TIP forms are generated from each record instead of being filled out by hand.",
    "Records can be searched, filtered by month and year, and exported in batches.",
    "Staff and admins work in one shared system, each with the access their role needs.",
  ],
  tech: ["React", "Firebase Auth", "Firestore", "Tailwind", "Vite", "PDF templates"],
  gallery: [{ title: "All screens", device: "desktop", images: sccScreenshots }],
  cta: {
    title: "Running your operation on spreadsheets?",
    text: "Tell us what you track and the forms you produce. We'll suggest a practical first version.",
  },
  seo: {
    title: "Street Cat Clinic: records platform case study",
    description:
      "How Solid Code Solutions replaced spreadsheets and hand-filled state TIP forms with a React and Firebase records platform for Street Cat Clinic.",
  },
};

const meowMax: CaseStudy = {
  slug: "meowmax",
  legacyKeys: ["cat-solutions-305", "meowmax"],
  kind: "software",
  name: "MeowMax",
  client: "Cat Solutions 305",
  category: "Scheduling platform",
  title: "From calls and group messages to self-service clinic booking.",
  summary:
    "Cat Solutions 305 coordinates clinic appointments for a bilingual network of trappers in Miami. MeowMax lets trappers book and release their own slots from their phones, while staff manage capacity, appointments and users from one dashboard.",
  teaser:
    "Clinic appointments used to be coordinated by calls and messages. Trappers now book and release their own slots, and staff see every day's capacity in real time, in English or Spanish.",
  meta: [
    { label: "Client", value: "Cat Solutions 305" },
    { label: "Type", value: "Scheduling platform" },
    { label: "Users", value: "Trappers · clinic staff · admins" },
    { label: "Stack", value: "React · Firebase · i18n" },
  ],
  cover: {
    ...shot(mmDesktopScreenshots, 0),
    device: "desktop",
    caption: "Appointments manager. Each day's TNVR and foster bookings against capacity. Shown with fictional demo data.",
  },
  problem: {
    title: "Every booking was a conversation.",
    points: [
      "Manual coordination led to double bookings and constant back-and-forth.",
      "Admins had no central view of daily capacity or of the people booking.",
      "Trappers couldn't easily see their upcoming appointments or update their details.",
    ],
  },
  built: {
    title: "Booking that enforces the clinic's capacity.",
    points: [
      "Mobile booking with live TNVR and foster capacity for each day.",
      "Separate trapper and admin portals, with an account for every trapper.",
      "Admin tools to create, edit and release appointments, set availability and manage users.",
      "A complete English and Spanish interface for a bilingual community.",
    ],
  },
  keyScreens: [
    { label: "Trappers", title: "Book on a phone, with capacity shown", image: shot(mmMobileScreenshots, 1), device: "mobile" },
    { label: "Admins", title: "Adjust a day's capacity in seconds", image: shot(mmDesktopScreenshots, 3), device: "desktop" },
  ],
  notes: [
    {
      label: "How it's built",
      text: "React and Firebase with real-time updates, so a booked slot leaves every other screen at once. Authentication separates trapper and admin access.",
    },
    {
      label: "Why mobile-first",
      text: "Trappers book from the field. Booking, release and history are designed for a phone; the admin tools get the desktop.",
    },
  ],
  outcomes: [
    "Trappers book and release clinic appointments themselves, from their phones.",
    "Daily foster and TNR capacity is enforced at booking, so a full day can't be overbooked.",
    "Admins manage appointments, availability and users from one dashboard, in English or Spanish.",
  ],
  tech: ["React", "Firebase Auth", "Firestore", "Real-time", "Tailwind", "i18n (EN/ES)"],
  gallery: [
    { title: "Trapper app", device: "mobile", images: mmMobileScreenshots },
    { title: "Admin dashboard", device: "desktop", images: mmDesktopScreenshots },
  ],
  cta: {
    title: "Booking by phone calls and group chats?",
    text: "Tell us how appointments work today and where they break. We'll suggest a practical first version.",
  },
  seo: {
    title: "MeowMax: scheduling platform case study",
    description:
      "How Solid Code Solutions built MeowMax, a bilingual, capacity-aware clinic booking app for Cat Solutions 305's network of trappers.",
  },
};

const letMeStyleYourCareer: CaseStudy = {
  slug: "let-me-style-your-career",
  legacyKeys: ["let-me-style-your-career"],
  kind: "website",
  name: "Let Me Style Your Career",
  client: "Let Me Style Your Career",
  category: "Website · funnel · CRM",
  title: "A website, funnels and CRM for a coaching brand, built from zero.",
  summary:
    "Let Me Style Your Career started as a personal brand with no website, booking system or funnel. We built the whole digital foundation: a site that captures leads, nurtures them and turns them into paid sessions.",
  teaser: "Lead magnets, booking flows and CRM tagging.",
  meta: [
    { label: "Client", value: "Let Me Style Your Career" },
    { label: "Type", value: "Website, funnels and CRM" },
    { label: "Users", value: "Prospective coaching clients" },
    { label: "Stack", value: "WordPress · Elementor · SuperProfile" },
  ],
  cover: {
    ...shot(lmsycScreenshots, 0),
    device: "desktop",
    caption: "The 1:1 booking flow, from intent to a paid session.",
  },
  problem: {
    title: "A brand with no place to send people.",
    points: [
      "No website or central digital presence.",
      "No way to capture leads for the free guide or the masterclass.",
      "No booking flow or payment path for 1:1 sessions.",
      "Follow-ups and scheduling were handled by hand.",
    ],
  },
  built: {
    title: "A complete funnel, from first visit to booked session.",
    points: [
      "A brand-aligned WordPress website as the foundation.",
      "Lead magnets, a masterclass waitlist and premium 1:1 booking flows.",
      "SuperProfile scheduling, payments and automatic confirmations.",
      "CRM tags for each intent, with automated follow-up sequences.",
    ],
  },
  keyScreens: [
    { label: "Lead capture", title: "Free career guide funnel", image: shot(lmsycScreenshots, 2), device: "desktop" },
    { label: "Conversion", title: "First-booking offer", image: shot(lmsycScreenshots, 4), device: "desktop" },
  ],
  notes: [
    {
      label: "How it's built",
      text: "WordPress and Elementor for the site, Fluent Forms Pro for capture, SuperProfile for scheduling and payments, and CRM tags that record each visitor's intent.",
    },
  ],
  outcomes: [
    "Visitors can download the guide, join the masterclass waitlist or book a paid session without manual back-and-forth.",
    "Every signup is tagged in the CRM by intent, so follow-ups go to the right people.",
    "Confirmations and nurture emails are sent automatically.",
  ],
  tech: ["WordPress", "Elementor", "Fluent Forms Pro", "SuperProfile", "CRM automation", "Email sequences"],
  links: [{ label: "Visit Let Me Style Your Career", url: "https://letmestyleyourcareer.com" }],
  gallery: [{ title: "Screens", device: "desktop", images: lmsycScreenshots }],
  cta: {
    title: "Need a site that books clients for you?",
    text: "Tell us what you offer and how people sign up today. We'll map the funnel with you.",
  },
  seo: {
    title: "Let Me Style Your Career: website and funnel case study",
    description:
      "A WordPress website, lead funnels, booking and CRM automation built from scratch for the coaching brand Let Me Style Your Career.",
  },
};

const bioCoatings: CaseStudy = {
  slug: "bio-coatings-blast-it-off",
  legacyKeys: ["bio-coatings-blast-it-off"],
  kind: "website",
  name: "Bio-Coatings & Blast-It-Off",
  client: "Bio-Coatings · Blast-It-Off",
  category: "Two linked websites",
  title: "Two sister brands, two websites that send visitors to each other.",
  summary:
    "Bio-Coatings had lost access to its website. We rebuilt it with modern SEO structure, then designed a logo and a matching site for Blast-It-Off, the sandblasting company it works with, so the two reinforce each other.",
  teaser: "A rebuilt site and a matching sister brand.",
  meta: [
    { label: "Clients", value: "Bio-Coatings · Blast-It-Off" },
    { label: "Type", value: "Two linked websites" },
    { label: "Scope", value: "Rebuild · logo · new site" },
    { label: "Stack", value: "WordPress · Elementor · SEO" },
  ],
  cover: {
    ...shot(bioCoatingsScreenshots, 0),
    device: "desktop",
    caption: "The rebuilt Bio-Coatings homepage.",
  },
  problem: {
    title: "A website the company couldn't update.",
    points: [
      "Bio-Coatings had lost access to its original site and content.",
      "The two sister companies had no shared branding or links between them.",
      "There were no lead-generation tools, and the Google Business listings were out of date.",
    ],
  },
  built: {
    title: "Two distinct sites with one shared presence.",
    points: [
      "Bio-Coatings rebuilt from scratch, keeping its familiar structure with a modern design and SEO.",
      "A logo and full website for Blast-It-Off that complement Bio-Coatings.",
      "Cross-links that send visitors between the two services.",
      "Quote forms on both sites and refreshed Google Business profiles.",
    ],
  },
  keyScreens: [
    { label: "Bio-Coatings", title: "Services with a quote call to action", image: shot(bioCoatingsScreenshots, 1), device: "desktop" },
    { label: "Blast-It-Off", title: "A new brand, built to match", image: shot(blastItOffScreenshots, 0), device: "desktop" },
  ],
  notes: [],
  outcomes: [
    "Bio-Coatings regained a website it can update, rebuilt with modern SEO structure.",
    "Blast-It-Off launched with a logo and site that match its sister company.",
    "The two sites refer visitors to each other and route inquiries through quote forms.",
  ],
  tech: ["WordPress", "Elementor", "Logo design", "SEO", "Google Business", "Cross-site linking"],
  links: [
    { label: "Visit Bio-Coatings", url: "https://bio-coatings.com" },
    { label: "Visit Blast-It-Off", url: "https://blast-it-off.com" },
  ],
  gallery: [
    { title: "Bio-Coatings", device: "desktop", images: bioCoatingsScreenshots },
    { title: "Blast-It-Off", device: "desktop", images: blastItOffScreenshots },
  ],
  cta: {
    title: "Lost access to your website, or never had one that works?",
    text: "Tell us about your business and what the site should do. We'll suggest a practical plan.",
  },
  seo: {
    title: "Bio-Coatings & Blast-It-Off: website case study",
    description:
      "A rebuilt website for Bio-Coatings and a new brand and website for its sister company Blast-It-Off, linked to send customers to each other.",
  },
};

/** Software first, then websites (docs/design-review.md, decision 8) */
export const CASE_STUDIES: readonly CaseStudy[] = [streetCatClinic, meowMax, letMeStyleYourCareer, bioCoatings];

export const SOFTWARE_CASES = CASE_STUDIES.filter((c) => c.kind === "software");
export const WEBSITE_CASES = CASE_STUDIES.filter((c) => c.kind === "website");

export function findCaseStudy(slug: string | undefined): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** `/projects?case=<key>` → the case study's new slug */
export function slugForLegacyKey(key: string | null): string | undefined {
  if (!key) return undefined;
  return CASE_STUDIES.find((c) => c.legacyKeys.includes(key))?.slug;
}

export function nextCaseStudy(slug: string): CaseStudy {
  const i = CASE_STUDIES.findIndex((c) => c.slug === slug);
  return CASE_STUDIES[(i + 1) % CASE_STUDIES.length] ?? streetCatClinic;
}

export const workPath = (slug: string) => `/work/${slug}`;

export const OTHER_PROJECTS: readonly OtherProject[] = [
  {
    name: "Icon Group",
    role: "WordPress rebuild",
    summary: "A redesign and rebuild that showcases the firm's engineering services and certifications.",
    image: { src: iconGroupCover, alt: "Icon Group Engineers & Contractors website" },
    url: "https://icongroupusa.com/",
  },
  {
    name: "A & A Recreations",
    role: "WordPress website",
    summary: "Refreshed branding, service pages and project visuals for an outdoor recreation company.",
    image: { src: aaPlaygroundsCover, alt: "A & A Playgrounds website" },
    url: "https://aaplaygrounds.com/",
  },
  {
    name: "ELC Real Estate",
    role: "Wix optimization",
    summary: "Cleaner layouts, better mobile behaviour and improved SEO on an existing site.",
    image: { src: elcRealEstateCover, alt: "ELC Real Estate website" },
    url: "https://www.elchomes.com/",
  },
];
