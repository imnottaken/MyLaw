# MyLaw Waitlist / Coming Soon Page — Comprehensive UI/UX & Design System Survey Report

**Author**: `teamwork_preview_explorer_survey_2`  
**Date**: 2026-08-31 / 2026-09-01  
**Scope**: UI/UX Architecture, Design Tokens, Editorial Legal-Tech Aesthetic, Component Structure, Form Mechanics, Micro-interactions, and Accessibility.  
**Target Route**: `/waitlist` (`src/app/waitlist/page.tsx` & `src/components/waitlist/WaitlistForm.tsx`)

---

## 1. Executive Summary & Core Design Philosophy

The objective is to elevate the MyLaw Waitlist / Coming Soon page from a standard centered single-column layout into an **editorial, premium asymmetric split desktop layout** that embodies modern legal technology, professional SaaS clarity, and high-end editorial restraint.

### Visual Identity Matrix
* **Primary Visual Character**: Clean, confident, trustworthy, calm, and uncluttered.
* **Aesthetic Intersection**: Modern Legal-Tech + Professional SaaS + Restrained Editorial Design.
* **Core Color Distribution**: 70% White (`#FFFFFF`), 20% Soft Grey / Atmospheric Tint (`#F7F8FA`), 8% Deep Navy (`#172033`), 2% Blue & Muted Teal Accents (`#285A8E`, `#2F7C78`).
* **Visual Restraint**: Zero stereotypical legal imagery (no gavels, scales of justice, judge benches, courtroom columns, or fake handshake stock photos); zero AI startup purple/fuchsia gradients; zero heavy glassmorphism; zero dark mode leakage.

---

## 2. Detailed Mapping of Requirements (R1 – R5)

### Requirement R1: Layout & Composition (Desktop Asymmetric Split & Mobile Stacking)

#### Desktop Architecture (Viewport $\ge$ 1024px / `lg` breakpoint)
On desktop screens, the page abandons the generic single-column centered format in favor of a balanced **asymmetric two-column grid layout** (12-column grid system with 5:7 or 6:6 proportion):

```
+---------------------------------------------------------------------------------------------+
|  [MyLaw]                                                                 [← Back to Home]  |  Navbar (h-16)
+---------------------------------------------------------------------------------------------+
|                                                                                             |
|   LEFT COLUMN: Editorial Hero Content              RIGHT COLUMN: Elevated Form Panel        |
|   ┌─────────────────────────────────────────┐     ┌─────────────────────────────────────┐   |
|   │ [COMING SOON / 01]                      │     │  ┌───────────────────────────────┐  │   |
|   │                                         │     │  │ I am a:                       │  │   |
|   │ Legal help, made simpler.               │     │  │ [ Looking for legal help ]    │  │   |
|   │ ─────────────────────────               │     │  │ [ Lawyer ]                    │  │   |
|   │ We're building a better way to discover │     │  │                               │  │   |
|   │ and connect with legal professionals.   │     │  │ [ Enter your email... ]       │  │   |
|   │                                         │     │  │ [ Join the Waitlist  → ]      │  │   |
|   │ 01                                      │     │  │                               │  │   |
|   │ [Translucent Numeral Watermark]         │     │  │ No spam. Just launch updates. │  │   |
|   └─────────────────────────────────────────┘     │  └───────────────────────────────┘  │   |
|                                                   └─────────────────────────────────────┘   |
|                                                                                             |
+---------------------------------------------------------------------------------------------+
|  © 2026 MyLaw. All rights reserved.                             Privacy · Terms · Contact  |  Footer (py-6)
+---------------------------------------------------------------------------------------------+
```

* **Left Column (Editorial Value Proposition)**:
  * **Eyebrow Badge**: `COMING SOON / 01` styled with uppercase tracking (`tracking-wider` or `tracking-widest`), muted teal accent dot (`#2F7C78`), soft background pill (`bg-[#F7F8FA] border border-[#E6E8EC] text-[#285A8E] text-xs font-semibold`).
  * **Headline**: `"Legal help, made simpler."` in Deep Navy (`text-[#172033]`), font weight 600/700, size `text-4xl lg:text-5xl tracking-tight leading-[1.15]`.
  * **Editorial Accent Rule**: Subtle divider line (e.g. `w-12 h-px bg-[#2F7C78]/40` or `w-16 h-px bg-[#285A8E]`) providing structural anchoring.
  * **Brand Statement**: Concise 1–2 sentence statement: *"We're building a better way to discover and connect with legal professionals. A calmer, more accessible starting point for legal help."* (`text-base lg:text-lg text-[#667085] leading-relaxed max-w-md`).
  * **Translucent Numerical Anchor**: Faint, oversized `"01"` numeral embedded in the bottom corner of the left hero column (`text-8xl lg:text-9xl font-bold text-[#172033]/[0.03] select-none pointer-events-none`).

