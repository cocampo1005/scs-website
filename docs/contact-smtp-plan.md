# Contact form: replacing EmailJS with PHP + authenticated SMTP

Status: **approved; implemented on branch `feat/smtp-contact`** (roadmap
increment 1). Not yet verified on staging. No credentials are requested or
stored in the repository.

### Implementation notes (where the code differs from the text below)

- **Timing check.** The client sends `elapsedMs` (time since the form
  mounted) instead of `startedAt`, so visitor clock skew can't trip it. A
  missing value is allowed; only a number under `min_fill_ms` (3 s) is a trap.
- **Two independent limits** in one SQLite file, each checked and recorded in
  one `BEGIN IMMEDIATE` transaction:
  - **Attempts.** This limit counts every POST, whatever its outcome:
    - invalid fields, bad JSON or the wrong content type;
    - an oversized body or a wrong origin;
    - honeypot or timing traps, and SMTP failures.

    The defaults are 20 per client per 10 minutes and 300 per hour
    site-wide. It is checked right after the method, before any parsing.
    Repeated bad requests therefore get 429 quickly.
  - **Sends.** This limit counts messages handed to SMTP, failures included,
    at 5 per client per hour and 30 per day site-wide. It is checked after
    validation, so a typo never uses up a real visitor's sends.

  Over-limit requests are not stored, so rows stay bounded by the limits under
  a flood. The log rotates at 1 MB and keeps one old file, so it stays at
  about 2 MB. Non-POST requests get 405 without touching the database.
  Volumetric floods are beyond what a PHP endpoint can absorb; those are the
  host's or CDN's job.
- **Client IP.** `REMOTE_ADDR` by default. If the probe shows a CDN or proxy in
  front of PHP, `client_ip_header` in `config.php` names the header, and only
  its right-most entry (added by the proxy, not the visitor) is used.
- **Prerendering** isn't in yet, so the endpoint ships in `dist/api/` (not
  `build/client/api/`). Increment 2 must keep `public/api/contact.php`.
