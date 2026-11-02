import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import Privacy from "../../pages/Privacy";

const inRouter = (ui: ReactElement, url = "/") => render(<MemoryRouter initialEntries={[url]}>{ui}</MemoryRouter>);

describe("SiteHeader", () => {
  it("marks the current section and links the primary CTA to contact", () => {
    inRouter(<SiteHeader />, "/services");
    const primary = screen.getByRole("navigation", { name: "Primary" });
    expect(primary.querySelector('[aria-current="page"]')).toHaveTextContent("Services");
    expect(screen.getAllByRole("link", { name: "Discuss your project" })[0]).toHaveAttribute("href", "/contact");
  });

  it("exposes the mobile menu state and hides the collapsed panel", async () => {
    const { container } = inRouter(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    const panel = container.querySelector("#mobile-nav");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("hidden");

    await userEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(panel).not.toHaveAttribute("hidden");

    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });
});

describe("SiteFooter", () => {
  it("labels each social link with its own network", () => {
    inRouter(<SiteFooter />);
    for (const name of ["LinkedIn", "Instagram", "Facebook", "X (Twitter)"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("links every service anchor", () => {
    inRouter(<SiteFooter />);
    for (const id of ["custom", "automation", "modernization", "websites"]) {
      expect(document.querySelector(`a[href="/services#${id}"]`)).not.toBeNull();
    }
  });
});

describe("Privacy page", () => {
  it("discloses the contact form processor and Google Ads, with a fixed date", () => {
    inRouter(<Privacy />);
    expect(screen.getByText(/Last updated/)).toHaveTextContent("October 30, 2026");
    expect(screen.getByText(/processed on our own web server/)).toHaveTextContent("Hostinger");
    expect(screen.queryByText(/EmailJS/)).toBeNull();
    expect(screen.getByText(/deletes these records within 24/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Google Ads/ })).toBeInTheDocument();
  });
});
