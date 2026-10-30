# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing/portfolio site for Solid Code Solutions LLC (https://solidcodesolutionsllc.com). Client-side React 19 SPA built with Vite 6, Tailwind CSS v4, React Router v7, and Framer Motion. Plain JavaScript (JSX), no TypeScript. No test suite.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint (flat config in `eslint.config.js`, react-hooks + react-refresh rules)

## Architecture

- **Routing**: `src/App.jsx` defines all routes inside a shared layout (`Navbar`, `ScrollToTop`, `Footer`). Unknown paths render `Home`. Pages live in `src/pages/`, reusable UI in `src/components/`.
- **Content is data-driven**: page copy and project content live in `src/constants/`, not in the page components.
  - `homeData.js` — `SERVICES`, `ADVANTAGES`, and `PROJECTS` (home-page feature cards, each with an `href` deep link into the Projects page).
  - `projectsData.js` — `CASE_STUDIES` (each identified by `key`), `OTHER_PROJECTS`, `clientLogos`, and per-project screenshot arrays. Images are imported from `src/assets/projects/<project>/` as `.webp`.
  - Adding a case study typically means: add images under `src/assets/projects/`, add an entry to `CASE_STUDIES`, and optionally a feature card in `homeData.js` `PROJECTS`.
- **Deep linking via query + hash**: `Projects` selects the active case study from `?case=<key>` and scrolls to `#featured`; `Contact` reads `?intent=start-similar&project=…&title=…` to prefill the form (link built by `buildStartSimilarLink` in `src/utils/similarProjectLinks.js`). Hash scrolling with nav-height offset is handled by `useScrollToHash` (`src/hooks/`).
- **SEO**: each page renders `<SEO>` (title/description/canonical/OG/Twitter tags) with `<JsonLd>` children for structured data. These render `<title>`/`<meta>` directly in the component tree and rely on React 19's automatic hoisting into `<head>` — no react-helmet. Canonical/OG URLs are built from the hard-coded `ORIGIN` in `src/components/SEO.jsx`.
- **Hero puzzle (React Three Fiber)**: `HeroSection` lazy-loads `src/components/hero3d/HeroPuzzleCanvas`, which renders the drag-to-complete cube puzzle from the local GLB `public/models/scs-hero-puzzle.glb` (exported from the original Spline scene; reference files in `docs/references/spline-hero-section/`). Transforms, camera and light values live in `hero3d/puzzleConfig.js` in Spline units. `PuzzleScene` owns the drag state machine (`idle → dragging → snapping → completed`) and calls `onSolved`; `useHeroPuzzle` turns that (or the Skip button) into `showUI`, which gates the hero copy reveal. Cube pieces and the logo cube share one parent group so the solved cube spins and floats as a unit. The canvas renders with `frameloop="always"` (idle/solved float), `"demand"` under reduced motion, and `"never"` when off-screen or the tab is hidden.
- **About page SOLID puzzle (React Three Fiber)**: `SolidPuzzle` (state via `useSolidPuzzle`) lazy-loads `src/components/solid3d/SolidPuzzleCanvas`. Visitors drag seven pieces into shape-matched outlines to rebuild the 6x4 wall. Pieces come from `public/models/scs-solid-puzzle.glb`, trimmed from the Spline export in `docs/references/spline-tetris-solid-interaction/` by `node scripts/extract-solid-puzzle-model.mjs`. Each piece's GLB node transform *is* its target. Outlines are traced from the mesh (`solidSilhouette.js`). Copy, start arrangements and tuning live in `src/constants/solidPuzzleData.js`. Layouts: `wide` (≥768px) uses fixed seeded arrangements around the wall; `tall` (phones) shelf-packs unplaced pieces into a tray under the wall that re-packs and shrinks the stage as pieces are placed (the scene reports the stage height via `onStageChange`). Info is HTML, with one open piece at a time (`activeInfoId`): `SolidInfoPanel` in a column beside the board at ≥1024px, `SolidInfoSheet` (a bottom sheet portalled to `<body>`, minimized while the board is touched) below that. While the logo piece is open, the GLB's Logo Cube pops out of its slot inside the board canvas (`LogoReveal`); there is no second WebGL context. Spline is no longer a dependency.
- **Contact form**: sends via EmailJS (`@emailjs/browser`) using env vars `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (put them in `.env.local`, which is gitignored). Phone input uses `react-phone-input-2` with overrides in `src/styles/phone-input.css`.

## Styling

Tailwind v4 via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js`. Design tokens (brand colors like `primary-dark-purple`, `accent-fuchsia*`, `accent-purple*`, status colors, and fonts `font-logo`/`font-display`/`font-sans`) are defined in the `@theme` block of `src/index.css`; use these token utilities rather than raw hex values. Icons come from `lucide-react` and `@phosphor-icons/react`.
