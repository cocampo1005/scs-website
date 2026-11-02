import { expect, test } from "@playwright/test";

// Consent is enforced technically: nothing from Google is requested until the
// visitor accepts, a rejection holds across pages and reloads, withdrawal
// stops measurement, and the contact form works either way.

const GOOGLE = /googletagmanager\.com|google-analytics\.com|doubleclick\.net|googleadservices\.com|google\.com\/pagead/;

/** Counts requests to Google hosts and keeps them off the network */
function watchGoogle(page) {
  const requests = [];
  page.route(GOOGLE, (route) => {
    requests.push(route.request().url());
    route.abort();
  });
  return requests;
}

const banner = (page) => page.getByRole("dialog", { name: "Your privacy choices" });
const settings = (page) => page.getByRole("dialog", { name: "Choose what this site may store" });
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("scs:consent") ?? "null"));
const consentUpdates = (page) =>
  page.evaluate(() => (window.dataLayer || []).map((e) => Array.from(e)).filter((e) => e[0] === "consent" && e[1] === "update").map((e) => e[2]));
const conversions = (page) => page.evaluate(() => (window.dataLayer || []).filter((e) => e[0] === "event" && e[1] === "conversion").length);

async function fillContact(page) {
  for (const [name, value] of [
    [/^Name/, "Jane Doe"],
    [/^Email/, "jane@example.com"],
    [/What would you like to build or improve/, "We need a booking site."],
  ]) {
    const field = page.getByRole("textbox", { name });
    await field.click();
    await field.fill(value);
  }
}

