# Milestone 1: Waitlist Page Visual Depth, Typography Watermark & Styling Strategy Blueprint

**Target Component / File**: `src/app/waitlist/page.tsx`  
**Agent**: `teamwork_preview_explorer_m1_2`  
**Scope**: Visual Depth, Atmospheric Gradients, Architectural SVG Grid, Typography Watermark, Numeral Watermarks, Editorial Dividers & Palette Token Strategy  
**Status**: APPROVED & COMPLETE  
**Date**: 2026-09-01  

---

## 1. Executive Summary & Design Vision

The objective of this styling strategy is to transform the `/waitlist` Coming Soon page from a standard centered container into an editorial, high-trust legal-tech centerpiece. The visual language blends the austere precision of legal publishing and architectural drafting with modern, high-clarity SaaS interface design.

### Core Visual Pillars:
1. **Light Atmospheric Tinting**: A subtle vertical wash (`bg-gradient-to-b from-[#F7F8FA] via-white to-white`) layered with an ultra-faint radial illumination (`rgba(40,90,142,0.035)`), maintaining a predominantly clean white canvas while adding subtle depth.
2. **Architectural Orthographic Grid (3% Opacity)**: A crisp 48px vector Cartesian grid SVG that anchors the page layout without distracting from typography or form inputs.
3. **Dual Typography Watermarks**:
   - Massive, low-contrast `"MYLAW"` wordmark watermark (2.5% opacity) sitting behind the asymmetric hero.
   - Translucent `"01"` monospace/sans numeral watermark (4-5% opacity) establishing continuity with the chapter markers (`§ 01` through `§ 07`) across the platform.
4. **Thin Editorial Dividers & Hairline Accents**: 1px crisp separation borders (`#E6E8EC`) combined with 2px accent rules (`#285A8E` and `#2F7C78`) that guide reader eye flow.
5. **Strict Token Adherence & Negative Constraints**: Zero gavels, zero scales of justice, zero AI art/illustrations, zero dark mode leakage, and zero heavy glowing drop shadows.

---

## 2. Design Token Matrix & Color Compliance

All colors, radii, borders, and transitions map directly to the established brand tokens in `src/app/globals.css`:

```
==========================================================================================
TOKEN NAME                     HEX / VALUE             TW UTILITY CLASS           PURPOSE
==========================================================================================
--color-brand-bg               #FFFFFF                 bg-white                   Canvas & Card Surface
--color-brand-bg-soft          #F7F8FA                 bg-[#F7F8FA]               Atmospheric tint & Badges
--color-brand-text-primary     #172033                 text-[#172033]             Headlines, Wordmark, Navy text
--color-brand-text-secondary   #667085                 text-[#667085]             Subtitles, Labels, Footnotes
--color-brand-border           #E6E8EC                 border-[#E6E8EC]           Card borders, Dividers
--color-brand-accent           #285A8E                 text-[#285A8E], bg-[..]    Primary buttons, Links, Accents
--color-brand-accent-hover     #1e4670                 hover:bg-[#1e4670]         Button hover state
--color-brand-accent-teal      #2F7C78                 text-[#2F7C78], bg-[..]    Status dots, checkmarks, trust
--radius-brand-sm              6px                     rounded-[6px]              Badges, Pill tags
--radius-brand-md              10px                    rounded-[10px]             Form inputs, Role cards
--radius-brand-lg              14px                    rounded-[14px]             Main Waitlist container card
--shadow-brand-subtle          0 1px 3px rgba(..)      shadow-[0_1px_3px_...]     Card elevation
==========================================================================================
```

### Prohibited Tropes & Anti-Patterns (Enforced 100%):
- ❌ **NO Gavels, Scales of Justice, Courtroom Pillars, or Judge Benches**: Avoids legal cliché stereotypes.
- ❌ **NO AI/3D Shiny Illustrations or Floating Glass Orbs**: Maintains high-credibility institutional feel.
- ❌ **NO Unauthorized Hex Colors**: Colors like `#8b5cf6` (purple), `#6366f1` (indigo), `#d4af37` (gold) are prohibited.
- ❌ **NO Dark Mode Inversion**: Dark mode media queries and `dark:` utility overrides are strictly eliminated. Canvas remains clean light.
- ❌ **NO Heavy / Blurry Shadows**: Avoid `shadow-2xl` or `backdrop-blur-2xl`. Only crisp hairline borders and subtle ambient elevation.

