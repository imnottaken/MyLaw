## 2026-08-31T19:01:42Z

You are the Waitlist Page Implementation Worker (Milestone 3) for MyLaw.
Your working directory for metadata is: /Users/koustavdey/mylaw/.agents/worker_m3_1/
The project codebase is at /Users/koustavdey/mylaw.
The authoritative request is at /Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md.
The design spec is at /Users/koustavdey/mylaw/design.md.
The project plan is at /Users/koustavdey/mylaw/PROJECT.md.
The spec miner handoff is at /Users/koustavdey/mylaw/.agents/spec_miner_waitlist_1/handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You have exclusive write ownership of:
- `src/app/waitlist/page.tsx`
- `src/components/waitlist/WaitlistForm.tsx`

Scope & Requirements:
1. `src/app/waitlist/page.tsx`:
   - Minimal centered Apple-like layout with generous whitespace.
   - Clean top header with "MyLaw" wordmark linking to `/`.
   - Centered container with "COMING SOON" eyebrow badge, headline "Legal help, made simpler.", subtitle "We're building a better way to discover and connect with legal professionals."
   - Render `WaitlistForm`.
   - Subtle footer copyright `© 2026 MyLaw. All rights reserved.`
2. `src/components/waitlist/WaitlistForm.tsx` ("use client"):
   - Optional role selector ("I am a: Looking for legal help / Lawyer"). Supports reading `useSearchParams` for `?role=lawyer` preselection wrapped in a Suspense boundary if needed.
   - Email input with `type="email"`, `required`, placeholder="Enter your email address", sanitized with `.trim()`.
   - Submit button "Join the Waitlist" (`bg-[#234A7A] hover:bg-[#193A61] rounded-[6px]`).
   - Microcopy: "No spam. Just launch updates."
   - Client-side success state with smooth 150-250ms fade transition:
     - Header: "You're on the list."
     - Body: "Thanks for joining MyLaw. We'll let you know when we're ready."
     - Subtle checkmark icon (`CheckCircleIcon` from `@/components/icons`).
     - Back navigation link: "← Back to Home" (`/`).
3. Strict adherence to light mode only, Inter font, 6px/10px radii, and subtle shadows.
4. Run `npm run build` and `npm run lint`.
5. Write handoff report to `/Users/koustavdey/mylaw/.agents/worker_m3_1/handoff.md` and send message back.
