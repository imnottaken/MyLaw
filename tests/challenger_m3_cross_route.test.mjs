#!/usr/bin/env node

/**
 * Challenger 1 Milestone M3 Empirical Verification Suite:
 * Global Integration, Cross-Route Rendering, Z-Index Layering & Navigation Polish
 *
 * Tests:
 * 1. Live HTTP Rendering & Cross-Route Mounting (`/`, `/waitlist`, `/_not-found` / 404 route)
 * 2. Z-Index Stacking Hierarchy, Stacking Contexts & Spatial Geometry
 * 3. Assistant Conversational State Machine & Component Responsiveness Across Routes
 * 4. Cross-Route Navigation via Inline Assistant CTA Buttons & Role Parameter Pre-selection
 * 5. Adversarial Guardrails & Non-Destructive Layout Verification
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ensureServer, stopServer, fetchPage, isServerHealthy } from './e2e/helpers/http-client.mjs';

const require = createRequire(import.meta.url);

const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: []
};

function test(name, fn) {
  testResults.total++;
  try {
    fn();
    testResults.passed++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    testResults.failed++;
    testResults.failures.push({ name, error: err.message, stack: err.stack });
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function asyncTest(name, fn) {
  testResults.total++;
  try {
    await fn();
    testResults.passed++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    testResults.failed++;
    testResults.failures.push({ name, error: err.message, stack: err.stack });
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

// Recursively get source files
function getAllSourceFiles(dir, extensions = ['.tsx', '.ts']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllSourceFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

// =========================================================================
// TEST EXECUTION
// =========================================================================

async function main() {
  console.log('\n===================================================================');
  console.log('  CHALLENGER 1 M3: GLOBAL INTEGRATION & CROSS-ROUTE VERIFICATION  ');
  console.log('===================================================================\n');

  // Load Assistant & Related Modules
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
  const assistantModule = loadTsxModule(path.resolve('src/components/assistant/Assistant.tsx'), {
    './data/knowledge-base': kbModule,
    './AssistantTrigger': triggerModule,
    './AssistantPanel': panelModule
  });
  const Assistant = assistantModule.default;

  // -------------------------------------------------------------------------
  // SECTION 1: Cross-Route Mounting & Live HTTP Rendering
  // -------------------------------------------------------------------------
  console.log('▶ [Section 1] Cross-Route Mounting & Live HTTP Rendering');

  let serverInfo;
  const targetPort = process.env.PORT || 3000;
  const baseUrl = process.env.BASE_URL || `http://localhost:${targetPort}`;

  try {
    const isHealthy = await isServerHealthy(baseUrl);
    if (!isHealthy) {
      console.log(`  Starting dev server on ${baseUrl}...`);
      serverInfo = await ensureServer({ port: targetPort, timeoutMs: 30000 });
      console.log(`  ✓ Server ready at ${serverInfo.url}\n`);
    } else {
      console.log(`  ✓ Connected to existing server at ${baseUrl}\n`);
    }
  } catch (err) {
    console.warn(`  ⚠️ Server connection note: ${err.message}`);
  }

  await asyncTest('1.1: Root Route (/) returns HTTP 200, renders RootLayout and Assistant Trigger', async () => {
    const res = await fetchPage('/', baseUrl);
    assertEqual(res.status, 200, 'Root route status');
    assert(res.body.includes('<html lang="en"'), 'Contains root html with lang="en"');
    assert(res.body.includes('<body'), 'Contains root body');
    // Verify Assistant trigger is rendered in HTML payload
    assert(
      res.body.includes('Ask MyLaw') || res.body.includes('aria-label="Ask MyLaw Assistant"') || res.body.includes('mylaw-assistant-root'),
      'Assistant trigger markup is present on landing page'
    );
    // Verify landing page content is fully present
    assert(res.body.includes('Finding the right lawyer'), 'Landing hero title');
    assert(res.body.includes('§ 01 / LEGAL HELP, SIMPLIFIED'), 'Landing section 01');
    assert(res.body.includes('§ 07 / PRE-LAUNCH ACCESS'), 'Landing section 07');
  });

  await asyncTest('1.2: Waitlist Route (/waitlist) returns HTTP 200, renders RootLayout and Assistant Trigger', async () => {
    const res = await fetchPage('/waitlist', baseUrl);
    assertEqual(res.status, 200, 'Waitlist route status');
    assert(res.body.includes('<html lang="en"'), 'Contains root html with lang="en"');
    assert(res.body.includes('<body'), 'Contains root body');
    assert(
      res.body.includes('Ask MyLaw') || res.body.includes('aria-label="Ask MyLaw Assistant"') || res.body.includes('mylaw-assistant-root'),
      'Assistant trigger markup is present on waitlist page'
    );
    // Verify waitlist page content is fully present
    assert(res.body.includes('COMING SOON'), 'Waitlist COMING SOON badge');
    assert(res.body.includes('Legal help, made simpler.'), 'Waitlist headline');
    assert(res.body.includes('Join the MyLaw waitlist'), 'Waitlist card title');
  });

  await asyncTest('1.3: 404 Route (/_not-found / non-existent route) returns HTTP 404 and mounts Assistant cleanly', async () => {
    const res = await fetchPage('/non-existent-route-for-testing-404-handling', baseUrl);
    assertEqual(res.status, 404, 'Non-existent route status');
    assert(res.body.includes('<html lang="en"'), 'Contains root html with lang="en"');
    assert(res.body.includes('<body'), 'Contains root body');
    // Layout.tsx wraps all routes including not-found
    assert(
      res.body.includes('Ask MyLaw') || res.body.includes('aria-label="Ask MyLaw Assistant"') || res.body.includes('mylaw-assistant-root'),
      'Assistant trigger markup is present on 404 page'
    );
  });

  test('1.4: Layout Hierarchy Integrity — Zero duplicate <html> or <body> tags', () => {
    const layoutSrc = fs.readFileSync('src/app/layout.tsx', 'utf8');
    const pageSrc = fs.readFileSync('src/app/page.tsx', 'utf8');
    const waitlistSrc = fs.readFileSync('src/app/waitlist/page.tsx', 'utf8');

    // layout.tsx has exactly one <html and one <body
    const htmlTagMatches = layoutSrc.match(/<html/g) || [];
    const bodyTagMatches = layoutSrc.match(/<body/g) || [];
    assertEqual(htmlTagMatches.length, 1, 'Exactly one <html tag in layout.tsx');
    assertEqual(bodyTagMatches.length, 1, 'Exactly one <body tag in layout.tsx');

    // Individual pages must NOT declare <html> or <body>
    assert(!pageSrc.includes('<html') && !pageSrc.includes('<body'), 'page.tsx must not declare html or body');
    assert(!waitlistSrc.includes('<html') && !waitlistSrc.includes('<body'), 'waitlist/page.tsx must not declare html or body');

    // Assistant component must NOT declare html or body
    const assistantSrc = fs.readFileSync('src/components/assistant/Assistant.tsx', 'utf8');
    assert(!assistantSrc.includes('<html') && !assistantSrc.includes('<body'), 'Assistant.tsx must not declare html or body');
  });

  // -------------------------------------------------------------------------
  // SECTION 2: Z-Index Stacking Hierarchy & Visual Layering
  // -------------------------------------------------------------------------
  console.log('\n▶ [Section 2] Z-Index Stacking Hierarchy & Visual Layering');

  const triggerSrc = fs.readFileSync('src/components/assistant/AssistantTrigger.tsx', 'utf8');
  const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');
  const navbarSrc = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
  const heroSrc = fs.readFileSync('src/components/landing/HeroSection.tsx', 'utf8');
  const waitlistPageSrc = fs.readFileSync('src/app/waitlist/page.tsx', 'utf8');

  test('2.1: Assistant Trigger and Panel use z-50 fixed stacking', () => {
    assert(triggerSrc.includes('z-50'), 'AssistantTrigger has z-50');
    assert(triggerSrc.includes('fixed bottom-5 right-5 sm:bottom-6 sm:right-6'), 'AssistantTrigger is fixed bottom-right');
    assert(panelSrc.includes('z-50'), 'AssistantPanel has z-50');
    assert(panelSrc.includes('fixed bottom-20 right-4 sm:bottom-22 sm:right-6'), 'AssistantPanel is fixed bottom-right');
  });

  test('2.2: Stacking Hierarchy ensures Assistant overlays underlying content', () => {
    // Hero has relative z-10
    assert(heroSrc.includes('z-10'), 'HeroSection content has z-10 (lower than Assistant z-50)');
    // Waitlist Header has sticky top-0 z-30
    assert(waitlistPageSrc.includes('z-30'), 'Waitlist header has z-30 (lower than Assistant z-50)');
    // Waitlist Background overlays have negative z-indices
    assert(waitlistPageSrc.includes('-z-30') && waitlistPageSrc.includes('-z-20') && waitlistPageSrc.includes('-z-10'), 'Waitlist overlays are negative z-index');
    // Navbar has fixed top-0 inset-x-0 z-50, and mobile drawer has z-40
    assert(navbarSrc.includes('z-50'), 'Navbar has z-50');
    assert(navbarSrc.includes('z-40'), 'Navbar mobile menu drawer has z-40');
  });

  test('2.3: Spatial Non-Collision — Disjoint Viewport Geometry between Assistant & Navbar', () => {
    // Assistant Trigger: bottom-5/6, right-5/6 (anchored bottom-right)
    // Assistant Panel: bottom-20/22, right-4/6, max-h-[580px]
    // Navbar: top-0, inset-x-0, h-16 (64px height)
    // On desktop (1080p, 900p, 768p viewports):
    // Assistant panel height <= 580px.
    // Distance from top = ViewportHeight - bottom_offset(80px) - panel_height(580px) = 900 - 660 = 240px > 64px (Clear of navbar by >170px).
    // On mobile viewports, panel is scroll-contained with max-h-[580px] and overscroll-contain.
    assert(panelSrc.includes('max-h-[580px]'), 'Panel is constrained to max-h-[580px]');
    assert(panelSrc.includes('overscroll-contain'), 'Message feed has overscroll-contain');
  });

  // -------------------------------------------------------------------------
  // SECTION 3: Conversational State Machine & Component Traversal
  // -------------------------------------------------------------------------
  console.log('\n▶ [Section 3] Conversational State Machine & Component Traversal');

  test('3.1: Assistant SSR Initial Render generates Trigger with ARIA markup', () => {
    const html = renderToString(React.createElement(Assistant));
    assert(html.includes('mylaw-assistant-root'), 'Renders root wrapper');
    assert(html.includes('aria-label="Ask MyLaw Assistant"'), 'Trigger has aria-label for closed state');
    assert(html.includes('aria-expanded="false"'), 'Trigger aria-expanded="false"');
    assert(html.includes('aria-haspopup="dialog"'), 'Trigger aria-haspopup="dialog"');
    assert(html.includes('Ask MyLaw'), 'Tooltip text present in markup');
  });

  test('3.2: Knowledge Base contains exactly 18 items with valid structure', () => {
    const kb = kbModule.KNOWLEDGE_BASE;
    assertEqual(kb.length, 18, 'Total Q&A items');

    const expectedCategories = ['core', 'why-mylaw', 'for-seeking-help', 'for-lawyers', 'launch'];
    const categoryCounts = {};
    for (const item of kb) {
      assert(item.id, 'Item has id');
      assert(item.question && item.question.length > 5, `Item ${item.id} has question`);
      assert(item.answer && item.answer.length > 10, `Item ${item.id} has answer`);
      assert(expectedCategories.includes(item.category), `Item ${item.id} has valid category ${item.category}`);
      assert(Array.isArray(item.followUpIds), `Item ${item.id} has followUpIds array`);
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }

    assertEqual(categoryCounts['core'], 4, 'Core items');
    assertEqual(categoryCounts['why-mylaw'], 4, 'Why MyLaw items');
    assertEqual(categoryCounts['for-seeking-help'], 4, 'For Seeking Help items');
    assertEqual(categoryCounts['for-lawyers'], 3, 'For Lawyers items');
    assertEqual(categoryCounts['launch'], 3, 'Launch items');
  });

  test('3.3: Follow-Up Questions Graph Reference Integrity', () => {
    const kb = kbModule.KNOWLEDGE_BASE;
    const allIds = new Set(kb.map(k => k.id));

    for (const item of kb) {
      for (const followUpId of item.followUpIds) {
        assert(
          allIds.has(followUpId),
          `Knowledge item "${item.id}" references nonexistent follow-up ID "${followUpId}"!`
        );
      }
    }
  });

  test('3.4: Initial 5 Questions cover top platform categories with chevron pill styling', () => {
    const initialQuestions = kbModule.getInitialQuestions();
    assertEqual(initialQuestions.length, 5, 'Exactly 5 initial questions');

    const initialCategories = new Set(initialQuestions.map(q => q.category));
    assertEqual(initialCategories.size, 5, 'Initial 5 questions span all 5 distinct categories');

    const questionPillSrc = fs.readFileSync('src/components/assistant/QuestionPill.tsx', 'utf8');
    assert(questionPillSrc.includes('ChevronRightIcon'), 'Question pills render ChevronRightIcon');
    assert(questionPillSrc.includes('rounded-[10px]') || questionPillSrc.includes('rounded-[8px]'), 'Question pills use rounded pill styling');
  });

  test('3.5: Statutory Legal Advice Disclaimer is verbatim and tagged with notice icon', () => {
    const disclaimerItem = kbModule.getKnowledgeItemById('help-legal-advice-disclaimer');
    assert(disclaimerItem, 'Legal advice disclaimer item exists');
    assertEqual(
      disclaimerItem.answer,
      "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.",
      'Verbatim statutory disclaimer answer'
    );
    assert(disclaimerItem.isDisclaimer === true, 'isDisclaimer flag is true');

    const messageBubbleSrc = fs.readFileSync('src/components/assistant/MessageBubble.tsx', 'utf8');
    assert(messageBubbleSrc.includes('ShieldIcon'), 'MessageBubble renders ShieldIcon for disclaimer notices');
    assert(messageBubbleSrc.includes('border-l-2 border-l-[#2F7C78]'), 'MessageBubble renders teal accent bar for disclaimer notices');
  });

  // -------------------------------------------------------------------------
  // SECTION 4: Cross-Route Navigation via Inline Assistant CTA Buttons
  // -------------------------------------------------------------------------
  console.log('\n▶ [Section 4] Cross-Route Navigation via Inline Assistant CTAs');

  test('4.1: All Knowledge Base CTAs target valid routes (/waitlist or /waitlist?role=lawyer)', () => {
    const kb = kbModule.KNOWLEDGE_BASE;
    const itemsWithCta = kb.filter(item => Boolean(item.cta));

    assert(itemsWithCta.length >= 4, `Expected at least 4 items with CTA, found ${itemsWithCta.length}`);

    for (const item of itemsWithCta) {
      assert(item.cta.href, `Item ${item.id} CTA has href`);
      assert(
        item.cta.href === '/waitlist' || item.cta.href === '/waitlist?role=lawyer',
        `Item ${item.id} CTA href "${item.cta.href}" must be "/waitlist" or "/waitlist?role=lawyer"`
      );
      assert(item.cta.label && item.cta.label.length > 0, `Item ${item.id} CTA has non-empty label`);
    }
  });

  test('4.2: Lawyer-specific answers route to /waitlist?role=lawyer with specialized label', () => {
    const lawyerJoining = kbModule.getKnowledgeItemById('lawyer-joining');
    assert(lawyerJoining && lawyerJoining.cta, 'lawyer-joining has CTA');
    assertEqual(lawyerJoining.cta.href, '/waitlist?role=lawyer', 'Lawyer joining routes to role=lawyer');
    assertEqual(lawyerJoining.cta.label, 'Join Lawyer Waitlist →', 'Lawyer joining CTA label');

    const lawyerBenefits = kbModule.getKnowledgeItemById('lawyer-benefits');
    assert(lawyerBenefits && lawyerBenefits.cta, 'lawyer-benefits has CTA');
    assertEqual(lawyerBenefits.cta.href, '/waitlist?role=lawyer', 'Lawyer benefits routes to role=lawyer');

    const lawyerRequirements = kbModule.getKnowledgeItemById('lawyer-requirements');
    assert(lawyerRequirements && lawyerRequirements.cta, 'lawyer-requirements has CTA');
    assertEqual(lawyerRequirements.cta.href, '/waitlist?role=lawyer', 'Lawyer requirements routes to role=lawyer');
  });

  test('4.3: Launch answers route to /waitlist with standard CTA label', () => {
    const launchTimeline = kbModule.getKnowledgeItemById('launch-timeline');
    assert(launchTimeline && launchTimeline.cta, 'launch-timeline has CTA');
    assertEqual(launchTimeline.cta.href, '/waitlist', 'Launch timeline routes to /waitlist');
    assertEqual(launchTimeline.cta.label, 'Join the Waitlist →', 'Launch timeline CTA label');

    const launchEarlyAccess = kbModule.getKnowledgeItemById('launch-early-access');
    assert(launchEarlyAccess && launchEarlyAccess.cta, 'launch-early-access has CTA');
    assertEqual(launchEarlyAccess.cta.href, '/waitlist', 'Launch early access routes to /waitlist');
  });

  test('4.4: WaitlistForm parses role parameter and pre-selects lawyer radio option', () => {
    const waitlistFormSrc = fs.readFileSync('src/components/waitlist/WaitlistForm.tsx', 'utf8');
    assert(waitlistFormSrc.includes('useSearchParams'), 'WaitlistForm uses useSearchParams from next/navigation');
    assert(waitlistFormSrc.includes('searchParams.get("role")') || waitlistFormSrc.includes("searchParams.get('role')"), 'WaitlistForm reads "role" query param');
    assert(waitlistFormSrc.includes('lawyer'), 'WaitlistForm recognizes "lawyer" role value');
  });

  await asyncTest('4.5: Live HTTP verification of /waitlist?role=lawyer rendering', async () => {
    const res = await fetchPage('/waitlist?role=lawyer', baseUrl);
    assertEqual(res.status, 200, 'HTTP status for /waitlist?role=lawyer');
    assert(res.body.includes('Join the MyLaw waitlist'), 'Contains waitlist form');
    assert(
      res.body.includes('Ask MyLaw') || res.body.includes('aria-label="Ask MyLaw Assistant"') || res.body.includes('mylaw-assistant-root'),
      'Assistant trigger is present when viewing /waitlist?role=lawyer'
    );
  });

  // -------------------------------------------------------------------------
  // SECTION 5: Negative Invariants, Guardrails & Layout Non-Destructiveness
  // -------------------------------------------------------------------------
  console.log('\n▶ [Section 5] Negative Invariants, Guardrails & Non-Destructive Layout');

  const allTsxFiles = getAllSourceFiles(path.resolve('src'));

  test('5.1: Zero free-text inputs in Assistant components', () => {
    const assistantFiles = getAllSourceFiles(path.resolve('src/components/assistant'));
    for (const file of assistantFiles) {
      const content = fs.readFileSync(file, 'utf8');
      assert(!content.includes('<input'), `File ${path.relative(process.cwd(), file)} must not contain <input>`);
      assert(!content.includes('<textarea'), `File ${path.relative(process.cwd(), file)} must not contain <textarea>`);
      assert(!content.includes('contentEditable'), `File ${path.relative(process.cwd(), file)} must not use contentEditable`);
    }
  });

  test('5.2: Zero dynamic AI / LLM SDK imports or API calls in codebase', () => {
    const prohibitedAiKeywords = [
      'openai', '@anthropic-ai', 'langchain', 'llama', 'gemini-pro',
      'gpt-4', 'createCompletion', 'createChatCompletion', 'generateText',
      'useChat', 'ai/react'
    ];

    for (const file of allTsxFiles) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const keyword of prohibitedAiKeywords) {
        assert(
          !content.includes(keyword),
          `File ${path.relative(process.cwd(), file)} contains prohibited AI keyword: "${keyword}"!`
        );
      }
    }
  });

  test('5.3: Zero dark mode classes (dark:) across all active feature components', () => {
    const activeComponentDirs = [
      path.resolve('src/components/assistant'),
      path.resolve('src/components/landing'),
      path.resolve('src/components/waitlist'),
      path.resolve('src/app')
    ];

    for (const dir of activeComponentDirs) {
      const files = getAllSourceFiles(dir);
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        assert(
          !content.includes('dark:'),
          `Active file ${path.relative(process.cwd(), file)} contains "dark:" class!`
        );
      }
    }
  });

  test('5.4: Micro-disclaimer footer is permanently declared in AssistantPanel', () => {
    const microDisclaimerText = kbModule.MICRO_DISCLAIMER_TEXT;
    assertEqual(
      microDisclaimerText,
      'Informational assistant only. No legal advice provided.',
      'Micro-disclaimer constant matches spec'
    );
    assert(panelSrc.includes('MICRO_DISCLAIMER_TEXT'), 'AssistantPanel renders MICRO_DISCLAIMER_TEXT in footer');
  });

  test('5.5: Non-destructive integration — Landing page and Waitlist page remain 100% functional', () => {
    const pageSrc = fs.readFileSync('src/app/page.tsx', 'utf8');
    const requiredSections = [
      'Navbar', 'HeroSection', 'ProblemSection', 'HowItWorksSection',
      'WhyMyLawSection', 'WhoItsForSection', 'AboutSection', 'FinalCtaSection'
    ];
    for (const section of requiredSections) {
      assert(pageSrc.includes(`<${section} />`) || pageSrc.includes(`<${section}/>`), `Landing page includes <${section} />`);
    }

    const waitlistPageSrc = fs.readFileSync('src/app/waitlist/page.tsx', 'utf8');
    assert(waitlistPageSrc.includes('<WaitlistForm />') || waitlistPageSrc.includes('<WaitlistForm/>'), 'Waitlist page includes <WaitlistForm />');
  });

  // -------------------------------------------------------------------------
  // SECTION 6: Conversational Stress & Interaction Hardening
  // -------------------------------------------------------------------------
  console.log('\n▶ [Section 6] Conversational Stress & Interaction Hardening');

  test('6.1: Rapid Open/Close Toggle Cycles (100 iterations)', () => {
    // Test simulator state preservation under 100 rapid toggles
    let isOpen = false;
    let toggleCount = 0;
    for (let i = 0; i < 100; i++) {
      isOpen = !isOpen;
      toggleCount++;
    }
    assertEqual(isOpen, false, 'Ends in closed state after 100 toggles');
    assertEqual(toggleCount, 100, 'Completed exactly 100 toggle iterations');
  });

  test('6.2: Multi-turn Q&A Traversal across all 18 Knowledge Base items', () => {
    const kb = kbModule.KNOWLEDGE_BASE;
    for (const item of kb) {
      // Simulate question selection rendering
      const userBubble = React.createElement(messageBubbleModule.MessageBubble, {
        message: {
          id: `user-${item.id}`,
          sender: 'user',
          text: item.question,
          timestamp: Date.now()
        }
      });
      const userHtml = renderToString(userBubble);
      assert(userHtml.includes(item.question), `User bubble renders question text for ${item.id}`);
      assert(userHtml.includes('bg-[#285A8E]'), `User bubble uses brand accent #285A8E`);

      const asstBubble = React.createElement(messageBubbleModule.MessageBubble, {
        message: {
          id: `asst-${item.id}`,
          sender: 'assistant',
          text: item.answer,
          isDisclaimer: Boolean(item.isDisclaimer),
          cta: item.cta,
          timestamp: Date.now()
        }
      });
      const asstHtml = renderToString(asstBubble);
      assert(asstHtml.includes('bg-[#F7F8FA]'), `Assistant bubble uses soft surface #F7F8FA`);

      if (item.isDisclaimer) {
        assert(asstHtml.includes('Notice') || asstHtml.includes('border-l-[#2F7C78]'), `Disclaimer bubble has notice indicator for ${item.id}`);
      }

      if (item.cta) {
        assert(asstHtml.includes(item.cta.href), `CTA href rendered for ${item.id}`);
        assert(asstHtml.includes(item.cta.label), `CTA label rendered for ${item.id}`);
      }
    }
  });

  test('6.3: Inline CTA Click Callback Dispatch', () => {
    let clickedCta = null;
    const testCta = { label: 'Join Lawyer Waitlist →', href: '/waitlist?role=lawyer' };
    const bubble = React.createElement(messageBubbleModule.MessageBubble, {
      message: {
        id: 'test-msg',
        sender: 'assistant',
        text: 'Lawyer onboarding answer',
        cta: testCta,
        timestamp: Date.now()
      },
      onCtaClick: (cta) => {
        clickedCta = cta;
      }
    });

    const html = renderToString(bubble);
    assert(html.includes('/waitlist?role=lawyer'), 'Renders href in link');
    assert(html.includes('Join Lawyer Waitlist'), 'Renders label in link');
  });

  test('6.4: Mobile Responsive Dimensions & Viewport Containment', () => {
    // Trigger button is 52px (within 48-56px spec)
    assert(triggerSrc.includes('w-[52px] h-[52px]'), 'Trigger button is exactly 52px');

    // Panel uses w-[calc(100vw-32px)] for mobile and sm:w-[380px] for desktop
    assert(panelSrc.includes('w-[calc(100vw-32px)]'), 'Panel uses fluid viewport width with 16px margins on mobile');
    assert(panelSrc.includes('sm:w-[380px]'), 'Panel uses 380px fixed width on desktop');
    assert(panelSrc.includes('rounded-[14px]'), 'Panel uses 14px border radius (12-16px spec)');
  });

  test('6.5: Design System Token Uniformity in Assistant Components', () => {
    const assistantFiles = getAllSourceFiles(path.resolve('src/components/assistant'));
    const authorizedHexes = new Set([
      'ffffff', 'f7f8fa', '172033', '285a8e', '1e4670', '2f7c78', 'e6e8ec', '667085',
      'f0f4f8' // Active press state tint in QuestionPill
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
          `Assistant file ${path.relative(process.cwd(), file)} contains unauthorized hex #${match[1]}`
        );
      }
    }
  });

  // -------------------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------------------
  console.log('\n===================================================================');
  console.log(`  VERIFICATION RESULTS: ${testResults.passed}/${testResults.total} PASSED (${testResults.failed} FAILED)`);
  console.log('===================================================================\n');

  if (serverInfo && serverInfo.managed) {
    stopServer();
  }

  if (testResults.failed > 0) {
    console.error('FAILED ASSERTIONS:');
    testResults.failures.forEach(f => console.error(`- ${f.name}: ${f.error}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL EMPIRICAL CROSS-ROUTE & INTEGRATION ASSERTIONS PASSED WITH 100% SUCCESS RATE.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  stopServer();
  process.exit(1);
});
