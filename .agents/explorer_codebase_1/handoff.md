# Codebase Architecture Exploration Report: MyLaw Pre-Launch Web Platform

## 1. Observation

### 1.1 Project Scaffolding & Configuration Files
- **`package.json`** (`/Users/koustavdey/mylaw/package.json`):
  ```json
  {
    "name": "mylaw",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "eslint"
    },
    "dependencies": {
      "next": "16.3.3",
      "react": "19.2.8",
      "react-dom": "19.2.8"
    },
    "devDependencies": {
      "@tailwindcss/postcss": "^4",
      "@types/node": "^20",
      "@types/react": "^19",
      "@types/react-dom": "^19",
      "eslint": "^9",
      "eslint-config-next": "16.3.3",
      "tailwindcss": "^4",
      "typescript": "^5"
    }
  }
  ```
- **`tsconfig.json`** (`/Users/koustavdey/mylaw/tsconfig.json`):
  - Configures path alias `"@/*": ["./src/*"]` (lines 21-23).
  - Target: `"ES2017"`, `"moduleResolution": "bundler"`, `"strict": true`.
- **`postcss.config.mjs`** (`/Users/koustavdey/mylaw/postcss.config.mjs`):
  - Configures `@tailwindcss/postcss` plugin (lines 1-8).
- **`next.config.ts`** (`/Users/koustavdey/mylaw/next.config.ts`):
  - Standard empty config (`const nextConfig: NextConfig = {}`).
- **`eslint.config.mjs`** (`/Users/koustavdey/mylaw/eslint.config.mjs`):
  - Configures ESLint 9 flat config using `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- **`AGENTS.md`** (`/Users/koustavdey/mylaw/AGENTS.md`):
  - Points to `node_modules/next/dist/docs/` for version-matched Next.js 16 breaking change rules.

### 1.2 Build & Lint Baseline Verification
- Running `npm run build` executed `next build` on Next.js 16.3.3 with Turbopack and completed successfully:
  ```text
  ▲ Next.js 16.3.3 (Turbopack)
  ✓ Running next.config.ts took 117ms
    Creating an optimized production build ...
  ✓ Compiled successfully in 3.3s
    Running TypeScript ...
    Finished TypeScript in 1193ms ...
    Generating static pages using 5 workers (4/4) in 337ms
  Route (app)
  ┌ ○ /
  └ ○ /_not-found
  ```
- Running `npm run lint` executed `eslint` and exited with return code 0 (no errors).

### 1.3 Next.js 16 Version Details & Documentation
- Next.js version is **`16.3.3`** with **React 19.2.8**.
- In Next.js 16:
  - Turbopack is enabled by default for both `next dev` and `next build`.
  - App Router uses React 19.2 features.
  - Request APIs (`cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams`) are strictly asynchronous Promises.
  - Automatic self-hosting Google Font loader is available via `next/font/google` (`Inter`).

### 1.4 Current Styling & Font Setup
- **`src/app/globals.css`** (`/Users/koustavdey/mylaw/src/app/globals.css`, lines 1-27):
  ```css
  @import "tailwindcss";

  :root {
    --background: #ffffff;
    --foreground: #171717;
  }

  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --font-sans: var(--font-geist-sans);
    --font-mono: var(--font-geist-mono);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --background: #0a0a0a;
      --foreground: #ededed;
    }
  }

  body {
    background: var(--background);
    color: var(--foreground);
    font-family: Arial, Helvetica, sans-serif;
  }
  ```
- **`src/app/layout.tsx`** (`/Users/koustavdey/mylaw/src/app/layout.tsx`, lines 1-30):
  - Currently imports `Geist` and `Geist_Mono` from `next/font/google`.
  - Includes dark mode styles and default Next.js starter metadata ("Create Next App").
- **`src/app/page.tsx`** (`/Users/koustavdey/mylaw/src/app/page.tsx`):
  - Contains default template boilerplate with Next.js/Vercel links and logos.

### 1.5 Missing Elements & Design Requirements
- **Design Tokens Required** (`/Users/koustavdey/mylaw/design.md` & `ORIGINAL_REQUEST.md`):
  - Background: `#FFFFFF`
  - Soft Background: `#F7F8FA`
  - Surface: `#FFFFFF`
  - Primary Text: `#172033`
  - Secondary Text: `#667085`
  - Border: `#E6E8EC`
  - Primary Accent: `#234A7A`
  - Accent Hover: `#193A61`
  - Muted Teal (optional highlight): `#2F6F73`
  - Border Radii: `sm: 6px`, `md: 10px`, `lg: 14px` (pills only for badges/tags)
  - Shadows: Subtle `0 1px 3px rgba(16, 24, 40, 0.05)` (prefer borders over shadows)
  - Font: `Inter` via `next/font/google`
  - Mode: Strictly Light Mode only (no dark mode media query or dark mode overrides)
