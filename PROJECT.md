# Project: MyLaw Pre-Launch Website

## Architecture
- Framework: Next.js 16.3.3 (App Router with Turbopack), React 19.2.8, TypeScript 5, Tailwind CSS v4.
- Typography: Inter via `next/font/google`.
- Color Ratio & Theme: Strictly light mode (70% White `#FFFFFF`, 20% Soft Grey `#F7F8FA`, 8% Deep Navy `#234A7A`, 2% Accent `#193A61` / `#2F6F73`).
- Border Radii: 6px (`brand-sm`), 10px (`brand-md`), 14px (`brand-lg`).
- Shadow: Subtle `0 1px 3px rgba(16, 24, 40, 0.05)`.
- Transitions: 150–250ms smooth transitions.
- Navigation Architecture:
  - Sticky header (`Navbar.tsx`) with anchor links (`/#about`, `/#how-it-works`, `/#for-lawyers`) and primary action CTA (`/waitlist`).
  - Mobile hamburger drawer navigation.
  - Minimal brand footer (`Footer.tsx`).
- Core Routes:
  - `/` (Landing & About Page): Composed of 7 required sections with alternating backgrounds.
  - `/waitlist` (Coming Soon & Waitlist Page): Centered Apple-like minimal waitlist form with client-side state and success card.

## Code Layout
```
src/
├── app/
│   ├── layout.tsx                   # Root layout (Inter font, brand metadata, light-only wrapper)
│   ├── globals.css                  # Tailwind v4 @theme tokens, variables, no dark-mode overrides
│   ├── page.tsx                     # Landing page composed of 7 sections + Navbar + Footer
│   ├── waitlist/
│   │   └── page.tsx                 # Coming Soon / Waitlist page
│   └── favicon.ico
├── components/
│   ├── Navbar.tsx                   # Sticky responsive navbar with mobile drawer
│   ├── Footer.tsx                   # Minimal brand footer
│   ├── icons/
│   │   └── index.tsx                # Zero-dependency SVG icons (Check, ArrowRight, Menu, Close, Search, etc.)
│   ├── landing/
│   │   ├── HeroSection.tsx          # Section 01: Hero with Eyebrow, Headline, CTAs
│   │   ├── MockupPreview.tsx        # Section 01: Coded UI Mockup Panel
│   │   ├── ProblemSection.tsx       # Section 02: The Problem
│   │   ├── HowItWorksSection.tsx    # Section 03: 01/02/03 Step Editorial Sequence
│   │   ├── WhyMyLawSection.tsx      # Section 04: 4 Principles (Clarity, Choice, Trust, Accessibility)
│   │   ├── WhoItsForSection.tsx     # Section 05: For Individuals vs For Lawyers Comparison
│   │   ├── AboutSection.tsx         # Section 06: Grounded Mission Statement
│   │   └── FinalCtaSection.tsx      # Section 07: Closing Pre-Launch CTA
│   └── waitlist/
│       └── WaitlistForm.tsx         # Client component: email input, role radio, success state
tests/
└── e2e/                             # Opaque-box E2E test suite (Tiers 1-4, 37 automated tests)
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Tailwind v4 Theme Tokens | Custom colors (#FFFFFF, #F7F8FA, #172033, #667085, #E6E8EC, #234A7A, #193A61, #2F6F73), 6/10/14px radii, subtle shadows | M1 | design.md §3, §6, §7 |
| 2 | Inter Font & Typography Hierarchy | Google Font Inter loader configured via next/font/google across all routes | M1 | design.md §5, ORIGINAL_REQUEST.md R4 |
| 3 | Light-Mode Guarantee | Strict light-only theme with removal of dark mode CSS overrides | M1 | design.md §3, ORIGINAL_REQUEST.md AC |
| 4 | SVG Icon System | Lightweight, zero-runtime-overhead icons (Check, Menu, Close, ArrowRight, Search, Shield, Users, Sparkles) | M1 | explorer handoff, design.md §23 |
| 5 | Sticky Responsive Navbar | Desktop navigation links + "Join Waitlist" CTA button; mobile hamburger menu drawer toggle | M1 | design.md §8, ORIGINAL_REQUEST.md R3 |
| 6 | Global Minimal Footer | MyLaw wordmark, tagline, links (About, Privacy, Terms, Contact), copyright `© 2026 MyLaw. All rights reserved.` | M1 | design.md §16, ORIGINAL_REQUEST.md R3 |
| 7 | Section 01 Hero Eyebrow & Headline | "LEGAL HELP, SIMPLIFIED" eyebrow, "Finding the right lawyer shouldn't be difficult." headline, supporting copy | M2 | design.md §9, ORIGINAL_REQUEST.md R1 |
| 8 | Section 01 Dual CTAs | Primary "Join the Waitlist" (-> `/waitlist`) and Secondary "Learn More" (-> `#how-it-works`) | M2 | design.md §9, ORIGINAL_REQUEST.md AC |
| 9 | Section 01 Coded UI Mockup Panel | Minimal coded abstract product preview (Search bar, Practice area chips: Family Law, Property, Corporate, Criminal, match preview) — zero stock photos/gavels | M2 | design.md §9 Option A, ORIGINAL_REQUEST.md R1 |
| 10 | Section 02 The Problem | "Legal help can feel complicated before it even begins." headline + concise narrative over `#F7F8FA` | M2 | design.md §10 |
| 11 | Section 03 How It Works Sequence | "We're making the first step simpler." headline + 3 numbered editorial blocks (01/02/03) over `#FFFFFF` | M2 | design.md §11, ORIGINAL_REQUEST.md AC |
| 12 | Section 04 Why MyLaw Principles | 4 value cards (Clarity, Choice, Trust, Accessibility) with clean stroke icons over `#F7F8FA` | M2 | design.md §12 |
| 13 | Section 05 Who It's For Dual Split | Side-by-side comparison panels for "For Individuals" and "For Lawyers" with dedicated CTAs over `#FFFFFF` | M2 | design.md §13, ORIGINAL_REQUEST.md AC |
| 14 | Section 06 About MyLaw Mission | Grounded company mission narrative without corporate buzzwords or fake stats over `#F7F8FA` | M2 | design.md §14, §26 |
| 15 | Section 07 Final Pre-Launch CTA | "Be among the first to experience MyLaw." headline + copy + "Join the Waitlist" CTA button over `#F7F8FA` | M2 | design.md §15 |
| 16 | Section Background Alternation | Strict alternating rhythm of `#FFFFFF` and `#F7F8FA` across 7 sections | M2 | design.md §3, §25, ORIGINAL_REQUEST.md AC |
| 17 | Waitlist Centered Layout | Apple-like centered minimal container with generous whitespace on `/waitlist` | M3 | design.md §17, ORIGINAL_REQUEST.md R2 |
| 18 | Waitlist Eyebrow & Headline | "COMING SOON" eyebrow badge + "Legal help, made simpler." + subtitle | M3 | design.md §17 |
| 19 | Waitlist Email Input | Single email input with `type="email"` and `required` constraint validation | M3 | design.md §19, ORIGINAL_REQUEST.md R2 |
| 20 | Waitlist Role Radio Selector | Optional "I am a:" selector ("Looking for legal help" / "Lawyer") | M3 | design.md §19, ORIGINAL_REQUEST.md R2 |
| 21 | Waitlist Submit Button & Microcopy | "Join the Waitlist" deep navy button + "No spam. Just launch updates." microcopy | M3 | design.md §19 |
| 22 | Waitlist Client Success State | Smooth 150-250ms fade transition to "You're on the list. Thanks for joining MyLaw. We'll let you know when we're ready." with checkmark icon | M3 | design.md §20, ORIGINAL_REQUEST.md R2 |
| 23 | Brand Prohibitions (Section 26) | Zero gavels/scales, zero dark-mode artifacts, zero fake stats/testimonials, no heavy shadows | M1, M2, M3 | design.md §26, ORIGINAL_REQUEST.md R4 |
| 24 | Build & Lint Quality | Zero compilation errors on `npm run build`, clean `npm run lint` | M1, M2, M3, M4 | ORIGINAL_REQUEST.md R5 |
| 25 | E2E Testing Suite (Tiers 1-4) | Opaque-box automated test suite validating all user requirements and edge cases | M_E2E | ORIGINAL_REQUEST.md Verification |
| 26 | Adversarial Hardening & Final Gate | 100% test pass rate + adversarial challenge + forensic integrity audit | M4 | ORIGINAL_REQUEST.md Verification |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design Tokens, Global Styles & Shared Layout | `globals.css`, `layout.tsx`, `Navbar.tsx`, `Footer.tsx`, `icons/` | none | DONE |
| M2 | Landing Page (`/`) with 7 Sections & Mockup | `page.tsx`, `landing/*` (Sections 1-7, MockupPreview) | M1 | DONE |
| M3 | Waitlist / Coming Soon Page (`/waitlist`) | `waitlist/page.tsx`, `WaitlistForm.tsx` | M1 | DONE |
| M_E2E | E2E Testing Track | Requirement-driven test suite (Tiers 1-4) -> `TEST_READY.md` | none (Parallel) | DONE |
| M4 | Final Acceptance & Adversarial Hardening | Pass 100% E2E tests (Tiers 1-4) + Tier 5 Adversarial Coverage Hardening & Forensic Audit | M2, M3, M_E2E | DONE |

