// Links into the Projects page and the pre-filled contact form, built from a
// CASE_STUDIES key so every card and button points at the same place.

export const caseStudyHref = (caseKey) =>
  `/projects?case=${encodeURIComponent(caseKey)}#featured`;

export const buildStartSimilarLink = (projectKey, projectTitle) =>
  `/contact?intent=start-similar&project=${encodeURIComponent(
    projectKey
  )}&title=${encodeURIComponent(projectTitle)}#form`;
