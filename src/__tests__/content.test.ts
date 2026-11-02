import { describe, expect, it } from "vitest";
import { CASE_STUDIES, OTHER_PROJECTS, slugForLegacyKey } from "../content/work";
import { CONTACT_FAQ, PROBLEM_ROWS, PROCESS, SERVICES, SERVICE_FAQ } from "../content/services";

// Percentages and multipliers such as "-75%" or "+5.5×" need a cited source
// before they can appear on the site.
const QUANTITATIVE_CLAIM = /[+\-−]?\d+(\.\d+)?\s?(%|×|x\b)/;
// Drafting placeholders must never ship
const PLACEHOLDER = /\[(Confirm|Add|YOUR)[^\]]*\]/i;

const text = (value: unknown) => JSON.stringify(value);

describe("case studies", () => {
  it("have unique slugs and legacy keys", () => {
    const slugs = CASE_STUDIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const keys = CASE_STUDIES.flatMap((c) => c.legacyKeys);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("map every old /projects?case= key to its new page", () => {
    expect(slugForLegacyKey("cat-solutions-305")).toBe("meowmax");
    for (const c of CASE_STUDIES) for (const key of c.legacyKeys) expect(slugForLegacyKey(key)).toBe(c.slug);
    expect(slugForLegacyKey("nope")).toBeUndefined();
  });

  it("describe outcomes instead of unverified metrics", () => {
    for (const c of CASE_STUDIES) {
      expect(c.outcomes.length, c.slug).toBeGreaterThan(0);
      expect(text(c.outcomes), c.slug).not.toMatch(QUANTITATIVE_CLAIM);
    }
  });

  it("give every screenshot a text alternative", () => {
    for (const c of CASE_STUDIES) {
      const images = [c.cover, ...c.keyScreens.map((k) => k.image), ...c.gallery.flatMap((g) => g.images)];
      for (const img of images) expect(img.alt.trim(), `${c.slug}: ${img.src}`).not.toBe("");
    }
  });

  it("lead with software before websites", () => {
    const firstWebsite = CASE_STUDIES.findIndex((c) => c.kind === "website");
    expect(CASE_STUDIES.slice(firstWebsite).every((c) => c.kind === "website")).toBe(true);
  });
});

describe("site copy", () => {
  const all = [CASE_STUDIES, OTHER_PROJECTS, SERVICES, PROBLEM_ROWS, PROCESS, SERVICE_FAQ, CONTACT_FAQ];

  it("makes no unsourced quantitative claims", () => {
    expect(text([SERVICES, PROBLEM_ROWS, PROCESS, SERVICE_FAQ, CONTACT_FAQ, OTHER_PROJECTS])).not.toMatch(QUANTITATIVE_CLAIM);
  });

  it("contains no drafting placeholders", () => {
    expect(text(all)).not.toMatch(PLACEHOLDER);
  });

  it("puts custom software first among the services", () => {
    expect(SERVICES[0]?.tier).toBe("primary");
    expect(SERVICES.filter((s) => s.tier === "primary")).toHaveLength(1);
  });
});
