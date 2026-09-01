# Verification & Test Strategy Survey Report: MyLaw Waitlist Redesign

**Author / Agent**: `teamwork_preview_explorer_survey_3`  
**Date**: 2026-09-01  
**Working Directory**: `/Users/koustavdey/mylaw/.agents/teamwork_preview_explorer_survey_3`  
**Target Project**: MyLaw Web Platform (`/Users/koustavdey/mylaw`)  
**Scope**: Testing environment audit, build/lint configuration, dependency & Next.js rule analysis, current waitlist implementation gap audit, and 4-tier opaque-box E2E test strategy specification.

---

## 1. Executive Summary

This report delivers a thorough empirical survey of the testing, build, and verification infrastructure of the MyLaw repository in preparation for redesigning the **Waitlist / Coming Soon page** (`/waitlist` and `WaitlistForm.tsx`) into a premium, sophisticated asymmetric split layout matching the brand's editorial legal-tech aesthetic.

### Key Findings
1. **Runtime & Build Setup**: Next.js `16.3.3` (Turbopack bundler) + React `19.2.8` + TypeScript `5.x` (`strict: true`, target `ES2017`, `moduleResolution: bundler`). The build (`npm run build`) and linter (`npm run lint` / ESLint flat config) currently pass with exit code `0`.
2. **Next.js Breaking Conventions (`AGENTS.md`)**: Next.js 16 breaking changes require adherence to updated Next.js app directory conventions, server/client boundary separation (`"use client"` on interactive components like `WaitlistForm.tsx` and `Navbar.tsx`), Suspense boundaries around `useSearchParams()`, and preservation of the `AGENTS.md` rules block.
3. **Testing Harness Architecture**: The project uses an opaque-box, deterministic native test runner (`node tests/e2e/runner.mjs` / `npm test`) executing over Node.js 22 without requiring heavy browser binaries. Built-in helpers provide HTTP page fetching, DOM parsing, interactive form simulation, and static AST/CSS token scanning.
4. **Current Waitlist Implementation Gap**: The current `/waitlist` page utilizes a centered single-column layout with standard HTML radio input circles, missing the requested asymmetric desktop split layout, custom block selectors, editorial depth elements ("01" translucent numbering, atmospheric hero tint), and complete footer links (Privacy, Terms, Contact).
5. **Non-Regression Requirement**: The landing page (`/`) must remain 100% unmodified and functional while `/waitlist` and `WaitlistForm.tsx` undergo redesign.

---

## 2. Technical Stack & Build Environment Audit

### 2.1 Dependencies & Configuration Inventory

| Category | Component / Tool | Version / Config | Notes |
|---|---|---|---|
| **Framework** | Next.js | `16.3.3` | App Router (`src/app`), Turbopack compiler |
| **UI Runtime** | React & React-DOM | `19.2.8` | Client/Server component separation |
| **Language** | TypeScript | `^5` | Strict mode enabled, alias `@/*` -> `./src/*` |
| **CSS Engine** | Tailwind CSS & PostCSS | `^4.0` / `@tailwindcss/postcss ^4` | Tailwind v4 with `@theme` block in `globals.css` |
| **UI Primitives** | Base UI / Shadcn / Lucide | `@base-ui/react ^1.7`, `lucide-react ^1.38`, `clsx`, `tailwind-merge` | Utility components |
| **Linting** | ESLint | `^9` | Flat config (`eslint.config.mjs`) extending Next.js core web vitals |
| **Node Runtime** | Node.js | v22 | Native ES modules (`.mjs`) and native test capabilities |

### 2.2 Package Scripts

| Script | Command | Purpose | Verification Status |
|---|---|---|---|
| `dev` | `next dev` | Local development server | Verified |
| `build` | `next build` | Production static generation & compilation | Verified (exited `0`, static routes `/`, `/waitlist`, `/_not-found`) |
| `start` | `next start` | Production server | Verified |
| `lint` | `eslint` | Code quality & React lint rules | Verified (exited `0`) |
| `test` | `node tests/e2e/runner.mjs` | Automated E2E verification suite | Verified (`35/37` passing on existing codebase; updates identified) |
| `test:e2e` | `node tests/e2e/runner.mjs` | Alias for automated test suite | Verified |

