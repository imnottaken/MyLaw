## 2026-09-01T00:26:15+05:30
You are the E2E Test Suite Engineer for the MyLaw project.
Your working directory for metadata is: /Users/koustavdey/mylaw/.agents/e2e_test_writer_1/
The project codebase is at /Users/koustavdey/mylaw.
The authoritative request is at /Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md.
The design spec is at /Users/koustavdey/mylaw/design.md.
The project architecture and feature inventory is at /Users/koustavdey/mylaw/PROJECT.md.

Tasks:
1. Read ORIGINAL_REQUEST.md, design.md, and PROJECT.md.
2. Build an opaque-box, automated E2E test suite and runner for the MyLaw web application in tests/e2e/.
3. Design test cases across the 4 systematic tiers:
   - Tier 1: Feature Coverage (Landing page 7 sections, Hero eyebrow, headline, CTAs, UI mockup, Waitlist page layout, email input, role radio, submit button, client success state, Navbar sticky + links + CTA + mobile hamburger, Footer wordmark + tagline + links + copyright).
   - Tier 2: Boundary & Corner Cases (Empty email, malformed emails, leading/trailing whitespace, missing optional role, rapid double submission, mobile/desktop viewport responsiveness, light-mode enforcement with no dark mode media rules).
   - Tier 3: Cross-Feature Combinations (Navigating from Landing hero/navbar to /waitlist, anchor scrolling to #about / #how-it-works / #for-lawyers, role pre-selection or preservation).
   - Tier 4: Real-World Application Scenarios (Full user journey: visiting homepage, reading problem/how it works/why MyLaw/about, clicking waitlist, selecting role, submitting valid email, verifying success state; lawyer user journey clicking "I'm a Lawyer" / "For Lawyers" -> waitlist).
   - Negative assertions: Checking absence of gavels, scales of justice, dark mode styles, fake testimonials/stats.
4. Provide a runnable test script (e.g., node-based test runner or standard test suite that can execute via `node tests/e2e/runner.mjs` or similar) that outputs clean pass/fail reports.
5. Create `TEST_INFRA.md` at project root (`/Users/koustavdey/mylaw/TEST_INFRA.md`) detailing the test architecture and coverage matrix.
6. Once the test harness and test cases are ready, create `TEST_READY.md` at project root (`/Users/koustavdey/mylaw/TEST_READY.md`) with runner command and coverage summary.
7. Write your handoff report to /Users/koustavdey/mylaw/.agents/e2e_test_writer_1/handoff.md and send a message back to the orchestrator.
