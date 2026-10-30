# Solid Code Solutions LLC
## Website Repositioning, Experience Design & Engineering Master Brief

**Project:** Solid Code Solutions — https://solidcodesolutionsllc.com/  
**Repository:** `cocampo1005/scs-website` (verify against the working tree before proceeding)  
**Product:** Corporate website, portfolio, and client acquisition experience  
**Primary audience:** Business owners, operations leaders, and decision-makers seeking tailored software  
**Secondary audience:** Technical stakeholders, prospective partners, and businesses seeking professional websites  
**Status:** Discovery, design, and technical planning; no production changes authorized

---

## 1. Executive objective

Reposition **Solid Code Solutions LLC** as a **custom software development and business solutions company**. Professional website development remains an available service, but it should not define the business's first impression or dominate its navigation, homepage, or portfolio.

The website must demonstrate the engineering standards the company promises: **SOLID principles, DRY, pragmatic abstraction, clean architecture, type safety, maintainability, accessibility, performance, and thoughtful user experience**. Upgrade its codebase and content while preserving the distinctive brand identity and interactive 3D storytelling.

This is a coordinated **brand, content, UX, visual design, and code quality initiative**. It is not permission to discard an existing implementation and rebuild blindly.

### Non-negotiable outcomes

1. Visitors quickly understand that the main offering is **custom software for business operations and workflows**.
2. The **homepage missing-piece puzzle** and **About-page interactive SOLID exhibit** remain signature experiences, implemented using **native React Three Fiber (R3F) and Three.js**.
3. The hero retains the metaphor of **finding and fitting the right solution into place**. Completing it should feel rewarding and purposeful.
4. Visitors can understand services, explore projects, and contact the business without needing to complete a puzzle.
5. Software case studies lead the portfolio; traditional website work remains visible but secondary.
6. UI follows a coherent design system, and source code is maintainable, typed, testable, and consistently organized.
7. Keep the existing brand's recognizable cube/block motif and creative energy, expressed more professionally and deliberately.
8. Preserve critical functionality and improve it only after understanding how it currently works.

### Explicit non-goals

- Removing the 3D interactions solely to simplify the page or improve a synthetic benchmark.
- Turning the brand into a generic corporate template.
- Changing frameworks, styling libraries, routers, hosting, or third-party providers without a demonstrated benefit.
- Overengineering a marketing website with needless abstraction or unnecessary dependencies.
- Claiming measurable business outcomes without evidence.
- Deploying, pushing destructive changes, or deleting potentially relevant files without approval.

---

## 2. Business positioning & messaging

### Brand proposition

**Custom Software. Built Around Your Business.**

We design and develop practical, dependable software that simplifies operations, connects systems, automates workflows, and solves challenges that off-the-shelf products do not address well.

### Supporting brand narrative

Businesses rarely operate in identical ways. The right solution is not a random product forced into a process; it is a system designed to fit the people, workflows, and goals behind the business. The modular cube, missing piece, and SOLID exhibit visually express this idea.

### Core message hierarchy

1. **What we build:** custom software solutions for businesses.
2. **Why clients care:** less manual work, clearer operations, better-connected data, fit-for-purpose tools.
3. **Proof:** authentic completed projects, specific capabilities, screenshots, technical approach, verifiable results.
4. **How we work:** understand the process, design the system, build carefully, improve over time.
5. **How to begin:** a straightforward conversation about a business problem or project.

### Service hierarchy

| Emphasis | Service | Representative work |
|---|---|---|
| **Primary** | **Custom Software Development** | Internal dashboards, records platforms, booking systems, client portals, business web applications, management tools |
| **Secondary** | **Workflow Automation & Integrations** | API integrations, system-to-system data flow, streamlined approvals, automating repetitive tasks, replacing fragile manual processes |
| **Secondary** | **Software Modernization & Support** | Refactoring, performance improvements, feature extensions, bug fixes, maintenance, modernization of existing web apps |
| **Supporting** | **Professional Website Development** | Modern business websites, WordPress, strategic redesigns, responsive UI, SEO foundations, performance optimization, ongoing website support |

