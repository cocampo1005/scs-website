# Next phase: increments and gates

Every increment:
- is one branch off `scs-2.0`, merged by PR into `scs-2.0` (never `main`);
- keeps `npm run check` green;
- ends with a short review.

**Gates** need your approval before work starts.

| # | Increment | Depends on | Gate | Done when |
|---|---|---|---|---|
| 0 | **Staging RC1.** Current site plus Phase 1 on Hostinger staging | S0–S2 from `docs/staging.md`; contact path decided | — | S5 checklist passes on staging |
| 1 | **SMTP contact endpoint.** *(built on `feat/smtp-contact`; awaiting the S3 probe and staging verification)* `server/` (PHP, PHPMailer), `public/api/contact.php`, `.htaccess` `/api/` rule, `contactApi.js`, PHPUnit and Vitest tests, privacy update, EmailJS removed | Plan approval; S3 probe output | **SMTP plan** | Staging message delivered (SPF/DKIM pass); rate limit and injection tests pass; no `VITE_EMAILJS` left |
| 2 | **Prerendering.** Re-apply the spike's source changes cleanly (no build output): `react-router.config`, `src/app/root` and `routes`, mount-time browser checks, phone-input interop. `.htaccess` 404 → `__spa-fallback.html`. New tests: HTML per route (title, OG, H1), no hydration errors, 3D smoke | 0 | — (approved) | Every route's HTML is verified in CI; e2e passes on the static output; staging RC2 |
| 3 | **TypeScript foundation.** Strict `tsconfig` with `allowJs`, `vite-env.d.ts`, typescript-eslint; typed content model (`Project` union on `kind`, `Service` tiers, `outcomes`, screenshot `alt` required, i18n-ready copy modules) | 2 | — | `npm run typecheck` in CI; content tests run on types |
| 4 | **Design tokens and primitives.** `@theme` semantic tokens; `Button`/`LinkButton`, `Section`, `SectionHeading`, `Bento`/`Tile`, `Tag`, `FormField`, `Accordion`, `Dialog`; noindex `/styleguide` route | 3 + **design approval** | **Design** | Styleguide matches the canvas; axe passes; component tests |
| 5 | **Shell.** `SiteHeader`, `MobileNav`, `SiteFooter`, `GridBackdrop` | 4 | — | Visual check at 390/820/1440; keyboard nav tests |
| 6 | **Homepage and hero.** Split hero with a free-floating stage; typed hero reducer and `solved` event; `CircuitLayer` (SVG/CSS); story beat; bento sections | 5 | — | Hero e2e (solve, place, fallbacks, reduced motion); frame-time check on a phone; no new WebGL context |
| 7 | **Work.** `/work` index and `/work/:slug` case studies; 301s from `/projects` and `?case=`; JSON-LD per case | 5 | **Content** (case-study copy, permissions) | Redirect tests; prerendered case pages in the sitemap |
| 8 | **About and Contact.** SOLID exhibit in the bento frame (scene logic untouched); contact page redesign | 5, 1 | — | SOLID regression suite; contact e2e |
| 9 | **TypeScript completion.** Scenes (typed state machines, `getNode`), pages; remove `allowJs`; delete dead code and assets | 6–8 | — | Zero JS files in `src`; strict passes |
| 10 | **Validation and RC.** GLB compression, Lighthouse and axe budgets, cross-device pass, privacy/claims review, staging RC3 | 9 | **Production release** | Budgets met against the Phase 0 baseline; your go-live approval |

Parallel-safe: 1 can run alongside 2–3. Design-dependent work (4–8) waits for
the design gate.
