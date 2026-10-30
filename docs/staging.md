# Hostinger staging setup

Steps marked **(you)** are done in hPanel. I can't access the hosting account.
Do them in order. Each step says what to send back to me, if anything.

The goal is a password-protected, non-indexed copy of the release candidate at
`https://staging.solidcodesolutionsllc.com`, with the same server software as
production.

## S0. Back up production and capture its server config first **(you)**

Do this before anything else, so we compare against the real server rather
than assumptions. **Never leave a backup archive inside `public_html`** (or
any folder a domain serves). Anything there can be downloaded by URL.

1. Preferred: hPanel → Websites → solidcodesolutionsllc.com → **Files →
   Backups** → generate or select the latest **Files** backup → **Download**.
   The archive is created by Hostinger outside the web root and downloaded
   straight to your computer.
2. If you can only use File Manager:
   - **Compress.** Compress `public_html` into the folder **above** it (for
     example `/home/u…/domains/solidcodesolutionsllc.com/backups/`), not
     inside it.
   - **Download.** Download the archive.
   - **Delete.** Delete the server copy unless you deliberately keep backups
     in that non-public folder.
3. Store the downloaded backup privately, for example in an encrypted folder.
   It contains the full live site.
4. File Manager → `public_html` → enable **Show hidden files** → download
   `.htaccess` as `production.htaccess`.
5. Note the full path shown at the top of File Manager.

Before sending me `production.htaccess`, check it for secrets. Replace with
`[REDACTED]` any line containing:

- `password`, `passwd` or `AuthUserFile` paths you consider private;
- `token`, `key`, `secret` or API URLs with query keys;
- `SetEnv` values that look like credentials.

Paths and normal rewrite or redirect rules are fine to share.

**Send me:** the redacted `production.htaccess` and the full path from step 5.
I'll merge any rules our `public/.htaccess` lacks (HTTPS redirects, caching,
security headers) and show you the diff before anything is uploaded.

## S1. Create the staging subdomain **(you)**

1. hPanel → Domains → **Subdomains** → create `staging`.
2. If hPanel offers a **custom folder**, choose one outside the main site's
   `public_html`, so staging files can't be reached through the production
   domain. If it insists on `public_html/staging`, that works, but production
   then needs one extra rule (part of the merged production `.htaccess` you'll
   review). The rule makes `https://solidcodesolutionsllc.com/staging/...`
   return 404, whatever the password protection:
   ```
   RewriteCond %{HTTP_HOST} ^(www\.)?solidcodesolutionsllc\.com$ [NC]
   RewriteRule ^staging(/|$) - [R=404,L]
   ```
   Until that rule is live, the password protection from S2 still blocks access.
3. Open `https://staging.solidcodesolutionsllc.com` once and confirm an SSL
   certificate is issued (hPanel → Security → SSL; activate it for the
   subdomain if needed).

**Send me:** the staging document root path.

## S2. Lock staging down **(you)**

1. hPanel → Advanced → **Password Protect Directories** → choose the staging
   document root → set a username and password. This writes auth lines into
   that folder's `.htaccess`. Our deploy merges with them; it doesn't replace
   them (S5).
2. Visiting staging should now prompt for the password. Also check
   `https://solidcodesolutionsllc.com/staging/`: if staging lives in
   `public_html/staging`, that URL must prompt too.

Staging's `.htaccess` will also send `X-Robots-Tag: noindex, nofollow`, and
staging gets a `robots.txt` that disallows everything. With the password in
front, search engines can't index it at all.

## S3. PHP for the contact endpoint **(you, after the SMTP plan is approved)**

1. hPanel → Advanced → **PHP Configuration** for the staging subdomain:
   - **Version.** Select PHP 8.2 or 8.3.
   - **Extensions.** Make sure `openssl`, `mbstring` and `pdo_sqlite` are
     enabled.
   - **Error display.** Set `display_errors` to **Off**.
2. In File Manager, create `scs-server-staging` **next to** (not inside) the
   domain's `public_html`, for example
   `/home/u123456789/domains/solidcodesolutionsllc.com/scs-server-staging`.
3. Upload `server/tools/hostinger-probe.php` from the repository to the
   staging document root, open
   `https://staging.solidcodesolutionsllc.com/hostinger-probe.php` once, copy
   the output, then **delete the file**. It reports:
   - the PHP version and extensions;
   - whether that folder is outside the document root, readable and writable;
   - which proxy/CDN IP headers reach PHP (names only);
   - whether `smtp.hostinger.com` is reachable on 465 and 587, with the
     certificate verified.

   It sends no email and never prints secrets.

   **Send me:** the probe output and the absolute path of
   `scs-server-staging`.
4. **Credentials** (after S4 step 1 has put the server files in place):
   - Upload `server-<commit>.zip` into `scs-server-staging` and extract it.
   - Copy `config.example.php` to `config.php` in File Manager and fill in:
     - the SMTP mailbox password;
     - a new `ip_salt` (64 random hex characters; I can generate one for you to
       paste, or run `php -r "echo bin2hex(random_bytes(32));"`);
     - for staging, `allowed_origins` =
       `['https://staging.solidcodesolutionsllc.com']` and `subject_prefix` =
       `'[staging] '`;
     - `client_ip_header`, only if the probe shows a proxy in front.
   - Set permissions to `600` on `config.php`. `var/` is created on the
     first request with `700`.
   - The password never goes into git, chat, the build, or a `VITE_` variable.

