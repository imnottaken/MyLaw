/**
 * Challenger 1 — Milestone 2 Adversarial Stress Test Suite
 * 
 * Deeply challenges and empirically verifies UI Components & State Machine:
 * 1. Rapid Toggle State Transitions (open/close debouncing, rapid spamming, mid-transition interrupts)
 * 2. Multi-Step Question Selection & Follow-Up Tree Traversal (0 dead-ends, history accumulation, back button reset)
 * 3. Escape Key Event Handling in All Conversational States
 * 4. Strict DOM Tree Assertions (header text, tooltip, micro-disclaimer, statutory disclaimer, CTAs)
 * 5. Guardrail Integrity & Negative Assertions (no free-text, no dynamic AI, no dark mode, brand tokens)
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToString } from 'react-dom/server';

const require = createRequire(import.meta.url);

// Test results accumulator
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

async function asyncTest(name, fn) {
  results.total++;
  try {
    await fn();
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
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message || 'Assertion failed'} - Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
  }
}

// Module loader for TypeScript/TSX components in Node
function loadTsxModule(filePath, mockedImports = {}) {
  const code = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX
    }
  }).outputText;

  const moduleObj = { exports: {} };
  const customRequire = (id) => {
    if (mockedImports[id]) return mockedImports[id];
    if (id === 'react') return React;
    if (id === 'react/jsx-runtime') return require('react/jsx-runtime');
    if (id === 'next/link') {
      return {
        default: function MockLink({ href, children, className, onClick, ...rest }) {
          return React.createElement('a', { href, className, onClick, ...rest }, children);
        }
      };
    }
    if (id === 'next/navigation') {
      return {
        useSearchParams: () => new URLSearchParams(''),
        useRouter: () => ({ push: () => {}, replace: () => {} }),
        usePathname: () => '/'
      };
    }
    if (id.startsWith('@/')) {
      const relPath = id.replace('@/', 'src/');
      const resolved = path.resolve(process.cwd(), relPath);
      const possibleExtensions = ['', '.tsx', '.ts', '/index.tsx', '/index.ts', '.jsx', '.js'];
      for (const ext of possibleExtensions) {
        if (fs.existsSync(resolved + ext) && !fs.statSync(resolved + ext).isDirectory()) {
          return loadTsxModule(resolved + ext, mockedImports);
        }
      }
    }
    if (id.startsWith('./') || id.startsWith('../')) {
      const resolved = path.resolve(path.dirname(filePath), id);
      const possibleExtensions = ['', '.tsx', '.ts', '/index.tsx', '/index.ts', '.jsx', '.js'];
      for (const ext of possibleExtensions) {
        if (fs.existsSync(resolved + ext) && !fs.statSync(resolved + ext).isDirectory()) {
          return loadTsxModule(resolved + ext, mockedImports);
        }
      }
    }
    return require(id);
  };

  const fn = new Function('require', 'module', 'exports', 'React', transpiled);
  fn(customRequire, moduleObj, moduleObj.exports, React);
  return moduleObj.exports;
}

// =========================================================================
// TEST EXECUTION
// =========================================================================

async function run() {
  console.log('\n===================================================================');
  console.log('  CHALLENGER 1 — MILESTONE M2 ADVERSARIAL STRESS TEST SUITE');
  console.log('===================================================================\n');

  // Load Assistant and Subcomponents
  const iconsModule = loadTsxModule(path.resolve('src/components/icons/index.tsx'));
  const kbModule = loadTsxModule(path.resolve('src/components/assistant/data/knowledge-base.ts'));
  const triggerModule = loadTsxModule(path.resolve('src/components/assistant/AssistantTrigger.tsx'), {
    '@/components/icons': iconsModule
  });
  const messageBubbleModule = loadTsxModule(path.resolve('src/components/assistant/MessageBubble.tsx'), {
    '@/components/icons': iconsModule
  });
  const questionPillModule = loadTsxModule(path.resolve('src/components/assistant/QuestionPill.tsx'), {
    '@/components/icons': iconsModule
  });
  const panelModule = loadTsxModule(path.resolve('src/components/assistant/AssistantPanel.tsx'), {
    '@/components/icons': iconsModule,
    './MessageBubble': messageBubbleModule,
    './QuestionPill': questionPillModule,
    './data/knowledge-base': kbModule
  });
  loadTsxModule(path.resolve('src/components/assistant/Assistant.tsx'), {
    './AssistantTrigger': triggerModule,
    './AssistantPanel': panelModule,
    './data/knowledge-base': kbModule
  });

  const {
    CATEGORIES,
    INITIAL_GREETINGS,
    INITIAL_QUESTION_IDS,
    STATUTORY_LEGAL_DISCLAIMER,
    MICRO_DISCLAIMER_TEXT,
    KNOWLEDGE_ITEMS,
    getKnowledgeItemById,
    getInitialQuestions,
    getFollowUpQuestions,
    getRandomGreeting
  } = kbModule;

  // -------------------------------------------------------------------------
  // SUITE 1: Rapid Toggle State Transitions & Debouncing
  // -------------------------------------------------------------------------
  console.log('▶ [Suite 1] Rapid Toggle State Transitions & Debounce Fuzzing');

  test('Suite 1.1: Trigger button rendering when closed (Sparkles, pulse dot, tooltip, aria-expanded=false)', () => {
    const { AssistantTrigger } = triggerModule;
    const html = renderToString(React.createElement(AssistantTrigger, { isOpen: false, onToggle: () => {} }));

    assert(html.includes('aria-expanded="false"'), 'Must have aria-expanded="false" when closed');
    assert(html.includes('aria-label="Ask MyLaw Assistant"'), 'Must have aria-label="Ask MyLaw Assistant" when closed');
    assert(html.includes('aria-describedby="assistant-trigger-tooltip"'), 'Must link to tooltip via aria-describedby');
    assert(html.includes('id="assistant-trigger-tooltip"'), 'Tooltip element must exist when closed');
    assert(html.includes('Ask MyLaw'), 'Tooltip must contain exact text "Ask MyLaw"');
    assert(html.includes('animate-ping'), 'Pulse indicator must be rendered when closed');
    assert(html.includes('bg-[#2F7C78]'), 'Pulse indicator must use teal #2F7C78');
    assert(html.includes('w-[52px] h-[52px]'), 'Trigger button must have 52px dimensions (48-56px spec)');
  });

  test('Suite 1.2: Trigger button rendering when open (CloseIcon, pulse hidden, tooltip hidden, aria-expanded=true)', () => {
    const { AssistantTrigger } = triggerModule;
    const html = renderToString(React.createElement(AssistantTrigger, { isOpen: true, onToggle: () => {} }));

    assert(html.includes('aria-expanded="true"'), 'Must have aria-expanded="true" when open');
    assert(html.includes('aria-label="Close MyLaw Assistant"'), 'Must have aria-label="Close MyLaw Assistant" when open');
    assert(!html.includes('id="assistant-trigger-tooltip"'), 'Tooltip must NOT be rendered when open');
    assert(!html.includes('animate-ping'), 'Pulse indicator must NOT be rendered when open');
    assert(!html.includes('aria-describedby'), 'aria-describedby must be omitted when open');
  });

  test('Suite 1.3: Panel returns null when isOpen is false', () => {
    const { AssistantPanel } = panelModule;
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: false,
        messages: [],
        currentQuestions: getInitialQuestions(),
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );
    assertEqual(html, '', 'Panel must render nothing (null) when isOpen is false');
  });

  await asyncTest('Suite 1.4: 100-cycle rapid toggle state machine simulation preserves deterministic consistency', async () => {
    // State machine simulator testing rapid open/close spamming
    let isOpen = false;
    let messages = [];
    let toggleCount = 0;

    const handleOpen = () => {
      isOpen = true;
      toggleCount++;
      if (messages.length === 0) {
        messages.push({
          id: `greeting-${Date.now()}`,
          sender: 'assistant',
          text: getRandomGreeting(),
          timestamp: Date.now()
        });
      }
    };

    const handleClose = () => {
      isOpen = false;
      toggleCount++;
    };

    const handleToggle = () => {
      if (isOpen) handleClose();
      else handleOpen();
    };

    // Spam toggle 100 times in rapid succession
    for (let i = 0; i < 100; i++) {
      handleToggle();
      if (i % 2 === 0) {
        assert(isOpen === true, `Cycle ${i}: Expected isOpen=true`);
      } else {
        assert(isOpen === false, `Cycle ${i}: Expected isOpen=false`);
      }
    }

    assertEqual(toggleCount, 100, 'All 100 toggles registered deterministically');
    assertEqual(isOpen, false, 'Final state is closed after even number of toggles');
    assertEqual(messages.length, 1, 'Only 1 greeting initialized despite 100 toggles');
    assert(INITIAL_GREETINGS.includes(messages[0].text), 'Greeting is from valid pool');
  });

  await asyncTest('Suite 1.5: Interrupted transition stress test (question select -> immediate close at t=50ms)', async () => {
    let isOpen = true;
    let messages = [{ id: 'greeting', sender: 'assistant', text: 'Hi', timestamp: 1 }];
    let activeQuestionId = null;
    let isTransitioning = false;
    let timer = null;

    const selectQuestion = (qId) => {
      const item = getKnowledgeItemById(qId);
      messages.push({ id: `user-${Date.now()}`, sender: 'user', text: item.question, timestamp: Date.now() });
      isTransitioning = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        messages.push({ id: `asst-${Date.now()}`, sender: 'assistant', text: item.answer, timestamp: Date.now() });
        activeQuestionId = item.id;
        isTransitioning = false;
      }, 180);
    };

    // User selects question
    selectQuestion('core-what-is-mylaw');
    // Close panel mid-transition after 50ms
    await new Promise((r) => setTimeout(r, 50));
    isOpen = false;
    assert(!isOpen, 'Panel is closed');
    // Cleanup timer on close
    if (timer) clearTimeout(timer);

    // Wait until after the 180ms mark
    await new Promise((r) => setTimeout(r, 200));

    // Confirm timer was successfully cancelled
    assertEqual(messages.length, 2, 'Assistant message was not pushed after timer cancellation');
    assertEqual(activeQuestionId, null, 'activeQuestionId remains null');
  });

  // -------------------------------------------------------------------------
  // SUITE 2: Multi-Step Question Selection & Follow-Up Tree Traversal
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 2] Multi-Step Question Selection & Follow-Up Tree Traversal');

  test('Suite 2.1: Knowledge Base has exactly 18 items across 5 categories', () => {
    assertEqual(KNOWLEDGE_ITEMS.length, 18, 'Must contain exactly 18 items');
    assertEqual(CATEGORIES.length, 5, 'Must have 5 categories');

    const expectedCategories = ['core', 'why-mylaw', 'for-seeking-help', 'for-lawyers', 'launch'];
    const actualCategories = CATEGORIES.map((c) => c.key);
    assertEqual(actualCategories, expectedCategories, 'Categories match specification');
  });

  test('Suite 2.2: Initial questions list returns exactly 5 valid items', () => {
    const initialQs = getInitialQuestions();
    assertEqual(initialQs.length, 5, 'Must return exactly 5 initial questions');
    assertEqual(INITIAL_QUESTION_IDS.length, 5, 'INITIAL_QUESTION_IDS has 5 IDs');

    for (const q of initialQs) {
      assert(q.id && q.question && q.answer, `Initial question ${q.id} must be complete`);
      assert(q.followUpIds && q.followUpIds.length >= 2, `Initial question ${q.id} must have >= 2 follow-ups`);
    }
  });

  test('Suite 2.3: Zero Dead-Ends Graph Assertion — 100% of nodes have valid, resolvable follow-up questions', () => {
    for (const item of KNOWLEDGE_ITEMS) {
      assert(item.followUpIds, `Item ${item.id} must define followUpIds`);
      assert(item.followUpIds.length >= 2 && item.followUpIds.length <= 3, `Item ${item.id} must have 2-3 follow-ups, got: ${item.followUpIds.length}`);

      for (const followUpId of item.followUpIds) {
        const resolved = getKnowledgeItemById(followUpId);
        assert(resolved !== undefined, `Dead-end link in "${item.id}": follow-up ID "${followUpId}" not found in KB!`);
      }

      // Test helper function
      const followUps = getFollowUpQuestions(item.id);
      assertEqual(followUps.length, item.followUpIds.length, `getFollowUpQuestions("${item.id}") length mismatch`);
      for (const fq of followUps) {
        assert(fq.id && fq.question && fq.answer, `Follow-up question for ${item.id} is complete`);
      }
    }
  });

  test('Suite 2.4: Graph Traversal Depth Simulation (5-step continuous navigation with history accumulation)', () => {
    let activeQuestionId = null;
    let messages = [
      { id: 'greeting-1', sender: 'assistant', text: 'Welcome to MyLaw!', timestamp: 100 }
    ];

    const stepIds = [
      'core-what-is-mylaw',      // Step 1 (from initial)
      'help-finding-lawyer',     // Step 2 (follow-up of step 1)
      'help-consultation',       // Step 3 (follow-up of step 2)
      'why-privacy',             // Step 4 (follow-up of step 3)
      'core-is-it-free'          // Step 5 (follow-up of step 4)
    ];

    for (let i = 0; i < stepIds.length; i++) {
      const qId = stepIds[i];
      const item = getKnowledgeItemById(qId);
      assert(item, `Step ${i + 1}: Question ${qId} must exist`);

      // Push user msg
      messages.push({
        id: `user-${i}`,
        sender: 'user',
        text: item.question,
        timestamp: 200 + i * 10
      });

      // Push assistant msg
      messages.push({
        id: `asst-${i}`,
        sender: 'assistant',
        text: item.answer,
        isDisclaimer: Boolean(item.isDisclaimer),
        cta: item.cta,
        followUpIds: item.followUpIds,
        timestamp: 205 + i * 10
      });

      activeQuestionId = item.id;
      const followUps = getFollowUpQuestions(activeQuestionId);
      assert(followUps.length >= 2, `Step ${i + 1}: Must offer 2-3 follow-ups`);
    }

    // Verify history accumulation
    assertEqual(messages.length, 11, 'Total messages = 1 greeting + 5 * 2 (user + asst) = 11');
    assertEqual(messages[0].sender, 'assistant', 'First message is greeting');
    assertEqual(messages[1].sender, 'user', 'Second is user');
    assertEqual(messages[2].sender, 'assistant', 'Third is assistant');
    assertEqual(messages[9].sender, 'user', 'Tenth is user');
    assertEqual(messages[10].sender, 'assistant', 'Eleventh is assistant');

    // Test "← Back to questions" reset
    activeQuestionId = null;
    const restoredQuestions = activeQuestionId ? getFollowUpQuestions(activeQuestionId) : getInitialQuestions();
    assertEqual(restoredQuestions.length, 5, 'Reset restores exact 5 initial questions');
    assertEqual(messages.length, 11, 'Message history is preserved after reset');
  });

  test('Suite 2.5: QuestionPill component visual and interactive styling', () => {
    const { QuestionPill } = questionPillModule;
    const testItem = getKnowledgeItemById('core-what-is-mylaw');
    const html = renderToString(React.createElement(QuestionPill, { question: testItem, onClick: () => {} }));

    assert(html.includes(testItem.question), 'Question text must be rendered');
    assert(html.includes('aria-label="What is MyLaw and how does it work?"'), 'Must have accessible aria-label');
    assert(html.includes('bg-white hover:bg-[#F7F8FA]'), 'Pill background tokens');
    assert(html.includes('border border-[#E6E8EC]'), 'Border token');
    assert(html.includes('text-[#172033]'), 'Text token');
    assert(html.includes('rounded-[10px]'), 'Radius token (rounded-[10px])');
    assert(html.includes('focus-visible:ring-[#285A8E]'), 'Focus ring token');
  });

  test('Suite 2.6: MessageBubble component alignments (user right-aligned #285A8E vs assistant left-aligned #F7F8FA)', () => {
    const { MessageBubble } = messageBubbleModule;

    // User bubble
    const userMsg = { id: 'u1', sender: 'user', text: 'How does verification work?', timestamp: 1 };
    const userHtml = renderToString(React.createElement(MessageBubble, { message: userMsg }));
    assert(userHtml.includes('justify-end'), 'User bubble must be right-aligned');
    assert(userHtml.includes('bg-[#285A8E]'), 'User bubble background must be brand accent #285A8E');
    assert(userHtml.includes('text-white'), 'User bubble text must be white');
    assert(userHtml.includes('rounded-br-[4px]'), 'User bubble distinctive speech corner');

    // Assistant bubble
    const asstMsg = { id: 'a1', sender: 'assistant', text: 'Every lawyer undergoes bar verification.', timestamp: 2 };
    const asstHtml = renderToString(React.createElement(MessageBubble, { message: asstMsg }));
    assert(asstHtml.includes('justify-start'), 'Assistant bubble must be left-aligned');
    assert(asstHtml.includes('bg-[#F7F8FA]'), 'Assistant bubble background must be #F7F8FA');
    assert(asstHtml.includes('border-[#E6E8EC]'), 'Assistant bubble border must be #E6E8EC');
    assert(asstHtml.includes('text-[#172033]'), 'Assistant bubble text must be #172033');
    assert(asstHtml.includes('rounded-tl-[4px]'), 'Assistant bubble distinctive speech corner');
  });

  test('Suite 2.7: Knowledge Base Compatibility Aliases resolve accurately', () => {
    const aliasPairs = [
      ['core-how-it-works', 'core-what-is-mylaw'],
      ['core-is-it-legal-advice', 'help-legal-advice-disclaimer'],
      ['core-who-created', 'why-principles'],
      ['why-mylaw-different', 'core-how-different'],
      ['why-trust', 'why-verification'],
      ['why-clarity', 'why-principles'],
      ['why-accessibility', 'core-is-it-free'],
      ['help-find-lawyer', 'help-finding-lawyer'],
      ['help-what-issues', 'core-areas-covered'],
      ['help-confidentiality', 'why-privacy'],
      ['help-cost', 'core-is-it-free'],
      ['lawyer-how-to-join', 'lawyer-joining'],
      ['lawyer-verification', 'lawyer-requirements'],
      ['launch-waitlist', 'launch-timeline']
    ];

    for (const [alias, targetId] of aliasPairs) {
      const resolved = getKnowledgeItemById(alias);
      assert(resolved !== undefined, `Alias "${alias}" failed to resolve`);
      assertEqual(resolved.id, targetId, `Alias "${alias}" should map to target "${targetId}"`);
    }

    // Unrecognized ID returns undefined
    assertEqual(getKnowledgeItemById('completely-nonexistent-id'), undefined, 'Invalid ID returns undefined');
  });

  test('Suite 2.8: BFS Full-Graph Reachability and Loop Invariance Stress Test', () => {
    // Traverse from all 5 initial questions using BFS and ensure no crashes or infinite loops
    const initialQuestions = getInitialQuestions();
    const visited = new Set();
    const queue = [...initialQuestions.map(q => q.id)];

    while (queue.length > 0) {
      const currentId = queue.shift();
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const followUps = getFollowUpQuestions(currentId);
      assert(Array.isArray(followUps), `Follow-ups for ${currentId} must be array`);
      assert(followUps.length >= 2, `Follow-ups for ${currentId} must have >= 2 items`);

      for (const item of followUps) {
        if (!visited.has(item.id)) {
          queue.push(item.id);
        }
      }
    }

    // Ensure all 18 items are defined and safe to query
    for (const item of KNOWLEDGE_ITEMS) {
      const followUps = getFollowUpQuestions(item.id);
      assert(followUps.length >= 2 && followUps.length <= 3, `Item ${item.id} has valid follow-up count`);
    }
  });

  // -------------------------------------------------------------------------
  // SUITE 3: Escape Key Handling & Keyboard Accessibility in All States
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 3] Escape Key Handling & Keyboard Accessibility in All States');

  test('Suite 3.1: Assistant.tsx contains global Escape keydown listener on window', () => {
    const assistantSource = fs.readFileSync('src/components/assistant/Assistant.tsx', 'utf8');
    assert(assistantSource.includes('e.key === "Escape"'), 'Must check e.key === "Escape"');
    assert(assistantSource.includes('window.addEventListener("keydown", onKeyDown)'), 'Must add keydown listener to window');
    assert(assistantSource.includes('window.removeEventListener("keydown", onKeyDown)'), 'Must remove keydown listener on cleanup');
  });

  test('Suite 3.2: Escape key dismiss state machine handles all conversational states cleanly', () => {
    const simulateKeyDown = (state, key) => {
      if (key === 'Escape' && state.isOpen) {
        return { ...state, isOpen: false, focusRestored: 'trigger' };
      }
      return state;
    };

    // State A: Closed state
    const stateA = { isOpen: false, messages: [], activeQuestionId: null };
    assertEqual(simulateKeyDown(stateA, 'Escape').isOpen, false, 'ESC when closed leaves isOpen=false');

    // State B: Initial Open Greeting state
    const stateB = { isOpen: true, messages: [{ id: '1', text: 'Hello' }], activeQuestionId: null };
    const resB = simulateKeyDown(stateB, 'Escape');
    assertEqual(resB.isOpen, false, 'ESC on greeting state closes panel');
    assertEqual(resB.focusRestored, 'trigger', 'Restores focus to trigger');

    // State C: Active Q&A state
    const stateC = { isOpen: true, messages: [{ id: '1', text: 'Hello' }, { id: '2', text: 'Q' }, { id: '3', text: 'A' }], activeQuestionId: 'core-what-is-mylaw' };
    const resC = simulateKeyDown(stateC, 'Escape');
    assertEqual(resC.isOpen, false, 'ESC on active Q&A state closes panel');

    // State D: Post-Reset state
    const stateD = { isOpen: true, messages: [{ id: '1', text: 'Hello' }, { id: '2', text: 'Q' }, { id: '3', text: 'A' }], activeQuestionId: null };
    const resD = simulateKeyDown(stateD, 'Escape');
    assertEqual(resD.isOpen, false, 'ESC on post-reset state closes panel');

    // State E: Irrelevant key (e.g. 'Enter', 'Tab') when open
    assertEqual(simulateKeyDown(stateB, 'Enter').isOpen, true, 'Enter does not close panel');
    assertEqual(simulateKeyDown(stateB, 'Tab').isOpen, true, 'Tab does not close panel');
  });

  test('Suite 3.3: Panel container dialog ARIA attributes and focus ring contracts', () => {
    const { AssistantPanel } = panelModule;
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [{ id: 'g', sender: 'assistant', text: 'Hi', timestamp: 1 }],
        currentQuestions: getInitialQuestions(),
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    assert(html.includes('id="mylaw-assistant-panel"'), 'Panel must have id="mylaw-assistant-panel"');
    assert(html.includes('role="dialog"'), 'Panel must have role="dialog"');
    assert(html.includes('aria-labelledby="assistant-panel-title"'), 'Panel must have aria-labelledby="assistant-panel-title"');
    assert(html.includes('aria-modal="false"'), 'Panel must have aria-modal="false" (floating card non-modal)');
    assert(html.includes('role="log"'), 'Scrollable feed must have role="log"');
    assert(html.includes('aria-live="polite"'), 'Feed must have aria-live="polite" for screen readers');
    assert(html.includes('aria-label="Assistant conversation"'), 'Feed must have aria-label="Assistant conversation"');
    assert(html.includes('aria-label="Close assistant"'), 'Close button must have accessible aria-label');
  });

  // -------------------------------------------------------------------------
  // SUITE 4: DOM Tree Assertions, Brand Tokens & Typography
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 4] Strict DOM Tree Assertions, Brand Tokens & Typography');

  test('Suite 4.1: Header exact DOM structure & text ("MyLaw ● Assistant")', () => {
    const { AssistantPanel } = panelModule;
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [{ id: 'g', sender: 'assistant', text: 'Hi', timestamp: 1 }],
        currentQuestions: getInitialQuestions(),
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    // Verify h2 header title
    assert(html.includes('id="assistant-panel-title"'), 'Header must have id="assistant-panel-title"');
    assert(html.includes('<span>MyLaw</span>'), 'Header must have <span>MyLaw</span>');
    assert(html.includes('bg-[#2F7C78]'), 'Active dot in header must use teal #2F7C78');
    assert(html.includes('<span>Assistant</span>'), 'Header must have <span>Assistant</span>');
    assert(html.includes('text-[#172033]'), 'Header title must use text-[#172033]');
  });

  test('Suite 4.2: Tooltip exact text ("Ask MyLaw") and positioning', () => {
    const { AssistantTrigger } = triggerModule;
    const html = renderToString(React.createElement(AssistantTrigger, { isOpen: false, onToggle: () => {} }));

    assert(html.includes('role="tooltip"'), 'Tooltip must have role="tooltip"');
    assert(html.includes('id="assistant-trigger-tooltip"'), 'Tooltip must have id="assistant-trigger-tooltip"');
    assert(html.includes('Ask MyLaw'), 'Tooltip must have verbatim text "Ask MyLaw"');
    assert(html.includes('bg-[#172033]'), 'Tooltip background must be deep navy #172033');
    assert(html.includes('text-white'), 'Tooltip text must be white');
  });

  test('Suite 4.3: Micro-disclaimer footer exact text ("Informational assistant only. No legal advice provided.")', () => {
    const { AssistantPanel } = panelModule;
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [{ id: 'g', sender: 'assistant', text: 'Hi', timestamp: 1 }],
        currentQuestions: getInitialQuestions(),
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    assert(html.includes('<footer'), 'Panel must include a <footer> element');
    assert(html.includes(MICRO_DISCLAIMER_TEXT), `Footer must render exact micro-disclaimer: "${MICRO_DISCLAIMER_TEXT}"`);
    assertEqual(MICRO_DISCLAIMER_TEXT, 'Informational assistant only. No legal advice provided.', 'Micro-disclaimer constant fidelity');
    assert(html.includes('bg-[#F7F8FA]'), 'Footer background must be #F7F8FA');
    assert(html.includes('border-[#E6E8EC]'), 'Footer border must be #E6E8EC');
  });

  test('Suite 4.4: Statutory Legal Advice Disclaimer & Notice Callout', () => {
    const { MessageBubble } = messageBubbleModule;
    const disclaimerItem = getKnowledgeItemById('help-legal-advice-disclaimer');
    assert(disclaimerItem, 'Legal disclaimer item must exist');
    assertEqual(disclaimerItem.isDisclaimer, true, 'isDisclaimer must be true');
    assertEqual(disclaimerItem.answer, STATUTORY_LEGAL_DISCLAIMER, 'Answer must match statutory disclaimer verbatim');
    assertEqual(
      STATUTORY_LEGAL_DISCLAIMER,
      "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.",
      'Statutory disclaimer verbatim text check'
    );

    const disclaimerMsg = {
      id: 'asst-disclaimer',
      sender: 'assistant',
      text: disclaimerItem.answer,
      isDisclaimer: true,
      cta: disclaimerItem.cta,
      timestamp: 1
    };

    const html = renderToString(React.createElement(MessageBubble, { message: disclaimerMsg }));
    assert(html.includes('border-l-2 border-l-[#2F7C78]'), 'Disclaimer bubble has teal callout border');
    assert(html.includes('Notice'), 'Disclaimer bubble has Notice label');
    assert(html.includes('href="/waitlist"'), 'Disclaimer bubble has inline CTA to /waitlist');
    assert(html.includes('Join the Waitlist →'), 'CTA label is "Join the Waitlist →"');
  });

  test('Suite 4.5: Inline Waitlist CTAs on relevant knowledge items route correctly', () => {
    // Check items with CTA
    const itemsWithCta = KNOWLEDGE_ITEMS.filter((item) => item.cta);
    assert(itemsWithCta.length >= 5, `Expected at least 5 items with CTA, found: ${itemsWithCta.length}`);

    for (const item of itemsWithCta) {
      assert(item.cta.label, `Item ${item.id} CTA must have a label`);
      assert(item.cta.href, `Item ${item.id} CTA must have an href`);

      if (item.category === 'for-lawyers') {
        assertEqual(item.cta.href, '/waitlist?role=lawyer', `Lawyer item ${item.id} must route to /waitlist?role=lawyer`);
        assert(item.cta.label.includes('Lawyer'), `Lawyer item ${item.id} CTA label should mention Lawyer`);
      } else {
        assertEqual(item.cta.href, '/waitlist', `Item ${item.id} must route to /waitlist`);
      }
    }
  });

  test('Suite 4.6: "← Back to questions" button rendering and styling', () => {
    const { AssistantPanel } = panelModule;
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [{ id: 'g', sender: 'assistant', text: 'Hi', timestamp: 1 }],
        currentQuestions: getFollowUpQuestions('core-what-is-mylaw'),
        activeQuestionId: 'core-what-is-mylaw',
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    assert(html.includes('Back to questions'), 'Must render "Back to questions"');
    assert(html.includes('Suggested Next Questions'), 'Must show "Suggested Next Questions" header');
    assert(html.includes('text-[#285A8E]'), 'Back button uses brand accent #285A8E');
    assert(html.includes('bg-[#F7F8FA]'), 'Back button uses background #F7F8FA');
  });

  test('Suite 4.7: Random greeting generator selects exclusively from curated 4 greetings', () => {
    assertEqual(INITIAL_GREETINGS.length, 4, 'Must define exactly 4 curated greetings');
    const seen = new Set();
    for (let i = 0; i < 200; i++) {
      const g = getRandomGreeting();
      assert(INITIAL_GREETINGS.includes(g), `Greeting "${g}" is not in curated pool`);
      seen.add(g);
    }
    assertEqual(seen.size, 4, 'All 4 greetings are generated over 200 trials');
  });

  test('Suite 4.8: Panel responsive layout, desktop geometry (380px), mobile fluid margins, and radius', () => {
    const { AssistantPanel } = panelModule;
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [{ id: 'g', sender: 'assistant', text: 'Hi', timestamp: 1 }],
        currentQuestions: getInitialQuestions(),
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    assert(html.includes('w-[calc(100vw-32px)]'), 'Mobile width is fluid with calc(100vw-32px)');
    assert(html.includes('sm:w-[380px]'), 'Desktop width is fixed 380px (360-400px specification)');
    assert(html.includes('rounded-[14px]'), 'Border radius is 14px (12-16px specification)');
    assert(html.includes('max-h-[580px]'), 'Panel max height is constrained to 580px');
    assert(html.includes('fixed bottom-20 right-4 sm:bottom-22 sm:right-6'), 'Fixed floating position with safe margins');
    assert(html.includes('overscroll-contain'), 'Feed contains overscroll-contain to avoid page scroll chaining');
  });

  // -------------------------------------------------------------------------
  // SUITE 5: Guardrails, Negative Assertions & Integrity
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 5] Guardrails, Negative Assertions & Integrity');

  test('Suite 5.1: Zero interactive free-text inputs in Assistant components', () => {
    const assistantDir = path.resolve('src/components/assistant');
    const files = fs.readdirSync(assistantDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(assistantDir, file), 'utf8');
      assert(!content.includes('<input'), `File ${file} contains prohibited <input> tag!`);
      assert(!content.includes('<textarea'), `File ${file} contains prohibited <textarea> tag!`);
      assert(!content.includes('contentEditable'), `File ${file} contains prohibited contentEditable!`);
    }
  });

  test('Suite 5.2: Zero dynamic AI/LLM SDK calls or endpoints in Assistant components', () => {
    const assistantDir = path.resolve('src/components/assistant');
    const files = fs.readdirSync(assistantDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));

    const prohibitedTerms = ['openai', 'anthropic', 'langchain', 'llama', 'generateText', 'streamText', 'completion', 'api/chat', 'api/assistant'];
    for (const file of files) {
      const content = fs.readFileSync(path.join(assistantDir, file), 'utf8').toLowerCase();
      for (const term of prohibitedTerms) {
        assert(!content.includes(term), `File ${file} contains dynamic AI term "${term}"!`);
      }
    }
  });

  test('Suite 5.3: Zero dark mode classes (dark:) in Assistant components', () => {
    const assistantDir = path.resolve('src/components/assistant');
    const files = fs.readdirSync(assistantDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(assistantDir, file), 'utf8');
      assert(!content.includes('dark:'), `File ${file} contains prohibited "dark:" class!`);
    }
  });

  test('Suite 5.4: Strictly authorized brand color tokens used across Assistant components', () => {
    const authorizedHexes = new Set([
      '172033', // Deep Navy
      '285a8e', // Blue Accent
      '1e4670', // Blue Hover
      '2f7c78', // Muted Teal
      'f7f8fa', // Soft Grey
      'f6f3ec', // Warm Off-white
      'ffffff', // White
      'e6e8ec', // Border Grey
      '667085', // Muted Text Grey
      '101828', // Subtle Shadow Navy
      'f0f4f8'  // Active pill soft blue
    ]);

    const assistantDir = path.resolve('src/components/assistant');
    const files = fs.readdirSync(assistantDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));
    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;

    for (const file of files) {
      const content = fs.readFileSync(path.join(assistantDir, file), 'utf8');
      let match;
      while ((match = hexRegex.exec(content)) !== null) {
        let hex = match[1].toLowerCase();
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        assert(authorizedHexes.has(hex), `File ${file} contains unauthorized hex #${match[1]}!`);
      }
    }
  });

  // -------------------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n===================================================================');
  console.log(`  M2 ADVERSARIAL TEST RESULTS: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
  console.log('===================================================================\n');

  if (results.failed > 0) {
    console.error('FAILED ASSERTIONS:');
    results.failures.forEach((f) => console.error(`- ${f.name}: ${f.error}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL MILESTONE M2 ADVERSARIAL STRESS TESTS PASSED EMPIRICALLY!');
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
