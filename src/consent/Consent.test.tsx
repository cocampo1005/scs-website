import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { ConsentProvider } from "./ConsentProvider";
import { useConsent } from "./useConsent";
import { CONSENT_KEY, readConsent, writeConsent } from "./consent";
import { resetGoogleTagForTests } from "./googleTag";

function Footer() {
  const { openSettings, consent } = useConsent();
  return (
    <footer>
      <p>ads: {String(consent?.advertising ?? "undecided")}</p>
      <button type="button" onClick={openSettings}>
        Cookie settings
      </button>
    </footer>
  );
}

const renderApp = () =>
  render(
    <MemoryRouter>
      <ConsentProvider>
        <main>
          <h1>Page</h1>
        </main>
        <Footer />
      </ConsentProvider>
    </MemoryRouter>,
  );

const tagScripts = () => document.querySelectorAll('script[src^="https://www.googletagmanager.com/gtag/js"]');
const banner = () => screen.queryByRole("dialog", { name: "Your privacy choices" });

beforeEach(() => {
  localStorage.clear();
  resetGoogleTagForTests();
  delete window.dataLayer;
  document.head.querySelectorAll("script").forEach((s) => s.remove());
});

describe("cookie banner", () => {
  it("shows once with equal Accept and Reject actions, and loads nothing before a choice", async () => {
    renderApp();
    const dialog = await screen.findByRole("dialog", { name: "Your privacy choices" });
    expect(dialog).toHaveAttribute("aria-describedby");
    const accept = within(dialog).getByRole("button", { name: "Accept all" });
    const reject = within(dialog).getByRole("button", { name: "Reject all" });
    expect(accept.className).toBe(reject.className);
    expect(within(dialog).getByRole("button", { name: "Customize" })).toBeInTheDocument();
    expect(tagScripts()).toHaveLength(0);
    expect(readConsent()).toBeNull();
  });

  it("rejecting records the choice, hides the banner and keeps Google out", async () => {
    renderApp();
    await userEvent.click(await screen.findByRole("button", { name: "Reject all" }));
    expect(banner()).toBeNull();
    expect(readConsent()).toMatchObject({ advertising: false, method: "reject_all" });
    expect(tagScripts()).toHaveLength(0);
    expect(screen.getByText("ads: false")).toBeInTheDocument();
  });

  it("accepting loads the tag with measurement-only consent", async () => {
    renderApp();
    await userEvent.click(await screen.findByRole("button", { name: "Accept all" }));
    expect(banner()).toBeNull();
    expect(readConsent()).toMatchObject({ advertising: true, method: "accept_all" });
    expect(tagScripts()).toHaveLength(1);
  });

  it("does not appear again while a valid choice is stored, and applies it", async () => {
    writeConsent({ advertising: true }, "accept_all");
    renderApp();
    expect(await screen.findByText("ads: true")).toBeInTheDocument();
    expect(banner()).toBeNull();
    expect(tagScripts()).toHaveLength(1);
  });

  it("explains a Global Privacy Control signal", async () => {
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true, configurable: true });
    renderApp();
    expect(await screen.findByText(/Global Privacy Control signal/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Reject all" }));
    expect(JSON.parse(localStorage.getItem(CONSENT_KEY)!).gpc).toBe(true);
    Object.defineProperty(navigator, "globalPrivacyControl", { value: undefined, configurable: true });
  });
});

describe("cookie settings", () => {
  it("opens from the footer as a modal, saves a custom choice, and withdraws it later", async () => {
    writeConsent({ advertising: true }, "accept_all");
    renderApp();
    await screen.findByText("ads: true");
    const opener = screen.getByRole("button", { name: "Cookie settings" });
    await userEvent.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Choose what this site may store" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    const necessary = within(dialog).getByRole("switch", { name: /Strictly necessary/ });
    expect(necessary).toBeChecked();
    expect(necessary).toBeDisabled();
    const ads = within(dialog).getByRole("switch", { name: "Advertising measurement" });
    expect(ads).toBeChecked();

    await userEvent.click(ads);
    expect(ads).not.toBeChecked();
    await userEvent.click(within(dialog).getByRole("button", { name: "Save preferences" }));
    expect(screen.queryByRole("dialog", { name: "Choose what this site may store" })).toBeNull();
    expect(readConsent()).toMatchObject({ advertising: false, method: "reject_all" });
    expect(screen.getByText("ads: false")).toBeInTheDocument();
    // The loaded tag was told consent is denied
    const updates = (window.dataLayer ?? []).map((e) => Array.from(e as ArrayLike<unknown>)).filter((e) => e[0] === "consent" && e[1] === "update");
    expect(updates.at(-1)?.[2]).toMatchObject({ ad_storage: "denied", ad_user_data: "denied" });
    expect(opener).toHaveFocus();
  });

  it("closes with Escape and returns focus", async () => {
    writeConsent({ advertising: false }, "reject_all");
    renderApp();
    await screen.findByText("ads: false");
    const opener = screen.getByRole("button", { name: "Cookie settings" });
    await userEvent.click(opener);
    expect(screen.getByRole("dialog", { name: "Choose what this site may store" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Choose what this site may store" })).toBeNull();
    expect(opener).toHaveFocus();
  });
});
