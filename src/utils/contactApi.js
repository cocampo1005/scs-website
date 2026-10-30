// Client for the same-origin PHP contact endpoint (public/api/contact.php).
// Resolves to { ok: true } or { ok: false, error, fields?, retryAfter? }; never throws.

export const CONTACT_ENDPOINT = "/api/contact";

const KNOWN_ERRORS = new Set(["validation", "rate_limited", "unavailable"]);

export async function sendContactMessage(payload, { timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "same-origin",
    });
  } catch (err) {
    return { ok: false, error: err?.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }

  const body = await res.json().catch(() => null);
  if (res.ok && body?.ok === true) return { ok: true };

  if (res.status === 429) {
    const retryAfter = Number(body?.retryAfter ?? res.headers.get("Retry-After")) || undefined;
    return { ok: false, error: "rate_limited", retryAfter };
  }
  if (body?.error === "validation" && body.fields && typeof body.fields === "object") {
    return { ok: false, error: "validation", fields: body.fields };
  }
  return { ok: false, error: KNOWN_ERRORS.has(body?.error) ? body.error : "unavailable" };
}
