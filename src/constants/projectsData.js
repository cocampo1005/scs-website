import SCCHero from "../assets/projects/street-cat/street-cat-clinic-case-study-hero.webp";
import MMHero from "../assets/projects/meowmax/meowmax-case-study-hero.webp";
import BIOHero from "../assets/projects/bio/bio-case-study-hero.webp";
import { Award, BarChart3, Clock, Rocket } from "lucide-react";

// Street Cat Clinic Screenshots
import sccScreenshot1 from "../assets/projects/street-cat/street-cat-clinic-new-entry-form.webp";
import sccScreenshot2 from "../assets/projects/street-cat/street-cat-clinic-edit-record.webp";
import sccScreenshot3 from "../assets/projects/street-cat/street-cat-clinic-settings-chart.webp";
import sccScreenshot4 from "../assets/projects/street-cat/street-cat-clinic-settings-options.webp";
import sccScreenshot5 from "../assets/projects/street-cat/street-cat-clinic-trappers-list.webp";
import sccScreenshot6 from "../assets/projects/street-cat/street-cat-clinic-add-new-trapper.webp";
import sccScreenshot7 from "../assets/projects/street-cat/street-cat-clinic-forms-filtered.webp";
import sccScreenshot8 from "../assets/projects/street-cat/street-cat-clinic-forms-page.webp";
import sccScreenshot9 from "../assets/projects/street-cat/street-cat-clinic-profile-page.webp";
import sccScreenshot10 from "../assets/projects/street-cat/street-cat-clinic-records-details.webp";
import sccScreenshot11 from "../assets/projects/street-cat/street-cat-clinic-records-filtered.webp";

// MeowMax Desktop Screenshots
import mmScreenshot1 from "../assets/projects/meowmax/meowmax-accounts-manager.webp";
import mmScreenshot2 from "../assets/projects/meowmax/meowmax-appointments-manager-daily.webp";
import mmScreenshot3 from "../assets/projects/meowmax/meowmax-manage-appointments.webp";
import mmScreenshot4 from "../assets/projects/meowmax/meowmax-manager-appointment.webp";
import mmScreenshot5 from "../assets/projects/meowmax/meowmax-edit-capacity-modal.webp";

// MeowMax Mobile Screenshots
import mmMob1 from "../assets/projects/meowmax/meowmax-home-dashboard.webp";
import mmMob2 from "../assets/projects/meowmax/meowmax-book-appointment.webp";
import mmMob3 from "../assets/projects/meowmax/meowmax-appointment-confirmation.webp";
import mmMob4 from "../assets/projects/meowmax/meowmax-upcoming-appointments.webp";
import mmMob5 from "../assets/projects/meowmax/meowmax-appointment-details.webp";
import mmMob6 from "../assets/projects/meowmax/meowmax-upcoming-appointments-release-all.webp";
import mmMob7 from "../assets/projects/meowmax/meowmax-confirm-release-all.webp";
import mmMob8 from "../assets/projects/meowmax/meowmax-fully-booked.webp";
import mmMob9 from "../assets/projects/meowmax/meowmax-appointments-history.webp";
import mmMob10 from "../assets/projects/meowmax/meowmax-user-profile.webp";

// Bio-Coatings Screenshots
import BioHomepage from "../assets/projects/bio/bio-coatings-homepage.webp";
import BioServices from "../assets/projects/bio/bio-coatings-services-page.webp";
import BioAutomotiveIndustry from "../assets/projects/bio/bio-coatings-automative-industry.webp";
import BioAutomotiveFinish from "../assets/projects/bio/bio-coatings-automative-finish.webp";
import BioConnectBlast from "../assets/projects/bio/bio-coatings-connect-to-blast-it-off.webp";
import BioContact from "../assets/projects/bio/bio-coatings-contact.webp";
import BioFooter from "../assets/projects/bio/bio-coatings-footer.webp";

// Blast-It-Off Screenshots
import BlastHomepage from "../assets/projects/bio/blast-it-off-homepage.webp";
import BlastServices from "../assets/projects/bio/blast-it-off-services-page.webp";
import BlastAutomotive from "../assets/projects/bio/blast-it-off-automative-industry.webp";
import BlastMediaTypes from "../assets/projects/bio/blast-it-off-media-types-page.webp";
import BlastConnectBio from "../assets/projects/bio/blast-it-off-connect-to-bio-coatings.webp";
import BlastContact from "../assets/projects/bio/blast-it-off-contact.webp";
import BlastFooter from "../assets/projects/bio/blast-it-off-footer.webp";

