# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing/portfolio site for Solid Code Solutions LLC (https://solidcodesolutionsllc.com). Client-side React 19 SPA built with Vite 6, Tailwind CSS v4, React Router v7, and Framer Motion. Plain JavaScript (JSX), no TypeScript (migration planned). Vitest + Testing Library unit/component tests and Playwright e2e tests. The contact form posts to a small PHP endpoint (`server/`, PHPMailer over SMTP); local development needs PHP 8.2+ and Composer.

## Commands

- `npm run dev` — Vite dev server with HMR (proxies `/api/contact` to `npm run dev:api`)
- `npm run dev:api` — PHP built-in server for the contact endpoint on port 8787; creates a dev `server/config.php` that writes messages to `server/var/outbox/` instead of sending
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint (flat config in `eslint.config.js`, react-hooks + react-refresh + react/jsx-uses-vars)
- `npm test` — Vitest unit/component tests (`src/**/*.test.{js,jsx}`, jsdom)
- `npm run test:php` — PHPUnit tests for `server/` (run `composer install` in `server/` first)
- `npm run e2e` — Playwright against `vite preview` on port 4173, using the installed Chrome (`e2e/`)
- `npm run check` — lint, test, test:php, build, e2e
- `npm run build:release` — production build behind `scripts/check-release.mjs` (endpoint, `.htaccess` `/api` rules, locked server deps, no EmailJS)
- `npm run package:release -- --target=staging|production --server-dir=<abs path>` — builds `release/site-*.zip`, `release/server-*.zip` and `release/htaccess.<target>` (see `docs/staging.md`)

## Architecture

- **Routing**: `src/App.jsx` defines all routes inside a shared layout (`Navbar`, `ScrollToTop`, `Footer`). Unknown paths render `Home`. Pages live in `src/pages/`, reusable UI in `src/components/`.
- **Content is data-driven**: page copy and project content live in `src/constants/`, not in the page components.
  - `homeData.js` — `SERVICES`, `ADVANTAGES`, and `PROJECTS` (home-page feature cards, each with an `href` deep link into the Projects page).
  - `projectsData.js` — `CASE_STUDIES` (each identified by `key`), `OTHER_PROJECTS`, `clientLogos`, and per-project screenshot arrays. Images are imported from `src/assets/projects/<project>/` as `.webp`.
  - Adding a case study typically means: add images under `src/assets/projects/`, add an entry to `CASE_STUDIES`, and optionally a feature card in `homeData.js` `PROJECTS`.