- **Pages Required**:
  - Landing page (`/` in `src/app/page.tsx`): 7 sections (Hero with coded UI mockup, The Problem, How It Works 3-step sequence, Why MyLaw 4 principles, Who It's For 2 panels, About MyLaw mission, Final CTA)
  - Waitlist page (`/waitlist` in `src/app/waitlist/page.tsx`): Minimal centered layout, email input (`type="email"`, `required`), optional role radio ("Looking for legal help" / "Lawyer"), submit button, client-side success state ("You're on the list.")
  - Shared components: Sticky Navbar (desktop nav + mobile hamburger toggle), Minimal Footer (`© 2026 MyLaw. All rights reserved.`)

---

## 2. Logic Chain

1. **Scaffold Assessment**:
   - The project is cleanly scaffolded with Next.js 16.3.3, Tailwind CSS v4 (`@tailwindcss/postcss`), React 19.2.8, and TypeScript 5.
   - The build toolchain (`next build` with Turbopack and ESLint) is fully functional and validated.

2. **Styling & Theme Alignment**:
   - Tailwind CSS v4 does not use `tailwind.config.js`; instead, it utilizes CSS `@theme` directives directly in `src/app/globals.css`.
   - The default starter CSS in `globals.css` currently contains dark mode media queries and references `--font-geist-sans`.
   - To achieve 100% compliance with `design.md`, `globals.css` must define custom theme variables for MyLaw's exact color palette (`#FFFFFF`, `#F7F8FA`, `#172033`, `#667085`, `#E6E8EC`, `#234A7A`, `#193A61`, `#2F6F73`), radii (6px, 10px, 14px), and remove the dark mode media query.

3. **Typography & Layout Alignment**:
   - `src/app/layout.tsx` currently loads `Geist`.
   - The specification mandates `Inter` from `next/font/google`. Setting `variable: "--font-inter"` with `subsets: ["latin"]` and applying it to the HTML/body ensures standard, high-performance font rendering across all routes.
   - Metadata in `layout.tsx` must be updated with MyLaw branding ("MyLaw — Legal Help, Simplified").

4. **Component Modularization & Icon Strategy**:
   - `lucide-react` is not installed in `package.json`.
   - Rather than adding external package dependencies or risking package mismatches in React 19, creating dedicated, lightweight SVG icon primitives (`CheckIcon`, `ArrowRightIcon`, `MenuIcon`, `CloseIcon`, `SearchIcon`, `ShieldIcon`, `UsersIcon`, `SparklesIcon`) in a UI component directory provides zero runtime overhead, explicit stroke-width styling (1.5px/2px per design spec), and full TypeScript safety.
   - Splitting the 7 landing page sections into isolated components in `src/components/landing/` and the waitlist form into `src/components/waitlist/WaitlistForm.tsx` ensures clear separation of concerns, high maintainability, and clean SSR/client boundaries.

---

## 3. Caveats

- **External Backend**: No database or email backend is connected; the waitlist form state transition is strictly client-side React state, as specified in `ORIGINAL_REQUEST.md`.
- **Future Features Excluded**: As mandated, lawyer profiles, directories, booking systems, and dashboards are intentionally omitted.
- **Imagery Constraint**: Stereotypical legal imagery (gavels, scales, courtrooms, handshakes) is strictly prohibited. The hero visual uses a coded UI mockup panel.

---

## 4. Conclusion & Recommended Architecture

### 4.1 Recommended File & Directory Structure
```
src/
├── app/
│   ├── layout.tsx                   # Root layout (Inter font, metadata, light-only body)
│   ├── globals.css                  # Tailwind v4 @theme, colors, radii, light theme
│   ├── page.tsx                     # Landing page composed of 7 sections + Navbar + Footer
│   ├── waitlist/
│   │   └── page.tsx                 # Coming Soon / Waitlist page
│   └── favicon.ico
├── components/
│   ├── Navbar.tsx                   # Sticky responsive navbar with mobile drawer
│   ├── Footer.tsx                   # Minimal brand footer
│   ├── icons/                       # Feather/Lucide-style lightweight SVG icons
│   │   └── index.tsx                # Check, ArrowRight, Menu, Close, Search, etc.
│   ├── ui/
│   │   ├── Button.tsx               # Primary (#234A7A), Secondary, and Ghost buttons
│   │   └── Badge.tsx                # Small pill badge / eyebrow container
│   ├── landing/
│   │   ├── HeroSection.tsx          # Eyebrow, headline, CTAs, Hero Mockup
│   │   ├── MockupPreview.tsx        # Coded interactive-feel UI mockup panel
│   │   ├── ProblemSection.tsx       # "Legal help can feel complicated..."
│   │   ├── HowItWorksSection.tsx    # 01/02/03 step editorial layout
│   │   ├── WhyMyLawSection.tsx      # 4 principles: Clarity, Choice, Trust, Accessibility
│   │   ├── WhoItsForSection.tsx     # For Individuals & For Lawyers comparison panels
│   │   ├── AboutSection.tsx         # Human, honest company mission section
│   │   └── FinalCtaSection.tsx      # Soft-grey call to action section
│   └── waitlist/
│       └── WaitlistForm.tsx         # Client component: email input, role radio, success state
```

### 4.2 Tailwind CSS v4 Theme Specification (`globals.css`)
```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  --color-brand-bg: #FFFFFF;
  --color-brand-bg-soft: #F7F8FA;
  --color-brand-surface: #FFFFFF;
  --color-brand-text-primary: #172033;
  --color-brand-text-secondary: #667085;
  --color-brand-border: #E6E8EC;
  --color-brand-accent: #234A7A;
  --color-brand-accent-hover: #193A61;
  --color-brand-accent-teal: #2F6F73;

  --radius-brand-sm: 6px;
  --radius-brand-md: 10px;
  --radius-brand-lg: 14px;

  --shadow-brand-subtle: 0 1px 3px rgba(16, 24, 40, 0.05);
}

:root {
  color-scheme: light;
}

body {
  background-color: #FFFFFF;
  color: #172033;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

### 4.3 Key Component Interfaces & Signatures
1. **`Navbar`**:
   - Sticky top bar with `backdrop-blur-md bg-white/90 border-b border-[#E6E8EC]`.
   - Links: `#about`, `#how-it-works`, `#for-lawyers`, and CTA button linking to `/waitlist`.
   - Responsive mobile toggle with accessible hamburger/close states.
2. **`MockupPreview`**:
   - Coded panel with mock search input ("What do you need help with?"), practice area chips (Family Law, Property, Corporate, Employment), and clean professional card layout.
3. **`WaitlistForm`** (`"use client"`):
   - State: `email: string`, `role: 'individual' | 'lawyer' | ''`, `submitted: boolean`.
   - Transitions smoothly to success card ("You're on the list. Thanks for joining MyLaw. We'll let you know when we're ready.") with subtle green/navy checkmark badge.

---

## 5. Verification Method

To verify the architecture and build integrity:
1. **Build Test**:
   ```bash
   npm run build
   ```
   Must compile cleanly with Turbopack, complete TypeScript checks, and exit with code 0.
2. **Lint Test**:
   ```bash
   npm run lint
   ```
   Must produce 0 ESLint errors.
3. **Runtime Check**:
   ```bash
   npm run dev
   ```
   Verify `http://localhost:3000` (Landing page) and `http://localhost:3000/waitlist` (Waitlist page) render with Inter font, exact color tokens, and responsive mobile layouts.
