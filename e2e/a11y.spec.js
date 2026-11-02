import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Accessibility audit of every page with axe-core. Serious and critical
// violations fail the run; the rest are printed for review.
const PAGES = ["/", "/services", "/work", "/work/street-cat-clinic", "/work/meowmax", "/about", "/contact", "/privacy", "/terms", "/no-such-page"];

for (const path of PAGES) {
  test(`axe finds no serious or critical issues on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();
    const summarize = (v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`;
    const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const minor = results.violations.filter((v) => !blocking.includes(v));
    if (minor.length) console.log(`${path} (minor/moderate):\n  ${minor.map(summarize).join("\n  ")}`);
    expect(blocking.map(summarize)).toEqual([]);
  });
}
