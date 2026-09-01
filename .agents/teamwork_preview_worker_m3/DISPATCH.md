## 2026-09-01T13:32:15Z

You are the Worker for Milestone M3: Global Integration & Build Polish for MyLaw Assistant.
Your working directory is /Users/koustavdey/mylaw/.agents/teamwork_preview_worker_m3/
Project Root: /Users/koustavdey/mylaw
Original User Request: /Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md
Master Architecture: /Users/koustavdey/mylaw/PROJECT.md

Your exclusive write ownership for this milestone:
- `src/app/layout.tsx`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Mount the `<Assistant />` component (imported from `@/components/assistant`) cleanly inside `src/app/layout.tsx` as a global client overlay alongside `{children}` in `<body>`.
2. Ensure the existing HTML structure, Inter/Geist fonts, metadata, and body classes in `src/app/layout.tsx` are completely preserved.
3. Verify non-destructive integration:
   - Landing page (`src/app/page.tsx` and all 7 sections) remains 100% unaffected.
   - Waitlist page (`src/app/waitlist/page.tsx`) remains 100% unaffected.
4. Execute verification commands:
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm test` (`node tests/e2e/runner.mjs`)
   - `npm run build`
5. Ensure `npm run build` exits with code 0 and zero TypeScript/lint errors.
6. Deliver your handoff report to `/Users/koustavdey/mylaw/.agents/teamwork_preview_worker_m3/handoff.md` and report back with send_message.