Lead with business problems and outcomes, not with lists of programming languages. Technologies belong where they build credibility: technical capabilities and case studies.

### Tone

Professional, capable, direct, clear, approachable, and human. Avoid generic agency superlatives, inflated claims, buzzwords, and language implying an enterprise-sized staff unless substantiated. It is fine to position the company as a hands-on development partner.

### Hero copy directions for design exploration

**Option A**  
Eyebrow: `CUSTOM SOFTWARE DEVELOPMENT`  
Headline: **Custom Software. Built Around Your Business.**  
Support: *We build reliable applications that streamline your workflows, connect your tools, and solve the challenges holding your business back.*

**Option B**  
Eyebrow: `SOFTWARE SOLUTIONS THAT FIT`  
Headline: **The Right Software. The Perfect Fit.**  
Support: *Purpose-built digital systems for the way your business actually operates.*

**Option C**  
Eyebrow: `DESIGNED FOR YOUR BUSINESS`  
Headline: **Complex Challenges. Solid Solutions.**  
Support: *From custom applications to smarter workflows, we turn operational problems into dependable software.*

Primary CTA: **Discuss Your Project**. Secondary CTA: **Explore Our Work**. These are candidates, not approved final copy. Evaluate clarity and brand fit together.

---

## 3. Brand identity and design direction

Retain the geometric **cube/building-block metaphor**, recognition of the SCS logo, and a refined purple/violet identity. Professionalize through disciplined typography, spacing, contrast, component consistency, high-quality project imagery, and purposeful animation.

### Three concepts to develop in Claude Design

**A. Precision Engineering + Playful Geometry — preferred exploration**
- Deep graphite/ink surfaces, selective violet or lavender accents, restrained glow.
- Strong typographic hierarchy; editorial yet technical layout.
- Sophisticated geometries, grid/diagram details, real application screenshots.
- R3F hero puzzle as a premium centerpiece, not an ornamental afterthought.
- Confident, credible software partner with a memorable creative signature.

**B. Digital Architecture**
- Lighter neutral canvas with dark technical/application panels.
- Clear modular composition, process diagrams, architectural structure.
- Retain the cube motif, 3D interaction, and visual storytelling.
- Emphasize usability, trust, and high-quality software craftsmanship.

**C. Refined Futuristic Studio**
- Evolve the current dark-purple energy into a calmer, more intentional system.
- Cinematic 3D, controlled illumination, sophisticated motion, fewer competing effects.
- Distinctly creative but oriented toward software buyers rather than gaming aesthetics.

### Required design artifacts

For **each** concept, provide coherent desktop and mobile representations of:
- Homepage hero **unsolved**, **during interaction**, and **solved**.
- Primary navigation, service hierarchy, and CTAs.
- Software-first featured work and an individual software case-study page.
- The About-page interactive SOLID exhibit.
- Contact page, form, and footer.
- Loading, reduced-motion, mobile-touch, and WebGL-fallback treatments.

Mockups must be grounded in the existing R3F concepts and realistic implementation constraints, not generated as unrelated static hero artwork. Identify which existing visual assets/3D features can remain and what needs adaptation.

### Design review rubric

Clarity in the first five seconds; trust and professionalism; distinctive SCS identity; quality of the fit-the-piece narrative; accessibility and readability; mobile ergonomics; case-study prominence; responsiveness; realistic implementation and performance cost.

---

## 4. Homepage 3D puzzle: storytelling and usability

### Experience goal

The visitor participates in **fitting the right piece into place** and understands why that metaphor represents the business. The interactive accomplishment is an enhancement to the story, not a prerequisite for learning what SCS sells.

### Experience states

**Unsolved / first impression**
- Present a clear, visible, semantic HTML headline describing custom software development and a concise value proposition.
- Keep meaningful primary/secondary CTAs and standard navigation operable.
- Integrate the R3F puzzle as a visually prominent experience: split composition, integrated overlay, or a full-bleed scene with readable HTML layers. Do not assume one layout before design exploration.
- Give an intuitive hint: `Fit the missing piece`, `Make it fit`, or similar.
- Ensure the canvas never obscures or blocks links and readable content.