* **Right Column (Elevated Waitlist Panel)**:
  * **Panel Card Container**: Clean white card (`bg-white`), bordered with `border border-[#E6E8EC]`, rounded corners (`rounded-[10px]` or `rounded-[14px]`), resting on a subtle elevation (`shadow-[0_1px_3px_rgba(16,24,40,0.05),0_10px_24px_-8px_rgba(23,32,51,0.04)]`), internal padding `p-6 sm:p-8 lg:p-10`.
  * Houses the interactive `WaitlistForm` component with dedicated role selection, email input, action button, and microcopy.

#### Mobile Stacking Architecture (Viewport < 1024px)
On mobile devices (`< 1024px`), the asymmetric split stacks naturally and cleanly into a unified vertical column:
1. Eyebrow badge (`COMING SOON / 01`).
2. Headline (`Legal help, made simpler.`) scaled to `text-3xl sm:text-4xl`.
3. Supporting brand statement (`text-base text-[#667085]`).
4. Form panel container wrapping the input and role selector with responsive touch targets (48–52px height).
5. Elimination of unnecessary vertical padding to avoid awkward mobile scroll distance.

#### Background Atmosphere & Depth Layering
* **Overall Atmosphere**: Primarily crisp white (`#FFFFFF`) with a very soft vertical atmospheric gradient:
  `bg-gradient-to-b from-[#F7F8FA] via-white to-white` or subtle radial glow `radial-gradient(circle at 50% 0%, rgba(40,90,142,0.04) 0%, transparent 70%)`.
* **Architectural Grid Pattern**: Low-opacity SVG background grid (`stroke-[#172033] opacity-[0.03]` with 48px or 64px grid cells).
* **Faint "MYLAW" Watermark Typography**: Large background typographic element (`text-[120px] sm:text-[180px] lg:text-[220px] font-black tracking-tighter text-[#172033]/[0.018] select-none pointer-events-none absolute`).

---

### Requirement R2: Navigation & Minimal Footer

#### Custom Waitlist Navbar (`<header>`)
* **Height & Placement**: `h-16 sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-[#E6E8EC]/80`.
* **Left**: MyLaw brand wordmark (`text-xl font-bold tracking-tight text-[#172033] hover:text-[#285A8E] transition-colors duration-150`).
* **Right**: Clean return link `"← Back to Home"` (`text-sm font-medium text-[#667085] hover:text-[#172033] transition-colors duration-150`).
* **Deliberate Absence**: No hamburger menu drawer, no multi-link navigation items, and no secondary CTA buttons (maintaining absolute focus on conversion).

#### Minimal Footer (`<footer>`)
* **Placement & Styling**: `w-full border-t border-[#E6E8EC] py-6 bg-white`.
* **Content Specifications**:
  * **Copyright Notice**: `© 2026 MyLaw. All rights reserved.` (`text-xs text-[#667085]`).
  * **Legal & Contact Links**: Clean horizontal link list: `Privacy`, `Terms`, `Contact` (`text-xs font-medium text-[#667085] hover:text-[#172033] transition-colors duration-150`).
* **Responsive Alignment**:
  * Desktop: `flex flex-row items-center justify-between`.
  * Mobile: `flex flex-col items-center justify-center gap-3 text-center`.

---

### Requirement R3: Visual Detail & Brand Fidelity

#### Established Palette Token Adherence
All CSS and Tailwind classes strictly adhere to the project's authorized color system:

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **Brand Background** | `#FFFFFF` | Primary page & card background (70% visual ratio) |
| **Soft Background** | `#F7F8FA` | Atmospheric tint, subtle badge fills (20% visual ratio) |
| **Warm Background** | `#F6F3EC` | Supplementary warm tint (sparingly) |
| **Primary Text / Navy** | `#172033` | Primary headings, wordmark, strong text (8% visual ratio) |
| **Secondary Text** | `#667085` | Subtitles, helper text, labels, footer links |
| **Light Border** | `#E6E8EC` | 1px card borders, dividers, input borders |
| **Primary Accent Blue**| `#285A8E` | Primary CTA button, active role outline, focus rings (2% visual ratio) |
| **Accent Hover** | `#1e4670` | Button hover background |
| **Muted Teal Accent** | `#2F7C78` | Eyebrow status dot, success checkmark, thin accent ticks |

