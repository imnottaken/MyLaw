/**
 * .agents/teamwork_preview_auditor_m1_fix/verify_m1_deep.mjs
 * Forensic Verification Script for M1 Iteration 2
 */

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const projectRoot = process.cwd();
console.log('Starting Forensic Integrity Verification for M1 Iteration 2...');
console.log('Project Root:', projectRoot);

// Transpile and load knowledge-base.ts
const kbPath = path.join(projectRoot, 'src/components/assistant/data/knowledge-base.ts');
const rawTs = fs.readFileSync(kbPath, 'utf8');

const transpiled = ts.transpileModule(rawTs, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022
  }
}).outputText;

const moduleObj = { exports: {} };
const fn = new Function('require', 'exports', 'module', transpiled);
fn(() => ({}), moduleObj.exports, moduleObj);

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

let checksPassed = 0;
let totalChecks = 0;

function assertCheck(desc, condition) {
  totalChecks++;
  if (!condition) {
    console.error(`❌ FAIL: ${desc}`);
    throw new Error(`Integrity Check Failed: ${desc}`);
  }
  checksPassed++;
  console.log(`✅ PASS: ${desc}`);
}

// 1. Schema & Cardinality
assertCheck('CATEGORIES contains exactly 5 categories', CATEGORIES.length === 5);
assertCheck('INITIAL_GREETINGS contains exactly 4 greetings', INITIAL_GREETINGS.length === 4);
assertCheck('GREETINGS aliases INITIAL_GREETINGS', GREETINGS === INITIAL_GREETINGS);
assertCheck('INITIAL_QUESTION_IDS contains exactly 5 initial IDs', INITIAL_QUESTION_IDS.length === 5);
assertCheck('KNOWLEDGE_ITEMS contains exactly 18 items', KNOWLEDGE_ITEMS.length === 18);
assertCheck('KNOWLEDGE_BASE aliases KNOWLEDGE_ITEMS', KNOWLEDGE_BASE === KNOWLEDGE_ITEMS);

// 2. Exact Disclaimers
assertCheck(
  'STATUTORY_LEGAL_DISCLAIMER matches statutory wording',
  STATUTORY_LEGAL_DISCLAIMER === "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."
);
assertCheck(
  'LEGAL_DISCLAIMER_TEXT aliases STATUTORY_LEGAL_DISCLAIMER',
  LEGAL_DISCLAIMER_TEXT === STATUTORY_LEGAL_DISCLAIMER
);
assertCheck(
  'MICRO_DISCLAIMER_TEXT matches expected footer text',
  MICRO_DISCLAIMER_TEXT === "Informational assistant only. No legal advice provided."
);

// 3. Category completeness
const categoryKeys = new Set(CATEGORIES.map(c => c.key));
const expectedCategories = ['core', 'why-mylaw', 'for-seeking-help', 'for-lawyers', 'launch'];
assertCheck('All 5 expected category keys present', expectedCategories.every(k => categoryKeys.has(k)));

const itemsByCategory = {};
for (const k of expectedCategories) itemsByCategory[k] = 0;
for (const item of KNOWLEDGE_ITEMS) {
  assertCheck(`Item ${item.id} has valid category`, categoryKeys.has(item.category));
  itemsByCategory[item.category]++;
}
assertCheck('Category counts are well-partitioned', 
  itemsByCategory['core'] === 4 &&
  itemsByCategory['why-mylaw'] === 4 &&
  itemsByCategory['for-seeking-help'] === 4 &&
  itemsByCategory['for-lawyers'] === 3 &&
  itemsByCategory['launch'] === 3
);

// 4. Graph Theory & Reachability
const idSet = new Set(KNOWLEDGE_ITEMS.map(i => i.id));
assertCheck('All 18 item IDs are unique', idSet.size === 18);

let totalDirectedEdges = 0;
const inDegrees = {};
for (const id of idSet) inDegrees[id] = 0;

for (const item of KNOWLEDGE_ITEMS) {
  assertCheck(`Item ${item.id} question is non-empty`, item.question && item.question.trim().length > 0);
  assertCheck(`Item ${item.id} answer is non-empty`, item.answer && item.answer.trim().length > 0);
  assertCheck(`Item ${item.id} has 2-4 followUpIds`, item.followUpIds && item.followUpIds.length >= 2 && item.followUpIds.length <= 4);
  assertCheck(`Item ${item.id} has no self-loops`, !item.followUpIds.includes(item.id));

  for (const fId of item.followUpIds) {
    totalDirectedEdges++;
    assertCheck(`Edge from ${item.id} -> ${fId} exists in knowledge base`, idSet.has(fId));
    inDegrees[fId]++;
  }
}
assertCheck('Total directed edges is 54', totalDirectedEdges === 54);