**Interaction**
- Preserve tactile satisfaction, meaningful movement, visual feedback, and discoverable drag/tap gestures.
- Maintain mobile scrolling and touch usability; keep controls comfortable on smaller devices.
- Supply an equivalent accessible path using ordinary DOM semantics, keyboard controls, and clear focus states.
- Avoid unexpected capture of keyboard focus, scroll trapping, or intrusive instructions.

**Solved / reward**
- Animate a satisfying fit, assembly, and/or activation of the structure.
- Reveal an additional storytelling beat, such as `Every piece has a purpose. Every solution is built to fit.`
- Consider a tasteful transformation from abstract blocks to connected workflows or a software-inspired composition.
- Add optional motion/emphasis to the featured work action or transition into the next section.
- Preserve existing essential text and navigation; do not make the solved state the first time the user can understand the offering.
- Consider replay and a session-scoped solved state, only if they improve repeat-visit UX.

### Accessibility, SEO, and robustness

The website is intended to provide crawlable marketing content and an accessible alternative to the 3D interaction. **Inspect and validate the current implementation rather than assuming these are missing.** Maintain semantic HTML, proper headings, clear controls, screen-reader equivalents, keyboard usability, reduced-motion alternatives, contrast, and reliable navigation.

Provide an obvious bypass where necessary, and keep the page functional when WebGL is unsupported, context creation fails, scene assets are unavailable, or load time is high. Accessibility should be verified through testing rather than treated as a checkbox; do not claim formal legal compliance without appropriate assessment.

### UX validation hypothesis

The puzzle may improve memorability while reducing clarity for some visitors. Test this empirically: can a first-time business visitor identify SCS's main service within five seconds without solving it? Can they reach work and contact smoothly? Evaluate puzzle engagement, case-study visits, contact CTA engagement, and mobile behavior without collecting unnecessary personal data.

---

## 5. About-page SOLID principles exhibit

The About-page interactive SOLID installation is another **protected brand experience**. Retain the educational interplay of 3D pieces and engineering principles. Each concept should be communicated accurately and clearly:

- **S — Single Responsibility**
- **O — Open/Closed**
- **L — Liskov Substitution**
- **I — Interface Segregation**
- **D — Dependency Inversion**

Each definition and business-oriented explanation should remain accessible in normal HTML independently of the Canvas. Provide intuitive pointer, touch, and keyboard interaction where relevant. Keep page-specific scene code isolated from the hero puzzle; share common R3F utilities only when genuinely useful.

The exhibit should support the company name and engineering philosophy without turning the About page into a technical lecture for nontechnical buyers.

---

## 6. Information architecture and content plan

### Proposed navigation

`Services` · `Work` · `About` or `Our Approach` · `Contact` plus a prominent **Discuss Your Project** action. Consolidate or adjust only where content justifies a distinct page.

### Homepage content order

1. **Hero:** interactive R3F missing-piece puzzle, instantly clear software-first proposition, direct CTAs.
2. **Trust:** authentic client logos and verified credibility indicators.
3. **Featured software case studies:** Street Cat Clinic and MeowMax as major proof points.
4. **What we build:** tailored applications, operations platforms, dashboards, portals, booking and records systems.
5. **Automation, integrations, and modernization:** problems solved and representative examples.
6. **How we work:** discovery → solution design → development → deployment → continuous improvement.
7. **Why Solid Code Solutions:** clean engineering, practical business understanding, transparency, maintainable code.
8. **Web development:** clearly offered, but smaller in hierarchy.
9. **Contact CTA:** discuss a workflow problem or software idea.

### Featured work

**Street Cat Clinic — Records Management Platform**
- Core narrative: replacing fragmented spreadsheets and manual form creation with structured records, administration tools, search/filtering, and automated PDF workflows.
- Showcase real interface screenshots and the design/engineering decisions that solved the problem.
- Avoid exposing private operational or patient-related data; verify permission and redact screenshots as needed.

