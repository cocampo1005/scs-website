import { describe, expect, it } from "vitest";
import { heroReducer, initialHeroState, type HeroAction, type HeroState } from "./useHomeHero";

const run = (...actions: HeroAction[]): HeroState => actions.reduce(heroReducer, initialHeroState);

describe("hero state", () => {
  it("plays the circuit on a deliberate solve and lights the story strip later", () => {
    const solved = run({ type: "place" }, { type: "solved", reducedMotion: false });
    expect(solved).toMatchObject({ solved: true, circuit: "playing", storyLit: false });
    expect(heroReducer(solved, { type: "lightStory" }).storyLit).toBe(true);
    expect(heroReducer(solved, { type: "circuitDone" }).circuit).toBe("off");
  });

  it("shows the still circuit under reduced motion", () => {
    expect(run({ type: "solved", reducedMotion: true }).circuit).toBe("static");
  });

  it("restores a session solve without the sequence", () => {
    const restored = run({ type: "restore" }, { type: "solved", reducedMotion: false });
    expect(restored).toMatchObject({ solved: true, restored: true, circuit: "off", storyLit: true });
  });

  it("replays from the start with a fresh scene", () => {
    const replayed = run({ type: "solved", reducedMotion: false }, { type: "replay" });
    expect(replayed).toEqual({ ...initialHeroState, replayKey: 1 });
    expect(heroReducer(replayed, { type: "solved", reducedMotion: false }).circuit).toBe("playing");
  });

  it("ignores a second solve report", () => {
    const once = run({ type: "solved", reducedMotion: false }, { type: "circuitDone" });
    expect(heroReducer(once, { type: "solved", reducedMotion: false })).toBe(once);
  });
});
