# Precision × Cinematic: final design specification

Status: **direction approved; final responsive review pending.** Do not start
the production redesign until the canvas below is confirmed.

Canvas: https://claude.ai/artifact/UbeffBeJC7nsPvUSPrjaga (private until shared)

| Board | Covers |
|---|---|
| Homepage · desktop | Free-floating cube on a continuous grid, the approved headline, story strip at the bottom of the hero, bento sections |
| Hero prototype (Play) | Drag/place → circuit sequence → story strip lights up; "Replay the puzzle"; reduced-motion toggle |
| Hero states | Loading → idle → mid-drag → lock-in → wave → branching → settle, plus reduced motion and no-WebGL |
| Mobile (390) | Hero, solved state, work and services bentos, CTA |
| Tablet (820, 1024) | Stacked hero with 6-column bentos; split hero starting at 1024 |
| Services (`/services`) | Custom software as the dominant service; automation and modernization secondary; websites supporting; anchors per service |
| Work (`/work`) | Software case studies first; "Websites & web experiences" secondary (LMSYC and Bio-Coatings keep case-study pages) |
| Case study, About, Contact | Bento page templates |
| Design system | Tokens, type, spacing, bento rules, components, responsive and motion specifications |

Screenshots are the original app captures (fictional demo data). 3D imagery is
captured from the real scenes.

## Decisions (approved 30 Oct 2026)

1. **Headline.** "Custom Software. Built Around Your Business." The
   missing-piece idea carries through the supporting line, the puzzle hint and
   the solved line "Every piece has a purpose."
2. **Circuit sequence.**
   - **Timing.** About 2.2 s target: lock-in flare (0–150 ms), wave and grid
     light (150–600 ms), pulses and branches (600–1400 ms), settle (to about
     2.2 s).
   - **Focus.** The cube stays the brightest element. Pulses are 2 px with a
     soft glow, and the grid lights up to 40% at most.
   - **Plays on:** a deliberate solve (drag or "Place it for me") and on every
     solve after a replay.
   - **Never plays on:** a restored session state, or navigation.
   - **Profiling.** If a mid-range phone drops below 50 fps during the
     sequence, cut paths first, then branch count, then duration.
3. **Session persistence.**
   - **What is stored.** Solving stores `scs:hero-solved=1` in
     `sessionStorage`. A new browser session starts unsolved.
   - **Hydration.** The value is read **after mount**, so prerendered HTML
     and the first client render always match (the unsolved layout). A
     restored session then jumps straight to the assembled cube with no
     animation and no circuit.
   - **Replay.** "Replay the puzzle" (a small text button next to the solved
     line) clears the flag and returns the pieces to the start.
4. **Story strip.**
   - **Placement.** "Input → Process → Software" sits in a thin band at the
     bottom of the hero, muted at about 45% opacity before solving.
   - **After solving.** It lights up 1.9 s after a solve (or at once with
     reduced motion): the nodes brighten, and the wires take the
     fuchsia gradient.
   - It never overlaps the cube, copy, CTAs or navigation, and is not
     interactive.
5. **Typography.**
   - **Families.** Space Grotesk (500/600/700) for display, Work Sans
     (400/500/600) for body, JetBrains Mono (500) sparingly for labels, and
     Rajdhani (700) for the wordmark and the 3D label.
   - **Weights.** Four families with only these weights; Rajdhani is
     self-hosted.
6. **Dark only** for launch.
7. **`/services` page.**
   - **Hierarchy.** Custom software is the feature tile; automation and
     modernization are secondary tiles; websites are a slim supporting
     strip.
   - **SEO.** Each service has an anchor (`#custom`, `#automation`,
     `#modernization`, `#websites`) and its own H2, so the page can grow into
     sub-pages later.
   - **Homepage.** It keeps a short services bento linking to `/services`.
8. **Portfolio.**
   - **Featured.** Street Cat Clinic and MeowMax are the featured software
     case studies.
   - **Secondary.** Let Me Style Your Career and Bio-Coatings/Blast-It-Off keep
     case-study pages under "Websites & web experiences". Icon Group,
     A & A Recreations and ELC stay as cards.
   - **Redirects.** All existing `/projects?case=…` links redirect (301) to
     `/work/<slug>`.
9. **Screenshots.** The originals (fictional demo data) are used as-is.
10. **Tablet.** Explicit boards at 820 and 1024:
    - **Below 1024.** The hero stacks (copy centred above a 440 px stage) and
      bentos use 6 columns.
    - **From 1024.** The hero splits, the cube is 0.68× its desktop size, the
      circuit uses 5 paths, and feature tiles span 7 columns or fewer.

## Remaining open points (content, not design)

- `/services`: answer "Who owns the code?" with your standard terms (shown as a
  placeholder).
- Case-study architecture details marked `[Confirm …]`.
- Client logo permissions (`docs/content-review.md`).
