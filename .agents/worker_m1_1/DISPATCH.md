## 2026-09-01T00:26:15Z
You are the Frontend Worker for Milestone 1 (Design Tokens, Global Styles, Inter Font & Shared Layout) for MyLaw.
Your working directory for metadata is: /Users/koustavdey/mylaw/.agents/worker_m1_1/
The project codebase is at /Users/koustavdey/mylaw.
The authoritative request is at /Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md.
The design spec is at /Users/koustavdey/mylaw/design.md.
The project plan is at /Users/koustavdey/mylaw/PROJECT.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You have exclusive write ownership of:
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/icons/index.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`

Scope & Requirements:
1. `src/app/globals.css`:
   - Set up Tailwind CSS v4 `@theme` with exact MyLaw tokens:
     - Background: `#FFFFFF`
     - Soft Background: `#F7F8FA`
     - Surface: `#FFFFFF`
     - Primary Text: `#172033`
     - Secondary Text: `#667085`
     - Border: `#E6E8EC`
     - Primary Accent: `#234A7A`
     - Accent Hover: `#193A61`
     - Subtle Teal Accent: `#2F6F73`
     - Border radii: 6px (`brand-sm`), 10px (`brand-md`), 14px (`brand-lg`)
     - Shadows: subtle `0 1px 3px rgba(16, 24, 40, 0.05)`
     - Transitions: 150-250ms
   - Strictly REMOVE `@media (prefers-color-scheme: dark)` and any dark-mode color overrides. Ensure light-only theme throughout.
2. `src/app/layout.tsx`:
   - Import `Inter` from `next/font/google` (with latin subset, variable `--font-inter`).
   - Remove `Geist` / `Geist_Mono`.
   - Update metadata to: Title "MyLaw — Legal Help, Simplified", Description "A simpler way to discover and connect with the right legal professionals."
   - Set `<html lang="en" className="scroll-smooth">` and `<body className="bg-white text-[#172033] font-sans antialiased min-h-screen flex flex-col">`.
3. `src/components/icons/index.tsx`:
   - Implement zero-dependency, accessible SVG icons: `CheckIcon`, `ArrowRightIcon`, `MenuIcon`, `CloseIcon`, `SearchIcon`, `ShieldIcon`, `UsersIcon`, `SparklesIcon`, `CheckCircleIcon`, etc. (using clean 1.5px/2px strokes, no external dependencies).
4. `src/components/Navbar.tsx`:
   - Sticky header (`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E8EC]`).
   - Desktop view:
     - Left: Wordmark "MyLaw" linking to `/`.
     - Right: Links `About` (`/#about`), `How It Works` (`/#how-it-works`), `For Lawyers` (`/#for-lawyers`), and CTA button `Join Waitlist` linking to `/waitlist` (styled with `#234A7A`, hover `#193A61`, 6px radius).
   - Mobile view (< 768px):
     - Hamburger button toggling mobile menu.
     - Mobile menu drawer with all nav links and full-width `Join Waitlist` button. Auto-closes when link is clicked.
5. `src/components/Footer.tsx`:
   - Background `#F7F8FA` (or `#FFFFFF` with top border `#E6E8EC`).
   - Left: Wordmark "MyLaw" + tagline "A simpler way to discover and connect with the right legal professionals."
   - Right: Links (`About` `/#about`, `Privacy` `#`, `Terms` `#`, `Contact` `mailto:contact@mylaw.com`).
   - Bottom: `© 2026 MyLaw. All rights reserved.`
6. Build & Lint Verification:
   - Run `npm run build` and `npm run lint`.
   - Ensure 0 errors.
7. Write your handoff report to `/Users/koustavdey/mylaw/.agents/worker_m1_1/handoff.md` detailing changes, build/lint outputs, and layout compliance, then notify the orchestrator.