---

## 3. Atmospheric Background Layering Architecture

The visual depth on `/waitlist` is achieved by stacking 4 distinct layers with explicit `z-index` and `pointer-events-none` rules:

```
[Layer 4: Content & Interactive Components] (z-10 / relative)
  ├─ Left Hero Column (Eyebrow, Headline, Brand Copy, Feature Points)
  └─ Right Elevated Waitlist Form Card (bg-white, border-[#E6E8EC], shadow)
-------------------------------------------------------------------------
[Layer 3: Typography Watermarks] (z-0 / absolute / pointer-events-none)
  ├─ "MYLAW" Display Wordmark (text-[11rem], text-[#172033]/[0.025])
  └─ "01" Translucent Numeral (text-8xl, text-[#285A8E]/[0.06])
-------------------------------------------------------------------------
[Layer 2: Architectural Grid SVG] (-z-10 / absolute / pointer-events-none)
  └─ 48px × 48px Orthographic Cartesian Grid (opacity-[0.035], stroke-[#172033])
-------------------------------------------------------------------------
[Layer 1: Atmospheric Tint & Linear Gradient] (-z-20 / absolute / pointer-events-none)
  ├─ Base linear gradient: from-[#F7F8FA] via-white to-white
  └─ Top radial glow: radial-gradient at top-center with rgba(40,90,142,0.03)
```

### Exact Atmospheric Tint Implementation:
```tsx
{/* Atmospheric Gradient Layer */}
<div
  className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#F7F8FA] via-white to-white"
  aria-hidden="true"
/>
<div
  className="pointer-events-none absolute top-0 inset-x-0 h-96 -z-20 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(40,90,142,0.035),transparent_70%)]"
  aria-hidden="true"
/>
```

---

## 4. Architectural Grid SVG Specification (3% Opacity)

The grid evokes engineering drafting paper and legal document margins. It is rendered via an inline SVG `<pattern>` to eliminate network requests and prevent layout shifts.

### Exact Grid SVG Code:
```tsx
{/* Subtle 3.5% Architectural Grid Background */}
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
        id="waitlist-architectural-grid"
        width="48"
        height="48"
        patternUnits="userSpaceOnUse"
      >
        <path d="M0 48V.5H48" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#waitlist-architectural-grid)" />
  </svg>
</div>
```

### Key Grid Attributes:
- **Unit Dimensions**: `48px × 48px` cell grid.
- **Stroke Color**: `#172033` (Navy) rendered at `opacity-[0.035]`.
- **Stroke Width**: `1px` razor-sharp SVG vector.
- **Accessibility**: `aria-hidden="true"` and `pointer-events-none`.

---

## 5. Typography Watermarks & Translucent Numeral Strategy

### 5.1 Oversized "MYLAW" Wordmark Watermark
The `"MYLAW"` watermark anchors the left side of the asymmetric split, sitting behind the hero text without interfering with reading contrast.

```tsx
{/* Oversized Faint "MYLAW" Wordmark Watermark */}
<div
  className="pointer-events-none absolute -top-10 -left-6 sm:-left-10 text-[7rem] sm:text-[9rem] lg:text-[11.5rem] xl:text-[13rem] font-bold tracking-tighter text-[#172033]/[0.025] select-none -z-10 leading-none"
  aria-hidden="true"
>
  MYLAW
</div>
```

- **Font**: Inherits root sans-serif (`Inter` / `Geist`).
- **Letter Spacing**: `tracking-tighter` for architectural typography feel.
- **Opacity**: Exactly `0.025` (2.5% opacity), ensuring zero collision with primary body and headline text.
- **User Selection**: `select-none` and `pointer-events-none`.

### 5.2 Translucent "01" Chapter Numeral Watermark
The `"01"` numeral provides visual continuity with the 7 editorial chapters of the landing page. It can be positioned inside the right card's top right corner or adjacent to the hero eyebrow.

```tsx
{/* Translucent "01" Numeral Index inside Form Card */}
<div
  className="pointer-events-none absolute top-4 right-5 text-2xl sm:text-3xl font-mono font-bold text-[#285A8E]/15 select-none"
  aria-hidden="true"
>
  01
</div>
```

And in the Left Hero Column:
```tsx
{/* Translucent "01" Background Accent behind Eyebrow */}
<div
  className="pointer-events-none absolute -top-6 -right-4 sm:right-10 text-6xl sm:text-7xl font-mono font-bold text-[#285A8E]/[0.04] select-none -z-10"
  aria-hidden="true"
>
  01
</div>
```

