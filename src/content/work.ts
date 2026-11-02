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

// Pick a screenshot by index; the arrays are fixed content, so a miss is a bug
function shot<T>(list: readonly T[], i: number): T {
  const item = list[i];
  if (!item) throw new Error(`Missing screenshot ${i}`);
  return item;
}
const shots = <T>(list: readonly T[], indexes: readonly number[]) => indexes.map((i) => shot(list, i));

const streetCatClinic: CaseStudy = {
  slug: "street-cat-clinic",
  legacyKeys: ["street-cat-clinic"],
  kind: "software",
  name: "Street Cat Clinic",
  client: "Street Cat Clinic",
  category: "Custom records management platform",
  title: "From spreadsheets and hand-filled forms to one records platform.",
  summary:
    "Street Cat Clinic tracks every cat it treats and files state TIP forms for those that qualify. We built a desktop-first system that holds the records, applies the clinic's rules and produces the forms.",
  headline:
    "A custom platform that brings patient records, staff workflows and document generation together in one system, replacing fragmented spreadsheets and manual paperwork.",
  teaser: "Patient records, staff roles and generated state forms in one system.",
  meta: [
    { label: "Client", value: "Street Cat Clinic" },
    { label: "Type", value: "Records management platform" },
    { label: "Users", value: "Clinic staff · administrators" },
    { label: "Built with", value: "React · Firebase · PDF engine" },
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
  approach: {
    title: "Start from the forms the clinic already used.",
    text: "We mapped the clinic's patient sheet and the state TIP form first, then designed the data model so one record entry could feed both. The desktop-first layout mirrors the paper the staff already knew, so dense tables and long forms stayed familiar.",
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
  highlights: [
    { title: "Searchable records", text: "Every patient record can be searched, filtered by month and year, and exported in batches." },
    { title: "Role-based access", text: "Staff and administrators each see the tools their role needs." },
    { title: "Generated documents", text: "State TIP forms are filled from the record and exported one at a time or by the month." },
    { title: "Admin-managed settings", text: "Dosage charts and dropdown options are managed in settings, with no code changes." },
  ],
  benefit: "Staff enter each patient once. The records, the forms and the reporting all come from that one entry.",
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
  tour: [
    {
      title: "Records",
      intro: "The patient record is the heart of the system: everything else, from forms to reports, comes from what staff enter here.",
      device: "desktop",
      images: shots(sccScreenshots, [9, 10, 0, 1]),
    },
    {
      title: "TIP forms",
      intro: "The state paperwork that used to be typed by hand is now generated from the record and exported by the month.",
      device: "desktop",
      images: shots(sccScreenshots, [6, 7]),
    },
    {
      title: "Administration",
      intro: "Trappers, dosage charts, dropdown options and accounts are managed by administrators in the app, without a developer.",
      device: "desktop",
      images: shots(sccScreenshots, [4, 5, 2, 3, 8]),
    },
  ],
  cta: {
    title: "Running your operation on spreadsheets and paperwork?",
    text: "Tell us what you track and the documents you produce. We'll suggest a practical first version.",
  },
  seo: {
    title: "Street Cat Clinic: custom records platform case study",
    description:
      "How Solid Code Solutions replaced spreadsheets and hand-filled state TIP forms with a custom records management platform for Street Cat Clinic.",
  },
};

const meowMax: CaseStudy = {
  slug: "meowmax",
  legacyKeys: ["cat-solutions-305", "meowmax"],
  kind: "software",
  name: "MeowMax",
  client: "Cat Solutions 305",
  category: "Custom scheduling and management platform",
  title: "From calls and group messages to self-service clinic booking.",
  summary:
    "Cat Solutions 305 coordinates clinic appointments for a bilingual network of trappers in Miami. MeowMax lets trappers book and release their own slots from their phones, while staff manage capacity, appointments and users from one dashboard.",
  headline:
    "A scheduling platform that gives trappers a convenient way to book appointments while giving administrators centralized visibility, capacity controls and management tools.",
  teaser: "Self-service mobile booking with live capacity and an admin dashboard, in English and Spanish.",
  meta: [
    { label: "Client", value: "Cat Solutions 305" },
    { label: "Type", value: "Scheduling platform" },
    { label: "Users", value: "Trappers · clinic staff · admins" },
    { label: "Built with", value: "React · Firebase · English & Spanish" },
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
  approach: {
    title: "Design for the phone in the field and the desk at the clinic.",
    text: "Trappers book from the field, so booking, release and history were designed for a phone first. Admin tools, capacity and account management got the desktop. Both read the same live data, so a booked slot disappears from every other screen at once.",
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
  highlights: [
    { title: "Mobile booking", text: "Trappers book and release clinic slots from their phones, with each day's capacity shown live." },
    { title: "Capacity enforcement", text: "Daily TNVR and foster limits are enforced at booking, so a full day can't be overbooked." },
    { title: "Admin controls", text: "Staff create, edit and release appointments, adjust availability and manage accounts from one dashboard." },
    { title: "Bilingual", text: "The whole interface works in English and Spanish." },
  ],
  benefit: "Bookings that used to take calls and group messages now happen in the app, and staff see the whole day at a glance.",
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
  tour: [
    {
      title: "Trapper app",
      intro: "What a trapper sees on their phone: booking against live capacity, confirmations, upcoming appointments and the option to release a slot they no longer need.",
      device: "mobile",
      images: mmMobileScreenshots,
    },
    {
      title: "Admin dashboard",
      intro: "What the clinic sees on the desktop: every day's bookings against capacity, tools to book on a trapper's behalf, capacity changes and account management.",
      device: "desktop",
      images: mmDesktopScreenshots,
    },
  ],
  cta: {
    title: "Booking by phone calls and group chats?",
    text: "Tell us how appointments work today and where they break. We'll suggest a practical first version.",
  },
  seo: {
    title: "MeowMax: custom scheduling platform case study",
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
  headline: "A WordPress website with lead magnets, booking flows and CRM tagging, built from nothing for a coaching brand.",
  teaser: "Lead magnets, booking flows and CRM tagging.",
  meta: [
    { label: "Client", value: "Let Me Style Your Career" },
    { label: "Type", value: "Website, funnels and CRM" },
    { label: "Users", value: "Prospective coaching clients" },
    { label: "Built with", value: "WordPress · Elementor · SuperProfile" },
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
  approach: {
    title: "Build the whole path, not just a homepage.",
    text: "Each visitor arrives with a different intent: a free guide, a masterclass or a paid session. The site was planned around those paths first, so every page leads somewhere useful and every signup is recorded with the reason it happened.",
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
  highlights: [
    { title: "Lead capture", text: "A free guide and a masterclass waitlist, each with its own signup path." },
    { title: "Paid booking", text: "1:1 sessions are scheduled and paid for online, with automatic confirmations." },
    { title: "CRM tagging", text: "Every signup is tagged by intent so follow-ups reach the right people." },
  ],
  benefit: "Visitors can download, join or book without any back-and-forth, and the follow-up happens on its own.",
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
  tech: ["WordPress", "Elementor", "Fluent Forms Pro", "SuperProfile", "CRM tagging", "Email sequences"],
  links: [{ label: "Visit Let Me Style Your Career", url: "https://letmestyleyourcareer.com" }],
  tour: [
    {
      title: "The site and its funnels",
      intro: "The pages a prospective client moves through, from the first lead magnet to a paid booking.",
      device: "desktop",
      images: lmsycScreenshots,
    },
  ],
  cta: {
    title: "Need a site that books clients for you?",
    text: "Tell us what you offer and how people sign up today. We'll map the path with you.",
  },
  seo: {
    title: "Let Me Style Your Career: website and funnel case study",
    description:
      "A WordPress website, lead funnels, booking and CRM tagging built from scratch for the coaching brand Let Me Style Your Career.",
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
  headline: "A rebuilt website for Bio-Coatings and a new brand and site for its sister company, linked so each sends customers to the other.",
  teaser: "A rebuilt site and a matching sister brand.",
  meta: [
    { label: "Clients", value: "Bio-Coatings · Blast-It-Off" },
    { label: "Type", value: "Two linked websites" },
    { label: "Scope", value: "Rebuild · logo · new site" },
    { label: "Built with", value: "WordPress · Elementor · SEO" },
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
  approach: {
    title: "Rebuild what worked, then give the sister company a match.",
    text: "Bio-Coatings kept the structure its customers knew, rebuilt on a platform the company controls. Blast-It-Off then got a logo and a site in the same family, with cross-links so a visitor to either business finds the other.",
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
  highlights: [
    { title: "A site the company controls", text: "Bio-Coatings can update its own website again." },
    { title: "A matching new brand", text: "Blast-It-Off launched with a logo and a site in the same family." },
    { title: "Quote forms on both sites", text: "Inquiries from either business arrive through the site." },
  ],
  benefit: "Two related businesses now share one presence, and each sends customers to the other.",
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
  tour: [
    {
      title: "Bio-Coatings",
      intro: "The rebuilt powder-coating site: services, industries, finishes and a quote form.",
      device: "desktop",
      images: bioCoatingsScreenshots,
    },
    {
      title: "Blast-It-Off",
      intro: "The new sandblasting brand, built to match its sister company and link back to it.",
      device: "desktop",
      images: blastItOffScreenshots,
    },
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
];
