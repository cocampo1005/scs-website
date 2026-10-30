import { afterEach, describe, expect, it, vi } from "vitest";
import { CONTACT_ENDPOINT, sendContactMessage } from "./contactApi";

const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });

const payload = { name: "Jane", email: "jane@example.com", message: "Hello there, world" };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("sendContactMessage", () => {
  it("posts JSON to the same-origin endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(200, { ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendContactMessage(payload)).resolves.toEqual({ ok: true });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(CONTACT_ENDPOINT);
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual(payload);
  });

  it("returns server field errors", async () => {
    const fields = { email: "Enter a valid email address." };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(422, { ok: false, error: "validation", fields })));
    await expect(sendContactMessage(payload)).resolves.toEqual({ ok: false, error: "validation", fields });
  });

  it("reports the rate limit with its wait", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(json(429, { ok: false, error: "rate_limited", retryAfter: 1200 }, { "Retry-After": "1200" }))
    );
    await expect(sendContactMessage(payload)).resolves.toEqual({
      ok: false,
      error: "rate_limited",
      retryAfter: 1200,
    });
  });

  it("treats server errors and non-JSON responses as unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(503, { ok: false, error: "unavailable" })));
    await expect(sendContactMessage(payload)).resolves.toEqual({ ok: false, error: "unavailable" });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<!doctype html>", { status: 404 })));
    await expect(sendContactMessage(payload)).resolves.toEqual({ ok: false, error: "unavailable" });

    // A 200 that isn't the endpoint (e.g. the SPA's index.html) is not a send
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<!doctype html>", { status: 200 })));
    await expect(sendContactMessage(payload)).resolves.toEqual({ ok: false, error: "unavailable" });
  });

  it("distinguishes network failures from timeouts", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(sendContactMessage(payload)).resolves.toEqual({ ok: false, error: "network" });

    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, { signal }) =>
          new Promise((_, reject) =>
            signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))
          )
      )
    );
    const pending = sendContactMessage(payload, { timeoutMs: 15000 });
    await vi.advanceTimersByTimeAsync(15000);
    await expect(pending).resolves.toEqual({ ok: false, error: "timeout" });
  });
});
