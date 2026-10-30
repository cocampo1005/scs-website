# Google Ads tag: assessment

Verified against `index.html`, `src/pages/Contact.jsx` and the live tag
script on 30 Oct 2026. No tracking has been added or removed.

## What is installed

- `index.html` loads `gtag.js?id=AW-17675252735` on every page and calls
  `gtag('config', 'AW-17675252735')`.
- `Contact.jsx` calls `gtag('event', 'conversion', {send_to:
  'AW-17675252735/cPPICNvM37QbEP_nm-xB'})` after a contact message is sent
  successfully.
- There is no GA4, Google Tag Manager container, Meta pixel or other tracker.

## What it collects and sends

On each full page load, the config call sends Google a page-view hit. The hit
includes:

- the page URL and referrer;
- the IP address, user agent and screen details;
- Google advertising cookies or identifiers. The tag sets the first-party
  `_gcl_au` cookie, and Google's own domains may receive their cookies where
  the browser allows it.

By default the Google Ads tag also builds remarketing audiences from these
visits.

Because the site is a single-page app, later in-app navigation is **not**
reported. Only the landing page of each visit and the conversion event are
sent.

The conversion event fires once per successful form send. It carries no form
content.

## Does it do anything without an active campaign?

Very little. The conversion action only matters when ads are running and Google
needs conversions to optimize bidding or report results. Without a campaign,
the tag still loads on every visit, sets cookies and sends data to Google, with
no business benefit beyond keeping historical conversion and audience data
warm. **Whether a campaign is active is your call; I can't see your Google
Ads account.**

## Cost

| | |
|---|---|
| Script weight | 448 KB uncompressed, 156 KB compressed, on every page: more than the site's own main bundle (89 KB compressed) |
| Loading | `async` in `<head>`, so it does not block rendering, but its parsing and execution compete with hydration and the 3D scene on mid-range phones |
| Privacy | Third-party data transfer and advertising cookies on every visit; disclosed in `/privacy` since Phase 1 |

## Consent: what applies depends on the audience

- **US visitors only, no targeting of EU/UK/Switzerland.** No opt-in banner is
  generally required. The privacy policy disclosure (already in place) and
  Google's opt-out links are the usual baseline. Some US states require an
  opt-out of "sharing" for targeted advertising once thresholds are met. A
  small business below those thresholds is typically outside them, but confirm
  with your advisor.
- **Ads target, or meaningfully reach, the EU/EEA, UK or Switzerland.**
  Google's EU user consent policy requires consent before ad cookies are set,
  using Consent Mode v2 with a certified consent banner.
- **Colombia (listed in the site's structured data).** Colombian data
  protection law generally expects prior, informed authorization for
  processing personal data. That would point toward a consent prompt before ad
  tracking for Colombian visitors, if you advertise there.

This is not legal advice. Confirm the audience and targeting, and for any
non-US targeting, check with a qualified advisor.

## Recommendation

1. **If no campaign is running, or none is planned in the next few months:**
   remove the tag. That means deleting the `gtag` snippet from `index.html`
   and the conversion call in `Contact.jsx`, and simplifying the privacy
   policy. The page gets 156 KB lighter and loses its main third-party data
   transfer. It is easy to add back later with consent built in.
2. **If ads are running and target US visitors only:** keep the tag. Load it
   after the page has become interactive. Set `allow_ad_personalization_signals:
   false` unless you actually use remarketing. Keep the disclosure current.
3. **If ads target the EU/UK/CH or Colombia:** keep the tag only behind
   Consent Mode v2 with a lightweight consent banner. Default to denied, and
   load or update only after the visitor agrees.

Until you decide, the development branch keeps the tag exactly as it is.

## How to check your Google Ads account (about 5 minutes)

Sign in at ads.google.com with the account that owns `AW-17675252735`. The
customer ID is shown top-right; the tag ID's numbers identify the
conversion account.

1. **Active campaigns.** Go to **Campaigns** (left menu). Set the date range
   to "Last 30 days" and the status filter to "All but removed". Note:
   - any campaign with status **Eligible** or **Enabled**;
   - whether it had any **Impressions** or **Cost** in the period;
   - its end date, if it has one.
2. **Is the contact conversion used?**
   - Go to **Goals → Conversions → Summary** and find the conversion action
     whose tag ends in `cPPICNvM37QbEP_nm-xB`.
   - Note its **Status** ("Recording conversions", "No recent conversions" or
     "Inactive"), its **Action optimization** ("Primary" or "Secondary"), and
     whether any campaign uses it as a goal.
3. **Remarketing.**
   - Go to **Tools → Shared library → Audience manager → Your data segments**.
     Website visitors segments mean remarketing lists are being built.
   - Under **Your data sources → Google Ads tag**, see whether
     "Personalized advertising" or remarketing is turned on.
4. **Targeted countries.** For each active campaign, open **Settings →
   Locations**. Note the countries or regions targeted, and whether the
   location option is "Presence" or "Presence or interest".
5. **Billing.** Under **Billing → Summary**, check whether there have been
   charges recently. This confirms whether advertising is actually running.

**Send me:** "active: yes/no; conversion primary/secondary/unused;
remarketing on/off; countries: …". I'll recommend removing the tag or keeping
it, along with the matching consent and privacy changes. Nothing changes
until you decide.
