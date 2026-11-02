import { expect, test } from "@playwright/test";

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
const solvedLine = (page) => page.getByText("Your business is unique. Your software should be too.");

// Wait for the 3D scene to report ready (the loader's live region stops being busy)
const sceneReady = (page) => expect(page.locator('[role="status"][aria-busy="false"]')).toHaveCount(1);

// Mouse-over the stage's centre column until the scene offers the grab cursor
async function findLogoCube(page) {
  const canvas = page.locator("canvas");
  const box = await page.getByTestId("hero-stage").boundingBox();
  for (const fx of [0.5, 0.46, 0.54]) {
    for (let fy = 0.04; fy <= 0.6; fy += 0.02) {
      const x = box.x + box.width * fx;
      const y = box.y + box.height * fy;
      await page.mouse.move(x, y);
      // The scan meets the top edge of the cube's hit box first; grab a little inside it
      if ((await canvas.evaluate((el) => el.style.cursor)) === "grab") return { x, y: y + 24, box };
    }
  }
  return null;
}

test.describe("homepage hero", () => {
  test("states the offer before the puzzle and completes from the visible control", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/");
    await expect(heroHeading(page)).toBeVisible();
    const hero = page.getByRole("region", { name: /Custom Software/ });
    await expect(hero.getByRole("link", { name: "Discuss your project" })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(1);

    await page.getByRole("button", { name: "Place it for me" }).click();
    await expect(solvedLine(page)).toBeVisible();
    await expect(heroHeading(page)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("the logo cube can be grabbed and dragged into place with the mouse", async ({ page, isMobile }) => {
    test.skip(isMobile, "mouse drag; touch is covered by the swipe test");
    const errors = watchErrors(page);
    await page.goto("/");
    await sceneReady(page);
    const grab = await findLogoCube(page);
    expect(grab, "the cube offers a grab cursor").not.toBeNull();

    await page.mouse.move(grab.x, grab.y);
    await page.mouse.down();
    await expect(page.locator("canvas")).toHaveCSS("cursor", "grabbing");
    // Only partway: the piece floats back and the puzzle stays unsolved
    for (let i = 1; i <= 4; i++) await page.mouse.move(grab.x, grab.y + i * 6);
    await page.mouse.up();
    await expect(page.getByRole("button", { name: "Place it for me" })).toBeVisible();

    // All the way: the piece snaps in and the solve sequence plays. The cube
    // floats back up after the release, so find it again before grabbing.
    await page.waitForTimeout(800);
    const again = await findLogoCube(page);
    expect(again, "the cube is back in reach after a short drag").not.toBeNull();
    await page.mouse.move(again.x, again.y);
    await page.mouse.down();
    for (let i = 1; i <= 24; i++) await page.mouse.move(again.x, again.y + i * again.box.height * 0.025);
    await page.mouse.up();
    await expect(solvedLine(page)).toBeVisible();
    await expect(page.locator(".circuit")).toHaveAttribute("data-state", "playing");
    await expect(page.locator(".circuit")).toHaveAttribute("data-state", "ambient");
    expect(await page.evaluate(() => sessionStorage.getItem("scs:hero-solved"))).toBe("1");
    // The copy and controls over the canvas still take clicks
    await expect(heroHeading(page)).toBeVisible();
    await page.getByRole("link", { name: "See one in practice" }).click();
    await expect(page).toHaveURL(/\/work\/street-cat-clinic$/);
    expect(errors).toEqual([]);
  });

  test("the pointer lights the grid, and leaves a trail of sparks once solved", async ({ page, isMobile }) => {
    test.skip(isMobile, "pointer hover");
    await page.goto("/");
    await sceneReady(page);
    const hero = page.locator("section[aria-labelledby='hero-heading']");
    const box = await page.getByTestId("hero-stage").boundingBox();
    await page.mouse.move(box.x + 40, box.y + 40);
    await expect(hero).toHaveAttribute("data-pointer", "true");
    await expect(page.locator(".hero-spot")).toHaveAttribute("data-solved", "false");
    // Unsolved: a quiet highlight, no sparks however far the pointer travels
    for (let i = 0; i < 10; i++) await page.mouse.move(box.x + 40 + i * 50, box.y + 300);
    await expect(page.locator(".hero-spark")).toHaveCount(0);

    await page.getByRole("button", { name: "Place it for me" }).click();
    await expect(page.locator(".hero-spot")).toHaveAttribute("data-solved", "true");
    for (let i = 0; i < 10; i++) await page.mouse.move(box.x + 40 + i * 50, box.y + 320);
    await expect.poll(() => page.locator(".hero-spark").count()).toBeGreaterThan(2);
    await page.mouse.move(5, 5);
    await expect(hero).toHaveAttribute("data-pointer", "false");
  });

  test("remembers the solve for the session, stays alive, and replays on request", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/");
    const circuit = page.locator(".circuit");
    await expect(circuit).toHaveAttribute("data-state", "off");
    await page.getByRole("button", { name: "Place it for me" }).click();
    await expect(page.getByRole("button", { name: "Replay the puzzle" })).toBeVisible();
    await expect(circuit).toHaveAttribute("data-state", "playing");
    // After the sequence the hero keeps a quiet ambient pulse
    await expect(circuit).toHaveAttribute("data-state", "ambient");
    await expect(circuit).toHaveAttribute("data-active", "true");

    // A restored solve shows the finished state at once, with no sequence
    await page.reload();
    await expect(page.getByRole("button", { name: "Replay the puzzle" })).toBeVisible();
    await expect(circuit).toHaveAttribute("data-state", "ambient");

    // The loop pauses while the hero is off-screen
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(circuit).toHaveAttribute("data-active", "false");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(circuit).toHaveAttribute("data-active", "true");

    await page.getByRole("button", { name: "Replay the puzzle" }).click();
    await expect(page.getByRole("button", { name: "Place it for me" })).toBeVisible();
    await expect(circuit).toHaveAttribute("data-state", "off");
    expect(await page.evaluate(() => sessionStorage.getItem("scs:hero-solved"))).toBeNull();
    await expect(page.locator("canvas")).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test("reduced motion shows the finished circuit still, with no animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "Place it for me" }).click();
    await expect(solvedLine(page)).toBeVisible();
    await expect(page.locator(".circuit")).toHaveAttribute("data-state", "static");
    await page.reload();
    await expect(page.locator(".circuit")).toHaveAttribute("data-state", "static");
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
      await page.getByRole("button", { name: /^Place the .* piece (.*) in its outline$/ }).first().click();
    }
    await expect(page.getByRole("progressbar", { name: "Pieces placed" })).toHaveAttribute("aria-valuenow", "7");
    // The win: the card over the board (an accessible status with the
    // invitation), dismissable to a slim bar under the board, and "Play again"
    const win = page.getByRole("status", { name: /That’s SOLID/ });
    await expect(win).toBeVisible();
    await expect(win.getByRole("link", { name: /Press start on your project/ })).toHaveAttribute("href", "/contact");
    await win.getByRole("button", { name: "Show the finished wall" }).click();
    await expect(win).toHaveCount(0);
    const bar = page.getByRole("status").filter({ hasText: "Stage clear" });
    await expect(bar.getByRole("link", { name: /Press start on your project/ })).toBeVisible();
    await bar.getByRole("button", { name: "Play again" }).click();
    await expect(page.getByRole("progressbar", { name: "Pieces placed" })).toHaveAttribute("aria-valuenow", "0");
    await expect(bar).toHaveCount(0);
    for (let i = 0; i < 7; i++) {
      await page.getByRole("button", { name: /^Place the .* piece (.*) in its outline$/ }).first().click();
    }
    await expect(page.getByRole("status", { name: /That’s SOLID/ })).toBeVisible();
    // The board loads lazily; placements made before it loaded carry over
    // (two canvases: the hero's 3D stack and the board)
    await page.getByRole("progressbar", { name: "Pieces placed" }).scrollIntoViewIfNeeded();
    await expect(page.locator("canvas")).toHaveCount(2);
    expect(errors).toEqual([]);
  });
});

test.describe("navigation", () => {
  test("the mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone layout only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    // Every link and the call to action fit on screen without scrolling the panel
    for (const name of ["Services", "Work", "About", "Contact"]) {
      await expect(menu.getByRole("link", { name })).toBeInViewport({ ratio: 1 });
    }
    await expect(page.locator("#mobile-nav").getByRole("link", { name: "Discuss your project" })).toBeInViewport({ ratio: 1 });
    const panel = await page.locator("#mobile-nav").boundingBox();
    const viewport = page.viewportSize();
    expect(panel && viewport && panel.y + panel.height).toBeGreaterThanOrEqual((viewport?.height ?? 0) - 1);
    await menu.getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(menu).toBeHidden();
    await expect(page.getByRole("heading", { level: 2, name: /Software that fits your business/ })).toBeVisible();
  });

  test("every page renders without errors", async ({ page }) => {
    const errors = watchErrors(page);
    for (const path of ["/services", "/work", "/work/let-me-style-your-career", "/work/bio-coatings-blast-it-off", "/about", "/contact", "/privacy", "/terms"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("head title")).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });

  test("promotes two services and no standalone automation or modernization", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator("#custom")).toBeAttached();
    await expect(page.locator("#websites")).toBeAttached();
    await expect(page.locator("#automation, #modernization")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/modernization/i);
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Custom software" })).toHaveAttribute("href", "/services#custom");
    await expect(footer.getByRole("link", { name: "Business websites" })).toHaveAttribute("href", "/services#websites");
    await expect(footer.getByRole("link", { name: "+1 (954) 559-2944" })).toHaveAttribute("href", "tel:+19545592944");
    await expect(footer).not.toContainText(/WhatsApp/);
  });
});

