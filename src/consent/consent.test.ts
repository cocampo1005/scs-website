import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_KEY,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VERSION,
  clearConsent,
  hasGlobalPrivacyControl,
  readConsent,
  subscribeConsent,
  writeConsent,
} from "./consent";

const DAY = 86_400_000;

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("consent storage", () => {
  it("stores a dated, versioned record of the choice and reads it back", () => {
    const now = Date.parse("2026-11-02T12:00:00Z");
    const record = writeConsent({ advertising: true }, "accept_all", now);
    expect(record).toMatchObject({ advertising: true, method: "accept_all", version: CONSENT_VERSION, gpc: false });
    expect(record.decidedAt).toBe("2026-11-02T12:00:00.000Z");
    expect(Date.parse(record.expiresAt) - now).toBe(CONSENT_MAX_AGE_DAYS * DAY);
    expect(readConsent(now)).toEqual(record);
    expect(JSON.parse(localStorage.getItem(CONSENT_KEY)!)).toEqual(record);
  });

  it("asks again once the choice has expired", () => {
    const now = Date.parse("2026-11-02T12:00:00Z");
    writeConsent({ advertising: false }, "reject_all", now);
    expect(readConsent(now + (CONSENT_MAX_AGE_DAYS - 1) * DAY)).not.toBeNull();
    expect(readConsent(now + CONSENT_MAX_AGE_DAYS * DAY)).toBeNull();
  });

  it("ignores records from an older notice, malformed values and foreign data", () => {
    const record = writeConsent({ advertising: true }, "accept_all");
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...record, version: CONSENT_VERSION - 1 }));
    expect(readConsent()).toBeNull();
    localStorage.setItem(CONSENT_KEY, "{not json");
    expect(readConsent()).toBeNull();
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ advertising: "yes" }));
    expect(readConsent()).toBeNull();
  });

  it("clears the choice and notifies subscribers of every change", () => {
    const seen: unknown[] = [];
    const stop = subscribeConsent((r) => seen.push(r?.advertising ?? null));
    writeConsent({ advertising: true }, "accept_all");
    writeConsent({ advertising: false }, "reject_all");
    clearConsent();
    expect(seen).toEqual([true, false, null]);
    expect(readConsent()).toBeNull();
    stop();
    writeConsent({ advertising: true }, "accept_all");
    expect(seen).toHaveLength(3);
  });

  it("records the Global Privacy Control signal when present", () => {
    expect(hasGlobalPrivacyControl()).toBe(false);
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true, configurable: true });
    expect(hasGlobalPrivacyControl()).toBe(true);
    expect(writeConsent({ advertising: false }, "reject_all").gpc).toBe(true);
    Object.defineProperty(navigator, "globalPrivacyControl", { value: undefined, configurable: true });
  });
});
