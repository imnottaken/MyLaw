# E2E Test Infra: MyLaw Assistant Chatbot

## Test Philosophy
- Opaque-box, requirement-driven. Derived from `ORIGINAL_REQUEST.md` and user-facing specifications.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Interaction Testing + Real-World Workload Scenarios.
- Native Node.js ESM harness executing in <3 seconds without heavy external browser dependencies.

## Feature Inventory
| # | Feature | Source | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Scenario) |
|---|---|---|:---:|:---:|:---:|:---:|
| 1 | `CHAT-TRIGGER` (48-56px button, tooltip, brand styling) | ORIGINAL_REQUEST §R1 | 5 | 3 | 2 | 2 |
| 2 | `CHAT-PANEL` (360-400px panel, header "MyLaw ● Assistant", close) | ORIGINAL_REQUEST §R1 | 5 | 3 | 2 | 1 |
| 3 | `CHAT-KB-SCOPE` (15-20 items across 5 categories) | ORIGINAL_REQUEST §R2 | 5 | 3 | 1 | 1 |
| 4 | `CHAT-GREETING` (Random intro greeting on open) | ORIGINAL_REQUEST §R2 | 3 | 2 | 1 | 1 |
| 5 | `CHAT-INITIAL-Q` (5 initial question bubbles with chevrons) | ORIGINAL_REQUEST §R2 | 4 | 2 | 1 | 2 |
| 6 | `CHAT-QA-FLOW` (User bubble -> smooth transition -> Assistant answer) | ORIGINAL_REQUEST §R2 | 5 | 3 | 2 | 3 |
| 7 | `CHAT-FOLLOWUP` (2-3 follow-ups + "← Back to questions") | ORIGINAL_REQUEST §R2 | 4 | 3 | 2 | 2 |
| 8 | `CHAT-GUARDRAILS` (No free-text input, no dynamic AI generation) | ORIGINAL_REQUEST §R2 | 3 | 3 | 1 | 2 |
| 9 | `CHAT-DISCLAIMER` (Exact legal advice disclaimer & footer) | ORIGINAL_REQUEST §R2 | 3 | 3 | 1 | 2 |
| 10 | `CHAT-WAITLIST-CTA` (Inline CTA button -> /waitlist, no duplicate form) | ORIGINAL_REQUEST §R3 | 4 | 2 | 3 | 2 |
| 11 | `CHAT-A11Y-POLISH` (ESC key, Tab focus, ARIA, mobile responsiveness) | ORIGINAL_REQUEST §R4 | 5 | 4 | 3 | 2 |
| 12 | `CHAT-LAYOUT-INTEGR` (Non-destructive global layout in layout.tsx) | ORIGINAL_REQUEST §R4 | 3 | 2 | 3 | 2 |

## Test Architecture
- **Master Runner**: `tests/e2e/runner.mjs` (invoked via `node tests/e2e/runner.mjs` or `npm test`)
- **Helper Modules**:
  - `tests/e2e/helpers/assistant-simulator.mjs`: High-fidelity state machine and conversation simulator.
  - `tests/e2e/helpers/source-scanner.mjs`: AST/regex scanner for tokens, negative assertions (no dark:, no dynamic AI, no free-text input, disclaimer text verification).
  - `tests/e2e/helpers/dom-parser.mjs`: Fast HTML parser.
  - `tests/e2e/helpers/http-client.mjs`: Live HTTP server runner.
- **Tier Files**:
  - `tests/e2e/tier1-feature-coverage.test.mjs`: Tiers 1 tests for all features.
  - `tests/e2e/tier2-boundary-corner.test.mjs`: Boundary, edge cases, debounce, ESC key, negative assertions.
  - `tests/e2e/tier3-cross-feature.test.mjs`: Route navigation, z-index layering, mobile breakpoints.
  - `tests/e2e/tier4-scenarios-negative.test.mjs`: 5 realistic multi-step user journeys & guardrails.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|---|---|---|
| 1 | Consumer Discovery & Clarity Journey | Trigger, Tooltip, Panel, Greeting, Q&A, Follow-ups, Back to questions, Close | High |
| 2 | Lawyer Onboarding & Waitlist Conversion | Trigger, Q&A, Inline CTA, Route to `/waitlist?role=lawyer`, Waitlist form submission | High |
| 3 | Legal Advice Guardrail & Disclaimer | Trigger, Legal query selection, Exact disclaimer verification, No AI calls | Medium |
| 4 | Keyboard-Only Accessibility & Focus | Tab navigation, Enter to open, Space to select, ESC to dismiss & focus restore | Medium |
| 5 | Mobile Viewport Touch & Dismiss | Mobile layout, No overflow, Responsive padding, Close button | Medium |

## Coverage Thresholds
- Tier 1: ≥5 per feature (~50 tests)
- Tier 2: ≥3-5 per feature (~30 tests)
- Tier 3: Pairwise coverage of route, layering, and viewport combinations (~15 tests)
- Tier 4: 5 realistic application-level scenarios
- Total: 100+ assertions verifying 100% of acceptance criteria
