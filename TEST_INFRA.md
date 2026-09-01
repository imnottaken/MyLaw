# E2E Test Infra: MyLaw Waitlist Redesign

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation internal state.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Interactions + Real-World Workload Testing.

## Feature Inventory
| # | Feature | Source | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|--------|:------:|:------:|:------:|:------:|
| 1 | Asymmetric Split Desktop Layout | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 2 | Mobile Responsive Stacking | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 3 | Atmospheric Depth & Gradient | ORIGINAL_REQUEST §R1, §R3 | 5 | 5 | ✓ | ✓ |
| 4 | Dedicated Navbar & Minimal Footer | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 5 | Brand Aesthetic Integrity (No Gavels/Scales) | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 6 | Cohesive Waitlist Input & Button (48-52px) | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| 7 | Custom Role Selectable Blocks | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| 8 | Client-Side Success State Transition | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| 9 | Snappy Micro-interactions & Arrow Motion | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ | ✓ |
| 10 | Landing Page Isolation & Integrity | ORIGINAL_REQUEST Acceptance | 5 | 5 | ✓ | ✓ |

## Test Architecture
- Test runner: `tests/e2e/runner.mjs` (invoked via `npm test`)
- Reports: `tests/e2e/report.json`
- Passing semantics: Exit code 0, 100% tests pass, zero errors.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | End-to-end user navigation from landing to waitlist, role selection, submission, success message verification | F1, F4, F6, F7, F8 | Medium |
| 2 | Mobile viewport rendering with direct URL query parameters (`?role=lawyer`) preselection and submission | F2, F7, F8, F9 | Medium |
| 3 | Accessibility & screen reader compatibility (form labels, ARIA live region, keyboard navigation) | F6, F7, F8 | Medium |
| 4 | Visual brand fidelity & negative scan (zero forbidden symbols, correct brand colors, typography watermarks) | F3, F5 | Medium |
| 5 | Landing page non-regression suite (verifying `/` sections, navbar, and CTA links remain unmodified) | F10 | Medium |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (boundary and corner cases)
- Tier 3: Pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