test.describe("homepage sections", () => {
  test("tells the story in order and lights the process as it scrolls into view", async ({ page }) => {
    await page.goto("/");
    const headings = await page.getByRole("heading", { level: 2 }).allTextContents();
    const order = ["better way to run it", "isn't a template", "right digital solution", "Five stages", "Real systems", "What could your business"];
    const positions = order.map((t) => headings.findIndex((h) => h.includes(t)));
    expect(positions, headings.join(" | ")).toEqual([...positions].sort((a, b) => a - b));
    expect(positions.every((p) => p >= 0)).toBe(true);
    await expect(page.locator("main")).not.toContainText(/Software & websites for|How it fits|ELC Real Estate/);

    // The timeline is unlit above the fold and fills as it scrolls past
    const timeline = page.locator("ol[data-active]");
    await expect(timeline).toHaveAttribute("data-active", "-1");
    await page.getByRole("heading", { name: "Five stages. You're part of every one." }).scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 300);
    await expect.poll(() => timeline.getAttribute("data-active")).not.toBe("-1");
    // Scrolling past the whole timeline lights every step
    await page.getByRole("heading", { name: "Real systems, solving real business problems." }).scrollIntoViewIfNeeded();
    await expect(timeline).toHaveAttribute("data-active", "4");
    await expect(timeline.locator("li[data-lit='true']")).toHaveCount(5);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(timeline).toHaveAttribute("data-active", "-1");
  });

  test("featured projects offer a case study and a prefilled similar-project inquiry", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("article", { name: "MeowMax" });
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByRole("link", { name: "View case study" })).toHaveAttribute("href", "/work/meowmax");
    await card.getByRole("link", { name: "Start a similar project" }).click();
    await expect(page).toHaveURL(/\/contact\?intent=start-similar&project=meowmax/);
    const message = page.getByRole("textbox", { name: /What would you like to build or improve/ });
    await expect(message).toHaveValue(/a custom software project similar to the MeowMax scheduling and management platform/);
    await message.fill("Edited by hand.");
    await expect(message).toHaveValue("Edited by hand.");
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

test.describe("work and case studies", () => {
  test("old /projects links land on the new pages", async ({ page }) => {
    await page.goto("/projects?case=cat-solutions-305#featured");
    await expect(page).toHaveURL(/\/work\/meowmax$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("self-service clinic booking");
    await page.goto("/projects");
    await expect(page).toHaveURL(/\/work$/);
  });

  test("lists software case studies before websites", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByRole("heading", { level: 3, name: "Street Cat Clinic" })).toBeVisible();
    const headings = await page.getByRole("heading", { level: 3 }).allTextContents();
    expect(headings.indexOf("Street Cat Clinic")).toBeLessThan(headings.indexOf("Let Me Style Your Career"));
    await expect(page.locator("main")).not.toContainText("ELC Real Estate");
    await page.getByRole("article", { name: "Street Cat Clinic" }).getByRole("link", { name: "View case study" }).click();
    await expect(page).toHaveURL(/\/work\/street-cat-clinic$/);
    await expect(page).toHaveTitle(/Street Cat Clinic/);
  });

  test("unknown case studies are Not Found", async ({ page }) => {
    await page.goto("/work/no-such-case");
    await expect(page.getByRole("heading", { level: 1, name: /doesn’t fit anywhere/ })).toBeVisible();
  });

  test("the product walkthrough moves with buttons, keys, thumbnails and groups", async ({ page }) => {
    await page.goto("/work/meowmax");
    const tour = page.getByRole("region", { name: "MeowMax: Trapper app" });
    await tour.scrollIntoViewIfNeeded();
    await expect(tour).toContainText("1 / 10");
    await expect(tour.getByRole("heading", { level: 3 })).toHaveText("Home — Upcoming At-a-Glance");

    await tour.getByRole("button", { name: "Next screen" }).click();
    await expect(tour).toContainText("2 / 10");
    await expect(tour.getByRole("heading", { level: 3 })).toHaveText("Book Appointment — Calendar & Slots");
    await tour.getByRole("button", { name: "Previous screen" }).click();
    await tour.getByRole("button", { name: "Previous screen" }).click();
    await expect(tour).toContainText("10 / 10");

    await tour.focus();
    await page.keyboard.press("ArrowRight");
    await expect(tour).toContainText("1 / 10");
    await page.keyboard.press("End");
    await expect(tour).toContainText("10 / 10");

    await page.getByRole("button", { name: "Show screen 3: Confirmation — Appointments Booked" }).click();
    await expect(tour).toContainText("3 / 10");
    await expect(page.getByRole("button", { name: /^Show screen 3:/ })).toHaveAttribute("aria-current", "true");

    await page.getByRole("button", { name: "Admin dashboard" }).click();
    const admin = page.getByRole("region", { name: "MeowMax: Admin dashboard" });
    await expect(admin).toContainText("1 / 5");
    await expect(admin.getByRole("heading", { level: 3 })).toHaveText("Appointments Manager — Daily Overview");
  });

  test("lightbox opens from the keyboard and returns focus when closed", async ({ page }) => {
    await page.goto("/work/street-cat-clinic");
    const shot = page.getByRole("button", { name: /^Full screen:/ }).first();
    await shot.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close lightbox" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(shot).toBeFocused();
  });

  test("the case study's similar-project action carries its context to the form", async ({ page }) => {
    await page.goto("/work/street-cat-clinic");
    await page.getByRole("link", { name: "Start a similar project" }).first().click();
    await expect(page).toHaveURL(/\/contact\?intent=start-similar&project=street-cat-clinic/);
    await expect(page.getByRole("textbox", { name: /What would you like to build or improve/ })).toHaveValue(
      /similar to the Street Cat Clinic records management platform/,
    );
  });

  test("shows outcomes, not unverified percentages", async ({ page }) => {
    await page.goto("/work/meowmax");
    await expect(page.getByRole("heading", { name: "Outcomes" })).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/[+-]\d+(\.\d+)?(%|×)/);
  });
});

test.describe("contact form", () => {
  const conversions = (page) =>
    page.evaluate(
      () => (window.dataLayer || []).filter((a) => a[0] === "event" && a[1] === "conversion").length
    );

  async function fillForm(page, { consent = true } = {}) {
    await page.route("**/googletagmanager.com/**", (route) => route.abort());
    if (consent) await page.addInitScript((record) => localStorage.setItem("scs:consent", record), consentRecord(true));
    await page.goto("/contact");
    for (const [name, value] of [
      [/^Name/, "Jane Doe"],
      [/^Email/, "jane@example.com"],
      [/What would you like to build or improve/, "We need a booking site."],
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
    await page.getByRole("button", { name: "Send message" }).click();

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
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Too many attempts/)).toBeVisible();

    await page.unroute("**/api/contact");
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 503, contentType: "application/json", body: '{"ok":false,"error":"unavailable"}' })
    );
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Couldn't send the message right now/)).toBeVisible();
    expect(await conversions(page)).toBe(0);
  });
});
