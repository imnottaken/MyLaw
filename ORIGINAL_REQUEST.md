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

## 2026-09-02T17:50:12Z

Update the existing MyLaw waitlist page form UX to replace the two-card role selector with a streamlined default flow for individuals and a smooth inline expandable verification flow for lawyers.

Working directory: /Users/koustavdey/mylaw
Integrity mode: development

## Requirements

### R1. Default Waitlist Form (Individual Flow)
- Render by default with header:
  - "Join the MyLaw waitlist"
  - "Be the first to know when MyLaw launches."
- Inputs:
  - Email address (type="email", required)
  - Mobile number (type="tel", required)
- Submit button: [ Join the Waitlist → ]
- Understated secondary link below form: "Are you a lawyer? →" (subtle text link, not a primary button/card).
- Submitting saves record with user_type: "individual", leaving lawyer fields null.

### R2. Smooth Inline Lawyer Flow
- Clicking "Are you a lawyer? →" smoothly expands/reveals additional lawyer fields inline on the same page without navigation.
- Lawyer Form Inputs:
  - Email address (required)
  - Mobile number (required)
  - State Bar Council dropdown (required for lawyers, listing all Indian State Bar Councils e.g. Bar Council of Delhi, Bar Council of Maharashtra & Goa, Bar Council of Karnataka, Bar Council of Tamil Nadu & Puducherry, Bar Council of West Bengal, Bar Council of Uttar Pradesh, Bar Council of Punjab & Haryana, Bar Council of Gujarat, Bar Council of Rajasthan, Bar Council of Kerala, Bar Council of Andhra Pradesh, Bar Council of Telangana, Bar Council of Bihar, Bar Council of Madhya Pradesh, Bar Council of Odisha, Bar Council of Assam Nagaland Mizoram Arunachal Pradesh & Sikkim, Bar Council of Jharkhand, Bar Council of Chhattisgarh, Bar Council of Himachal Pradesh, Bar Council of Uttarakhand, Bar Council of Jammu & Kashmir, Bar Council of Tripura, Bar Council of Meghalaya, Bar Council of Manipur)
  - Bar Council Enrollment Number text field (required for lawyers, e.g. placeholder "e.g. D/1234/2020")
- Submit button: [ Join as a Lawyer → ]
- Secondary back link: "← Back to regular waitlist" smoothly collapsing back to the default individual flow.
- Submitting saves record with user_type: "lawyer", bar_council_state, enrollment_number, and verification_status: "pending".

### R3. Data Layer & Supabase Schema Migration
- Update waitlist table in Supabase safely with non-breaking nullable columns if not already present:
  - user_type (TEXT check in ('individual', 'lawyer')) or map existing role
  - mobile (TEXT)
  - bar_council_state (TEXT)
  - enrollment_number (TEXT)
  - verification_status (TEXT default 'pending')
- Handle duplicate email submissions gracefully (code 23505) with friendly confirmation.
- Update Google Sheets webhook payload and Resend email alerts with mobile and lawyer verification details.

### R4. Visual & Responsive Polish
- Preserve the existing premium dark navy aesthetic, glassmorphism, typography, and card styling.
- Responsive for mobile (320px–430px) and desktop without button overflows or awkward line wrapping.

## Acceptance Criteria

### Form Behavior & UX
- [ ] Individual form renders with Email + Mobile fields and "Are you a lawyer? →" link by default.
- [ ] Clicking "Are you a lawyer? →" smoothly animates in State Bar Council and Enrollment Number inputs.
- [ ] Clicking "← Back to regular waitlist" returns cleanly to the individual form without losing filled email/mobile.
- [ ] Mobile number and Email are required with client & server validation on both flows.
- [ ] Lawyer fields (State Bar Council + Enrollment Number) are mandatory ONLY when submitting as a lawyer.

### Backend & Database
- [ ] POST /api/waitlist accepts email, mobile, user_type, bar_council_state, enrollment_number.
- [ ] Supabase waitlist table persists the new columns without breaking existing data.
- [ ] Resend email alerts and Google Sheets sync reflect the user type, mobile number, and bar details.
- [ ] npm run build succeeds with 0 TypeScript or lint errors.
