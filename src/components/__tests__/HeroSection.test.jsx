import { useEffect } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HeroSection from "../HeroSection";
import { hasWebGL } from "../../three/webgl";

vi.mock("../../three/webgl", () => ({ hasWebGL: vi.fn(), watchContextLoss: vi.fn() }));

// Stand-in for the R3F scene: reports ready, and solves when "skipped" (the
// real scene animates the snap first). `sceneMode` lets a test make it fail.
let sceneMode = "ok";
vi.mock("../hero3d/HeroPuzzleCanvas", () => ({
  default: function FakeCanvas({ skipped, onReady, onSolved }) {
    if (sceneMode === "throws") throw new Error("model failed to load");
    useEffect(() => onReady(), [onReady]);
    useEffect(() => {
      if (skipped) onSolved();
    }, [skipped, onSolved]);
    return <div data-testid="scene" />;
  },
}));

const renderHero = () =>
  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>
  );

beforeEach(() => {
  sceneMode = "ok";
  hasWebGL.mockReturnValue(true);
});

describe("HeroSection", () => {
  it("states the software offer and its CTAs before the puzzle is solved", async () => {
    renderHero();
    expect(await screen.findByTestId("scene")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Custom Software. Built Around Your Business.");
    expect(heading.closest("[aria-hidden='true'],[inert]")).toBeNull();
    expect(screen.getByRole("link", { name: "Discuss Your Project" })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: "Explore Our Work" })).toHaveAttribute("href", "/projects");
    expect(screen.queryByText(/Every piece has a purpose/)).toBeNull();
  });

  it("offers a visible control that completes the puzzle and reveals the story line", async () => {
    renderHero();
    await screen.findByTestId("scene");
    await userEvent.click(screen.getByRole("button", { name: "Place it for me" }));
    expect(await screen.findByText(/Every piece has a purpose/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Place it for me" })).toBeNull();
    // The offer stays in place after solving
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
  });

  it("shows the static poster without WebGL, keeping the copy and CTAs", () => {
    hasWebGL.mockReturnValue(false);
    renderHero();
    expect(screen.queryByTestId("scene")).toBeNull();
    expect(screen.getByRole("img", { name: /completed Solid Code Solutions cube/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Discuss Your Project" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Place it for me" })).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("falls back to the poster when the scene throws instead of blanking the page", async () => {
    sceneMode = "throws";
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderHero();
    const poster = await screen.findByRole("img", { name: /completed Solid Code Solutions cube/ });
    expect(poster).toBeInTheDocument();
    const section = screen.getByRole("region", { name: /Custom Software/ });
    expect(within(section).getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
