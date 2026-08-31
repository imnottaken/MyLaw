# MyLaw Visual Design Audit & Improvement Blueprint (Phase 1 — R1)

**Audit Date**: September 1, 2026  
**Auditor**: Visual Design Auditor (`explorer_audit_1`)  
**Workspace**: `/Users/koustavdey/mylaw`  
**Target Reference**: `/Users/koustavdey/mylaw/design.md` & `/Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md`  

---

## Executive Summary

A comprehensive visual design audit of the MyLaw web platform (`/` and `/waitlist`) was conducted across all components, layout structures, design tokens, typography scales, color assignments, micro-interactions, and brand fidelity guidelines.

While the current site is functionally intact, robustly responsive, and passes all functional/E2E test suites, the visual design currently suffers from several core weaknesses:
1. **Generic SaaS Card Fatigue**: Multiple sections rely on identical 3-card and 4-card grids in uniform rounded containers.
2. **Predictable Section Rhythm**: The landing page alternates mechanically between `#FFFFFF` and `#F7F8FA`, completely omitting the designated Warm Off-white (`#F6F3EC`) and Deep Navy (`#172033`) full-bleed background treatments.
3. **Flat Typography & Missing Editorial Details**: Lack of editorial hallmarks (section numbering, thin rules, document-inspired cues, varied typographic weights, and restrained badges).
4. **Underwhelming Hero & Mockup Presence**: The hero product preview feels like a generic wireframe card rather than a sophisticated legal discovery platform.
5. **Static Micro-interactions**: Missing interactive hover dynamics (button arrow translations, card elevation transitions, refined focus glows).
6. **Token Discrepancies**: Missing the updated palette values (`#285A8E` for Blue, `#2F7C78` for Muted Teal, and `#F6F3EC` for Warm Off-white).

This audit details the exact visual gaps across all 7 landing sections, the navigation bar, footer, and the waitlist experience, followed by a concrete, component-by-component implementation plan for Phases R2, R3, and R4.

---

## 1. Current State vs. Design System Gap Analysis

### 1.1 Color Palette Usage & Fidelity

#### Specified Palette vs. Current Implementation
| Color Name | Target Spec (`ORIGINAL_REQUEST.md`) | Current Codebase Value (`globals.css` / components) | Status & Gap Identified |
|---|---|---|---|
| **White** | `#FFFFFF` | `#FFFFFF` (`--color-brand-bg`, `--color-brand-surface`) | ✅ Compliant (used extensively) |
| **Soft Grey** | `#F7F8FA` | `#F7F8FA` (`--color-brand-bg-soft`) | ✅ Compliant (used for alternating sections) |
| **Deep Navy** | `#172033` | `#172033` (`--color-brand-text-primary`) | ⚠️ Partial: Used solely as text color. Completely missing as a full-bleed dark background in Section 07 (Final CTA). |
| **Blue (Primary Accent)** | `#285A8E` | `#234A7A` / `#193A61` (`--color-brand-accent`) | ⚠️ Token Mismatch: Current code uses `#234A7A` instead of updated `#285A8E` (hover `#1e4670`). |
| **Muted Teal** | `#2F7C78` | `#2F6F73` (`--color-brand-accent-teal`) | ⚠️ Token Mismatch: Current code uses `#2F6F73` instead of updated `#2F7C78`. Used only once in a tiny icon. |
| **Warm Off-white** | `#F6F3EC` | *Not defined* | ❌ Missing: Token is completely absent in `globals.css` and never utilized in any section background. |
| **Border** | `#E6E8EC` | `#E6E8EC` (`--color-brand-border`) | ✅ Compliant (used for borders and dividers) |
| **Muted Text** | `#667085` | `#667085` (`--color-brand-text-secondary`) | ✅ Compliant (used for secondary body text) |

