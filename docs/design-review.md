# Precision × Cinematic: final design proposal

Canvas: https://claude.ai/artifact/UbeffBeJC7nsPvUSPrjaga (private until shared)

## What the canvas contains

| Board | Covers |
|---|---|
| Homepage · desktop | Free-floating R3F cube on one continuous engineering grid (faded behind the copy). The software-first hero copy and CTAs are visible before solving. Then: client strip, featured-work bento (Street Cat Clinic, MeowMax), problem → fitted-solution rows, services bento (custom software dominant, websites as a slim secondary strip), process, inquiry bento, footer |
| Hero prototype (press Play) | Pick up the piece → drop. Then: lock-in flare, a light wave from behind the mesh, grid lines lighting up, pulses travelling and branching along the grid, fade to ambient, then the Input → Process → Software beat. A tweak toggles reduced motion |
| Hero states | Loading, idle, mid-drag, lock-in, wave, branching, settle, story beat, reduced motion, no-WebGL. Includes architecture notes |
| Mobile | Hero (idle and solved with a simplified circuit), work bento, services and CTA, at 390 px |
| Case study | Street Cat Clinic page: problem and built panels, key-screens bento, outcomes, a slot for verified results, CTA |
| About | Story, SOLID exhibit framed in a bento with piece controls and the info panel, values |
| Contact | Inquiry form as the feature tile, contact cards, "what happens next", FAQ accordion |
| Design system | Color roles with contrast, gradients and lighting, type scale, spacing and grid, bento rules, components and states, responsive rules, motion tokens, circuit timeline, accessibility rules |

All screenshots on the canvas are the sanitized copies. 3D imagery is captured
from the real scenes.

## How the reactive grid is built (for approval)

- **R3F renders only the puzzle.** A separate layer behind the canvas draws the
  grid and the circuit with one SVG and CSS keyframes (`clip-path`,
  `stroke-dashoffset`, opacity). There is no second WebGL context.
- **One event coordinates the two layers.** The scene emits `solved` with the
  cube's screen position. The hero sets `data-hero="solved"` and CSS
  variables, and CSS does the rest, so there are no per-frame React updates.
- **Scaled by device.**
  - Desktop: 6 paths and 4 branches, about 2.2 s, played once.
  - Tablet: 5 paths.
  - Phone: 3 paths and no branching.
  - Reduced motion: opacity only.
  - No WebGL: the circuit never plays.

## Decisions I need from you

1. **Hero copy.** "Custom software. Built around your business." (brief option
   A). Approve, or pick B or C.
2. **Circuit intensity.** Is the prototype's brightness and duration (about
   2.2 s) right, or should it be subtler or shorter? Should it replay on every
   solve, or only the first time per session?
3. **Solved state on return visits.** Keep the hero solved for the rest of the
   browser session (no re-solving after navigating back), or always reset?
4. **Story beat placement.** Under the cube (as drawn), or as a strip at the
   bottom of the hero?
5. **Typefaces.** Keep Space Grotesk (display) and Work Sans (body) from the
   current site, with JetBrains Mono for labels and Rajdhani only for the
   wordmark and 3D text?
6. **Dark only.** No light theme for launch?
7. **Navigation.** Services · Work · About · Contact, plus a "Discuss your
   project" button. Should Services be its own page (`/services`), or only a
   homepage section with anchors? I recommend its own page; it helps SEO for
   "custom software development".
8. **Portfolio scope.** Street Cat Clinic and MeowMax get full case-study pages.
   Should LMSYC and Bio-Coatings/Blast-It-Off get full pages under a
   "Websites" group, or stay as cards?
9. **Screenshots.** Keep blurred names, or re-capture the affected screens from
   a demo account with fictional data (cleaner look, more effort)?
10. **Tablet.** The canvas shows desktop and phone, with tablet covered by the
    responsive rules. Do you want explicit tablet boards before approval?

Once these are settled, I'll update the canvas and mark it final. I won't
start the production redesign until you approve the result.
