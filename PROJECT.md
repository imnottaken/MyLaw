# Project: MyLaw Waitlist / Coming Soon Page Redesign

## Architecture
- Framework: Next.js 16.3.3 (App Router) + React 19.2.8 + TypeScript strict + Tailwind CSS v4.
- Target Pages / Routes:
  - `/waitlist` (`src/app/waitlist/page.tsx`): Dedicated coming soon / waitlist page with asymmetric desktop split layout, atmospheric gradient, subtle editorial watermarks and lines, dedicated navbar, and minimal footer.
  - Form Component (`src/components/waitlist/WaitlistForm.tsx`): Cohesive input + button, custom selectable role blocks, client-side validation and smooth 150-300ms success transition.
- Untouched Boundary:
  - Landing page (`src/app/page.tsx`, `src/components/landing/*`, `src/components/Navbar.tsx`) must remain completely untouched.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Asymmetric Split Desktop Layout | Left side hero text (eyebrow, headline, statement, watermark), right side waitlist form panel (R1) | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Mobile Responsive Stacking | Natural column stacking on mobile without excessive vertical gaps (R1) | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Atmospheric Depth & Gradient | Soft background gradient/tint (`#F7F8FA` to `#FFFFFF`), faint grid SVG, oversized "MYLAW" typography & translucent "01" (R1, R3) | M1 | ORIGINAL_REQUEST §R1, §R3 |
| 4 | Dedicated Navbar & Minimal Footer | Logo + "← Back to Home" navbar; Minimal footer with brand, Privacy, Terms, Contact links & copyright (R2) | M1 | ORIGINAL_REQUEST §R2 |
| 5 | Brand Aesthetic Integrity | Editorial legal-tech design, zero gavels, zero scales, zero AI illustrations, exact brand palette `#172033`, `#285A8E`, `#FFFFFF`, `#F7F8FA` (R3) | M1, M2 | ORIGINAL_REQUEST §R3 |
| 6 | Cohesive Waitlist Input & Button | 48-52px height, 8-10px radius, clean focus ring, cohesive styling (R4) | M2 | ORIGINAL_REQUEST §R4 |
| 7 | Custom Role Selectable Blocks | Custom UI blocks for `[Looking for legal help]` and `[Lawyer]` replacing default OS radio circles (R4) | M2 | ORIGINAL_REQUEST §R4 |
| 8 | Client-Side Success State Transition | Valid email triggers 150-300ms smooth client-side transition to "You're on the list." without backend hit (R4) | M2 | ORIGINAL_REQUEST §R4 |
| 9 | Snappy Micro-interactions & Arrow Motion | 150-300ms transitions, button arrow 3-4px hover translation, zero parallax/bouncing/cursor effects (R5) | M2 | ORIGINAL_REQUEST §R5 |
| 10 | E2E 4-Tier Test Suite | Complete opaque-box verification across Tiers 1-4 passing 100% | M3 | ORIGINAL_REQUEST Acceptance Criteria |
| 11 | Adversarial Coverage Hardening | Tier 5 adversarial testing, static analysis, zero integrity violations, clean audit | M4 | ORIGINAL_REQUEST Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Waitlist Page Layout, Atmospheric Styling & Navigation | `src/app/waitlist/page.tsx` | none | PLANNED |
| M2 | WaitlistForm Component, Block Selectors & Micro-Interactions | `src/components/waitlist/WaitlistForm.tsx` | M1 | PLANNED |
| M3 | E2E Test Suite Alignment & Verification (Tiers 1-4) | `tests/e2e/*` | M1, M2 | PLANNED |
| M4 | Adversarial Hardening (Tier 5), Audit & Build Verification | Full project verification & audit | M3 | PLANNED |

## Code Layout
- `src/app/waitlist/page.tsx`: Owned by M1 Worker
- `src/components/waitlist/WaitlistForm.tsx`: Owned by M2 Worker
- `tests/e2e/*`: Owned by M3/M4 Test Writer & Challenger
- `src/app/page.tsx`, `src/components/landing/*`: UNTOUCHED / READ-ONLY

## Interface Contracts
### `WaitlistForm.tsx` ↔ `page.tsx`
- Component export: `export default function WaitlistForm()` (or `export function WaitlistForm()`).
- Props: none.
- Behavior: Self-contained client component (`"use client"`) wrapped in `<Suspense>`.
- Preserves search param query handling (`?role=help` or `?role=lawyer`).
- Semantic accessibility: `role="status"` and `aria-live="polite"` on success container.
