# Codebase Survey & Architectural Analysis — MyLaw Waitlist Redesign

## 1. Executive Summary

This report documents the architectural, visual, and component structure of the **MyLaw** web application, with a focus on preparing for the **Waitlist / Coming Soon page (`/waitlist`) redesign**. 

The redesign goal is to transform `/waitlist` from a basic centered layout into a **sophisticated asymmetric layout** on desktop that embodies modern editorial legal-tech design, while strictly maintaining the landing page (`/`) untouched and functional.

### Key Requirements Matrix
| Requirement | Specification | Existing Baseline | Target Redesign |
| :--- | :--- | :--- | :--- |
| **Desktop Layout** | Asymmetric split layout (desktop) / single-column stack (mobile) | Centered single-column container (`max-w-xl mx-auto`) | Asymmetric split: Editorial copy & depth elements on left, refined waitlist card on right |
| **Visual Depth** | Editorial details, faint watermark, atmospheric gradient | Low-opacity SVG grid only | Navy-to-blue atmospheric gradient/tint, oversized faint "MYLAW" typography, translucent "01", fine grid |
| **Navigation** | Dedicated page navbar with logo/wordmark & back link | Sticky top bar with basic text links | Dedicated clean navbar with MyLaw wordmark & "← Back to Home" |
| **Footer** | Minimal footer with legal/brand links & copyright | 2-column minimal footer (copyright + motto) | Refined minimal footer with brand name, Privacy, Terms, Contact links, copyright |
| **Waitlist Form** | Cohesive 48–52px input+button, custom role selector blocks, client-side smooth transition | Separate input & button, native radio circles | Integrated unified form pill/box (48-52px), custom toggle blocks (no OS radio rings), 150-300ms success fade |
| **Brand Integrity** | Strict prohibition of gavels, scales, AI illustrations, dark mode | Light mode enforced with `#172033`, `#285A8E`, `#2F7C78` | Full compliance with brand palette and zero legal tropes |

---

## 2. Next.js Architecture & Project Structure

