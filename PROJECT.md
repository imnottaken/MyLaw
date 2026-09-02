# Project: MyLaw Waitlist UX Overhaul & Verification System

## Architecture
- **Framework**: Next.js 16.3.3 (App Router, Turbopack, React 19, TypeScript).
- **Styling**: Tailwind CSS v4, Inter font, custom legal-tech brand design tokens (`#172033` Deep Navy, `#285A8E` Blue, `#2F7C78` Muted Teal, `#F6F3EC` Warm Off-white, `#F7F8FA` Soft Grey).
- **Data Layer**: Supabase PostgreSQL (`public.waitlist` table) via `@supabase/supabase-js`.
- **Integrations**: Resend API (welcome & admin notification emails) + Google Apps Script Webhook (Google Sheets sync).
- **Testing Architecture**: Custom ESM Test Runner (`tests/e2e/runner.mjs`) supporting 4 Tiers + Adversarial Tier 5.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Supabase Migration | Safely add `user_type`, `mobile`, `bar_council_state`, `enrollment_number`, `verification_status` columns to `public.waitlist` with safe backfill | M1 | ORIGINAL_REQUEST.md §R3 |
| 2 | Backend API Validation & Ingestion | Parse and validate email, mobile, user_type ('individual' vs 'lawyer'), bar_council_state, enrollment_number in `src/app/api/waitlist/route.ts` | M2 | ORIGINAL_REQUEST.md §R3 |
| 3 | Graceful Duplicate Handling | Handle Postgres unique email violation (code `23505`) with friendly `{ success: true, alreadyRegistered: true }` | M2 | ORIGINAL_REQUEST.md §R3 |
| 4 | Resend Email Integration Update | Update confirmation and admin email payloads to include mobile and lawyer bar verification details | M2 | ORIGINAL_REQUEST.md §R3 |
| 5 | Google Sheets Webhook Sync | Update Google Sheets webhook POST payload to include mobile, user_type, bar_council_state, enrollment_number | M2 | ORIGINAL_REQUEST.md §R3 |
| 6 | Default Individual Waitlist Form | Render Email (type="email") + Mobile (type="tel") with CTA `[ Join the Waitlist → ]` and subtle secondary link "Are you a lawyer? →" | M3 | ORIGINAL_REQUEST.md §R1 |
| 7 | Smooth Inline Lawyer Verification Flow | Expand inline without page reload, revealing 24 Indian State Bar Councils dropdown + Enrollment Number ("e.g. D/1234/2020") + CTA `[ Join as a Lawyer → ]` | M3 | ORIGINAL_REQUEST.md §R2 |
| 8 | Clean Collapse & State Retention | Secondary back link "← Back to regular waitlist" collapses smoothly while preserving entered email and mobile values | M3 | ORIGINAL_REQUEST.md §R2 |
| 9 | 24 Indian State Bar Councils | Exact catalog of all 24 Indian State Bar Councils included in dropdown | M3 | ORIGINAL_REQUEST.md §R2 |
| 10 | Visual & Responsive Polish | Dark navy glassmorphism card aesthetic, <=250ms transitions, responsive across 320px–430px mobile and desktop | M3 | ORIGINAL_REQUEST.md §R4 |
| 11 | Comprehensive 4-Tier Test Suite | Requirement-driven test suite (Tier 1 Feature Coverage, Tier 2 Boundaries, Tier 3 Cross-Feature, Tier 4 Workloads) | E2E-Test-Track | ORIGINAL_REQUEST.md Acceptance Criteria |
| 12 | Tier 5 Adversarial Hardening | White-box stress-testing, fuzzing, and Forensic Integrity Audit | M-Final | Orchestrator Protocol |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E-Test-Track | E2E Testing Suite Track | Design and publish comprehensive 4-Tier test suite producing `TEST_READY.md` | none | DONE |
| M1 | Database Schema & Supabase Migration | Apply nullable column migrations and backfill to Supabase `waitlist` table | none | DONE |
| M2 | Backend API & Integrations | Update `src/app/api/waitlist/route.ts` with validation, duplicate handling, Resend, and Google Sheets sync | M1 | DONE |
| M3 | Frontend Form UX & Responsive Polish | Refactor `WaitlistForm.tsx` & `page.tsx` with default individual flow, inline lawyer expansion, 24 bar councils, state preservation, and 320px-430px polish | M2 | DONE |
| M-Final | Final Acceptance & Adversarial Hardening | 100% E2E test suite pass + Tier 5 Adversarial Coverage Hardening + Forensic Integrity Audit | E2E-Test-Track, M3 | DONE |

## Interface Contracts

### Frontend ↔ Backend (`POST /api/waitlist`)
**Request Body**:
```json
{
  "email": "string (valid email format, required)",
  "mobile": "string (valid phone number, required)",
  "user_type": "'individual' | 'lawyer' (required, defaults to 'individual')",
  "bar_council_state": "string (required if user_type === 'lawyer', null if 'individual')",
  "enrollment_number": "string (required if user_type === 'lawyer', null if 'individual')",
  "source": "string (optional, e.g. 'waitlist_page')"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "user_type": "string",
    "mobile": "string",
    "bar_council_state": "string | null",
    "enrollment_number": "string | null",
    "verification_status": "string"
  }
}
```

**Duplicate Response (200 OK - Postgres 23505)**:
```json
{
  "success": true,
  "alreadyRegistered": true,
  "message": "You're already on the waitlist! We'll keep you updated."
}
```

**Error Response (400 Bad Request)**:
```json
{
  "error": "Descriptive error message"
}
```

## Code Layout
- `src/app/waitlist/page.tsx` — Waitlist route page & container
- `src/components/waitlist/WaitlistForm.tsx` — Waitlist form with Individual/Lawyer toggle, inputs, and validation
- `src/app/api/waitlist/route.ts` — API route handler for waitlist submissions
- `src/lib/constants.ts` — 24 Indian State Bar Councils catalog
- `src/lib/supabase.ts` — Typed Supabase client
- `supabase/migrations/20260902175628_add_waitlist_lawyer_fields.sql` — Database migration
- `src/types/database.types.ts` — Supabase TypeScript schema definitions
- `src/app/globals.css` — Global design tokens and styles
- `tests/e2e/runner.mjs` — E2E test runner
- `tests/e2e/tier1-feature-coverage.test.mjs` — Tier 1 Feature Coverage test suite (33 tests)
- `tests/e2e/tier2-boundary-corner.test.mjs` — Tier 2 Boundary & Corner Cases test suite (23 tests)
- `tests/e2e/tier3-cross-feature.test.mjs` — Tier 3 Cross-Feature Interactions test suite (11 tests)
- `tests/e2e/tier4-application-scenarios.test.mjs` — Tier 4 Real-World Application Scenarios test suite (12 tests)
- `tests/challenger_stress_waitlist.mjs` — Challenger 1 stress harness (16 tests)
- `tests/challenger_ui_matrix.mjs` — Challenger 2 UI matrix harness (27 tests)
