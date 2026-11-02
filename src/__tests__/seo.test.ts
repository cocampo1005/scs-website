import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDY_PATHS, PAGE_PATHS, TOP_LEVEL_PATHS } from "../routes";
import { CASE_STUDIES } from "../content/work";
import { DEFAULT_OG_IMAGE, ORIGIN } from "../constants/seo";

const root = resolve(__dirname, "../..");
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const htaccess = read("public/.htaccess");

describe("crawler files", () => {
  it("sitemap lists exactly the app's pages", () => {
    const locs = [...read("public/sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.replace(ORIGIN, ""));
    expect(locs.sort()).toEqual([...PAGE_PATHS].sort());
  });

  it("robots.txt allows crawling and points at the sitemap", () => {
    const robots = read("public/robots.txt");
    expect(robots).toMatch(/^User-agent: \*/m);
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  it(".htaccess serves every app route and 404s the rest", () => {
    const top = htaccess.match(/RewriteRule \^\(([^)]+)\)\/\?\$ \/index\.html/)?.[1]?.split("|") ?? [];
    expect(top.sort()).toEqual(TOP_LEVEL_PATHS.filter((p) => p !== "/").map((p) => p.slice(1)).sort());
    const cases = htaccess.match(/RewriteRule \^work\/\(([^)]+)\)\/\?\$ \/index\.html/)?.[1]?.split("|") ?? [];
    expect(cases.map((s: string) => `/work/${s}`).sort()).toEqual([...CASE_STUDY_PATHS].sort());
    expect(htaccess).toMatch(/ErrorDocument 404 \/index\.html/);
  });

  it(".htaccess redirects every old /projects?case= link to its case study", () => {
    for (const c of CASE_STUDIES) {
      for (const key of c.legacyKeys) {
        // The condition line names the key; the next line is its redirect
        const cond = htaccess.split("\n").findIndex((l: string) => l.includes("QUERY_STRING") && l.includes(key));
        expect(cond, key).toBeGreaterThan(-1);
        expect(htaccess.split("\n")[cond + 1], key).toContain(`/work/${c.slug}? [R=301,L]`);
      }
    }
    expect(htaccess).toContain("RewriteRule ^projects/?$ /work? [R=301,L]");
  });

  it(".htaccess sends /api/contact to the PHP endpoint and 404s the rest of /api", () => {
    expect(existsSync(resolve(root, "public/api/contact.php"))).toBe(true);
    const pass = htaccess.indexOf("RewriteRule ^api/contact\\.php$ - [L]");
    const route = htaccess.indexOf("RewriteRule ^api/contact/?$ api/contact.php [L]");
    const notFound = htaccess.indexOf("RewriteRule ^api(/|$) - [R=404,L]");
    expect(pass).toBeGreaterThan(-1);
    expect(route).toBeGreaterThan(pass);
    expect(notFound).toBeGreaterThan(route);
    // Must run before the real-file rule, or /api/<anything>.php would execute
    expect(notFound).toBeLessThan(htaccess.indexOf("RewriteCond %{REQUEST_FILENAME} -f"));
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
