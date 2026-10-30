import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Privacy from "../../pages/Privacy";

const inRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Navbar", () => {
  it("exposes the mobile menu state and keeps collapsed links out of reach", async () => {
    const { container } = inRouter(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    const menu = container.querySelector("#mobile-menu");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("inert");

    await userEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(menu).not.toHaveAttribute("inert");
  });
});

describe("Footer", () => {
  it("labels each social link with its own network", () => {
    inRouter(<Footer />);
    for (const name of ["LinkedIn", "Instagram", "Facebook", "X (Twitter)"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });
});

describe("Privacy page", () => {
  it("discloses the contact form processor and Google Ads, with a fixed date", () => {
    inRouter(<Privacy />);
    expect(screen.getByText(/Last updated/)).toHaveTextContent("October 30, 2026");
    expect(screen.getByRole("link", { name: "EmailJS" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Google Ads/ })).toBeInTheDocument();
    expect(screen.queryByText(/does not collect personal data/)).toBeNull();
  });
});
