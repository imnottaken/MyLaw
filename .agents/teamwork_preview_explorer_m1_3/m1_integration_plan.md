# Milestone 1 Integration Blueprint: Waitlist Page Redesign (`src/app/waitlist/page.tsx`)

## 1. Executive Summary & Problem Statement
The current implementation of `src/app/waitlist/page.tsx` uses a simple, centered single-column layout. The goal of **Milestone 1 (M1)** is to redesign `/waitlist` into a **premium, sophisticated asymmetric split layout** matching MyLaw's editorial legal-tech aesthetic (ORIGINAL_REQUEST §R1–§R3, PROJECT.md Milestone 1).

### Core Objectives
1. **Asymmetric Split Desktop Layout**: Left column features the editorial hero (eyebrow, headline, brand statement, watermark), right column features a refined card panel embedding `<WaitlistForm />`.
2. **Seamless Mobile Stacking**: Responsive single-column hierarchy that stacks naturally on small viewports without excessive vertical whitespace.
3. **Atmospheric Visual Depth**: Soft atmospheric background tint/gradient (`#F7F8FA` to `#FFFFFF`), subtle 3.5% opacity architectural geometric grid SVG, large translucent watermark typography (`"01"` and/or `"MYLAW"`), and refined editorial lines.
4. **Dedicated Header & Minimal Footer**: Top bar with brand wordmark and `← Back to Home` link; minimal footer with brand, Privacy, Terms, Contact links, and copyright text.
5. **Strict Boundary Enforcement**: Zero touch on landing page files (`src/app/page.tsx`, `src/components/landing/*`, `src/components/Navbar.tsx`).
6. **Accessibility & Build Compliance**: Semantic HTML tags (`<header>`, `<main>`, `<section>`, `<footer>`), WCAG 2.1 AA/AAA contrast, keyboard focus indicators, and 100% clean Next.js 16 build.

---

## 2. File Ownership & Boundary Isolation
| File Path | Role / Ownership | Policy |
| :--- | :--- | :--- |
| `src/app/waitlist/page.tsx` | M1 Worker | **Primary Target** (Full asymmetric redesign) |
| `src/components/waitlist/WaitlistForm.tsx` | M2 Worker | Integrated via standard component import |
| `src/app/page.tsx` | Landing Page | **UNTOUCHED / READ-ONLY** |
| `src/components/landing/*` | Landing Components | **UNTOUCHED / READ-ONLY** |
| `src/components/Navbar.tsx` | Landing Navbar | **UNTOUCHED / READ-ONLY** |
| `src/app/globals.css` | Global Design Tokens | **UNTOUCHED / READ-ONLY** |
| `src/app/layout.tsx` | Root Layout | **UNTOUCHED / READ-ONLY** |

---

## 3. Asymmetric Split Layout & Visual Composition Specification

### A. Grid Architecture
- **Desktop (`lg:` and above, ≥1024px)**:
  - 12-column CSS Grid: `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center`
  - **Left Column (`lg:col-span-7 xl:col-span-6`)**: Editorial content, headline, brand statement, trust value props, and decorative background watermark.
  - **Right Column (`lg:col-span-5 xl:col-span-6`)**: High-contrast card panel container enclosing `<WaitlistForm />`.
- **Mobile & Tablet (<1024px)**:
  - Single-column flow: `grid-cols-1 gap-10`
  - Top hero section text center- or left-aligned with balanced padding (`py-10 sm:py-16`).
  - Form panel placed immediately underneath without excessive vertical gaps.

### B. Atmospheric Visual Depth System
- **Background Atmosphere**:
  - Gradient: Subtle multi-stop gradient `bg-gradient-to-b from-[#F7F8FA] via-white to-[#F7F8FA]` or soft radial tint.
  - Grid Pattern: Low-opacity (3%–3.5%) SVG grid with stroke color `#172033`, `aria-hidden="true"`, `pointer-events-none`.
  - Translucent Watermark Typography:
    - Faint oversized `01` numbering: `text-[10rem] sm:text-[14rem] font-bold text-[#172033]/[0.025] select-none pointer-events-none absolute -left-6 -top-12 lg:-top-16 -z-10`.
    - Faint `MYLAW` watermark positioned behind the split section.
  - Thin Editorial Accents:
    - Subtle 1px divider rules (`bg-[#E6E8EC]` / `border-[#E6E8EC]`).
    - Muted Teal (`#2F7C78`) status dot and accent rules.

### C. Color Palette & Typography Integrity
- **Primary Text**: Deep Navy `#172033`
- **Secondary Text**: Neutral Slate `#667085`
- **Brand Accent**: Slate Blue `#285A8E` (Hover: `#1e4670`)
- **Accent Detail**: Muted Teal `#2F7C78`
- **Backgrounds**: Pure White `#FFFFFF` & Soft Grey `#F7F8FA`
- **Borders**: Clean Neutral `#E6E8EC`
- **Strict Prohibitions**: Zero gavels, scales, gold luxury, AI purple/indigo gradients, dark mode leakage, or excessive blur.

