// Consent state for the site's one optional technology: Google Ads conversion
// measurement. Nothing optional runs until a visitor opts in; a choice is kept
// in this browser (localStorage) for CONSENT_MAX_AGE_DAYS, then asked again.
//
// A record is the consent evidence Google's EU user consent policy asks
// advertisers to keep: when the choice was made, which version of the notice
// it answered, how it was made, and whether a Global Privacy Control signal
// was present. It never contains personal information and never leaves the
// browser.

export const CONSENT_KEY = "scs:consent";
/** Bump when the categories or the notice change materially: visitors are asked again */
export const CONSENT_VERSION = 1;
/** Re-ask after this long (the CNIL recommends at most six months) */
export const CONSENT_MAX_AGE_DAYS = 182;
export const CONSENT_EVENT = "scs:consent";

export type ConsentMethod = "accept_all" | "reject_all" | "custom";

export type ConsentChoices = {
  /** Google Ads conversion measurement */
  advertising: boolean;
};

export type ConsentRecord = ConsentChoices & {
  version: number;
  /** ISO timestamp of the choice */
  decidedAt: string;
  /** ISO timestamp after which the choice is no longer relied on */
  expiresAt: string;
  method: ConsentMethod;
  /** navigator.globalPrivacyControl was true when the choice was made */
  gpc: boolean;
};

export const DENIED: ConsentChoices = { advertising: false };
export const GRANTED: ConsentChoices = { advertising: true };

/** Global Privacy Control: a browser-level request not to sell or share data, or target ads */
export function hasGlobalPrivacyControl(): boolean {
  return typeof navigator !== "undefined" && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

function isRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.version === "number" &&
    typeof r.decidedAt === "string" &&
    typeof r.expiresAt === "string" &&
    typeof r.advertising === "boolean" &&
    typeof r.method === "string" &&
    typeof r.gpc === "boolean"
  );
}

/** The stored choice, or null when there is none, it is for an older notice, or it has expired */
export function readConsent(now = Date.now()): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== CONSENT_VERSION) return null;
    if (Date.parse(parsed.expiresAt) <= now) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(choices: ConsentChoices, method: ConsentMethod, now = Date.now()): ConsentRecord {
  const record: ConsentRecord = {
    ...choices,
    version: CONSENT_VERSION,
    decidedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + CONSENT_MAX_AGE_DAYS * 86_400_000).toISOString(),
    method,
    gpc: hasGlobalPrivacyControl(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Storage blocked (private mode, previews): the choice applies to this page view only
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  return record;
}

export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

/** Runs `listener` whenever the choice changes, in this tab or another */
export function subscribeConsent(listener: (record: ConsentRecord | null) => void): () => void {
  const onLocal = (e: Event) => listener((e as CustomEvent<ConsentRecord | null>).detail);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_KEY || e.key === null) listener(readConsent());
  };
  window.addEventListener(CONSENT_EVENT, onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onLocal);
    window.removeEventListener("storage", onStorage);
  };
}
