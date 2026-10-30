# Deployment and rollback

The site is a static build (`dist/`) served by Hostinger (Apache/LiteSpeed,
`public_html`). Nothing deploys automatically. **Production releases need the
owner's explicit approval.**

The step-by-step Hostinger setup, the staging checklist and the release and
rollback runbook are in `docs/staging.md`. The planned contact-form change is
in `docs/contact-smtp-plan.md`.

## What production runs today

Verified on 30 Oct 2026:

- Production serves `index-DUgSiEdw.css` and `index-DOQP6p4d.js` (HTML last
  modified 20 Feb 2026).
- Building commit `f154762` (the head of `main`) reproduces the CSS file byte
  for byte (same content hash). The JS differs only by the EmailJS IDs inlined
  from `.env.local`.
- Production therefore equals `main` @ `f154762`, which still loads both 3D
  scenes from Spline (`prod.spline.design`).
- The server's existing `.htaccess` cannot be read over HTTP (403). Download it
  from hPanel before the first release.

## What a release from `scs-2.0` changes

Range `f154762..scs-2.0` changes 60 files in `src/`, `public/` and
`index.html`. Visitor-facing changes:

| Area | Change |
|---|---|
| Homepage hero | Spline scene replaced by the native React Three Fiber puzzle (same model and story). The software-first headline, copy and CTAs are visible before the puzzle is solved. A "Place it for me" control is added. Phones can scroll past the hero. A static poster appears without WebGL or if the model fails. |
| About page | Spline SOLID wall replaced by the native R3F exhibit, with keyboard buttons, an info panel or bottom sheet, and a text version. "At a Glance" statistics are replaced with qualitative cards. |
| Projects | Percentages and multipliers are replaced with factual outcomes. Slideshows are pausable. Screenshots open from the keyboard. |
| Contact | International phone numbers are accepted. The FAQ is now an accessible accordion. The "Avg response ~24 hrs" claim is removed. |
| Privacy / Terms | Accurate privacy policy (EmailJS, Google Ads, Google Fonts, hosting logs). Fixed revision dates. |
| SEO | Static fallback title, description and OG tags in `index.html`. New OG image. Real `robots.txt` and `sitemap.xml`. Not Found page. |
| Server | New `.htaccess`: app routes are served by the app, unknown paths return a real 404, and real files (robots, sitemap, models) are served as-is. |
| Performance | Routes are lazy-loaded (main JS 561 KB → 280 KB). Spline runtime removed. Six unused Google Font families dropped. |

Unchanged: the URLs (`/`, `/about`, `/projects`, `/contact`, `/privacy`,
`/terms`), the EmailJS template parameters, and the Google Ads tag and
conversion event.

## Build a release candidate

1. **Environment.** Copy `.env.example` to `.env.local` and fill in the three
   EmailJS values from the EmailJS dashboard.
2. **Checks.** Run `npm ci`, then `npm run check`, which runs lint, unit tests,
   the build and the e2e tests.
3. **Release build.** Run `npm run build:release`. It refuses to build without
   the EmailJS values.
4. **Smoke test.** Run `npm run preview` and check, at desktop and phone width,
   that:
   - the hero is solvable and "Place it for me" works;
   - `/about` loads and the SOLID exhibit can be completed;
   - a test message sent from `/contact` arrives.
5. **Archive.** Zip `dist/` as `scs-<commit>-<date>.zip`. This archive is
   exactly what gets uploaded.

## Staging (recommended before the first release)

1. In hPanel, create `staging.solidcodesolutionsllc.com` and protect it with
   **Password Protect Directories**.
2. Upload the release-candidate `dist/` contents to its document root.
3. Add `Header set X-Robots-Tag "noindex, nofollow"` to the staging
   `.htaccess` only.
4. Run the validation checklist below against staging. The Open Graph check
   needs the real domain, so do it right after release.

## Release

1. **Back up first.** In hPanel → File Manager, compress the current
   `public_html` to `public_html-backup-<date>.zip`, and download a copy. Save
   the existing `.htaccess` separately.
2. **Compare `.htaccess`.** Compare the saved server `.htaccess` with
   `public/.htaccess`. If the server copy has rules ours lacks (an HTTPS
   redirect or caching, for example), add them to `public/.htaccess`, rebuild
   and re-zip.
3. **Upload.** Upload the zip to `public_html`, extract it, and remove the old
   files that are no longer in `dist/assets/` (the old `index-*.js` and CSS).
   Leave `.htaccess` and `robots.txt` from the new build in place.
4. **Purge cache.** Purge the Hostinger CDN cache (hPanel → Performance → CDN).

## Validation checklist (staging and production)

- [ ] `curl -s https://<host>/ | grep og:image` shows `/og-default.jpg`
- [ ] `curl -sI https://<host>/robots.txt` returns `text/plain`
- [ ] `curl -sI https://<host>/sitemap.xml` returns XML
- [ ] `curl -sI https://<host>/does-not-exist` returns **404**
- [ ] `/about`, `/projects?case=street-cat-clinic#featured` and `/contact#form` load directly
- [ ] Hero: drag on desktop; drag and swipe-scroll on a real phone; "Place it for me"
- [ ] SOLID exhibit: drag, keyboard buttons, reset
- [ ] A contact form test message arrives with the phone number formatted
- [ ] A Google Ads conversion fires once after a successful send (Tag Assistant)
- [ ] LinkedIn Post Inspector and the Facebook Sharing Debugger show the new preview

## Rollback

1. In File Manager, delete the contents of `public_html` except the backup zip.
2. Extract `public_html-backup-<date>.zip` in place. This restores the previous
   build and its `.htaccess`.
3. Purge the CDN cache, then check that `/` loads and shows the previous hero.

The previous build is also reproducible from git: check out `f154762`, restore
`.env.local`, and run `npm ci && npm run build`. This needs the Spline packages
that `f154762` still lists.
