# Specification Mining Report: Waitlist, Shared Layout, and Global Brand Fidelity

**Project**: MyLaw Pre-Launch Website  
**Author**: Waitlist & Layout Spec Miner  
**Target Path**: `/Users/koustavdey/mylaw/.agents/spec_miner_waitlist_1/handoff.md`  
**Date**: 2026-09-01  
**Status**: COMPLETE  

---

## 1. Observation

### 1.1 Source Documents & Codebase Inspected
1. **`/Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md`**:
   - Mandates two pages: Landing/About (`/`) and Coming Soon/Waitlist (`/waitlist`).
   - R2: Waitlist Page (`/waitlist`) minimal centered Apple-like layout, email input (`type="email"`, `required`), optional role radio ("Looking for legal help" / "Lawyer"), submit button ("Join the Waitlist"), subtle privacy note ("No spam. Just launch updates."), client-side state handling, success state ("You're on the list.", "Thanks for joining MyLaw. We'll let you know when we're ready.", subtle checkmark icon, smooth 150–250ms fade transition).
   - R3: Shared Components (Sticky Navbar with MyLaw wordmark, links [About, How It Works, For Lawyers, Join Waitlist button], mobile hamburger menu; Footer with MyLaw wordmark, short tagline, links [About, Privacy, Terms, Contact], copyright `© 2026 MyLaw. All rights reserved.`).
   - R4: Brand Fidelity (Inter font via `next/font/google`, light-only mode, 6px/10px/14px radii, subtle shadows, Section 26 prohibitions).
   - Acceptance Criteria & Verification checklist.

2. **`/Users/koustavdey/mylaw/design.md`**:
   - Sections 1–8: Product vision, design feeling, 70/20/8/2 color ratio (`#FFFFFF`, `#F7F8FA`, `#172033`, `#667085`, `#E6E8EC`, `#234A7A`, `#193A61`, `#2F6F73`), Inter font hierarchy, 6px/10px/14px radii, subtle shadows (`0 1px 3px rgba(16, 24, 40, 0.05)`), Navbar specs.
   - Section 16: Footer layout and copyright notice.
   - Sections 17–20: Detailed Waitlist layout, coming-soon visual, low-friction waitlist form, success state.
   - Section 21–25: 150–250ms subtle transitions, responsive layout (mobile single-column, 20px padding), UI component boundaries, imagery rules (NO gavel/scales).
   - Section 26: Complete negative assertions / anti-patterns (no dark-mode artifacts, no fake stats/testimonials/lawyer profiles/claims).

