import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PAGE_PATHS } from "../routes";
import { DEFAULT_OG_IMAGE, ORIGIN } from "../constants/seo";

const root = resolve(__dirname, "../..");
const read = (p) => readFileSync(resolve(root, p), "utf8");

describe("crawler files", () => {
  it("sitemap lists exactly the app's pages", () => {
    const locs = [...read("public/sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace(ORIGIN, "")
    );
    expect(locs.sort()).toEqual([...PAGE_PATHS].sort());
  });

  it("robots.txt allows crawling and points at the sitemap", () => {
    const robots = read("public/robots.txt");
    expect(robots).toMatch(/^User-agent: \*/m);
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  it(".htaccess serves every app route and 404s the rest", () => {
    const htaccess = read("public/.htaccess");
    const rule = htaccess.match(/RewriteRule \^\(([^)]+)\)/)[1].split("|");
    expect(rule.sort()).toEqual(PAGE_PATHS.filter((p) => p !== "/").map((p) => p.slice(1)).sort());
    expect(htaccess).toMatch(/ErrorDocument 404 \/index\.html/);
  });
});

describe("social previews", () => {
  it("default image exists and is small enough for scrapers", () => {
    const file = resolve(root, "public", DEFAULT_OG_IMAGE.url.slice(1));
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeLessThan(300_000);
  });

  it("index.html carries static title, description and Open Graph tags", () => {
    const html = read("index.html");
    for (const tag of [
      /<title data-static-seo>[^<]*Custom Software/,
      /name="description"/,
      /property="og:title"/,
      /property="og:image" content="https:\/\/solidcodesolutionsllc\.com\/og-default\.jpg"/,
      /name="twitter:card" content="summary_large_image"/,
    ]) {
      expect(html).toMatch(tag);
    }
  });
});

describe("legal pages", () => {
  it("use fixed revision dates instead of today's date", () => {
    for (const page of ["src/pages/Privacy.jsx", "src/pages/Terms.jsx"]) {
      expect(read(page)).not.toMatch(/new Date\(\)/);
    }
  });
});
