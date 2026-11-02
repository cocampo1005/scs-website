import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sendContactMessage } from "../../utils/contactApi";
import Contact from "../Contact";

vi.mock("../../utils/contactApi", () => ({ sendContactMessage: vi.fn() }));
const send = vi.mocked(sendContactMessage);

const renderContact = (url = "/contact") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Contact />
    </MemoryRouter>,
  );

const messageBox = () => screen.getByRole("textbox", { name: /What should the software help with/ });

async function fillValidForm() {
  await userEvent.type(screen.getByRole("textbox", { name: /^Name/ }), "Jane Doe");
  await userEvent.type(screen.getByRole("textbox", { name: /Work email/ }), "jane@example.com");
  await userEvent.type(messageBox(), "We need a booking site.");
}

afterEach(() => {
  vi.clearAllMocks();
  delete window.gtag;
});

describe("Contact page", () => {
  it("shows field errors and does not send an incomplete form", async () => {
    renderContact();
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^Name/ })).toHaveAttribute("aria-invalid", "true");
    expect(send).not.toHaveBeenCalled();
  });

  it("sends to the contact endpoint and records the Ads conversion on success", async () => {
    window.gtag = vi.fn();
    send.mockResolvedValue({ ok: true });
    renderContact();
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText(/we'll be in touch shortly/)).toBeInTheDocument();
    const payload = send.mock.calls[0]![0];
    expect(payload).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "We need a booking site.",
      phone: null,
      website: "",
    });
    expect(payload.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(window.gtag).toHaveBeenCalledWith("event", "conversion", expect.any(Object));
  });

  it("adds the tools field to the message", async () => {
    send.mockResolvedValue({ ok: true });
    renderContact();
    await fillValidForm();
    await userEvent.type(screen.getByRole("textbox", { name: /Tools you use today/ }), "Google Sheets");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByText(/we'll be in touch shortly/);
    expect(send.mock.calls[0]![0].message).toBe("We need a booking site.\n\nTools used today: Google Sheets");
  });

  it("shows server field errors and does not record a conversion", async () => {
    window.gtag = vi.fn();
    send.mockResolvedValue({ ok: false, error: "validation", fields: { message: "Please include no more than 3 links." } });
    renderContact();
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Please include no more than 3 links.")).toBeInTheDocument();
    expect(screen.getByText("Please fix the highlighted fields.")).toBeInTheDocument();
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it("explains the rate limit", async () => {
    send.mockResolvedValue({ ok: false, error: "rate_limited", retryAfter: 1200 });
    renderContact();
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText(/Too many attempts/)).toBeInTheDocument();
  });

  it("prefills the message for a similar-project link", () => {
    renderContact("/contact?intent=start-similar&project=street-cat-clinic");
    expect((messageBox() as HTMLTextAreaElement).value).toMatch(/similar to Street Cat Clinic/);
  });

  it("uses a real accordion for the FAQ", async () => {
    renderContact();
    const question = screen.getByRole("button", { name: /What should I budget/ });
    expect(question).toHaveAttribute("aria-expanded", "false");
    const answer = document.getElementById(question.getAttribute("aria-controls")!);
    expect(answer).toHaveAttribute("inert");
    await userEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(answer).not.toHaveAttribute("inert");
  });
});
