# MyLaw E2E Test Infrastructure & Coverage Matrix

## 1. Test Architecture Overview

The MyLaw automated E2E testing framework is designed as an **opaque-box, deterministic verification suite** running natively on Node.js 22. It provides multi-layer validation across HTTP endpoints, rendered HTML/DOM structures, client-side state transitions, and static theme/code constraints without requiring heavy third-party browser binaries or unstable browser drivers.

```
tests/e2e/
├── runner.mjs                             # Master CLI test runner & reporter
├── tier1-feature-coverage.test.mjs        # Tier 1: 15 core feature coverage test cases
├── tier2-boundary-corner.test.mjs         # Tier 2: 10 boundary & corner case test cases
├── tier3-cross-feature.test.mjs           # Tier 3: 7 cross-feature & navigation flow test cases
├── tier4-scenarios-negative.test.mjs      # Tier 4: 2 real-world user journeys + 3 negative brand assertion suites
└── helpers/
    ├── dom-parser.mjs                     # Zero-dependency HTML DOM parser & query engine
    ├── dom-simulator.mjs                  # Interactive client-side form state & validation simulator
    ├── http-client.mjs                    # Next.js server lifecycle manager & HTTP fetch client
    └── source-scanner.mjs                 # Static token, CSS, font, and brand prohibition scanner
```

---

## 2. Systematic 4-Tier Test Suite Specification

### Tier 1: Feature Coverage (15 Test Cases)
Validates the presence, structure, content, and visual tokens of every primary feature specified in `ORIGINAL_REQUEST.md` and `design.md`.

| Test ID | Test Name | Description & Invalidation Condition |
|---------|-----------|--------------------------------------|
| `Tier 1.01` | Landing page HTTP 200 | Verifies `GET /` responds with HTTP 200 and rendered HTML content. |
| `Tier 1.02` | All 7 Landing Sections Present | Validates that Hero, Problem, How It Works, Why MyLaw, Who It's For, About, and Final CTA are present. |
| `Tier 1.03` | Hero Eyebrow, Headline & Copy | Confirms "LEGAL HELP, SIMPLIFIED" eyebrow, primary headline, and supporting narrative. |
| `Tier 1.04` | Hero Dual CTAs | Checks "Join the Waitlist" (-> `/waitlist`) and "Learn More" (-> `#how-it-works`). |
| `Tier 1.05` | Coded UI Mockup Panel | Verifies search prompt, category chips (Family Law, Property, Corporate), and zero stock photos. |
| `Tier 1.06` | How It Works 3-Step Sequence | Validates 01, 02, 03 editorial sequence and step copy. |
| `Tier 1.07` | Why MyLaw 4 Principles | Validates Clarity, Choice, Trust, and Accessibility value cards. |
| `Tier 1.08` | Who It's For Dual Panels | Validates "For Individuals" and "For Lawyers" split panels with dedicated CTAs. |
| `Tier 1.09` | Alternating Background Rhythm | Verifies alternating rhythm of `#FFFFFF` and `#F7F8FA` across sections. |
| `Tier 1.10` | Sticky Navbar Structure | Verifies sticky header, brand wordmark, navigation links, CTA, and mobile hamburger button. |
| `Tier 1.11` | Minimal Brand Footer | Verifies wordmark, tagline, links, and exact copyright `© 2026 MyLaw. All rights reserved.`. |
| `Tier 1.12` | Waitlist Page Base & Layout | Verifies `GET /waitlist` returns HTTP 200, "COMING SOON" eyebrow, and centered layout. |
| `Tier 1.13` | Waitlist Email Input Constraints | Verifies email input with `type="email"` and `required` constraint attribute. |
| `Tier 1.14` | Waitlist Optional Role Radio | Verifies "I am a:" role selector ("Looking for legal help" / "Lawyer"). |
| `Tier 1.15` | Waitlist Submit Button & Microcopy | Verifies "Join the Waitlist" button and "No spam. Just launch updates." microcopy. |

### Tier 2: Boundary & Corner Cases (10 Test Cases)
Tests edge conditions, malformed inputs, sanitization, theme boundaries, and responsiveness.

| Test ID | Test Name | Description & Invalidation Condition |
|---------|-----------|--------------------------------------|
| `Tier 2.01` | Empty Email Validation Rejection | Empty string rejected; does not transition to success. |
| `Tier 2.02` | Malformed Email Validation Rejection | Tests invalid patterns (`user@`, `@domain.com`, `plainaddress`, `spaces in@email.com`). |
| `Tier 2.03` | Leading/Trailing Whitespace Sanitization | Leading/trailing whitespace trimmed and sanitized prior to submission. |
| `Tier 2.04` | Optional Role Unselected Submission | Submission succeeds when role is unselected/default. |
| `Tier 2.05` | Role Value Persistence | Selecting "Looking for legal help" or "Lawyer" preserves role value on submission. |
| `Tier 2.06` | Rapid Double Submission Idempotency | Rapid double-clicks handled cleanly without duplication or crash. |
| `Tier 2.07` | Light-Mode Strict Guarantee | Validates total absence of `@media (prefers-color-scheme: dark)` or dark mode class overrides. |
| `Tier 2.08` | Design Tokens Verification | Verifies exact hex codes (`#FFFFFF`, `#F7F8FA`, `#172033`, `#667085`, `#E6E8EC`, `#234A7A`, `#193A61`) and radii (6px, 10px, 14px) in `globals.css`. |
| `Tier 2.09` | Inter Font Loader Configuration | Verifies `next/font/google` loader for `Inter` in `src/app/layout.tsx`. |
| `Tier 2.10` | Responsive Breakpoints & Viewports | Checks presence of responsive Tailwind breakpoint classes for mobile/desktop layout adaptation. |

