# Content and asset review checklist

Items marked **Decision** need your confirmation before staging or production.
Done items are recorded for traceability.

## 1. Application screenshots

Confirmed by the owner (30 Oct 2026): every name, record, account,
appointment, address, phone number and veterinarian identifier shown in the
Street Cat Clinic and MeowMax screenshots is **fictional demo data** created
for showcasing the apps. The original, unblurred screenshots are used
everywhere; no redaction is needed.

**Decision:** do you have permission from Street Cat Clinic and Cat Solutions
305 to show their applications (interfaces and branding) in the portfolio?
This is the same branding question as the logos below.

## 2. Client logos (Projects page logo loop)

Being publicly visible does not mean a client has agreed to be shown as an
endorsement. **Decision:** confirm each logo, or tell me which to remove.

| Logo | Related work on the site | Permission |
|---|---|---|
| Street Cat Clinic | Featured case study | ☐ |
| MeowMax / Cat Solutions 305 | Featured case study | ☐ |
| Bio-Coatings | Case study | ☐ |
| Blast-It-Off | Case study | ☐ |
| Icon Group | Other projects | ☐ |
| A & A Playgrounds | Other projects | ☐ |
| ELC Real Estate | Other projects | ☐ |
| The Flats at Bradenton | Logo only | ☐ |
| Gold Standard Care | Logo only | ☐ |
| Pinnacle SMP | Logo only | ☐ |
| Rochie's Bridal | Logo only | ☐ |
| LWP | Logo only | ☐ |
| Let Me Style Your Career | Case study (no logo) | ☐ |

**Recommendation for the production release.** Omit the five logo-only clients
(The Flats at Bradenton, Gold Standard Care, Pinnacle SMP, Rochie's Bridal,
LWP) until each confirms. They have no case study on the site, so the logo
alone reads as an endorsement. Keep case-study clients only once each has
confirmed. Nothing will be published until you've reviewed the final list.

## 3. Claims and copy

| Item | Status |
|---|---|
| Case-study percentages and multipliers; About statistics; "24 hr response"; "NDA available" | **Done:** removed (Phase 1) |
| "Mon–Fri, 9–6 ET" on Contact | **Done:** removed |
| "Get A Free Quote" (current CTA section) | **Done:** now "Discuss Your Project"; the redesign uses the same wording |
| "In English or Spanish" (MeowMax) | Comes from the project data (full English/Spanish UI). OK |
| Case-study architecture details shown as `[Confirm …]` in the design canvas | **Decision:** provide accurate details, or keep them generic |

## 4. Tracking and privacy

| Item | Status |
|---|---|
| Google Ads tag (`AW-17675252735`) | Kept unchanged. **Decision:** see `docs/tracking-assessment.md` |
| Privacy policy | Accurate for the current setup. It must change in the same release as the SMTP migration, and again if the Ads tag is removed or consent is added |
| Contact JSON-LD `areaServed: US, CO`, `availableLanguage: en, es` | **Decision:** confirm (this also affects the consent assessment) |

## 5. Spanish (future)

English stays primary. Copy lives in content modules (`src/constants/*` today,
typed `src/content/*` in Phase 3), so a later `es` variant can be added with
`/es/...` routes and `hreflang` tags, without restructuring components.