#### Color Usage Strategy & Visual Balance
* **Current Ratio**: ~75% White, ~23% Soft Grey, ~2% Navy/Blue.
* **Problem**: The page feels visually monochromatic and flat. The lack of Warm Off-white (`#F6F3EC`) in the editorial flow and the absence of a Deep Navy (`#172033`) closing section deprives the page of high-contrast anchoring and warmth.
* **Teal Accent Utilization**: Muted teal (`#2F7C78`) should be strategically used for editorial badges, verified credential indicators, or subtle accent borders.

---

### 1.2 Typography Hierarchy & Editorial Styling

#### Typography Assessment
* **Font Family**: Inter (`var(--font-inter)` in `layout.tsx`) is correctly applied with antialiasing.
* **Scale & Weighting**:
  * Hero Heading: 4xl–56px (`text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#172033]`) — good scale, but lacks editorial personality.
  * Section Headings: 3xl–4xl (`text-3xl sm:text-4xl font-bold tracking-tight`) — repetitive size across all 5 middle sections.
  * Eyebrows: Repeated pill style across sections (`rounded-full bg-[#F7F8FA] border border-[#E6E8EC] text-xs font-semibold tracking-wider text-[#234A7A]`).
* **Missing Editorial Language**:
  * **Section Numbering**: Missing legal/editorial markers (e.g. `§ 01`, `01 / 07`, `SECTION 02 — THE PROBLEM`).
  * **Dividers & Rules**: No thin horizontal rules or vertical separator lines separating columns or thematic blocks.
  * **Document-Inspired Details**: No index tags, monograph captions, or structured metadata indicators (e.g., date stamps, verified seals, monospace micro-accents).

---

### 1.3 Section Composition Variety & Rhythm

#### Current Section Progression & Background Analysis
```
1. Navbar         [#FFFFFF / Translucent]
2. Hero           [#FFFFFF]       -> 2-Column Grid (Text + Card)
3. Problem        [#F7F8FA]       -> 1-Column Centered Text Block
4. How It Works   [#FFFFFF]       -> Left Header + 3 Identical Grey Cards Grid
5. Why MyLaw      [#F7F8FA]       -> Left Header + 4 Identical White Cards Grid
6. Who It's For   [#FFFFFF]       -> Left Header + 2 Identical Grey Cards Grid
7. About MyLaw    [#F7F8FA]       -> 2-Column Grid (Title + 3 Paragraphs)
8. Final CTA      [#FFFFFF]       -> 1-Column Centered Text Block
9. Footer         [#F7F8FA]
```

#### Major Section Rhythm Weaknesses
1. **Mechanical Ping-Pong Alternation**: `#FFFFFF` $\to$ `#F7F8FA` $\to$ `#FFFFFF` $\to$ `#F7F8FA` $\to$ `#FFFFFF` $\to$ `#F7F8FA` $\to$ `#FFFFFF`.
2. **Card Pattern Monotony**: Sections 03 (3 cards), 04 (4 cards), and 05 (2 cards) all follow the exact same visual structure: `Eyebrow -> Headline -> Paragraph -> Grid of rounded border boxes with icon and text`.
3. **Lack of Contrast Punch**: Section 07 (Final CTA) on `#FFFFFF` fails to feel like a definitive conclusion or punchy brand finale.

---

### 1.4 Detailed Section-by-Section Evaluation

#### 1. Hero Section (`src/components/landing/HeroSection.tsx` & `MockupPreview.tsx`)
* **Current State**:
  * Left: Pill badge ("LEGAL HELP, SIMPLIFIED") $\to$ H1 ("Finding the right lawyer shouldn't be difficult.") $\to$ P $\to$ 2 Buttons.
  * Right: `MockupPreview` rendering a rounded card with fake browser dots, search bar, 4 practice area buttons, and a small result card.
* **Gaps & Weaknesses**:
  * Hero feels like standard generic SaaS rather than a tailored legal platform.
  * Button icons do not translate on hover.
  * The mockup looks like a simplistic wireframe widget rather than an authentic, high-polish MyLaw interface.
  * Mockup practice chips use harsh dark blue selection state without editorial subtlety.
  * Result card lacks legal depth (e.g. practice focus, verified jurisdiction badge, response time, structured summary).