3. **Current Codebase State (`/Users/koustavdey/mylaw/src`)**:
   - `src/app/layout.tsx` currently loads `Geist` and `Geist_Mono` instead of required `Inter`.
   - `src/app/globals.css` contains `@media (prefers-color-scheme: dark)` which triggers dark mode artifacts (violates light-only specification).
   - `src/app/page.tsx` contains default Next.js boilerplate.
   - `/waitlist` route does not exist yet.

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Waitlist Page | Centered Minimal Layout | Apple-like centered container with generous whitespace, subtle background or faint geometry, max-w-xl | Viewport resize | Centered vertical stack (`flex flex-col items-center text-center`) | N/A | `design.md` §17, §18; `ORIGINAL_REQUEST.md` R2 |
| 2 | Waitlist Page | Header / Brand Mark | Minimal header with "MyLaw" wordmark linking to `/` | User click | Navigation to `/` | Invalid route falls back to 404 | `design.md` §17; `ORIGINAL_REQUEST.md` R3 |
| 3 | Waitlist Page | Eyebrow Badge | "COMING SOON" uppercase tracking-wide badge/label | Static string | Visual eyebrow above headline | N/A | `design.md` §17; `ORIGINAL_REQUEST.md` §Waitlist |
| 4 | Waitlist Page | Main Headline & Body | Headline: `Legal help, made simpler.` / Subtitle: `We're building a better way to discover and connect with legal professionals.` | Static copy | Formatted typography (H1 36–56px, Body 16–18px `#667085`) | N/A | `design.md` §17 |
| 5 | Waitlist Page | Email Input Field | Single email input with placeholder `Enter your email address`, accessible label | User string input | Valid email value stored in component state | HTML5 constraint validation (`type="email"`, `required`), invalid email prompt | `design.md` §19; `ORIGINAL_REQUEST.md` R2 |
| 6 | Waitlist Page | Optional Role Selector | Radio group: `Looking for legal help` (individual) vs `Lawyer` (professional) with `I am a:` label | User selection (radio/pill toggle) | Role state (`help` \| `lawyer` \| null) | Default to unselected or first option without blocking submission | `design.md` §19; `ORIGINAL_REQUEST.md` R2 |
| 7 | Waitlist Page | Submit Button | Primary CTA button: `Join the Waitlist`, deep navy `#234A7A`, hover `#193A61`, restrained radius (6px/10px) | Form submit event / Click | Triggers validation and state transition to success | Disabled when processing; prevents default POST reload | `design.md` §19; `ORIGINAL_REQUEST.md` R2 |
| 8 | Waitlist Page | Privacy Microcopy | Subtle privacy guarantee: `No spam. Just launch updates.` | Static text | Small 14px `#667085` microcopy below submit button | N/A | `design.md` §17, §19 |
| 9 | Waitlist Page | Client-Side Success State | Replaces form with `You're on the list.` headline, `Thanks for joining MyLaw. We'll let you know when we're ready.`, and subtle checkmark icon | Successful form submit | Success UI card with 150–250ms smooth fade transition | N/A (client demo integrity mode) | `design.md` §20; `ORIGINAL_REQUEST.md` R2 |
| 10 | Waitlist Page | Ambient Background Detail | Very faint geometric line pattern / subtle gradient glow (opacity < 5%) | Optional CSS background | Clean visual depth without distracting from typography | N/A (page must look complete even if disabled) | `design.md` §18 |
| 11 | Shared Layout | Sticky Desktop Navbar | Header stuck to top (`sticky top-0 z-50`), white/semi-translucent with backdrop-blur, 1px bottom border `#E6E8EC` | Scroll position, page load | Visible desktop navbar on `md`+ screens | N/A | `design.md` §8; `ORIGINAL_REQUEST.md` R3 |
| 12 | Shared Layout | Navbar Navigation Links | Links: `About`, `How It Works`, `For Lawyers` | Click events | Smooth scroll to anchor (`#about`, `#how-it-works`, `#for-lawyers`) or route | 404 on dead routes | `design.md` §8; `ORIGINAL_REQUEST.md` R3 |
| 13 | Shared Layout | Navbar CTA Button | `Join Waitlist` primary action button in header right | Click event | Direct navigation to `/waitlist` | N/A | `design.md` §8; `ORIGINAL_REQUEST.md` R3 |
| 14 | Shared Layout | Mobile Navbar Hamburger | Hamburger button (`☰` / accessible SVG icon) on screens `< 768px` with toggle state | Tap/Click | Expand/collapse mobile dropdown menu with 150–250ms transition | Auto-close on menu link tap or escape | `design.md` §8; `ORIGINAL_REQUEST.md` R3 |
| 15 | Shared Layout | Global Footer | Soft grey `#F7F8FA` or white footer with top border `#E6E8EC`, wordmark + tagline left, links right, copyright bottom | Static layout | Responsive footer across all pages | N/A | `design.md` §16; `ORIGINAL_REQUEST.md` R3 |
| 16 | Shared Layout | Footer Links | Links: `About`, `Privacy`, `Terms`, `Contact` | Click events | Anchor or dedicated placeholder/modal links | Graceful fallback without broken UI | `design.md` §16; `ORIGINAL_REQUEST.md` R3 |
| 17 | Shared Layout | Copyright Notice | `© 2026 MyLaw. All rights reserved.` | Static text | Small muted copyright notice | N/A | `design.md` §16; `ORIGINAL_REQUEST.md` §Navbar & Footer |
| 18 | Global Brand | Inter Font System | Single font family `Inter` configured via Next.js Google font variable | Font loader | Cohesive typographic hierarchy throughout app | Fallback to system sans-serif | `design.md` §5; `ORIGINAL_REQUEST.md` R4 |
| 19 | Global Brand | Light-Only Theme Guarantee | Explicit light background `#FFFFFF` / `#F7F8FA`, no dark mode inversion | OS color scheme preference | Renders consistent light theme regardless of OS dark mode | Remove dark mode media overrides in CSS | `design.md` §3; `ORIGINAL_REQUEST.md` R4 |
| 20 | Global Brand | Micro-Interactions & Transitions | Standardized 150–250ms transitions for buttons, links, inputs, and state changes | Hover, focus, active, form submit | Snappy, calm, professional transitions without bounce or lag | Respect `prefers-reduced-motion` | `design.md` §21 |

