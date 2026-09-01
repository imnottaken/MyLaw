# Milestone M1 Review Report: Knowledge Base & Data Layer

**Reviewer**: Reviewer 2 (`teamwork_preview_reviewer_m1_2`)  
**Roles**: Reviewer, Adversarial Critic  
**Date**: 2026-09-01T13:13:30Z  
**Verdict**: `REQUEST_CHANGES`

---

## 1. Observation

### Source Code Inspection
1. `src/types/assistant.ts` (61 lines):
   - Defines `AssistantCategory` (`'core' | 'why-mylaw' | 'for-seeking-help' | 'for-lawyers' | 'launch'`), `AssistantCategoryMeta`, `AssistantCTA`, `KnowledgeItem`, `ChatMessage`, `AssistantState`, and `AssistantAction`.
   - All interfaces employ strict `readonly` modifiers on properties.
   - Clean exports, zero type errors.

2. `src/components/assistant/data/knowledge-base.ts` (321 lines):
   - Exports `CATEGORIES` (5 categories), `INITIAL_GREETINGS` / `GREETINGS` (4 greetings), `INITIAL_QUESTION_IDS` (5 initial question IDs), `STATUTORY_LEGAL_DISCLAIMER` / `LEGAL_DISCLAIMER_TEXT`, `MICRO_DISCLAIMER_TEXT`, and `KNOWLEDGE_ITEMS` / `KNOWLEDGE_BASE` (18 items).
   - Category distribution: `core` (4), `why-mylaw` (4), `for-seeking-help` (4), `for-lawyers` (3), `launch` (3). Total: 18.
   - Helper functions: `getKnowledgeItemById`, `getInitialQuestions`, `getFollowUpQuestions`, `getFollowUpItems`, `getRandomGreeting`, `getAllCategories`.

### Empirical Verification & Tool Executions
1. **ESLint (`npm run lint`)**: Exited with code 0.
2. **TypeScript Compiler (`npx tsc --noEmit`)**: Exited with code 0.
3. **Next.js Production Build (`npm run build`)**: Exited with code 0 (Compiled successfully in 128ms, all static routes generated).
4. **E2E Test Runner (`node tests/e2e/runner.mjs`)**: Exited with code 0 (57/57 tests passed across Tiers 1-4).
5. **Adversarial Stress Test (`node tests/knowledge_base_adversarial.spec.mjs`)**: Exited with code 1 (23/25 passed, 2 failed).
   - `FAIL: BFS reachability from 5 initial questions achieves 100% (18/18 items reachable)`
     - *Error*: `BFS failed to reach all items! Missing: core-who-created - Expected: 18, Got: 17`
   - `FAIL: DFS reachability from 5 initial questions achieves 100% (18/18 items reachable)`
     - *Error*: `DFS failed to reach all items! Reached 17/18. Missing: core-who-created - Expected: 18, Got: 17`

### Negative Constraints Audit
1. **Zero dark-mode classes**: Verified. 0 dark-mode classes in `src/types/assistant.ts` and `src/components/assistant/data/knowledge-base.ts`.
2. **Zero dynamic AI/LLM calls**: Verified. 0 SDK imports, 0 AI API endpoints, 0 dynamic generations. All responses are 100% deterministic.
3. **Zero legal advice**: Verified. `STATUTORY_LEGAL_DISCLAIMER` matches verbatim: `"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."` Item `core-is-it-legal-advice` has `isDisclaimer: true` and includes the verbatim text. `MICRO_DISCLAIMER_TEXT` is `"Informational assistant only. No legal advice provided."`
4. **Zero free-text input requirements**: Verified. Conversational model is driven strictly by discrete question pills.

### Integrity Violation Check
- No hardcoded test checks, facades, or bypassed logic detected in production files. Implementation logic is authentic and well-structured.

---

## 2. Logic Chain

1. **Graph Reachability Flaw**:
   - The knowledge base contains 18 items.
   - `INITIAL_QUESTION_IDS` defines 5 top-level questions: `['core-what-is-mylaw', 'core-how-it-works', 'help-find-lawyer', 'lawyer-how-to-join', 'launch-timeline']`.
   - Examining the in-degree of all 18 items across all `followUpIds` reveals that item `core-who-created` ("Who is building MyLaw?", lines 91-97) has an in-degree of **0** — no other knowledge item references `core-who-created` in its `followUpIds`.
   - Because `core-who-created` is neither in `INITIAL_QUESTION_IDS` nor referenced by any other item's `followUpIds`, it is an unreachable island node. A user interacting with the assistant starting from the initial questions can never navigate to or discover this item (reachability is 17/18 or 94.4%).
   - This causes 2 test failures in `tests/knowledge_base_adversarial.spec.mjs` (Suite 4: BFS/DFS reachability).

2. **Resolution Path**:
   - Update `why-trust` (`src/components/assistant/data/knowledge-base.ts:118`) or `core-what-is-mylaw` (`src/components/assistant/data/knowledge-base.ts:71`) to include `'core-who-created'` in `followUpIds`.
   - For example, in `why-trust`:
     ```ts
     // From:
     followUpIds: ['help-confidentiality', 'why-mylaw-different', 'launch-waitlist']
     // To:
     followUpIds: ['help-confidentiality', 'core-who-created', 'launch-waitlist']
     ```
   - This restores 100% (18/18) reachability, eliminates the orphan node, and brings `tests/knowledge_base_adversarial.spec.mjs` to 25/25 passed (100%).

---

## 3. Caveats

- Aside from the graph reachability gap for `core-who-created`, all 54 existing follow-up ID references point to valid items (0 broken links, 0 out-of-bound IDs).
- UI component rendering and CSS styling will be evaluated in Milestone M2.

---

## 4. Conclusion

**Verdict**: `REQUEST_CHANGES`

**Required Changes**:
1. In `src/components/assistant/data/knowledge-base.ts`, link `core-who-created` into the conversational graph by adding `'core-who-created'` into the `followUpIds` of a relevant item (such as `why-trust` or `core-what-is-mylaw`) so that all 18 items are fully reachable (100% reachability) from the 5 initial entry points.
2. Re-run `node tests/knowledge_base_adversarial.spec.mjs` and confirm 25/25 tests pass.

---

## 5. Verification Method

To verify the resolution:
```bash
# 1. Verify TypeScript compilation
npx tsc --noEmit

# 2. Verify ESLint
npm run lint

# 3. Verify E2E suite
node tests/e2e/runner.mjs

# 4. Verify Adversarial Graph Reachability Suite
node tests/knowledge_base_adversarial.spec.mjs
```
*Expected Result: All commands exit with code 0 and 0 failures.*
