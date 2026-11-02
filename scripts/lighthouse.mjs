// Lighthouse against the production build (`vite preview` on port 4173, started
// here if it isn't already running). Fails when a page misses the budgets.
//
//   npm run build && npm run lighthouse
//
// Reports (HTML) land in lighthouse-report/. Performance is reported but not
// budgeted: it depends on the machine and on the 3D scenes' GPU path.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const PAGES = ["/", "/services", "/work", "/work/meowmax", "/about", "/contact"];
// Google's tag loads only after consent (src/consent), so an unattended audit
// sees no third-party cookies and the real best-practices budget applies.
const BUDGETS = { accessibility: 95, "best-practices": 90, seo: 95 };
const OUT = path.join(root, "lighthouse-report");

async function reachable(url) {
  try {
    return (await fetch(url)).ok;
  } catch {
    return false;
  }
}

let preview = null;
if (!(await reachable(BASE))) {
  preview = spawn("npm", ["run", "preview", "--", "--port", "4173", "--strictPort"], { cwd: root, shell: true, stdio: "ignore" });
  for (let i = 0; i < 40 && !(await reachable(BASE)); i++) await new Promise((r) => setTimeout(r, 500));
}

fs.mkdirSync(OUT, { recursive: true });
const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
let failed = false;
try {
  for (const formFactor of ["desktop", "mobile"]) {
    for (const page of PAGES) {
      const result = await lighthouse(`${BASE}${page}`, {
        port: chrome.port,
        output: "html",
        logLevel: "error",
        formFactor,
        screenEmulation: formFactor === "desktop" ? { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false } : undefined,
        throttlingMethod: "simulate",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      });
      const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([k, c]) => [k, Math.round((c.score ?? 0) * 100)]));
      const misses = Object.entries(BUDGETS).filter(([k, min]) => scores[k] < min);
      if (misses.length) failed = true;
      const name = `${formFactor}${page === "/" ? "-home" : page.replace(/\//g, "-")}.html`;
      fs.writeFileSync(path.join(OUT, name), result.report);
      console.log(
        `${formFactor.padEnd(7)} ${page.padEnd(16)} perf ${String(scores.performance).padStart(3)}  a11y ${String(scores.accessibility).padStart(3)}  bp ${String(scores["best-practices"]).padStart(3)}  seo ${String(scores.seo).padStart(3)}${misses.length ? `  ✗ below budget: ${misses.map(([k]) => k).join(", ")}` : ""}`,
      );
    }
  }
} finally {
  await chrome.kill();
  preview?.kill();
}
console.log(`Reports: ${OUT}`);
if (failed) {
  console.error("Lighthouse budgets not met.");
  process.exit(1);
}
