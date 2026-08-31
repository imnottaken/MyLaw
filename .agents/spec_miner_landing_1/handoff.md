# Landing Page (/) Specification Report — MyLaw

## 1. Observation

### 1.1 Source Documents Analyzed
1. `/Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md` (Requirements R1, R3, R4, R5, Acceptance Criteria)
2. `/Users/koustavdey/mylaw/design.md` (Sections 1 through 28, specifically 1-16, 21-28)
3. Current Codebase: `/Users/koustavdey/mylaw/src/app/` (Next.js 16.3.3, Tailwind CSS v4, Inter font configuration)

### 1.2 Verbatim Requirements & Direct Evidence
- **Page Route**: `/` (Landing / About Page)
- **Target Aesthetic**: Modern legal technology + professional SaaS + clean editorial design (70% White, 20% Soft Grey, 8% Deep Navy, 2% Accent).
- **Light-Only Requirement**: No dark mode artifacts; light mode only.
- **Sections Sequence (Exact Order)**:
  1. Section 01: Hero (Eyebrow, Headline, Supporting Copy, Dual CTAs, Coded UI Mockup Panel)
  2. Section 02: The Problem (Short, focused editorial statement)
  3. Section 03: The MyLaw Idea / How It Works (3-step sequence: 01, 02, 03)
  4. Section 04: Why MyLaw (4 core principles: Clarity, Choice, Trust, Accessibility)
  5. Section 05: Who It's For (Split 2 sides: For Individuals vs For Lawyers)
  6. Section 06: About MyLaw (Mission statement, human & straightforward, no buzzwords)
  7. Section 07: Final CTA (Centered call to action leading to waitlist)
- **Shared Components Required on Landing Page**:
  - Sticky Navbar (Wordmark, About, How It Works, For Lawyers, Join Waitlist button, Mobile Hamburger)
  - Minimal Footer (Wordmark, Tagline, Navigation links, Copyright `© 2026 MyLaw. All rights reserved.`)

---

## 2. Comprehensive Specification Breakdown

### 2.1 Design Tokens & Theme Specification

| Token Name | Hex Value | Role / Usage |
|---|---|---|
| Background | `#FFFFFF` | Primary page & section background |
| Soft Background | `#F7F8FA` | Alternating section background, subtle cards, chips |
| Surface | `#FFFFFF` | Card surface, UI panel surface |
| Primary Text | `#172033` | Headings, titles, high-emphasis text |
| Secondary Text | `#667085` | Subtitles, body descriptions, meta info |
| Border | `#E6E8EC` | 1px clean dividers, card borders, input borders |
| Primary Accent | `#234A7A` | Primary CTA buttons, key highlights, numerals |
| Accent Hover | `#193A61` | Button hover & active states |
| Subtle Teal Accent | `#2F6F73` | Optional restrained badge / micro-accent |
| Font Family | `Inter, sans-serif` | Unified font across all headings & body |
| Radii Small | `6px` (`rounded-[6px]`) | Badges, small tags |
| Radii Medium | `10px` (`rounded-[10px]`) | Buttons, standard cards |
| Radii Large | `14px` (`rounded-[14px]`) | Feature panels, hero mockup container |
| Subtle Shadow | `0 1px 3px rgba(16, 24, 40, 0.05)` | Micro elevation (prefer 1px border over shadow) |

---

### 2.2 Section-by-Section Interface & Content Specification

