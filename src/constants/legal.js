// Revision dates for the legal pages. Update these by hand whenever the text
// of the matching page changes; never derive them from the current date.
export const PRIVACY_LAST_UPDATED = "2026-10-30";
export const TERMS_LAST_UPDATED = "2026-02-20"; // last change to the Terms text (git history)

export const CONTACT_EMAIL = "christian@solidcodesolutionsllc.com";

export function formatLegalDate(isoDate) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
