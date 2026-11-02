import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ADS_CONVERSION, ADS_ID, adsMeasurementActive, applyConsent, recordConversion, resetGoogleTagForTests } from "./googleTag";
import type { ConsentRecord } from "./consent";

const record = (advertising: boolean): ConsentRecord => ({
  advertising,
  version: 1,
  decidedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  method: advertising ? "accept_all" : "reject_all",
  gpc: false,
});

const tagScripts = () => document.querySelectorAll('script[src^="https://www.googletagmanager.com/gtag/js"]');
const layer = () => (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
const consentCommands = () => layer().filter((e) => e[0] === "consent");

beforeEach(() => {
  resetGoogleTagForTests();
  delete window.dataLayer;
  document.head.querySelectorAll("script").forEach((s) => s.remove());
});
afterEach(() => {
  document.cookie = "_gcl_au=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
});

describe("Google tag under consent mode (basic)", () => {
  it("loads nothing and sends nothing while consent is missing or denied", () => {
    applyConsent(null);
    applyConsent(record(false));
    expect(tagScripts()).toHaveLength(0);
    expect(window.dataLayer).toBeUndefined();
    expect(adsMeasurementActive()).toBe(false);
    expect(recordConversion()).toBe(false);
  });

  it("on consent: default denied first, then the tag, granting only measurement", () => {
    applyConsent(record(true));
    expect(tagScripts()).toHaveLength(1);
    expect(tagScripts()[0]?.getAttribute("src")).toContain(ADS_ID);
    const commands = layer();
    expect(commands[0]).toEqual([
      "consent",
      "default",
      { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied", wait_for_update: 500 },
    ]);
    expect(commands[1]).toEqual([
      "consent",
      "update",
      { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "denied" },
    ]);
    expect(commands[2]?.[0]).toBe("js");
    expect(commands[3]).toEqual(["config", ADS_ID]);
    expect(adsMeasurementActive()).toBe(true);
  });

  it("never loads the tag twice, and does not repeat consent updates needlessly", () => {
    applyConsent(record(true));
    applyConsent(record(true));
    applyConsent(record(true));
    expect(tagScripts()).toHaveLength(1);
    expect(consentCommands()).toHaveLength(2);
  });

  it("records a conversion only with consent, once per call", () => {
    applyConsent(record(true));
    expect(recordConversion()).toBe(true);
    const events = layer().filter((e) => e[0] === "event");
    expect(events).toEqual([["event", "conversion", { send_to: ADS_CONVERSION }]]);
  });

  it("on withdrawal tells the loaded tag consent is denied, clears Google's cookies and stops conversions", () => {
    applyConsent(record(true));
    document.cookie = "_gcl_au=1.1.123; path=/";
    expect(document.cookie).toContain("_gcl_au");
    applyConsent(null);
    expect(consentCommands().at(-1)).toEqual([
      "consent",
      "update",
      { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" },
    ]);
    expect(document.cookie).not.toContain("_gcl_au");
    expect(adsMeasurementActive()).toBe(false);
    expect(recordConversion()).toBe(false);
    // Re-consenting later re-grants without loading a second tag
    applyConsent(record(true));
    expect(tagScripts()).toHaveLength(1);
    expect(consentCommands().at(-1)?.[2]).toMatchObject({ ad_storage: "granted" });
  });
});