```
+-----------------------------------------------------------------------------------+
| NAVBAR (Sticky, #FFFFFF, Border-b #E6E8EC)                                       |
| [ MyLaw ]                      [ About ] [ How It Works ] [ For Lawyers ] [ Join Waitlist ] |
+-----------------------------------------------------------------------------------+
| SECTION 01: HERO (#FFFFFF)                                                        |
|   Eyebrow: LEGAL HELP, SIMPLIFIED                                                |
|   Headline: Finding the right lawyer shouldn't be difficult.                     |
|   Body: MyLaw is building a simpler way to discover and connect with the right    |
|         legal professionals for your needs.                                       |
|   CTAs: [ Join the Waitlist -> /waitlist ]  [ Learn More -> #how-it-works ]       |
|   Right Column: CODED UI MOCKUP PANEL                                             |
|     - Header: "Find legal help"                                                   |
|     - Search bar: [ What do you need help with? ]                                 |
|     - Practice tags: [Family Law] [Property] [Corporate] [Criminal]               |
|     - Verified match preview snippet                                              |
+-----------------------------------------------------------------------------------+
| SECTION 02: THE PROBLEM (#F7F8FA)                                                |
|   Headline: Legal help can feel complicated before it even begins.                |
|   Body: Finding a suitable lawyer often involves searching through scattered       |
|         information, relying on recommendations, or simply not knowing where to   |
|         start.                                                                    |
+-----------------------------------------------------------------------------------+
| SECTION 03: HOW IT WORKS / THE MYLAW IDEA (#FFFFFF)                               |
|   Eyebrow: HOW IT WORKS                                                           |
|   Headline: We're making the first step simpler.                                  |
|   Subtitle: MyLaw is being built to bring legal professionals and people looking  |
|             for legal help together through a clearer, more accessible platform.  |
|   3-Step Cards:                                                                   |
|     [ 01: Tell us what you need ]                                                 |
|     [ 02: Discover relevant legal professionals ]                                 |
|     [ 03: Connect with the right one ]                                            |
+-----------------------------------------------------------------------------------+
| SECTION 04: WHY MYLAW / CORE PRINCIPLES (#F7F8FA)                                |
|   Eyebrow: OUR PRINCIPLES                                                         |
|   Headline: Built on clarity, choice, and trust.                                  |
|   4 Feature Cards (Minimal Icons):                                                |
|     [ Clarity: Make finding legal help easier to understand ]                     |
|     [ Choice: Help people discover professionals suited to their needs ]          |
|     [ Trust: Present useful professional information clearly and responsibly ]    |
|     [ Accessibility: Make the first step toward legal help easier to take ]       |
+-----------------------------------------------------------------------------------+
| SECTION 05: WHO IT'S FOR (#FFFFFF)                                                |
|   Eyebrow: WHO IT'S FOR                                                           |
|   Headline: Designed for both sides of legal care.                                |
|   Two-Column Cards:                                                               |
|     [ For Individuals ]                                 [ For Lawyers ]           |
|       - "Find legal help with confidence."               - "Build your presence." |
|       - Description & key benefits                       - Description & benefits |
|       - [ Join the Waitlist ]                            - [ I'm a Lawyer ]       |
+-----------------------------------------------------------------------------------+
| SECTION 06: ABOUT MYLAW (#F7F8FA)                                                |
|   Eyebrow: ABOUT MYLAW                                                            |
|   Headline: We're building a better starting point for legal help.                |
|   Body: Grounded, human mission statement explaining why MyLaw exists without     |
|         corporate buzzwords or fake statistics.                                   |
+-----------------------------------------------------------------------------------+
| SECTION 07: FINAL CTA (#F7F8FA / #FFFFFF)                                        |
|   Headline: Be among the first to experience MyLaw.                               |
|   Body: We're getting ready to launch. Join the waitlist and we'll keep you       |
|         updated.                                                                  |
|   CTA: [ Join the Waitlist -> /waitlist ]                                         |
+-----------------------------------------------------------------------------------+
| FOOTER (#FFFFFF, Border-t #E6E8EC)                                               |
|   Left: MyLaw + "A simpler way to discover and connect with legal professionals." |
|   Right: About | How It Works | For Lawyers | Privacy | Terms                     |
|   Bottom: © 2026 MyLaw. All rights reserved.                                      |
+-----------------------------------------------------------------------------------+
```

---

