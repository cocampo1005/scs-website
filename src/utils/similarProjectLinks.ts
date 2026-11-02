import type { CaseStudy } from "../content/types";

// Link to the contact form, pre-filled to discuss a project like a case study
export const buildStartSimilarLink = (slug: string, title: string) =>
  `/contact?intent=start-similar&project=${encodeURIComponent(slug)}&title=${encodeURIComponent(title)}#form`;

/** The message the contact form starts with for a "Start a similar project" link */
export function similarProjectMessage(study: Pick<CaseStudy, "name" | "category" | "kind"> | undefined, fallbackTitle?: string | null) {
  if (!study) {
    const title = fallbackTitle?.trim() || "one of your featured projects";
    return `Hello, I'm interested in discussing a project similar to ${title}. I'd like to learn more about what you could build for our business.`;
  }
  const what = study.kind === "software" ? "a custom software project" : "a website project";
  const noun = study.category.replace(/^custom\s+/i, "").toLowerCase();
  return `Hello, I'm interested in discussing ${what} similar to the ${study.name} ${noun}. I'd like to learn more about what you could build for our business.`;
}
