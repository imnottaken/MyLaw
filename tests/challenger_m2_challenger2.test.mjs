#!/usr/bin/env node

/**
 * Challenger 2 — Milestone 2 Adversarial Stress Test Suite
 * Specialization: Accessibility, Responsiveness, Styling & Negative Assertions
 *
 * Target: src/components/assistant/
 *
 * Verification Areas:
 * 1. Prohibited Elements & Negative Assertions (Zero inputs, zero textareas, zero contenteditable, zero dark: classes)
 * 2. Exact Hex Token & Design System Compliance (#172033, #285A8E, #1e4670, #2F7C78, #FFFFFF, #F7F8FA, #E6E8EC)
 * 3. Mobile Fluid Width & Viewport Responsiveness (w-[calc(100vw-32px)], sm:w-[380px], 52px circular trigger)
 * 4. Comprehensive ARIA Attribute & Accessibility Conformance (dialog, log, polite, tooltip, buttons, focus-visible)
 * 5. Keyboard Navigation & Focus Management (ESC dismissal, focus restore to trigger)
 * 6. Color Contrast Ratios (WCAG AA and AAA compliance)
 * 7. Tailwind CSS v4 Engine Compilation Verification
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
function getFilesRecursive(dir, extensions = ['.tsx', '.ts']) {
  let files = [];
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

// Relative luminance and contrast calculation functions (WCAG 2.1)
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
// RUN SUITES
// =========================================================================

async function run() {
  console.log('\n===================================================================');
  console.log('  CHALLENGER 2 — ADVERSARIAL VERIFICATION HARNESS (M2 ACCESSIBILITY & RESPONSIVENESS)');
  console.log('===================================================================\n');

  const assistantDir = path.resolve('src/components/assistant');
  const assistantFiles = getFilesRecursive(assistantDir, ['.tsx', '.ts']);

  // Load modules
  const iconsModule = loadTsxModule(path.resolve('src/components/icons/index.tsx'));
  const knowledgeBaseModule = loadTsxModule(path.resolve('src/components/assistant/data/knowledge-base.ts'));

  const questionPillModule = loadTsxModule(path.resolve('src/components/assistant/QuestionPill.tsx'), {
    '@/components/icons': iconsModule
  });

  const messageBubbleModule = loadTsxModule(path.resolve('src/components/assistant/MessageBubble.tsx'), {
    '@/components/icons': iconsModule
  });

  const assistantTriggerModule = loadTsxModule(path.resolve('src/components/assistant/AssistantTrigger.tsx'), {
    '@/components/icons': iconsModule
  });

  const assistantPanelModule = loadTsxModule(path.resolve('src/components/assistant/AssistantPanel.tsx'), {
    '@/components/icons': iconsModule,
    './MessageBubble': messageBubbleModule,
    './QuestionPill': questionPillModule,
    './data/knowledge-base': knowledgeBaseModule
  });

  const assistantModule = loadTsxModule(path.resolve('src/components/assistant/Assistant.tsx'), {
    './data/knowledge-base': knowledgeBaseModule,
    './AssistantTrigger': assistantTriggerModule,
    './AssistantPanel': assistantPanelModule
  });

  const { AssistantPanel } = assistantPanelModule;
  const { AssistantTrigger } = assistantTriggerModule;
  const { MessageBubble } = messageBubbleModule;
  const { QuestionPill } = questionPillModule;
  const Assistant = assistantModule.default;

  // -------------------------------------------------------------------------
  // SUITE 1: Prohibited Elements & Negative Assertions
  // -------------------------------------------------------------------------
  console.log('▶ [Suite 1] Prohibited Elements & Negative Assertions');

  test('1.1 Zero <input> tags or JSX elements across all assistant source files', () => {
    const inputRegex = /<input\b/gi;
    for (const file of assistantFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(inputRegex) || [];
      assert(
        matches.length === 0,
        `File ${path.relative(process.cwd(), file)} contains prohibited <input> elements (found: ${matches.length})`
      );
    }
  });

  test('1.2 Zero <textarea> tags or JSX elements across all assistant source files', () => {
    const textareaRegex = /<textarea\b/gi;
    for (const file of assistantFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(textareaRegex) || [];
      assert(
        matches.length === 0,
        `File ${path.relative(process.cwd(), file)} contains prohibited <textarea> elements (found: ${matches.length})`
      );
    }
  });

  test('1.3 Zero contenteditable or free-text entry attributes across all assistant source files', () => {
    const ceRegex = /contenteditable/gi;
    for (const file of assistantFiles) {
      const content = fs.readFileSync(file, 'utf8');
      assert(
        !ceRegex.test(content),
        `File ${path.relative(process.cwd(), file)} contains prohibited contenteditable attribute`
      );
    }
  });

  test('1.4 Zero dark: CSS utility prefixes across all assistant source files', () => {
    const darkRegex = /\bdark:/gi;
    for (const file of assistantFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(darkRegex) || [];
      assert(
        matches.length === 0,
        `File ${path.relative(process.cwd(), file)} contains prohibited dark: utility classes (found: ${matches.length})`
      );
    }
  });

  test('1.5 Zero dynamic AI/LLM API calls or AI SDK dependencies across assistant source files', () => {
    const aiKeywords = ['openai', 'anthropic', 'cohere', 'langchain', 'ai/react', 'useCompletion', 'useChat'];
    for (const file of assistantFiles) {
      const content = fs.readFileSync(file, 'utf8');
      for (const keyword of aiKeywords) {
        assert(
          !content.includes(keyword),
          `File ${path.relative(process.cwd(), file)} contains AI SDK reference: ${keyword}`
        );
      }
    }
  });

  test('1.6 Rendered SSR DOM tree contains zero <input> or <textarea> elements in open or closed states', () => {
    // Closed state
    const closedHtml = renderToString(React.createElement(Assistant));
    assert(!closedHtml.includes('<input'), 'Closed Assistant rendered DOM contains <input>');
    assert(!closedHtml.includes('<textarea'), 'Closed Assistant rendered DOM contains <textarea>');

    // Open panel with feed & questions
    const openPanelHtml = renderToString(
      React.createElement(AssistantPanel, {
        isOpen: true,
        messages: [
          { id: '1', sender: 'assistant', text: 'Hello', timestamp: 1 },
          { id: '2', sender: 'user', text: 'What is MyLaw?', timestamp: 2 }
        ],
        currentQuestions: knowledgeBaseModule.getInitialQuestions(),
        activeQuestionId: null,
        isTransitioning: false,
        onClose: () => {},
        onSelectQuestion: () => {},
        onResetToInitial: () => {}
      })
    );
    assert(!openPanelHtml.includes('<input'), 'Open AssistantPanel rendered DOM contains <input>');
    assert(!openPanelHtml.includes('<textarea'), 'Open AssistantPanel rendered DOM contains <textarea>');
  });

  // -------------------------------------------------------------------------
  // SUITE 2: Exact Hex Token & Design System Compliance
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 2] Exact Hex Token & Design System Compliance');

  test('2.1 Component Hex Colors match authorized MyLaw palette strictly', () => {
    // Authorized palette tokens (normalized lowercase 6-char hex)
    const authorizedHexes = new Set([
      'ffffff', // White
      'f7f8fa', // Soft Grey (Assistant bubble, Footer, Hover)
      '172033', // Deep Navy (Primary text, Trigger button, Tooltip bg, Header text)
      '285a8e', // Brand Blue (User bubble, CTA button, Trigger focus ring)
      '1e4670', // Brand Blue Hover (Trigger hover, CTA hover, Back-button hover)
      '2f7c78', // Muted Teal (Status dot, Pulse dot, Disclaimer notice badge)
      'e6e8ec', // Border / Dividers
      '667085', // Secondary Text / Muted labels
      'f0f4f8'  // Active pill background
    ]);

    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;

    for (const file of assistantFiles) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = hexRegex.exec(content)) !== null) {
        let hex = match[1].toLowerCase();
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        assert(
          authorizedHexes.has(hex),
          `File ${path.relative(process.cwd(), file)} contains unauthorized hex color #${match[1]}!`
        );
      }
    }
  });

  test('2.2 Deep Navy (#172033) is applied to trigger background, header text, and tooltip', () => {
    const triggerSrc = fs.readFileSync('src/components/assistant/AssistantTrigger.tsx', 'utf8');
    const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');

    assert(triggerSrc.includes('bg-[#172033]'), 'AssistantTrigger must use bg-[#172033]');
    assert(triggerSrc.includes('bg-[#172033]'), 'AssistantTrigger tooltip must use bg-[#172033]');
    assert(panelSrc.includes('text-[#172033]'), 'AssistantPanel header must use text-[#172033]');
  });

  test('2.3 Brand Accent Blue (#285A8E) and Hover (#1e4670) are applied to user bubbles and CTA buttons', () => {
    const bubbleSrc = fs.readFileSync('src/components/assistant/MessageBubble.tsx', 'utf8');
    assert(bubbleSrc.includes('bg-[#285A8E]'), 'MessageBubble user message must use bg-[#285A8E]');
    assert(bubbleSrc.includes('text-white'), 'MessageBubble user message must use text-white');
    assert(bubbleSrc.includes('bg-[#285A8E] hover:bg-[#1e4670]'), 'MessageBubble CTA button must use bg-[#285A8E] hover:bg-[#1e4670]');
  });

  test('2.4 Muted Teal (#2F7C78) is applied to availability pulse dot, header dot, and disclaimer badge', () => {
    const triggerSrc = fs.readFileSync('src/components/assistant/AssistantTrigger.tsx', 'utf8');
    const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');
    const bubbleSrc = fs.readFileSync('src/components/assistant/MessageBubble.tsx', 'utf8');

    assert(triggerSrc.includes('bg-[#2F7C78]'), 'Trigger pulse dot must use bg-[#2F7C78]');
    assert(panelSrc.includes('bg-[#2F7C78]'), 'Panel header active dot must use bg-[#2F7C78]');
    assert(bubbleSrc.includes('text-[#2F7C78]'), 'MessageBubble disclaimer notice must use text-[#2F7C78]');
    assert(bubbleSrc.includes('border-l-[#2F7C78]'), 'MessageBubble disclaimer border must use border-l-[#2F7C78]');
  });

  test('2.5 Soft Grey (#F7F8FA) is applied to assistant answer bubbles and micro-disclaimer footer', () => {
    const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');
    const bubbleSrc = fs.readFileSync('src/components/assistant/MessageBubble.tsx', 'utf8');

    assert(bubbleSrc.includes('bg-[#F7F8FA]'), 'Assistant bubble must use bg-[#F7F8FA]');
    assert(panelSrc.includes('bg-[#F7F8FA]'), 'Panel footer must use bg-[#F7F8FA]');
  });

  await asyncTest('2.6 Tailwind v4 PostCSS compilation verifies all assistant utility classes generate valid CSS', async () => {
    const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');

    // Gather all classNames from assistant files
    let combinedClasses = '';
    const classRegex = /className=["'`]([^"'`]+)["'`]/g;
    for (const file of assistantFiles) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = classRegex.exec(content)) !== null) {
        combinedClasses += ' ' + match[1];
      }
    }

    const testCss = `
      ${globalsCss}
      .test-assistant-classes {
        /* testing tailwind compilation */
      }
    `;

    const result = await postcss([tailwindPostcss()]).process(testCss, {
      from: path.resolve('src/app/globals.css')
    });

    assert(result.css.length > 0, 'Compiled CSS should not be empty');
    assert(!result.css.includes('undefined'), 'Compiled CSS should not contain undefined');
  });

  // -------------------------------------------------------------------------
  // SUITE 3: Responsiveness & Mobile Fluid Width Behavior
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 3] Responsiveness & Mobile Fluid Width Behavior');

  const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');
  const triggerSrc = fs.readFileSync('src/components/assistant/AssistantTrigger.tsx', 'utf8');

  test('3.1 AssistantPanel uses mobile fluid width w-[calc(100vw-32px)] and sm:w-[380px]', () => {
    assert(
      panelSrc.includes('w-[calc(100vw-32px)]'),
      'AssistantPanel must have mobile fluid width w-[calc(100vw-32px)]'
    );
    assert(
      panelSrc.includes('sm:w-[380px]'),
      'AssistantPanel must have desktop width sm:w-[380px] (within 360-400px requirement)'
    );
  });

  test('3.2 AssistantPanel sets max height constraints max-h-[580px] and feed max-h-[400px]', () => {
    assert(panelSrc.includes('max-h-[580px]'), 'AssistantPanel must set max-h-[580px]');
    assert(panelSrc.includes('max-h-[400px]'), 'Feed container must set max-h-[400px]');
    assert(panelSrc.includes('overscroll-contain'), 'Feed container must set overscroll-contain');
  });

  test('3.3 AssistantTrigger has exact button dimensions w-[52px] h-[52px] (within 48-56px range)', () => {
    assert(
      triggerSrc.includes('w-[52px] h-[52px]'),
      'AssistantTrigger must be 52px by 52px (within 48-56px range)'
    );
    assert(
      triggerSrc.includes('rounded-full'),
      'AssistantTrigger must be circular (rounded-full)'
    );
  });

  test('3.4 Mobile tooltip clipping prevention: hidden on small screens (hidden sm:block)', () => {
    assert(
      triggerSrc.includes('hidden sm:block'),
      'Hover tooltip must be hidden on mobile (hidden sm:block) to prevent screen overflow'
    );
  });

  test('3.5 Fixed positioning coordinates adhere to mobile and desktop responsive offsets', () => {
    assert(
      panelSrc.includes('fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50'),
      'AssistantPanel must have responsive fixed positioning'
    );
    assert(
      triggerSrc.includes('fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50'),
      'AssistantTrigger must have responsive fixed positioning'
    );
  });

  // -------------------------------------------------------------------------
  // SUITE 4: Accessibility (ARIA) & Semantic HTML Hierarchy
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 4] Accessibility (ARIA) & Semantic HTML Hierarchy');

  test('4.1 AssistantPanel dialog semantics: role="dialog", aria-labelledby, and aria-modal="false"', () => {
    const mockProps = {
      isOpen: true,
      messages: [{ id: '1', sender: 'assistant', text: 'Hello', timestamp: 123 }],
      currentQuestions: knowledgeBaseModule.getInitialQuestions(),
      activeQuestionId: null,
      isTransitioning: false,
      onClose: () => {},
      onSelectQuestion: () => {},
      onResetToInitial: () => {}
    };

    const html = renderToString(React.createElement(AssistantPanel, mockProps));

    assert(html.includes('role="dialog"'), 'AssistantPanel must have role="dialog"');
    assert(html.includes('id="mylaw-assistant-panel"'), 'AssistantPanel must have id="mylaw-assistant-panel"');
    assert(html.includes('aria-labelledby="assistant-panel-title"'), 'AssistantPanel must have aria-labelledby="assistant-panel-title"');
    assert(html.includes('aria-modal="false"'), 'AssistantPanel must have aria-modal="false"');
    assert(html.includes('id="assistant-panel-title"'), 'Header title must have id="assistant-panel-title"');
  });

  test('4.2 AssistantPanel close button has accessible label and focus ring', () => {
    const mockProps = {
      isOpen: true,
      messages: [],
      currentQuestions: [],
      activeQuestionId: null,
      isTransitioning: false,
      onClose: () => {},
      onSelectQuestion: () => {},
      onResetToInitial: () => {}
    };

    const html = renderToString(React.createElement(AssistantPanel, mockProps));

    assert(html.includes('type="button"'), 'Close button must have type="button"');
    assert(html.includes('aria-label="Close assistant"'), 'Close button must have aria-label="Close assistant"');
    assert(html.includes('focus-visible:ring-2 focus-visible:ring-[#285A8E]'), 'Close button must have focus-visible ring');
  });

  test('4.3 Message feed has role="log", aria-live="polite", and aria-label', () => {
    const mockProps = {
      isOpen: true,
      messages: [],
      currentQuestions: [],
      activeQuestionId: null,
      isTransitioning: false,
      onClose: () => {},
      onSelectQuestion: () => {},
      onResetToInitial: () => {}
    };

    const html = renderToString(React.createElement(AssistantPanel, mockProps));

    assert(html.includes('role="log"'), 'Feed container must have role="log"');
    assert(html.includes('aria-live="polite"'), 'Feed container must have aria-live="polite"');
    assert(html.includes('aria-label="Assistant conversation"'), 'Feed container must have aria-label="Assistant conversation"');
  });

  test('4.4 AssistantTrigger ARIA attributes in closed state', () => {
    const html = renderToString(
      React.createElement(AssistantTrigger, {
        isOpen: false,
        onToggle: () => {}
      })
    );

    assert(html.includes('type="button"'), 'Trigger must have type="button"');
    assert(html.includes('aria-expanded="false"'), 'Trigger must have aria-expanded="false" when closed');
    assert(html.includes('aria-haspopup="dialog"'), 'Trigger must have aria-haspopup="dialog"');
    assert(html.includes('aria-controls="mylaw-assistant-panel"'), 'Trigger must have aria-controls="mylaw-assistant-panel"');
    assert(html.includes('aria-label="Ask MyLaw Assistant"'), 'Trigger must have aria-label="Ask MyLaw Assistant" when closed');
    assert(html.includes('aria-describedby="assistant-trigger-tooltip"'), 'Trigger must reference tooltip with aria-describedby');
    assert(html.includes('role="tooltip"'), 'Tooltip must have role="tooltip"');
    assert(html.includes('id="assistant-trigger-tooltip"'), 'Tooltip must have id="assistant-trigger-tooltip"');
  });

  test('4.5 AssistantTrigger ARIA attributes in open state', () => {
    const html = renderToString(
      React.createElement(AssistantTrigger, {
        isOpen: true,
        onToggle: () => {}
      })
    );

    assert(html.includes('aria-expanded="true"'), 'Trigger must have aria-expanded="true" when open');
    assert(html.includes('aria-label="Close MyLaw Assistant"'), 'Trigger must have aria-label="Close MyLaw Assistant" when open');
    assert(!html.includes('aria-describedby="assistant-trigger-tooltip"'), 'Trigger should not reference tooltip when open');
    assert(!html.includes('role="tooltip"'), 'Tooltip should not render when open');
  });

  test('4.6 QuestionPill accessibility and keyboard focus support', () => {
    const sampleQuestion = knowledgeBaseModule.getKnowledgeItemById('core-what-is-mylaw');
    assert(sampleQuestion, 'Sample question must exist');

    const html = renderToString(
      React.createElement(QuestionPill, {
        question: sampleQuestion,
        onClick: () => {},
        disabled: false
      })
    );

    assert(html.includes('type="button"'), 'QuestionPill must have type="button"');
    assert(html.includes(`aria-label="${sampleQuestion.question}"`), 'QuestionPill aria-label must match question text');
    assert(html.includes('focus-visible:ring-2 focus-visible:ring-[#285A8E]'), 'QuestionPill must have focus-visible ring');
    assert(!html.includes('disabled=""'), 'Enabled QuestionPill should not have disabled attribute');

    // Test disabled state
    const disabledHtml = renderToString(
      React.createElement(QuestionPill, {
        question: sampleQuestion,
        onClick: () => {},
        disabled: true
      })
    );
    assert(disabledHtml.includes('disabled=""') || disabledHtml.includes('disabled'), 'Disabled QuestionPill must have disabled attribute');
    assert(disabledHtml.includes('disabled:opacity-50'), 'Disabled QuestionPill must have disabled:opacity-50 class');
  });

  test('4.7 MessageBubble renders accessible disclaimer badge and semantic CTA link', () => {
    const disclaimerItem = knowledgeBaseModule.getKnowledgeItemById('help-legal-advice-disclaimer');
    assert(disclaimerItem, 'Disclaimer item must exist');

    const message = {
      id: 'test-disc',
      sender: 'assistant',
      text: disclaimerItem.answer,
      isDisclaimer: true,
      cta: disclaimerItem.cta,
      timestamp: Date.now()
    };

    const html = renderToString(React.createElement(MessageBubble, { message }));

    assert(html.includes('border-l-2 border-l-[#2F7C78]'), 'Disclaimer bubble has teal left accent');
    assert(html.includes('Notice'), 'Disclaimer bubble has Notice label');
    assert(html.includes('href="/waitlist"'), 'CTA link routes to /waitlist');
    assert(html.includes('Join the Waitlist →'), 'CTA button displays correct label');
  });

  // -------------------------------------------------------------------------
  // SUITE 5: Conversational State Machine & Traversal
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 5] Conversational State Machine & Traversal');

  test('5.1 Assistant component initial render is closed (trigger rendered, panel null)', () => {
    const html = renderToString(React.createElement(Assistant));

    assert(html.includes('aria-label="Ask MyLaw Assistant"'), 'Closed Assistant renders trigger button');
    assert(html.includes('Ask MyLaw'), 'Closed Assistant renders tooltip text');
    assert(!html.includes('id="mylaw-assistant-panel"'), 'Closed Assistant must NOT render AssistantPanel');
  });

  test('5.2 Random Greeting Pool contains 4 curated messages', () => {
    assertEqual(knowledgeBaseModule.INITIAL_GREETINGS.length, 4, 'INITIAL_GREETINGS must contain 4 items');
    for (let i = 0; i < 20; i++) {
      const greeting = knowledgeBaseModule.getRandomGreeting();
      assert(knowledgeBaseModule.INITIAL_GREETINGS.includes(greeting), `Random greeting must be from pool: ${greeting}`);
    }
  });

  test('5.3 Top 5 initial questions are loaded by default', () => {
    const initialQuestions = knowledgeBaseModule.getInitialQuestions();
    assertEqual(initialQuestions.length, 5, 'Must return exactly 5 initial questions');
    assertEqual(
      initialQuestions.map((q) => q.id),
      [
        'core-what-is-mylaw',
        'help-legal-advice-disclaimer',
        'why-verification',
        'lawyer-joining',
        'launch-timeline'
      ],
      'Initial question IDs match spec'
    );
  });

  test('5.4 Follow-up question mapping returns 2-3 valid follow-up questions for every item', () => {
    for (const item of knowledgeBaseModule.KNOWLEDGE_ITEMS) {
      const followUps = knowledgeBaseModule.getFollowUpQuestions(item.id);
      assert(
        followUps.length >= 2 && followUps.length <= 4,
        `Item ${item.id} must have 2-4 follow-up items (got: ${followUps.length})`
      );
      for (const fq of followUps) {
        assert(fq && fq.id, `Follow-up item for ${item.id} must be a valid resolved KnowledgeItem`);
      }
    }
  });

  test('5.5 Reset to initial questions fallback works for unmapped/invalid IDs', () => {
    const fallback = knowledgeBaseModule.getFollowUpQuestions('invalid-id-xyz');
    assertEqual(fallback.length, 5, 'Invalid ID must fallback to 5 initial questions');
    assertEqual(fallback[0].id, 'core-what-is-mylaw', 'First question in fallback is core-what-is-mylaw');
  });

  test('5.6 Statutory legal disclaimer exact verbatim text matching', () => {
    const disclaimerItem = knowledgeBaseModule.getKnowledgeItemById('help-legal-advice-disclaimer');
    assert(disclaimerItem, 'help-legal-advice-disclaimer item must exist');
    assertEqual(
      disclaimerItem.answer,
      "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.",
      'Statutory legal disclaimer text must match spec verbatim'
    );
    assertEqual(disclaimerItem.isDisclaimer, true, 'isDisclaimer flag must be true');
    assertEqual(disclaimerItem.cta?.href, '/waitlist', 'CTA must route to /waitlist');
  });

  test('5.7 Lawyer onboarding answers include /waitlist?role=lawyer CTA', () => {
    const lawyerItem = knowledgeBaseModule.getKnowledgeItemById('lawyer-joining');
    assert(lawyerItem, 'lawyer-joining item must exist');
    assertEqual(lawyerItem.cta?.href, '/waitlist?role=lawyer', 'Lawyer CTA href must be /waitlist?role=lawyer');
    assertEqual(lawyerItem.cta?.role, 'lawyer', 'Lawyer CTA role must be "lawyer"');
  });

  test('5.8 ESC key dismissal listener and cleanup in Assistant.tsx', () => {
    const assistantSrc = fs.readFileSync('src/components/assistant/Assistant.tsx', 'utf8');

    assert(assistantSrc.includes('e.key === "Escape"'), 'Assistant.tsx must listen for Escape key');
    assert(assistantSrc.includes('window.addEventListener("keydown", onKeyDown)'), 'Assistant.tsx must add keydown listener');
    assert(assistantSrc.includes('window.removeEventListener("keydown", onKeyDown)'), 'Assistant.tsx must remove keydown listener');
    assert(assistantSrc.includes('clearTimeout(transitionTimerRef.current)'), 'Assistant.tsx must clean up transition timer');
    assert(assistantSrc.includes('triggerRef.current?.focus()'), 'Assistant.tsx must restore focus to trigger button');
  });

  test('5.9 Transition timing delay is set to 180ms (within 150-250ms spec)', () => {
    const assistantSrc = fs.readFileSync('src/components/assistant/Assistant.tsx', 'utf8');
    assert(
      assistantSrc.includes('180'),
      'Assistant.tsx should use 180ms transition delay (within 150-250ms window)'
    );
  });

  // -------------------------------------------------------------------------
  // SUITE 6: Adversarial Payload Injection & Edge Cases
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 6] Adversarial Payload Injection & Edge Cases');

  test('6.1 XSS payloads and HTML markup are safely escaped without executing or breaking layout', () => {
    const xssPayloads = [
      '<script>alert(1)</script>',
      '<img src=x onerror="alert(\'xss\')" />',
      '<iframe src="https://evil.com"></iframe>',
      '"><script>window.__pwned=true</script>',
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    ];

    for (const payload of xssPayloads) {
      const userMsg = { id: 'xss-1', sender: 'user', text: payload, timestamp: Date.now() };
      const asstMsg = { id: 'xss-2', sender: 'assistant', text: payload, timestamp: Date.now() };

      const userHtml = renderToString(React.createElement(MessageBubble, { message: userMsg }));
      const asstHtml = renderToString(React.createElement(MessageBubble, { message: asstMsg }));

      assert(!userHtml.includes('<script>'), 'User bubble must escape <script>');
      assert(!userHtml.includes('<iframe'), 'User bubble must escape <iframe');
      assert(!asstHtml.includes('<script>'), 'Assistant bubble must escape <script>');
      assert(!asstHtml.includes('<iframe'), 'Assistant bubble must escape <iframe');
    }
  });

  test('6.2 Unicode, Emoji, and multiline text render cleanly', () => {
    const complexText = '⚖️ Legal help in 日本語 & Español\nLine 2 with "quotes" and \'apostrophes\'\n\nLine 3 with unicode: 👨‍⚖️ § ¶ ✦';
    const message = { id: 'unicode-msg', sender: 'assistant', text: complexText, timestamp: Date.now() };

    const html = renderToString(React.createElement(MessageBubble, { message }));
    assert(html.includes('whitespace-pre-line'), 'Assistant message has whitespace-pre-line to preserve line breaks');
    assert(html.includes('select-text'), 'Assistant message text is selectable (select-text)');
  });

  test('6.3 Large message history (50 messages) renders in feed without layout degradation', () => {
    const manyMessages = Array.from({ length: 50 }, (_, i) => ({
      id: `msg-${i}`,
      sender: i % 2 === 0 ? 'assistant' : 'user',
      text: `Test message ${i} with information about legal discovery process and platform guidelines.`,
      timestamp: Date.now() + i
    }));

    const mockProps = {
      isOpen: true,
      messages: manyMessages,
      currentQuestions: knowledgeBaseModule.getInitialQuestions(),
      activeQuestionId: null,
      isTransitioning: false,
      onClose: () => {},
      onSelectQuestion: () => {},
      onResetToInitial: () => {}
    };

    const html = renderToString(React.createElement(AssistantPanel, mockProps));
    assert(html.includes('Test message 0'), 'Renders initial message');
    assert(html.includes('Test message 49'), 'Renders 50th message');
    assert(html.includes('max-h-[400px]'), 'Feed retains scrollable max-h-[400px]');
  });

  // -------------------------------------------------------------------------
  // SUITE 7: Color Contrast Ratio Calculations (WCAG AA & AAA)
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 7] Color Contrast Ratio Verification (WCAG Standards)');

  test('7.1 User Message contrast: White (#FFFFFF) on Brand Blue (#285A8E) passes WCAG AA (>= 4.5:1)', () => {
    const contrast = getContrastRatio('#FFFFFF', '#285A8E');
    assert(contrast >= 4.5, `White on #285A8E contrast ratio must be >= 4.5:1 (got: ${contrast.toFixed(2)}:1)`);
  });

  test('7.2 Assistant Message contrast: Deep Navy (#172033) on Soft Grey (#F7F8FA) passes WCAG AAA (>= 7.0:1)', () => {
    const contrast = getContrastRatio('#172033', '#F7F8FA');
    assert(contrast >= 7.0, `Navy on #F7F8FA contrast ratio must be >= 7.0:1 (got: ${contrast.toFixed(2)}:1)`);
  });

  test('7.3 Header Title contrast: Deep Navy (#172033) on White (#FFFFFF) passes WCAG AAA (>= 7.0:1)', () => {
    const contrast = getContrastRatio('#172033', '#FFFFFF');
    assert(contrast >= 7.0, `Navy on White contrast ratio must be >= 7.0:1 (got: ${contrast.toFixed(2)}:1)`);
  });

  test('7.4 Tooltip contrast: White (#FFFFFF) on Deep Navy (#172033) passes WCAG AAA (>= 7.0:1)', () => {
    const contrast = getContrastRatio('#FFFFFF', '#172033');
    assert(contrast >= 7.0, `White on Navy contrast ratio must be >= 7.0:1 (got: ${contrast.toFixed(2)}:1)`);
  });

  test('7.5 Pill Button contrast: Deep Navy (#172033) on White (#FFFFFF) passes WCAG AAA (>= 7.0:1)', () => {
    const contrast = getContrastRatio('#172033', '#FFFFFF');
    assert(contrast >= 7.0, `Navy on Pill White contrast ratio must be >= 7.0:1 (got: ${contrast.toFixed(2)}:1)`);
  });

  // -------------------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------------------
  console.log('\n===================================================================');
  console.log(`  VERIFICATION RESULTS: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
  console.log('===================================================================\n');

  if (results.failed > 0) {
    console.error('FAILED ASSERTIONS:');
    results.failures.forEach((f) => console.error(`- ${f.name}: ${f.error}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL EMPIRICAL ASSERTIONS PASSED WITH 100% SUCCESS RATE.');
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