### 2.3 Next.js 16 Rules & Architecture Constraints (`AGENTS.md`)
- `AGENTS.md` highlights that Next.js 16 features breaking architectural updates from earlier Next.js versions.
- All client-side hooks (`useState`, `useSearchParams`, `useEffect`) must strictly live within `"use client"` components.
- Any component using `useSearchParams()` (such as `WaitlistFormContent` parsing `?role=...`) MUST be wrapped in a `<Suspense>` boundary to prevent de-opting static site generation during `next build`.
- The rule comment block `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->` is auto-maintained and must never be altered or removed.

---

## 3. Waitlist Requirements & Implementation Gap Analysis

### 3.1 Requirements Breakdown (`ORIGINAL_REQUEST.md`)

| Req ID | Requirement Area | Required Specification | Current State in Codebase | Gap / Action Required |
|---|---|---|---|---|
| **R1** | **Layout & Composition** | Asymmetric split layout on desktop (`lg:grid-cols-12` or `lg:grid-cols-2`). Left: headline ("Legal help, made simpler."), small eyebrow ("COMING SOON / 01"), brand statement. Right: refined waitlist panel with form. Subtle navy-to-blue atmospheric gradient behind hero while remaining light-themed. | Centered single-column layout (`max-w-xl mx-auto text-center`), basic "COMING SOON" badge. | Refactor `src/app/waitlist/page.tsx` into desktop asymmetric split layout (stacking naturally on mobile) with subtle atmospheric hero tint. |
| **R2** | **Navigation & Footer** | Page-specific navbar with MyLaw wordmark left, "← Back to Home" link right. Minimal footer with brand name, Privacy, Terms, Contact links, and copyright text. | Header has logo and back link; footer currently only contains copyright and tagline (missing Privacy, Terms, Contact). | Update waitlist footer to include Privacy, Terms, and Contact links (`mailto:` or anchor). |
| **R3** | **Visual Detail & Brand Fidelity** | Subtle visual depth: faint oversized "MYLAW" typography, large translucent "01" numbering, thin editorial lines, subtle grid pattern. Zero gavels, scales, or AI tropes. Adhere strictly to palette: `#172033` (Primary), `#285A8E` (Accent), `#FFFFFF` (Background), `#F7F8FA` (Soft). | Basic SVG grid overlay only. | Add translucent "01" watermark/numbering, editorial hairlines, and atmospheric gradient without entering dark mode. |
| **R4** | **Waitlist Form Component** | `WaitlistForm.tsx`: Input and button unified (48–52px height, 8–10px radius, subtle border, clean focus ring). Selector "I am a: [Looking for legal help] [Lawyer]" must use custom selectable blocks (no OS radio rings). Valid email submission triggers smooth (150–300ms) client-side transition to "You're on the list." without backend calls. | Native `<input type="radio">` circles visible. Input height 48px, standard styling. | Replace radio inputs with custom toggle blocks. Polish input/button cohesion (48-52px, rounded-lg). Ensure smooth 150-300ms success transition. |
| **R5** | **Animations & Micro-interactions** | Motion subtle and fast (150–300ms). Fade/slide-in for hero content, 3–4px hover movement for button arrow (`group-hover:translate-x-1`), smooth focus ring. No parallax, bouncing, or cursor effects. | Basic CSS transitions in place. | Standardize all transition durations to 150–250ms with clean arrow translation. |
| **Non-Reg** | **Landing Page Protection** | Landing page (`/`) must remain completely unmodified and functional. | Landing page is functional. | Ensure zero changes are made to `src/app/page.tsx` or `src/components/landing/*`. |

---

## 4. Comprehensive 4-Tier Opaque-Box E2E Test Strategy

The proposed E2E testing framework exercises the full surface area of the waitlist page, form interactivity, responsiveness, brand constraints, and regression prevention.