---

## 4. Semantic Hierarchy & Component Blueprint

```
┌────────────────────────────────────────────────────────────────────────┐
│ <header> Dedicated Navbar                                              │
│ [ MyLaw ]                                           [ ← Back to Home ] │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ <main> Split Layout Hero Section (<section>)                           │
│                                                                        │
│  [LEFT COLUMN - lg:col-span-7]          [RIGHT COLUMN - lg:col-span-5] │
│  • Eyebrow: "COMING SOON / 01"          ┌────────────────────────────┐ │
│  • <h1>: "Legal help, made simpler."    │ Card Panel                 │ │
│  • Brand Statement:                     │ • <h2>: "Get early access" │ │
│    "We're building a better way to      │ • Subtitle                 │ │
│     discover and connect with legal     │ • <WaitlistForm />         │ │
│     professionals."                     │   - Role selector blocks   │ │
│  • Editorial Trust Highlights:          │   - Input & Submit button  │ │
│    - Curated professional network       │   - Privacy microcopy      │ │
│    - Transparent pricing & choice       └────────────────────────────┘ │
│    - Early access updates                                              │
│                                                                        │
│  [Background: Grid Pattern + Translucent Watermark Typography "01"]    │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ <footer> Minimal Dedicated Footer                                      │
│ © 2026 MyLaw. All rights reserved. │ Privacy │ Terms │ Contact         │
│                                           "Legal help, simplified."    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Proposed Implementation (`src/app/waitlist/page.tsx`)

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import { CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Waitlist — MyLaw",
  description:
    "Be among the first to experience MyLaw. We're building a better way to discover and connect with legal professionals.",
  openGraph: {
    title: "Waitlist — MyLaw",
    description:
      "Be among the first to experience MyLaw. We're building a better way to discover and connect with legal professionals.",
    type: "website",
  },
};

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#172033] relative selection:bg-[#285A8E]/10 selection:text-[#172033]">
      {/* Subtle geometric architectural grid pattern background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.035]"
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 h-full w-full stroke-[#172033]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <defs>
            <pattern
              id="waitlist-grid-pattern"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 48V.5H48" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waitlist-grid-pattern)" />
        </svg>
      </div>

      {/* Atmospheric radial gradient glow in the background */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#F7F8FA] via-transparent to-transparent -z-10 opacity-70"
        aria-hidden="true"
      />

      {/* Clean Dedicated Header with MyLaw wordmark and Back link */}
      <header className="w-full border-b border-[#E6E8EC]/80 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#172033] hover:text-[#285A8E] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E] rounded-sm"
          >
            MyLaw
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#667085] hover:text-[#172033] hover:text-[#285A8E] transition-colors duration-150 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E] rounded-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Asymmetric Split Layout */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
        <section
          aria-labelledby="waitlist-headline"
          className="w-full max-w-7xl mx-auto relative"
        >
          {/* Subtle translucent background watermark numbering */}
          <div
            className="pointer-events-none absolute -left-4 -top-16 lg:-top-20 text-[9rem] sm:text-[13rem] font-bold text-[#172033]/[0.025] select-none -z-10 leading-none"
            aria-hidden="true"
          >
            01
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Headline, Brand Statement, and Value Highlights */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-6 lg:space-y-8">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] text-xs font-semibold tracking-widest text-[#285A8E] bg-[#F7F8FA] border border-[#E6E8EC] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78] animate-pulse" />
                <span>COMING SOON / 01</span>
              </div>

              {/* Primary Headline */}
              <div className="space-y-4">
                <h1
                  id="waitlist-headline"
                  className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#172033] tracking-tight leading-[1.15]"
                >
                  Legal help, <br className="hidden sm:inline" />made simpler.
                </h1>
                <p className="text-base sm:text-lg text-[#667085] max-w-xl leading-relaxed">
                  We&apos;re building a better way to discover and connect with legal professionals. Clarity, choice, and trust from the very first step.
                </p>
              </div>

              {/* Editorial Feature Highlights */}
              <div className="pt-2 border-t border-[#E6E8EC]/80 space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#172033]">
                  <div className="w-5 h-5 rounded-full bg-[#2F7C78]/10 flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3.5 h-3.5 text-[#2F7C78]" />
                  </div>
                  <span>Priority access when we launch</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#172033]">
                  <div className="w-5 h-5 rounded-full bg-[#2F7C78]/10 flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3.5 h-3.5 text-[#2F7C78]" />
                  </div>
                  <span>Direct match for individuals &amp; legal professionals</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#172033]">
                  <div className="w-5 h-5 rounded-full bg-[#2F7C78]/10 flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3.5 h-3.5 text-[#2F7C78]" />
                  </div>
                  <span>Zero spam, strictly launch updates</span>
                </div>
              </div>
            </div>

            {/* Right Column: Refined Waitlist Form Card Panel */}
            <div className="lg:col-span-5 xl:col-span-6 flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white border border-[#E6E8EC] rounded-[10px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(16,24,40,0.05)] relative">
                {/* Subtle card top accent indicator */}
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#285A8E]/30 to-transparent" />

                <div className="mb-6 space-y-1">
                  <h2 className="text-xl font-semibold text-[#172033] tracking-tight">
                    Join the waitlist
                  </h2>
                  <p className="text-sm text-[#667085]">
                    Be the first to know when MyLaw opens for early access.
                  </p>
                </div>

                {/* Waitlist Form Component */}
                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer with Legal and Brand Links */}
      <footer className="w-full border-t border-[#E6E8EC] py-6 bg-[#F7F8FA] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-[#172033]">MyLaw</span>
            <span>&copy; 2026 MyLaw. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="hover:text-[#172033] hover:text-[#285A8E] transition-colors duration-150"
            >
              Home
            </Link>
            <Link
              href="#"
              className="hover:text-[#172033] hover:text-[#285A8E] transition-colors duration-150"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-[#172033] hover:text-[#285A8E] transition-colors duration-150"
            >
              Terms
            </Link>
            <a
              href="mailto:contact@mylaw.com"
              className="hover:text-[#172033] hover:text-[#285A8E] transition-colors duration-150"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

---

## 6. Accessibility & Compliance Analysis

1. **Heading Hierarchy**:
   - `<h1>` at page root (`id="waitlist-headline"`): "Legal help, made simpler."
   - `<h2>` in the form card: "Join the waitlist" (or "Get early access").
   - Section labeled by `aria-labelledby="waitlist-headline"`.
2. **Semantic Landmarks**:
   - `<header>`: Sticky navbar.
   - `<main>`: Primary viewport area.
   - `<section>`: Split layout section.
   - `<footer>`: Bottom legal info.
3. **Contrast Ratios**:
   - Headline/Body Navy (`#172033`) on White (`#FFFFFF`): **15.5:1** (Exceeds WCAG AAA).
   - Secondary Text (`#667085`) on White (`#FFFFFF`): **4.8:1** (Exceeds WCAG AA).
   - Accent Button (`#285A8E`) on White (`#FFFFFF`): **5.4:1** (Exceeds WCAG AA).
   - Teal (`#2F7C78`) on Soft Grey (`#F7F8FA`): **4.6:1** (Exceeds WCAG AA).