## Interface Contracts
### Theme & Layout Contract
- `src/app/globals.css` exposes Tailwind CSS `@theme` variables: `--font-sans`, `--color-brand-bg`, `--color-brand-bg-soft`, `--color-brand-surface`, `--color-brand-text-primary`, `--color-brand-text-secondary`, `--color-brand-border`, `--color-brand-accent`, `--color-brand-accent-hover`, `--color-brand-accent-teal`, `--radius-brand-sm` (6px), `--radius-brand-md` (10px), `--radius-brand-lg` (14px).
- `src/app/layout.tsx` configures Inter font variable `--font-inter` and wraps children with `<body className="bg-white text-[#172033] font-sans antialiased min-h-screen">`.

### Navbar Contract (`src/components/Navbar.tsx`)
- Exports `default function Navbar()`:
  - Sticky header (`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E8EC]`).
  - Desktop nav links: `/#about`, `/#how-it-works`, `/#for-lawyers`.
  - CTA Button: Link to `/waitlist` styled with `bg-[#234A7A] hover:bg-[#193A61] text-white rounded-[6px]`.
  - Mobile hamburger toggle button with responsive dropdown.

### Footer Contract (`src/components/Footer.tsx`)
- Exports `default function Footer()`:
  - Background `#F7F8FA`, border-t `#E6E8EC`.
  - Brand wordmark "MyLaw" + tagline.
  - Links: About, Privacy, Terms, Contact.
  - Copyright: `© 2026 MyLaw. All rights reserved.`.

### Waitlist Form Contract (`src/components/waitlist/WaitlistForm.tsx`)
- Client component (`"use client"`).
- Handles input state (`email`, optional `role`), form submission with HTML5 constraint validation, and smooth transition to success card (`You're on the list. Thanks for joining MyLaw. We'll let you know when we're ready.`).
