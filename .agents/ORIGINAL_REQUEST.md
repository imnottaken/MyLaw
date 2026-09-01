# Original User Request

## 2026-09-01T13:01:39Z

Add a compact, elegant MyLaw Assistant chatbot to the website that provides interactive, predefined product information without offering legal advice or free-text input.

Working directory: /Users/koustavdey/mylaw
Integrity mode: demo

## Requirements

### R1. Chatbot Floating Trigger & Panel UI
Add a floating circular assistant button (48–56px) in the bottom-right corner styled in MyLaw blue/navy with a chat/sparkle icon, subtle shadow, and hover tooltip ("Ask MyLaw"). Clicking opens a compact, responsive chat panel (360–400px wide on desktop, comfortable margins on mobile) with a clean header ("MyLaw ● Assistant"), close button, subtle border, 12–16px border-radius, and matching MyLaw aesthetic (#172033, #285A8E, #FFFFFF, #F7F8FA).

### R2. Predefined Knowledge Base & Conversational Flow
Implement an internal question-response database (15–20 predefined items categorized across Core, Why MyLaw, For Seeking Help, For Lawyers, and Launch). On open, show one of several friendly intro messages picked randomly, followed by 5 initial question bubbles (with small arrows/chevrons and pill/subtle styling). When a user clicks a question:
1. Render the user selection bubble.
2. Render the assistant answer bubble with a smooth fade/slide transition.
3. Offer 2–3 relevant follow-up questions and a "← Back to questions" option.
Strictly enforce no free-text input, no dynamic AI generation, and no legal advice. If a legal-advice-related question is triggered, return the standard disclaimer: *"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."*

### R3. Waitlist CTA Integration
For relevant answers (e.g., Launch, Early access, Lawyer onboarding), include an inline CTA button ("Want to be among the first? [ Join the Waitlist → ]") that routes to `/waitlist`. Do not embed a duplicate waitlist form inside the chat panel.

### R4. Non-Destructive Integration & Polish
Integrate the assistant cleanly across the site (e.g., in `layout.tsx` or global scope) without modifying existing section layouts, colors, typography, or content on the landing page or `/waitlist`. Ensure smooth animations (150–250ms), keyboard accessibility (ARIA labels, focus outlines, ESC to close), and seamless mobile responsiveness.

## Acceptance Criteria

### Visual & Component Design
- [ ] Floating assistant trigger button is anchored in the bottom-right corner with a hover tooltip.
- [ ] Chat panel opens/closes smoothly with header "MyLaw ● Assistant" and accessible close action.
- [ ] Color scheme, typography, radii, and shadows strictly match existing MyLaw design tokens.
- [ ] Existing landing page and `/waitlist` page layouts and styles remain completely intact and unaffected.

### Conversational & Data Logic
- [ ] Chatbot opens with a randomly selected intro message.
- [ ] Displays 5 initial question bubbles as clickable buttons.
- [ ] Clicking a question shows the user message bubble followed by the predefined assistant answer.
- [ ] Relevant follow-up questions and a "← Back to questions" button are displayed beneath the answer.
- [ ] No free-text input or AI/LLM API calls are present; all responses are deterministic.
- [ ] Relevant answers render the "Join the Waitlist →" link navigating directly to `/waitlist`.

### Accessibility & Responsiveness
- [ ] Works seamlessly across desktop and mobile viewports without breaking page overflow.
- [ ] All interactive elements are keyboard focusable and have appropriate `aria-label`s.
- [ ] `npm run build` exits with code 0 and zero TypeScript/lint errors.