#### 2. Problem Section (`src/components/landing/ProblemSection.tsx`)
* **Current State**:
  * Centered container with H2 and single paragraph on `#F7F8FA`.
* **Gaps & Weaknesses**:
  * Visually barren; feels like empty filler between Hero and How It Works.
  * Lacks editorial framing (e.g., subtle section indicator `§ 02`, top/bottom rule or warm background tone, quotation/editorial callout styling).

#### 3. How It Works Section (`src/components/landing/HowItWorksSection.tsx`)
* **Current State**:
  * Left header $\to$ 3 identical grey cards (`bg-[#F7F8FA] border border-[#E6E8EC] rounded-[10px]`) in a 3-column row with bold blue numbers "01", "02", "03".
* **Gaps & Weaknesses**:
  * Violates R2.4: "Make it editorial and visually interesting. Not three identical grey cards."
  * The cards look like generic SaaS feature boxes.
  * No visual flow or connection between steps.
  * Step numbers are isolated without editorial integration.

#### 4. Principles / Why MyLaw (`src/components/landing/WhyMyLawSection.tsx`)
* **Current State**:
  * Left header $\to$ 4 identical white cards in a 4-column grid, each containing an icon box, title, and 1-line description.
* **Gaps & Weaknesses**:
  * Violates R2.5: "Replace four identical cards with a stronger central statement and supporting principles at a different visual weight."
  * 4 equal-sized cards create visual clutter and dilute key messaging.
  * Icons in standard grey boxes look generic.

#### 5. Who It's For Section (`src/components/landing/WhoItsForSection.tsx`)
* **Current State**:
  * Left header $\to$ 2 equal grey cards for "For Individuals" and "For Lawyers".
* **Gaps & Weaknesses**:
  * Repeats the exact same card-in-a-box pattern.
  * Dual persona distinction could be significantly more editorial with asymmetric styling, distinctive badge treatments, and interactive hover feedback.

#### 6. About MyLaw Section (`src/components/landing/AboutSection.tsx`)
* **Current State**:
  * 2-column layout (5 cols left for header, 7 cols right for 3 plain paragraphs) on `#F7F8FA`.
* **Gaps & Weaknesses**:
  * Reads like a standard text dump.
  * Lacks a powerful editorial lead statement, pull-quote styling, or visual brand anchor.
  * Ideal candidate for Warm Off-white (`#F6F3EC`) background with high-end editorial borders.

#### 7. Final CTA Section (`src/components/landing/FinalCtaSection.tsx`)
* **Current State**:
  * Centered text on `#FFFFFF` with a single primary CTA button.
* **Gaps & Weaknesses**:
  * Violates R2.8: "Final CTA — Redesign as a proper conclusion using a deep navy full-width section with restrained teal detailing."
  * Fails to create a dramatic closing impression.
  * Button has no interactive arrow slide effect.

---

### 1.5 Waitlist / Coming Soon Page Evaluation (`src/app/waitlist/page.tsx` & `WaitlistForm.tsx`)

* **Current State**:
  * Clean layout with top header, centered card, "COMING SOON" badge, H1, form with role selector, email input, button, and footer.
  * Ambient background: An almost invisible blur circle (`opacity-[0.03]`).
* **Gaps & Weaknesses**:
  * **Typography Presence**: Heading and subheadings are clean but lack editorial gravitas and distinctive legal-tech polish.
  * **Background Visual**: The fuzzy blur circle is generic. Needs an elegant, subtle geometric grid / architectural line detail at very low opacity (3–5%).
  * **Form & Focus States**:
    - Input focus ring is generic (`focus:ring-2 focus:ring-[#234A7A]`). Needs smooth border transition, custom focus tint, and polished shadow.
    - Role selector radio buttons are standard; can be enhanced with refined tactile card pills with subtle active borders and check indicators.
  * **Button Micro-interaction**: Lacks arrow slide or active press feedback.

