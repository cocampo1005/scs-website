import { defineConfig, devices } from "@playwright/test";

// End-to-end checks against the production build (`vite preview`), or
// against a deployed site with `BASE_URL=https://… npx playwright test`.
// Uses the locally installed Chrome; WebGL runs through SwiftShader.
const chrome = {
  channel: "chrome",
  launchOptions: {
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  },
};

const live = process.env.BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: live ?? "http://localhost:4173",
    trace: "retain-on-failure",
  },
  webServer: live
    ? undefined
    : {
        command: "npm run preview -- --port 4173 --strictPort",
        url: "http://localhost:4173",
        reuseExistingServer: true,
      },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], ...chrome, viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...chrome } },
  ],
});
