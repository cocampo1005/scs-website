import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// A stored cookie choice keeps the consent banner out of these tests (it has
// its own spec). Rejected by default: nothing from Google loads.
const consentRecord = (advertising) =>
  JSON.stringify({
    version: 1,
    decidedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    advertising,
    method: advertising ? "accept_all" : "reject_all",
    gpc: false,
  });
test.beforeEach(async ({ page }) => {
  await page.addInitScript((record) => localStorage.setItem("scs:consent", record), consentRecord(false));
});

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

test("the cookie banner and settings dialog pass axe", async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem("scs:consent"));
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Your privacy choices" })).toBeVisible();
  let results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
  expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
  await page.getByRole("button", { name: "Customize" }).click();
  await expect(page.getByRole("dialog", { name: "Choose what this site may store" })).toBeVisible();
  results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
  expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});