---

### 1.6 Micro-interactions Audit

| Interaction Type | Current Implementation | Target Requirement (`ORIGINAL_REQUEST.md` R4) | Gap Severity |
|---|---|---|---|
| **Button Hover Arrow** | Static `ArrowRightIcon` inside `<Link>` | Arrow must slide smoothly (e.g. `group-hover:translate-x-1 duration-200`) | ⚠️ High (Explicit Requirement) |
| **Link Hover States** | Simple `hover:text-[#172033]` | Polished color transition + subtle underline or indicator | ⚠️ Medium |
| **Input Focus States** | `focus:ring-2 focus:ring-[#234A7A]` | Refined border color, subtle glow/ring with smooth 150ms ease | ⚠️ Medium |
| **Card Hover Transitions** | None or basic `transition-shadow` | Subtle border highlight (`hover:border-[#285A8E]/40`), smooth lift (`hover:-translate-y-0.5`), duration 200ms | ⚠️ High |
| **Animation Durations** | Transitions vary between 150ms–300ms | Strictly $\le$ 250ms (no parallax, no 3D, no scroll-jacking) | ⚠️ Low (Needs slight adjustment in setTimeout) |

---

### 1.7 Brand Fidelity & Prohibited Elements Audit

* **Prohibited Elements Check**:
  * ❌ Gavels, scales of justice, courtrooms, judges, handshakes: **None found** (100% clean).
  * ❌ Fake statistics, fake lawyer testimonials, invented client claims: **None found** (100% clean).
  * ❌ Dark mode leakage or `dark:` classes: **Zero occurrences** (100% clean).
  * ❌ Purple AI gradients or heavy glassmorphism: **None found** (100% clean).
  * ❌ Pill-everything aesthetic: **Found in section badges** (`rounded-full` on all eyebrows). Needs replacement with restrained, modern editorial badges (`rounded-[4px]` or `rounded-[6px]`).

---

## 2. Recommended Section Rhythm & Background Flow

To create a rhythm that feels varied, editorial, and visually grounded, we recommend replacing the 2-color ping-pong with a 4-tone palette sequence:

```
┌───────────────────────────────────────────────────────────────────┐
│ Section 01: HERO                [#FFFFFF - Pure White]            │
│ Clean, luminous, distinctive product preview with teal highlights │
├───────────────────────────────────────────────────────────────────┤
│ Section 02: THE PROBLEM         [#F7F8FA - Soft Grey]             │
│ Editorial statement framed with section index & subtle borders    │
├───────────────────────────────────────────────────────────────────┤
│ Section 03: HOW IT WORKS        [#FFFFFF - Pure White]            │
│ Asymmetrical / ruled step sequence (No identical grey boxes!)     │
├───────────────────────────────────────────────────────────────────┤
│ Section 04: WHY MYLAW           [#F6F3EC - Warm Off-white]        │
│ Central anchor thesis + hierarchical 3-pillar supporting cards    │
├───────────────────────────────────────────────────────────────────┤
│ Section 05: WHO IT'S FOR        [#FFFFFF - Pure White]            │
│ Asymmetric dual-panel editorial comparison                        │
├───────────────────────────────────────────────────────────────────┤
│ Section 06: ABOUT MYLAW         [#F7F8FA - Soft Grey]             │
│ Editorial manifesto with pull-quote statement & section rule      │
├───────────────────────────────────────────────────────────────────┤
│ Section 07: FINAL CTA           [#172033 - Deep Navy]             │
│ High-contrast conclusion with crisp typography & teal accents     │
├───────────────────────────────────────────────────────────────────┤
│ Section 08: FOOTER              [#F7F8FA - Soft Grey]             │
│ Clean, grounded base with editorial typography & alignment        │
└───────────────────────────────────────────────────────────────────┘
```

---

## 3. Actionable Implementation Blueprint for R2, R3, R4

