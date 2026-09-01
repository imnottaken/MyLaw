import React from "react";
import {
  getRandomGreeting,
  getInitialQuestions,
  getFollowUpQuestions,
  getKnowledgeItemById,
  INITIAL_GREETINGS,
  INITIAL_QUESTION_IDS,
  STATUTORY_LEGAL_DISCLAIMER,
  MICRO_DISCLAIMER_TEXT,
  KNOWLEDGE_ITEMS
} from "../../src/components/assistant/data/knowledge-base";

console.log("=================================================");
console.log("   INDEPENDENT REVIEWER 1 STRESS TEST SUITE      ");
console.log("=================================================");

let passed = 0;
let failed = 0;

function assert(condition, desc) {
  if (condition) {
    console.log(`  ✓ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

// 1. Check all 18 knowledge items
assert(KNOWLEDGE_ITEMS.length === 18, `Knowledge base item count is 18 (found ${KNOWLEDGE_ITEMS.length})`);

// 2. Check initial questions
const initial = getInitialQuestions();
assert(initial.length === 5, `getInitialQuestions returns exactly 5 items (found ${initial.length})`);
assert(
  JSON.stringify(initial.map(q => q.id)) === JSON.stringify(INITIAL_QUESTION_IDS),
  `Initial questions match INITIAL_QUESTION_IDS exactly`
);

// 3. Check follow-ups for all items
for (const item of KNOWLEDGE_ITEMS) {
  const followUps = getFollowUpQuestions(item.id);
  assert(
    followUps.length >= 2 && followUps.length <= 3,
    `Item ${item.id} has 2-3 valid follow-up questions (found ${followUps.length})`
  );
}

// 4. Check legal advice disclaimer item
const disclaimerItem = getKnowledgeItemById("help-legal-advice-disclaimer");
assert(Boolean(disclaimerItem), "help-legal-advice-disclaimer exists");
assert(disclaimerItem?.isDisclaimer === true, "help-legal-advice-disclaimer has isDisclaimer=true");
assert(
  disclaimerItem?.answer === STATUTORY_LEGAL_DISCLAIMER,
  "help-legal-advice-disclaimer answer matches STATUTORY_LEGAL_DISCLAIMER"
);
assert(
  disclaimerItem?.cta?.href === "/waitlist",
  "help-legal-advice-disclaimer CTA routes to /waitlist"
);

// 5. Check lawyer CTA routing
const lawyerItem = getKnowledgeItemById("lawyer-joining");
assert(
  lawyerItem?.cta?.href === "/waitlist?role=lawyer",
  "lawyer-joining CTA routes to /waitlist?role=lawyer"
);

// 6. Test fallback for nonexistent item
const invalidFollowUps = getFollowUpQuestions("non-existent-id-999");
assert(
  invalidFollowUps.length === 5,
  "getFollowUpQuestions on invalid ID falls back to 5 initial questions"
);

// 7. Check greeting pool
assert(INITIAL_GREETINGS.length === 4, "INITIAL_GREETINGS has 4 curated greetings");
for (let i = 0; i < 100; i++) {
  const g = getRandomGreeting();
  if (!INITIAL_GREETINGS.includes(g)) {
    assert(false, `getRandomGreeting returned unexpected string: ${g}`);
    break;
  }
}
assert(true, "getRandomGreeting returns valid greeting over 100 iterations");

// 8. Micro-disclaimer verification
assert(
  MICRO_DISCLAIMER_TEXT === "Informational assistant only. No legal advice provided.",
  "MICRO_DISCLAIMER_TEXT matches expected string"
);

console.log("=================================================");
console.log(`Summary: ${passed} passed, ${failed} failed`);
console.log("=================================================");

if (failed > 0) process.exit(1);
