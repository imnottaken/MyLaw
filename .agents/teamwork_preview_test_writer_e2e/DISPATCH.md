## 2026-09-01T13:05:37Z

You are the E2E Test Writer for the MyLaw Assistant project.
Your working directory is /Users/koustavdey/mylaw/.agents/teamwork_preview_test_writer_e2e/
Project Root: /Users/koustavdey/mylaw
Original User Request: /Users/koustavdey/mylaw/.agents/ORIGINAL_REQUEST.md
Master Architecture & Scope: /Users/koustavdey/mylaw/PROJECT.md
E2E Test Architecture: /Users/koustavdey/mylaw/TEST_INFRA.md

Your mission is to construct the complete, high-fidelity 4-tier E2E testing suite for the MyLaw Assistant chatbot in `tests/e2e/`:
1. Check existing test files in `tests/e2e/` (`runner.mjs`, `helpers/`, `tier1-*.mjs`, etc.).
2. Implement or update the helpers:
   - `tests/e2e/helpers/assistant-simulator.mjs`: Simulation of opening chatbot, picking random greeting, displaying 5 initial questions, question selection, smooth transition, assistant response, 2-3 follow-ups, "← Back to questions", legal advice disclaimer trigger, waitlist CTA routing.
   - `tests/e2e/helpers/source-scanner.mjs`: Validating knowledge base (15-20 items, 5 categories, required disclaimer), checking zero free-text inputs, zero dynamic AI/LLM calls, zero dark mode classes, design token compliance (#172033, #285A8E, #FFFFFF, #F7F8FA, #E6E8EC).
   - Ensure existing tests for landing page and waitlist page continue to pass.
3. Implement comprehensive test suites:
   - `tests/e2e/tier1-feature-coverage.test.mjs`: Test all 10 features thoroughly (F1-F10) with 3-5+ assertions each (Trigger button, Tooltip, Panel UI, Header, Random greetings, 5 initial questions, User/Assistant Q&A flow, Follow-up questions, Back button, 15-20 KB items, Legal disclaimer, Waitlist CTA, Layout integration).
   - `tests/e2e/tier2-boundary-corner.test.mjs`: Boundary value analysis, rapid toggle debounce, ESC key handling in all states, focus trapping/restoration, deep follow-up navigation, and strict negative constraints (zero free-text input, zero AI calls, zero dark-mode).
   - `tests/e2e/tier3-cross-feature.test.mjs`: Cross-page routing persistence between / and /waitlist, inline CTA navigation to /waitlist, z-index layering over navbar, mobile breakpoint adaptations.
   - `tests/e2e/tier4-scenarios-negative.test.mjs`: 5 realistic multi-step user journeys (Consumer Discovery, Lawyer Onboarding, Legal Disclaimer, Keyboard-Only, Mobile Touch).
4. Update `tests/e2e/runner.mjs` to execute all tiers cleanly.
5. Verify test runner execution with `node tests/e2e/runner.mjs` and document passing tests.
6. When complete, publish `/Users/koustavdey/mylaw/TEST_READY.md` summarizing total test counts and feature coverage checklist.
7. Deliver your handoff report to /Users/koustavdey/mylaw/.agents/teamwork_preview_test_writer_e2e/handoff.md and report back with send_message.