This blueprint provides explicit, component-by-component instructions for the implementation worker.

### Phase R2: Landing Page Visual Design Improvements

#### 1. Design Tokens & Global Styles (`src/app/globals.css`)
* Add/update design tokens:
  ```css
  --color-brand-bg: #FFFFFF;
  --color-brand-bg-soft: #F7F8FA;
  --color-brand-bg-warm: #F6F3EC;
  --color-brand-surface: #FFFFFF;
  --color-brand-text-primary: #172033;
  --color-brand-text-secondary: #667085;
  --color-brand-border: #E6E8EC;
  --color-brand-accent: #285A8E;
  --color-brand-accent-hover: #1e4670;
  --color-brand-accent-teal: #2F7C78;
  --color-brand-navy: #172033;
  ```
* Ensure `--shadow-brand-subtle` remains `0 1px 3px rgba(16, 24, 40, 0.05)`.
* Retain backward-compatible tokens if referenced by existing tests.

#### 2. Navbar (`src/components/Navbar.tsx`)
* Replace button color `#234A7A` with `#285A8E` (hover `#1e4670`).
* Add subtle hover interaction to the "Join Waitlist" button.
* Refine navigation link hover state with a clean color transition.

#### 3. Section 01 — Hero (`src/components/landing/HeroSection.tsx`)
* **Editorial Eyebrow**: Change from generic `rounded-full` pill to an editorial badge:
  ```tsx
  <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#285A8E] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[6px] uppercase mb-6">
    <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
    <span>§ 01 / LEGAL HELP, SIMPLIFIED</span>
  </div>
  ```
* **Typography**: Maintain 56px H1 with refined leading and letter-spacing.
* **Micro-interactions on CTAs**:
  - Primary CTA: Add `group` class to `<Link>` and `group-hover:translate-x-1 transition-transform duration-200` to the `ArrowRightIcon`.
  - Secondary CTA: Add `hover:border-[#285A8E]/30 transition-all duration-200`.

#### 4. Hero Mockup Preview (`src/components/landing/MockupPreview.tsx`)
* **Refined Legal Interface**:
  - Top Bar: Display "MyLaw Counsel Discovery • Verified Directory" with a subtle green/teal status dot.
  - Search Header: Clean search bar with location badge ("London, UK" or "Any Jurisdiction") + practice area trigger.
  - Practice Area Chips: Restyled with subtle borders and refined active state (navy background `#172033` or `#285A8E` with crisp white text; inactive items with hover `#FFFFFF`).
  - Result Card: Elevate into a realistic verified practitioner profile:
    * Initials avatar in navy/teal circle.
    * Lawyer Name & Title: "Elena Vance • Specialist Counsel".
    * Practice Tag: "Commercial & Property Law".
    * Credentials: "12 yrs exp • Bar Reg #8842 • Verified 2026".
    * Response Time: "Typically responds in < 2 hrs".
    * Action button: "View Profile & Request Contact →" with hover feedback.

#### 5. Section 02 — The Problem (`src/components/landing/ProblemSection.tsx`)
* **Background**: `#F7F8FA`.
* **Editorial Upgrades**:
  - Add an editorial section header: `§ 02 — THE CHALLENGE`.
  - Add a subtle decorative top divider line (`border-t border-[#E6E8EC]`).
  - Restructure text with an editorial lead quote styling: Large, confident headline with refined leading.

#### 6. Section 03 — How It Works (`src/components/landing/HowItWorksSection.tsx`)
* **Background**: `#FFFFFF`.
* **Break Card Pattern**:
  - Remove the 3 identical grey rounded cards.
  - Replace with an **editorial 3-column ruled layout** or **connected step sequence**:
    * Clean horizontal top border dividing each step column.
    * Distinctive large editorial numerals (`01`, `02`, `03`) in `#285A8E` with a muted slash (`01 /`).
    * Step title in `font-semibold text-lg text-[#172033]`.
    * Concise, high-legibility descriptive copy.
    * Clean vertical border rules between columns on desktop (`md:border-r border-[#E6E8EC] md:last:border-r-0`).

