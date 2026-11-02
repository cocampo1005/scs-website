import { describe, expect, it } from "vitest";
import { CASE_STUDIES, OTHER_PROJECTS, SOFTWARE_CASES, slugForLegacyKey } from "../content/work";
import {
  ABOUT_DIFFERENTIATORS,
  APPLICATION_TYPES,
  CONTACT_FAQ,
  DIFFERENTIATORS,
  MISSION,
  PROCESS,
  SERVICES,
  SERVICE_FAQ,
  VISION,
} from "../content/services";
import { COMPANY_DESCRIPTION, CONTACT, TAGLINE } from "../content/site";
import { similarProjectMessage } from "../utils/similarProjectLinks";

// Percentages and multipliers such as "-75%" or "+5.5×" need a cited source
// before they can appear on the site.
const QUANTITATIVE_CLAIM = /[+\-−]?\d+(\.\d+)?\s?(%|×|x\b)/;
// Drafting placeholders must never ship
const PLACEHOLDER = /\[(Confirm|Add|YOUR)[^\]]*\]/i;
// Claims that need evidence or an agreement before they can be published
// (saying we make no guarantees is fine; promising one is not)
const UNVERIFIED = /\b(we guarantee|guaranteed|certified|ISO ?\d|SOC ?2|HIPAA|GDPR|testimonial|\d+\+? (clients|years))\b/i;

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
      expect(text([c.outcomes, c.benefit, c.highlights]), c.slug).not.toMatch(QUANTITATIVE_CLAIM);
    }
  });

  it("give every screenshot a text alternative and every walkthrough screen a title", () => {
    for (const c of CASE_STUDIES) {
      const images = [c.cover, ...c.keyScreens.map((k) => k.image), ...c.tour.flatMap((g) => g.images)];
      for (const img of images) expect(img.alt.trim(), `${c.slug}: ${img.src}`).not.toBe("");
      expect(c.tour.length, c.slug).toBeGreaterThan(0);
      for (const g of c.tour) expect(g.images.length, `${c.slug}: ${g.title}`).toBeGreaterThan(0);
    }
  });

  it("tell the full story: challenge, approach, what we built, features and benefit", () => {
    for (const c of CASE_STUDIES) {
      expect(c.problem.points.length, c.slug).toBeGreaterThan(0);
      expect(c.approach.text, c.slug).not.toBe("");
      expect(c.built.points.length, c.slug).toBeGreaterThan(0);
      expect(c.highlights.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(c.benefit, c.slug).not.toBe("");
    }
  });

  it("lead with software before websites", () => {
    const firstWebsite = CASE_STUDIES.findIndex((c) => c.kind === "website");
    expect(CASE_STUDIES.slice(firstWebsite).every((c) => c.kind === "website")).toBe(true);
    expect(SOFTWARE_CASES.map((c) => c.slug)).toEqual(["street-cat-clinic", "meowmax"]);
  });

  it("no longer lists ELC Real Estate", () => {
    expect(text([CASE_STUDIES, OTHER_PROJECTS])).not.toMatch(/ELC|elchomes/);
  });
});

describe("similar-project messages", () => {
  it("name the project and what kind of work it was", () => {
    const scc = CASE_STUDIES.find((c) => c.slug === "street-cat-clinic")!;
    expect(similarProjectMessage(scc)).toBe(
      "Hello, I'm interested in discussing a custom software project similar to the Street Cat Clinic records management platform. I'd like to learn more about what you could build for our business.",
    );
    const site = CASE_STUDIES.find((c) => c.kind === "website")!;
    expect(similarProjectMessage(site)).toMatch(/a website project similar to the/);
    expect(similarProjectMessage(undefined, "MeowMax")).toMatch(/similar to MeowMax/);
    expect(similarProjectMessage(undefined)).toMatch(/one of your featured projects/);
  });
});

describe("services and positioning", () => {
  it("promote exactly two services, custom software first", () => {
    expect(SERVICES.map((s) => [s.id, s.tier])).toEqual([
      ["custom", "primary"],
      ["websites", "secondary"],
    ]);
  });

  it("never positions automation, integrations, modernization or support as a service", () => {
    const standalone = /(automation|integration|moderni[sz]ation|maintenance|support) (service|&|and)/i;
    expect(text([SERVICES, APPLICATION_TYPES, DIFFERENTIATORS, ABOUT_DIFFERENTIATORS, TAGLINE, COMPANY_DESCRIPTION])).not.toMatch(standalone);
    for (const s of SERVICES) expect(s.title).not.toMatch(/automation|integration|moderni/i);
  });

  it("presents the phone as a phone, not WhatsApp", () => {
    expect(CONTACT.phoneTel).toMatch(/^tel:\+\d+$/);
    expect(text(CONTACT)).not.toMatch(/whatsapp|wa\.me/i);
  });

  it("offers six kinds of application and five process stages", () => {
    expect(APPLICATION_TYPES).toHaveLength(6);
    expect(PROCESS.map((p) => p.step)).toEqual(["Discover", "Design", "Build", "Test & refine", "Launch & evolve"]);
  });
});

describe("site copy", () => {
  const all = [CASE_STUDIES, OTHER_PROJECTS, SERVICES, APPLICATION_TYPES, DIFFERENTIATORS, ABOUT_DIFFERENTIATORS, MISSION, VISION, PROCESS, SERVICE_FAQ, CONTACT_FAQ];

  it("makes no unsourced quantitative claims", () => {
    expect(text([SERVICES, APPLICATION_TYPES, DIFFERENTIATORS, ABOUT_DIFFERENTIATORS, MISSION, VISION, PROCESS, SERVICE_FAQ, CONTACT_FAQ, OTHER_PROJECTS])).not.toMatch(QUANTITATIVE_CLAIM);
  });

  it("contains no drafting placeholders", () => {
    expect(text(all)).not.toMatch(PLACEHOLDER);
  });

  it("makes no guarantees, certification or testimonial claims", () => {
    expect(text(all)).not.toMatch(UNVERIFIED);
  });
});
