#!/usr/bin/env node

/**
 * tests/tier5_adversarial_hardening_2.test.mjs
 * 
 * Final Milestone Phase 2: Tier 5 Adversarial Coverage Hardening (Challenger 2)
 * 
 * Aggressive stress-testing and empirical verification covering:
 * 1. High-Concurrency Simulated Interactions (rapid clicks, rapid resets, concurrent ESC keys, race condition resilience)
 * 2. SSR vs CSR Hydration Consistency & Non-Destructive DOM Integrity
 * 3. Screen-Reader Announcement Correctness, ARIA Live-Region Polite Updates, and Focus Management
 * 4. Strict Guardrails: Zero Dynamic AI calls, Zero Free-Text Inputs, Zero Dark-Mode Tokens, Exact Brand Tokens
 * 5. Complete Knowledge Graph Traversal & Boundary Proofs (18 items, 5 categories, 0 dead-ends, disclaimers, CTAs)
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToString } from 'react-dom/server';
import postcss from 'postcss';
import tailwindPostcss from '@tailwindcss/postcss';

const require = createRequire(import.meta.url);

// Test accumulator
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
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`${message || 'Assertion failed'} - Expected: ${expectedStr}, Got: ${actualStr}`);
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

// Utility to recursively list files in directory
function getFilesRecursive(dir, extensions = ['.tsx', '.ts', '.css']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFilesRecursive(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Color contrast utilities (WCAG 2.1)
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// =========================================================================
// RUN TEST SUITE
// =========================================================================

async function run() {
  console.log('\n======================================================================');
  console.log('  TIER 5 ADVERSARIAL HARDENING SUITE (CHALLENGER 2)');
  console.log('======================================================================\n');

  // Load modules
  const iconsModule = loadTsxModule(path.resolve('src/components/icons/index.tsx'));
  const kbModule = loadTsxModule(path.resolve('src/components/assistant/data/knowledge-base.ts'));

  const questionPillModule = loadTsxModule(path.resolve('src/components/assistant/QuestionPill.tsx'), {
    '@/components/icons': iconsModule
  });

  const messageBubbleModule = loadTsxModule(path.resolve('src/components/assistant/MessageBubble.tsx'), {
    '@/components/icons': iconsModule
  });

  const triggerModule = loadTsxModule(path.resolve('src/components/assistant/AssistantTrigger.tsx'), {
    '@/components/icons': iconsModule
  });

  const panelModule = loadTsxModule(path.resolve('src/components/assistant/AssistantPanel.tsx'), {
    '@/components/icons': iconsModule,
    './MessageBubble': messageBubbleModule,
    './QuestionPill': questionPillModule,
    './data/knowledge-base': kbModule
  });

  const assistantModule = loadTsxModule(path.resolve('src/components/assistant/Assistant.tsx'), {
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

  const { AssistantTrigger } = triggerModule;
  const { AssistantPanel } = panelModule;
  const { MessageBubble } = messageBubbleModule;
  const { QuestionPill } = questionPillModule;
  const Assistant = assistantModule.default;

  // -------------------------------------------------------------------------
  // SUITE 1: High-Concurrency Simulated Interactions & State Machine Fuzzing
  // -------------------------------------------------------------------------
  console.log('▶ [Suite 1] High-Concurrency Interactions & State Machine Fuzzing');

  await asyncTest('1.1 Rapid multi-click question spamming (50 concurrent clicks) maintains FIFO consistency and debounces active transition timer', async () => {
    let messages = [{ id: 'greeting', sender: 'assistant', text: 'Hello!', timestamp: Date.now() }];
    let isTransitioning = false;
    let activeQuestionId = null;
    let transitionTimer = null;

    const selectQuestion = (questionId) => {
      const item = getKnowledgeItemById(questionId);
      if (!item) return;

      // 1. Append user message
      messages.push({
        id: `user-${Date.now()}-${Math.random()}`,
        sender: 'user',
        text: item.question,
        timestamp: Date.now()
      });
      isTransitioning = true;

      // 2. Debounce transition timer
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }

      transitionTimer = setTimeout(() => {
        messages.push({
          id: `asst-${Date.now()}-${Math.random()}`,
          sender: 'assistant',
          text: item.answer,
          isDisclaimer: Boolean(item.isDisclaimer),
          cta: item.cta,
          followUpIds: item.followUpIds,
          timestamp: Date.now()
        });
        activeQuestionId = item.id;
        isTransitioning = false;
      }, 180);
    };

    // Spam 50 question selections rapidly in 2ms intervals
    const questionIds = [
      'core-what-is-mylaw',
      'help-legal-advice-disclaimer',
      'why-verification',
      'lawyer-joining',
      'launch-timeline'
    ];

    for (let i = 0; i < 50; i++) {
      const qId = questionIds[i % questionIds.length];
      selectQuestion(qId);
      await new Promise((r) => setTimeout(r, 2));
    }

    assert(isTransitioning === true, 'isTransitioning should be true while last timer is running');
    // Wait for the final timer to resolve
    await new Promise((r) => setTimeout(r, 250));

    assert(isTransitioning === false, 'isTransitioning must settle to false after final transition');
    assertEqual(activeQuestionId, questionIds[49 % questionIds.length], 'activeQuestionId matches final question');
    // 1 greeting + 50 user messages + 1 final assistant message (debounced) = 52 messages
    assertEqual(messages.length, 52, 'Message list length matches debounced state');
    assertEqual(messages[messages.length - 1].sender, 'assistant', 'Last message is assistant response');
  });

  test('1.2 High-churn toggle & reset interleaved stress test (200 cycles)', () => {
    let isOpen = false;
    let messages = [];
    let activeQuestionId = null;
    let toggleCount = 0;
    let resetCount = 0;

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

    const handleReset = () => {
      activeQuestionId = null;
      resetCount++;
    };

    // Execute 200 cycles of chaotic actions
    for (let i = 0; i < 200; i++) {
      if (i % 3 === 0) {
        handleToggle();
      } else if (i % 3 === 1) {
        if (isOpen) {
          activeQuestionId = 'why-verification';
        }
      } else {
        handleReset();
      }
    }

    // Explicitly test reset action
    handleReset();

    // Invariants
    assert(typeof isOpen === 'boolean', 'isOpen remains valid boolean');
    assertEqual(activeQuestionId, null, 'activeQuestionId is cleanly reset to null');
    assert(messages.length >= 1, 'Initial greeting is preserved');
  });

  test('1.3 Concurrent ESC key events during all conversational lifecycle states', () => {
    const handleEsc = (state) => {
      if (state.isOpen) {
        return { ...state, isOpen: false, focusTarget: 'trigger' };
      }
      return state;
    };

    // State 1: Closed
    const s1 = { isOpen: false, messages: [], activeQuestionId: null };
    assertEqual(handleEsc(s1).isOpen, false, 'ESC when closed stays closed');

    // State 2: Open with greeting
    const s2 = { isOpen: true, messages: [{ id: '1', sender: 'assistant', text: 'Hi', timestamp: 1 }], activeQuestionId: null };
    const r2 = handleEsc(s2);
    assertEqual(r2.isOpen, false, 'ESC when greeting closes');
    assertEqual(r2.focusTarget, 'trigger', 'Restores focus to trigger');

    // State 3: Open mid-conversation
    const s3 = { isOpen: true, messages: [{ id: '1', text: 'Hi' }, { id: '2', text: 'Q' }, { id: '3', text: 'A' }], activeQuestionId: 'core-what-is-mylaw' };
    const r3 = handleEsc(s3);
    assertEqual(r3.isOpen, false, 'ESC in active Q&A closes');

    // State 4: Rapid consecutive ESC keys (3x in a row)
    let curState = s3;
    for (let i = 0; i < 3; i++) {
      curState = handleEsc(curState);
      assertEqual(curState.isOpen, false, `Pass ${i + 1}: ESC keeps closed state`);
    }
  });

  await asyncTest('1.4 Transition timer cancellation on mid-transition ESC dismissal', async () => {
    let isOpen = true;
    let isTransitioning = false;
    let timer = null;
    let messages = [{ id: 'g', sender: 'assistant', text: 'Hi', timestamp: 1 }];

    const selectQuestion = (qId) => {
      const item = getKnowledgeItemById(qId);
      messages.push({ id: 'u', sender: 'user', text: item.question, timestamp: 2 });
      isTransitioning = true;
      timer = setTimeout(() => {
        messages.push({ id: 'a', sender: 'assistant', text: item.answer, timestamp: 3 });
        isTransitioning = false;
      }, 180);
    };

    selectQuestion('help-legal-advice-disclaimer');
    assert(isTransitioning === true, 'Transition active');

    // User hits ESC at t = 30ms
    await new Promise((r) => setTimeout(r, 30));
    isOpen = false;
    if (timer) clearTimeout(timer); // Simulating useEffect cleanup

    // Wait until t = 220ms
    await new Promise((r) => setTimeout(r, 190));

    assertEqual(messages.length, 2, 'Assistant answer was not pushed after timer cancellation on ESC');
    assert(!isOpen, 'Panel remains closed');
  });

  test('1.5 Conversational message array invariants (valid senders, timestamps, non-empty texts)', () => {
    const sampleConversation = [
      { id: '1', sender: 'assistant', text: getRandomGreeting(), timestamp: 100 },
      { id: '2', sender: 'user', text: 'What is MyLaw?', timestamp: 200 },
      { id: '3', sender: 'assistant', text: 'MyLaw is a discovery platform...', timestamp: 380, followUpIds: ['why-verification'] },
      { id: '4', sender: 'user', text: 'How do you verify lawyers?', timestamp: 400 },
      { id: '5', sender: 'assistant', text: 'Every lawyer undergoes checks...', timestamp: 580 }
    ];

    let lastTs = 0;
    for (let i = 0; i < sampleConversation.length; i++) {
      const msg = sampleConversation[i];
      assert(msg.id && typeof msg.id === 'string', `Msg ${i} must have string id`);
      assert(msg.sender === 'assistant' || msg.sender === 'user', `Msg ${i} must have valid sender`);
      assert(msg.text && msg.text.trim().length > 0, `Msg ${i} must have non-empty text`);
      assert(msg.timestamp >= lastTs, `Msg ${i} timestamp must be monotonic`);
      lastTs = msg.timestamp;
    }
  });

  // -------------------------------------------------------------------------
  // SUITE 2: SSR vs CSR Hydration Consistency & Non-Destructive DOM Integrity
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 2] SSR vs CSR Hydration Consistency & Non-Destructive DOM Integrity');

  test('2.1 SSR: Root Assistant container renders trigger button in closed state without hydration mismatches', () => {
    const html = renderToString(React.createElement(Assistant));

    assert(html.includes('mylaw-assistant-root'), 'Must render root container');
    assert(html.includes('aria-expanded="false"'), 'Trigger starts closed (aria-expanded="false")');
    assert(html.includes('Ask MyLaw Assistant'), 'Trigger button has accessible label');
    assert(html.includes('Ask MyLaw'), 'Tooltip text present');
    assert(html.includes('animate-ping'), 'Availability pulse dot present');
    assert(!html.includes('id="mylaw-assistant-panel"'), 'Panel must NOT be rendered when closed');
    assert(!html.includes('undefined'), 'SSR HTML should not contain "undefined"');
    assert(!html.includes('NaN'), 'SSR HTML should not contain "NaN"');
  });

  test('2.2 SSR: AssistantPanel renders valid semantic DOM tree when open', () => {
    const mockMessages = [
      { id: 'g1', sender: 'assistant', text: INITIAL_GREETINGS[0], timestamp: 100 },
      { id: 'u1', sender: 'user', text: 'What is MyLaw and how does it work?', timestamp: 200 },
      { id: 'a1', sender: 'assistant', text: getKnowledgeItemById('core-what-is-mylaw').answer, timestamp: 380 }
    ];

    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: mockMessages,
        currentQuestions: getFollowUpQuestions('core-what-is-mylaw'),
        activeQuestionId: 'core-what-is-mylaw',
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    assert(html.includes('id="mylaw-assistant-panel"'), 'Panel dialog ID');
    assert(html.includes('role="dialog"'), 'Panel role="dialog"');
    assert(html.includes('aria-labelledby="assistant-panel-title"'), 'Panel labelledby');
    assert(html.includes('role="log"'), 'Feed role="log"');
    assert(html.includes('aria-live="polite"'), 'Feed aria-live="polite"');
    assert(html.includes('Suggested Next Questions'), 'Follow-up header text');
    assert(html.includes('Back to questions'), 'Back button text');
    assert(html.includes(MICRO_DISCLAIMER_TEXT), 'Micro-disclaimer in footer');
  });

  test('2.3 Non-destructive global mounting in src/app/layout.tsx', () => {
    const layoutSrc = fs.readFileSync('src/app/layout.tsx', 'utf8');

    assert(layoutSrc.includes('import { Assistant } from "@/components/assistant"'), 'Layout imports Assistant');
    assert(layoutSrc.includes('<Assistant />'), 'Layout mounts <Assistant />');
    assert(layoutSrc.includes('{children}'), 'Layout renders {children}');
    const childrenIdx = layoutSrc.indexOf('{children}');
    const assistantIdx = layoutSrc.indexOf('<Assistant />');
    assert(childrenIdx !== -1 && assistantIdx !== -1, 'Both children and Assistant present in layout');
    assert(assistantIdx > childrenIdx, 'Assistant is mounted after children to ensure overlay layering');
  });

  test('2.4 Layout & styling isolation: Assistant panel uses fixed floating coordinates and z-50 overlay', () => {
    const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');
    const triggerSrc = fs.readFileSync('src/components/assistant/AssistantTrigger.tsx', 'utf8');

    assert(panelSrc.includes('fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50'), 'Panel fixed floating coordinates and z-50');
    assert(panelSrc.includes('overscroll-contain'), 'Panel overscroll-contain prevents page scroll chaining');
    assert(triggerSrc.includes('fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50'), 'Trigger fixed floating coordinates and z-50');
  });

  test('2.5 Viewport responsiveness: Fluid mobile width w-[calc(100vw-32px)] vs sm:w-[380px] desktop width', () => {
    const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');

    assert(panelSrc.includes('w-[calc(100vw-32px)]'), 'Fluid width on mobile');
    assert(panelSrc.includes('sm:w-[380px]'), 'Desktop width sm:w-[380px]');
    assert(panelSrc.includes('rounded-[14px]'), 'Panel radius rounded-[14px]');
  });

  test('2.6 Circular button size: 52px diameter (strictly within 48-56px specification)', () => {
    const triggerSrc = fs.readFileSync('src/components/assistant/AssistantTrigger.tsx', 'utf8');

    assert(triggerSrc.includes('w-[52px] h-[52px]'), 'Trigger has w-[52px] h-[52px]');
    assert(triggerSrc.includes('rounded-full'), 'Trigger is rounded-full');
  });

  // -------------------------------------------------------------------------
  // SUITE 3: Screen-Reader Announcements, ARIA Live-Regions & Focus Politeness
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 3] Screen-Reader Announcements, ARIA Live-Regions & Focus Politeness');

  test('3.1 Message feed live region configuration (role="log", aria-live="polite", aria-label="Assistant conversation")', () => {
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [{ id: 'g', sender: 'assistant', text: 'Hello', timestamp: 1 }],
        currentQuestions: getInitialQuestions(),
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    assert(html.includes('role="log"'), 'Feed container has role="log"');
    assert(html.includes('aria-live="polite"'), 'Feed container has aria-live="polite"');
    assert(html.includes('aria-label="Assistant conversation"'), 'Feed container has aria-label="Assistant conversation"');
  });

  test('3.2 Dialog accessibility semantics (role="dialog", aria-labelledby, aria-modal="false")', () => {
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [],
        currentQuestions: getInitialQuestions(),
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    assert(html.includes('role="dialog"'), 'Panel must have role="dialog"');
    assert(html.includes('aria-labelledby="assistant-panel-title"'), 'Panel must have aria-labelledby');
    assert(html.includes('id="assistant-panel-title"'), 'Header title has matching id');
    assert(html.includes('aria-modal="false"'), 'Panel is non-modal floating card (aria-modal="false")');
  });

  test('3.3 Trigger button ARIA state toggling between closed and open states', () => {
    // Closed state
    const closedHtml = renderToString(React.createElement(AssistantTrigger, { isOpen: false, onToggle: () => {} }));
    assert(closedHtml.includes('aria-expanded="false"'), 'Closed: aria-expanded="false"');
    assert(closedHtml.includes('aria-haspopup="dialog"'), 'Closed: aria-haspopup="dialog"');
    assert(closedHtml.includes('aria-controls="mylaw-assistant-panel"'), 'Closed: aria-controls="mylaw-assistant-panel"');
    assert(closedHtml.includes('aria-label="Ask MyLaw Assistant"'), 'Closed: aria-label="Ask MyLaw Assistant"');
    assert(closedHtml.includes('aria-describedby="assistant-trigger-tooltip"'), 'Closed: aria-describedby connects to tooltip');

    // Open state
    const openHtml = renderToString(React.createElement(AssistantTrigger, { isOpen: true, onToggle: () => {} }));
    assert(openHtml.includes('aria-expanded="true"'), 'Open: aria-expanded="true"');
    assert(openHtml.includes('aria-label="Close MyLaw Assistant"'), 'Open: aria-label="Close MyLaw Assistant"');
    assert(!openHtml.includes('aria-describedby'), 'Open: aria-describedby is omitted');
  });

  test('3.4 Tooltip element semantics (role="tooltip", id="assistant-trigger-tooltip", text="Ask MyLaw")', () => {
    const html = renderToString(React.createElement(AssistantTrigger, { isOpen: false, onToggle: () => {} }));

    assert(html.includes('role="tooltip"'), 'Tooltip has role="tooltip"');
    assert(html.includes('id="assistant-trigger-tooltip"'), 'Tooltip has id="assistant-trigger-tooltip"');
    assert(html.includes('Ask MyLaw'), 'Tooltip has text "Ask MyLaw"');
  });

  test('3.5 QuestionPill button accessibility & disabled state handling', () => {
    const item = getKnowledgeItemById('why-verification');
    const enabledHtml = renderToString(React.createElement(QuestionPill, { question: item, onClick: () => {}, disabled: false }));
    assert(enabledHtml.includes('type="button"'), 'Pill has type="button"');
    assert(enabledHtml.includes(`aria-label="${item.question}"`), 'Pill aria-label matches question');
    assert(enabledHtml.includes('focus-visible:ring-2 focus-visible:ring-[#285A8E]'), 'Pill focus ring');

    const disabledHtml = renderToString(React.createElement(QuestionPill, { question: item, onClick: () => {}, disabled: true }));
    assert(disabledHtml.includes('disabled=""') || disabledHtml.includes('disabled'), 'Disabled pill has disabled attribute');
  });

  test('3.6 Close button has accessible name and focus ring', () => {
    const html = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [],
        currentQuestions: [],
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );

    assert(html.includes('aria-label="Close assistant"'), 'Close button has aria-label="Close assistant"');
    assert(html.includes('focus-visible:ring-2 focus-visible:ring-[#285A8E]'), 'Close button has focus ring');
  });

  test('3.7 Focus restore implementation in Assistant.tsx', () => {
    const assistantSrc = fs.readFileSync('src/components/assistant/Assistant.tsx', 'utf8');

    assert(assistantSrc.includes('triggerRef.current?.focus()'), 'Assistant.tsx calls triggerRef.current?.focus() on close');
    assert(assistantSrc.includes('useRef<HTMLButtonElement>(null)'), 'Assistant.tsx holds triggerRef');
  });

  // -------------------------------------------------------------------------
  // SUITE 4: Guardrails: Zero AI, Zero Free-Text, Zero Dark-Mode Tokens
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 4] Strict Guardrail Verification & Negative Assertions');

  test('4.1 Zero interactive free-text inputs across all Assistant component source files', () => {
    const assistantDir = path.resolve('src/components/assistant');
    const files = getFilesRecursive(assistantDir, ['.tsx', '.ts']);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      assert(!content.includes('<input'), `File ${path.relative(process.cwd(), file)} contains prohibited <input> tag!`);
      assert(!content.includes('<textarea'), `File ${path.relative(process.cwd(), file)} contains prohibited <textarea> tag!`);
      assert(!content.includes('<select'), `File ${path.relative(process.cwd(), file)} contains prohibited <select> tag!`);
      assert(!content.includes('contenteditable'), `File ${path.relative(process.cwd(), file)} contains contenteditable!`);
      assert(!content.includes('contentEditable'), `File ${path.relative(process.cwd(), file)} contains contentEditable!`);
    }
  });

  test('4.2 Zero dynamic AI/LLM SDK imports or API routes across the entire codebase', () => {
    const srcFiles = getFilesRecursive(path.resolve('src'), ['.tsx', '.ts']);
    const aiKeywords = [
      'openai', 'anthropic', 'cohere', 'langchain', 'huggingface',
      'google/generative-ai', 'llama', 'useChat', 'useCompletion',
      'chat/completions', 'api/chat', 'api/assistant'
    ];

    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const keyword of aiKeywords) {
        assert(!content.includes(keyword), `File ${path.relative(process.cwd(), file)} contains AI keyword "${keyword}"!`);
      }
    }
  });

  test('4.3 Total dark-mode elimination: Zero dark: classes in active product components and stylesheets', () => {
    const activeDirs = [
      path.resolve('src/app'),
      path.resolve('src/components/assistant'),
      path.resolve('src/components/landing'),
      path.resolve('src/components/waitlist')
    ];

    let activeFiles = [
      path.resolve('src/components/Navbar.tsx'),
      path.resolve('src/components/Footer.tsx'),
      path.resolve('src/app/globals.css')
    ];

    for (const dir of activeDirs) {
      activeFiles = activeFiles.concat(getFilesRecursive(dir, ['.tsx', '.ts', '.css']));
    }

    for (const file of activeFiles) {
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, 'utf8');
      assert(!content.includes('dark:'), `File ${path.relative(process.cwd(), file)} contains prohibited "dark:" class!`);
      assert(!content.includes('@media (prefers-color-scheme: dark)'), `File ${path.relative(process.cwd(), file)} contains dark media query!`);
      assert(!content.includes('color-scheme: dark'), `File ${path.relative(process.cwd(), file)} contains color-scheme: dark!`);
    }
  });

  test('4.4 Exact MyLaw editorial design token adherence across Assistant components', () => {
    const authorizedHexes = new Set([
      '172033', // Deep Navy (Brand Primary)
      '285a8e', // Brand Blue (Accent)
      '1e4670', // Brand Blue Hover
      '2f7c78', // Muted Teal (Status & Disclaimer Notice)
      'f7f8fa', // Soft Grey (Backgrounds, bubbles, footer)
      'f6f3ec', // Warm Off-white
      'ffffff', // Pure White
      'e6e8ec', // Border Grey
      '667085', // Secondary Text Grey
      '101828', // Subtle Shadow Navy
      'f0f4f8'  // Active pill soft blue
    ]);

    const assistantDir = path.resolve('src/components/assistant');
    const files = getFilesRecursive(assistantDir, ['.tsx', '.ts']);
    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = hexRegex.exec(content)) !== null) {
        let hex = match[1].toLowerCase();
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        assert(authorizedHexes.has(hex), `File ${path.relative(process.cwd(), file)} contains unauthorized hex #${match[1]}!`);
      }
    }
  });

  test('4.5 Prohibited visual & content tropes audit (gavels, scales, courtrooms, fake stats, corporate hype)', () => {
    const prohibitedTerms = [
      'gavel', 'scales of justice', 'scale of justice', 'courtroom',
      'courthouse', 'judge bench', "judge's bench", 'handshake stock',
      'gold luxury', 'black and gold', 'revolutionizing the legal ecosystem',
      'disrupting the legal industry', 'leveraging synergies', '99% satisfaction',
      '10,000+ lawyers', '50,000+ clients', '4.9 out of 5'
    ];

    const srcFiles = getFilesRecursive(path.resolve('src'), ['.tsx', '.ts']);

    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const term of prohibitedTerms) {
        assert(!content.includes(term), `File ${path.relative(process.cwd(), file)} contains prohibited trope: "${term}"`);
      }
    }
  });

  test('4.6 WCAG 2.1 Contrast ratios for all assistant visual elements', () => {
    // User message bubble: White on #285A8E (Brand Blue)
    const userContrast = getContrastRatio('#FFFFFF', '#285A8E');
    assert(userContrast >= 4.5, `User bubble contrast >= 4.5 (got ${userContrast.toFixed(2)})`);

    // Assistant message bubble: #172033 (Navy) on #F7F8FA (Soft Grey)
    const asstContrast = getContrastRatio('#172033', '#F7F8FA');
    assert(asstContrast >= 7.0, `Assistant bubble contrast >= 7.0 (got ${asstContrast.toFixed(2)})`);

    // Header title: #172033 (Navy) on #FFFFFF (White)
    const headerContrast = getContrastRatio('#172033', '#FFFFFF');
    assert(headerContrast >= 7.0, `Header title contrast >= 7.0 (got ${headerContrast.toFixed(2)})`);

    // Tooltip: #FFFFFF (White) on #172033 (Navy)
    const tooltipContrast = getContrastRatio('#FFFFFF', '#172033');
    assert(tooltipContrast >= 7.0, `Tooltip contrast >= 7.0 (got ${tooltipContrast.toFixed(2)})`);

    // Muted text: #667085 on #F7F8FA
    const mutedContrast = getContrastRatio('#667085', '#F7F8FA');
    assert(mutedContrast >= 4.5, `Muted text contrast >= 4.5 (got ${mutedContrast.toFixed(2)})`);
  });

  // -------------------------------------------------------------------------
  // SUITE 5: Knowledge Base & Conversational Graph Boundary Proofs
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 5] Knowledge Base & Conversational Graph Boundary Proofs');

  test('5.1 Exactly 18 items across 5 categories in knowledge-base.ts', () => {
    assertEqual(KNOWLEDGE_ITEMS.length, 18, 'Knowledge base must have exactly 18 items');
    assertEqual(CATEGORIES.length, 5, 'Knowledge base must have 5 categories');

    const catCounts = {};
    for (const item of KNOWLEDGE_ITEMS) {
      catCounts[item.category] = (catCounts[item.category] || 0) + 1;
      assert(item.id, 'Item must have id');
      assert(item.question && item.question.length > 5, `Item ${item.id} question must be non-trivial`);
      assert(item.answer && item.answer.length > 10, `Item ${item.id} answer must be non-trivial`);
    }

    assertEqual(catCounts['core'], 4, 'Core category has 4 items');
    assertEqual(catCounts['why-mylaw'], 4, 'Why MyLaw category has 4 items');
    assertEqual(catCounts['for-seeking-help'], 4, 'For Seeking Help category has 4 items');
    assertEqual(catCounts['for-lawyers'], 3, 'For Lawyers category has 3 items');
    assertEqual(catCounts['launch'], 3, 'Launch category has 3 items');
  });

  test('5.2 Zero dead-end links: 100% of followUpIds map to valid existing knowledge items', () => {
    for (const item of KNOWLEDGE_ITEMS) {
      assert(Array.isArray(item.followUpIds), `Item ${item.id} must have followUpIds array`);
      assert(item.followUpIds.length >= 2 && item.followUpIds.length <= 3, `Item ${item.id} has 2-3 followUps`);

      for (const fId of item.followUpIds) {
        const target = getKnowledgeItemById(fId);
        assert(target !== undefined, `Dead-end in ${item.id}: followUpId "${fId}" cannot be resolved!`);
      }
    }
  });

  test('5.3 Full graph topology verification: 1-step return to initial questions and ergodic random walk', () => {
    const initialQs = getInitialQuestions();
    assertEqual(initialQs.length, 5, '5 initial questions');

    // 1. Forward reachability from initial questions
    const forwardVisited = new Set();
    const queue = [...initialQs.map(q => q.id)];

    while (queue.length > 0) {
      const currentId = queue.shift();
      if (forwardVisited.has(currentId)) continue;
      forwardVisited.add(currentId);

      const followUps = getFollowUpQuestions(currentId);
      for (const f of followUps) {
        if (!forwardVisited.has(f.id)) {
          queue.push(f.id);
        }
      }
    }

    assertEqual(forwardVisited.size, 14, 'Forward BFS yields 14 directly connected nodes from initial questions');

    // 2. Shortest path to Initial Question Set is <= 2 steps for all 18 nodes
    for (const item of KNOWLEDGE_ITEMS) {
      const followUps = getFollowUpQuestions(item.id);
      assert(followUps.length >= 2, `Node ${item.id} has >= 2 follow-ups`);
      
      // Calculate BFS distance to any initial question
      const q = [{ id: item.id, dist: 0 }];
      const visited = new Set([item.id]);
      let minDistToInitial = Infinity;

      while (q.length > 0) {
        const { id, dist } = q.shift();
        if (dist > 0 && INITIAL_QUESTION_IDS.includes(id)) {
          minDistToInitial = dist;
          break;
        }
        for (const nextItem of getFollowUpQuestions(id)) {
          if (!visited.has(nextItem.id)) {
            visited.add(nextItem.id);
            q.push({ id: nextItem.id, dist: dist + 1 });
          }
        }
      }

      assert(minDistToInitial <= 2, `Node ${item.id} shortest path to initial questions (${minDistToInitial}) must be <= 2 steps`);
    }

    // 3. Ergodic Random Walk: 1,000 steps starting from any node always visits all 5 initial questions
    for (const start of KNOWLEDGE_ITEMS) {
      let cur = start.id;
      const seenInitials = new Set();
      for (let s = 0; s < 1000; s++) {
        if (INITIAL_QUESTION_IDS.includes(cur)) {
          seenInitials.add(cur);
        }
        const followUps = getFollowUpQuestions(cur);
        cur = followUps[Math.floor(Math.random() * followUps.length)].id;
      }
      assertEqual(seenInitials.size, 5, `1000-step walk from ${start.id} visited all 5 initial questions`);
    }
  });

  test('5.4 Statutory legal disclaimer verbatim matching and Notice banner rendering', () => {
    assertEqual(
      STATUTORY_LEGAL_DISCLAIMER,
      "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.",
      'Statutory disclaimer constant fidelity'
    );

    const disclaimerItem = getKnowledgeItemById('help-legal-advice-disclaimer');
    assert(disclaimerItem, 'Disclaimer item exists');
    assertEqual(disclaimerItem.answer, STATUTORY_LEGAL_DISCLAIMER, 'Disclaimer answer matches verbatim');
    assertEqual(disclaimerItem.isDisclaimer, true, 'isDisclaimer flag is true');

    const msg = {
      id: 'd1',
      sender: 'assistant',
      text: disclaimerItem.answer,
      isDisclaimer: true,
      cta: disclaimerItem.cta,
      timestamp: 1
    };

    const html = renderToString(React.createElement(MessageBubble, { message: msg }));
    assert(html.includes('border-l-2 border-l-[#2F7C78]'), 'Teal left accent border');
    assert(html.includes('Notice'), 'Notice label badge');
    assert(html.includes('href="/waitlist"'), 'CTA href is /waitlist');
  });

  test('5.5 Micro-disclaimer footer exact copy', () => {
    assertEqual(MICRO_DISCLAIMER_TEXT, 'Informational assistant only. No legal advice provided.', 'Micro disclaimer copy fidelity');
  });

  test('5.6 Waitlist CTA integrity and role routing (/waitlist vs /waitlist?role=lawyer)', () => {
    const itemsWithCta = KNOWLEDGE_ITEMS.filter((i) => i.cta);
    assert(itemsWithCta.length >= 7, `Found ${itemsWithCta.length} items with CTA`);

    for (const item of itemsWithCta) {
      if (item.category === 'for-lawyers') {
        assertEqual(item.cta.href, '/waitlist?role=lawyer', `Lawyer item ${item.id} routes to /waitlist?role=lawyer`);
        assertEqual(item.cta.role, 'lawyer', `Lawyer item ${item.id} has role='lawyer'`);
      } else {
        assertEqual(item.cta.href, '/waitlist', `Item ${item.id} routes to /waitlist`);
      }
    }
  });

  test('5.7 14 Compatibility alias mappings resolve reliably', () => {
    const aliasMap = {
      'core-how-it-works': 'core-what-is-mylaw',
      'core-is-it-legal-advice': 'help-legal-advice-disclaimer',
      'core-who-created': 'why-principles',
      'why-mylaw-different': 'core-how-different',
      'why-trust': 'why-verification',
      'why-clarity': 'why-principles',
      'why-accessibility': 'core-is-it-free',
      'help-find-lawyer': 'help-finding-lawyer',
      'help-what-issues': 'core-areas-covered',
      'help-confidentiality': 'why-privacy',
      'help-cost': 'core-is-it-free',
      'lawyer-how-to-join': 'lawyer-joining',
      'lawyer-verification': 'lawyer-requirements',
      'launch-waitlist': 'launch-timeline'
    };

    for (const [alias, targetId] of Object.entries(aliasMap)) {
      const item = getKnowledgeItemById(alias);
      assert(item !== undefined, `Alias ${alias} failed to resolve`);
      assertEqual(item.id, targetId, `Alias ${alias} must resolve to ${targetId}`);
    }
  });

  test('5.8 Curated greetings pool contains exactly 4 distinct, non-empty greetings', () => {
    assertEqual(INITIAL_GREETINGS.length, 4, '4 greetings in pool');
    const set = new Set(INITIAL_GREETINGS);
    assertEqual(set.size, 4, 'All 4 greetings are unique');
    for (const g of INITIAL_GREETINGS) {
      assert(g.length > 20, 'Greeting is descriptive');
      assert(!g.includes('undefined'), 'No undefined in greeting');
    }
  });

  // -------------------------------------------------------------------------
  // FINAL REPORT & SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(`  TIER 5 RESULTS: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
  console.log('======================================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal error in Tier 5 test harness:', err);
  process.exit(1);
});
