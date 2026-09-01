# MyLaw Codebase Survey & Assistant Integration Architecture Report

**Survey Date**: September 1, 2026  
**Auditor**: Teamwork Codebase Survey Explorer  
**Target Repository**: `/Users/koustavdey/mylaw`  
**Working Directory**: `/Users/koustavdey/mylaw/.agents/teamwork_preview_explorer_survey_codebase`  

---

## 1. Executive Summary

This survey report provides an exhaustive architectural, design token, build system, and integration analysis of the **MyLaw** codebase. MyLaw is a pre-launch legal-tech web application designed to connect individuals seeking legal counsel with verified legal practitioners.

The objective of this exploration is to map out existing architectural patterns, styles, design tokens, typography, icon systems, and layout hierarchies in order to design a **compact, elegant, deterministic Assistant chatbot component** that seamlessly mounts into the application without altering or degrading any existing landing page or `/waitlist` page components.

---

## 2. Project Architecture & Directory Map

```
/Users/koustavdey/mylaw/
├── package.json               # Next.js 16.3.3, React 19.2.8, Tailwind v4, Lucide
├── tsconfig.json              # TypeScript strict configuration, @/* alias -> ./src/*
├── next.config.ts             # Next.js build configuration
├── postcss.config.mjs         # PostCSS configuration with @tailwindcss/postcss
├── components.json            # Shadcn base-nova style configuration
├── design.md                  # Authoritative MyLaw design system and brand specification
├── PROJECT.md                 # Project architecture, scope boundaries, interface contracts
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css        # Tailwind v4 @theme, brand tokens, base CSS
│   │   ├── layout.tsx         # RootLayout (Inter font, global html/body wrapper)
│   │   ├── page.tsx           # Landing Page (Navbar + 7 editorial sections)
│   │   └── waitlist/
│   │       └── page.tsx       # Asymmetric Split Waitlist Page
│   ├── components/
│   │   ├── Navbar.tsx         # Responsive sticky/fixed header with mobile drawer
│   │   ├── icons/
│   │   │   └── index.tsx      # Curated lucide-react icon re-exports
│   │   ├── landing/
│   │   │   ├── HeroSection.tsx        # Section 01: Hero + Dual CTAs + Photo overlay
│   │   │   ├── ProblemSection.tsx     # Section 02: Challenge statement + grid SVG
│   │   │   ├── HowItWorksSection.tsx  # Section 03: 3-Step ruled sequence
│   │   │   ├── WhyMyLawSection.tsx    # Section 04: Principles (Trust, Clarity, Choice, Accessibility)
│   │   │   ├── WhoItsForSection.tsx   # Section 05: Asymmetric Dual-Panel (Individuals / Lawyers)
│   │   │   ├── AboutSection.tsx       # Section 06: Mission narrative + architectural photo
│   │   │   ├── FinalCtaSection.tsx    # Section 07: Dark pre-launch CTA + minimal footer
│   │   │   └── MockupPreview.tsx      # Optional abstract UI mockup component
│   │   ├── ui/
│   │   │   ├── button.tsx     # Base UI button with CVA variants
│   │   │   ├── input.tsx      # Base UI input component
│   │   │   ├── label.tsx      # Form label primitive
│   │   │   └── radio-group.tsx# Radio group primitive
│   │   └── waitlist/
│   │       └── WaitlistForm.tsx # Client-side waitlist form with custom role blocks
│   └── lib/
│       └── utils.ts           # Classnames & Tailwind merge utility (cn)
└── tests/
    ├── e2e/                   # 4-tier E2E testing suite
    └── challenger_*.test.mjs  # Adversarial stress test suites
```

---

## 3. Build & Tooling Setup

### 3.1 Framework & Core Runtimes
- **Next.js Version**: `16.3.3` (App Router, Turbopack enabled)
- **React Version**: `19.2.8`
- **React-DOM Version**: `19.2.8`
- **TypeScript**: `^5.0.0` (Strict mode enabled)
- **Node Environment**: Target `ES2017` / `ES2022` modules

### 3.2 Compiler & Path Configurations (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
*Note*: The `@/*` path alias maps directly to `src/*`, enabling clean imports such as `@/components/...`, `@/lib/utils`, etc.