---

## 6. Thin Editorial Divider & Hairline System

To reinforce the editorial, legal publication aesthetic, the page employs a clear divider hierarchy:

### 1. Headline Accent Rule (Left Column)
Positioned between the headline and the value description:
```tsx
{/* Editorial Accent Rule */}
<div className="w-12 h-0.5 bg-[#285A8E] rounded-full" />
```

### 2. Header & Footer Separation Hairlines
1px subtle boundary rules using 80% opacity:
```tsx
<header className="w-full border-b border-[#E6E8EC]/80 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
...
<footer className="w-full border-t border-[#E6E8EC] py-6 sm:py-8 bg-white">
```

### 3. Left-Column Value Feature Dividers
Clean horizontal or vertical hairlines separating the 3 core pillars:
```tsx
<div className="pt-6 border-t border-[#E6E8EC]/80 grid grid-cols-3 gap-4 text-left">
  <div>
    <div className="text-[11px] font-mono font-bold text-[#285A8E]">01 / CLARITY</div>
    <div className="text-xs text-[#667085] mt-1">Plain-language guidance</div>
  </div>
  <div className="border-l border-[#E6E8EC] pl-4">
    <div className="text-[11px] font-mono font-bold text-[#285A8E]">02 / CHOICE</div>
    <div className="text-xs text-[#667085] mt-1">Direct counsel matching</div>
  </div>
  <div className="border-l border-[#E6E8EC] pl-4">
    <div className="text-[11px] font-mono font-bold text-[#285A8E]">03 / TRUST</div>
    <div className="text-xs text-[#667085] mt-1">Verified credentials</div>
  </div>
</div>
```

---

## 7. Elevated Waitlist Form Card Styling (Right Column)

The right column features an elevated card container that holds the `<WaitlistForm />` component.

```tsx
<div className="relative bg-white border border-[#E6E8EC] rounded-[14px] p-6 sm:p-8 lg:p-10 shadow-[0_1px_3px_rgba(16,24,40,0.05),0_10px_25px_-5px_rgba(16,24,40,0.03)] overflow-hidden">
  {/* Translucent 01 accent */}
  <div
    className="pointer-events-none absolute top-4 right-5 text-2xl font-mono font-bold text-[#285A8E]/10 select-none"
    aria-hidden="true"
  >
    01
  </div>

  {/* Card Header */}
  <div className="mb-6 space-y-1.5">
    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#285A8E] uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
      <span>Priority Access</span>
    </div>
    <h2 className="text-xl sm:text-2xl font-semibold text-[#172033] tracking-tight">
      Join the Waitlist
    </h2>
    <p className="text-sm text-[#667085]">
      Reserve your spot for early access when we launch.
    </p>
  </div>

  {/* Embedded Waitlist Form */}
  <WaitlistForm />
</div>
```

---

## 8. Micro-interactions & Timing Specifications

| Interaction Element | Animation / Transition Class | Duration | Curve / Timing |
|---|---|---|---|
| CTA Button Arrow | `group-hover:translate-x-1` | `200ms` | `ease-in-out` |
| Button Click Active State | `active:scale-[0.98]` | `150ms` | `ease-out` |
| Input Focus Ring | `focus-visible:ring-3 focus-visible:ring-[#285A8E]/15` | `200ms` | `ease-in-out` |
| Role Selection Block | `transition-all duration-150` | `150ms` | `ease-out` |
| Success State Fade-in | `transition-all duration-200` | `200ms` | `ease-in-out` |
| Nav Links Hover | `transition-colors duration-150` | `150ms` | `ease-out` |

---

## 9. Comprehensive JSX Blueprint for `src/app/waitlist/page.tsx`