---

## 3. Edge Cases & Handling Matrix

| # | Feature | Input / Condition | Observed / Required Behavior |
|---|---------|-------------------|-----------------------------|
| 1 | Waitlist Form | Empty email submitted | Native HTML5 `required` tooltip displays; form does not advance to success state. |
| 2 | Waitlist Form | Malformed email (e.g. `user@`, `notanemail`, `@domain.com`) | Browser validation catches invalid format; focus retained on input with aria-invalid indication. |
| 3 | Waitlist Form | Email with leading/trailing spaces (`  alex@example.com  `) | Client sanitizes input with `.trim()` before validating/storing. |
| 4 | Waitlist Form | Submission without selecting optional role | Allowed; submission succeeds with default role null/unspecified. |
| 5 | Waitlist Form | Rapid double-click on "Join the Waitlist" button | Form button disables immediately upon submission or handles idempotently; transitions cleanly to success state. |
| 6 | Waitlist Form | Screen reader submission | `aria-live="polite"` or `role="status"` announces "You're on the list. Thanks for joining MyLaw." |
| 7 | Success State | Page refresh after submission | Resets form to clean initial state (client demo integrity mode, no persistent session lock required). |
| 8 | Mobile Navbar | Mobile screen `< 640px` / `< 768px` | Desktop links hide; hamburger icon aligns right; tapping opens smooth full-width accordion/overlay menu with `Join Waitlist` full-width. |
| 9 | Mobile Navbar | User clicks nav link inside open mobile menu | Menu automatically collapses, and viewport scrolls/navigates to target. |
| 10 | Mobile Navbar | User resizes browser from mobile to desktop viewport while menu is open | Responsive breakpoint classes (`md:hidden`, `md:flex`) ensure mobile menu closes cleanly without layout flicker. |
| 11 | Global Layout | OS prefers dark mode (`prefers-color-scheme: dark`) | Site MUST remain in light theme (`#FFFFFF` background, `#172033` text). The default Next.js dark styles in `globals.css` must be eliminated. |
| 12 | Responsive Breakpoints | Very small screens (320px width, e.g. iPhone SE) | Padding adjusts to `px-4` (16px–20px); headline wraps gracefully without horizontal scrollbars; form controls stack vertically with `w-full`. |
| 13 | Cross-Page Navigation | Clicking "Join the Waitlist" from Landing page hero/CTA/navbar | Smooth client-side navigation to `/waitlist`; page loads centered at top with autofocus on email or clean view. |

---

## 4. Architectural & Component Specification

### 4.1 Route Structure
```
src/
├── app/
│   ├── layout.tsx         # Root Layout: Inter font setup, metadata, light theme wrapper
│   ├── globals.css        # Tailwind v4 theme variables, color tokens, no dark-mode overrides
│   ├── page.tsx           # Landing Page (Hero, Problem, How It Works, Why MyLaw, Who It's For, About, CTA)
│   └── waitlist/
│       └── page.tsx       # Waitlist / Coming Soon Page (Apple-like centered, form + success state)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx     # Sticky navigation with mobile menu drawer
│   │   └── Footer.tsx     # Clean footer with legal/about links and copyright
│   └── waitlist/
│       └── WaitlistForm.tsx # Client component managing email, role, submission & success animation
```

