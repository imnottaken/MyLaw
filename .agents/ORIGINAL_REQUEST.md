# Original User Request

## Initial Request — 2026-09-01T02:13:37+05:30

Redesign the MyLaw Waitlist/Coming Soon page into a premium, sophisticated asymmetric layout that matches the brand's editorial legal-tech aesthetic.

Working directory: /Users/koustavdey/mylaw
Integrity mode: demo

## Requirements

### R1. Layout & Composition
Redesign `/waitlist` using an asymmetric split layout on desktop (stacking naturally on mobile). The left side must feature the headline ("Legal help, made simpler."), a small eyebrow ("COMING SOON / 01"), and a concise brand statement. The right side must feature a refined waitlist panel containing the form. The page must use a subtle navy-to-blue atmospheric gradient or tinted background area behind the hero, while keeping the overall page primarily light. 

### R2. Navigation & Footer
Implement a clean navbar specific to this page: MyLaw logo/wordmark on the left, and a "← Back to Home" link on the right. Implement a minimal footer at the bottom containing only the brand name, Privacy, Terms, Contact links, and copyright text.

### R3. Visual Detail & Brand Fidelity
Introduce subtle visual depth using elements like faint oversized "MYLAW" typography, large translucent "01" numbering, thin editorial lines, or a subtle grid pattern. Strictly avoid gavels, scales of justice, AI illustrations, and excessive glassmorphism. Adhere to the established color palette (Primary: `#172033`, Accent: `#285A8E`, Background: `#FFFFFF`, Soft: `#F7F8FA`).

### R4. Waitlist Form Component
Redesign `WaitlistForm.tsx`. The input and button must feel like one cohesive premium component (48–52px height, subtle border, 8–10px radius, clean focus ring). Redesign the "I am a: [Looking for legal help] [Lawyer]" selector to use custom, clean selectable blocks rather than default OS radio rings. Submitting a valid email must trigger a smooth (150-300ms) client-side transition to a success state ("You're on the list.") without storing the email or hitting a backend. 

### R5. Animations & Micro-interactions
All motion must be subtle and fast (150–300ms). Include fade/slide-in for hero content, a 3-4px hover movement for the button arrow, and smooth focus state transitions. Absolutely no parallax, bouncing elements, or cursor effects.

## Acceptance Criteria

### Visual & Layout
- [ ] Desktop layout is asymmetric (text left, form panel right).
- [ ] Mobile layout stacks logically without excessive empty vertical space.
- [ ] Background incorporates a subtle tint/gradient and subtle editorial details (e.g., grids or faint typography) without turning the page into dark mode.
- [ ] No stereotypical legal imagery (gavels, scales) is present.

### Form Functionality
- [ ] Input and button are correctly sized (48-52px height) with a custom focus state.
- [ ] User type selector uses custom UI blocks, not native HTML radio circles.
- [ ] Form submission validates the email and transitions smoothly to the success message without a page reload or backend call.
- [ ] Button arrow translates correctly on hover.

### Build Quality
- [ ] `npm run build` exits with code 0.
- [ ] No TypeScript or ESLint errors are introduced.
- [ ] The landing page (`/`) remains entirely unmodified and functional.