Below is the complete, production-ready specification blueprint for `src/app/waitlist/page.tsx`:

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
      {/* 1. Atmospheric Gradient Layer */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#F7F8FA] via-white to-white"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-96 -z-20 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(40,90,142,0.035),transparent_70%)]"
        aria-hidden="true"
      />

      {/* 2. Low-Opacity Architectural Grid Background (3.5% Opacity) */}
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

      {/* 3. Dedicated Navbar */}
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

      {/* 4. Asymmetric Split Desktop Layout */}
      <main className="flex-1 flex items-center py-10 sm:py-14 lg:py-20 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: Hero, Editorial Copy & Brand Watermarks (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 relative">
              {/* Faint Oversized "MYLAW" Typography Watermark */}
              <div
                className="pointer-events-none absolute -top-10 -left-4 sm:-left-8 text-[7rem] sm:text-[9rem] lg:text-[11.5rem] xl:text-[13rem] font-bold tracking-tighter text-[#172033]/[0.025] select-none -z-10 leading-none"
                aria-hidden="true"
              >
                MYLAW
              </div>

              {/* Eyebrow Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-semibold tracking-widest text-[#285A8E] bg-[#F7F8FA] border border-[#E6E8EC] uppercase shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
                  <span>COMING SOON / 01</span>
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#172033] tracking-tight leading-[1.12]">
                  Legal help, made simpler.
                </h1>
                {/* Thin Editorial Accent Divider */}
                <div className="w-12 h-0.5 bg-[#285A8E] rounded-full" />
                <p className="text-base sm:text-lg text-[#667085] leading-relaxed max-w-xl">
                  We&apos;re building a better way to discover and connect with legal professionals. Clear information, transparent options, and trusted counsel when you need it most.
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="pt-6 border-t border-[#E6E8EC]/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#285A8E]">01 / CLARITY</div>
                  <div className="text-xs text-[#667085] mt-1">Plain-language guidance</div>
                </div>
                <div className="border-l border-[#E6E8EC] pl-4">
                  <div className="text-[11px] font-mono font-bold text-[#285A8E]">02 / CHOICE</div>
                  <div className="text-xs text-[#667085] mt-1">Direct counsel matching</div>
                </div>
                <div className="border-l border-[#E6E8EC] pl-4">
                  <div className="text-[11px] font-mono font-bold text-[#285A8E]">03 / TRUST</div>
                  <div className="text-xs text-[#667085] mt-1">Verified credentials</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Elevated Waitlist Card Panel (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white border border-[#E6E8EC] rounded-[14px] p-6 sm:p-8 lg:p-10 shadow-[0_1px_3px_rgba(16,24,40,0.05),0_10px_25px_-5px_rgba(16,24,40,0.03)] relative overflow-hidden">
                {/* Translucent "01" Watermark */}
                <div
                  className="pointer-events-none absolute top-4 right-5 text-2xl font-mono font-bold text-[#285A8E]/10 select-none"
                  aria-hidden="true"
                >
                  01
                </div>

                {/* Form Header */}
                <div className="mb-6 space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#285A8E] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
                    <span>Priority Access</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#172033] tracking-tight">
                    Join the Waitlist
                  </h2>
                  <p className="text-sm text-[#667085]">
                    Reserve your spot for early access when we launch.
                  </p>
                </div>

                {/* Interactive Waitlist Form */}
                <WaitlistForm />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 5. Minimal Footer */}
      <footer className="w-full border-t border-[#E6E8EC] py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172033]">MyLaw</span>
            <span>•</span>
            <p>&copy; 2026 MyLaw. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-[#172033] transition-colors duration-150">Privacy</Link>
            <Link href="#" className="hover:text-[#172033] transition-colors duration-150">Terms</Link>
            <Link href="mailto:contact@mylaw.com" className="hover:text-[#172033] transition-colors duration-150">Contact</Link>
          </div>
          <p className="text-[#667085]">Legal help, simplified.</p>
        </div>
      </footer>
    </div>
  );
}
```

---

## 10. Verification & Audit Criteria

1. **Brand Tropes Audit**:
   - `grep -Eri "(gavel|scales of justice|scale of justice|courtroom|courthouse|judge bench)" src/app/waitlist/` returns 0 occurrences.
2. **Palette Compliance Audit**:
   - Every hex color code matches: `#FFFFFF`, `#F7F8FA`, `#172033`, `#285A8E`, `#1e4670`, `#2F7C78`, `#E6E8EC`, `#667085`.
3. **Contrast Ratio Compliance**:
   - Primary text (`#172033` on `#FFFFFF`): 14.8:1 (exceeds WCAG AAA standard of 7.0:1).
   - Secondary text (`#667085` on `#FFFFFF`): 4.8:1 (exceeds WCAG AA standard of 4.5:1).
   - Watermark text (`#172033` at 2.5% opacity): Non-text decorative backdrop, `aria-hidden="true"` and `select-none`.
4. **Transition Duration Audit**:
   - All `duration-*` classes are `<= 250ms`.