### 4.2 Design Tokens Definition (Tailwind v4 / CSS Variables)
```css
:root {
  --color-bg-primary: #FFFFFF;
  --color-bg-soft: #F7F8FA;
  --color-surface: #FFFFFF;
  --color-text-primary: #172033;
  --color-text-secondary: #667085;
  --color-border: #E6E8EC;
  --color-accent-primary: #234A7A;
  --color-accent-hover: #193A61;
  --color-accent-teal: #2F6F73;
}
```

### 4.3 Typography Scale (Inter Font)
- **Hero Title**: `text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#172033]`
- **Section Heading (H2)**: `text-3xl sm:text-4xl font-semibold tracking-tight text-[#172033]`
- **Sub-heading (H3)**: `text-xl sm:text-2xl font-medium text-[#172033]`
- **Body Regular**: `text-base sm:text-lg text-[#667085] leading-relaxed`
- **Eyebrow / Small**: `text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#234A7A]`
- **Microcopy**: `text-xs sm:text-sm text-[#667085]`

### 4.4 Border Radii Tokens
- **Small (Inputs, Badges, Buttons)**: `rounded-[6px]` (`rounded-md`)
- **Medium (Cards, UI Containers)**: `rounded-[10px]`
- **Large (Hero UI Mockup, Panels)**: `rounded-[14px]`
- **Prohibited**: Unbounded pills on standard buttons/cards.

### 4.5 Waitlist Page (`/waitlist`) Specification Details
1. **Layout**:
   - Background: `#FFFFFF` (with optional extremely faint grid/radial gradient at `< 3%` opacity).
   - Centering: `min-h-screen flex flex-col justify-between`.
   - Header: Wordmark "MyLaw" centered or top-left, linking to `/`.
   - Main container: `max-w-xl mx-auto px-5 py-12 md:py-20 text-center`.
2. **Form Elements**:
   - Eyebrow: `<span className="text-xs font-semibold tracking-widest text-[#234A7A] uppercase">COMING SOON</span>`
   - Headline: `<h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#172033] tracking-tight mt-3 mb-4">Legal help, made simpler.</h1>`
   - Paragraph: `<p className="text-base sm:text-lg text-[#667085] max-w-md mx-auto mb-8">We're building a better way to discover and connect with legal professionals.</p>`
   - Role Radios:
     ```tsx
     <div className="flex items-center justify-center gap-3 mb-6 text-sm text-[#172033]">
       <span className="text-[#667085] text-xs font-medium mr-1">I am a:</span>
       <label className="inline-flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-[6px] border border-[#E6E8EC] hover:bg-[#F7F8FA] transition-colors">
         <input type="radio" name="role" value="help" checked={role === 'help'} onChange={() => setRole('help')} className="accent-[#234A7A]" />
         <span>Looking for legal help</span>
       </label>
       <label className="inline-flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-[6px] border border-[#E6E8EC] hover:bg-[#F7F8FA] transition-colors">
         <input type="radio" name="role" value="lawyer" checked={role === 'lawyer'} onChange={() => setRole('lawyer')} className="accent-[#234A7A]" />
         <span>Lawyer</span>
       </label>
     </div>
     ```
   - Email Input & Button Row:
     - Responsive: Stacks vertically on mobile (`flex-col gap-3`), inline row on tablet/desktop (`sm:flex-row sm:gap-2 max-w-md mx-auto`).
     - Input: `type="email" required placeholder="Enter your email address" className="flex-1 px-4 py-3 border border-[#E6E8EC] rounded-[6px] text-[#172033] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#234A7A] text-sm shadow-[0_1px_3px_rgba(16,24,40,0.05)]"`
     - Submit Button: `type="submit" className="px-6 py-3 bg-[#234A7A] hover:bg-[#193A61] text-white text-sm font-medium rounded-[6px] transition-colors duration-150 shadow-[0_1px_3px_rgba(16,24,40,0.05)] cursor-pointer whitespace-nowrap">Join the Waitlist</button>`
   - Privacy Guarantee: `<p className="text-xs text-[#667085] mt-4">No spam. Just launch updates.</p>`
