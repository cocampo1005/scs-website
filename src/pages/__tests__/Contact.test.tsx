import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sendContactMessage } from "../../utils/contactApi";
import { recordConversion } from "../../consent/googleTag";
import Contact from "../Contact";

vi.mock("../../utils/contactApi", () => ({ sendContactMessage: vi.fn() }));
vi.mock("../../consent/googleTag", () => ({ recordConversion: vi.fn(() => true) }));
const send = vi.mocked(sendContactMessage);
const conversion = vi.mocked(recordConversion);

const renderContact = (url = "/contact") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Contact />
    </MemoryRouter>,
  );

const messageBox = () => screen.getByRole("textbox", { name: /What would you like to build or improve/ });

async function fillValidForm() {
  await userEvent.type(screen.getByRole("textbox", { name: /^Name/ }), "Jane Doe");
  await userEvent.type(screen.getByRole("textbox", { name: /^Email/ }), "jane@example.com");
  await userEvent.type(messageBox(), "We need a booking site.");
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("Contact page", () => {
  it("shows the email and phone details above the form", () => {
    renderContact();
    expect(screen.getByRole("link", { name: /christian@solidcodesolutionsllc.com/ })).toHaveAttribute("href", "mailto:christian@solidcodesolutionsllc.com");
    expect(screen.getByRole("link", { name: /\+1 \(954\) 559-2944/ })).toHaveAttribute("href", "tel:+19545592944");
    expect(screen.queryByText(/WhatsApp/)).toBeNull();
  });

  it("shows field errors and does not send an incomplete form", async () => {
    renderContact();
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^Name/ })).toHaveAttribute("aria-invalid", "true");
    expect(send).not.toHaveBeenCalled();
  });

  it("sends to the contact endpoint and records the Ads conversion on success", async () => {
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
    expect(conversion).toHaveBeenCalledTimes(1);
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
    send.mockResolvedValue({ ok: false, error: "validation", fields: { message: "Please include no more than 3 links." } });
    renderContact();
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Please include no more than 3 links.")).toBeInTheDocument();
    expect(screen.getByText("Please fix the highlighted fields.")).toBeInTheDocument();
    expect(conversion).not.toHaveBeenCalled();
  });

  it("explains the rate limit", async () => {
    send.mockResolvedValue({ ok: false, error: "rate_limited", retryAfter: 1200 });
    renderContact();
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText(/Too many attempts/)).toBeInTheDocument();
  });

  it("prefills an editable, project-specific message for a similar-project link", async () => {
    renderContact("/contact?intent=start-similar&project=street-cat-clinic&title=Street%20Cat%20Clinic#form");
    const box = messageBox() as HTMLTextAreaElement;
    expect(box.value).toBe(
      "Hello, I'm interested in discussing a custom software project similar to the Street Cat Clinic records management platform. I'd like to learn more about what you could build for our business.",
    );
    await userEvent.type(box, " We run a clinic too.");
    expect(box.value).toMatch(/We run a clinic too\.$/);
  });

  it("falls back to the title for an unknown project", () => {
    renderContact("/contact?intent=start-similar&project=unknown&title=Some%20Project");
    expect((messageBox() as HTMLTextAreaElement).value).toMatch(/similar to Some Project/);
  });

  it("uses a real accordion for the FAQ", async () => {
    renderContact();
    const question = screen.getByRole("button", { name: /Do I need technical specifications/ });
    expect(question).toHaveAttribute("aria-expanded", "false");
    const answer = document.getElementById(question.getAttribute("aria-controls")!);
    expect(answer).toHaveAttribute("inert");
    await userEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(answer).not.toHaveAttribute("inert");
  });
});
