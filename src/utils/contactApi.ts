// Client for the same-origin PHP contact endpoint (public/api/contact.php).
// Resolves to { ok: true } or { ok: false, error, fields?, retryAfter? }; never throws.
import type { ContactErrors } from "./contactValidation";

export const CONTACT_ENDPOINT = "/api/contact";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  phone?: { digits: string; dialCode: string; display: string } | null;
  website?: string;
  elapsedMs?: number;
};

export type ContactError = "validation" | "rate_limited" | "unavailable" | "timeout" | "network";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: ContactError; fields?: ContactErrors; retryAfter?: number };

type ResponseBody = { ok?: unknown; error?: unknown; fields?: unknown; retryAfter?: unknown } | null;

const KNOWN_ERRORS = new Set<ContactError>(["validation", "rate_limited", "unavailable"]);

export async function sendContactMessage(
  payload: ContactPayload,
  { timeoutMs = 15000 }: { timeoutMs?: number } = {},
): Promise<ContactResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "same-origin",
    });
  } catch (err) {
    return { ok: false, error: (err as Error | null)?.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }

  const body: ResponseBody = await res.json().catch(() => null);
  if (res.ok && body?.ok === true) return { ok: true };

  if (res.status === 429) {
    const retryAfter = Number(body?.retryAfter ?? res.headers.get("Retry-After")) || undefined;
    return { ok: false, error: "rate_limited", retryAfter };
  }
  if (body?.error === "validation" && body.fields && typeof body.fields === "object") {
    return { ok: false, error: "validation", fields: body.fields as ContactErrors };
  }
  const error = body?.error as ContactError;
  return { ok: false, error: KNOWN_ERRORS.has(error) ? error : "unavailable" };
}
