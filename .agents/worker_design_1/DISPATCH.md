## 2026-09-01T01:07:17Z

You are assigned as the Implementation Worker for Phase 2 (R2, R3, R4) of the MyLaw visual design improvement pass.

Your working directory: /Users/koustavdey/mylaw/.agents/worker_design_1/
You must create and maintain your BRIEFING.md and progress.md in your working directory.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Authoritative References (MANDATORY: Read these files before starting):
- User Request: /Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md
- Design System: /Users/koustavdey/mylaw/design.md
- Phase 1 Audit & Blueprint: /Users/koustavdey/mylaw/.agents/audit.md

Color Palette Specification:
- White:          #FFFFFF
- Soft Grey:      #F7F8FA
- Deep Navy:      #172033
- Blue:           #285A8E (hover: #1e4670)
- Muted Teal:     #2F7C78
- Warm Off-white: #F6F3EC
- Border:         #E6E8EC
- Muted Text:     #667085

Your Tasks:
1. Update CSS tokens in `src/app/globals.css` ensuring `--color-brand-bg-warm: #F6F3EC`, updated accents (`#285A8E`, `#2F7C78`), and clean shadows.
2. Implement Landing Page improvements (R2):
   - Hero (`HeroSection.tsx` & `MockupPreview.tsx`): Editorial eyebrow badge (`rounded-[6px]`), strong brand personality, interactive CTA buttons with hover arrow sliding (`group-hover:translate-x-1 duration-200`). UI Mockup must be a polished, realistic MyLaw preview (verified credentials, practice area selector, response time indicator, action button).
   - Problem (`ProblemSection.tsx`): Section marker `§ 02`, subtle top divider rule, editorial quote styling.
   - How It Works (`HowItWorksSection.tsx`): Replace the 3 identical grey cards with an editorial 3-column ruled sequence with large step indicators (`01 /`, `02 /`, `03 /`) and column dividers.
   - Principles / Why MyLaw (`WhyMyLawSection.tsx`): Background `#F6F3EC` (Warm Off-white). Strong central anchor statement + varied visual weights (1 featured anchor card with teal detailing + 3 clean supporting principle blocks).
   - Who It's For (`WhoItsForSection.tsx`): Asymmetric dual-panel editorial layout with distinct persona badges and CTA micro-interactions.
   - About MyLaw (`AboutSection.tsx`): Section tag `§ 06`, memorable pull-quote callout, structured narrative paragraphs.
   - Final CTA (`FinalCtaSection.tsx`): Full-width Deep Navy (`#172033`) background with restrained Muted Teal (`#2F7C78`) accent detailing and animated CTA button.
   - Navbar (`Navbar.tsx`) & Footer (`Footer.tsx`): Token updates, link hover transitions, button styling.
3. Implement Waitlist Page improvements (R3):
   - `src/app/waitlist/page.tsx`: Strong editorial typography, subtle low-opacity (3–4%) geometric/architectural line pattern background detail.
   - `src/components/waitlist/WaitlistForm.tsx`: Polished input focus states (ring/glow), tactile role selector pills, button micro-interactions, clean success state with teal checkmark.
4. Implement Micro-interactions (R4):
   - Button hover arrow/chevron transitions (`group-hover:translate-x-1 duration-200`)
   - Link hover transitions
   - Input focus states
   - Card hover transitions (`duration-200`)
   - All transition durations strictly <= 250ms.
5. Adhere to Brand Fidelity:
   - No gavels, scales, fake stats, testimonials, lawyer profiles, dark mode leakage, excessive gradients, or pill-everything.
6. Verify Build, Lint, and Tests:
   - Run `npm run build` (must exit 0)
   - Run `npm run lint` (must exit 0)
   - Run `npm test` (must pass all tests)
   - If any existing tests need minor selector/text adjustments due to visual refactoring, ensure tests accurately reflect the new components and all pass.