// Client Logos for Logo Loop
import aaplaygrounds from "../assets/logos/client-logos/aaplaygrounds-logo.svg";
import flats from "../assets/logos/client-logos/flats-at-bradenton-logo.svg";
import gold from "../assets/logos/client-logos/gold-standard-care-logo.svg";
import pinnacle from "../assets/logos/client-logos/pinnacle-smp-logo.svg";
import iconGroup from "../assets/logos/client-logos/icon-group-logo.svg";
import rochies from "../assets/logos/client-logos/rochies-bridal-logo.svg";
import scc from "../assets/logos/client-logos/street-cat-clinic-logo.svg";
import meowmax from "../assets/logos/client-logos/meowmax-logo.svg";
import blast from "../assets/logos/client-logos/blast-it-off-logo.svg";
import bio from "../assets/logos/client-logos/bio-coatings-logo.svg";
import elc from "../assets/logos/client-logos/elc-real-estate-logo.svg";
import lwp from "../assets/logos/client-logos/lwp-logo.svg";

// Other Project Website Covers
import iconGroupCover from "../assets/images/icon-group-website-cover.webp";
import aaPlaygroundsCover from "../assets/images/aaplaygrounds-website-cover.webp";
import elcRealEstateCover from "../assets/images/elc-real-estate-website-cover.webp";

const sccScreenshots = [
  {
    src: sccScreenshot1,
    alt: "Street Cat Clinic new record entry form.",
    title: "Street Cat Clinic – Record Entry Form",
    caption:
      "Admins and staff can create or edit records directly in the interface that mirrors their physical patient forms, featuring autofill logic for standard fields.",
  },
  {
    src: sccScreenshot2,
    alt: "Street Cat Clinic edit record screen of auto-generated MDAS TIP PDFs with preview buttons.",
    title: "Street Cat Clinic – Edit Record View",
    caption:
      "The Edit Record interface allows staff to update patient details, dosage data, and vaccination records, with auto-generated MDAS TIP PDFs for qualifying cats.",
  },
  {
    src: sccScreenshot3,
    alt: "Street Cat Clinic settings page displaying dosage chart configuration and dropdown options.",
    title: "Admin Settings – Dosage Chart Configuration",
    caption:
      "Admins can manage dosage charts and dropdown presets for procedures, breeds, and outcomes, ensuring consistency across all records and form entries.",
  },
  {
    src: sccScreenshot4,
    alt: "Street Cat Clinic settings panel for customizing dropdown options such as services, surgeries, and colors.",
    title: "Admin Settings – Customizable Dropdown Options",
    caption:
      "All dropdown menus throughout the app are dynamically managed, allowing staff to add, edit, or remove service types, surgeries, and other predefined options.",
  },
  {
    src: sccScreenshot5,
    alt: "Street Cat Clinic trappers list view showing names, addresses, and codes for each registered trapper.",
    title: "Trappers Directory – Record Overview",
    caption:
      "The Trappers directory provides admins with a searchable list of all active trappers, including contact information, unique codes, and assigned IDs. (Trapper info is mock data)",
  },
  {
    src: sccScreenshot6,
    alt: "Street Cat Clinic add trapper form with fields for name, contact information, address, and signature upload.",
    title: "Add New Trapper – Registration Form",
    caption:
      "Admins can onboard new trappers using a simple registration form that captures all necessary contact details and verifies eligibility for TIP participation. Trapper info and signatures are used for filling out and signing the auto-generated MDAS TIP forms.",
  },
  {
    src: sccScreenshot7,
    alt: "Street Cat Clinic TIP forms page with filters for month and year, and batch export options.",
    title: "TIP Forms – Filtered and Export View",
    caption:
      "The TIP Forms page allows staff to filter by date and export multiple MDAS TIP PDFs at once, streamlining monthly reporting and compliance tasks.",
  },
  {
    src: sccScreenshot8,
    alt: "Street Cat Clinic TIP forms table view showing list of generated PDF files and batch download options.",
    title: "TIP Forms – Batch Management",
    caption:
      "Staff can browse, filter, and batch-download generated MDAS TIP forms directly from the web interface for recordkeeping and submission.",
  },
  {
    src: sccScreenshot9,
    alt: "Street Cat Clinic user profile page displaying account information and password reset option.",
    title: "User Profile – Account Management",
    caption:
      "Each user has access to a profile section with role-based details, contact information, and secure password reset functionality.",
  },
  {
    src: sccScreenshot10,
    alt: "Street Cat Clinic records page displaying detailed patient information with TIP qualification and outcome status.",
    title: "Records Dashboard – Patient Details",
    caption:
      "The Records dashboard consolidates patient data, vaccination history, outcomes, and TIP qualification status into a unified, easy-to-review layout.",
  },
  {
    src: sccScreenshot11,
    alt: "Street Cat Clinic records filter interface with month and year filters for viewing cat entries by intake date.",
    title: "Records Dashboard – Search and Filter",
    caption:
      "Staff can quickly filter records by date range, trapper, or service type, making data retrieval fast and efficient for reporting and audits. Records can also be batch exported for external storage.",
  },
];

