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
| Contact | The form posts to our own PHP endpoint (`/api/contact`), which sends through the Hostinger mailbox over authenticated SMTP; EmailJS is removed. Server-side validation, spam traps and rate limits. International phone numbers are accepted. The FAQ is now an accessible accordion. The "Avg response ~24 hrs" claim is removed. |
| Privacy / Terms | Accurate privacy policy (own server + Hostinger email, rate-limit records, Google Ads, Google Fonts, hosting logs). Fixed revision dates. |
| SEO | Static fallback title, description and OG tags in `index.html`. New OG image. Real `robots.txt` and `sitemap.xml`. Not Found page. |
| Server | New private server folder (`scs-server/`, outside `public_html`) with `config.php`. New `.htaccess`: `/api/contact` reaches the PHP endpoint, other `/api` paths 404, app routes are served by the app, unknown paths return a real 404, and real files (robots, sitemap, models) are served as-is. |
| Performance | Routes are lazy-loaded (main JS 561 KB → 280 KB). Spline runtime removed. Six unused Google Font families dropped. |

Unchanged: the URLs (`/`, `/about`, `/projects`, `/contact`, `/privacy`,
`/terms`) and the Google Ads tag and
conversion event.

## Build a release candidate

Needs Node, PHP 8.2+ and Composer locally. No `.env.local` values are needed.

1. **Install.** Run `npm ci`, then `composer install` in `server/`.
2. **Checks.** Run `npm run check`, which runs lint, unit tests, PHPUnit, the
   build and the e2e tests.
3. **Local smoke test.** Run `npm run dev:api` and `npm run dev` side by side,
   and check, at desktop and phone width, that:
   - the hero is solvable and "Place it for me" works;
   - `/about` loads and the SOLID exhibit can be completed;
   - a test message sent from `/contact` lands in `server/var/outbox/`.
     Locally nothing is emailed.
4. **Package.** From a clean, tagged commit, run
   `npm run package:release -- --target=staging --server-dir=<absolute path>`
   (or `--target=production`). It produces the following in `release/`:
   - `site-<commit>-<target>.zip`;
   - `server-<commit>.zip`;
   - `htaccess.<target>`;
   - `SHA256SUMS`.

   These are exactly what gets uploaded (`docs/staging.md` S4).

## Staging (recommended before the first release)

Follow `docs/staging.md` S1–S5: the subdomain, password protection, PHP and
the private `scs-server-staging` folder, then the upload of the packaged
archives and the validation checklist. The Open Graph check needs the real
domain, so do it right after release.

## Release

Follow `docs/staging.md` S0 (backup outside the web root, `.htaccess`
capture) and S6 (release). In short:

1. **Back up.** Back up via hPanel → Files → Backups and download it. Never
   leave an archive inside `public_html`.
2. **Compare `.htaccess`.** Use the reviewed, merged configuration.
3. **Upload.** Upload the site archive, extract it, and remove old hashed
   assets.
4. **Purge cache.** Purge the Hostinger CDN cache.

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

1. Upload the backup archive to the folder **above** `public_html`. Empty
   `public_html`, extract the backup into it, then delete the uploaded
   archive.
2. Purge the CDN cache, then check that `/` loads and shows the previous hero.

The previous build is also reproducible from git: check out `f154762`, restore
`.env.local`, and run `npm ci && npm run build`. This needs the Spline packages
that `f154762` still lists.