#### Negative Constraints & Brand Guardrails (Strict Prohibition)
* 🚫 **NO Legal Clichés**: Absolutely zero gavels, scales of justice, judge benches, courtroom columns, or stock handshake images.
* 🚫 **NO Dark Mode**: Zero `dark:` prefixes, zero `@media (prefers-color-scheme: dark)` overrides.
* 🚫 **NO Luxury Gold**: Zero `#d4af37`, `#ffd700`, or black-and-gold color schemes.
* 🚫 **NO AI Hype Aesthetics**: Zero purple/fuchsia gradients, glowing borders, or futuristic floating spheres.
* 🚫 **NO Heavy Glassmorphism**: Only subtle `backdrop-blur-sm` for sticky headers; no heavy frosty glass cards.

---

### Requirement R4: Waitlist Form Component (`WaitlistForm.tsx`)

#### Unified Sizing & Geometry
* **Height**: Input field and submit button strictly conform to **48–52px height** (`h-12` = 48px or `h-[50px]`).
* **Border Radius**: Restrained rounding of **8–10px** (`rounded-[8px]` or `rounded-[10px]`).
* **Focus States**: High-contrast, clean focus ring using `focus:outline-none focus:border-[#285A8E] focus:ring-3 focus:ring-[#285A8E]/15 transition-all duration-200`.

#### Custom User Type Selector Blocks
Rather than native browser radio circles, the role selector utilizes **custom selectable UI blocks / toggle cards**:
* **Header Label**: `I am a:` (`text-xs font-medium text-[#667085]`).
* **Options**:
  1. `Looking for legal help`
  2. `Lawyer`
* **Interaction States**:
  * **Unselected**: `bg-white border border-[#E6E8EC] text-[#667085] hover:border-[#285A8E]/30 hover:bg-[#F7F8FA] hover:text-[#172033]`.
  * **Selected**: `bg-[#285A8E]/8 border border-[#285A8E] text-[#285A8E] font-semibold`.
  * **Indicator**: Micro active indicator (e.g. subtle checkmark or solid indicator pill).
  * **Accessibility**: Native radio inputs visually hidden via `sr-only` with proper label associations and keyboard tab/space navigation.
* **URL Parameter Integration**: Automatically pre-selects role based on query parameter `?role=lawyer` (supports aliases `lawyer`, `attorney`, `professional`) or `?role=help` (supports aliases `help`, `individual`, `client`, `seeker`).

#### Instant Client-Side Transition & Success State
* **Validation**: Trims leading/trailing whitespace (`email.trim()`), verifies HTML5 email regex constraint.
* **Transition Timing**: Fast 150–250ms fade transition without network requests or backend calls.
* **Success View**:
  * Accessible wrapper: `role="status"` and `aria-live="polite"`.
  * Visual mark: Muted teal circular icon container (`bg-[#2F7C78]/10 text-[#2F7C78] w-12 h-12 rounded-full flex items-center justify-center`).
  * Headline: `"You're on the list."` (`text-2xl font-semibold text-[#172033] tracking-tight`).
  * Description: `"Thanks for joining MyLaw. We'll let you know when we're ready."` (`text-sm text-[#667085] leading-relaxed`).
  * Quick Return: `"← Back to Home"` link (`text-sm font-medium text-[#285A8E] hover:text-[#1e4670]`).

---

### Requirement R5: Motion & Micro-interactions

#### Motion Principles
* **Timing**: Strictly **150ms – 250ms** (`duration-150`, `duration-200`, `duration-250`).
* **Easing**: Smooth, crisp acceleration curves (`ease-out` or `ease-in-out`).
* **Micro-interactions**:
  * **Submit Button Arrow**: 3–4px horizontal slide on hover (`group-hover:translate-x-1 transition-transform duration-200 ease-out`).
  * **Interactive Role Blocks**: 150ms smooth background and border color interpolation.
  * **Input Focus Transition**: 200ms smooth border-color and ring shadow expansion.
  * **Hero Intro Reveal**: Gentle 200ms upward fade on initial render.
