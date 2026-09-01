# Project: MyLaw Assistant Chatbot

## Architecture
- **Framework**: Next.js 16.3.3 (App Router, Turbopack), React 19.2.8, TypeScript strict.
- **Styling & Tokens**: Tailwind CSS v4, MyLaw Editorial Design System (`#172033`, `#285A8E`, `#1e4670`, `#F7F8FA`, `#FFFFFF`, `#E6E8EC`, `#2F7C78`).
- **Component Pattern**: Isolated client-side component hierarchy mounted globally in `src/app/layout.tsx`.
- **Knowledge Engine**: 100% deterministic predefined Q&A database (18 items across 5 categories), random greeting selector, structured follow-up question graph, inline waitlist CTA integration, zero dynamic AI/LLM calls, zero free-text input, exact legal advice disclaimer.

## Code Layout
- `src/types/assistant.ts`: TypeScript contracts for categories, knowledge items, messages, and state. (Completed in M1)
- `src/components/assistant/data/knowledge-base.ts`: 18 categorized Q&A items, intro greetings, and disclaimer text. (Completed in M1)
- `src/components/assistant/`: (Completed in M2)
  - `Assistant.tsx`: Root client container managing open/closed state, active question flow, ESC key listener, and focus restore.
  - `AssistantTrigger.tsx`: Fixed bottom-right circular button (48–56px) with sparkle/chat icon, pulse indicator, and hover tooltip ("Ask MyLaw").
  - `AssistantPanel.tsx`: Responsive floating chat panel (360–400px desktop, mobile fluid), header "MyLaw ● Assistant", close button, scrollable feed, and disclaimer footer.
  - `MessageBubble.tsx`: User message bubble (right-aligned, `#285A8E`), assistant answer bubble (left-aligned, `#F7F8FA`), inline waitlist CTA button.
  - `QuestionPill.tsx`: Interactive question pill buttons with chevrons and hover states; "← Back to questions" reset button.
  - `index.ts`: Barrel export.
- `src/app/layout.tsx`: Global non-destructive mounting point for `<Assistant />`. (Completed in M3)
- `tests/e2e/`: Requirement-driven 4-tier E2E test harness and test files. (Completed in E2E Track)

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| 1 | `CHAT-TRIGGER` | Floating circular button (48–56px) in bottom-right corner with brand colors, sparkle/chat icon, hover tooltip "Ask MyLaw", and ARIA labels. | M2 | ORIGINAL_REQUEST §R1 |
| 2 | `CHAT-PANEL` | Responsive panel (360–400px desktop, mobile fluid), header "MyLaw ● Assistant", active dot, close button, design tokens (#172033, #285A8E, #FFFFFF, #F7F8FA), subtle border/shadow. | M2 | ORIGINAL_REQUEST §R1 |
| 3 | `CHAT-KB-SCOPE` | 18 predefined Q&A items across 5 categories: Core, Why MyLaw, For Seeking Help, For Lawyers, Launch. | M1 | ORIGINAL_REQUEST §R2 |
| 4 | `CHAT-GREETING` | Random friendly intro greeting selected on open from 4 curated greetings. | M1 | ORIGINAL_REQUEST §R2 |
| 5 | `CHAT-INITIAL-Q` | 5 initial question bubbles with chevron/pill styling representing top platform topics. | M1 | ORIGINAL_REQUEST §R2 |
| 6 | `CHAT-QA-FLOW` | Clicking question renders user bubble -> smooth transition (150–250ms) -> assistant answer bubble. | M2 | ORIGINAL_REQUEST §R2 |
| 7 | `CHAT-FOLLOWUP` | 2–3 contextual follow-up question bubbles below answer + "← Back to questions" reset action. | M2 | ORIGINAL_REQUEST §R2 |
| 8 | `CHAT-GUARDRAILS` | Strictly zero free-text input, zero dynamic AI/LLM generation. | M2 | ORIGINAL_REQUEST §R2 |
| 9 | `CHAT-DISCLAIMER` | Verbatim statutory disclaimer for legal advice queries: "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice." + micro-disclaimer footer. | M1, M2 | ORIGINAL_REQUEST §R2 |
| 10 | `CHAT-WAITLIST-CTA`| Inline "Join the Waitlist →" CTA button in relevant answers routing cleanly to `/waitlist` (or `/waitlist?role=lawyer`). No duplicate form. | M2 | ORIGINAL_REQUEST §R3 |
| 11 | `CHAT-A11Y-POLISH` | Keyboard accessibility (ESC to close, Tab navigation, ARIA attributes), smooth transitions (150–250ms), mobile responsiveness without page overflow. | M2, M3 | ORIGINAL_REQUEST §R4 |
| 12 | `CHAT-LAYOUT-INTEGR` | Global non-destructive mounting in `src/app/layout.tsx` preserving existing landing page and `/waitlist` layouts 100%. | M3 | ORIGINAL_REQUEST §R4 |
| 13 | `CHAT-BUILD-VERIFY` | `npm run build` exits with code 0 and zero TypeScript/lint errors. | M3, Final | ORIGINAL_REQUEST Acceptance Criteria |
| 14 | `CHAT-E2E-TESTS` | 100% pass on comprehensive 4-tier E2E test suite + Tier 5 adversarial hardening. | E2E, Final | PROJECT.md Test Plan |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| E2E | E2E Testing Suite | Create 4-tier E2E test harness & test cases in `tests/e2e/`, publish `TEST_READY.md` | none | DONE |
| M1 | Knowledge Base & Data Layer | Types (`assistant.ts`), 18 Q&A items (`knowledge-base.ts`), greetings, disclaimer, follow-up map, CTA metadata | none | DONE |
| M2 | UI Components & State Machine | Trigger button, Chat panel, Message bubbles, Question pills, Conversational state machine, ESC handler, responsive styles | M1 | DONE |
| M3 | Global Integration & Build Polish | Mount `<Assistant />` in `src/app/layout.tsx`, verify non-destructive layout, verify `npm run build` | M2 | DONE |
| Final | E2E Test Pass & Adversarial Hardening | Phase 1: Pass 100% E2E tests (Tiers 1-4). Phase 2: Tier 5 Challenger adversarial hardening. | M3, E2E | DONE |