// BFS Reachability
const visited = new Set();
const queue = [...INITIAL_QUESTION_IDS];
for (const q of queue) visited.add(q);

while (queue.length > 0) {
  const cur = queue.shift();
  const item = getKnowledgeItemById(cur);
  for (const next of item.followUpIds) {
    if (!visited.has(next)) {
      visited.add(next);
      queue.push(next);
    }
  }
}
assertCheck('100% Graph Reachability from initial 5 questions (18/18 reachable)', visited.size === 18);

// In-degree check
const zeroInDegree = Object.entries(inDegrees).filter(([id, deg]) => deg === 0);
assertCheck('Zero unreachable orphan nodes (0 nodes with 0 in-degree)', zeroInDegree.length === 0);

// 5. Helper Function Behaviors & Boundaries
for (const item of KNOWLEDGE_ITEMS) {
  const fetched = getKnowledgeItemById(item.id);
  assertCheck(`getKnowledgeItemById returns correct item for ${item.id}`, fetched && fetched.id === item.id);
}
assertCheck('getKnowledgeItemById returns undefined on empty string', getKnowledgeItemById('') === undefined);
assertCheck('getKnowledgeItemById returns undefined on null', getKnowledgeItemById(null) === undefined);
assertCheck('getKnowledgeItemById returns undefined on undefined', getKnowledgeItemById(undefined) === undefined);
assertCheck('getKnowledgeItemById returns undefined on __proto__', getKnowledgeItemById('__proto__') === undefined);

const initialItems = getInitialQuestions();
assertCheck('getInitialQuestions returns 5 items', initialItems.length === 5);
assertCheck('getInitialQuestions returns fresh array instance', getInitialQuestions() !== initialItems);

const followUps = getFollowUpQuestions('core-what-is-mylaw');
assertCheck('getFollowUpQuestions returns correct follow-up count', followUps.length === 3);

const fallbackFollowUps = getFollowUpQuestions('non-existent-id');
assertCheck('getFollowUpQuestions falls back to initial 5 questions on invalid ID', fallbackFollowUps.length === 5);

// 6. Disclaimer item validation
const disclaimerItem = getKnowledgeItemById('core-is-it-legal-advice');
assertCheck('core-is-it-legal-advice exists', Boolean(disclaimerItem));
assertCheck('core-is-it-legal-advice has isDisclaimer: true', disclaimerItem.isDisclaimer === true);
assertCheck('core-is-it-legal-advice answer contains statutory disclaimer', disclaimerItem.answer.includes(STATUTORY_LEGAL_DISCLAIMER));

// 7. CTA validation
const ctaItems = KNOWLEDGE_ITEMS.filter(i => i.cta !== undefined);
assertCheck('At least 5 CTA items defined', ctaItems.length >= 5);
for (const item of ctaItems) {
  assertCheck(`CTA in ${item.id} has non-empty label with arrow`, item.cta.label.includes('→'));
  assertCheck(`CTA in ${item.id} routes to /waitlist`, item.cta.href.startsWith('/waitlist'));
  if (item.category === 'for-lawyers') {
    assertCheck(`Lawyer CTA in ${item.id} has role: 'lawyer'`, item.cta.role === 'lawyer');
    assertCheck(`Lawyer CTA in ${item.id} href includes role=lawyer`, item.cta.href.includes('role=lawyer'));
  }
}

// 8. Monte Carlo Greeting test
const greetingCounts = [0, 0, 0, 0];
for (let i = 0; i < 40000; i++) {
  const g = getRandomGreeting();
  const idx = INITIAL_GREETINGS.indexOf(g);
  greetingCounts[idx]++;
}
assertCheck('All 4 greetings selected in Monte Carlo test', greetingCounts.every(c => c > 8000 && c < 12000));

console.log(`\n========================================================`);
console.log(`Forensic Deep Verification: ${checksPassed}/${totalChecks} PASSED`);
console.log(`Verdict: CLEAN`);
console.log(`========================================================\n`);