### 3.3 CSS & Tailwind Setup
- **Tailwind Engine**: Tailwind CSS v4 (`tailwindcss: "^4"`, `@tailwindcss/postcss: "^4"`)
- **Animation Support**: `tw-animate-css: "^1.4.0"`
- **Component Primitives**: `@base-ui/react: "^1.7.0"`, `class-variance-authority: "^0.7.1"`, `clsx: "^2.1.1"`, `tailwind-merge: "^3.6.0"`
- **Icons**: `lucide-react: "^1.38.0"` re-exported via `src/components/icons/index.tsx`

---

## 4. Design System & Design Tokens Survey

The MyLaw visual identity is defined in `design.md` and configured directly in `src/app/globals.css`. It sits at the intersection of **modern legal technology + professional SaaS + clean editorial design**.

### 4.1 Exact Color Palette & CSS Variables

| Token Name | Hex / OKLCH Value | Role & Usage |
|---|---|---|
| `--color-brand-bg` | `#FFFFFF` | Primary light background & card surfaces |
| `--color-brand-bg-soft` | `#F7F8FA` | Alternating section backgrounds, message bubbles, subtle hover fills |
| `--color-brand-bg-warm` | `#F6F3EC` | Warm cream editorial accent background (WhyMyLaw section) |
| `--color-brand-surface` | `#FFFFFF` | Surface container background |
| `--color-brand-text-primary` | `#172033` | Primary text color, deep navy headers, dark section backgrounds |
| `--color-brand-text-secondary` | `#667085` | Muted secondary body text, captions, metadata |
| `--color-brand-border` | `#E6E8EC` | Subtle 1px structural borders & dividers |
| `--color-brand-accent` | `#285A8E` | Primary interactive brand blue (buttons, links, active rings) |
| `--color-brand-accent-hover` | `#1e4670` | Hover state for `#285A8E` |
| `--color-brand-accent-teal` | `#2F7C78` | Restrained secondary accent (status dots, badges, subtle highlights) |
| `--color-brand-navy` | `#172033` | Dark navy brand container fill |

### 4.2 Visual Balance Ratio
- **70%** Pure White (`#FFFFFF`)
- **20%** Soft Grey (`#F7F8FA`)
- **8%** Deep Navy (`#172033`)
- **2%** Muted Accent Blue (`#285A8E`) / Muted Teal (`#2F7C78`)

### 4.3 Typography System
- **Primary Font**: `Inter` loaded via `next/font/google` in `src/app/layout.tsx` (`subsets: ["latin"]`, `display: "swap"`, variable: `--font-inter`).
- **Fallback Font**: Geist / System UI sans-serif stack.
- **Hierarchy**:
  - Hero Title: `text-5xl sm:text-6xl lg:text-[68px]` (font-bold)
  - Section Headings (H2): `text-3xl sm:text-4xl lg:text-5xl` (font-bold)
  - Card Titles (H3): `text-lg sm:text-xl` (font-semibold)
  - Body Text: `text-sm` (14px) / `text-base` (16px) / `text-lg` (18px)
  - Eyebrows & Badges: `text-xs` (12px) / `text-[11px]` (font-semibold, uppercase, tracking-wider)
  - Microcopy: `text-xs` (12px) or `text-[11px]` (font-normal/medium)

### 4.4 Border Radii
- Small / Badges / Buttons: `rounded-[6px]` (`--radius-brand-sm`)
- Medium / Cards / Input Fields: `rounded-[8px]` to `rounded-[10px]` (`--radius-brand-md`)
- Large / Dialogs / Assistant Panels: `rounded-[14px]` to `rounded-[16px]` (`--radius-brand-lg`)
- Circular / Status Indicators: `rounded-full`

### 4.5 Elevation & Shadows
- Subtle Border Elevation: `shadow-[0_1px_3px_rgba(16,24,40,0.05)]`
- Floating Action / Chat Panel: `shadow-[0_4px_24px_rgba(23,32,51,0.14),0_1px_3px_rgba(23,32,51,0.06)]`
- *Strict Rule*: Large blurry floating colored glows are prohibited. Borders (`#E6E8EC` or `white/15`) are preferred over heavy shadows.