### Tier 3: Cross-Feature Combinations (7 Test Cases)
Validates interactions, cross-page routing, anchor targets, and parameter handling.

| Test ID | Test Name | Description & Invalidation Condition |
|---------|-----------|--------------------------------------|
| `Tier 3.01` | Section Anchor ID Targets | Verifies landing page elements define `id="about"`, `id="how-it-works"`, `id="for-lawyers"`. |
| `Tier 3.02` | Navbar Anchor Mapping | Verifies navbar links point to valid landing page section anchors. |
| `Tier 3.03` | Waitlist CTA Convergence | Verifies all primary CTAs across Landing page route directly to `/waitlist`. |
| `Tier 3.04` | Hero "Learn More" Anchor | Verifies "Learn More" links directly to `#how-it-works`. |
| `Tier 3.05` | Section 05 "I'm a Lawyer" CTA | Verifies "I'm a Lawyer" CTA routes to `/waitlist` with lawyer intent. |
| `Tier 3.06` | Waitlist Return Navigation | Verifies header / return link routes back to `/`. |
| `Tier 3.07` | Role Parameter Handling | Verifies `/waitlist?role=lawyer` renders without error. |

### Tier 4: Real-World Scenarios & Negative Brand Assertions (5 Test Cases)
Simulates end-to-end user journeys and enforces Section 26 Brand Prohibitions.

| Test ID | Test Name | Description & Invalidation Condition |
|---------|-----------|--------------------------------------|
| `Tier 4.01` | Full Consumer Discovery Journey | Discovery -> Reading Sections -> Navigating to /waitlist -> Submitting as individual -> Success confirmation. |
| `Tier 4.02` | Full Legal Professional Journey | Discovery -> "For Lawyers" -> Navigating to /waitlist -> Submitting as Lawyer -> Success confirmation. |
| `Tier 4.03` | Negative Assertion: Legal Tropes | Zero gavels, scales of justice, courtroom columns, or judge's bench imagery across source files. |
| `Tier 4.04` | Negative Assertion: Fake Social Proof | Zero fake statistics ("10,000+ lawyers", "99% success rate") and zero fake testimonials. |
| `Tier 4.05` | Negative Assertion: Luxury / AI Hype | Zero black/gold luxury law firm styles and zero purple AI startup gradient hype. |

---

## 3. Coverage Matrix

| Requirement Source | Requirement Key | Test Coverage IDs | Status |
|-------------------|-----------------|-------------------|--------|
| `ORIGINAL_REQUEST.md` | R1 (Landing Page 7 Sections) | `Tier 1.01` – `Tier 1.09`, `Tier 3.01`, `Tier 3.04` | Full Coverage |
| `ORIGINAL_REQUEST.md` | R2 (Waitlist & Coming Soon Page) | `Tier 1.12` – `Tier 1.15`, `Tier 2.01` – `Tier 2.06`, `Tier 3.06`, `Tier 3.07` | Full Coverage |
| `ORIGINAL_REQUEST.md` | R3 (Shared Navbar & Footer) | `Tier 1.10`, `Tier 1.11`, `Tier 3.02` | Full Coverage |
| `ORIGINAL_REQUEST.md` | R4 (Brand Fidelity & Inter Font) | `Tier 2.07` – `Tier 2.09`, `Tier 4.03` – `Tier 4.05` | Full Coverage |
| `ORIGINAL_REQUEST.md` | R5 (Build Quality & Zero Errors) | Validated via `npm run build`, `npm run lint`, `runner.mjs` | Full Coverage |
| `design.md` | §3, §6, §7 (Color Tokens, Radii, Shadows) | `Tier 1.09`, `Tier 2.08` | Full Coverage |
| `design.md` | §5 (Typography Scale) | `Tier 2.09` | Full Coverage |
| `design.md` | §8, §16 (Navbar, Footer) | `Tier 1.10`, `Tier 1.11`, `Tier 3.02` | Full Coverage |
| `design.md` | §9–§15 (Sections 1–7) | `Tier 1.02` – `Tier 1.09` | Full Coverage |
| `design.md` | §17–§20 (Waitlist Layout, Form, Success State) | `Tier 1.12` – `Tier 1.15`, `Tier 2.01` – `Tier 2.06`, `Tier 4.01`, `Tier 4.02` | Full Coverage |
| `design.md` | §26 (What NOT To Do / Prohibitions) | `Tier 2.07`, `Tier 4.03` – `Tier 4.05` | Full Coverage |

---

## 4. Test Runner CLI & Execution

### Basic Execution
```bash
# Run all tiers (auto-detects or manages dev server)
node tests/e2e/runner.mjs

# Run via npm script
npm test
npm run test:e2e
```

### Advanced Options
```bash
# Run specific tier(s)
node tests/e2e/runner.mjs --tier=1
node tests/e2e/runner.mjs --tier=1,2
node tests/e2e/runner.mjs --tier=4

# Target existing running server on custom port
node tests/e2e/runner.mjs --port=3000
node tests/e2e/runner.mjs --base-url=http://localhost:3000

# Verbose output with full error stack traces
node tests/e2e/runner.mjs --verbose

# Stop immediately on first failure
node tests/e2e/runner.mjs --bail

# Run static & boundary assertions without starting dev server
node tests/e2e/runner.mjs --tier=2 --no-server
```

### JSON Test Output
The runner writes full execution details and timing to:
```
tests/e2e/report.json
```
