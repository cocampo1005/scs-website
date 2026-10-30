import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDIES, OTHER_PROJECTS } from "../constants/projectsData";
import { PROJECTS, SERVICES, ADVANTAGES } from "../constants/homeData";

// Percentages and multipliers such as "-75%" or "+5.5×" need a cited source
// before they can appear on the site.
const QUANTITATIVE_CLAIM = /[+\-−]?\d+(\.\d+)?\s?(%|×|x\b)/;

const text = (value) => JSON.stringify(value);

describe("case studies", () => {
  it("have unique keys", () => {
    const keys = CASE_STUDIES.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("describe outcomes instead of unverified metrics", () => {
    for (const c of CASE_STUDIES) {
      expect(c, c.key).not.toHaveProperty("metrics");
      expect(c.outcomes?.length, c.key).toBeGreaterThan(0);
      expect(text(c.outcomes), c.key).not.toMatch(QUANTITATIVE_CLAIM);
    }
  });

  it("give every screenshot a text alternative", () => {
    for (const c of CASE_STUDIES) {
      const images = [
        ...(c.gallery ?? []),
        ...(c.dualDevice?.desktop?.images ?? []),
        ...(c.dualDevice?.mobile?.images ?? []),
      ];
      expect(images.length, c.key).toBeGreaterThan(0);
      for (const img of images) expect(img.alt || img.title, c.key).toBeTruthy();
    }
  });
});

describe("screenshot privacy", () => {
  // These originals show third parties' names or identifiers; only their
  // "-sanitized" copies may ship (see docs/content-review.md).
  const UNSANITIZED = [
    "meowmax-accounts-manager",
    "meowmax-appointments-manager-daily",
    "meowmax-appointments-manager-overview",
    "meowmax-manage-appointments",
    "meowmax-manager-appointment",
    "meowmax-edit-capacity-modal",
    "meowmax-case-study-hero",
    "street-cat-clinic-new-entry-form",
    "street-cat-clinic-edit-record",
    "street-cat-clinic-records-details",
    "street-cat-clinic-case-study-hero",
    "mm-feature-image",
    "scc-feature-image",
  ];

  it("ships only sanitized copies of screenshots that show personal data", () => {
    const sources = ["src/constants/projectsData.js", "src/constants/homeData.js"]
      .map((p) => readFileSync(resolve(__dirname, "../..", p), "utf8"))
      .join("\n");
    for (const name of UNSANITIZED) {
      expect(sources, name).not.toMatch(new RegExp(`/${name}\\.webp`));
    }
  });
});

describe("home page content", () => {
  it("links every feature card to an existing case study", () => {
    const keys = new Set(CASE_STUDIES.map((c) => c.key));
    for (const p of PROJECTS) expect(keys.has(p.caseKey), p.title).toBe(true);
  });

  it("makes no unsourced quantitative claims", () => {
    expect(text([PROJECTS, SERVICES, ADVANTAGES, OTHER_PROJECTS])).not.toMatch(QUANTITATIVE_CLAIM);
  });
});
