import {
  CATEGORIES,
  INITIAL_GREETINGS,
  GREETINGS,
  INITIAL_QUESTION_IDS,
  STATUTORY_LEGAL_DISCLAIMER,
  LEGAL_DISCLAIMER_TEXT,
  MICRO_DISCLAIMER_TEXT,
  KNOWLEDGE_ITEMS,
  KNOWLEDGE_BASE,
  getKnowledgeItemById,
  getInitialQuestions,
  getFollowUpQuestions,
  getFollowUpItems,
  getRandomGreeting,
  getAllCategories
} from '@/components/assistant/data/knowledge-base';
import type { KnowledgeItem, AssistantCategory } from '@/types/assistant';

console.log('=== FORENSIC INTEGRITY AUDIT TEST SUITE: M1 ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`[PASS] ${msg}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${msg}`);
    failCount++;
  }
}

// 1. Data size and categories
assert(CATEGORIES.length === 5, `Expected 5 categories, got ${CATEGORIES.length}`);
assert(KNOWLEDGE_ITEMS.length === 18, `Expected 18 knowledge items, got ${KNOWLEDGE_ITEMS.length}`);
assert(KNOWLEDGE_ITEMS === KNOWLEDGE_BASE, 'KNOWLEDGE_BASE should equal KNOWLEDGE_ITEMS alias');

// 2. Greetings
assert(INITIAL_GREETINGS.length >= 4, `Expected at least 4 greetings, got ${INITIAL_GREETINGS.length}`);
assert(INITIAL_GREETINGS === GREETINGS, 'GREETINGS should equal INITIAL_GREETINGS alias');
for (const greeting of INITIAL_GREETINGS) {
  assert(greeting.trim().length > 10, `Greeting is non-empty and rich: "${greeting.substring(0, 30)}..."`);
}

// 3. Disclaimer texts
const expectedDisclaimer =
  "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.";
assert(
  STATUTORY_LEGAL_DISCLAIMER === expectedDisclaimer,
  'STATUTORY_LEGAL_DISCLAIMER matches verbatim requirement'
);
assert(
  LEGAL_DISCLAIMER_TEXT === expectedDisclaimer,
  'LEGAL_DISCLAIMER_TEXT matches verbatim requirement'
);
assert(
  MICRO_DISCLAIMER_TEXT.length > 5,
  'MICRO_DISCLAIMER_TEXT is populated'
);

// 4. Initial Questions
assert(INITIAL_QUESTION_IDS.length === 5, `Expected 5 initial questions, got ${INITIAL_QUESTION_IDS.length}`);
const initialQuestions = getInitialQuestions();
assert(initialQuestions.length === 5, `getInitialQuestions() returned ${initialQuestions.length} items`);

// 5. Unique IDs & Integrity of Item Map
const itemIds = new Set<string>();
for (const item of KNOWLEDGE_ITEMS) {
  assert(!itemIds.has(item.id), `ID "${item.id}" is unique`);
  itemIds.add(item.id);

  assert(item.question && item.question.trim().length > 3, `Item ${item.id} has non-empty question`);
  assert(item.answer && item.answer.trim().length > 10, `Item ${item.id} has non-empty answer`);
  assert(item.followUpIds && item.followUpIds.length >= 2 && item.followUpIds.length <= 3,
    `Item ${item.id} has 2-3 followUpIds (has ${item.followUpIds?.length})`);

  // Verify category exists
  const catExists = CATEGORIES.some(c => c.key === item.category);
  assert(catExists, `Item ${item.id} has valid category "${item.category}"`);

  // Verify getKnowledgeItemById
  const retrieved = getKnowledgeItemById(item.id);
  assert(retrieved?.id === item.id, `getKnowledgeItemById("${item.id}") retrieved correct item`);
}

// 6. Follow-up graph referential integrity
for (const item of KNOWLEDGE_ITEMS) {
  for (const followUpId of item.followUpIds) {
    const exists = itemIds.has(followUpId);
    assert(exists, `Item ${item.id} followUpId "${followUpId}" exists in knowledge base`);
  }

  // Test getFollowUpQuestions
  const followUps = getFollowUpQuestions(item.id);
  assert(followUps.length === item.followUpIds.length,
    `getFollowUpQuestions("${item.id}") returned ${followUps.length} items (expected ${item.followUpIds.length})`);

  // Test getFollowUpItems
  const followUpItems = getFollowUpItems(item);
  assert(followUpItems.length === item.followUpIds.length,
    `getFollowUpItems(item) returned ${followUpItems.length} items (expected ${item.followUpIds.length})`);
}

// 7. Test fallback behavior for missing / invalid IDs
const fallbackForNonExistent = getFollowUpQuestions('non-existent-id-12345');
assert(fallbackForNonExistent.length === 5, 'getFollowUpQuestions for invalid ID returns 5 initial questions as fallback');

const dummyItemWithoutFollowUps: KnowledgeItem = {
  id: 'test-item',
  category: 'core',
  question: 'Test?',
  answer: 'Test answer',
  followUpIds: []
};
const fallbackForEmptyFollowUps = getFollowUpItems(dummyItemWithoutFollowUps);
assert(fallbackForEmptyFollowUps.length === 5, 'getFollowUpItems for empty followUpIds returns 5 initial questions as fallback');

// 8. CTAs validation
const itemsWithCta = KNOWLEDGE_ITEMS.filter(item => item.cta);
assert(itemsWithCta.length >= 5, `Found ${itemsWithCta.length} items with CTA buttons (expected >= 5)`);
for (const item of itemsWithCta) {
  assert(item.cta?.href.startsWith('/waitlist') === true,
    `Item ${item.id} CTA routes to /waitlist (href: ${item.cta?.href})`);
  assert(item.cta?.label.trim().length! > 3,
    `Item ${item.id} CTA has non-empty label: "${item.cta?.label}"`);
}

// 9. Random Greeting randomness
const greetingsSampled = new Set<string>();
for (let i = 0; i < 50; i++) {
  const g = getRandomGreeting();
  greetingsSampled.add(g);
}
assert(greetingsSampled.size > 1, `getRandomGreeting produces variable output (sampled ${greetingsSampled.size} distinct greetings)`);

// 10. getAllCategories
const allCats = getAllCategories();
assert(allCats.length === 5, `getAllCategories returned ${allCats.length} categories`);

console.log(`\n=== SUMMARY: ${passCount} PASSED, ${failCount} FAILED ===`);
if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