### Technology Stack
- **Framework**: Next.js 16.3.3 (App Router with Turbopack support)
- **React**: React 19.2.8 (`react`, `react-dom`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss: ^4`, `@import "tailwindcss"`)
- **Typography**: Inter (Google Fonts via `next/font/google`), Geist
- **Component Primitives**: `@base-ui/react`, `class-variance-authority`, `tailwind-merge`, `clsx`
- **Icons**: `lucide-react` (re-exported via `@/components/icons`)

### Routing Table
```
/                   -> src/app/page.tsx (Landing Page - Read-Only / Untouched)
/waitlist           -> src/app/waitlist/page.tsx (Waitlist / Coming Soon - Target of Redesign)
/_not-found         -> Default Next.js 404 handler
```

### Directory Layout
```
/Users/koustavdey/mylaw/
├── package.json
├── tsconfig.json
├── design.md                      # Core brand & design specification
├── public/                        # Static assets (logos, illustrations)
│   ├── logo mylaw.jpeg
│   ├── hero page img.png
│   └── ...
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css            # Tailwind v4 @theme, tokens, base layers
│   │   ├── layout.tsx             # Root layout (Inter font, metadata, body container)
│   │   ├── page.tsx               # Landing page (7 sections + Navbar)
│   │   └── waitlist/
│   │       └── page.tsx           # [TARGET] Waitlist / Coming Soon page
│   ├── components/
│   │   ├── Navbar.tsx             # Landing page navbar (with scroll detection)
│   │   ├── icons/
│   │   │   └── index.tsx          # Re-exported Lucide icons
│   │   ├── landing/               # [UNTOUCHED] Landing page section components
│   │   │   ├── AboutSection.tsx
│   │   │   ├── FinalCtaSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── MockupPreview.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── WhoItsForSection.tsx
│   │   │   └── WhyMyLawSection.tsx
│   │   ├── ui/                    # UI primitives (Base UI wrappers)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── radio-group.tsx
│   │   └── waitlist/
│   │       └── WaitlistForm.tsx   # [TARGET] Client-side waitlist form component
│   └── lib/
│       └── utils.ts               # cn() classnames helper
└── tests/                         # E2E and adversarial verification suites
```

---

## 3. Target Scope Analysis: Waitlist Page & Form

### 3.1. `src/app/waitlist/page.tsx` (Current Implementation Analysis)
- **Current Layout**:
  - Top `<header>` with border `#E6E8EC`/80, containing "MyLaw" text and "← Back to Home".
  - Centered `<main>` with `max-w-xl mx-auto text-center space-y-8`.
  - Background: Simple `<svg>` 48x48 pattern with `opacity-[0.035]`.
  - Eyebrow badge: `<span>COMING SOON</span>` with teal `#2F7C78` dot.
  - Headline: `Legal help, made simpler.` (H1, 3xl to 5xl).
  - Subtitle: `We're building a better way to discover and connect with legal professionals.`
  - Embeds `<WaitlistForm />`.
  - Footer: Simple flex row with copyright and tagline.

- **Redesign Requirements**:
  1. **Asymmetric Split Layout**:
     - Desktop (`lg` breakpoint): Two-column asymmetric layout (e.g. 7:5 or 6:6 grid column split or flex layout with text on left, form panel on right).
     - Mobile: Clean vertical stack with appropriate padding and tight vertical rhythm (no excessive dead space).
  2. **Left Editorial Panel**:
     - Small Eyebrow: `COMING SOON / 01` (incorporating section marker / numbering).
     - Headline: `Legal help, made simpler.` (bold, high-contrast, editorial sans-serif).
     - Brand Statement: Concise, human, confident paragraph explaining the pre-launch mission.
     - Visual Depth Accents: Translucent oversized watermark typography (e.g. `MYLAW`), large subtle `01` numeral, thin editorial accent rules, subtle grid background.
  3. **Right Waitlist Panel**:
     - Elevated card or surface container with subtle border (`#E6E8EC`), soft background (`#FFFFFF` or `#F7F8FA`), and restrained shadow (`0 1px 3px rgba(16, 24, 40, 0.05)`).
     - Houses `WaitlistForm.tsx`.
  4. **Atmospheric Tint / Gradient**:
     - Subtle navy-to-blue atmospheric gradient / tint in the hero zone (`from-[#285A8E]/5 via-[#172033]/3 to-transparent`) while preserving the overall light aesthetic.
  5. **Header & Footer**:
     - Clean navigation with MyLaw wordmark/logo on left and `← Back to Home` on right.
     - Minimal footer with Brand, Privacy, Terms, Contact, and Copyright text.

---

### 3.2. `src/components/waitlist/WaitlistForm.tsx` (Current Implementation Analysis)
- **Current Behavior**:
  - Client component (`"use client"`).
  - Wraps content in `<Suspense fallback={<WaitlistFormFallback />}>` to safely use `useSearchParams()`.
  - Parses query param `role` (supports `?role=lawyer`, `?role=help`, etc.).
  - State: `email` (string), `role` (`"help" | "lawyer" | null`), `isSubmitting` (boolean), `isSubmitted` (boolean), `fadeState` (`"visible" | "fading-out" | "fading-in"`).
  - Handles client-side submission with 200ms debounce + fade animation, switching to a success message.
  - Role selector uses native radio input circles `<input type="radio" ... />`.

- **Redesign Requirements**:
  1. **Unified Input + Button Component**:
     - Height: 48–52px (`h-12` or `h-[50px]`).
     - Subtle border (`#E6E8EC`), border radius (8–10px, `--radius-brand-md`), clean focus ring (`ring-[#285A8E]/20`).
     - Can be designed as a cohesive unified bar on desktop (input seamlessly paired with primary submit button) with clean responsiveness on mobile.
  2. **Custom Selectable Role Blocks (No OS Radio Rings)**:
     - Replace native `<input type="radio">` circles with clean, clickable custom UI blocks / toggle pills (`Looking for legal help` / `Lawyer`).
     - Active state: Subtle brand blue tint (`bg-[#285A8E]/10`, `border-[#285A8E]`, `text-[#285A8E]`, bold weight).
     - Inactive state: Subtle neutral border (`border-[#E6E8EC]`, `bg-white`, `text-[#667085]`, hover `#F7F8FA`).
  3. **Client-Side Success State Transition**:
     - Fast, smooth animation (150–300ms) with `role="status"` and `aria-live="polite"`.
     - Headline: `You're on the list.`
     - Description: `Thanks for joining MyLaw. We'll let you know when we're ready.`
     - Subtle checkmark in brand teal (`#2F7C78`) and `← Back to Home` link.
  4. **Micro-interactions**:
     - Arrow icon translates 3–4px on button hover (`group-hover:translate-x-1`, `transition-transform duration-200`).
     - Smooth input focus transitions (border color + ring glow).
     - Zero heavy animation libraries; strictly CSS transitions (150–300ms).

---

## 4. Landing Page Isolation Boundaries

To strictly satisfy **Acceptance Criteria R7 / AC-Landing ("The landing page (`/`) remains entirely unmodified and functional")**, the following boundaries are established:

### Untouchable Landing Page Components:
- `src/app/page.tsx`
- `src/components/Navbar.tsx`
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/ProblemSection.tsx`
- `src/components/landing/HowItWorksSection.tsx`
- `src/components/landing/WhyMyLawSection.tsx`
- `src/components/landing/WhoItsForSection.tsx`
- `src/components/landing/AboutSection.tsx`
- `src/components/landing/FinalCtaSection.tsx`
- `src/components/landing/MockupPreview.tsx`

Any shared header or footer needed by `/waitlist` should either be implemented directly in `src/app/waitlist/page.tsx` or as dedicated components in `src/components/waitlist/`, leaving `src/components/Navbar.tsx` isolated for `/`.

---

## 5. Design System Tokens, CSS & Utilities

### 5.1. Color Palette (Declared in `src/app/globals.css` and `design.md`)
| Token Name | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| `White` / `--color-brand-bg` | `#FFFFFF` | Primary background, surface cards, button text |
| `Soft Grey` / `--color-brand-bg-soft` | `#F7F8FA` | Secondary backgrounds, subtle pill tags |
| `Warm Off-white` / `--color-brand-bg-warm` | `#F6F3EC` | Warm accent background |
| `Deep Navy` / `--color-brand-text-primary` | `#172033` | Primary text, dark accents, footer text |
| `Muted Text` / `--color-brand-text-secondary` | `#667085` | Subtitles, labels, descriptions, microcopy |
| `Border` / `--color-brand-border` | `#E6E8EC` | 1px clean editorial borders, input borders |
| `Primary Accent` / `--color-brand-accent` | `#285A8E` | Primary CTA buttons, active role borders, links |
| `Accent Hover` / `--color-brand-accent-hover` | `#1e4670` | Button hover state |
| `Muted Teal` / `--color-brand-accent-teal` | `#2F7C78` | Status dots, checkmark icons, editorial accents |

### 5.2. Border Radius & Shadows
- **Small Radius**: `6px` (`rounded-[6px]`) — Badges, pills, secondary buttons
- **Medium Radius**: `10px` (`rounded-[10px]`) — Form containers, cards, inputs
- **Large Radius**: `14px` (`rounded-[14px]`) — Section panels
- **Shadow**: `0 1px 3px rgba(16, 24, 40, 0.05)` (`shadow-[0_1px_3px_rgba(16,24,40,0.05)]`)

### 5.3. Prohibited Design Patterns (Strict Verification Rules)
- ❌ No gavels, scales of justice, courtrooms, or judicial gavels.
- ❌ No dark mode styles (`dark:`) or dark mode media queries.
- ❌ No generic AI illustrations or purple/indigo gradient hype styles.
- ❌ No fake statistics, fabricated user counts, or fake reviews.
- ❌ No animations > 300ms, parallax, 3D libraries, or cursor effects.

---

## 6. Verification & Test Suite Compatibility

The existing repository includes comprehensive verification tests in `tests/`:
- `tests/challenger_final_adversarial.test.mjs`
- `tests/e2e/tier1-feature-coverage.test.mjs`
- `tests/e2e/tier2-boundary-corner.test.mjs`
- `tests/e2e/tier3-cross-feature.test.mjs`
- `tests/e2e/tier4-scenarios-negative.test.mjs`

### Key Invariants to Maintain:
1. **Query Param Support**: `parseRoleParam()` in `WaitlistForm.tsx` must handle `?role=lawyer` and `?role=help` gracefully.
2. **Form Accessibility**: Input must have `id="waitlist-email"`, `type="email"`, `required`, associated `<label htmlFor="waitlist-email">`, and trimmed validation.
3. **Success State Semantics**: Must retain `role="status"` and `aria-live="polite"` on the success message container.
4. **Build & Lint**: `npm run build` and `npm run lint` must exit with code 0.

---

## 7. Downstream Implementation Recommendations

1. **For Layout Implementer (`src/app/waitlist/page.tsx`)**:
   - Construct a full-height container (`min-h-screen flex flex-col justify-between bg-white text-[#172033] relative overflow-hidden`).
   - Implement the atmospheric gradient overlay (`absolute inset-0 bg-gradient-to-b from-[#285A8E]/[0.03] via-transparent to-white -z-10 pointer-events-none`).
   - Add faint background editorial elements (low opacity SVG grid + oversized translucent typography / watermark `MYLAW` in `#172033` with `opacity-[0.02]`).
   - Design the two-column asymmetric grid on `lg` (`lg:grid lg:grid-cols-12 lg:gap-12 items-center`):
     - Left column (`lg:col-span-6` or `7`): Eyebrow `COMING SOON / 01`, H1 headline `Legal help, made simpler.`, concise mission paragraph, and subtle translucent `01` numbering.
     - Right column (`lg:col-span-6` or `5`): Elevated waitlist card panel containing `<WaitlistForm />`.
   - Incorporate clean navigation header and full minimal footer with Privacy, Terms, Contact links.

2. **For Form Implementer (`src/components/waitlist/WaitlistForm.tsx`)**:
   - Implement custom UI toggle blocks for `I am a: [ Looking for legal help ] [ Lawyer ]` using button/div controls without native OS radio circles.
   - Build the cohesive 48-52px unified email input + submit button element with hover arrow animation (`group-hover:translate-x-1`).
   - Preserve client-side validation (`email.trim()`), 150-300ms transition, and success screen with teal checkmark and back link.