const mmDesktopScreenshots = [
  {
    src: mmScreenshot2,
    alt: "MeowMax appointments manager showing daily TNVR and Foster breakdown with capacity bars.",
    title: "Appointments Manager — Daily Overview",
    caption:
      "A single view of TNVR and foster bookings for the selected day, with live capacity indicators and quick access to each trapper’s slots.",
  },
  {
    src: mmScreenshot3,
    alt: "MeowMax manager view showing appointment details with notes and Release controls.",
    title: "Manage Appointments — Details & Release",
    caption:
      "Drill into any trapper to review notes and release individual appointments directly from the manager panel.",
  },
  {
    src: mmScreenshot4,
    alt: "MeowMax modal to create a new appointment from the manager dashboard with date, trapper, and slot inputs.",
    title: "Create Appointment — Book on Behalf",
    caption:
      "Admins can book appointments on behalf of any trapper, selecting the date and allocating TNVR or foster slots from the same screen.",
  },
  {
    src: mmScreenshot5,
    alt: "MeowMax edit capacity modal for adjusting TNVR or Foster limits for a specific date.",
    title: "Edit Capacity — Adjust Daily Limits",
    caption:
      "Fine-tune daily TNVR or foster capacity in seconds to reflect real-time clinic availability.",
  },
  {
    src: mmScreenshot1,
    alt: "MeowMax accounts manager dashboard with user details, performance metrics, and searchable table.",
    title: "Accounts Manager — Admin Dashboard",
    caption:
      "Centralized admin tooling for user records, performance metrics, and regional filters across the trappers network.",
  },
];

const mmMobileScreenshots = [
  {
    src: mmMob1,
    alt: "MeowMax mobile home screen showing upcoming TNVR and Foster appointments and a Book Appointment button.",
    title: "Home — Upcoming At-a-Glance",
    caption:
      "A lightweight dashboard surfaces the next TNVR and foster counts with a clear call to book new appointments.",
  },
  {
    src: mmMob2,
    alt: "MeowMax mobile calendar with TNVR and Foster slot inputs and optional notes field.",
    title: "Book Appointment — Calendar & Slots",
    caption:
      "Pick a date and allocate TNVR/Foster slots with live capacity bars and optional visit notes.",
  },
  {
    src: mmMob3,
    alt: "MeowMax confirmation modal showing date, clinic address, and booked slot totals.",
    title: "Confirmation — Appointments Booked",
    caption:
      "After booking, a confirmation summarizes the day, location, and slot totals for quick verification.",
  },
  {
    src: mmMob4,
    alt: "MeowMax mobile Upcoming Appointments view with expandable day cards.",
    title: "Appointments — Upcoming",
    caption:
      "Expandable cards organize daily TNVR and foster bookings so trappers can scan what’s next.",
  },
  {
    src: mmMob5,
    alt: "MeowMax appointment details card with notes and a Release Appointment action.",
    title: "Appointment Details — Notes & Release",
    caption:
      "Drill into a single booking to review notes and release it if plans change.",
  },
  {
    src: mmMob6,
    alt: "MeowMax upcoming appointments list with a Release All button for the selected date.",
    title: "Bulk Actions — Release All",
    caption:
      "When needed, release every appointment for a date with one action from the Upcoming list.",
  },
  {
    src: mmMob7,
    alt: "MeowMax modal asking to confirm releasing all appointments for a selected date.",
    title: "Confirm Bulk Release",
    caption:
      "A safety confirmation prevents accidental cancellations when releasing appointments.",
  },
  {
    src: mmMob8,
    alt: "MeowMax booking calendar showing MeowMaxed message that all slots are fully booked.",
    title: "Fully Booked — MeowMaxed",
    caption:
      "If a day reaches capacity, the app clearly communicates that no more slots are available.",
  },
  {
    src: mmMob9,
    alt: "MeowMax Appointments History tab listing previous TNVR counts by date.",
    title: "Appointments — History",
    caption:
      "Look back at previous TNVR/foster sessions to track participation over time.",
  },
  {
    src: mmMob10,
    alt: "MeowMax user profile with contact info, region, and appointment metrics.",
    title: "Profile — Trapper Information",
    caption:
      "Profile centralizes contact details, region, language, and booking metrics with quick access to edit.",
  },
];