**MeowMax / Cat Solutions 305 — Appointment Scheduling Platform**
- Core narrative: structured booking, capacity management, real-time administration, mobile access, and bilingual workflows.
- Show actual calendar, booking, administration, and account interfaces with clear business context.
- Present measured improvements only when reliable data exists.

**Additional Work / Websites**
- Keep strong website work, such as Bio-Coatings and Blast-It-Off, in a secondary portfolio category.
- Other relevant website, automation, and digital systems projects may be included when permission and supporting assets exist.

### Case-study structure

Each major software project should have a distinct, indexable URL, for example `/work/street-cat-clinic` and `/work/meowmax`, subject to an approved route and redirect plan. Include:

1. Business/client context and original problem.
2. Key workflow challenges and constraints.
3. What was designed and developed.
4. Screenshots with useful explanatory captions and accessible alternatives.
5. Relevant architecture/technology choices.
6. Results stated accurately, with evidence where numerical.
7. Related work and a context-specific contact CTA.

Do not invent revenue, conversion lifts, productivity percentages, security certifications, regulatory compliance, or client testimonials. Remove or qualify unsubstantiated claims. Avoid displaying confidential records or client information.

### Contact experience

Use project-oriented, low-friction messaging: invite the user to describe the process they want to improve, the desired outcome, and any existing tools. Preserve a clear email option and other legitimate contact methods. Field validation, international phone input, delivery, abuse controls, attribution, and privacy language must reflect the actual implementation.

---

## 7. Technical foundation

### Recommended stack

Keep the current technology choices where they remain fit for purpose:

- **React 19** for the UI.
- **Vite** for build and development tooling.
- **TypeScript** with strict typechecking, introduced systematically.
- **Tailwind CSS v4** for styling and token-driven components.
- **React Router** for navigation, with correct deep linking and 404 handling.
- **React Three Fiber + Three.js**, and Drei where it genuinely helps, for both 3D experiences.
- **Vitest + React Testing Library** for unit/component tests.
- **Playwright** for critical browser/end-to-end checks.
- **ESLint + Prettier** and automated typecheck/build validation.

Review the installed package versions and available hosting capabilities before selecting implementation details. Do not replace Vite with Next.js or adopt another major framework by default. Do not introduce Spline as a dependency or source of 3D content.

### TypeScript migration requirements

- Establish sensible strict `tsconfig` settings and type-safe Vite/environment configuration.
- Migrate in reviewable slices: app shell → shared UI → content types → forms → scenes → routes/pages, adapting order to dependencies.
- Define intentional types for projects, services, routing, navigation, SEO, contact state, and R3F interactions/events.
- Use discriminated unions for meaningful UI/scene states where appropriate.
- Do not use widespread `any`, unchecked casts, or `@ts-ignore` to evade the compiler.
- Preserve runtime behavior throughout migration; keep the build green between milestones.

### Apply SOLID and DRY pragmatically

- **Single Responsibility:** separate page composition, state transitions, form validation, rendering, and side effects.
- **Open/Closed:** use composable components and variants that extend without fragile conditionals throughout the app.
- **Liskov Substitution:** honor component contracts and expected behavior when swapping implementations.
- **Interface Segregation:** keep props and shared contracts narrow and purpose-specific.
- **Dependency Inversion:** isolate implementation-dependent integrations (analytics, contact provider, browser/3D adapters) from higher-level decisions where useful.
- **DRY:** consolidate actual duplication in tokens, project data, CTA styles, validation, and layout; avoid prematurely generalizing unrelated components.

Aim for legibility and predictable behavior, not textbook patterns applied to every file.

### Suggested code organization (adapt after audit)

