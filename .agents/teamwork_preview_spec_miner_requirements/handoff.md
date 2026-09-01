# Handoff Report: MyLaw Assistant Chatbot Specification Discovery

**Type**: Hard Handoff  
**Agent**: Specification Miner (Requirements & Interactions)  
**Target File Produced**: `/Users/koustavdey/mylaw/.agents/teamwork_preview_spec_miner_requirements/spec_report.md`  

---

## 1. Observation

- **Source Specification**: `/Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md` (lines 1–48):
  - R1 specifies floating circular button (48–56px, bottom-right, `#285A8E` / `#172033` palette, chat/sparkle icon, hover tooltip "Ask MyLaw") and chat panel (360–400px desktop, mobile margin, header "MyLaw ● Assistant", close button, 12–16px border-radius).
  - R2 specifies internal Q&A dataset (15–20 predefined items across Core, Why MyLaw, For Seeking Help, For Lawyers, and Launch), random intro greeting on open, 5 initial question bubbles, user message rendering, assistant answer transition (150–250ms), 2–3 follow-ups + "← Back to questions" option, zero free-text, zero dynamic AI, and verbatim legal advice disclaimer (*"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."*).
  - R3 specifies inline CTA button ("Want to be among the first? [ Join the Waitlist → ]") routing to `/waitlist` without embedding duplicate waitlist form.
  - R4 specifies non-destructive integration in global scope (`layout.tsx`), zero changes to landing page and `/waitlist` layouts, ESC key dismiss, ARIA labels, and clean build.
- **Design System Tokens**: `/Users/koustavdey/mylaw/design.md` (lines 58–198) & `src/app/globals.css` (lines 7–27):
  - Brand Navy: `#172033`
  - Brand Accent: `#285A8E`, Hover: `#1e4670`
  - Soft Background: `#F7F8FA`, Surface: `#FFFFFF`
  - Border: `#E6E8EC`, Muted Teal: `#2F7C78`
  - Shadow: subtle `0 1px 3px rgba(16, 24, 40, 0.05)` and `0 12px 36px rgba(23, 32, 51, 0.14)`
  - Radii: 6px (sm), 10px (md), 14px (lg), 16px (panel)
- **Codebase Layout**:
  - Root Layout: `src/app/layout.tsx` (lines 19–31) wrapping `children`.
  - Waitlist Page: `src/app/waitlist/page.tsx` supports search param handling (`?role=help` or `?role=lawyer`).
  - Icons: `lucide-react` available in `src/components/icons/index.tsx`.

---

## 2. Logic Chain

1. **Deterministic Chatbot Architecture**: Because the requirements strictly forbid free-text input and AI/LLM API calls, all interactions are modeled as a deterministic finite-state transition machine over a statically defined Knowledge Base dataset.
2. **Knowledge Base Structuring**: To satisfy the 15–20 item requirement across the 5 mandatory categories (Core, Why MyLaw, For Seeking Help, For Lawyers, Launch), 18 distinct Q&A entries were structured with unique IDs, question text, comprehensive answers, 2–3 follow-up pointers, and waitlist CTA flags.
3. **Conversational Flow**:
   - Initial State: selects 1 of 4 greetings randomly + presents 5 initial category questions.
   - Transition: when a question is clicked, a user bubble is appended, followed by the assistant answer, optional inline CTA, 2–3 follow-up pills, and a "← Back to questions" button.
   - Navigation: "← Back to questions" returns the user to the 5 initial questions without destroying previous history or creating unreachable dead-ends.
4. **Guardrail Enforcement**: The verbatim disclaimer is tied to `core-is-it-legal-advice` and supported by a permanent footer caption: *"Informational assistant only. No legal advice provided."*
5. **Non-Destructive Integration**: By specifying the component as a self-contained fixed-position client component placed inside `src/app/layout.tsx`, the existing DOM hierarchy of `src/app/page.tsx` and `src/app/waitlist/page.tsx` remains completely untouched.

---

## 3. Caveats

- **No Active Backend Route Needed**: All data and state machine logic are purely client-side; no `/api/chat` endpoint is necessary or allowed.
- **Role Search Parameter Convention**: Inline CTAs for lawyer-related topics route to `/waitlist?role=lawyer`, while general topics route to `/waitlist` or `/waitlist?role=help`, aligned with `WaitlistForm` search param query handling.
- **Scroll Behavior**: To prevent mobile scroll chaining when navigating long chat threads, `overscroll-contain` is specified for the message list container.

---

## 4. Conclusion

The specification report `spec_report.md` has been fully generated and authored in `/Users/koustavdey/mylaw/.agents/teamwork_preview_spec_miner_requirements/spec_report.md`. It contains:
- Complete UI styling parameters (dimensions, colors, shadows, borders, radii, and positioning).
- Conversational state machine and transition logic.
- 18 complete, categorized Knowledge Base items with follow-up mappings and CTA flags.
- Comprehensive Guardrails and Legal Disclaimer specifications.
- 17 discovered features matrix and 9 detailed edge case scenarios.
- Accessibility, mobile responsiveness, and testing guidelines.

---

## 5. Verification Method

1. Inspect the generated report:
   ```bash
   cat /Users/koustavdey/mylaw/.agents/teamwork_preview_spec_miner_requirements/spec_report.md
   ```
2. Verify table compliance:
   - Ensure `## Features Discovered` contains all 17 features with columns: `| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |`.
   - Ensure `## Edge Cases` contains all 9 edge cases with columns: `| # | Feature | Input | Observed Behavior |`.
3. Verify that zero modifications were made to project source code files (`git status` shows no dirty source files).