3. **Success State Transition**:
   - Smooth 150–250ms CSS fade (`transition-opacity duration-200 ease-in-out`).
   - Icon: Subtle green/navy circular checkmark SVG.
   - Title: `<h2 className="text-2xl font-semibold text-[#172033] mb-2">You're on the list.</h2>`
   - Description: `<p className="text-[#667085] text-base mb-6">Thanks for joining MyLaw. We'll let you know when we're ready.</p>`
   - Action: Link `<a href="/" className="text-sm font-medium text-[#234A7A] hover:underline">← Back to Home</a>`.

### 4.6 Navbar Specification Details
- **Sticky Container**: `<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E8EC]">`
- **Inner Wrapper**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between`
- **Left**: `<Link href="/" className="text-xl font-bold tracking-tight text-[#172033]">MyLaw</Link>`
- **Desktop Navigation**:
  - Links: `<Link href="/#about" className="text-sm font-medium text-[#667085] hover:text-[#172033] transition-colors duration-150">About</Link>`
  - `<Link href="/#how-it-works" className="text-sm font-medium text-[#667085] hover:text-[#172033] transition-colors duration-150">How It Works</Link>`
  - `<Link href="/#for-lawyers" className="text-sm font-medium text-[#667085] hover:text-[#172033] transition-colors duration-150">For Lawyers</Link>`
  - CTA Button: `<Link href="/waitlist" className="inline-flex items-center px-4 py-2 bg-[#234A7A] hover:bg-[#193A61] text-white text-sm font-medium rounded-[6px] transition-colors duration-150 shadow-[0_1px_3px_rgba(16,24,40,0.05)]">Join Waitlist</Link>`
- **Mobile Menu**:
  - Button: Hamburger `button` with `aria-label="Toggle navigation"`, `aria-expanded={isOpen}`.
  - Dropdown: `border-b border-[#E6E8EC] bg-white px-4 py-4 space-y-3 md:hidden`.

### 4.7 Footer Specification Details
- **Container**: `<footer className="bg-[#F7F8FA] border-t border-[#E6E8EC] py-12">`
- **Inner Wrapper**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Top Row**:
  - Left Column: `<span className="text-xl font-bold tracking-tight text-[#172033]">MyLaw</span><p className="text-sm text-[#667085] mt-2 max-w-sm">A simpler way to discover and connect with the right legal professionals.</p>`
  - Right Column (Nav Links): Links to `About` (`/#about`), `Privacy` (`#`), `Terms` (`#`), `Contact` (`mailto:contact@mylaw.com` or `#`).
- **Bottom Row**:
  - Divider: `border-t border-[#E6E8EC] mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#667085]`
  - Copyright: `© 2026 MyLaw. All rights reserved.`

---

## 5. Negative Assertions & Section 26 Checklist

Every developer and subagent MUST verify compliance against this strict exclusion matrix:

| Prohibited Anti-Pattern | Reason / Rule | Permitted Alternative |
|-------------------------|---------------|-----------------------|
| ❌ Gavel, scales of justice, courtroom columns, judge's bench imagery | Stereotypical legal tropes prohibited (§24, §26) | Clean coded UI mockups, minimal typography, subtle abstract geometry |
| ❌ Handshake stock photos, lawyer pointing at paper | Generic stock photography prohibited (§24) | Editorial typography and subtle UI component previews |
| ❌ Dark mode theme inversion or dark mode CSS | Site is strictly light-only (§3, §26) | Light background `#FFFFFF` / Soft grey `#F7F8FA` only |
| ❌ Fake statistics (e.g. "10,000+ lawyers", "99% success rate") | Deceptive claims prohibited (§26) | Honest pre-launch framing ("We're building...", "Be among the first") |
| ❌ Fake testimonials or fake user reviews | Fabricated trust signals prohibited (§26) | Clear statement of product mission and core principles |
| ❌ Fake lawyer directory profiles or search mockups with fake ratings | Scope strictly limited to pre-launch waitlist (§1, §23) | High-level abstract category pills (e.g. Family Law, Property) in UI preview |
| ❌ Black + Gold luxury law-firm styling | Prohibited aesthetic (§2, §26) | White, soft grey `#F7F8FA`, and deep navy `#234A7A` SaaS editorial look |
| ❌ Purple AI startup / glowing mesh gradient | Prohibited aesthetic (§26) | Subtle 1px borders `#E6E8EC` and solid navy accents |
| ❌ Heavy drop shadows / glassmorphism | Prohibited (§7, §26) | 1px solid borders `#E6E8EC` + subtle `0 1px 3px rgba(16, 24, 40, 0.05)` |
| ❌ Giant celebration / confetti animation on waitlist submit | Prohibited (§20, §21) | Restrained 150–250ms fade transition with a simple checkmark icon |
| ❌ Parallax, scroll-jacking, 3D elements | Prohibited (§21) | Fast, standard vertical page scroll |
| ❌ Pill-everything rounding (`rounded-full` on all cards/buttons) | Prohibited (§6) | Restrained 6px / 10px / 14px rounding |

---

## 6. Logic Chain

1. **Premise 1**: The user request and `ORIGINAL_REQUEST.md` define a pre-launch website with exactly two pages: Landing page (`/`) and Waitlist page (`/waitlist`), backed by shared Layout components.
2. **Premise 2**: `design.md` defines precise design tokens, color ratios (70% white / 20% soft grey / 8% deep navy / 2% accent), Inter typography, 6/10/14px radii, and minimal 150–250ms transitions.
3. **Premise 3**: The waitlist page requires a low-friction submission flow with client-side state handling (integrity mode: demo), HTML5 validation, optional role toggle, and a clean, understated success state.
4. **Premise 4**: Shared layout components (Navbar and Footer) must provide clean navigation and responsiveness (sticky header, desktop nav links, mobile hamburger drawer, footer copyright `© 2026 MyLaw. All rights reserved.`).
5. **Premise 5**: Section 26 sets strict negative constraints against legal tropes (gavels, scales), fake stats/profiles, and dark-mode artifacts.
6. **Conclusion**: Implementation agents can build the layout and `/waitlist` page with zero ambiguity by following the exact component specifications, design tokens, responsive breakpoints, and negative assertions documented above.

---

## 7. Caveats

- **No Backend Database**: In integrity mode `demo`, waitlist submissions are handled purely client-side with React state (`useState`). No server action or Supabase database table is required unless specified in a subsequent milestone.
- **Route Anchors**: Navigation links (`/#about`, `/#how-it-works`, `/#for-lawyers`) point to section IDs on the landing page (`/`).

---

## 8. Conclusion

All specifications, component interfaces, responsive states, design tokens, edge cases, and brand anti-patterns for the **Waitlist Page**, **Navbar**, **Footer**, and **Global Brand Fidelity** have been fully mined and documented.

---

## 9. Verification Method

1. **Static Spec Inspection**:
   - Confirm all tokens (`#FFFFFF`, `#F7F8FA`, `#172033`, `#667085`, `#E6E8EC`, `#234A7A`, `#193A61`) and font (`Inter`) are referenced.
   - Confirm all Acceptance Criteria in `ORIGINAL_REQUEST.md` R2, R3, R4 are addressed in this report.
2. **Code Verification Command** (once implemented):
   ```bash
   npm run build
   npm run lint
   ```
3. **Interactive Verification**:
   - Visit `http://localhost:3000/waitlist`.
   - Confirm centered layout, "COMING SOON" eyebrow, headline, copy, email input (`type="email"`, `required`), optional role radio, submit button, privacy note.
   - Enter invalid email -> browser validation blocks submit.
   - Enter valid email and click "Join the Waitlist" -> smooth 150–250ms fade to success state with checkmark and "You're on the list."
   - Test responsive navbar hamburger toggle on mobile viewport (<768px).
