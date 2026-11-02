// Link to the contact form, pre-filled to discuss a project like a case study
export const buildStartSimilarLink = (slug: string, title: string) =>
  `/contact?intent=start-similar&project=${encodeURIComponent(slug)}&title=${encodeURIComponent(title)}#form`;
