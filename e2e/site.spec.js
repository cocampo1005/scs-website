import { expect, test } from "@playwright/test";

const NO_WEBGL = `
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    return /webgl/.test(type) ? null : original.call(this, type, ...args);
  };
`;

// Fails the test on page errors and on console errors other than expected
// WebGL/network noise from the fallback scenarios.
function watchErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/WebGL|Failed to load resource|net::ERR/.test(m.text())) {
      errors.push(m.text());
    }
  });
  return errors;
}

const heroHeading = (page) =>
  page.getByRole("heading", { level: 1, name: "Custom Software. Built Around Your Business." });

test.describe("homepage hero", () => {
  test("states the offer before the puzzle and completes from the visible control", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/");
    await expect(heroHeading(page)).toBeVisible();
    const hero = page.getByRole("region", { name: /Custom Software/ });
    await expect(hero.getByRole("link", { name: "Discuss Your Project" })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(1);

    await page.getByRole("button", { name: "Place it for me" }).click();
    await expect(page.getByText("Every piece has a purpose. Every solution is built to fit.")).toBeVisible();
    await expect(heroHeading(page)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("keeps the page usable when the 3D model fails to load", async ({ page }) => {
    await page.route("**/scs-hero-puzzle.glb", (route) => route.abort());
    await page.goto("/");
    await expect(heroHeading(page)).toBeVisible();
    await expect(page.getByRole("img", { name: /completed Solid Code Solutions cube/ })).toBeVisible();
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.locator("#services")).toBeAttached();
  });

  test("shows the poster when WebGL is unavailable", async ({ page }) => {
    await page.addInitScript(NO_WEBGL);
    await page.goto("/");
    await expect(heroHeading(page)).toBeVisible();
    await expect(page.getByRole("img", { name: /completed Solid Code Solutions cube/ })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Place it for me" })).toHaveCount(0);
  });

  test("swiping on the hero scrolls the page on touch devices", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch only");
    await page.goto("/");
    await expect(page.locator("canvas")).toHaveCount(1);
    await page.waitForTimeout(2500); // let the scene finish loading
    const cdp = await page.context().newCDPSession(page);
    const { width, height } = page.viewportSize();
    const x = Math.round(width * 0.1);
    const touch = (type, y) =>
      cdp.send("Input.dispatchTouchEvent", { type, touchPoints: y == null ? [] : [{ x, y }] });
    await touch("touchStart", height - 120);
    for (let i = 1; i <= 12; i++) await touch("touchMove", height - 120 - i * 35);
    await touch("touchEnd");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  });
});

test.describe("about page SOLID exhibit", () => {
  test("can be completed with the keyboard piece buttons", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/about");
    const pieces = page.getByRole("list", { name: "Puzzle pieces" }).getByRole("button");
    await expect(pieces).toHaveCount(7);
    for (let i = 0; i < 7; i++) {
      await page.getByRole("button", { name: /^Place the .* piece in its outline$/ }).first().click();
    }
    await expect(page.getByRole("progressbar", { name: "Pieces placed" })).toHaveAttribute("aria-valuenow", "7");
    await expect(page.getByText(/That’s SOLID/)).toBeVisible();
    // The board loads lazily; placements made before it loaded carry over
    await page.getByRole("progressbar", { name: "Pieces placed" }).scrollIntoViewIfNeeded();
    await expect(page.locator("canvas")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
});

test.describe("routing and SEO", () => {
  test("unknown paths render the Not Found page with noindex", async ({ page }) => {
    await page.goto("/no-such-page");
    await expect(page.getByRole("heading", { level: 1, name: /doesn’t fit anywhere/ })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content^="noindex"]')).toHaveCount(1);
  });

  test("served HTML has a title and social preview without running JavaScript", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toMatch(/<title data-static-seo>Custom Software Development \| Solid Code Solutions<\/title>/);
    expect(html).toContain('property="og:image" content="https://solidcodesolutionsllc.com/og-default.jpg"');
    const image = await request.get("/og-default.jpg");
    expect(image.headers()["content-type"]).toBe("image/jpeg");
  });

  test("robots.txt and sitemap.xml are real files", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Sitemap: https://solidcodesolutionsllc.com/sitemap.xml");
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain("<urlset");
  });

  test("each page renders a single title from <SEO>", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle("Contact | Solid Code Solutions");
    await expect(page.locator("head title")).toHaveCount(1);
    await expect(page.locator('head meta[property="og:image"]')).toHaveCount(1);
  });
});

test.describe("projects page", () => {
  test("lightbox opens from the keyboard and returns focus when closed", async ({ page }) => {
    await page.goto("/projects?case=street-cat-clinic#featured");
    const shot = page.getByRole("button", { name: /^Enlarge screenshot/ }).first();
    await shot.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close lightbox" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(shot).toBeFocused();
  });

  test("shows outcomes, not unverified percentages", async ({ page }) => {
    await page.goto("/projects?case=cat-solutions-305#featured");
    await expect(page.getByRole("heading", { name: "Outcomes" })).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/[+-]\d+(\.\d+)?(%|×)/);
  });
});

test.describe("contact form", () => {
  const conversions = (page) =>
    page.evaluate(
      () => (window.dataLayer || []).filter((a) => a[0] === "event" && a[1] === "conversion").length
    );

  async function fillForm(page) {
    await page.route("**/googletagmanager.com/**", (route) => route.abort());
    await page.goto("/contact");
    for (const [name, value] of [
      [/Your Name/, "Jane Doe"],
      [/Email/, "jane@example.com"],
      [/Tell us about your project/, "We need a booking site."],
    ]) {
      const field = page.getByRole("textbox", { name });
      // Focus first: under mobile emulation fill() on an unfocused field is dropped
      await field.click();
      await field.fill(value);
      await expect(field).toHaveValue(value);
    }
  }

  test("posts JSON to /api/contact and records one conversion on success", async ({ page }) => {
    let sent;
    await page.route("**/api/contact", async (route) => {
      sent = route.request();
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await fillForm(page);
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Thanks — we'll be in touch shortly.")).toBeVisible();
    expect(sent.method()).toBe("POST");
    expect(sent.headers()["content-type"]).toBe("application/json");
    expect(sent.postDataJSON()).toMatchObject({ name: "Jane Doe", email: "jane@example.com", website: "" });
    expect(await conversions(page)).toBe(1);
  });

  test("shows the server's errors and records no conversion", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        headers: { "Retry-After": "1200" },
        body: '{"ok":false,"error":"rate_limited","retryAfter":1200}',
      })
    );
    await fillForm(page);
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText(/Too many attempts/)).toBeVisible();

    await page.unroute("**/api/contact");
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 503, contentType: "application/json", body: '{"ok":false,"error":"unavailable"}' })
    );
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText(/Couldn't send the message right now/)).toBeVisible();
    expect(await conversions(page)).toBe(0);
  });
});