test.describe("cookie consent", () => {
  test("nothing from Google loads before a choice, on any page", async ({ page }) => {
    const google = watchGoogle(page);
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
    await expect(banner(page).getByRole("heading", { name: "Your privacy choices" })).toBeFocused();
    for (const path of ["/services", "/work/meowmax", "/contact"]) {
      await page.goto(path);
      await expect(banner(page)).toBeVisible();
    }
    expect(google).toEqual([]);
    expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
    expect(await page.evaluate(() => document.cookie)).toBe("");
    expect(await stored(page)).toBeNull();
  });

  test("accepting loads the tag once with measurement-only consent, and is remembered", async ({ page }) => {
    const google = watchGoogle(page);
    await page.goto("/");
    await banner(page).getByRole("button", { name: "Accept all" }).click();
    await expect(banner(page)).toHaveCount(0);
    await expect.poll(() => google.length).toBe(1);
    expect(google[0]).toContain("googletagmanager.com/gtag/js?id=AW-17675252735");
    const layer = await page.evaluate(() => (window.dataLayer || []).map((e) => Array.from(e)));
    expect(layer[0].slice(0, 2)).toEqual(["consent", "default"]);
    expect(layer[0][2]).toMatchObject({ ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    expect(layer[1]).toEqual(["consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "denied" }]);
    expect(await stored(page)).toMatchObject({ advertising: true, method: "accept_all", version: 1 });

    // Navigating and reloading neither re-asks nor loads a second tag
    await page.getByRole("link", { name: "Work" }).first().click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(banner(page)).toHaveCount(0);
    expect(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count()).toBe(1);
    await page.reload();
    await expect(banner(page)).toHaveCount(0);
    await expect.poll(() => google.length).toBe(2);
    expect(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count()).toBe(1);
  });

  test("rejecting keeps Google out, including after a reload and on other pages", async ({ page }) => {
    const google = watchGoogle(page);
    await page.goto("/");
    await banner(page).getByRole("button", { name: "Reject all" }).click();
    await expect(banner(page)).toHaveCount(0);
    expect(await stored(page)).toMatchObject({ advertising: false, method: "reject_all" });
    await page.reload();
    await expect(banner(page)).toHaveCount(0);
    await page.goto("/contact");
    await expect(banner(page)).toHaveCount(0);
    await page.waitForTimeout(500);
    expect(google).toEqual([]);
    expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
  });

  test("the contact form works and records no conversion without consent", async ({ page }) => {
    const google = watchGoogle(page);
    let posted = false;
    await page.route("**/api/contact", (route) => {
      posted = true;
      route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await page.goto("/contact");
    await banner(page).getByRole("button", { name: "Reject all" }).click();
    await fillContact(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Thanks — we'll be in touch shortly.")).toBeVisible();
    expect(posted).toBe(true);
    expect(google).toEqual([]);
    expect(await conversions(page)).toBe(0);
  });

  test("with consent, one conversion per successful send; none for a failure or after withdrawal", async ({ page }) => {
    watchGoogle(page);
    let status = 200;
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status, contentType: "application/json", body: status === 200 ? '{"ok":true}' : '{"ok":false,"error":"unavailable"}' }),
    );
    await page.goto("/contact");
    await banner(page).getByRole("button", { name: "Accept all" }).click();

    status = 503;
    await fillContact(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Couldn't send the message right now/)).toBeVisible();
    expect(await conversions(page)).toBe(0);

    status = 200;
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Thanks — we'll be in touch shortly.")).toBeVisible();
    expect(await conversions(page)).toBe(1);

    // Withdraw from the footer: the loaded tag is told consent is denied
    await page.getByRole("contentinfo").getByRole("button", { name: "Cookie settings" }).click();
    await settings(page).getByRole("button", { name: "Reject all" }).click();
    await expect(settings(page)).toHaveCount(0);
    expect((await consentUpdates(page)).at(-1)).toMatchObject({ ad_storage: "denied", ad_user_data: "denied" });
    expect(await stored(page)).toMatchObject({ advertising: false });
    await page.waitForTimeout(13000); // the form's own 12 s resend guard
    await fillContact(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Thanks — we'll be in touch shortly.")).toBeVisible();
    expect(await conversions(page)).toBe(1);
  });

  test("preferences can be customized from the footer, with a modal that traps focus", async ({ page }) => {
    await page.goto("/about");
    await banner(page).getByRole("button", { name: "Customize" }).click();
    const dialog = settings(page);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Choose what this site may store" })).toBeFocused();
    const necessary = dialog.getByRole("switch", { name: /Strictly necessary/ });
    await expect(necessary).toBeChecked();
    await expect(necessary).toBeDisabled();
    const ads = dialog.getByRole("switch", { name: "Advertising measurement" });
    await expect(ads).not.toBeChecked();
    // Tab cycles inside the dialog
    for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.querySelector('[data-testid="cookie-settings"]')?.contains(document.activeElement))).toBe(true);
    await ads.click();
    await dialog.getByRole("button", { name: "Save preferences" }).click();
    await expect(dialog).toHaveCount(0);
    expect(await stored(page)).toMatchObject({ advertising: true });

    const footerButton = page.getByRole("contentinfo").getByRole("button", { name: "Cookie settings" });
    await footerButton.click();
    await expect(settings(page).getByRole("switch", { name: "Advertising measurement" })).toBeChecked();
    await page.keyboard.press("Escape");
    await expect(settings(page)).toHaveCount(0);
    await expect(footerButton).toBeFocused();
  });

  test("honors a Global Privacy Control signal", async ({ page }) => {
    const google = watchGoogle(page);
    await page.addInitScript(() => Object.defineProperty(navigator, "globalPrivacyControl", { value: true }));
    await page.goto("/");
    await expect(banner(page)).toContainText("Global Privacy Control");
    await banner(page).getByRole("button", { name: "Reject all" }).click();
    expect(await stored(page)).toMatchObject({ advertising: false, gpc: true });
    expect(google).toEqual([]);
    const gpc = await (await page.request.get("/.well-known/gpc.json")).json();
    expect(gpc).toMatchObject({ gpc: true });
  });

  test("the banner never blocks the page: the hero still solves and the page scrolls", async ({ page, isMobile }) => {
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
    await page.getByRole("button", { name: "Place it for me" }).click();
    await expect(page.getByText("Your business is unique. Your software should be too.")).toBeVisible();
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
    if (!isMobile) await expect(banner(page)).toBeInViewport();
  });
});
