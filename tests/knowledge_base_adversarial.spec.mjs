/**
 * tests/knowledge_base_adversarial.spec.mjs
 * 
 * EMPIRICAL CHALLENGER ADVERSARIAL STRESS TEST SUITE
 * Target: Knowledge Base & Data Layer (Milestone M1)
 * Target Files:
 *   - src/types/assistant.ts
 *   - src/components/assistant/data/knowledge-base.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Test runner state
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: []
};

function test(name, fn) {
  results.total++;
  try {
    fn();
    results.passed++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    results.failed++;
    results.failures.push({ name, error: err.message, stack: err.stack });
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion failed'} - Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
  }
}

// Module loader for TypeScript in Node
function loadTsModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;

  const moduleObj = { exports: {} };
  const customRequire = (id) => {
    if (id === '@/types/assistant' || id.endsWith('types/assistant') || id.endsWith('types/assistant.ts')) {
      return loadTsModule(path.resolve('src/types/assistant.ts'));
    }
    return require(id);
  };

  const fn = new Function('require', 'module', 'exports', transpiled);
  fn(customRequire, moduleObj, moduleObj.exports);
  return moduleObj.exports;
}

console.log('\n================================================================');
console.log('  CHALLENGER 1 — KNOWLEDGE BASE & DATA LAYER ADVERSARIAL SUITE  ');
console.log('================================================================\n');

const kbModule = loadTsModule(path.resolve('src/components/assistant/data/knowledge-base.ts'));

const {
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
} = kbModule;

// =========================================================================
// SUITE 1: Item Count, ID Uniqueness, and Schema Conformance
// =========================================================================
console.log('▶ [Suite 1] Item Count, ID Uniqueness & Schema Conformance');

test('KNOWLEDGE_ITEMS contains exactly 18 items', () => {
  assert(Array.isArray(KNOWLEDGE_ITEMS), 'KNOWLEDGE_ITEMS must be an array');
  assertEqual(KNOWLEDGE_ITEMS.length, 18, 'KNOWLEDGE_ITEMS length must be exactly 18');
});

test('KNOWLEDGE_BASE alias is identical to KNOWLEDGE_ITEMS', () => {
  assertEqual(KNOWLEDGE_BASE, KNOWLEDGE_ITEMS, 'KNOWLEDGE_BASE must equal KNOWLEDGE_ITEMS');
});

test('All 18 items have unique, non-empty, well-formatted string IDs', () => {
  const idSet = new Set();
  for (const item of KNOWLEDGE_ITEMS) {
    assert(typeof item.id === 'string' && item.id.trim().length > 0, `Item has invalid id: ${item.id}`);
    assert(!idSet.has(item.id), `Duplicate id found: ${item.id}`);
    idSet.add(item.id);
  }
  assertEqual(idSet.size, 18, 'Set of unique IDs must be 18');
});

test('Every KnowledgeItem conforms strictly to schema (non-empty question, answer, followUpIds array)', () => {
  for (const item of KNOWLEDGE_ITEMS) {
    assert(typeof item.question === 'string' && item.question.trim().length > 0, `Item ${item.id} has empty question`);
    assert(typeof item.answer === 'string' && item.answer.trim().length > 0, `Item ${item.id} has empty answer`);
    assert(Array.isArray(item.followUpIds), `Item ${item.id} followUpIds must be an array`);
    assert(item.followUpIds.length >= 2, `Item ${item.id} must have at least 2 follow-up IDs`);
    assert(item.followUpIds.length <= 4, `Item ${item.id} has more than 4 follow-up IDs`);
  }
});

// =========================================================================
// SUITE 2: Category Distribution Across 5 Defined Categories
// =========================================================================
console.log('\n▶ [Suite 2] Category Distribution & Metadata Integrity');

const EXPECTED_CATEGORIES = ['core', 'why-mylaw', 'for-seeking-help', 'for-lawyers', 'launch'];

test('CATEGORIES defines exactly the 5 specified categories with label and description', () => {
  assert(Array.isArray(CATEGORIES), 'CATEGORIES must be an array');
  assertEqual(CATEGORIES.length, 5, 'CATEGORIES length must be 5');

  const keys = CATEGORIES.map(c => c.key);
  assertEqual(keys.sort().join(','), [...EXPECTED_CATEGORIES].sort().join(','), 'Category keys must match exact expected 5 keys');

  for (const cat of CATEGORIES) {
    assert(typeof cat.label === 'string' && cat.label.trim().length > 0, `Category ${cat.key} missing label`);
    assert(typeof cat.description === 'string' && cat.description.trim().length > 0, `Category ${cat.key} missing description`);
  }
});

test('getAllCategories() returns CATEGORIES array', () => {
  assertEqual(getAllCategories(), CATEGORIES, 'getAllCategories must return CATEGORIES');
});

test('Category distribution strictly partitions all 18 items across the 5 categories with >=3 items each', () => {
  const counts = {};
  for (const cat of EXPECTED_CATEGORIES) {
    counts[cat] = 0;
  }

  for (const item of KNOWLEDGE_ITEMS) {
    assert(EXPECTED_CATEGORIES.includes(item.category), `Item ${item.id} has unknown category: ${item.category}`);
    counts[item.category]++;
  }

  console.log('    Observed category breakdown:', JSON.stringify(counts));
  assertEqual(counts['core'], 4, 'core category count must be 4');
  assertEqual(counts['why-mylaw'], 4, 'why-mylaw category count must be 4');
  assertEqual(counts['for-seeking-help'], 4, 'for-seeking-help category count must be 4');
  assertEqual(counts['for-lawyers'], 3, 'for-lawyers category count must be 3');
  assertEqual(counts['launch'], 3, 'launch category count must be 3');

  const totalSum = Object.values(counts).reduce((a, b) => a + b, 0);
  assertEqual(totalSum, 18, 'Sum of category items must be 18');
});

// =========================================================================
// SUITE 3: Initial Questions Verification
// =========================================================================
console.log('\n▶ [Suite 3] Initial Questions Verification');

test('INITIAL_QUESTION_IDS contains exactly 5 valid IDs representing diverse topics', () => {
  assertEqual(INITIAL_QUESTION_IDS.length, 5, 'INITIAL_QUESTION_IDS must have 5 IDs');
  const allIds = new Set(KNOWLEDGE_ITEMS.map(k => k.id));
  for (const id of INITIAL_QUESTION_IDS) {
    assert(allIds.has(id), `Initial question ID not found in knowledge items: ${id}`);
  }
});

test('getInitialQuestions() retrieves all 5 full KnowledgeItem objects matching INITIAL_QUESTION_IDS', () => {
  const initialItems = getInitialQuestions();
  assertEqual(initialItems.length, 5, 'getInitialQuestions() must return 5 items');
  for (let i = 0; i < 5; i++) {
    assertEqual(initialItems[i].id, INITIAL_QUESTION_IDS[i], `Item at index ${i} ID mismatch`);
  }
});

// =========================================================================
// SUITE 4: Graph Theory & Connectivity (BFS/DFS, 0 Dead Ends, 100% Reachability)
// =========================================================================
console.log('\n▶ [Suite 4] Graph Theory, Traversal & Reachability Stress Test');

const knowledgeMap = new Map(KNOWLEDGE_ITEMS.map(i => [i.id, i]));

test('Zero broken references: Every followUpId resolves to an existing knowledge item', () => {
  const brokenRefs = [];
  for (const item of KNOWLEDGE_ITEMS) {
    for (const fId of item.followUpIds) {
      if (!knowledgeMap.has(fId)) {
        brokenRefs.push({ source: item.id, target: fId });
      }
    }
  }
  assertEqual(brokenRefs.length, 0, `Found broken followUp references: ${JSON.stringify(brokenRefs)}`);
});

test('Zero immediate self-loops: No item points to itself in followUpIds', () => {
  const selfLoops = [];
  for (const item of KNOWLEDGE_ITEMS) {
    if (item.followUpIds.includes(item.id)) {
      selfLoops.push(item.id);
    }
  }
  assertEqual(selfLoops.length, 0, `Found items with self-loops: ${JSON.stringify(selfLoops)}`);
});

test('Zero dead-ends: Every item has at least 2 valid follow-up paths', () => {
  for (const item of KNOWLEDGE_ITEMS) {
    const followUps = getFollowUpQuestions(item.id);
    assert(followUps.length >= 2, `Item ${item.id} has fewer than 2 follow-ups`);
  }
});

test('In-degree analysis across all 18 knowledge items', () => {
  const inDegrees = {};
  for (const item of KNOWLEDGE_ITEMS) {
    inDegrees[item.id] = 0;
  }
  for (const item of KNOWLEDGE_ITEMS) {
    for (const fId of item.followUpIds) {
      if (inDegrees[fId] !== undefined) {
        inDegrees[fId]++;
      }
    }
  }
  console.log('    In-degree distribution:', inDegrees);
  const zeroInDegree = Object.entries(inDegrees).filter(([id, deg]) => deg === 0).map(([id]) => id);
  console.log('    Nodes with 0 in-degree (never referenced as follow-up):', zeroInDegree);
  const zeroInNonInitial = zeroInDegree.filter(id => !INITIAL_QUESTION_IDS.includes(id));
  if (zeroInNonInitial.length > 0) {
    console.warn(`    ⚠️ WARNING: Unreachable orphan nodes (0 in-degree and not initial): ${zeroInNonInitial.join(', ')}`);
  }
});

test('BFS reachability from 5 initial questions achieves 100% (18/18 items reachable)', () => {
  const visited = new Set();
  const queue = [...INITIAL_QUESTION_IDS];
  const depthMap = new Map();

  for (const id of INITIAL_QUESTION_IDS) {
    visited.add(id);
    depthMap.set(id, 0);
  }

  while (queue.length > 0) {
    const currentId = queue.shift();
    const item = knowledgeMap.get(currentId);
    const currentDepth = depthMap.get(currentId);

    for (const neighborId of item.followUpIds) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        depthMap.set(neighborId, currentDepth + 1);
        queue.push(neighborId);
      }
    }
  }

  console.log(`    BFS visited ${visited.size}/18 items. Depths:`, Object.fromEntries(depthMap));
  const missing = [...knowledgeMap.keys()].filter(k => !visited.has(k));
  if (missing.length > 0) {
    console.warn(`    ⚠️ Missing items in BFS: ${missing.join(', ')}`);
  }
  assertEqual(visited.size, 18, `BFS failed to reach all items! Missing: ${missing.join(', ')}`);
});

test('DFS reachability from 5 initial questions achieves 100% (18/18 items reachable)', () => {
  const visited = new Set();

  function dfs(nodeId) {
    visited.add(nodeId);
    const item = knowledgeMap.get(nodeId);
    for (const nextId of item.followUpIds) {
      if (!visited.has(nextId)) {
        dfs(nextId);
      }
    }
  }

  for (const id of INITIAL_QUESTION_IDS) {
    dfs(id);
  }

  const missing = [...knowledgeMap.keys()].filter(k => !visited.has(k));
  assertEqual(visited.size, 18, `DFS failed to reach all items! Reached ${visited.size}/18. Missing: ${missing.join(', ')}`);
});

test('Adversarial Random Walk Simulation: 10,000 steps never dead-end or throw', () => {
  let current = INITIAL_QUESTION_IDS[0];
  let transitions = 0;

  for (let step = 0; step < 10000; step++) {
    const item = getKnowledgeItemById(current);
    assert(item, `Failed to retrieve item ${current} during random walk`);
    const followUps = getFollowUpQuestions(current);
    assert(followUps.length > 0, `Empty follow-ups at step ${step} on item ${current}`);
    
    // Pick random follow-up
    const nextItem = followUps[Math.floor(Math.random() * followUps.length)];
    current = nextItem.id;
    transitions++;
  }

  assertEqual(transitions, 10000, 'Completed 10,000 continuous navigation transitions without dead-ending');
});

// =========================================================================
// SUITE 5: Legal Disclaimer & Statutory Text Invariants
// =========================================================================
console.log('\n▶ [Suite 5] Statutory Legal Disclaimer Verification');

const EXPECTED_DISCLAIMER = "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.";

test('STATUTORY_LEGAL_DISCLAIMER matches statutory text verbatim', () => {
  assertEqual(STATUTORY_LEGAL_DISCLAIMER, EXPECTED_DISCLAIMER, 'Statutory legal disclaimer text mismatch');
});

test('LEGAL_DISCLAIMER_TEXT alias matches statutory text verbatim', () => {
  assertEqual(LEGAL_DISCLAIMER_TEXT, EXPECTED_DISCLAIMER, 'LEGAL_DISCLAIMER_TEXT alias mismatch');
});

test('MICRO_DISCLAIMER_TEXT is non-empty and emphasizes no legal advice', () => {
  assert(typeof MICRO_DISCLAIMER_TEXT === 'string' && MICRO_DISCLAIMER_TEXT.length > 0, 'Micro disclaimer must be non-empty');
  assert(MICRO_DISCLAIMER_TEXT.toLowerCase().includes('no legal advice'), 'Micro disclaimer must include "no legal advice"');
});

test('Legal advice question (core-is-it-legal-advice) contains disclaimer flag and verbatim disclaimer text', () => {
  const disclaimerItem = getKnowledgeItemById('core-is-it-legal-advice');
  assert(disclaimerItem, 'Item core-is-it-legal-advice must exist');
  assertEqual(disclaimerItem.isDisclaimer, true, 'core-is-it-legal-advice must have isDisclaimer: true');
  assert(disclaimerItem.answer.includes(EXPECTED_DISCLAIMER), 'core-is-it-legal-advice answer must include the exact statutory disclaimer');
});

// =========================================================================
// SUITE 6: CTA Routing & Target Validation
// =========================================================================
console.log('\n▶ [Suite 6] Waitlist CTA Routing & Validation');

const ALLOWED_CTA_HREFS = new Set(['/waitlist', '/waitlist?role=lawyer']);

test('All items with CTA define valid labels and allowed waitlist routing URLs', () => {
  const ctaItems = KNOWLEDGE_ITEMS.filter(item => item.cta !== undefined);
  console.log(`    Found ${ctaItems.length} items with CTA buttons`);
  assert(ctaItems.length >= 5, 'Expected at least 5 items with CTA buttons');

  for (const item of ctaItems) {
    const { cta } = item;
    assert(typeof cta.label === 'string' && cta.label.trim().length > 0, `Item ${item.id} CTA has empty label`);
    assert(ALLOWED_CTA_HREFS.has(cta.href), `Item ${item.id} has invalid CTA href: ${cta.href}. Allowed: ${[...ALLOWED_CTA_HREFS].join(', ')}`);
    
    if (cta.role) {
      assert(['help', 'lawyer'].includes(cta.role), `Item ${item.id} has invalid cta.role: ${cta.role}`);
      if (cta.role === 'lawyer') {
        assertEqual(cta.href, '/waitlist?role=lawyer', `Lawyer CTA in item ${item.id} must route to /waitlist?role=lawyer`);
      }
    }
  }
});

// =========================================================================
// SUITE 7: Helper Functions & Adversarial Boundary Handling
// =========================================================================
console.log('\n▶ [Suite 7] Helper Functions & Edge Case Robustness');

test('getKnowledgeItemById returns correct item for valid IDs and undefined for invalid IDs', () => {
  for (const item of KNOWLEDGE_ITEMS) {
    const fetched = getKnowledgeItemById(item.id);
    assertEqual(fetched, item, `getKnowledgeItemById(${item.id}) did not return exact item`);
  }

  assertEqual(getKnowledgeItemById('non-existent'), undefined, 'getKnowledgeItemById should return undefined for missing ID');
  assertEqual(getKnowledgeItemById(''), undefined, 'getKnowledgeItemById should return undefined for empty string');
  assertEqual(getKnowledgeItemById('__proto__'), undefined, 'Prototype pollution check: __proto__ should return undefined');
  assertEqual(getKnowledgeItemById('toString'), undefined, 'Object method injection check: toString should return undefined');
});

test('getFollowUpQuestions falls back gracefully to initial questions on unknown or malformed IDs', () => {
  const initialItems = getInitialQuestions();

  const fallback1 = getFollowUpQuestions('non-existent-id');
  assertEqual(fallback1.length, 5, 'Fallback should return 5 initial items');
  assertEqual(fallback1.map(i => i.id).join(','), initialItems.map(i => i.id).join(','), 'Fallback mismatch on missing ID');

  const fallbackEmpty = getFollowUpQuestions('');
  assertEqual(fallbackEmpty.length, 5, 'Fallback should return 5 initial items on empty string');

  const fallbackNull = getFollowUpQuestions(null);
  assertEqual(fallbackNull.length, 5, 'Fallback should return 5 initial items on null');

  const fallbackUndefined = getFollowUpQuestions(undefined);
  assertEqual(fallbackUndefined.length, 5, 'Fallback should return 5 initial items on undefined');
});

test('getFollowUpItems handles valid and fallback KnowledgeItem objects safely', () => {
  const item = getKnowledgeItemById('core-what-is-mylaw');
  const followUps = getFollowUpItems(item);
  assertEqual(followUps.length, 3, 'core-what-is-mylaw should return 3 follow-ups');

  // Test item with empty followUpIds
  const dummyItem = { id: 'dummy', category: 'core', question: 'Q', answer: 'A', followUpIds: [] };
  const fallback = getFollowUpItems(dummyItem);
  assertEqual(fallback.length, 5, 'Empty followUpIds should fallback to initial questions');
});

test('INITIAL_GREETINGS contains >= 4 curated greetings and getRandomGreeting distributes properly', () => {
  assert(Array.isArray(INITIAL_GREETINGS), 'INITIAL_GREETINGS must be an array');
  assert(INITIAL_GREETINGS.length >= 4, 'INITIAL_GREETINGS must contain at least 4 greetings');
  assertEqual(GREETINGS, INITIAL_GREETINGS, 'GREETINGS must alias INITIAL_GREETINGS');

  for (const greeting of INITIAL_GREETINGS) {
    assert(typeof greeting === 'string' && greeting.length > 20, `Greeting string too short or invalid: ${greeting}`);
  }

  // Statistical distribution test over 20,000 samples
  const counts = new Map(INITIAL_GREETINGS.map(g => [g, 0]));
  const SAMPLES = 20000;
  for (let i = 0; i < SAMPLES; i++) {
    const greeting = getRandomGreeting();
    assert(counts.has(greeting), `getRandomGreeting returned unrecognized string: ${greeting}`);
    counts.set(greeting, counts.get(greeting) + 1);
  }

  // Each greeting should receive roughly SAMPLES / N (+/- 20%)
  const expectedAvg = SAMPLES / INITIAL_GREETINGS.length;
  console.log(`    Greeting distribution over ${SAMPLES} trials:`, Object.fromEntries(counts));
  for (const [g, count] of counts.entries()) {
    assert(count > expectedAvg * 0.7, `Greeting was selected too infrequently: ${count} vs expected ~${expectedAvg}`);
    assert(count < expectedAvg * 1.3, `Greeting was selected too frequently: ${count} vs expected ~${expectedAvg}`);
  }
});

// =========================================================================
// SUMMARY
// =========================================================================
console.log('\n================================================================');
console.log(`STRESS TEST SUMMARY: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
console.log('================================================================\n');

if (results.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
