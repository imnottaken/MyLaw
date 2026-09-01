# Milestone 1: Waitlist Page Layout, Atmospheric Styling & Navigation Technical Plan

**Target File**: `src/app/waitlist/page.tsx`  
**Milestone Owner**: M1 Worker Agent  
**Status**: SPECIFIED & BLUEPRINTED  
**Date**: 2026-08-31 / 2026-09-01  

---

## 1. Executive Summary & Objective

Milestone 1 transforms the MyLaw Coming Soon / Waitlist page (`/waitlist`) from a simple centered column into a premium, sophisticated **asymmetric desktop split layout** that exemplifies the brand's editorial legal-tech aesthetic. 

The redesign achieves five core structural goals:
1. **Asymmetric Desktop Split (12-column grid)**: Left-column hero & brand authority section (`lg:col-span-7`) alongside a right-column elevated waitlist card container (`lg:col-span-5`).
2. **Atmospheric Background & Editorial Depth**: Soft vertical atmospheric tint (`#F7F8FA` gradient to `#FFFFFF`), faint 3.5% geometric architectural grid SVG, faint oversized `"MYLAW"` watermark typography, and translucent `"01"` section index marker.
3. **Dedicated Minimal Navbar**: Sticky top bar with brand wordmark (`MyLaw`) linking to `/` on the left and `"← Back to Home"` navigation link on the right.
4. **Editorial Content Hierarchy**: Eyebrow badge with teal accent dot (`COMING SOON / 01`), bold headline (`Legal help, made simpler.`), thin editorial accent rule, concise value proposition, and 3-part structured principle pillars (`01 / CLARITY`, `02 / CHOICE`, `03 / TRUST`).
5. **Polished Minimal Footer**: Unified footer with brand mark, exact copyright notice (`© 2026 MyLaw. All rights reserved.`), legal links (`Privacy`, `Terms`, `Contact`), and brand motto (`Legal help, simplified.`).

---

## 2. Layout & Grid Architecture