export const bioCoatingsScreenshots = [
  {
    src: BioHomepage,
    title: "Homepage — Bio-Coatings",
    caption:
      "The redesigned homepage emphasizes the company’s expertise in powder coating with strong visuals, bold calls to action, and improved SEO structure.",
  },
  {
    src: BioServices,
    title: "Services Page — Powder Coating & More",
    caption:
      "Showcases Bio-Coatings’ full range of surface finishing services with clear sections and a lead-focused 'Request a Quote' CTA.",
  },
  {
    src: BioAutomotiveIndustry,
    title: "Industry Page — Automotive Powder Coating",
    caption:
      "Dedicated industry page highlighting professional automotive powder coating, optimized for relevant search terms and client targeting.",
  },
  {
    src: BioAutomotiveFinish,
    title: "Finishes Page — Automotive Metallic",
    caption:
      "Features high-gloss metallic finishes with a call-to-action phone link for instant mobile conversions.",
  },
  {
    src: BioConnectBlast,
    title: "Cross-Promotion — Blast-It-Off Section",
    caption:
      "Integrated section promoting the sister company Blast-It-Off, visually tying both brands together for mutual traffic and authority.",
  },
  {
    src: BioContact,
    title: "Contact & Quote Page",
    caption:
      "Simplified quote request form with integrated map, ensuring direct inquiries and optimized local SEO via embedded Google Business listing.",
  },
  {
    src: BioFooter,
    title: "Footer Navigation — Industries & Services Overview",
    caption:
      "Comprehensive footer design linking all service categories and industries, with structured navigation for SEO clarity and usability.",
  },
];

export const blastItOffScreenshots = [
  {
    src: BlastHomepage,
    title: "Homepage — Blast-It-Off",
    caption:
      "A bold, modern homepage introducing the sandblasting brand with a dark, star-speckled motif, clear CTAs, and service highlights optimized for conversion.",
  },
  {
    src: BlastServices,
    title: "Services Page — Comprehensive Sandblasting",
    caption:
      "Outlines the company’s full suite of sandblasting services with educational sections on benefits, applications, and process transparency.",
  },
  {
    src: BlastAutomotive,
    title: "Industry Page — Automotive Sandblasting",
    caption:
      "Showcases automotive sandblasting with visual storytelling and a bright orange CTA to encourage quote requests from car enthusiasts and restorers.",
  },
  {
    src: BlastMediaTypes,
    title: "Media Types Page — Sandblasting Materials",
    caption:
      "Educational page explaining various blasting media and their properties, designed to improve SEO relevance and customer understanding.",
  },
  {
    src: BlastConnectBio,
    title: "Cross-Promotion — Bio-Coatings Partnership",
    caption:
      "Features the Bio-Coatings armadillo logo with a detailed explanation of how both companies complement each other’s services for a full finishing solution.",
  },
  {
    src: BlastContact,
    title: "Contact & Quote Page",
    caption:
      "Simple, friction-free contact form with large, accessible buttons and clear local business info for improved lead conversion.",
  },
  {
    src: BlastFooter,
    title: "Footer Navigation — Overview & Media Types",
    caption:
      "A structured footer featuring service categories, media types, and business information, unified visually with the orange-navy brand palette.",
  },
];