```
                         ┌────────────────────────────────────────────────────────┐
                         │               4-TIER E2E TEST STRATEGY                 │
                         └────────────────────────────────────────────────────────┘
                                                     │
         ┌───────────────────┬───────────────────────┴───────────────────────┬───────────────────┐
         ▼                   ▼                                               ▼                   ▼
   ┌───────────┐       ┌───────────┐                                   ┌───────────┐       ┌───────────┐
   │  TIER 1   │       │  TIER 2   │                                   │  TIER 3   │       │  TIER 4   │
   │  Feature  │       │ Boundary  │                                   │   Cross-  │       │Scenarios &│
   │ Coverage  │       │ & Corner  │                                   │  Feature  │       │ Negative  │
   └───────────┘       └───────────┘                                   └───────────┘       └───────────┘
```

---

### Tier 1: Feature Coverage (12 Core Test Cases)

Validates presence, semantic structure, content fidelity, and layout architecture of all required features.

| Test ID | Test Name | Target Component / Area | Verification Condition |
|---|---|---|---|
| `T1.01` | **Waitlist Route Reachability** | `GET /waitlist` | Returns HTTP 200 with valid HTML5 doctype and SSR markup. |
| `T1.02` | **Desktop Asymmetric Split Layout** | `src/app/waitlist/page.tsx` | Contains grid/flex split container classes (`lg:grid-cols-12` or `lg:grid-cols-2` or `lg:flex-row`) separating hero content (left) and waitlist form panel (right). |
| `T1.03` | **Editorial Eyebrow & Numbering** | `src/app/waitlist/page.tsx` | Contains "COMING SOON" eyebrow badge and "01" editorial marker/numbering. |
| `T1.04` | **Headline & Brand Statement** | `src/app/waitlist/page.tsx` | Displays exact headline `"Legal help, made simpler."` and supporting brand statement. |
| `T1.05` | **Waitlist Dedicated Navbar** | `src/app/waitlist/page.tsx` | Contains MyLaw brand wordmark linking to `/` on left, and `"← Back to Home"` link on right. |
| `T1.06` | **Complete Waitlist Footer** | `src/app/waitlist/page.tsx` | Contains brand name, copyright `© 2026 MyLaw. All rights reserved.`, and links for `Privacy`, `Terms`, and `Contact`. |
| `T1.07` | **Waitlist Form Input Cohesion** | `src/components/waitlist/WaitlistForm.tsx` | Email input has `type="email"`, `required`, accessible label/id (`waitlist-email`), placeholder `"Enter your email address"`, and height class (`h-12` / 48-52px). |
| `T1.08` | **Custom Role Selector Blocks** | `src/components/waitlist/WaitlistForm.tsx` | Contains `"I am a:"` label, `"Looking for legal help"` block, and `"Lawyer"` block. Native OS radio rings are absent/hidden (`sr-only` or button-based). |
| `T1.09` | **Submit Button & Arrow Icon** | `src/components/waitlist/WaitlistForm.tsx` | Button contains `"Join the Waitlist"`, `ArrowRightIcon`, height class (`h-12` / 48-52px), and hover translation styling (`group-hover:translate-x-1`). |
| `T1.10` | **Client-Side Success State** | `src/components/waitlist/WaitlistForm.tsx` | Submitting valid email transitions DOM to `role="status"`, `"You're on the list."`, confirmation copy, checkmark icon, and `"← Back to Home"` return link. |
| `T1.11` | **Editorial Visual Depth Elements** | `src/app/waitlist/page.tsx` | Markup includes subtle background tint/gradient and subtle geometric or typographic depth ("01" / "MYLAW" watermark / grid lines). |
| `T1.12` | **Landing Page Non-Regression** | `GET /` | Returns HTTP 200 with all 7 landing sections (`Hero`, `Problem`, `HowItWorks`, `WhyMyLaw`, `WhoItsFor`, `About`, `FinalCTA`) 100% intact. |

---

### Tier 2: Boundary & Corner Cases (10 Test Cases)

Validates input sanitization, edge states, theme invariants, styling constraints, and responsive breakpoints.