### 4.6 Animations & Micro-Interactions
- Durations: Snappy `150ms` to `250ms` (e.g. `transition-all duration-200 ease-in-out`).
- Active State: `active:scale-[0.98]` on interactive buttons.
- Arrow Slide: `group-hover:translate-x-1` (3–4px translation on hover).
- *Strict Prohibitions*: Parallax, 3D flips, scroll-jacking, giant bouncing animations, cursor glow effects.

### 4.7 Negative Assertions & Prohibitions (from `design.md` & Test Suites)
- ❌ Zero dark mode classes (`dark:`) or `prefers-color-scheme: dark` media overrides in components.
- ❌ Zero legal tropes: No gavels, scales of justice, courthouses, judges, or cheesy handshake stock photos.
- ❌ Zero fake statistics or fabricated user reviews.
- ❌ Zero purple AI startup hype aesthetics or intense psychedelic gradients.

---

## 5. Existing Pages & Layout Inventory

### 5.1 `src/app/layout.tsx` (Global Shell)
- Declares Google font variables (`inter`, `geist`).
- Applies base classes: `scroll-smooth overscroll-none` on `<html>` and `bg-[#172033] text-[#172033] font-sans antialiased min-h-screen flex flex-col` on `<body>`.
- Wraps `{children}` without route-specific logic.

### 5.2 `src/app/page.tsx` (Landing / About Page)
- Structure:
  - `<Navbar />` (Sticky fixed top-0 with dynamic blur and mobile menu drawer)
  - `<main className="flex-1">` containing:
    1. `HeroSection` (Background photo, dark navy gradient, legal help headline, dual CTAs)
    2. `ProblemSection` (Soft grey `#F7F8FA` background, challenge statement, subtle grid SVG)
    3. `HowItWorksSection` (Pure white `#FFFFFF`, 3-step sequence `01`, `02`, `03`)
    4. `WhyMyLawSection` (Warm `#F6F3EC`, Trust featured card + Clarity, Choice, Accessibility)
    5. `WhoItsForSection` (Dual-panel split for Individuals & Lawyers)
    6. `AboutSection` (Editorial pull-quote, mission copy, architectural photo)
    7. `FinalCtaSection` (Dark navy `#172033` background, Waitlist CTA, minimal footer)
- Anchor targets: `#about`, `#how-it-works`, `#for-lawyers` with `scroll-mt-16`.

### 5.3 `src/app/waitlist/page.tsx` (Waitlist / Coming Soon Page)
- Dedicated Coming Soon page featuring an asymmetric split layout:
  - Left column: "COMING SOON / 01" badge, "Legal help, made simpler." headline, value pillars.
  - Right column: Clean white card containing `<WaitlistForm />`.
- `<WaitlistForm />` is a `"use client"` component wrapped in `<Suspense>` that supports query parameters (`?role=lawyer` or `?role=help`), custom selectable role cards, client-side email sanitization, and a smooth `150-200ms` state transition to a verified success screen (`You're on the list.`).

---

## 6. Non-Destructive Integration Strategy for Assistant Chatbot

To ensure **100% preservation** of the landing page and waitlist page layouts, the Assistant component must be integrated cleanly as an independent, isolated overlay.