## 3. Features Discovered Table

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Navigation | Sticky Navbar | Fixed/sticky top navigation bar with brand wordmark and anchor links | Scroll position, click events | Rendered header with links and CTA | Degrades to static if sticky unsupported | `design.md` §8, `ORIGINAL_REQUEST.md` R3 |
| 2 | Navigation | Mobile Hamburger Menu | Collapsible slide-down or drawer menu for mobile viewports (< 768px) | Hamburger button click | Opened/closed state with full navigation links | Closes on backdrop click or link selection | `design.md` §8, §22, `ORIGINAL_REQUEST.md` R3 |
| 3 | Hero | Eyebrow Badge | Small tracking-wide label `LEGAL HELP, SIMPLIFIED` | Static text | Rendered pill or uppercase label in `#234A7A` | N/A | `design.md` §9, `ORIGINAL_REQUEST.md` AC |
| 4 | Hero | Main Headline | Primary statement: `Finding the right lawyer shouldn't be difficult.` | Static text | 56-72px desktop / 40-48px mobile H1 | N/A | `design.md` §9, `ORIGINAL_REQUEST.md` AC |
| 5 | Hero | Supporting Copy | Explanatory 1-2 sentence brand introduction | Static text | 16-18px body text in `#667085` | N/A | `design.md` §9 |
| 6 | Hero | Primary & Secondary CTAs | Dual action buttons: `Join the Waitlist` (solid `#234A7A`) and `Learn More` (outline `#E6E8EC`) | Click events | Route to `/waitlist` or smooth scroll to `#how-it-works` | Fallback URL navigation | `design.md` §9, `ORIGINAL_REQUEST.md` AC |
| 7 | Hero | Coded UI Mockup Panel | Minimal interactive/visual preview card of search and practice areas (Family, Property, Corporate, Criminal) | Optional chip hover/click | Rendered card with border `#E6E8EC`, bg `#FFFFFF`, simulated search bar and tags | No stock photos or legal cliches | `design.md` §9 (Option A), `ORIGINAL_REQUEST.md` R1 |
| 8 | Section 02 | The Problem | Concise statement on the pain points of finding legal counsel | Static text | Headline + short paragraph over `#F7F8FA` | N/A | `design.md` §10 |
| 9 | Section 03 | 3-Step Sequence (How It Works) | 3 numbered editorial blocks (01 Tell us what you need, 02 Discover relevant legal professionals, 03 Connect with the right one) | Static data | 3-column desktop / 1-column mobile layout over `#FFFFFF` | N/A | `design.md` §11, `ORIGINAL_REQUEST.md` AC |
| 10 | Section 04 | Why MyLaw Principles | 4 value propositions (Clarity, Choice, Trust, Accessibility) with minimal stroke icons | Static data | 4-card grid over `#F7F8FA` | No cartoon illustrations | `design.md` §12 |
| 11 | Section 05 | Dual Audience Split (Who It's For) | Side-by-side comparison for Individuals vs Lawyers with distinct copy and action buttons | Click events | 2-column card layout over `#FFFFFF`, linking to `/waitlist` | Both CTAs route smoothly to waitlist | `design.md` §13, `ORIGINAL_REQUEST.md` AC |
| 12 | Section 06 | About MyLaw Mission | Editorial narrative of company mission avoiding corporate jargon and fake stats | Static text | Clean editorial layout over `#F7F8FA` | N/A | `design.md` §14, §26 |
| 13 | Section 07 | Final CTA Banner | High-impact closing prompt: `Be among the first to experience MyLaw.` with waitlist button | Click event | Centered container leading to `/waitlist` | N/A | `design.md` §15 |
| 14 | Footer | Minimal Footer | Wordmark, product tagline, navigation links, and copyright `© 2026 MyLaw. All rights reserved.` | Click events | Rendered footer over `#FFFFFF` with top border `#E6E8EC` | N/A | `design.md` §16, `ORIGINAL_REQUEST.md` R3 |
| 15 | Styling | Alternating Background Rhythm | Strict alternating rhythm of `#FFFFFF` and `#F7F8FA` across 7 sections | CSS classes | Clear visual rhythm without harsh dividing lines | N/A | `design.md` §3, §25, `ORIGINAL_REQUEST.md` AC |
| 16 | Styling | Typography Scale & Inter Font | Google Font Inter applied uniformly across all breakpoints | CSS font configuration | Precise typographic hierarchy from 14px to 72px | Fallback sans-serif | `design.md` §5, `ORIGINAL_REQUEST.md` AC |
| 17 | Styling | Button Hover & Transition System | Standardized 150-250ms ease transitions on all interactive elements | CSS transitions | Hover color shift `#234A7A` -> `#193A61` | N/A | `design.md` §3, §21 |

---

## 4. Edge Cases & Constraints

| # | Feature | Input / Condition | Observed / Required Behavior |
|---|---------|-------------------|------------------------------|
| 1 | Hero Layout | Viewport width < 640px (Mobile) | Stacks vertically (text on top, UI mockup below), hero headline reduces to 40-46px, CTA buttons become full-width or wrap naturally with px-4 gutter. |
| 2 | Navbar | Mobile screen with navigation opened | Mobile menu overlays or slides down smoothly without horizontal layout shifts; body scroll remains accessible; clicking any link closes the menu. |
| 3 | Section 05 CTAs | User clicks "I'm a Lawyer" CTA | Navigates to `/waitlist?role=lawyer` (or `/waitlist`) so lawyer intent is preserved or handled cleanly. |
| 4 | Section 03 & 04 Grid | Tablet viewport (768px - 1024px) | Graceful grid wrapping (e.g. 2x2 for Section 04, 3-column or clean stacked for Section 03) without text clipping. |
| 5 | Theme Mode | OS in Dark Mode (`prefers-color-scheme: dark`) | The website MUST remain in light mode (`#FFFFFF` / `#F7F8FA` / `#172033`). All dark-mode overrides in `globals.css` must be eliminated. |
| 6 | Imagery & Graphics | Image rendering | Absolutely NO gavels, scales of justice, courtrooms, or generic stock handshakes. All visual assets must be pure SVG/code UI panels. |
| 7 | Smooth Anchor Scrolling | Clicking `About` or `How It Works` from Navbar | Page smoothly scrolls to `#about` or `#how-it-works` with appropriate offset for the sticky navbar height (`scroll-pt-20`). |

---

## 5. Logic Chain

1. **Brand Identity & Tone**: `design.md` establishes MyLaw as a calm, trustworthy, modern legal platform combining SaaS precision with editorial typography.
2. **Structural Composition**: The 7 sections in `design.md` map 1:1 to user discovery flow: Attention (Hero) -> Problem Validation (Problem) -> Solution Clarity (How It Works) -> Core Values (Principles) -> Audience Fit (Who It's For) -> Mission Authenticity (About) -> Conversion (Final CTA).
3. **Alternating Background System**: By alternating `#FFFFFF` and `#F7F8FA` across sections 1 through 7, visual fatigue is eliminated while maintaining 90% white/light aesthetic.
4. **Interactive Integrity**: All CTAs lead to `/waitlist`, satisfying user acquisition goals while maintaining clean anchor links for in-page navigation.

---

## 6. Caveats

- No backend database or persistence is required for the pre-launch landing page.
- The UI mockup panel in Section 01 is an abstract product preview, not a functioning search engine or marketplace.
- All lawyer and individual flows converge on the `/waitlist` page.

---

## 7. Conclusion

The specification for the MyLaw Landing Page (`/`) is fully mined, verified, and mapped to design tokens, component hierarchies, exact copy strings, and responsive behaviors. The downstream implementer can directly execute against these exact specifications without ambiguity.

---

## 8. Verification Method

To verify the landing page implementation against this specification:
1. Run `npm run build` from `/Users/koustavdey/mylaw` — must compile with code 0.
2. Run `npm run lint` — must pass without errors.
3. Check `http://localhost:3000` across responsive viewports (375px mobile, 768px tablet, 1280px desktop):
   - Confirm all 7 sections are present in exact order with alternating `#FFFFFF` / `#F7F8FA` backgrounds.
   - Confirm hero displays "LEGAL HELP, SIMPLIFIED", "Finding the right lawyer shouldn't be difficult.", dual CTAs, and coded UI mockup.
   - Confirm no dark mode styles or gavel/scales imagery appear.
   - Confirm navbar collapses to working hamburger on mobile.
   - Confirm all "Join the Waitlist" and "I'm a Lawyer" buttons link to `/waitlist`.