| Test ID | Test Name | Target Component / Area | Verification Condition |
|---|---|---|---|
| `T2.01` | **Empty Email Rejection** | `WaitlistForm.tsx` | Submitting empty email or whitespace-only does not trigger success state. |
| `T2.02` | **Malformed Email Pattern Rejection** | `WaitlistForm.tsx` | Invalid formats (`plainaddress`, `@domain.com`, `user@`, `user@domain..com`) rejected by HTML5 / regex validation. |
| `T2.03` | **Whitespace Trimming & Sanitization** | `WaitlistForm.tsx` | Email with leading/trailing spaces (`  counsel@mylaw.test  `) is trimmed before submission. |
| `T2.04` | **Optional Role Omission** | `WaitlistForm.tsx` | Submitting with role unselected (default null state) succeeds seamlessly. |
| `T2.05` | **Role Selection Toggle & Persistence** | `WaitlistForm.tsx` | Selecting "Looking for legal help" or "Lawyer" updates active block styling (`bg-[#285A8E]`/active border) and retains value upon submit. |
| `T2.06` | **Rapid Double Submission Idempotency** | `WaitlistForm.tsx` | Double-clicking submit button while `isSubmitting` is handled cleanly without duplicate state transitions or UI glitched states. |
| `T2.07` | **Strict Light Mode Enforcement** | `globals.css` / `waitlist/page.tsx` | Zero dark mode media queries (`@media (prefers-color-scheme: dark)`) or dark mode leakage on waitlist page. |
| `T2.08` | **Authorized Design Tokens Adherence** | `globals.css` / TSX files | Strict use of `#172033` (Navy), `#285A8E` (Blue), `#F7F8FA` (Soft), `#FFFFFF` (White), `#E6E8EC` (Border), `#2F7C78` (Teal), and radii 6px/8px/10px/14px. |
| `T2.09` | **Micro-interaction Duration Ceiling** | TSX files | All Tailwind transition classes have `duration-[x]` where `x <= 300ms` (ideally `duration-150` or `duration-200`). |
| `T2.10` | **Mobile Responsive Breakpoint Stacking** | `waitlist/page.tsx` | CSS classes verify mobile viewport stacks vertically (`flex-col` / `grid-cols-1`) and expands to asymmetric split on desktop (`lg:grid-cols-12` or `lg:grid-cols-2`). |

---

### Tier 3: Cross-Feature Combinations & Navigation Flows (6 Test Cases)

Validates integration between pages, query parameter handling, and link targets.

| Test ID | Test Name | Target Flow | Verification Condition |
|---|---|---|---|
| `T3.01` | **Landing to Waitlist CTA Flow** | Landing -> `/waitlist` | All primary CTAs across Landing page ("Join the Waitlist", "I'm a Lawyer") correctly route to `/waitlist`. |
| `T3.02` | **Role Parameter Pre-Selection (Lawyer)** | `GET /waitlist?role=lawyer` | Waitlist page parses `role=lawyer` query param and pre-activates the "Lawyer" selector block upon initial render. |
| `T3.03` | **Role Parameter Pre-Selection (Help/Individual)** | `GET /waitlist?role=help` | Waitlist page parses `role=help` query param and pre-activates "Looking for legal help" block upon initial render. |
| `T3.04` | **Waitlist Header Return Navigation** | Waitlist header -> `/` | Header logo and `"← Back to Home"` link navigate cleanly to `/`. |
| `T3.05` | **Success State Return Navigation** | Success panel -> `/` | `"← Back to Home"` link in success card navigates cleanly to `/`. |
| `T3.06` | **Waitlist Footer Link Integrity** | Waitlist footer -> Links | Footer links point to valid targets: Privacy (`#`), Terms (`#`), Contact (`mailto:contact@mylaw.com` or `/contact`). |

---

### Tier 4: Real-World Scenarios & Negative Brand Assertions (5 Test Cases)

End-to-end user journey simulation and Section 26 Brand Prohibitions enforcement.