### 6.1 Recommended Mounting Location: `src/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Assistant from "@/components/assistant/Assistant"; // Clean global overlay

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyLaw — Legal Help, Simplified",
  description: "A simpler way to discover and connect with the right legal professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth overscroll-none", inter.variable, "font-sans", geist.variable)}>
      <body className="bg-[#172033] text-[#172033] font-sans antialiased min-h-screen flex flex-col overscroll-none">
        {children}
        <Assistant />
      </body>
    </html>
  );
}
```

### 6.2 Key Integration Safeguards
1. **Zero Layout Shift**: The Assistant trigger button and panel are styled using `fixed` positioning (`fixed bottom-5 right-5 sm:bottom-6 sm:right-6`), rendering outside normal document flow so they never shift or compress section margins, heights, or flex structures.
2. **Z-Index Layering**:
   - Background overlays: `-z-10` to `-z-30`
   - Sticky navbar on pages: `z-30` / `z-50`
   - Mobile nav drawer: `z-40`
   - Assistant Trigger & Chat Panel: `z-50`
3. **Mobile Screen Clearance**:
   - Trigger Button: 52px diameter circle anchored `bottom-5 right-5 sm:bottom-6 sm:right-6`.
   - Panel: On mobile screens (`< 640px`), size as `fixed inset-x-3 bottom-20 max-w-[calc(100vw-24px)] max-h-[75vh] sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[380px] sm:max-h-[560px]`.
   - This ensures the panel never overflows horizontal screen bounds and never obstructs mobile bottom gesture areas.
4. **Keyboard & Accessibility Integration**:
   - `aria-expanded` and `aria-label="Ask MyLaw Assistant"` on trigger.
   - `role="dialog"` and `aria-modal="false"` (or `"true"` when active) on the panel with `aria-label="MyLaw Assistant"`.
   - Global `Escape` key listener to close the panel.
   - Clear focus visible outlines (`focus-visible:ring-2 focus-visible:ring-[#285A8E]`).

---

## 7. Recommended Component & Knowledge Base Design

### 7.1 Proposed Component Structure
```
src/components/assistant/
├── Assistant.tsx               # Main client container (trigger button, panel shell, state management)
├── types.ts                   # TypeScript interfaces (QuestionItem, Category, ChatMessage)
└── data/
    └── knowledge-base.ts       # 15-20 deterministic questions, categories, intro greetings, standard disclaimer
```

### 7.2 Deterministic Knowledge Base Categorization (15–20 Items)
1. **Core / About MyLaw**
   - *What is MyLaw?*
   - *Is MyLaw a law firm?*
   - *How much does MyLaw cost to use?*
2. **Why MyLaw / Mission & Values**
   - *Why is MyLaw different from search engines or directories?*
   - *How do you verify legal professionals?*
   - *Is my inquiry confidential?*
3. **For Seeking Help (Individuals & Businesses)**
   - *What areas of law does MyLaw cover?*
   - *Can MyLaw provide me with direct legal advice?* (Triggers standard legal disclaimer)
   - *How do I connect with a lawyer?*
   - *What if I'm not sure what type of lawyer I need?*
4. **For Lawyers / Legal Professionals**
   - *How can lawyers join MyLaw?*
   - *What are the requirements for legal practitioners?*
   - *How will lawyers receive client inquiries?*
5. **Launch & Early Access**
   - *When is MyLaw launching?*
   - *How do I join the early access waitlist?* (Includes Waitlist CTA)
   - *What benefits do early waitlist members receive?* (Includes Waitlist CTA)

### 7.3 Mandatory Legal Disclaimer Implementation
Whenever a user selects questions related to legal representation, specific case analysis, or advice, the assistant deterministically returns the standard disclaimer:
> *"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."*

### 7.4 Waitlist CTA Integration
For questions categorized under Launch, Early Access, or Lawyer Onboarding, the assistant response includes a direct, elegant button:
```tsx
<Link
  href={question.targetUrl || "/waitlist"}
  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#285A8E] hover:bg-[#1e4670] rounded-[6px] transition-all shadow-sm group"
>
  <span>Join the Waitlist</span>
  <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
</Link>
```

---

## 8. Verification & Build Readiness

- `npm run build` is currently passing with code `0` on Next.js 16.3.3 Turbopack.
- Zero external LLM APIs, server actions, or external networks are required for the assistant, guaranteeing instant response times (0ms network latency), deterministic answers, and complete offline reliability.
- All needed icons (`MessageSquare`, `Sparkles`, `X`, `ChevronRight`, `ArrowRight`, `Shield`, `CheckCircle`) are already available in `src/components/icons/index.tsx`.

---

## 9. Conclusion

The MyLaw codebase is clean, strictly typed, and built with modern Next.js 16 and Tailwind v4. Mounting the Assistant chatbot in `src/app/layout.tsx` as an isolated, self-contained client component guarantees that existing landing and waitlist routes remain 100% untouched and functional while providing an intuitive, interactive assistant experience.
