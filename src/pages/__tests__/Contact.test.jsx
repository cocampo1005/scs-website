import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import emailjs from "@emailjs/browser";
import Contact from "../Contact";

vi.mock("@emailjs/browser", () => ({ default: { send: vi.fn() } }));

const renderContact = (url = "/contact") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Contact />
    </MemoryRouter>
  );

describe("Contact page", () => {
  it("shows field errors and does not send an incomplete form", async () => {
    renderContact();
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it("prefills the message for a 'start similar' link using the case study title", () => {
    renderContact("/contact?intent=start-similar&project=street-cat-clinic");
    expect(screen.getByRole("textbox", { name: /Tell us about your project/ }).value).toMatch(
      /similar to Street Cat Clinic/
    );
  });

  it("uses a real accordion for the FAQ", async () => {
    renderContact();
    const question = screen.getByRole("button", { name: /What kind of budget/ });
    expect(question).toHaveAttribute("aria-expanded", "false");
    const answer = document.getElementById(question.getAttribute("aria-controls"));
    expect(answer).toHaveAttribute("inert");
    await userEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(answer).not.toHaveAttribute("inert");
  });
});
