# Proof of concept: build-time HTML with React Router framework mode

Branch: `spike/prerender` (not for merge). Built on `scs-2.0`.

## Result

`react-router build` with `ssr: false` and `prerender: PAGE_PATHS` writes a
real HTML file for every page (`build/client/<path>/index.html`). Each file
contains that page's own `<title>`, description, canonical, Open Graph and
Twitter tags, JSON-LD, H1 and full copy. The existing `<SEO>` component works
unchanged, because React 19 hoists its tags into `<head>` during prerendering.
Output is static files only, so Hostinger hosting needs no change.

Verified:

- All six routes prerendered, each with its own title and OG tags (crawlers
  and link previews no longer depend on JavaScript).
- The e2e suite against the static output passes the hero, fallbacks, SOLID,
  lightbox and outcomes tests (17 passed). It fails only:
  - the Not Found test, because the test server has no 404 fallback; Hostinger
    would use `ErrorDocument 404 /__spa-fallback.html`;
  - the interim `data-static-seo` test, which no longer applies.
- No hydration errors once browser-only values are read after mount.
- Both R3F canvases still load lazily on the client. Three.js is never
  executed during prerendering.

## What the migration took (complexity)

| Change | Size |
|---|---|
| `react-router.config.js`, `src/app/root.jsx` (document layout, replaces `index.html` + `main.jsx`), `src/app/routes.js` | 3 small new files |
| `vite.config.js`: `@vitejs/plugin-react` → `reactRouter()` | 1 line |
| New dependencies: `@react-router/dev` (dev), `@react-router/node` + `isbot` (build-time runtime) | 3 packages, same React Router version |
| `SolidInfoSheet`: portal only after mount (`document.body` doesn't exist while prerendering) | 4 lines |
| `ApproachScroller`, `useMediaQuery`: no `window` during render | 2 lines |
| `Contact`: CommonJS interop for `react-phone-input-2` | 2 lines |
| Hero and SOLID: WebGL check moved after mount (was a hydration mismatch); hero shows the loader until checked | ~10 lines |

Pages, data, styles and both 3D scenes are otherwise untouched.

## Trade-offs

- **For:** per-page metadata and content in the served HTML; unique case-study
  URLs become indexable as soon as `/work/:slug` routes exist; still static
  hosting; React Router's official path with typed route modules for the
  TypeScript migration.
- **Cost:** one-time restructure (`index.html` → `root.jsx`), a slightly larger
  build pipeline, and a rule to follow from now on: no browser APIs during
  render (they move into effects). Tests catch violations, because the build
  fails when a page cannot prerender.
- **Media-query layouts render the mobile layout first** and switch after
  mount (SOLID board, approach scroller). This is invisible for below-the-fold
  sections; the hero layout should rely on CSS breakpoints only.
- **Alternative considered:** a custom `renderToString` script. It is less to
  adopt, but we would maintain it ourselves and get no route-module structure.
  Not recommended.

## Recommendation

Adopt framework-mode prerendering in Phase 3 as the first foundation step,
before the TypeScript migration and the `/work` routes. The `index.html`
static-tag fallback from Phase 1 would then be removed.
