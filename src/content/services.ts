import type { AccordionItem } from "../components/ui/Accordion";
import type { Service } from "./types";

// Custom software is the dominant service; automation and modernization are
// secondary; websites are supporting (docs/design-review.md, decision 7)
export const SERVICES: readonly Service[] = [
  {
    id: "custom",
    tier: "primary",
    title: "Custom software development",
    short:
      "Internal dashboards, records platforms, booking systems, client portals and management tools, designed around how your team works.",
    description:
      "When spreadsheets, shared inboxes and generic tools stop fitting the way you work, we build the system that does: designed with your team, typed and tested, and handed over with documentation.",
    tags: ["Records & operations platforms", "Booking & scheduling", "Client portals", "Internal dashboards", "Admin & management tools"],
  },
  {
    id: "automation",
    tier: "secondary",
    title: "Workflow automation & integrations",
    short: "Connect the tools you already use and retire the copy-and-paste steps.",
    description:
      "Connect the tools you already use, sync data between them and retire copy-and-paste steps: API integrations, scheduled jobs, approvals and generated documents.",
    tags: ["APIs", "Data sync", "PDF generation", "Notifications"],
  },
  {
    id: "modernization",
    tier: "secondary",
    title: "Software modernization & support",
    short: "Refactor, speed up and extend an existing web app.",
    description:
      "Refactor, speed up and extend an existing web application without starting over. Bug fixes, performance work, new features and ongoing maintenance.",
    tags: ["Refactoring", "Performance", "New features", "Maintenance"],
  },
  {
    id: "websites",
    tier: "supporting",
    title: "Website development",
    short: "Business websites and WordPress builds, fast and SEO-ready.",
    description:
      "Business websites and WordPress builds: responsive, fast and SEO-ready, including redesigns and ongoing support.",
    tags: ["WordPress", "Redesigns", "SEO", "Support"],
  },
];

export const PROBLEMS_SOLVED = [
  "Data spread across sheets, inboxes and paper",
  "Forms and documents typed out by hand",
  "Bookings that overrun capacity",
  "No single view of what's happening today",
] as const;

/** Today → fitted solution rows on the homepage */
export const PROBLEM_ROWS = [
  { today: "Forms typed out by hand, one by one", fitted: "Documents generated from the data you already enter" },
  { today: "Bookings over text messages and a shared sheet", fitted: "Self-service booking with capacity rules built in" },
  { today: "The same data copied between three tools", fitted: "Integrations that keep every system in sync" },
] as const;

export const PROCESS = [
  { step: "Discover", text: "Map the process and the people." },
  { step: "Design", text: "Shape the data model and screens together." },
  { step: "Build", text: "Typed, tested code in short reviewable steps." },
  { step: "Deploy", text: "Launch with training and a rollback plan." },
  { step: "Improve", text: "Iterate on real use." },
] as const;

export const SERVICE_FAQ: readonly AccordionItem[] = [
  {
    q: "Can you work with our existing tools?",
    a: "Yes. Integrating with what you already use is usually part of the plan, whether that's spreadsheets, forms, a CRM or another web app.",
  },
  {
    q: "Do you take over existing projects?",
    a: "Yes. We regularly extend, refactor and speed up existing React, Firebase and WordPress projects without disrupting what already works.",
  },
  {
    q: "How do we work together during a project?",
    a: "You work directly with the developer building it. We agree milestones up front and share progress in short, reviewable steps with plain-language updates.",
  },
  {
    q: "What happens after launch?",
    a: "We offer ongoing maintenance, fixes and new features, either as a retainer or as needed.",
  },
];

export const CONTACT_FAQ: readonly AccordionItem[] = [
  {
    q: "Do you work with existing software?",
    a: "Yes. We regularly extend, refactor and speed up existing React, Firebase and WordPress projects without disrupting what works.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on scope: smaller projects can launch within a few weeks, while full applications may take several months. Once we understand the workflow, you get a written timeline with milestones.",
  },
  {
    q: "What should I budget?",
    a: "Every project is different. After a short call we send a written proposal with scope, milestones and transparent pricing, so you know exactly what you're getting.",
  },
  {
    q: "What happens after launch?",
    a: "We provide maintenance, performance work and new features, either on a retainer or whenever you need them.",
  },
];
