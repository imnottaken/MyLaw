# MyLaw Test Infrastructure & Architecture Guide

## Overview

The MyLaw testing architecture is a zero-dependency, native Node.js ESM automated test suite (`tests/e2e/runner.mjs`). It provides deterministic, high-speed end-to-end (E2E), integration, static AST, and behavioral simulation testing without external framework bloat (e.g., Vitest, Jest, Playwright, or Cypress), ensuring zero version conflicts with Next.js 16 (Turbopack) and React 19.

---

## Directory Structure

```
tests/e2e/
├── helpers/
│   ├── assistant-simulator.mjs    # State machine simulation of the Assistant chatbot
│   ├── dom-parser.mjs             # Zero-dependency regex-based HTML/DOM parser
│   ├── dom-simulator.mjs          # Client-side form interaction & validation simulator
│   ├── http-client.mjs            # Server lifecycle management & HTTP page fetcher
│   └── source-scanner.mjs         # AST & regex static analyzers for brand, tokens, dark mode
├── runner.mjs                     # CLI runner supporting --tier, --port, --bail, --json
├── tier1-feature-coverage.test.mjs        # 33 tests: UI, UX, 24 Bar Councils, schemas
├── tier2-boundary-corner.test.mjs         # 23 tests: Edge cases, phone/email validation, duplicate 23505
├── tier3-cross-feature.test.mjs           # 11 tests: State retention, deep linking, responsive matrix
├── tier4-scenarios-negative.test.mjs      # 12 tests: Full user journeys, outage recovery, brand fidelity
└── report.json                    # Structured test results output
```

---

## Test Tier Hierarchy (79 Total Tests)

### Tier 1: Feature Coverage (33 Tests)
- **Chatbot & Assistant baseline**: Trigger button dimensions (48–56px), brand styling (`#172033`), tooltip ARIA contracts, panel header, 18 curated Q&As across 5 categories, 4 greetings, 5 initial questions, Q&A transitions, 2–3 follow-ups, back reset, zero free-text/AI guardrails, verbatim statutory disclaimer, and inline CTAs.
- **Landing page baseline**: All 7 editorial sections, hero dual CTAs, `/waitlist` baseline HTTP 200.
- **Waitlist default individual flow**: Email (`type="email"`), Mobile (`type="tel"`), CTA `[ Join the Waitlist → ]`, subtle link `"Are you a lawyer? →"`.
- **Inline expandable lawyer flow**: Expanding reveals State Bar Council dropdown and Enrollment Number input, CTA `[ Join as a Lawyer → ]`, secondary link `"← Back to regular waitlist"`.
- **24 Indian State Bar Councils catalog**: Exact catalog of all 24 state bar councils verified.
- **Submission contracts**:
  - Individual: `user_type: "individual"`, `mobile: string`, lawyer fields `null`.
  - Lawyer: `user_type: "lawyer"`, `mobile: string`, `bar_council_state: string`, `enrollment_number: string`, `verification_status: "pending"`.
- **API & Third-Party Schemas**: `POST /api/waitlist`, Google Sheets webhook, and Resend notification email structures.

### Tier 2: Boundary & Corner Cases (23 Tests)
- **Assistant Boundaries**: 50 open/close rapid toggle cycles, ESC dismissal in all states, multi-level follow-up traversal, invalid question IDs.
- **Design Tokens & Light Mode**: Strict light mode enforcement (0 `dark:` classes), exact CSS tokens (`#172033`, `#285A8E`, `#2F7C78`, `#F6F3EC`, `#F7F8FA`), Inter Latin font loading.
- **Form Validation**:
  - Missing/empty email and malformed email strings rejected.
  - Whitespace trimming and email normalization.
  - Missing/empty mobile and malformed mobile numbers rejected.
  - Valid Indian mobile number formats (+91, spaces, dashes, standard 10 digits) normalized.
  - Missing or invalid State Bar Council when `user_type === 'lawyer'` rejected.
  - Missing Enrollment Number when `user_type === 'lawyer'` rejected.
  - Optional/null lawyer fields when `user_type === 'individual'`.
- **Postgres Duplicate Handling**: Error code `23505` returns graceful HTTP 200 with `{ success: true, alreadyRegistered: true }`.
- **Extreme Strings & Rapid Submit**: 255+ character inputs, special characters, double-click debouncing.

### Tier 3: Cross-Feature Combinations (11 Tests)
- **Cross-Page State**: Assistant state persistence across `/` and `/waitlist`.
- **Inline CTA Routing**: Deep link navigation to `/waitlist` and `/waitlist?role=lawyer`.
- **Z-Index Layering**: Overlay z-index (`z-50`) above Navbar.
- **Mobile Fluid Margins**: Viewport styling `w-[calc(100vw-24px)]`.
- **Form State Preservation**: Filling email & mobile -> expanding to lawyer -> filling lawyer fields -> collapsing back to regular waitlist -> verifying email and mobile values are preserved!
- **Deep Linking Query Parameter**: `/waitlist?role=lawyer` auto-expands lawyer verification mode on initial mount; default `/waitlist` loads default individual mode.
- **Responsive Viewport Matrix**: 320px (iPhone SE), 375px (iPhone 13), 430px (iPhone Pro Max) full-width stacking and minimum 48px touch targets.
- **Navigation Return**: Header and success screen `"← Back to Home"` links return to `/`.

### Tier 4: Real-World Scenarios & Negative Assertions (12 Tests)
- **Scenario 1**: Full Consumer Journey (Landing -> Trigger -> Greeting -> Q&A -> Follow-up -> Back -> Dismiss).
- **Scenario 2**: Full Lawyer Onboarding & Verification Flow (Landing -> Assistant / Link -> `/waitlist?role=lawyer` -> Inline Form -> Bar Credentials -> Submit -> Pending Status).
- **Scenario 3**: Legal Advice Guardrail & Statutory Disclaimer Journey.
- **Scenario 4**: Keyboard-Only Accessibility & Focus Management (Enter, Tab, ESC).
- **Scenario 5**: Mobile Touch & Fluid Viewport.
- **Scenario 6**: Full Individual User Onboarding Journey (Landing -> Hero CTA -> `/waitlist` -> Email + Mobile -> Submit -> Confirmation -> Return to Home).
- **Scenario 7**: Duplicate User Re-Registration Flow (Existing email submits -> Friendly confirmation displayed).
- **Scenario 8**: Server Error Outage Recovery Flow (Server 500 error banner displays while preserving typed data for retry).
- **Negative Assertions & Brand Fidelity**: Zero gavels, zero scales of justice, zero courtroom tropes, zero fake statistics, zero fake testimonials, zero luxury gold / purple gradients, zero dynamic AI SDK calls.

---

## Execution Commands

### Run Full Test Suite
```bash
npm test
# or
node tests/e2e/runner.mjs
```

### Run Specific Tiers
```bash
node tests/e2e/runner.mjs --tier=1
node tests/e2e/runner.mjs --tier=1,2
node tests/e2e/runner.mjs --tier=3,4
```

### Options & Flags
- `--port=<port>`: Specify port for dev server (default: 3000).
- `--base-url=<url>`: Target an existing running server URL.
- `--no-server`: Run purely offline static/simulator tests without spawning Next.js.
- `--bail`: Stop execution immediately on the first test failure.
- `--verbose`: Print stack traces for failed tests.
- `--json`: Format output as JSON.