export const CASE_STUDIES = [
  {
    key: "street-cat-clinic",
    title: "Street Cat Clinic — Records Platform",
    subtitle:
      "From Google Sheets + manual TIP forms to a desktop-first, searchable system with auto-PDFs",
    heroImage: SCCHero,
    gallery: sccScreenshots,
    deviceType: "desktop",
    context:
      "The team tracked everything in Google Sheets and hand-filled MDAS TIP forms for every qualifying cat. They needed a desktop-first records platform that mirrors their patient sheets, auto-generates PDFs, and centralizes their data with proper permissions.",
    problems: [
      "Manual MDAS TIP forms were slow and error-prone.",
      "Spreadsheets made search, filters, and batch exports painful.",
      "No unified CRUD or role-based workflows for records, forms, and users.",
    ],
    solution: [
      "Desktop-first React + Firebase app with admin/staff role permissions and a structured data model (records, forms, users).",
      "Automatic MDAS TIP PDF generation directly from each record.",
      "Autofill for fields based on SCC rules and dosage calculations to reduce entry time and mistakes.",
      "Robust record search and multi-field filters, plus batch CSV/PDF exports.",
      "Seamless CRUD for records, forms, and users, with admin tools to edit charts and menus.",
    ],
    metrics: [
      { icon: Clock, label: "Form Processing Time", value: "-75%" },
      { icon: BarChart3, label: "Data Consistency", value: "+90%" },
      { icon: Rocket, label: "Operational Efficiency", value: "+5.5×" },
    ],
    tech: [
      "React",
      "Firebase",
      "NoSQL",
      "Tailwind",
      "Vite",
      "Custom PDF engine",
    ],
    cta: { label: "View full case study", to: "/projects/street-cat-clinic" },
  },
  {
    key: "cat-solutions-305",
    title: "Cat Solutions 305 — Appointment Scheduler",
    subtitle:
      "From manual booking chaos to an organized, bilingual scheduling system",
    heroImage: MMHero,
    dualDevice: {
      order: ["mobile", "desktop"],
      mobile: {
        images: mmMobileScreenshots,
        type: "mobile",
      },
      desktop: {
        images: mmDesktopScreenshots,
        type: "desktop",
      },
    },
    context:
      "Before the app, all trapper appointments were managed manually through calls, messages, and spreadsheets. Based in Miami, the organization serves a bilingual community of volunteers and trappers, making language accessibility an essential requirement. The client needed a reliable way to handle daily capacity, allow trappers to self-manage appointments, and simplify administrative oversight — all in a clear, mobile-first interface.",
    problems: [
      "Manual coordination led to double bookings and constant back-and-forth communication.",
      "Admins had no centralized dashboard for daily capacity or user management.",
      "Trappers couldn’t easily view their upcoming appointments or update personal information.",
    ],
    solution: [
      "Custom React + Firebase scheduling app with real-time updates and authentication for each trapper.",
      "Mobile-first UI showing an 80-slot daily schedule (10 Foster / 70 TNR) with instant booking and release functionality.",
      "Separate admin and user portals — admins can create, edit, and delete appointments or users, set future availability, and track performance metrics.",
      "Trappers can update their own information, including foster and equipment capacity, and view appointment history.",
      "Full bilingual interface (English/Spanish) to improve accessibility and communication across Miami’s diverse user base.",
    ],
    metrics: [
      { icon: Clock, label: "Scheduling Time", value: "-70%" },
      { icon: BarChart3, label: "Admin Workload", value: "-50%" },
      { icon: Rocket, label: "User Engagement", value: "+2.3×" },
    ],
    tech: [
      "React",
      "Firebase Auth",
      "Firestore",
      "Tailwind",
      "Vite",
      "Responsive UI",
      "i18n (English/Spanish)",
    ],
    cta: { label: "View full case study", to: "/projects/cat-solutions-305" },
  },
  {
    key: "bio-coatings-blast-it-off",
    title: "Bio-Coatings & Blast-It-Off — Dual Website Ecosystem",
    subtitle: "Two brands, one cohesive digital identity",
    heroImage: BIOHero,
    dualDevice: {
      desktop: {
        images: bioCoatingsScreenshots,
        type: "desktop",
      },
      mobile: {
        images: blastItOffScreenshots,
        type: "desktop",
      },
    },
    context:
      "When Bio-Coatings first reached out, the company no longer had access to its original website, preventing updates and hurting visibility. We rebuilt and modernized the site from the ground up — preserving its familiar structure while improving design, performance, and SEO. Later, we designed and developed a sister site for Blast-It-Off, a sandblasting company that works alongside Bio-Coatings. Both sites were created to feel distinct yet cohesive, reinforcing each other’s credibility and strengthening their shared digital presence.",
    problems: [
      "Lost access to the original Bio-Coatings website and content, preventing updates or SEO improvements.",
      "No unified branding or digital cohesion between the two sister companies.",
      "Lack of lead-generation tools and outdated Google Business listings.",
    ],
    solution: [
      "Rebuilt the Bio-Coatings website from scratch with improved design, structure, and modern SEO practices.",
      "Designed the Blast-It-Off logo and full site to complement Bio-Coatings’ branding for a cohesive visual ecosystem.",
      "Linked both websites strategically to cross-reference and funnel traffic between services.",
      "Optimized each page for SEO, refreshed Google Business profiles, and implemented conversion-ready contact forms.",
    ],
    metrics: [
      { icon: BarChart3, label: "Organic Traffic Growth", value: "+65%" },
      { icon: Rocket, label: "Lead Conversions", value: "+40%" },
      { icon: Award, label: "Brand Consistency", value: "+2×" },
    ],
    tech: [
      "WordPress",
      "Elementor",
      "Custom Logo Design",
      "SEO Optimization",
      "Google Business Integration",
      "Cross-Site Linking",
    ],
    links: [
      {
        label: "Visit Bio-Coatings",
        url: "https://bio-coatings.com",
      },
      {
        label: "Visit Blast-It-Off",
        url: "https://blast-it-off.com",
      },
    ],
    cta: {
      label: "View full case study",
      to: "/projects/bio-coatings-blast-it-off",
    },
  },
];