### 2.1 Viewport Breakpoints & Container Discipline
- **Outer Shell**: `min-h-screen flex flex-col justify-between bg-white text-[#172033] relative overflow-hidden`
- **Max Width Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` across header, main body, and footer.
- **Main Section**: `flex-1 flex items-center py-10 sm:py-14 lg:py-20 relative`

### 2.2 Desktop vs Mobile Grid Stacking
```
+-----------------------------------------------------------------------------------+
| HEADER (Sticky):  [MyLaw]                                     [← Back to Home]   |
+-----------------------------------------------------------------------------------+
| MAIN (lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center)                      |
|                                                                                   |
|  [LEFT COLUMN: lg:col-span-7]                  [RIGHT COLUMN: lg:col-span-5]      |
|  • Watermark: "MYLAW" (2.5% opacity)           • Elevated Card Container          |
|  • Eyebrow: [• COMING SOON / 01] EARLY ACCESS    (bg-white, border, rounded-[14px])|
|  • Headline: "Legal help, made simpler."       • Card Title: "Join Priority Access"|
|  • Editorial Accent Rule (h-0.5 bg-[#285A8E])  • Card Subtitle                    |
|  • Brand Statement & Description               • <WaitlistForm />                 |
|  • Value Pillars (01 Clarity, 02 Choice, 03 Trust)  - Role Selectors (Help/Lawyer)|
|                                                     - Email Input + Submit Button  |
+-----------------------------------------------------------------------------------+
| FOOTER: [MyLaw • © 2026 MyLaw. All rights reserved.]  [Privacy | Terms | Contact] |
|         [Legal help, simplified.]                                                 |
+-----------------------------------------------------------------------------------+
```

- **Mobile Viewport (< 1024px)**: Natural vertical stacking (`lg:grid` collapses to single-column flex/block flow). Left hero content renders on top with clean vertical rhythm (`space-y-6 sm:space-y-8`), followed by the right card container (`mt-8 lg:mt-0`).
- **Desktop Viewport (≥ 1024px)**: `lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center` provides asymmetric balance with 58%/42% optical weight distribution.

---

## 3. Component Details & Token Specifications

### 3.1 Design System & Color Palette Strict Compliance
All elements adhere strictly to authorized design tokens:

| Element | Hex Code | Utility / Token Name | Rationale |
|---|---|---|---|
| Background Page | `#FFFFFF` | `bg-white` / `--color-brand-bg` | Crisp clean foundation |
| Background Soft Tint | `#F7F8FA` | `bg-[#F7F8FA]` / `--color-brand-bg-soft` | Soft gradient & badge fill |
| Primary Text & Grid | `#172033` | `text-[#172033]`, `stroke-[#172033]` | High-contrast editorial navy |
| Brand Accent Blue | `#285A8E` | `text-[#285A8E]`, `bg-[#285A8E]` | Brand primary interaction color |
| Accent Hover Blue | `#1e4670` | `hover:bg-[#1e4670]` | Subtle button/link hover state |
| Accent Teal | `#2F7C78` | `bg-[#2F7C78]` | Eyebrow status indicator dot |
| Borders & Dividers | `#E6E8EC` | `border-[#E6E8EC]` | Hairline card & header borders |
| Secondary Text | `#667085` | `text-[#667085]` | Muted copy, labels, metadata |

### 3.2 Visual Depth & Watermark Elements
1. **Atmospheric Gradient Layer**:
   ```tsx
   <div
     className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#F7F8FA] via-white to-white"
     aria-hidden="true"
   />
   ```
2. **Low-Opacity Architectural Grid (3.5% opacity)**:
   ```tsx
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
   ```
3. **Faint Oversized "MYLAW" Typography**:
   ```tsx
   <div
     className="pointer-events-none absolute -top-12 -left-6 text-[7rem] sm:text-[9rem] lg:text-[11rem] font-bold tracking-tighter text-[#172033]/[0.025] select-none -z-10 leading-none"
     aria-hidden="true"
   >
     MYLAW
   </div>
   ```
4. **Translucent "01" Index Marker on Right Card**:
   ```tsx
   <div
     className="pointer-events-none absolute top-4 right-5 text-2xl font-mono font-bold text-[#285A8E]/10 select-none"
     aria-hidden="true"
   >
     01
   </div>
   ```

### 3.3 Dedicated Header Specification
```tsx
<header className="w-full border-b border-[#E6E8EC]/80 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <Link
      href="/"
      className="text-xl font-bold tracking-tight text-[#172033] hover:text-[#285A8E] transition-colors duration-150"
    >
      MyLaw
    </Link>
    <Link
      href="/"
      className="text-sm font-medium text-[#667085] hover:text-[#285A8E] transition-colors duration-150 flex items-center gap-1.5"
    >
      <span>←</span>
      <span>Back to Home</span>
    </Link>
  </div>
</header>
```

### 3.4 Minimal Footer Specification
```tsx
<footer className="w-full border-t border-[#E6E8EC] py-6 sm:py-8 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
    <div className="flex items-center gap-2">
      <span className="font-semibold text-[#172033]">MyLaw</span>
      <span>&bull;</span>
      <p>&copy; 2026 MyLaw. All rights reserved.</p>
    </div>

    <div className="flex items-center gap-6">
      <Link
        href="#"
        className="hover:text-[#285A8E] transition-colors duration-150"
      >
        Privacy
      </Link>
      <Link
        href="#"
        className="hover:text-[#285A8E] transition-colors duration-150"
      >
        Terms
      </Link>
      <a
        href="mailto:contact@mylaw.com"
        className="hover:text-[#285A8E] transition-colors duration-150"
      >
        Contact
      </a>
    </div>

    <p className="text-[#667085]">Legal help, simplified.</p>
  </div>
</footer>
```

---

## 4. Full Drop-in Implementation Blueprint

The target implementation for `src/app/waitlist/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/waitlist/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Waitlist — MyLaw",
  description: "Be among the first to experience MyLaw. We're building a better way to discover and connect with legal professionals.",
};

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#172033] relative overflow-hidden">
      {/* Subtle Atmospheric Gradient / Tint */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#F7F8FA] via-white to-white"
        aria-hidden="true"
      />

      {/* Subtle Low-Opacity Geometric Grid Pattern */}
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

      {/* Dedicated Clean Header with MyLaw Wordmark & Back Link */}
      <header className="w-full border-b border-[#E6E8EC]/80 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#172033] hover:text-[#285A8E] transition-colors duration-150"
          >
            MyLaw
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#667085] hover:text-[#285A8E] transition-colors duration-150 flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Asymmetric Split Layout */}
      <main className="flex-1 flex items-center py-10 sm:py-14 lg:py-20 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Hero & Editorial Brand Presentation (col-span-7) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 relative">
              {/* Background Watermark Typography */}
              <div
                className="pointer-events-none absolute -top-12 -left-6 text-[7rem] sm:text-[9rem] lg:text-[11rem] font-bold tracking-tighter text-[#172033]/[0.025] select-none -z-10 leading-none"
                aria-hidden="true"
              >
                MYLAW
              </div>

              {/* Eyebrow Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] text-xs font-semibold tracking-widest text-[#285A8E] bg-[#F7F8FA] border border-[#E6E8EC] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
                  <span>COMING SOON / 01</span>
                </span>
                <span className="text-xs font-mono font-medium text-[#667085]/60 tracking-wider">
                  EARLY ACCESS
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold text-[#172033] tracking-tight leading-[1.15]">
                  Legal help, made simpler.
                </h1>
                
                {/* Thin Editorial Accent Rule */}
                <div className="w-16 h-0.5 bg-[#285A8E]/60 rounded-full" />

                {/* Brand Statement / Copy */}
                <p className="text-base sm:text-lg text-[#667085] max-w-xl leading-relaxed">
                  We&apos;re building a better way to discover and connect with legal professionals. Experience clarity, curated guidance, and direct communication designed around your needs.
                </p>
              </div>

              {/* Editorial Feature Highlights / Value Pillars */}
              <div className="pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E6E8EC]/80 text-left">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#285A8E]">01 / CLARITY</div>
                  <div className="text-xs text-[#667085]">Transparent insights and guided next steps.</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#285A8E]">02 / CHOICE</div>
                  <div className="text-xs text-[#667085]">Verified legal practitioners by domain expertise.</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#285A8E]">03 / TRUST</div>
                  <div className="text-xs text-[#667085]">Confidential inquiries with zero friction.</div>
                </div>
              </div>
            </div>

            {/* Right Column: Waitlist Card Panel (col-span-5) */}
            <div className="lg:col-span-5 w-full mt-8 lg:mt-0">
              <div className="bg-white border border-[#E6E8EC] rounded-[10px] sm:rounded-[14px] p-6 sm:p-8 lg:p-10 shadow-[0_1px_3px_rgba(16,24,40,0.05)] relative">
                {/* Translucent Index Marker */}
                <div
                  className="pointer-events-none absolute top-4 right-5 text-2xl font-mono font-bold text-[#285A8E]/10 select-none"
                  aria-hidden="true"
                >
                  01
                </div>

                {/* Card Title & Description */}
                <div className="mb-6 space-y-1.5">
                  <h2 className="text-xl font-semibold text-[#172033] tracking-tight">
                    Join Priority Access
                  </h2>
                  <p className="text-xs sm:text-sm text-[#667085]">
                    Be first in line when we launch. Select your role for tailored early access.
                  </p>
                </div>

                {/* Interactive Waitlist Form Component */}
                <WaitlistForm />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-[#E6E8EC] py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172033]">MyLaw</span>
            <span>&bull;</span>
            <p>&copy; 2026 MyLaw. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-[#285A8E] transition-colors duration-150"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-[#285A8E] transition-colors duration-150"
            >
              Terms
            </Link>
            <a
              href="mailto:contact@mylaw.com"
              className="hover:text-[#285A8E] transition-colors duration-150"
            >
              Contact
            </a>
          </div>

          <p className="text-[#667085]">Legal help, simplified.</p>
        </div>
      </footer>
    </div>
  );
}
```

---

## 5. Verification Matrix & Test Alignment

| Assertion / Criterion | Source / Test File | Expected Behavior | Planned Implementation Match |
|---|---|---|---|
| Desktop Asymmetric Split | `ORIGINAL_REQUEST.md` R1 | `lg:grid lg:grid-cols-12 gap-12 lg:gap-16` | Left `col-span-7`, Right `col-span-5` |
| Eyebrow Content | `ORIGINAL_REQUEST.md` R1, Tier 1.12 | Contains `"COMING SOON / 01"` | Matches string & regex `/COMING SOON/i` |
| Headline Content | `ORIGINAL_REQUEST.md` R1, Tier 1.12 | Contains `"Legal help, made simpler."` | Exact string match |
| Brand Subtitle / Copy | `ORIGINAL_REQUEST.md` R1, Tier 1.12 | Contains `"We're building a better way to discover and connect"` | Exact string match with `&apos;` escape |
| Dedicated Navbar | `ORIGINAL_REQUEST.md` R2, Tier 3.06 | MyLaw wordmark + `"← Back to Home"` linking to `/` | Fully rendered with `href="/"` links |
| Minimal Footer | `ORIGINAL_REQUEST.md` R2, Tier 1.11 | Brand, Privacy, Terms, Contact, Copyright | Links present; Copyright `© 2026 MyLaw. All rights reserved.` |
| Hex Color Whitelist | `challenger_phase3_visual_design` Task 1.2 | Only authorized hex codes | All hex codes match authorized palette |
| Transition Durations | `challenger_phase3_visual_design` Task 3.1 | All durations `<= 250ms` | Uses `duration-150` |
| Negative Tropes Elimination | `challenger_phase3_visual_design` Task 4.1-4.4 | Zero gavels, scales, `dark:` classes | Clean light-mode only |
| Form Component Mount | `PROJECT.md` Interface Contracts | `<WaitlistForm />` mounted in right card | Preserves client component contract |

---

## 6. Implementation Handoff & Instructions for M1 Worker

1. **Target File**: Modify `src/app/waitlist/page.tsx` with the complete drop-in implementation provided in Section 4.
2. **Safety Check**: Do not touch `src/app/page.tsx` or `src/components/landing/*`.
3. **Verify Build**: Run `npm run build` and run test suites to ensure zero compilation or lint errors.
