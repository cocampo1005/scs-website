# Content, asset and privacy review

These items need the owner's confirmation before the redesign ships. Nothing
here has been removed yet, except where noted.

## Claims

| Claim | Status |
|---|---|
| Case-study percentages and multipliers (−75%, +90%, +5.5×, −70%, −50%, +2.3×, +120%, +30%, −60%, +65%, +40%, +2×) | **Removed** and replaced with factual outcomes. Reinstate a figure only with a source (client report, analytics export) recorded in the case-study data. |
| About statistics ("15+ industries", "4–12 week avg", "100% custom", "24 hr response") | **Removed** and replaced with qualitative cards. |
| "Avg response within 24 hours · NDA available" (CTA), "Avg response ~24 hrs" (Contact) | **Removed.** |
| "Mon–Fri, 9–6 ET" (Contact, WhatsApp card) | **Kept. Confirm** these are real hours. |
| "Get A Free Quote" (CTA button) | **Kept. Confirm** that quotes are free. |
| Contact JSON-LD `availableLanguage: en, es`, `areaServed: US, CO` | **Confirm.** |

## Screenshots that show people's data

Several screenshots were reviewed one by one, and each needs client
confirmation that it may be published.

| Asset | What it shows | Action |
|---|---|---|
| `meowmax/meowmax-accounts-manager.webp` | Full names of other users (admins and trappers) in clear text. Codes and phones are blurred. | **Needs review.** Blur the names, or confirm consent from each person shown. |
| `meowmax/meowmax-user-profile.webp`, `meowmax-manager-appointment.webp`, `meowmax-appointment-details.webp` | Profile and appointment details | Review for real names, addresses and notes. |
| `street-cat/street-cat-clinic-trappers-list.webp` | Names, addresses and phones that appear to be sample data (555 numbers, repeated rows) | Confirm with the client that this is sample data. |
| `street-cat/street-cat-clinic-records-details.webp` and other record/form screens | Test records under the developer's own name. The trapper tag "Toscano-17161" may be a real person. | Confirm; blur the tag if it is real. |
| `street-cat/street-cat-clinic-add-new-trapper.webp`, `street-cat-clinic-profile-page.webp` | Form with signature upload; account page | Check for real signatures and emails. |
| LMSYC, Bio-Coatings and Blast-It-Off screenshots | Public marketing pages | Low risk. Confirm the client is happy to be featured. |

## Client logos (Projects page logo loop)

A & A Playgrounds, The Flats at Bradenton, Gold Standard Care, Pinnacle SMP,
Icon Group, Rochie's Bridal, Street Cat Clinic, MeowMax, Blast-It-Off,
Bio-Coatings, ELC Real Estate and LWP. **Confirm** permission to show each.
Remove any client that has not agreed.

## Analytics and third-party data

What is active today (verified in `index.html`, `src/` and the production
bundle):

| Service | What it does | Needed? |
|---|---|---|
| Google tag `AW-17675252735` (gtag.js) | Loads on every page. Sends Google Ads page views and sets Google cookies. A conversion event fires after a successful contact form send. | Needed only while Google Ads campaigns run. If no ads are running, remove it: that removes most third-party data collection. |
| EmailJS | Delivers contact form messages | Needed for the form |
| Google Fonts | Loads typefaces; Google receives the visitor's IP address | Could be self-hosted later to remove this transfer |
| Hostinger | Hosting and server logs | Needed |

No Google Analytics 4, no Meta pixel, no browser storage, no other trackers.
Nothing new was added in Phase 1.

**Consent.** For US-only visitors, a disclosure (now in `/privacy`) is the
common baseline. If ads target or reach visitors in the EU/UK, or other regions
with opt-in rules, Google requires consent before ad cookies are set. In that
case, use Google Consent Mode v2 with a consent banner, or load the tag only
after consent. Decide this with the ads audience in mind. It is not implemented
yet, by design (no new tracking or tooling in Phase 1).

## Spanish (future)

English stays primary. To keep a future translation clean, Phase 3 keeps user
copy in content modules (`src/constants/*` today, typed `src/content/*` later)
rather than inline in components. Each module can then gain an `es` variant
with a locale-prefixed route (`/es/...`) and `hreflang` tags. No i18n library
is needed until then.