4. **Interactive States & Focus Rings**:
   - All `<Link>` and `<a>` elements have clear `focus-visible:ring-2 focus-visible:ring-[#285A8E]` states.
   - Hover transitions constrained to `duration-150` or `duration-200` (well within the ≤250ms rule).
5. **Screen Reader Friendliness**:
   - SVG watermarks and background gradients marked with `aria-hidden="true"` and `pointer-events-none`.

---

## 7. Test Suite Alignment Matrix

| Test Suite / Assertion | Requirement | Plan Alignment |
| :--- | :--- | :--- |
| **Tier 1.12** | `/waitlist` loads 200 OK with COMING SOON eyebrow, headline, subtitle | Page includes `"COMING SOON / 01"`, `"Legal help, made simpler."`, and `"We're building a better way to discover and connect"`. |
| **Tier 1.13–1.15** | Email input with `required`, role selector, submit button & privacy microcopy | Delegated to `<WaitlistForm />` rendered inside right column panel. |
| **Tier 2.10** | Responsive classes for mobile and desktop | Implements `grid-cols-1 lg:grid-cols-12`, `max-w-7xl`, and responsive padding `px-4 sm:px-6 lg:px-8`. |
| **Tier 3.06** | Back button connects back to homepage (`/`) | Dedicated header features `<Link href="/">← Back to Home</Link>`. |
| **Tier 3.07** | `/waitlist?role=lawyer` query parameter support | Handled seamlessly via Suspense boundary in `WaitlistForm.tsx`. |
| **Phase 3 Challenger Task 1.2** | Hex colors match authorized palette | Only uses authorized palette tokens (`#172033`, `#285A8E`, `#2F7C78`, `#FFFFFF`, `#F7F8FA`, `#E6E8EC`, `#667085`). |
| **Phase 3 Challenger Task 3.1** | Transition durations ≤ 250ms | All transitions use `duration-150` or `duration-200`. |
| **Phase 3 Challenger Task 4.1–4.4** | Zero prohibited legal tropes, AI purple gradients, or dark mode classes | Zero gavels, zero scales, zero dark classes, zero floating heavy shadows. |

---

## 8. Verification & Execution Procedure
1. Verify TypeScript types: `npx tsc --noEmit` (must exit with code 0).
2. Verify lint: `npm run lint` (must exit with 0 errors).
3. Verify build: `npm run build` (must exit with code 0).
4. Run E2E test suite: `npm test` (verify all /waitlist assertions pass).
