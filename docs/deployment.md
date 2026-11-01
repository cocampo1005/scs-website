# Deployment and rollback

The site is a static build (`dist/`) served by Hostinger (Apache/LiteSpeed,
`public_html`). Nothing deploys automatically. **Production releases need the
owner's explicit approval.**

Releases go **directly to production** (decided 30 Oct 2026: low traffic, so
no separate staging site). The safety net is the automated checks, a verified
rollback copy, and a smoke test of the live site right after upload.
`docs/staging.md` is kept for if a staging site is ever needed. The contact
endpoint's design is in `docs/contact-smtp-plan.md`.

Server layout:

```
/home/u772950047/domains/solidcodesolutionsllc.com/
├── public_html/   web root (site archive)
├── scs-server/    contact endpoint code, config.php, var/ (never web-served)
└── rollback/      previous public_html as a zip (never web-served)
```

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
4. **Package.** From a clean commit, run
   `npm run package:release -- --server-dir=/home/u772950047/domains/solidcodesolutionsllc.com/scs-server`.
   In Git Bash, prefix it with `MSYS_NO_PATHCONV=1`. Otherwise Git Bash rewrites `/home/…` to a
   Windows path, and the script refuses to package.
   It produces the following in `release/`:
   - `site-<commit>-production.zip`: the contents of `public_html`, without `.htaccess`;
   - `server-<commit>.zip`: the contents of `scs-server/`, without `config.php` or `var/`;
   - `htaccess.production`: the repository rules, to merge with the server's file;
   - `SHA256SUMS`.

## One-time server setup (contact endpoint)

1. **PHP.** In hPanel → Advanced → PHP Configuration, select PHP 8.3 and enable
   `openssl`, `mbstring`, `pdo_sqlite` and `json`.
2. **Mailbox.** The form sends through the existing `christian@solidcodesolutionsllc.com`
   mailbox (the plan has one mailbox), to itself; Reply-To is the visitor.
   That mailbox forwards to Gmail. Its password lives only in `config.php`.
3. **Probe.** Upload `server/tools/hostinger-probe.php` to `public_html`
   under an unguessable name, open it once, then delete it. It confirms the PHP
   version and extensions, access to the private folder, SMTP reachability, and
   whether the CDN hides the visitor IP (`client_ip_header`).
4. **Server folder.** Extract `server-<commit>.zip` into `scs-server/`. Copy
   `config.example.php` to `config.php` in File Manager and fill in the
   mailbox password and a fresh `ip_salt`. Then set `config.php` to 600 and
   `scs-server/` to 700. Credentials are typed only into the server copy.

## Release

1. **Rollback copy.** In File Manager, compress `public_html` into
   `rollback/public_html-<date>.zip` (outside the web root), then download
   it. Check that the zip lists `index.html`, `assets/` and `.htaccess`.
2. **`.htaccess`.** Merge `htaccess.production` with the server's current
   file. Keep any host-added blocks (for example LiteSpeed cache or PHP
   handler lines), and replace only the app's rewrite rules.
3. **Upload.** Delete the old app files from `public_html` (`index.html`,
   `assets/`, and any old images), but leave `.htaccess`, `.well-known/` and
   host files. Then extract the site archive into `public_html` and save the
   merged `.htaccess`.
4. **Purge cache.** Purge the Hostinger CDN cache (hPanel → Performance → CDN).
5. **Smoke test.** Run the checklist below, plus
   `BASE_URL=https://solidcodesolutionsllc.com npx playwright test`. The
   contact tests mock the endpoint, so this sends no email.

## Validation checklist (production)

- [ ] `curl -s https://<host>/ | grep og:image` shows `/og-default.jpg`
- [ ] `curl -sI https://<host>/robots.txt` returns `text/plain`
- [ ] `curl -sI https://<host>/sitemap.xml` returns XML
- [ ] `curl -sI https://<host>/does-not-exist` returns **404**
- [ ] `/about`, `/projects?case=street-cat-clinic#featured` and `/contact#form` load directly
- [ ] Hero: drag on desktop; drag and swipe-scroll on a real phone; "Place it for me"
- [ ] SOLID exhibit: drag, keyboard buttons, reset
- [ ] A contact form test message arrives with the phone number formatted;
      From is `christian@`, Reply-To is the sender, SPF and DKIM pass
- [ ] `GET /api/contact` returns 405; `/api/other`, `/api/contact.php.bak`,
      `/scs-server/config.php` and `/rollback/` return 404; `/.htaccess` returns 403
- [ ] A Google Ads conversion fires once after a successful send (Tag Assistant)
- [ ] LinkedIn Post Inspector and the Facebook Sharing Debugger show the new preview

## Rollback

1. In File Manager, empty `public_html` and extract
   `rollback/public_html-<date>.zip` into it. This restores the previous
   `.htaccess` too. `scs-server/` can stay: nothing reaches it without
   `api/contact.php`.
2. Purge the CDN cache, then check that `/` loads and shows the previous hero.

The previous build is also reproducible from git: check out `f154762`, restore
`.env.local`, and run `npm ci && npm run build`. This needs the Spline packages
that `f154762` still lists.