#### 7. Section 04 — Principles / Why MyLaw (`src/components/landing/WhyMyLawSection.tsx`)
* **Background**: `#F6F3EC` (Warm Off-white — establishes warm editorial balance!).
* **Break 4-Card Pattern**:
  - Introduce a **powerful central anchor statement**:
    * Left/Top: "Technology designed for trust, not transaction. Four guiding standards govern every feature of MyLaw."
  - Organize the 4 principles with **varied visual weights**:
    * 1 Featured Anchor Principle (e.g. *Trust* — highlighted in a crisp white editorial card with teal detailing `#2F7C78`).
    * 3 Supporting Principles (*Clarity*, *Choice*, *Accessibility*) in clean, structured editorial blocks with refined border dividers and micro-icons.

#### 8. Section 05 — Who It's For (`src/components/landing/WhoItsForSection.tsx`)
* **Background**: `#FFFFFF`.
* **Asymmetric Editorial Dual Panels**:
  - For Individuals: Light grey background (`#F7F8FA`), deep navy button with hover arrow movement.
  - For Lawyers: Crisp white background (`#FFFFFF`) with subtle border (`border-[#E6E8EC]`), secondary button with border transition.
  - Include specific persona badges ("INDIVIDUALS & FAMILIES" vs. "QUALIFIED PRACTITIONERS").

#### 9. Section 06 — About MyLaw (`src/components/landing/AboutSection.tsx`)
* **Background**: `#F7F8FA`.
* **Editorial Structure**:
  - Left column: Section tag `§ 06 — ABOUT MYLAW`, strong headline, and a memorable quote callout ("A platform founded on transparency, dignity, and accessibility in legal guidance.").
  - Right column: 3 structured narrative paragraphs separated by subtle spacing and refined typography.

#### 10. Section 07 — Final CTA (`src/components/landing/FinalCtaSection.tsx`)
* **Background**: **`#172033` (Deep Navy full-width section)**.
* **Contrast & Detailing**:
  - Text: Headline in `#FFFFFF`, supporting copy in `#E6E8EC` / `#98A2B3`.
  - Teal Detailing:
    * Small badge with Muted Teal accent: `text-[#2F7C78] bg-[#2F7C78]/10 border border-[#2F7C78]/20`.
    * Subtle top teal border highlight rule (`border-t-2 border-[#2F7C78]`).
  - Button: Primary white/teal button (`bg-white text-[#172033] hover:bg-[#F6F3EC]` or `bg-[#285A8E] hover:bg-[#1e4670] text-white border border-[#2F7C78]/30`) with animated hover arrow (`group-hover:translate-x-1 duration-200`).

---

### Phase R3: Waitlist / Coming Soon Page Visual Design Improvements

#### 1. Page Header & Back Navigation (`src/app/waitlist/page.tsx`)
* Refine the top bar with subtle border, MyLaw wordmark, and clean "← Back to Home" text link with hover arrow movement.

#### 2. Editorial Typography & Layout Presence
* Heading: Enhanced typography with tighter tracking and editorial leading (`text-4xl sm:text-5xl font-bold tracking-tight text-[#172033]`).
* Subtitle: Clear, confident editorial subtext.
* Eyebrow: Crisp editorial badge: `§ PRE-LAUNCH ACCESS` or `COMING SOON • Q3 2026` with a tiny teal status indicator.

#### 3. Subtle Background Texture / Geometric Grid
* Add a very low-opacity (3–4%) subtle geometric vector grid or architectural document rule pattern in SVG / CSS.
* Keep it purely decorative and non-intrusive (`pointer-events-none -z-10`).
* Verify that the page looks completely polished even if background graphics are disabled.

#### 4. Waitlist Form Polishing (`src/components/waitlist/WaitlistForm.tsx`)
* **Role Selector**:
  - Upgrade role toggle buttons to tactile segmented pills with crisp borders (`#E6E8EC`), active state in `#285A8E` with faint background tint (`bg-[#285A8E]/5`), and smooth transition.