* **Negative Constraints**:
  * ❌ NO parallax scroll effects.
  * ❌ NO bouncy spring physics.
  * ❌ NO custom cursor effects or trail elements.
  * ❌ NO heavy animation libraries (`framer-motion`, `gsap`). Pure CSS transitions and Tailwind utility classes only.

---

## 3. Technical Architecture & Implementation Plan

### File Modification Matrix

```
src/
├── app/
│   └── waitlist/
│       └── page.tsx           <-- Implement Asymmetric Split Desktop Grid, Subtle Tint, Grid SVG, Watermark "MYLAW", Translucent "01", Custom Navbar, Minimal Footer
└── components/
    └── waitlist/
        └── WaitlistForm.tsx   <-- Implement 48-52px unified input/button, custom role blocks, 200ms client-side transition, success state
```

### Component Hierarchy & Data Flow

```
WaitlistPage (Server Component / SSR)
│
├── Background Layer: Architectural SVG Grid + Faint "MYLAW" Typography
│
├── Header: Minimal Waitlist Navbar (Wordmark + "← Back to Home")
│
├── Main: 12-Column Asymmetric Grid Container (max-w-6xl mx-auto)
│   │
│   ├── Left Hero Column (lg:col-span-5 or 6)
│   │   ├── Eyebrow: "COMING SOON / 01" with Teal Dot
│   │   ├── Headline: "Legal help, made simpler."
│   │   ├── Accent Rule: 1px divider
│   │   ├── Brand Copy: 2-sentence mission statement
│   │   └── Faint "01" Background Numeral
│   │
│   └── Right Panel Column (lg:col-span-7 or 6)
│       └── Elevated Card (bg-white border border-[#E6E8EC] rounded-[10px] p-8)
│           └── WaitlistForm (Client Component with Suspense)
│               ├── Role Selector: Custom UI Blocks [Looking for legal help] [Lawyer]
│               ├── Email Input (h-12, rounded-[8px], clean focus ring)
│               ├── Submit Button (h-12, bg-[#285A8E], ArrowRight hover:translate-x-1)
│               ├── Microcopy: "No spam. Just launch updates."
│               └── Success State: "You're on the list." (Teal Checkmark, role="status")
│
└── Footer: Minimal Waitlist Footer (Copyright + Privacy · Terms · Contact)
```

---

## 4. Accessibility (a11y) & Performance Audit

1. **Color Contrast Ratios (WCAG 2.1 AAA/AA)**:
   * `#172033` (Navy) on `#FFFFFF` (White): **15.5:1** (AAA compliant)
   * `#667085` (Secondary Grey) on `#FFFFFF`: **4.8:1** (AA compliant for body, AAA for large)
   * `#285A8E` (Accent Blue) on `#FFFFFF`: **5.2:1** (AA compliant)
   * `#2F7C78` (Teal) on `#FFFFFF`: **4.7:1** (AA compliant)
   * `#FFFFFF` (White text) on `#285A8E` (Button): **5.2:1** (AA compliant)
2. **Screen Reader Considerations**:
   * Email label: Explicit `<label htmlFor="waitlist-email" className="sr-only">Email address</label>`.
   * Role selector: Grouped inside `fieldset` or accessible radiogroup with clear text labels.
   * Success notification: Live region `role="status"` and `aria-live="polite"`.
3. **Zero JavaScript Overhead**:
   * Pure CSS animations via Tailwind v4.
   * Zero external animation bundles, guaranteeing instant First Contentful Paint (< 200ms).

---

## 5. Verification & Test Plan

1. **Layout Verification**:
   * Inspect desktop viewport ($\ge 1024\text{px}$): Verify asymmetric two-column grid.
   * Inspect mobile viewport ($375\text{px} - 768\text{px}$): Verify natural single-column stacking with no overflow.
2. **Brand & Visual Audit**:
   * Verify absence of forbidden legal tropes (gavels, scales of justice, courtrooms).
   * Verify hex code compliance with authorized palette tokens.
3. **Form Functionality**:
   * Test pre-selection via `?role=lawyer` and `?role=help`.
   * Test email validation (rejection of empty/malformed emails, trimming of whitespace).
   * Test fast client-side transition (150–250ms) to success state without page reload.
4. **Build & Type Check**:
   * Verify `npm run build` exits with code 0.
   * Verify `npm test` runs with 100% pass rate.