export const OTHER_PROJECTS = [
  {
    title: "Icon Group | Engineers & Contractors",
    image: iconGroupCover,
    role: "WordPress Website Rebuild",
    summary:
      "Complete redesign and rebuild to modernize their online presence, strengthen credibility, and better showcase engineering services and certifications.",
    url: "https://icongroupengineers.com/",
  },
  {
    title: "A & A Recreations",
    image: aaPlaygroundsCover,
    role: "WordPress Website",
    summary:
      "Outdoor recreation company site with refreshed branding, service showcase pages, and improved project visuals.",
    url: "https://aaplaygrounds.com/",
  },
  {
    title: "ELC Real Estate",
    image: elcRealEstateCover,
    role: "Wix Website Optimization",
    summary:
      "Enhanced existing site structure and content for improved SEO, cleaner layouts, and better mobile responsiveness.",
    url: "https://www.elchomes.com/",
  },
];

export const clientLogos = [
  {
    src: aaplaygrounds,
    alt: "A & A Playgrounds Logo",
    href: "https://aaplaygrounds.com",
  },
  {
    src: flats,
    alt: "The Flats at Bradenton Logo",
    href: "https://flatsatbradenton.com",
  },
  {
    src: gold,
    alt: "Gold Standard Care Logo",
    href: "https://goldstandardofcare.com/",
  },
  {
    src: pinnacle,
    alt: "Pinnacle SMP Logo",
    href: "https://www.smppinnacle.com/",
  },
  {
    src: iconGroup,
    alt: "Icon Group Engineers & Contractors Logo",
    href: "https://icongroupengineers.com/",
  },
  {
    src: rochies,
    alt: "Rochie’s Bridal Logo",
    href: "https://rochiesbridal.com/",
  },
  { src: scc, alt: "Street Cat Clinic Logo" },
  { src: meowmax, alt: "MeowMax Logo" },
  { src: blast, alt: "Blast-It-Off Logo", href: "https://blast-it-off.com/" },
  { src: bio, alt: "Bio Coatings Logo", href: "https://bio-coatings.com/" },
  { src: elc, alt: "ELC Real Estate Logo", href: "https://elchomes.com/" },
  { src: lwp, alt: "LWP Logo", href: "https://lwpermitsfl.com/" },
];
