import type { AccordionItem } from "../components/ui/Accordion";
import type { ApplicationType, ProcessStep, Service, TitledText } from "./types";

// Two outward-facing services. Custom software is the business; websites are
// a secondary offering. Automations, integrations and support can be parts of
// a custom application but are never promoted as services of their own.
export const SERVICES: readonly Service[] = [
  {
    id: "custom",
    tier: "primary",
    title: "Custom software development",
    short: "Purpose-built applications that help your business operate, organize and grow.",
    description:
      "Off-the-shelf tools are built for everyone. Your business has its own processes, priorities and challenges. We work with you to create applications that address those needs directly, with an experience designed for the people who will actually use them.",
    tags: ["Operations platforms", "Records systems", "Scheduling & booking", "Customer & staff portals", "Finance & admin", "Reporting dashboards"],
  },
  {
    id: "websites",
    tier: "secondary",
    title: "Business website development",
    short: "Professional websites that establish your presence, communicate your value and make it easy for customers to reach you.",
    description:
      "We design and develop professional websites that communicate your value clearly, work across devices and give potential customers a strong first impression. Depending on what your business needs, that's a WordPress site you can update yourself or a custom-built React site.",
    tags: ["WordPress", "Custom React sites", "Redesigns", "Responsive", "SEO-ready", "Contact & quote forms"],
  },
];

/** What custom software can do: possibilities, not a product menu */
export const APPLICATION_TYPES: readonly ApplicationType[] = [
  {
    id: "records",
    title: "Records & information management",
    text: "Keep important information organized, searchable and accessible to the right people.",
    vignette: "records",
  },
  {
    id: "scheduling",
    title: "Scheduling & booking",
    text: "Manage availability, appointments, resources and capacity in one place.",
    vignette: "calendar",
  },
  {
    id: "operations",
    title: "Business operations",
    text: "Give your team a central system to manage tasks, requests and daily processes.",
    vignette: "board",
  },
  {
    id: "portals",
    title: "Customer & staff portals",
    text: "Dedicated experiences where people submit information, manage requests and track progress.",
    vignette: "portal",
  },
  {
    id: "finance",
    title: "Finance & administration",
    text: "Simplify invoicing, expenses, approvals and the administrative work around them.",
    vignette: "invoice",
  },
  {
    id: "reporting",
    title: "Reporting & dashboards",
    text: "Turn operational data into clear, useful information that supports better decisions.",
    vignette: "chart",
  },
];

/** Why Solid Code Solutions (homepage) */
export const DIFFERENTIATORS: readonly TitledText[] = [
  {
    title: "Built around your needs",
    text: "Your requirements shape the software, not the limitations of a generic product.",
  },
  {
    title: "A collaborative process",
    text: "You're part of the process, with clear communication and real chances to review and refine what we're building.",
  },
  {
    title: "Quality & security by design",
    text: "Secure development practices, careful testing and reliable engineering are part of the work, not an add-on.",
  },
  {
    title: "Room to grow",
    text: "A strong foundation that can evolve as your operations and requirements change.",
  },
];

/** What makes us different (about page) */
export const ABOUT_DIFFERENTIATORS: readonly TitledText[] = [
  {
    title: "Direct collaboration",
    text: "You work directly with the person building your application, with clear communication and meaningful involvement throughout the project.",
  },
  {
    title: "Purpose-built solutions",
    text: "The application is shaped around your goals, your users and your operational needs rather than a predefined template.",
  },
  {
    title: "Thoughtful engineering",
    text: "Understandable, maintainable code, reliable functionality, careful testing and sensible security practices.",
  },
  {
    title: "A practical partnership",
    text: "The aim is something genuinely useful for your business, not added complexity.",
  },
];

export const MISSION =
  "Make business technology more useful, accessible and effective by creating software that solves real problems and fits the people who use it.";

export const VISION =
  "Help businesses operate with greater clarity, efficiency and flexibility through thoughtfully designed digital solutions built around their needs.";

/** The five stages of a project, with collaboration and refinement built in */
export const PROCESS: readonly ProcessStep[] = [
  { step: "Discover", text: "We learn your goals, the challenges, who will use the system and what it needs to do." },
  { step: "Design", text: "We plan the experience and shape the solution together, before anything is built." },
  { step: "Build", text: "We develop the application in clear, reviewable stages, so you see progress as it happens." },
  { step: "Test & refine", text: "We check functionality, usability and security considerations, and fold in your feedback." },
  { step: "Launch & evolve", text: "We deploy the solution, then improve it as your needs change." },
];

export const SERVICE_FAQ: readonly AccordionItem[] = [
  {
    q: "What kinds of applications can you build?",
    a: "Most well-defined business processes can become an application: records and information management, scheduling and booking, internal operations tools, customer or staff portals, invoicing and administrative systems, reporting dashboards and more. The examples on this page are starting points, not a fixed menu.",
  },
  {
    q: "What if I only have an idea and don't know exactly what I need?",
    a: "That's a normal place to start. Discovery exists for exactly this: we talk through the problem, who it affects and what a good outcome looks like, then suggest a practical first version together.",
  },
  {
    q: "How involved will I be during development?",
    a: "As involved as you want to be, and never less than informed. You see the work in reviewable stages, give feedback as it takes shape and make the decisions that affect how your team will use it.",
  },
  {
    q: "Can the application grow as my business changes?",
    a: "Yes. Applications are designed with change in mind, so new features, more users or a different workflow can be added to the foundation instead of starting over.",
  },
  {
    q: "How do you approach quality and security?",
    a: "With care at every stage: a clear data model, access based on roles, secure development practices, testing before anything reaches your team, and maintainable code that can be understood later. We don't make blanket guarantees; we build carefully and explain what we've done.",
  },
  {
    q: "How do you determine a project's scope and price?",
    a: "After discovery you receive a written proposal with the scope, milestones and pricing for your project, so you know what you're getting before the work begins.",
  },
  {
    q: "Do you also develop business websites?",
    a: "Yes. We build professional business websites, as WordPress sites or custom React sites, including redesigns of sites that have stopped working for the business.",
  },
];

export const CONTACT_FAQ: readonly AccordionItem[] = [
  {
    q: "What happens after I send a message?",
    a: "We read it and reply by email, usually with a few questions. If it looks like a fit, we schedule a short call to understand the project, then send a written proposal with scope, milestones and pricing.",
  },
  {
    q: "Do I need technical specifications to get started?",
    a: "No. Describe the problem, the people involved and what you'd like to be easier. Working out the technical details is part of our job.",
  },
  {
    q: "How do you determine scope and price?",
    a: "Every project is different, so pricing follows discovery. You receive a written proposal with the scope, milestones and price before any work begins.",
  },
  {
    q: "Can the application work with tools we already use?",
    a: "Often, yes. When a custom application needs to exchange data with a tool you rely on, that can be part of its design. The application itself stays the focus.",
  },
  {
    q: "Do you build websites too?",
    a: "Yes. Professional business websites, as WordPress sites or custom React sites, are our secondary service.",
  },
];
