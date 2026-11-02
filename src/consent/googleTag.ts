// Google Ads through Consent Mode v2, "basic" implementation
// (developers.google.com/tag-platform/security/concepts/consent-mode): the tag
// is not loaded at all until advertising consent exists, so with consent
// denied nothing is sent to Google, not even a consent ping. When consent is
// granted the consent default (all denied) is queued first, then the tag,
// then the update that grants exactly what conversion measurement needs:
// ad_storage and ad_user_data. ad_personalization and analytics_storage stay
// denied (no remarketing, no analytics on this site).

import type { ConsentRecord } from "./consent";

export const ADS_ID = "AW-17675252735";
export const ADS_CONVERSION = "AW-17675252735/cPPICNvM37QbEP_nm-xB";
const TAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;

const DENIED_ALL = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

const MEASUREMENT_ONLY = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

// Google's own cookies on this domain; cleared when consent is withdrawn
const GOOGLE_COOKIE = /^(_gcl_|_gac_|_gcl)/;

let loaded = false;
let granted = false;

function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // gtag.js reads an Arguments object, not an array
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function injectTag() {
  if (document.querySelector(`script[src^="https://www.googletagmanager.com/gtag/js"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = TAG_SRC;
  document.head.appendChild(s);
}

export function clearGoogleCookies() {
  const host = window.location.hostname;
  const domains = [undefined, host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (!name || !GOOGLE_COOKIE.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/**
 * Brings Google's tag in line with the visitor's choice. Safe to call on every
 * change: the tag loads once, consent updates are idempotent.
 */
export function applyConsent(record: ConsentRecord | null) {
  const wantsAds = Boolean(record?.advertising);
  if (!wantsAds) {
    if (loaded && granted) gtag("consent", "update", DENIED_ALL);
    granted = false;
    clearGoogleCookies();
    return;
  }
  if (!loaded) {
    loaded = true;
    gtag("consent", "default", { ...DENIED_ALL, wait_for_update: 500 });
    gtag("consent", "update", MEASUREMENT_ONLY);
    gtag("js", new Date());
    gtag("config", ADS_ID);
    injectTag();
  } else if (!granted) {
    gtag("consent", "update", MEASUREMENT_ONLY);
  }
  granted = true;
}

/** True while the tag is loaded and advertising consent is granted */
export function adsMeasurementActive() {
  return loaded && granted;
}

/**
 * Records the Google Ads conversion for a successful contact message. Does
 * nothing without consent, so a message sent after a rejection or withdrawal
 * is never reported. Returns whether it was recorded.
 */
export function recordConversion(): boolean {
  if (!adsMeasurementActive()) return false;
  gtag("event", "conversion", { send_to: ADS_CONVERSION });
  return true;
}

/** Test hook: forget the loaded state (the DOM is reset by the test runner) */
export function resetGoogleTagForTests() {
  loaded = false;
  granted = false;
}