```text
src/
  app/
    routes/                 # route definitions, 404 and redirects
    providers/              # application-level providers only as needed
    App.tsx
  components/
    ui/                     # buttons, fields, cards, tags, accordions
    layout/                 # navbar, footer, container, sections
  features/
    hero-puzzle/
      components/           # HTML messaging, hints, controls
      scene/                # R3F elements, Canvas integration
      state/                # puzzle state/transitions
      hooks/
      types.ts
    solid-exhibit/
      components/
      scene/
      state/
    projects/
      components/
      types.ts
    contact/
      components/
      validation/
      integrations/
  content/                  # typed service/project/FAQ/navigation data
  three/                    # shared 3D utilities/assets when appropriate
  lib/                      # SEO, analytics, and pure utilities
  pages/                    # thin page composition
  styles/                   # @theme, base styles, motion, utilities
  types/                    # only genuinely cross-feature types
```

Keep the actual repository's useful conventions; use this as a target organization, not a mandate to relocate every file.

---

## 8. Design system specification

### Design tokens

Use Tailwind v4's CSS-first theme system and semantic CSS variables to define:

- **Color:** background, elevated surface, subtle surface, primary/secondary/muted text, borders, brand accent, focus, error, success.
- **Typography:** font families, sizes, line heights, tracking, weights, fluid headings where appropriate.
- **Spacing:** a consistent scale for page gutters, section rhythm, grids, card padding, and control sizing.
- **Shape:** border radius, stroke/border strength, shadow/elevation, controlled glow.
- **Motion:** durations, easing, hover/press/focus transitions, reduced-motion rules.
- **Layout:** responsive containers, max-widths, grids, breakpoints, spacing around the 3D hero.

### Reusable components

Prioritize `Button`, `LinkButton`, `Container`, `Section`, `SectionHeading`, `Card`, `ProjectCard`, `TechnologyTag`, `FormField`, `Accordion`, `CaseStudyLayout`, and navigation/CTA components. Define variants through typed props and shared class utilities where appropriate. Adopt selected accessible headless primitives only where they reduce maintenance burden.

**Consistency rules:** no ad-hoc near-duplicate colors, margin systems, or button recipes across pages; consistent focus states, hover behavior, form messaging, border treatments, and semantic markup. Integrate scene materials/colors with brand tokens through a practical shared palette where helpful, without trying to represent all WebGL effects as CSS.

Deliver a compact design system reference showing typography, palette, components, variants, and representative desktop/mobile states. A full component catalog platform is optional, not required.

---

## 9. React Three Fiber engineering plan

Audit the **actual installed R3F/Three.js code** and optimize based on measurements, not assumptions.

**Scene lifecycle and resources**
- Confirm geometries, materials, textures, event listeners, and RAF work are disposed or cleaned up correctly on navigation.
- Ensure each route mounts only the required Canvas/scene, without unnecessary duplicate rendering contexts.
- Handle WebGL context loss, failed loads, and scene errors gracefully.

**Frame scheduling and animation**
- Evaluate `frameloop="demand"` when scenes can be idle; retain continuous frames where interaction or animation genuinely requires them.
- Avoid repeated React state updates inside `useFrame`; update 3D objects directly for per-frame animation and propagate meaningful scene state changes only.
- Pause or reduce unnecessary work when offscreen or when the browser tab is hidden, while preserving expected interaction behavior.

**Rendering cost**
- Inspect draw calls, geometry/material reuse, texture dimensions, shadow settings, lights, post-processing, and device pixel ratio.
- Profile desktop and representative midrange mobile devices; evaluate smoothness, memory, scene loading, and layout stability.
- Avoid optimizing away the story's signature aesthetic without evaluating its cost and value.

**Input and usability**
- Verify mouse, keyboard, touch, pointer capture, mobile scroll, focus management, and interaction hints.
- Keep primary HTML navigation above/accessible around the Canvas, with clear pointer-event boundaries.
- Respect reduced-motion and offer a meaningful equivalent when no 3D interaction is possible.

