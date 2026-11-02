import { describe, expect, it } from "vitest";
import { heroReducer, initialHeroState, type HeroAction, type HeroState } from "./useHomeHero";

const run = (...actions: HeroAction[]): HeroState => actions.reduce(heroReducer, initialHeroState);

describe("hero state", () => {
  it("plays the circuit on a deliberate solve, then settles into the ambient pulse", () => {
    const solved = run({ type: "place" }, { type: "solved", reducedMotion: false });
    expect(solved).toMatchObject({ solved: true, circuit: "playing" });
    expect(heroReducer(solved, { type: "circuitDone" }).circuit).toBe("ambient");
  });

  it("shows the still circuit under reduced motion, with no ambient animation", () => {
    const solved = run({ type: "solved", reducedMotion: true });
    expect(solved.circuit).toBe("static");
    expect(heroReducer(solved, { type: "circuitDone" })).toBe(solved);
  });

  it("restores a session solve straight into the ambient state, without the sequence", () => {
    const restored = run({ type: "restore", reducedMotion: false }, { type: "solved", reducedMotion: false });
    expect(restored).toMatchObject({ solved: true, restored: true, circuit: "ambient" });
    expect(run({ type: "restore", reducedMotion: true }).circuit).toBe("static");
  });

  it("replays from the start with a fresh scene", () => {
    const replayed = run({ type: "solved", reducedMotion: false }, { type: "circuitDone" }, { type: "replay" });
    expect(replayed).toEqual({ ...initialHeroState, replayKey: 1 });
    expect(heroReducer(replayed, { type: "solved", reducedMotion: false }).circuit).toBe("playing");
  });

  it("ignores a second solve report", () => {
    const once = run({ type: "solved", reducedMotion: false }, { type: "circuitDone" });
    expect(heroReducer(once, { type: "solved", reducedMotion: false })).toBe(once);
  });
});