Recommended: create a dedicated mailbox for the website, such as
`website@solidcodesolutionsllc.com`, in hPanel → Emails. It sends
form messages to your main inbox, so your personal mailbox password never sits
on the web server. Ask me if you want the staging and production mailboxes to
differ.

## S4. Upload the release candidate **(you, with files from me)**

I build these from a clean, tagged commit with
`npm run package:release -- --target=staging --server-dir=<path from S3>`.
The files land in `release/` with a `SHA256SUMS` file:

| File | Goes to | Contents |
|---|---|---|
| `site-<commit>-staging.zip` | staging document root | The built site (HTML, JS/CSS, models, fonts, `sitemap.xml`, `api/contact.php`) with a disallow-all `robots.txt`. **No `.htaccess`**, so extracting it never overwrites the password lines. |
| `server-<commit>.zip` | `scs-server-staging/` | `bootstrap.php`, `src/`, `vendor/` (PHPMailer only), `config.example.php`. Never `config.php`, `var/` or tests. |
| `htaccess.staging` | pasted into the staging `.htaccess` | The `noindex` header, `SetEnv SCS_SERVER_DIR …`, the `/api/` rules, the app routes and the real-404 rule |

Steps:

1. Upload `site-<commit>.zip` to the staging document root and **extract**
   it. Do not delete the existing `.htaccess` (it holds the password lines).
2. Open the existing `.htaccess` in the File Manager editor. Paste the
   contents of `htaccess.staging` **below** the password-protection lines and
   save. That file contains:
   - the app routes and real-404 rules;
   - the `/api/` rule;
   - `SetEnv SCS_SERVER_DIR …`;
   - the `noindex` header.
3. If staging lives in `public_html/staging`, staging's `.htaccess` must not
   use `RewriteBase /`. The file I hand you will already match the path you
   send me in S1.

The build needs no `.env.local` values. The contact form no longer uses
EmailJS.

## S5. Validation checklist (run on staging)

Mark each item pass or fail. I'll run the automated parts from my side if you
share the staging password temporarily, or you can run them.

**Server and routing**
- [ ] `/`, `/about`, `/projects`, `/contact`, `/privacy`, `/terms` load directly (fresh tab, no in-app navigation)
- [ ] `/projects?case=street-cat-clinic#featured` opens that case study and scrolls to it
- [ ] `/does-not-exist` shows the Not Found page **and** returns status 404 (browser dev tools → Network)
- [ ] `/robots.txt` (staging: disallow all) and `/sitemap.xml` are served as files, not the app
- [ ] `/models/scs-hero-puzzle.glb`, `/og-default.jpg` and one `/assets/*.js` file load with 200
- [ ] Response headers include `X-Robots-Tag: noindex, nofollow` (staging only)
- [ ] `https://solidcodesolutionsllc.com/staging/` (if that folder exists) asks for the password

**3D experiences**
- [ ] Desktop: hero cube drags into place; glow, spin and the "Every piece has a purpose…" line appear
- [ ] Phone (real device): swiping beside the cube scrolls; dragging the cube doesn't; "Place it for me" works
- [ ] About: the SOLID wall can be completed by drag and by the piece buttons; info panel/sheet; reset
- [ ] With reduced motion on (OS setting): no spin or float; both puzzles still complete

**Contact form**
- [ ] A valid message arrives in the inbox; Reply-To is the sender; From is the company mailbox
- [ ] An international phone number (+44, +57) is accepted
- [ ] Field errors show for empty or invalid input; nothing is sent
- [ ] (SMTP) The 6th message within an hour shows "Too many attempts"; the log in `scs-server-staging/var/` records it without message content
- [ ] (SMTP) Received headers show SPF pass and DKIM pass
- [ ] (if the Ads tag is kept) Tag Assistant shows one conversion after a successful send, none after a failed one

**SEO** (the HTML source, "view-source:")
- [ ] The title, description and `og:image` are present in the HTML source (with prerendering, each page has its own)
- [ ] Canonical URLs point to the production domain, never to staging

## S6. Release and rollback

These steps run only after you approve production.

1. **Back up.** Take a fresh production backup outside the web root (S0, steps 1–3).
2. **Server folder.** Create `scs-server/` for production, the same way as S3
   step 4, with its own `config.php`.
3. **Upload.** Upload `site-<commit>.zip` to production `public_html` and
   extract it. Replace `.htaccess` with the reviewed production version.
   Remove old `assets/index-*.js` and `*.css` files that are not in the new
   build.
4. **CDN cache.** Purge the CDN cache (hPanel → Performance → CDN).
5. **Re-check.** Run the S5 checklist on production, skipping the noindex and
   password checks. Send one real contact message.

**Rollback (about 5 minutes):**
1. Upload the backup archive to the folder above `public_html` (not inside
   it), then delete the contents of `public_html`.
2. Extract the backup into `public_html`, then delete the uploaded archive.
3. Purge the CDN cache.

`scs-server/` can stay, because nothing references it without the new
`api/contact.php`. The EmailJS account stays active for two weeks after a
stable SMTP release, so the old build keeps working if restored.
