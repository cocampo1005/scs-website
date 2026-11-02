# Cookie consent and privacy: how it works, and what still needs a lawyer

Implemented 2 Nov 2026 on `feat/redesign-2.0`. Code lives in `src/consent/`.
This note records the decisions, the sources they rest on, and the points
that warrant professional legal review. It is an engineering record, not
legal advice, and the site does not claim to be fully compliant with any
regime.

## What the site actually uses (audit)

| Technology | Kind | Purpose | Category |
|---|---|---|---|
| `scs:consent` | localStorage, first party | The visitor's cookie choice: what, when, which notice version, how, and whether GPC was on | Strictly necessary |
| `scs:hero-solved` | sessionStorage, first party | Keeps the homepage puzzle solved for the tab session | Strictly necessary |
| Google Ads tag (`gtag.js`, `AW-17675252735`) | Third-party script; sets cookies such as `_gcl_au` on our domain and may set cookies on Google domains | Conversion measurement for the contact form | Advertising measurement (optional) |
| Hostinger access logs, contact-form rate limiting (hashed IP, 24 h) | Server side | Hosting and abuse prevention | Not consent-based; disclosed in the policy |

Nothing else: no analytics, no embedded third-party widgets, fonts are
self-hosted, the contact endpoint is ours. So there is exactly one optional
category, and the interface says so instead of inventing more.

## Consent model

- **Default denied.** Nothing optional runs until a choice is made. With no
  choice, or a rejection, no request of any kind goes to Google: no script,
  no consent ping, no cookie (verified by `e2e/consent.spec.js`).
- **Consent Mode v2, basic.** When the visitor accepts, `src/consent/googleTag.ts`
  queues `consent default` (all four signals denied, `wait_for_update: 500`),
  then `consent update` granting only `ad_storage` and `ad_user_data`, then
  `js`/`config`, and only then injects the tag. `ad_personalization` and
  `analytics_storage` stay denied: the site does no remarketing and has no
  analytics. Google documents basic mode as "prevent Google tags from loading
  until a user interacts with a consent banner" and the required order as
  default → tag → update (developers.google.com/tag-platform/security/guides/consent;
  developers.google.com/tag-platform/security/concepts/consent-mode).
- **Conversions.** `recordConversion()` fires the Ads conversion only when the
  tag is loaded and consent is granted, and only after the server accepted the
  message. Failed sends, rejected consent and withdrawn consent record nothing.
- **Withdrawal.** "Cookie settings" in every footer (and in the policy) opens
  the dialog. Rejecting there sends `consent update` (all denied) to the loaded
  tag, deletes the `_gcl_*`/`_gac_*` cookies the site can reach, and stops
  conversions. The tag itself cannot be unloaded from a page without a reload;
  Google's own documentation treats the `update` as the withdrawal signal.
- **Equal choices.** "Accept all" and "Reject all" are the same size and style,
  one click each; "Customize" opens the detail. No pre-ticked optional toggle.
- **Memory.** A choice is kept for 182 days (the CNIL's recommended maximum
  of six months), then the notice returns. Bumping `CONSENT_VERSION` re-asks
  everyone, which is what a material change to the notice requires.
- **Records.** The stored record (`version`, `decidedAt`, `expiresAt`,
  `method`, `gpc`, the choices) is the consent evidence Google's EU user
  consent policy asks advertisers to keep (google.com/about/company/user-consent-policy).
  It stays in the visitor's browser; nothing is sent to us. That is
  proportionate for a site that collects no accounts and no personal data at
  the moment of consent; see "Open points" for the trade-off.
- **Global Privacy Control.** `navigator.globalPrivacyControl === true` is
  treated as an opt-out of sale/sharing/targeted advertising (w3c.github.io/gpc):
  advertising measurement stays off unless the visitor turns it on in the
  settings, the banner and dialog say so, the record notes `gpc: true`, and
  `/.well-known/gpc.json` publishes the commitment.

## Why a custom implementation rather than a certified CMP

Google requires a CMP certified under the IAB TCF only for publishers
serving Google ads (AdSense, Ad Manager, AdMob) to EEA/UK users. This site is
an advertiser with a single conversion tag and no ad inventory, so its
obligation is the EU user consent policy: valid consent for cookies where
required, records, and clear withdrawal, all of which a custom banner may
satisfy ("You can use a custom banner or a CMP … custom solutions must send
the consent state to Google themselves"). A CMP subscription would add cost,
a third-party script and its own cookies for no additional coverage.

## Verification

- Unit: `src/consent/consent.test.ts` (storage, expiry, version, GPC,
  subscribers), `src/consent/googleTag.test.ts` (nothing before consent; exact
  dataLayer order on accept; no double load; conversion guard; withdrawal
  update and cookie clearing), `src/consent/Consent.test.tsx` (banner, dialog,
  focus, switches, GPC note), contact and footer tests.
- Browser: `e2e/consent.spec.js` intercepts every request to Google hosts and
  checks no request before a choice on four pages, one tag load on accept with
  the measurement-only signals, nothing after rejection across navigation and
  reload, the form working without consent and recording no conversion, one
  conversion per successful send with consent and none for a failure or after
  withdrawal, footer settings with focus trapping, GPC handling, and that the
  banner never blocks the hero or scrolling. `e2e/a11y.spec.js` runs axe on
  the banner and the dialog.
- Lighthouse: with the tag gated, best practices went from 77 to 100 on every
  page (no third-party cookies in an unattended audit).
- Tag Assistant: not run here (needs a signed-in Google account on the live
  site). Expected result after accepting: one AW-17675252735 tag, consent
  state `ad_storage: granted, ad_user_data: granted, ad_personalization:
  denied, analytics_storage: denied`; before accepting: no tag at all.

## Open points for legal review

1. **Geographic scope.** The banner is shown to everyone. That is the
   conservative choice; a lawyer may prefer region-specific behaviour (for
   example no banner outside the EEA/UK/US-opt-out states). Google's
   `region` parameter supports per-region defaults if that is ever wanted.
2. **Consent records held client-side only.** We keep no server-side ledger
   of consents. For a site with no user accounts this is proportionate and
   collects nothing extra, but some advisers prefer a server log; adding one
   would itself be personal-data processing to disclose.
3. **Policy wording for rights and retention.** The policy states the rights
   in general terms (GDPR/UK GDPR; California and similar U.S. states) and
   that we reply "within the time the applicable law allows". Confirm the
   wording and whether a Do Not Sell/Share link is required for your traffic
   (we do not sell or share; the GPC handling and cookie settings cover the
   opt-out mechanism).
4. **Google's cookie list.** The policy names `_gcl_au` and links Google's
   own cookie page rather than listing every cookie Google may set, because
   that list changes. Confirm this level of detail is acceptable.
5. **Terms page.** Unchanged in this work; the Terms date is from the git
   history.
6. **Ads account settings.** Consent mode is now signalled correctly, but
   the Google Ads account's own EU-consent and data settings (and whether
   "enhanced conversions" is off) are outside this repository and should be
   checked in the Ads UI.