**Testing**
- Unit-test puzzle state transitions and relevant pure math/helpers.
- Component-test HTML narrative states, accessible alternatives, success feedback, and CTA behavior.
- End-to-end test routes, solve/skip/replay paths, error fallback, and touch/keyboard flows where automation is reliable.
- Allow controlled deterministic scene mocks/test modes instead of brittle pixel-perfect GPU assertions.

Do not merge the hero puzzle and the SOLID exhibit into a single complex abstraction merely because both use R3F.

---

## 10. Audit checklist — evidence before edits

Before implementation, review the current local working tree and Git status. Confirm the branch to work from, any uncommitted changes, and recent files that might not yet be pushed. Inventory all source files, dependencies, routes, data, styles, assets, integrations, and 3D modules.

Categorize every finding as **verified defect**, **optimization opportunity**, **intentional behavior**, or **needs confirmation**. Include filename/line evidence and expected impact. In particular:

1. **Unused code/assets/dependencies:** search imports and references, inspect build output, identify dead branches and stale files. Remove only when verified safe.
2. **Dynamic Tailwind classes:** look for computed class names the static extractor may not detect; replace with safelisted/static variants or CSS properties if necessary.
3. **Duplicate data:** check project IDs/slugs, links, descriptions, CTAs, and asset imports across pages; normalize into typed canonical data.
4. **Routing:** verify every navigation action, deep link, project CTA, history behavior, scroll restoration, real 404 handling, and redirects for existing URLs.
5. **SEO:** inspect title/descriptions, canonical URLs, Open Graph assets, structured data, sitemap/robots, heading hierarchy, JS-rendered content, and discoverability of individual case studies. Consider selective prerendering only with a concrete SEO/performance justification.
6. **Accessibility:** audit semantic structure, keyboard operation, focus, contrast, form validation, 3D fallback, screen-reader equivalents, and reduced motion.
7. **Contact:** confirm validation, email delivery provider behavior, correct status states, error handling, submission tracking, abuse resistance, and meaningful privacy disclosure. Client-only timeouts/rate limits are not substitute for provider-side controls.
8. **Privacy/legal:** ensure disclosures match actual form processing, third-party services, analytics, cookies/storage, retention, and client consent requirements. Do not dynamically present today's date as a legal document's factual revision date.
9. **Fonts and imagery:** remove confirmed unused variants, optimize images, prevent layout shift, retain authentic client work.
10. **Claim verification:** audit any percentages, speed improvements, response times, client counts, and other claims; substantiate, qualify, or omit.
11. **Performance:** establish baseline Core Web Vitals and relevant lab/device metrics (LCP, INP, CLS, JS payload, rendering impact) before setting realistic budgets.
12. **Security/quality:** dependency vulnerabilities, appropriate environment variable handling, no secrets in client bundles, target link safety, malformed input, build warnings, missing tests.

Do not describe an issue as currently broken based only on a filename, a static excerpt, or an older hosted version; reproduce and verify it in the actual working tree.

---

## 11. Delivery phases and approval gates

### Phase 0 — Inventory and protect

- Inspect repository state, changes, branches, current implementation, and deployment workflow.
- Confirm both interactive R3F features work and capture a functional and visual baseline.
- Create a safe working branch/rollback strategy. **No destructive operations.**

**Deliverable:** inventory, risk register, baseline screenshots and commands, confirmed source of truth.

### Phase 1 — Audit and strategy

- Perform file-referenced architecture, dependency, design consistency, SEO, accessibility, contact, and 3D assessments.
- Create proposed messaging, sitemap, case-study emphasis, and content inventory.
- Rank issues by actual user/business impact and engineering risk.

**Deliverable:** technical audit with verified findings, content strategy, architecture proposal, milestone plan.

### Phase 2 — Visual exploration and approval

- Use Claude Design, if available, to create the three distinct visual concepts.
- Include unsolved, interacting, solved, fallback, and reduced-motion hero states.
- Include real project case-study treatment and mobile designs.
- Agree on one design direction and its component/token specifications.

**Approval gate:** design and content direction accepted before broad implementation.

### Phase 3 — Engineering foundation

