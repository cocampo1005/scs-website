// src/utils/links.js
export const buildStartSimilarLink = (projectKey, projectTitle) =>
  `/contact?intent=start-similar&project=${encodeURIComponent(
    projectKey
  )}&title=${encodeURIComponent(projectTitle)}#form`;
