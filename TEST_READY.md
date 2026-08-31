# Test Suite Readiness Declaration: MyLaw Pre-Launch Web Platform

- **Status**: **TEST SUITE READY & VALIDATED**
- **Test Framework**: Automated Opaque-Box Native Test Suite (`node:test`, custom DOM engine, HTTP client, static code/token validator)
- **Harness Entrypoint**: `tests/e2e/runner.mjs`
- **Total Test Cases**: **37 Automated Tests**
- **Execution Command**: `node tests/e2e/runner.mjs` or `npm test`

---

## 1. Test Suite Architecture & File Inventory

| Test File | Tier / Scope | Tests | Coverage Areas |
|-----------|--------------|-------|----------------|
| `tests/e2e/tier1-feature-coverage.test.mjs` | Tier 1: Feature Coverage | 15 | Landing 7 sections, Hero eyebrow/headline/CTAs/mockup, Section 02 Problem, Section 03 Steps (01/02/03), Section 04 Principles (Clarity, Choice, Trust, Accessibility), Section 05 Dual Panels, Section 06 Mission, Section 07 Final CTA, Background rhythm (`#FFFFFF`/`#F7F8FA`), Sticky Navbar, Footer (`© 2026 MyLaw. All rights reserved.`), Waitlist layout, Email input (`type="email"`, `required`), Role radio, Submit button. |
| `tests/e2e/tier2-boundary-corner.test.mjs` | Tier 2: Boundary & Corner Cases | 10 | Empty email rejection, malformed emails rejection, whitespace trimming/sanitization, optional role omitted submission, role selection persistence, rapid double submission idempotency, light-mode enforcement (zero dark-mode media rules in `globals.css`), design token validation, Inter font loader, responsive breakpoint classes. |
| `tests/e2e/tier3-cross-feature.test.mjs` | Tier 3: Cross-Feature Combinations | 7 | Landing section ID targets (`#about`, `#how-it-works`, `#for-lawyers`), Navbar anchor mapping, CTA to `/waitlist` convergence, Hero "Learn More" to `#how-it-works`, Section 05 "I'm a Lawyer" CTA routing, Waitlist home return navigation, Role query parameter (`/waitlist?role=lawyer`). |
| `tests/e2e/tier4-scenarios-negative.test.mjs` | Tier 4: Real-World Journeys & Negative Assertions | 5 | End-to-end consumer discovery & waitlist submission journey, end-to-end lawyer discovery & waitlist submission journey, negative assertion against gavels/scales/courtroom tropes, negative assertion against fake stats/testimonials, negative assertion against luxury black/gold and purple AI hype. |

---

## 2. Test Helpers & Harness Components

- **`tests/e2e/helpers/http-client.mjs`**: Server lifecycle controller (auto-detects / auto-spawns Next.js dev server on port 3000/custom port) and HTTP request executor with timeout and signal handling.
- **`tests/e2e/helpers/dom-parser.mjs`**: Zero-dependency HTML parser converting SSR output into a traversable DOM tree supporting `querySelector`, `querySelectorAll`, attributes, and text matching.
- **`tests/e2e/helpers/dom-simulator.mjs`**: Form state simulator modeling input sanitization, HTML5 constraint validation, role toggling, and asynchronous success state transition.
- **`tests/e2e/helpers/source-scanner.mjs`**: Static code analysis engine verifying design token definitions, light-mode compliance, Inter font integration, and Section 26 brand prohibitions.

---

## 3. How to Run the Tests

```bash
# Run the complete test suite
node tests/e2e/runner.mjs

# Or using npm
npm test

# Run individual tier
node tests/e2e/runner.mjs --tier=1
node tests/e2e/runner.mjs --tier=2
node tests/e2e/runner.mjs --tier=3
node tests/e2e/runner.mjs --tier=4

# Run against existing server on port 3000
node tests/e2e/runner.mjs --base-url=http://localhost:3000
```

---

## 4. Verification Output Summary

- Structured color-coded terminal output with pass/fail icons, duration per test, tier subtotals, and total summary.
- Comprehensive JSON test report generated automatically at `tests/e2e/report.json`.
- Strict exit codes: `0` on 100% test pass, `1` on any failure.