- Add strict TypeScript, lint/typecheck/build/test gates, and necessary reusable UI primitives.
- Introduce the design system and normalize structured content.
- Refactor incrementally with small reviewable commits and behavior-preserving tests.

**Deliverable:** typed foundation, design tokens, component examples, test pipeline.

### Phase 4 — Content and experience implementation

- Implement approved pages and software-first case studies.
- Refine both 3D scenes within their established interaction concepts.
- Improve routing, SEO metadata, responsive layout, contact behavior, and fallbacks.

**Deliverable:** working staging build, screenshots, route and interaction tests.

### Phase 5 — Validate, optimize, release

- Measure actual improvements; profile R3F; verify desktop/mobile and browser behavior.
- Run accessibility checks, contact submission tests, SEO checks, unit/E2E tests, and review claims/legal disclosures.
- Prepare changelog, known tradeoffs, rollback instructions and deployment checklist.

**Approval gate:** explicit authorization to publish after final review.

---

## 12. Definition of done

The project is complete when all of the following are satisfied:

- A first-time business visitor can identify **custom software development** as the primary offering without solving the hero puzzle.
- The hero puzzle remains distinctive, engaging, responsive, and narratively meaningful, with a satisfying completion/reward.
- The About-page SOLID exhibit remains interactive and educational.
- Both native R3F scenes function appropriately across supported devices, including accessible alternatives and graceful fallbacks.
- Authentic software work, especially Street Cat Clinic and MeowMax, anchors the site; website development is represented but subordinate.
- Case-study URLs, navigation, forms, redirects and other important features work correctly.
- Strict TypeScript checks, linting, production build, and agreed automated tests pass.
- A documented Tailwind-based design system produces consistent UI across pages and states.
- Verified dead code/dependencies are removed safely, with no undocumented behavior loss.
- The site meets agreed accessibility, SEO, and realistic performance targets validated against a recorded baseline.
- Measurable claims, privacy disclosures, and client screenshots are accurate and appropriately approved.
- Review notes, performance comparisons, and rollback details are delivered, and deployment occurs only after approval.

---

## 13. Initial Claude Code instruction

Copy the instruction below into Claude Code with this file available in the project root.

> You are leading the discovery and implementation planning for a complete Solid Code Solutions LLC website overhaul. Read `SCS_2_0_Master_Brief.md` as the primary project specification.
>
> The company is positioning itself primarily around custom software development for businesses, with workflow automation, integrations, application modernization, and professional website development as supporting services. Preserve the recognizable cube/geometric brand identity.
>
> The website contains two native **React Three Fiber** interactive experiences: the homepage missing-piece puzzle and the About-page SOLID principles exhibit. **Both must be retained**. The hero's act of fitting the missing piece is essential storytelling, but visitors must still clearly understand the software offering and access the site without completing the puzzle. Do not substitute generic static hero artwork for either scene or introduce Spline dependencies.
>
> Start with the **actual current working tree**. Inspect Git status, dependencies, source structure, routes, content, current R3F behavior and production concerns. Protect uncommitted work. Do not assume files in remote branches are identical to the local project. Produce a prioritized, evidence-based audit with file references and distinguish verified defects from possible opportunities.
>
> Recommend a strict TypeScript migration, pragmatic SOLID/DRY feature architecture, Tailwind v4 design system, test/CI strategy, and performance/accessibility review, including R3F lifecycle, motion, keyboard/touch interaction, WebGL fallback, SEO and contact behavior.
>
> Develop the software-first sitemap, content hierarchy and case-study strategy. Present **three distinct desktop/mobile visual directions** for Claude Design to explore, showing the hero before/during/after completion and the About-page exhibit. Include a phased implementation plan and measurable acceptance criteria.
>
> **Do not start a wholesale rewrite, remove either 3D interaction, delete files, push changes, or deploy.** Submit the audit, architecture, messaging, and design directions for review and approval first.

---

**Guiding standard:** The finished website should be the company's strongest demonstration of its philosophy: software thoughtfully designed to fit real needs, and code engineered to stay solid as those needs change.
