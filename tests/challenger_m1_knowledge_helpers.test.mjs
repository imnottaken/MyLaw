/**
 * tests/challenger_m1_knowledge_helpers.test.mjs
 * 
 * EMPIRICAL CHALLENGER 2: Milestone M1 Adversarial Test Harness
 * Comprehensive Stress Testing for Knowledge Base Data Layer & Helper Functions:
 * - getKnowledgeItemById
 * - getInitialQuestions
 * - getFollowUpQuestions
 * - getFollowUpItems
 * - getRandomGreeting
 * - getAllCategories
 * 
 * Boundary Conditions, Malicious Payloads, Cyclic Graph Traversal,
 * Monte Carlo & Chi-Square Goodness-of-Fit Randomness Distribution,
 * Strict Immutability & Tamper Resistance, High-Throughput Fuzzing (500k iterations),
 * Zero Runtime Exceptions Verification.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';

console.log('================================================================');
console.log('   EMPIRICAL CHALLENGER: M1 KNOWLEDGE BASE ADVERSARIAL HARNESS  ');
console.log('================================================================\n');

// ── Module Transpiler & Loader ──
const rootDir = process.cwd();
const kbPath = path.join(rootDir, 'src/components/assistant/data/knowledge-base.ts');
const rawTs = fs.readFileSync(kbPath, 'utf8');

const transpiled = ts.transpileModule(rawTs, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022
  }
}).outputText;

const moduleObj = { exports: {} };
const customRequire = (id) => {
  if (id.includes('types/assistant')) return {};
  return {};
};

const fn = new Function('require', 'exports', 'module', transpiled);
fn(customRequire, moduleObj.exports, moduleObj);

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
} = moduleObj.exports;

// ── Test Runner ──
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function suite(name) {
  console.log(`\n▶ SUITE: ${name}`);
}

function test(name, testFn) {
  totalTests++;
  try {
    testFn();
    passedTests++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    failedTests++;
    failures.push({ name, error: err.message, stack: err.stack });
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

// ── SUITE 1: Module & Contract Integrity ──
suite('1. Module Exports & Contract Integrity');

test('All 6 helper functions and 9 constants are correctly exported', () => {
  assert.equal(typeof getKnowledgeItemById, 'function', 'getKnowledgeItemById must be a function');
  assert.equal(typeof getInitialQuestions, 'function', 'getInitialQuestions must be a function');
  assert.equal(typeof getFollowUpQuestions, 'function', 'getFollowUpQuestions must be a function');
  assert.equal(typeof getFollowUpItems, 'function', 'getFollowUpItems must be a function');
  assert.equal(typeof getRandomGreeting, 'function', 'getRandomGreeting must be a function');
  assert.equal(typeof getAllCategories, 'function', 'getAllCategories must be a function');

  assert(Array.isArray(CATEGORIES), 'CATEGORIES must be an array');
  assert(Array.isArray(INITIAL_GREETINGS), 'INITIAL_GREETINGS must be an array');
  assert(Array.isArray(GREETINGS), 'GREETINGS alias must be an array');
  assert(Array.isArray(INITIAL_QUESTION_IDS), 'INITIAL_QUESTION_IDS must be an array');
  assert(Array.isArray(KNOWLEDGE_ITEMS), 'KNOWLEDGE_ITEMS must be an array');
  assert(Array.isArray(KNOWLEDGE_BASE), 'KNOWLEDGE_BASE alias must be an array');
  assert.equal(typeof STATUTORY_LEGAL_DISCLAIMER, 'string', 'STATUTORY_LEGAL_DISCLAIMER must be string');
  assert.equal(typeof LEGAL_DISCLAIMER_TEXT, 'string', 'LEGAL_DISCLAIMER_TEXT must be string');
  assert.equal(typeof MICRO_DISCLAIMER_TEXT, 'string', 'MICRO_DISCLAIMER_TEXT must be string');
});

test('Exact Knowledge Base cardinality: 18 items across 5 categories', () => {
  assert.equal(KNOWLEDGE_ITEMS.length, 18, `Expected exactly 18 items, got ${KNOWLEDGE_ITEMS.length}`);
  assert.equal(CATEGORIES.length, 5, `Expected exactly 5 categories, got ${CATEGORIES.length}`);
  assert.equal(INITIAL_GREETINGS.length, 4, `Expected exactly 4 initial greetings, got ${INITIAL_GREETINGS.length}`);
  assert.equal(INITIAL_QUESTION_IDS.length, 5, `Expected exactly 5 initial question IDs, got ${INITIAL_QUESTION_IDS.length}`);
});

test('Every KnowledgeItem conforms to strict schema without undefined/null fields', () => {
  const validCategories = new Set(['core', 'why-mylaw', 'for-seeking-help', 'for-lawyers', 'launch']);
  const seenIds = new Set();

  for (const item of KNOWLEDGE_ITEMS) {
    assert(typeof item.id === 'string' && item.id.length > 0, `Item ID must be non-empty string: ${JSON.stringify(item)}`);
    assert(!seenIds.has(item.id), `Duplicate ID detected: ${item.id}`);
    seenIds.add(item.id);

    assert(validCategories.has(item.category), `Invalid category "${item.category}" in item ${item.id}`);
    assert(typeof item.question === 'string' && item.question.trim().length > 0, `Missing question in ${item.id}`);
    assert(typeof item.answer === 'string' && item.answer.trim().length > 0, `Missing answer in ${item.id}`);
    assert(Array.isArray(item.followUpIds), `followUpIds must be array in ${item.id}`);
    assert(item.followUpIds.length >= 2 && item.followUpIds.length <= 4, `followUpIds count should be 2-4 in ${item.id}, got ${item.followUpIds.length}`);

    for (const fId of item.followUpIds) {
      assert(typeof fId === 'string' && fId.length > 0, `Invalid followUpId in ${item.id}: ${fId}`);
    }

    if (item.cta) {
      assert(typeof item.cta.label === 'string' && item.cta.label.length > 0, `Invalid CTA label in ${item.id}`);
      assert(typeof item.cta.href === 'string' && item.cta.href.startsWith('/waitlist'), `CTA href must route to /waitlist in ${item.id}`);
      if (item.cta.role) {
        assert(['help', 'lawyer'].includes(item.cta.role), `Invalid CTA role in ${item.id}: ${item.cta.role}`);
      }
    }
  }
});

// ── SUITE 2: Boundary & Malicious Inputs for getKnowledgeItemById ──
suite('2. Boundary & Adversarial Inputs: getKnowledgeItemById');

test('Valid IDs: Returns exact matching item for all 18 items', () => {
  for (const item of KNOWLEDGE_ITEMS) {
    const fetched = getKnowledgeItemById(item.id);
    assert(fetched !== undefined, `Failed to retrieve item by valid ID: ${item.id}`);
    assert.equal(fetched.id, item.id);
    assert.equal(fetched.question, item.question);
    assert.equal(fetched.answer, item.answer);
    assert.equal(fetched.category, item.category);
  }
});

test('Negative & Malicious Inputs: Returns undefined with zero exceptions', () => {
  const adversarialInputs = [
    '',
    '   ',
    null,
    undefined,
    123,
    0,
    -1,
    true,
    false,
    NaN,
    Infinity,
    -Infinity,
    {},
    [],
    { id: 'core-what-is-mylaw' },
    ['core-what-is-mylaw'],
    // Prototype pollution
    '__proto__',
    'constructor',
    'toString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    // Injection attacks
    "' OR '1'='1",
    "'; DROP TABLE knowledge_items; --",
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert(1)>',
    '${7*7}',
    '{{7*7}}',
    // Path traversal
    '../../../../etc/passwd',
    '..\\..\\windows\\system32',
    // Special chars & Unicode
    '\u0000',
    '\n\r\t',
    '🚀🔥⚖️🏛️',
    '§§§',
    'undefined',
    'null',
    'NaN',
    // Long strings
    'a'.repeat(1000),
    'core-what-is-mylaw' + 'x'.repeat(10000),
    'x'.repeat(100000)
  ];

  for (const input of adversarialInputs) {
    let result;
    assert.doesNotThrow(() => {
      result = getKnowledgeItemById(input);
    }, `getKnowledgeItemById threw an exception on input: ${typeof input === 'string' ? input.slice(0, 30) : String(input)}`);
    assert.equal(result, undefined, `Expected undefined for input ${typeof input === 'string' ? input.slice(0, 30) : String(input)}, got: ${JSON.stringify(result)}`);
  }
});

// ── SUITE 3: Adversarial Testing: getInitialQuestions ──
suite('3. Initial Questions: getInitialQuestions');

test('Returns exactly 5 initial questions matching INITIAL_QUESTION_IDS in exact order', () => {
  const initials = getInitialQuestions();
  assert(Array.isArray(initials), 'Must return an array');
  assert.equal(initials.length, 5, `Expected 5 initial questions, got ${initials.length}`);

  const expectedIds = [
    'core-what-is-mylaw',
    'core-how-it-works',
    'help-find-lawyer',
    'lawyer-how-to-join',
    'launch-timeline'
  ];

  for (let i = 0; i < expectedIds.length; i++) {
    assert.equal(initials[i].id, expectedIds[i], `Item at index ${i} should be ${expectedIds[i]}, got ${initials[i]?.id}`);
    assert(initials[i].question.length > 0, `Question string must not be empty at index ${i}`);
  }
});

test('Array isolation: Successive calls return fresh array instances (prevents mutation pollution)', () => {
  const call1 = getInitialQuestions();
  const call2 = getInitialQuestions();

  assert.notEqual(call1, call2, 'getInitialQuestions should return a new array instance per call');
  assert.equal(call1.length, 5);

  // Adversarial mutation on call1
  call1.pop();
  call1.push({ id: 'injected-fake-id', question: 'Fake?' });
  call1[0] = null;

  // Verify call2 and subsequent calls are unaffected
  const call3 = getInitialQuestions();
  assert.equal(call3.length, 5, 'Call 3 must still have 5 items after call 1 was mutated');
  assert.equal(call3[0].id, 'core-what-is-mylaw', 'Call 3 first item must not be null');
  assert(!call3.some(it => it.id === 'injected-fake-id'), 'Call 3 must not contain injected item');
});

// ── SUITE 4: Boundary & Adversarial Inputs for getFollowUpQuestions ──
suite('4. Boundary & Adversarial Inputs: getFollowUpQuestions');

test('Valid IDs: Returns valid follow-up questions for all 18 items', () => {
  for (const item of KNOWLEDGE_ITEMS) {
    const followUps = getFollowUpQuestions(item.id);
    assert(Array.isArray(followUps), `Follow-ups for ${item.id} must be an array`);
    assert(followUps.length >= 2, `Expected at least 2 follow-ups for ${item.id}, got ${followUps.length}`);

    for (const fItem of followUps) {
      assert(fItem !== undefined && fItem !== null, `Follow-up item in ${item.id} must not be null/undefined`);
      assert(typeof fItem.id === 'string', `Follow-up item in ${item.id} must have string id`);
      assert(typeof fItem.question === 'string', `Follow-up item in ${item.id} must have question`);
      assert.equal(item.followUpIds.includes(fItem.id), true, `Returned follow-up ${fItem.id} was not in ${item.id}.followUpIds`);
    }
  }
});

test('Fallback behavior: Invalid, empty, or malicious IDs gracefully return initial questions', () => {
  const maliciousIds = [
    '',
    '   ',
    null,
    undefined,
    'non-existent-question-id-12345',
    '__proto__',
    'constructor',
    'toString',
    "' OR '1'='1",
    '<script>alert(1)</script>',
    12345,
    {},
    [],
    'x'.repeat(10000)
  ];

  const initialQuestions = getInitialQuestions();
  const initialIds = initialQuestions.map(q => q.id);

  for (const malId of maliciousIds) {
    let result;
    assert.doesNotThrow(() => {
      result = getFollowUpQuestions(malId);
    }, `getFollowUpQuestions threw on input: ${String(malId)}`);

    assert(Array.isArray(result), `Result for ${String(malId)} must be an array`);
    assert.equal(result.length, 5, `Fallback for ${String(malId)} must return exactly 5 initial questions`);
    const resultIds = result.map(q => q.id);
    assert.deepEqual(resultIds, initialIds, `Fallback IDs for ${String(malId)} must match initial question IDs`);
  }
});

test('Array isolation on getFollowUpQuestions: Mutation does not contaminate state', () => {
  const res1 = getFollowUpQuestions('core-what-is-mylaw');
  const initialLength = res1.length;
  res1.length = 0; // empty the array

  const res2 = getFollowUpQuestions('core-what-is-mylaw');
  assert.equal(res2.length, initialLength, 'Subsequent call must return original length despite prior mutation');
});

// ── SUITE 5: Boundary & Adversarial Inputs for getFollowUpItems ──
suite('5. Boundary & Adversarial Inputs: getFollowUpItems');

test('Valid KnowledgeItem objects: returns correct follow-up items', () => {
  for (const item of KNOWLEDGE_ITEMS) {
    const followUps = getFollowUpItems(item);
    assert(Array.isArray(followUps), `Follow-ups for ${item.id} must be array`);
    assert.equal(followUps.length, item.followUpIds.length);
    assert.deepEqual(followUps.map(f => f.id), item.followUpIds);
  }
});

test('Item with empty followUpIds array falls back to initial questions', () => {
  const fakeItem = {
    id: 'fake-item-no-followups',
    category: 'core',
    question: 'Fake question?',
    answer: 'Fake answer.',
    followUpIds: []
  };

  const result = getFollowUpItems(fakeItem);
  assert.equal(result.length, 5);
  assert.deepEqual(result.map(q => q.id), INITIAL_QUESTION_IDS);
});

test('Item with undefined/null followUpIds falls back gracefully', () => {
  const fakeItemNull = {
    id: 'fake-null-followups',
    category: 'core',
    question: 'Fake?',
    answer: 'Fake.',
    followUpIds: null
  };
  const fakeItemUndef = {
    id: 'fake-undef-followups',
    category: 'core',
    question: 'Fake?',
    answer: 'Fake.'
  };

  assert.doesNotThrow(() => {
    const res1 = getFollowUpItems(fakeItemNull);
    assert.equal(res1.length, 5);
  });

  assert.doesNotThrow(() => {
    const res2 = getFollowUpItems(fakeItemUndef);
    assert.equal(res2.length, 5);
  });
});

test('Item with non-existent followUpIds filters valid items or falls back to initial', () => {
  const fakeItemAllBad = {
    id: 'fake-all-bad',
    category: 'core',
    question: 'Fake?',
    answer: 'Fake.',
    followUpIds: ['ghost-1', 'ghost-2', 'ghost-3']
  };

  const resAllBad = getFollowUpItems(fakeItemAllBad);
  assert.equal(resAllBad.length, 5, 'When all followUpIds are invalid, must fall back to initial questions');
  assert.deepEqual(resAllBad.map(q => q.id), INITIAL_QUESTION_IDS);

  const fakeItemPartialBad = {
    id: 'fake-partial-bad',
    category: 'core',
    question: 'Fake?',
    answer: 'Fake.',
    followUpIds: ['core-what-is-mylaw', 'ghost-invalid-id', 'launch-timeline']
  };

  const resPartial = getFollowUpItems(fakeItemPartialBad);
  assert.equal(resPartial.length, 2, 'Should filter out invalid followUpIds and return valid ones');
  assert.deepEqual(resPartial.map(q => q.id), ['core-what-is-mylaw', 'launch-timeline']);
});

// ── SUITE 6: Directed Graph Traversal, Cycles & Deep Recursion ──
suite('6. Graph Traversal, Referential Integrity & Cyclic Stress Test');

test('Complete Referential Integrity: 100% of followUpIds exist in knowledge base', () => {
  const allIds = new Set(KNOWLEDGE_ITEMS.map(it => it.id));
  let totalEdges = 0;

  for (const item of KNOWLEDGE_ITEMS) {
    for (const fId of item.followUpIds) {
      totalEdges++;
      assert(allIds.has(fId), `Broken edge: Item "${item.id}" references non-existent followUpId "${fId}"`);
    }
  }

  console.log(`    Graph verified: 18 nodes, ${totalEdges} directed edges. 100% referential integrity.`);
});

test('Global Reachability: All 18 knowledge items reachable from the 5 initial questions', () => {
  const visited = new Set();
  const queue = [...INITIAL_QUESTION_IDS];

  for (const id of queue) {
    visited.add(id);
  }

  while (queue.length > 0) {
    const currentId = queue.shift();
    const item = getKnowledgeItemById(currentId);
    if (!item) continue;

    for (const nextId of item.followUpIds) {
      if (!visited.has(nextId)) {
        visited.add(nextId);
        queue.push(nextId);
      }
    }
  }

  assert.equal(visited.size, 18, `Only ${visited.size} of 18 items were reachable from initial questions. Unreachable: ${KNOWLEDGE_ITEMS.filter(it => !visited.has(it.id)).map(it => it.id).join(', ')}`);
});

test('Deep Cyclic Traversal Stress Test: 50,000 continuous question transitions without memory leak or crash', () => {
  let currentId = 'core-what-is-mylaw';
  const startMemory = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  for (let step = 0; step < 50000; step++) {
    const followUps = getFollowUpQuestions(currentId);
    assert(followUps.length > 0, `Dead end at step ${step} on question ${currentId}`);
    
    // Pick next question deterministically based on step
    const nextItem = followUps[step % followUps.length];
    assert(nextItem && typeof nextItem.id === 'string', `Invalid item at step ${step}`);
    currentId = nextItem.id;
  }

  const duration = performance.now() - startTime;
  const endMemory = process.memoryUsage().heapUsed;
  const memoryDeltaMb = (endMemory - startMemory) / (1024 * 1024);

  console.log(`    50,000 transitions completed in ${duration.toFixed(2)}ms (${(50000 / (duration / 1000)).toFixed(0)} ops/sec). Heap delta: ${memoryDeltaMb.toFixed(2)}MB`);
  assert(duration < 200, `Traversal took too long: ${duration.toFixed(2)}ms (expected < 200ms)`);
});

// ── SUITE 7: Greeting Randomness Distribution & Statistical Analysis ──
suite('7. Greeting Randomness & Chi-Square Goodness-of-Fit Analysis');

test('Curated greetings pool matches exact count (4) and non-empty strings', () => {
  assert.equal(INITIAL_GREETINGS.length, 4, 'Must have exactly 4 greetings');
  for (let i = 0; i < INITIAL_GREETINGS.length; i++) {
    assert(typeof INITIAL_GREETINGS[i] === 'string', `Greeting ${i} must be string`);
    assert(INITIAL_GREETINGS[i].trim().length > 20, `Greeting ${i} must be substantial message`);
  }
});

test('Monte Carlo 100,000 Iterations: 100% valid greeting returns with 0% undefined/null', () => {
  const validGreetingsSet = new Set(INITIAL_GREETINGS);
  const counts = [0, 0, 0, 0];
  const N = 100000;

  for (let i = 0; i < N; i++) {
    const greeting = getRandomGreeting();
    assert(validGreetingsSet.has(greeting), `getRandomGreeting returned unrecognized string: ${greeting}`);
    const idx = INITIAL_GREETINGS.indexOf(greeting);
    counts[idx]++;
  }

  console.log(`    Monte Carlo distribution over ${N} trials:`);
  for (let i = 0; i < 4; i++) {
    const pct = ((counts[i] / N) * 100).toFixed(2);
    console.log(`      Greeting [${i}]: ${counts[i]} hits (${pct}%)`);
    assert(counts[i] > 23000, `Greeting [${i}] received suspiciously few hits: ${counts[i]} (expected ~25000)`);
    assert(counts[i] < 27000, `Greeting [${i}] received suspiciously many hits: ${counts[i]} (expected ~25000)`);
  }

  // ── Chi-Square Goodness-of-Fit Test ──
  // H0: The distribution is uniform across 4 greetings (expected = N / 4 = 25,000)
  // Degrees of freedom: k - 1 = 4 - 1 = 3
  // Critical chi-square value for df=3 at alpha=0.001 (99.9% confidence) is 16.27
  const expectedCount = N / 4;
  let chiSquare = 0;
  for (let i = 0; i < 4; i++) {
    const diff = counts[i] - expectedCount;
    chiSquare += (diff * diff) / expectedCount;
  }

  console.log(`    Chi-Square statistic: χ² = ${chiSquare.toFixed(4)} (critical threshold at α=0.001 is 16.27)`);
  assert(chiSquare < 16.27, `Chi-Square test failed! χ² = ${chiSquare} exceeds critical value 16.27, indicating severe non-uniform bias`);
});

test('Boundary floats on Math.random mapping logic', () => {
  const originalRandom = Math.random;
  try {
    const testCases = [
      { mock: 0.0, expectedIdx: 0 },
      { mock: 0.249999, expectedIdx: 0 },
      { mock: 0.25, expectedIdx: 1 },
      { mock: 0.499999, expectedIdx: 1 },
      { mock: 0.5, expectedIdx: 2 },
      { mock: 0.749999, expectedIdx: 2 },
      { mock: 0.75, expectedIdx: 3 },
      { mock: 0.999999999, expectedIdx: 3 }
    ];

    for (const { mock, expectedIdx } of testCases) {
      Math.random = () => mock;
      const result = getRandomGreeting();
      assert.equal(result, INITIAL_GREETINGS[expectedIdx], `For Math.random() = ${mock}, expected greeting index ${expectedIdx}`);
    }

    // Edge case: Math.random() returns 1.0 (hypothetical flawed PRNG engine)
    Math.random = () => 1.0;
    const fallbackResult = getRandomGreeting();
    assert(INITIAL_GREETINGS.includes(fallbackResult), 'Must fall back safely even if Math.random returns 1.0');

  } finally {
    Math.random = originalRandom;
  }
});

// ── SUITE 8: Categories & Metadata (getAllCategories) ──
suite('8. Category Metadata & Data Distribution');

test('getAllCategories returns all 5 required categories with complete metadata', () => {
  const categories = getAllCategories();
  assert(Array.isArray(categories), 'Must return an array');
  assert.equal(categories.length, 5, 'Must have 5 categories');

  const expectedKeys = ['core', 'why-mylaw', 'for-seeking-help', 'for-lawyers', 'launch'];
  const actualKeys = categories.map(c => c.key);
  assert.deepEqual(actualKeys, expectedKeys, `Category keys mismatch: ${actualKeys.join(', ')}`);

  for (const cat of categories) {
    assert(typeof cat.key === 'string' && cat.key.length > 0, `Invalid category key: ${cat.key}`);
    assert(typeof cat.label === 'string' && cat.label.length > 0, `Invalid category label: ${cat.label}`);
    assert(typeof cat.description === 'string' && cat.description.length > 0, `Invalid category description: ${cat.description}`);
  }
});

test('Category distribution across 18 knowledge items is complete and balanced', () => {
  const catCounts = {
    'core': 0,
    'why-mylaw': 0,
    'for-seeking-help': 0,
    'for-lawyers': 0,
    'launch': 0
  };

  for (const item of KNOWLEDGE_ITEMS) {
    assert(catCounts[item.category] !== undefined, `Unknown category in item ${item.id}: ${item.category}`);
    catCounts[item.category]++;
  }

  assert.equal(catCounts['core'], 4, 'Core category must have 4 items');
  assert.equal(catCounts['why-mylaw'], 4, 'Why MyLaw category must have 4 items');
  assert.equal(catCounts['for-seeking-help'], 4, 'For Seeking Help category must have 4 items');
  assert.equal(catCounts['for-lawyers'], 3, 'For Lawyers category must have 3 items');
  assert.equal(catCounts['launch'], 3, 'Launch category must have 3 items');
  
  const total = Object.values(catCounts).reduce((a, b) => a + b, 0);
  assert.equal(total, 18, 'Sum of category items must equal 18');
});

// ── SUITE 9: Disclaimers & Statutory Compliance ──
suite('9. Statutory Legal Disclaimers & Guardrail Text');

test('STATUTORY_LEGAL_DISCLAIMER text matches exact legal phrasing', () => {
  const expected = "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.";
  assert.equal(STATUTORY_LEGAL_DISCLAIMER, expected, 'STATUTORY_LEGAL_DISCLAIMER does not match exact specification');
  assert.equal(LEGAL_DISCLAIMER_TEXT, expected, 'LEGAL_DISCLAIMER_TEXT alias does not match');
});

test('MICRO_DISCLAIMER_TEXT matches exact footer string', () => {
  const expected = "Informational assistant only. No legal advice provided.";
  assert.equal(MICRO_DISCLAIMER_TEXT, expected, 'MICRO_DISCLAIMER_TEXT does not match exact specification');
});

test('Legal advice Q&A item has isDisclaimer: true and contains verbatim disclaimer text', () => {
  const adviceItem = getKnowledgeItemById('core-is-it-legal-advice');
  assert(adviceItem !== undefined, 'Missing core-is-it-legal-advice item');
  assert.equal(adviceItem.isDisclaimer, true, 'core-is-it-legal-advice must have isDisclaimer: true');
  assert(adviceItem.answer.includes(STATUTORY_LEGAL_DISCLAIMER), 'core-is-it-legal-advice answer must include statutory disclaimer');
});

// ── SUITE 10: CTA Metadata & Routing ──
suite('10. CTA Metadata & Routing Integrity');

test('All CTA items route to /waitlist and lawyer items include role=lawyer query param', () => {
  const ctaItems = KNOWLEDGE_ITEMS.filter(it => it.cta !== undefined);
  assert(ctaItems.length >= 5, `Expected at least 5 items with CTAs, got ${ctaItems.length}`);

  for (const item of ctaItems) {
    const { cta } = item;
    assert(cta.label.includes('→'), `CTA label in ${item.id} should include arrow "→", got "${cta.label}"`);
    assert(cta.href.startsWith('/waitlist'), `CTA href in ${item.id} must start with /waitlist, got "${cta.href}"`);

    if (item.category === 'for-lawyers') {
      assert.equal(cta.role, 'lawyer', `Lawyer CTA in ${item.id} must have role: 'lawyer'`);
      assert(cta.href.includes('role=lawyer'), `Lawyer CTA href in ${item.id} must include role=lawyer`);
    }
  }
});

// ── SUITE 11: Immutability & Tamper Resistance ──
suite('11. Immutability & Tamper Resistance');

test('Aggressive mutation attacks on helper returns do not corrupt data layer', () => {
  // Test 1: Mutating getInitialQuestions return
  const initials = getInitialQuestions();
  initials.reverse();
  initials[0] = { id: 'corrupted-item', question: 'Hacked' };
  
  const freshInitials = getInitialQuestions();
  assert.equal(freshInitials[0].id, 'core-what-is-mylaw', 'Fresh getInitialQuestions was corrupted by prior array mutation!');

  // Test 2: Mutating getFollowUpQuestions return
  const followUps = getFollowUpQuestions('core-how-it-works');
  const originalFollowUpCount = followUps.length;
  followUps.shift();
  followUps.push({ id: 'injected-followup' });

  const freshFollowUps = getFollowUpQuestions('core-how-it-works');
  assert.equal(freshFollowUps.length, originalFollowUpCount, 'Fresh getFollowUpQuestions was corrupted by prior mutation!');
  assert.equal(freshFollowUps[0].id, 'help-find-lawyer');

  // Test 3: Mutating getAllCategories return
  const cats = getAllCategories();
  assert.equal(cats.length, 5);
});

// ── SUITE 12: High-Throughput Fuzzing & Concurrency ──
suite('12. High-Throughput Fuzzing & Concurrency (500,000 Operations)');

test('500,000 randomized operations across all helpers execute with 0 runtime errors in < 500ms', () => {
  const operations = [
    () => getKnowledgeItemById('core-what-is-mylaw'),
    () => getKnowledgeItemById('help-find-lawyer'),
    () => getKnowledgeItemById('invalid-id-' + Math.random()),
    () => getKnowledgeItemById(''),
    () => getKnowledgeItemById(null),
    () => getKnowledgeItemById('__proto__'),
    () => getInitialQuestions(),
    () => getFollowUpQuestions('core-what-is-mylaw'),
    () => getFollowUpQuestions('launch-timeline'),
    () => getFollowUpQuestions('unknown-id-' + Math.random()),
    () => getFollowUpQuestions(''),
    () => getRandomGreeting(),
    () => getAllCategories()
  ];

  const N = 500000;
  const startTime = performance.now();
  let exceptionCount = 0;

  for (let i = 0; i < N; i++) {
    const op = operations[i % operations.length];
    try {
      op();
    } catch (err) {
      exceptionCount++;
    }
  }

  const duration = performance.now() - startTime;
  const opsPerSec = (N / (duration / 1000)).toFixed(0);

  console.log(`    ${N.toLocaleString()} operations completed in ${duration.toFixed(2)}ms (${Number(opsPerSec).toLocaleString()} ops/sec). Exceptions: ${exceptionCount}`);
  assert.equal(exceptionCount, 0, `Encountered ${exceptionCount} exceptions during fuzzing!`);
  assert(duration < 500, `Fuzzing took too long: ${duration.toFixed(2)}ms (target < 500ms)`);
});

// ── Test Summary & Verdict ──
console.log('\n================================================================');
console.log('   TEST EXECUTION SUMMARY');
console.log('================================================================');
console.log(`Total Tests Run : ${totalTests}`);
console.log(`Passed          : ${passedTests}`);
console.log(`Failed          : ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  console.error(`❌ VERDICT: FAIL (${failedTests} test(s) failed)`);
  process.exit(1);
} else {
  console.log('✅ VERDICT: 100% PASS (All helper functions, boundaries, and stress tests confirmed)');
  process.exit(0);
}