* **Email Input**:
  - Polished focus state: `focus:border-[#285A8E] focus:ring-4 focus:ring-[#285A8E]/10 transition-all duration-200`.
* **Submit Button**:
  - Brand blue `#285A8E` (hover `#1e4670`) with subtle press feedback (`active:scale-[0.98] transition-transform duration-150`).
* **Success State**:
  - High-polish status badge with teal check icon (`#2F7C78`), crisp headline ("You're on the list."), and smooth 200ms entry transition.

---

### Phase R4: Micro-interactions Implementation

1. **Button Arrow Translations**:
   - Add `group` to all CTA `<Link>` and `<button>` components.
   - Add `className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"` to all `ArrowRightIcon` instances.
2. **Card Hover Elevations**:
   - Add `transition-all duration-200 hover:border-[#285A8E]/30 hover:shadow-sm hover:-translate-y-0.5` to interactive cards.
3. **Input Focus Transitions**:
   - Ensure all input fields have smooth 150ms–200ms transitions on border color and focus ring.
4. **Transition Duration Constraint**:
   - Ensure all micro-interactions use durations between 150ms and 250ms (strictly adhere to $\le 250\text{ms}$).

---

## 4. Summary of Key Files to Modify in Subsequent Phases

| File Path | Target Phase | Key Changes |
|---|---|---|
| `src/app/globals.css` | R2 | Update/add color tokens (`#285A8E`, `#2F7C78`, `#F6F3EC`, `#172033`). |
| `src/components/Navbar.tsx` | R2, R4 | Update CTA button colors and hover transitions. |
| `src/components/landing/HeroSection.tsx` | R2, R4 | Editorial badge, button hover arrow translation. |
| `src/components/landing/MockupPreview.tsx` | R2, R4 | High-fidelity legal discovery UI preview with verified credentials and teal highlights. |
| `src/components/landing/ProblemSection.tsx` | R2 | Editorial section indicator `§ 02` and subtle top divider rule. |
| `src/components/landing/HowItWorksSection.tsx` | R2 | Replace 3 identical grey cards with ruled 3-column editorial step sequence. |
| `src/components/landing/WhyMyLawSection.tsx` | R2 | Set background to Warm Off-white (`#F6F3EC`), central anchor thesis, hierarchical principle blocks. |
| `src/components/landing/WhoItsForSection.tsx` | R2, R4 | Asymmetric persona cards with hover dynamics and CTA arrow animations. |
| `src/components/landing/AboutSection.tsx` | R2 | Editorial layout with pull-quote statement and section metadata. |
| `src/components/landing/FinalCtaSection.tsx` | R2, R4 | Full-width Deep Navy (`#172033`) background with Muted Teal (`#2F7C78`) detailing and animated CTA button. |
| `src/app/waitlist/page.tsx` | R3 | Editorial typography, subtle low-opacity geometric background texture. |
| `src/components/waitlist/WaitlistForm.tsx` | R3, R4 | Polished input focus states, refined role selector pills, button micro-interactions. |
| `src/components/Footer.tsx` | R2 | Alignment and color fidelity check. |

---

## 5. Verification Checklist for Implementation

- [ ] `npm run build` exits 0 with zero TypeScript errors.
- [ ] `npm run lint` exits 0 with zero warnings/errors.
- [ ] `npm test` passes all 37 E2E and unit test assertions.
- [ ] Visual verification of Hero, How It Works, Why MyLaw, and Final CTA confirms elimination of generic SaaS card clones.
- [ ] Warm Off-white (`#F6F3EC`) is active in Section 04.
- [ ] Deep Navy (`#172033`) is active in Section 07.
- [ ] Button hover arrows animate $\le 250\text{ms}$.
- [ ] Zero gavels, scales, fake stats, testimonials, or dark mode artifacts.

---
*End of Audit Report.*