| Test ID | Test Name | Scope | Verification Condition |
|---|---|---|---|
| `T4.01` | **Full Consumer Waitlist Journey** | E2E Scenario | Discovery on `/` -> click Hero "Join the Waitlist" -> arrive at `/waitlist` -> select "Looking for legal help" -> input email -> submit -> receive "You're on the list." -> click "← Back to Home" -> return to `/`. |
| `T4.02` | **Full Legal Professional Pre-Launch Journey** | E2E Scenario | Professional navigates to `/waitlist?role=lawyer` -> verifies "Lawyer" pre-selected -> enters counsel email -> submits -> verifies instant success confirmation. |
| `T4.03` | **Negative Assertion: Legal Tropes** | Static Code Audit | Zero gavels, scales of justice, courtroom columns, or judge's bench imagery across source files. |
| `T4.04` | **Negative Assertion: AI / Hype Gradients** | Static Code Audit | Zero purple AI startup gradient buzzwords, zero black/gold luxury styles, zero fake testimonials or fake counters. |
| `T4.05` | **Full Build & Lint Zero-Defect Guarantee** | Pipeline Audit | `npm run build` exits 0 (Next.js Turbopack), `npm run lint` exits 0, `npx tsc --noEmit` exits 0. |

---

## 5. Verification Harness Execution & Test Automation Setup

### 5.1 Test Execution Commands
```bash
# 1. Run Complete 4-Tier Automated Test Suite
npm test
# or
node tests/e2e/runner.mjs

# 2. Run Specific Tiers
node tests/e2e/runner.mjs --tier=1       # Feature Coverage
node tests/e2e/runner.mjs --tier=2       # Boundary & Corner Cases
node tests/e2e/runner.mjs --tier=3       # Cross-Feature & Navigation
node tests/e2e/runner.mjs --tier=4       # Real-World Scenarios & Brand Prohibitions

# 3. Target Existing Running Dev Server
node tests/e2e/runner.mjs --port=3000 --base-url=http://localhost:3000

# 4. Build, Typecheck, and Lint Verification
npx tsc --noEmit
npm run lint
npm run build
```

### 5.2 Test Output Artifacts
- **Terminal Reporter**: Color-coded output indicating individual test pass/fail, execution durations (ms), tier subtotals, and total summary.
- **Machine Report**: Output JSON saved to `tests/e2e/report.json`.

---

## 6. Recommendations for Implementation Phase

1. **Waitlist Page Refactoring (`src/app/waitlist/page.tsx`)**:
   - Structure as an asymmetric desktop split layout:
     - **Left Column (5 cols or 50% width)**: Eyebrow (`"COMING SOON / 01"` with subtle badge styling), large editorial numeral `"01"` in translucent accent styling, high-impact headline `"Legal help, made simpler."`, concise brand narrative statement, and subtle architectural hairline dividers.
     - **Right Column (7 cols or 50% width)**: Refined, elevated waitlist panel card (`bg-white`, border `#E6E8EC`, radius `10px`-`12px`, subtle shadow `0 1px 3px rgba(16,24,40,0.05)`) containing `WaitlistForm`.
   - Backdrop: Add subtle atmospheric gradient (`from-[#F7F8FA] via-white to-[#F0F4F8]` or subtle navy/blue tinted glow behind hero) with low-opacity geometric architectural pattern.
   - Header & Footer: Add clean navbar (`MyLaw` left, `← Back to Home` right) and comprehensive minimal footer (Brand, `Privacy`, `Terms`, `Contact`, `© 2026 MyLaw. All rights reserved.`).

2. **Waitlist Form Refactoring (`src/components/waitlist/WaitlistForm.tsx`)**:
   - Replace native radio buttons with clean custom toggle blocks for `"Looking for legal help"` and `"Lawyer"`.
   - Maintain unified input and button height (48–52px / `h-12`).
   - Implement smooth 150–250ms client-side transition to success state (`"You're on the list."`).
   - Wrap in `<Suspense>` boundary for `useSearchParams()` static build safety.

3. **Landing Page (`/`) Integrity**:
   - Do NOT edit any files in `src/components/landing/*` or `src/app/page.tsx`.
   - Verify that all CTA links pointing to `/waitlist` remain connected.
