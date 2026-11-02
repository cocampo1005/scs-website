// Indexable app routes. public/sitemap.xml and the route rules in
// public/.htaccess must list the same paths (checked by src/__tests__/seo.test.js).
import { CASE_STUDIES, workPath } from "./content/work";

export const TOP_LEVEL_PATHS = ["/", "/services", "/work", "/about", "/contact", "/privacy", "/terms"] as const;

export const CASE_STUDY_PATHS = CASE_STUDIES.map((c) => workPath(c.slug));

export const PAGE_PATHS: readonly string[] = [...TOP_LEVEL_PATHS, ...CASE_STUDY_PATHS];