- **Body format.** `{name, email, message, phone: {digits, dialCode, display} | null, website, elapsedMs}`.
- **Local development** uses `npm run dev:api` (PHP's built-in server) with
  a `file` transport that writes to `server/var/outbox/`; no mock.

## Recommendation

Use a small PHP endpoint with PHPMailer, deployed beside the static build on
the same Hostinger account. It sends through the company's existing Hostinger
Email mailbox over authenticated SMTP with TLS.

```
React form ──POST JSON──▶ /api/contact (PHP 8.x, same origin)
                              │ validate · honeypot · rate limit · origin check
                              ▼
                       PHPMailer ──SMTP 465 (TLS)──▶ smtp.hostinger.com ──▶ christian@…
```

### Why it fits

- **Mail is on Hostinger Email.** `solidcodesolutionsllc.com` MX records point
  to `mx1/mx2.hostinger.com`. SPF is
  `v=spf1 include:_spf.mail.hostinger.com ~all`. Sending through
  `smtp.hostinger.com` as a company mailbox therefore passes SPF and stays
  within one provider.
- **Hostinger already runs PHP.** Shared and cloud plans run PHP 8.x, with the
  version selectable in hPanel. No Node server, no new paid service.
- **Same origin as the site.** The form posts to `/api/contact`, so there is
  no CORS and no third-party script in the browser. EmailJS's SDK and its
  public keys leave the bundle.

### Limitations to confirm (Hostinger account specifics)

| Item | Why it matters | How to confirm |
|---|---|---|
| PHP version ≥ 8.1 with `openssl`, `mbstring`, `pdo_sqlite` (or writable files) | PHPMailer and rate limiting | hPanel → Advanced → PHP Configuration |
| Directory above `public_html` is readable by PHP (no restrictive `open_basedir`) | Credentials and code live outside the web root | Probe file in step S3 of the staging guide |
| SSH access | Running a CLI SMTP check (not strictly required) | hPanel → Advanced → SSH Access |
| Hostinger Email sending limits for the mailbox | A burst of spam must not exhaust the quota | hPanel → Emails → plan details |
| DKIM enabled for the domain | Deliverability (`p=none` DMARC is in place) | hPanel → Emails → DNS/Email authentication |

None of these is expected to block the plan. If outbound SMTP were restricted,
PHP's `mail()` through Hostinger's local relay is a fallback, but authenticated
SMTP is preferred.

## Server layout (credentials outside the web root)

```
domains/<site>/
├── public_html/                 ← React build (dist/)
│   ├── api/contact.php          ← 15-line front controller, no secrets
│   └── .htaccess
└── scs-server/                  ← NOT web-accessible
    ├── config.php               ← SMTP host/user/password, recipient, allowed origins (created on server only)
    ├── src/ContactHandler.php   ← validation, rate limit, send
    ├── vendor/                  ← PHPMailer (composer install --no-dev)
    └── var/                     ← rate-limit store and log (writable, 0700)
```

`api/contact.php` finds the server folder from `SCS_SERVER_DIR`, set with
`SetEnv` in the environment's `.htaccess` (an absolute path, not a secret).
It falls back to `dirname(__DIR__, 2) . '/scs-server'`, and refuses to run
(503) if the resolved folder is inside the document root. This matters because
a Hostinger subdomain's folder may sit inside the main site's `public_html`.

Staging and production each get their own server folder outside every
document root, for example `domains/solidcodesolutionsllc.com/scs-server` and
`domains/solidcodesolutionsllc.com/scs-server-staging`. That gives separate
credentials, logs and rate limits.

In the repository, `server/` holds `src/`, `bootstrap.php`, `composer.json`,
`composer.lock` and `config.example.php` (placeholders only). `config.php` is
gitignored. `public/api/contact.php` ships with the Vite build.

## Endpoint behaviour

**Request.** `POST /api/contact`, `Content-Type: application/json`, body
`{name, email, message, phone?, website (honeypot), startedAt}`.

**Checks, in order.** Each failure returns a structured JSON error:

1. **Method and body.** The method must be POST; anything else gets 405. The
   body must be JSON and at most 16 KB; anything else gets 415 or 413.
2. **Origin.** `Origin` (or `Referer`) must be the production or staging
   origin; otherwise 403.
3. **Honeypot.** A filled `website` field returns 200 `{ok:true}` with no email
   sent, so bots learn nothing. A `startedAt` less than 3 s ago is treated the
   same way.
4. **Rate limit (persistent).** Limits are 5 messages per IP per hour and 30
   per day site-wide, stored in SQLite (or a `flock`ed JSON file) under
   `scs-server/var/`. IPs are stored only as salted SHA-256 hashes, and entries
   older than 24 h are pruned. Over the limit returns 429 with `Retry-After`.
5. **Validation.** These are the same rules as
   `src/utils/contactValidation.js`, re-implemented server-side:
   - **Name.** 2–100 characters, with no CR/LF or control characters.
   - **Email.** Validated with `PHPMailer::validateAddress`, at most 254
     characters, with no CR/LF.
   - **Message.** 10–5000 characters.
   - **Phone.** Optional; 8–15 digits.

   A failure returns 422 `{ok:false, error:"validation", fields:{…}}`.
6. **Content heuristics.** A message with more than 3 URLs, or one that
   matches a short blocklist, gets 422 and is logged.

**Send.** Uses PHPMailer with:
- `SMTPSecure = 'ssl'`, port 465 (or STARTTLS on 587);
- `SMTPAuth = true` and `Timeout = 10`;
- peer verification on;
- `From` set to the fixed company mailbox and `Reply-To` set to the visitor's
  validated address;
- a fixed subject plus a sanitized name;
- a plain-text body, with HTML escaped if an HTML part is added.

PHPMailer encodes headers, and CR/LF are rejected before they reach it, which
closes header injection.

**Responses.**

| Status | Body | Meaning |
|---|---|---|
| 200 | `{ok:true}` | Sent |
| 422 | `{ok:false, error:"validation", fields:{…}}` | Invalid fields |
| 429 | `{ok:false, error:"rate_limited", retryAfter}` | Rate limit hit |
| 503 | `{ok:false, error:"unavailable"}` | SMTP failure, after logging |

No exception text or stack traces are ever returned, and `display_errors` is
off.

**Logging.** Each request appends one line to `scs-server/var/contact.log`,
recording the timestamp, outcome code, hashed IP and PHPMailer error class. It
never records message bodies, emails or passwords. The log rotates at 1 MB.

## Front-end changes (small)

- `src/utils/contactApi.js`: `sendContactMessage(form)` makes a `fetch` call
  with a 15 s timeout and maps the response codes to the user messages already
  in `Contact.jsx`. The form UI, validation and copy stay unchanged.
- `Contact.jsx` calls `sendContactMessage` instead of `emailjs.send`. The Google
  Ads conversion still fires only on `{ok:true}`, unless the tag is removed (see
  `docs/tracking-assessment.md`).
- `@emailjs/browser` and the three `VITE_EMAILJS_*` variables are removed.
  `build:release` stops requiring them.
- `.htaccess` gains a rule before the app-route rules:
  - `RewriteRule ^api/contact/?$ api/contact.php [L]`.
  - Anything else under `/api/` returns a 404 instead of the React app.
  - `server/`-style paths are never under `public_html`, so they can't be
    served.

## Prerendering compatibility

The endpoint is a real file under `public/api/`, so it is copied to
`build/client/api/` by React Router's build, like `robots.txt`. The `.htaccess`
"real file" rule plus the explicit `/api/` rule keep it out of the SPA
fallback. No React code runs on the server.

## Testing

- **PHP unit tests.** PHPUnit as a dev dependency in `server/composer.json`.
  It covers:
  - validation, including CR/LF injection attempts;
  - the honeypot and the timing check;
  - the rate limiter (time is injected);
  - response shapes.

  SMTP is replaced by a fake transport, so these tests never send email.
- **Front end.** Vitest covers `sendContactMessage` against mocked `fetch`
  responses (200, 422, 429, 503, timeout). The existing Contact tests keep
  passing.
- **E2E.** Playwright mocks `/api/contact` with `page.route` for success and
  each error state, and confirms the Ads conversion fires only on success (via
  a stubbed `gtag`).
- **Staging.**
  - A real message reaches the inbox, and Reply-To goes to the sender.
  - The rate limit triggers on the sixth message in an hour.
  - A request from another origin is rejected.
  - Headers are checked in the received email: SPF/DKIM pass, and the From
    address is the company mailbox.
- **Local development.** A Vite proxy sends `/api` to `php -S` when PHP is
  installed; otherwise the mock is used.

## Deployment and release workflow

1. **Server package.** `npm run package:release` builds the site and runs
   `composer install --no-dev` in `server/`. It then produces two archives:
   `site-<commit>.zip` (the web root) and `server-<commit>.zip` (`scs-server/`
   without `config.php` and `var/`).
2. **Pre-flight.** `scripts/check-release.mjs` checks before archiving:
   - `public/api/contact.php` exists;
   - `server/vendor` is installed from `composer.lock`;
   - `.htaccess` has the `/api/` rule;
   - no `config.php` is in the archive;
   - no `VITE_EMAILJS` usage remains.
3. **One-time server setup.** Upload `server-<commit>.zip`, then create
   `config.php` from `config.example.php` in File Manager (the credentials
   never leave the server). Next, `chmod 600 config.php` and
   `chmod 700 var/`.

## Rollback

- **Before cut-over.** The EmailJS build stays deployable. The previous
  `public_html` backup zip restores it as-is, and the EmailJS account and its
  keys stay active until two weeks after a stable release.
- **After cut-over.** If SMTP sending fails in production, restore the previous
  site zip. `scs-server/` can stay in place, because nothing references it
  without `api/contact.php`.
- The privacy policy changes in the same release as the cut-over, and reverts
  with it.

## Privacy policy change (with the release)

"Information you send us" will no longer name EmailJS. Instead it will say the
form is processed on our own server and delivered through our email provider
(Hostinger), and that we keep a short technical log without message content.
Limits will be described in plain terms.

## Effort

About 1.5–2 days, including tests and staging verification. It is independent
of the redesign and can ship in the first staging release candidate, or just
after it.