- **Deep linking via query + hash**: `Projects` selects the active case study from `?case=<key>` and scrolls to `#featured`; `Contact` reads `?intent=start-similar&project=…&title=…` to prefill the form (link built by `buildStartSimilarLink` in `src/utils/similarProjectLinks.js`). Hash scrolling with nav-height offset is handled by `useScrollToHash` (`src/hooks/`).
- **SEO**: each page renders `<SEO>` (title/description/canonical/OG/Twitter tags) with `<JsonLd>` children for structured data. These render `<title>`/`<meta>` directly in the component tree and rely on React 19's automatic hoisting into `<head>` — no react-helmet. Canonical/OG URLs are built from the hard-coded `ORIGIN` in `src/components/SEO.jsx`.
- **Hero puzzle (React Three Fiber)**: `HeroSection` lazy-loads `src/components/hero3d/HeroPuzzleCanvas`, which renders the drag-to-complete cube puzzle from the local GLB `public/models/scs-hero-puzzle.glb` (exported from the original Spline scene; reference files in `docs/references/spline-hero-section/`). Transforms, camera and light values live in `hero3d/puzzleConfig.js` in Spline units. `PuzzleScene` owns the drag state machine (`idle → dragging → snapping → completed`) and calls `onSolved`. The hero's H1, copy and CTAs are always rendered; `useHeroPuzzle` tracks `solved` (shows the story line) and the "Place it for me" control sets `skipped`, which the scene animates like a drop. The canvas spans the hero while `StageFraming` zooms and offsets the camera so the puzzle sits in the stage element below the copy. Only touches that start on the logo cube are captured. Without WebGL, on a scene error (`SceneBoundary`) or on context loss, a static poster (`assets/images/hero-puzzle-solved.webp`) replaces the canvas. Shared helpers: `src/three/webgl.js`, `src/components/SceneBoundary.jsx`. Cube pieces and the logo cube share one parent group so the solved cube spins and floats as a unit. The canvas renders with `frameloop="always"` (idle/solved float), `"demand"` under reduced motion, and `"never"` when off-screen or the tab is hidden.
- **About page SOLID puzzle (React Three Fiber)**: `SolidPuzzle` (state via `useSolidPuzzle`) lazy-loads `src/components/solid3d/SolidPuzzleCanvas`. Visitors drag seven pieces into shape-matched outlines to rebuild the 6x4 wall. Pieces come from `public/models/scs-solid-puzzle.glb`, trimmed from the Spline export in `docs/references/spline-tetris-solid-interaction/` by `node scripts/extract-solid-puzzle-model.mjs`. Each piece's GLB node transform *is* its target. Outlines are traced from the mesh (`solidSilhouette.js`). Copy, start arrangements and tuning live in `src/constants/solidPuzzleData.js`. Layouts: `wide` (≥768px) uses fixed seeded arrangements around the wall; `tall` (phones) shelf-packs unplaced pieces into a tray under the wall that re-packs and shrinks the stage as pieces are placed (the scene reports the stage height via `onStageChange`). Info is HTML, with one open piece at a time (`activeInfoId`): `SolidInfoPanel` in a column beside the board at ≥1024px, `SolidInfoSheet` (a bottom sheet portalled to `<body>`, minimized while the board is touched) below that. While the logo piece is open, the GLB's Logo Cube pops out of its slot inside the board canvas (`LogoReveal`); there is no second WebGL context. Spline is no longer a dependency.
- **SEO files**: `index.html` carries static fallback title/description/OG tags (`data-static-seo`, removed in `main.jsx`). `public/robots.txt`, `public/sitemap.xml` and `public/.htaccess` must list the routes in `src/routes.js` (a test enforces it). OG image: `public/og-default.jpg`.
- **Content rules**: no unsourced percentages or multipliers (`src/__tests__/content.test.js`); case studies use `outcomes`. Legal pages use fixed dates from `src/constants/legal.js`.
- **Contact form**: client validation in `src/utils/contactValidation.js`; `src/utils/contactApi.js` posts JSON to same-origin `/api/contact` and maps responses (`validation`, `rate_limited`, `unavailable`, `timeout`, `network`). The Ads conversion fires only on `{ok:true}`. Phone input uses `react-phone-input-2` with overrides in `src/styles/phone-input.css`.
- **Contact endpoint (PHP)**: `public/api/contact.php` is a thin front controller that loads the private server folder (`SCS_SERVER_DIR` via `SetEnv`, else `../../scs-server`) and returns 503 if that folder is under the document root. `server/` (namespace `Scs\Contact`) holds `bootstrap.php`, `ContactHandler` (method → attempt limit (every POST) → type/size/origin/JSON → honeypot/timing → validation → spam screen → send limit → send; both limits in SQLite via `RateLimiter`), `ContactValidator` (mirrors the JS rules and messages; keep them in sync), `RateLimiter`, `ContactLog` (no personal data), and `Mail/SmtpTransport` (PHPMailer) or `Mail/FileTransport` (dev). Secrets live only in the server folder's `config.php` (gitignored; template `server/config.example.php`). Design and response shapes: `docs/contact-smtp-plan.md`. `server/tools/hostinger-probe.php` is a one-off host capability check.

## Styling

Tailwind v4 via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js`. Design tokens (brand colors like `primary-dark-purple`, `accent-fuchsia*`, `accent-purple*`, status colors, and fonts `font-logo`/`font-display`/`font-sans`) are defined in the `@theme` block of `src/index.css`; use these token utilities rather than raw hex values. Icons come from `lucide-react` and `@phosphor-icons/react`.
