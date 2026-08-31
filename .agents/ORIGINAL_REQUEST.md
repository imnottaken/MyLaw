# Original User Request

## 2026-08-31T19:33:00Z

Conduct a focused visual design improvement pass on the existing MyLaw website — a professional legal-tech pre-launch platform at `/Users/koustavdey/mylaw`. This is NOT a rebuild. The existing pages (Landing/About at `/` and Coming Soon/Waitlist at `/waitlist`) are functional and structurally sound. The goal is to make them feel distinctive, polished, premium and trustworthy — moving from generic SaaS to a carefully crafted modern legal-tech brand.

Working directory: /Users/koustavdey/mylaw
Integrity mode: demo

## Context

- The site is built with Next.js 16.3.3 (App Router), React 19, Tailwind CSS v4, TypeScript, and Inter font.
- Read `/Users/koustavdey/mylaw/design.md` before making any changes. It defines the brand, color system, typography, and things to avoid.
- The current site is clean and functional but feels too generic — the visual design pass must produce a noticeable improvement in personality, polish and brand identity without breaking what works.
- Do not build the lawyer marketplace, dashboards, booking system, or any future product features.

## Updated Color Palette

Use these values. Do not simply add color everywhere — use strategically.

```
White:          #FFFFFF
Soft Grey:      #F7F8FA
Deep Navy:      #172033
Blue:           #285A8E
Muted Teal:     #2F7C78
Warm Off-white: #F6F3EC
Border:         #E6E8EC
Muted Text:     #667085
```

## Requirements

### R1. Visual Design Audit
Before making changes, one agent must audit the existing landing page and waitlist page against `design.md` and produce a written list of specific visual weaknesses (e.g. repetitive section compositions, generic card patterns, weak hero personality, flat typography hierarchy, etc.). This audit must be referenced by the implementation agents.

### R2. Landing Page — Visual Design Improvements
Improve the visual design of the existing landing page without rebuilding its structure. Specific improvements required:

1. **Hero** — Give it more visual personality. The product UI mockup must feel like an actual MyLaw product preview, not a generic card. Improve its visual design.
2. **Editorial visual language** — Introduce subtle legal/editorial details across sections: section numbering, thin rules, document-inspired elements, restrained typographic details.
3. **Section composition variety** — Break the repetitive "eyebrow → heading → paragraph → cards" pattern. Each section should have a meaningfully different visual composition.
4. **How It Works** — Make it editorial and visually interesting. Not three identical grey cards.
5. **Principles / Why MyLaw** — Replace four identical cards with a stronger central statement and supporting principles at a different visual weight.
6. **About MyLaw** — More memorable with a strong brand statement and better visual hierarchy.
7. **Section rhythm** — Use white, soft grey, and warm off-white (`#F6F3EC`) backgrounds to create better visual rhythm between sections.
8. **Final CTA** — Redesign as a proper conclusion using a deep navy full-width section with restrained teal detailing.

### R3. Waitlist / Coming Soon Page — Visual Design Improvements
Make the waitlist page more distinctive while keeping it extremely simple. Improvements required:
- Strong, editorial typography with better hierarchy
- Subtle background texture or geometric detail (very low opacity — the page must still look excellent without it)
- A polished, well-designed waitlist form with good input focus states
- Better overall visual presence without adding complexity or new sections

### R4. Micro-interactions
Add tasteful, fast, subtle interactions throughout:
- Button hover: arrow or chevron movement
- Link hover states
- Input focus states (border color, subtle glow)
- Card hover transitions (border, shadow, or subtle lift)
- Smooth section reveals on scroll (subtle, fast — 200ms max, no scroll-jacking)
All animations must be 150–250ms. No parallax, no 3D, no scroll-jacking, no cursor effects.

### R5. Independent Design Review
After implementation, an independent agent must review both pages against `design.md` and the visual improvements list from R1. This agent was not involved in implementation. It must produce a written verdict on: hero personality, section composition variety, editorial language quality, colour use, typography hierarchy, brand fidelity, and prohibited elements (no gavels, no fake stats, no dark mode leakage, no pill-everything design).

### R6. Polish Pass
A final agent resolves any inconsistencies identified by the independent reviewer, ensures visual coherence between both pages, and confirms the build passes.

### R7. Build Quality
`npm run build` must exit with code 0. `npm run lint` must produce no errors. Both pages must render without console errors.

## Acceptance Criteria

### Landing Page — Visual Quality
- [ ] Hero feels visually distinctive from a generic SaaS hero — has brand personality
- [ ] Product UI mockup in hero is recognisably a MyLaw product preview (not a generic card)
- [ ] At least 3 sections have meaningfully different visual compositions from each other
- [ ] How It Works section is editorial — NOT three identical grey cards
- [ ] Principles section does NOT show four identical cards — uses varied visual weight
- [ ] Final CTA section uses deep navy background with teal accent detailing
- [ ] Warm off-white (`#F6F3EC`) or equivalent is used in at least one section background
- [ ] Editorial details (thin rules, section numbers, document-inspired elements) appear in at least 2 sections
- [ ] No section uses the same layout as the adjacent section above it

### Waitlist Page — Visual Quality
- [ ] Page has stronger typographic presence than the current version
- [ ] Form inputs have visible, polished focus states
- [ ] Background has at least one subtle visual detail (pattern, texture, or geometric element at low opacity)
- [ ] Overall page feels premium and intentional

### Micro-interactions
- [ ] At least one button has a hover state with arrow/chevron movement
- [ ] All links have visible hover states
- [ ] All form inputs have visible focus states
- [ ] At least one section or card has a hover transition
- [ ] No animation exceeds 250ms transition duration

### Brand Fidelity
- [ ] No gavels, scales of justice, courthouse imagery, or stereotypical legal stock imagery
- [ ] No fake statistics, testimonials, lawyer profiles, or invented company claims
- [ ] No dark mode artifacts
- [ ] No excessive gradients, glassmorphism, or large floating shadows
- [ ] Muted teal (`#2F7C78`) appears in at least one deliberate design detail
- [ ] Deep navy (`#172033`) is used as a primary text and accent colour

### Code Quality
- [ ] `npm run build` exits with code 0
- [ ] `npm run lint` exits with code 0
- [ ] No TypeScript errors
- [ ] Both pages render without browser console errors

## Verification

1. **Programmatic**: Run `npm run build` and `npm run lint` — both must exit 0.
2. **Render check**: Start `npm run dev`, confirm `http://localhost:3000` and `http://localhost:3000/waitlist` load without errors.
3. **Independent design review** (R5): Independent agent checks every acceptance criterion above against the live pages, using a written rubric. Must flag any criterion not met.
4. **Polish pass** (R6): Resolve all flags from R5.
