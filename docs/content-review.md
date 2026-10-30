# Content and asset review checklist

Items marked **Decision** need your confirmation before staging or production.
Done items are recorded for traceability.

## 1. Personal data in screenshots (highest priority)

All screenshots were reviewed (contact sheets of every Street Cat Clinic and
MeowMax image, plus the home feature images).

| Asset | What was exposed | Status |
|---|---|---|
| `meowmax-accounts-manager` | Full names of 4 other users (admins and trappers) | **Done:** sanitized copy shipped |
| `meowmax-appointments-manager-daily`, `-overview`, `meowmax-manage-appointments` | About 20 trapper full names with trapper numbers | **Done:** sanitized copies |
| `meowmax-edit-capacity-modal`, `meowmax-manager-appointment` | The same names, behind a dimmed dialog | **Done:** background blurred |
| `meowmax-case-study-hero`, `images/mm-feature-image` | Trapper chips and accounts table names in the composites | **Done:** sanitized copies |
| `street-cat-clinic-records-details`, `-edit-record`, `-new-entry-form`, `-case-study-hero`, `images/scc-feature-image` | Veterinarian field "Toscano-17161": a person's name plus what may be a licence number | **Done:** blurred. **Decision:** confirm whether it is a real vet |
| `street-cat-clinic-trappers-list`, `-add-new-trapper` | Names, addresses and phones that look like sample data (555 numbers, repeated rows) | **Decision:** confirm it is sample data |
| Records, forms and profile screens | Developer's own name, email and phone; fictional "221B Baker St" address | OK (owner's data) |
| `meowmax-appointment-confirmation` | Street Cat Clinic's business address | OK (public business address) |
| LMSYC, Bio-Coatings, Blast-It-Off screenshots | Public marketing pages | OK |

How it was done:
- Sanitized copies sit next to the originals as `*-sanitized.webp`. The
  originals are untouched and not referenced, so they never ship.
- A test (`src/__tests__/content.test.js`) fails if the project data
  references an unsanitized original.
- Names were blurred rather than replaced with fictional text. Blurring keeps
  the real interface intact without inventing data. If you prefer fictional
  sample names, the clean way is to re-capture those screens from a demo
  account.

**Decision:** do you have written permission from Street Cat Clinic and Cat
Solutions 305 to publish these interfaces at all, even sanitized?

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

The logo-only clients are the most uncertain: there's no case study showing
the work.

## 3. Claims and copy

| Item | Status |
|---|---|
| Case-study percentages and multipliers; About statistics; "24 hr response"; "NDA available" | **Done:** removed (Phase 1) |
| "Mon–Fri, 9–6 ET" on Contact | **Done:** removed |
| "Get A Free Quote" (current CTA section) | Replaced by "Discuss your project" in the redesign. **Decision:** change the current site's button now, or with the redesign? |
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
