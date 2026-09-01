#!/usr/bin/env node

/**
 * Challenger 2 — Milestone M3 Empirical Verification Suite
 * Focus: Visual Non-Regression, Layout Stability, Font Configurations & Static Prerendering
 *
 * Targets:
 * - src/app/layout.tsx
 * - src/app/page.tsx
 * - src/app/waitlist/page.tsx
 * - src/app/globals.css
 * - src/components/assistant/*
 * - Production build & static route prerender artifacts (.next/server/app/)
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ensureServer, stopServer, fetchPage } from './e2e/helpers/http-client.mjs';

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
    if (id === 'next/image') {
      return {
        default: function MockImage({ src, alt, width, height, className, fill, ...rest }) {
          return React.createElement('img', { src, alt, width, height, className, ...rest });
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
// MAIN RUNNER
// =========================================================================

async function main() {
  console.log('\n===================================================================');
  console.log('  CHALLENGER 2 — MILESTONE M3 EMPIRICAL NON-REGRESSION & BUILD SUITE');
  console.log('===================================================================\n');

  const layoutSrc = fs.readFileSync('src/app/layout.tsx', 'utf8');
  const pageSrc = fs.readFileSync('src/app/page.tsx', 'utf8');
  const waitlistSrc = fs.readFileSync('src/app/waitlist/page.tsx', 'utf8');
  const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');

  // Load Assistant Component
  const iconsModule = loadTsxModule(path.resolve('src/components/icons/index.tsx'));
  const kbModule = loadTsxModule(path.resolve('src/components/assistant/data/knowledge-base.ts'));
  const triggerModule = loadTsxModule(path.resolve('src/components/assistant/AssistantTrigger.tsx'), {
    '@/components/icons': iconsModule
  });
  const bubbleModule = loadTsxModule(path.resolve('src/components/assistant/MessageBubble.tsx'), {
    '@/components/icons': iconsModule
  });
  const pillModule = loadTsxModule(path.resolve('src/components/assistant/QuestionPill.tsx'), {
    '@/components/icons': iconsModule
  });
  const panelModule = loadTsxModule(path.resolve('src/components/assistant/AssistantPanel.tsx'), {
    '@/components/icons': iconsModule,
    './MessageBubble': bubbleModule,
    './QuestionPill': pillModule,
    './data/knowledge-base': kbModule
  });
  const assistantModule = loadTsxModule(path.resolve('src/components/assistant/Assistant.tsx'), {
    './data/knowledge-base': kbModule,
    './AssistantTrigger': triggerModule,
    './AssistantPanel': panelModule
  });
  const Assistant = assistantModule.default;

  // -------------------------------------------------------------------------
  // SUITE 1: Layout Hierarchy & Non-Destructive Mounting in layout.tsx
  // -------------------------------------------------------------------------
  console.log('▶ [Suite 1] Global Layout Hierarchy & Non-Destructive Mounting');

  test('1.1 RootLayout imports Assistant from "@/components/assistant"', () => {
    assert(
      layoutSrc.includes('import { Assistant } from "@/components/assistant"') ||
      layoutSrc.includes("import { Assistant } from '@/components/assistant'"),
      'layout.tsx must import Assistant from "@/components/assistant"'
    );
  });

  test('1.2 <Assistant /> is mounted as a direct sibling of {children} inside <body>', () => {
    assert(
      layoutSrc.includes('{children}\n        <Assistant />') ||
      layoutSrc.includes('{children}\n      <Assistant />') ||
      layoutSrc.includes('{children}<Assistant />') ||
      layoutSrc.includes('{children}\n        <Assistant />\n      </body>'),
      'layout.tsx must mount <Assistant /> after {children} inside <body>'
    );
  });

  test('1.3 Body maintains clean flex-col structure without intrusive wrapper containers', () => {
    assert(
      layoutSrc.includes('className="bg-[#172033] text-[#172033] font-sans antialiased min-h-screen flex flex-col overscroll-none"'),
      'Body element must maintain original class attributes'
    );
  });

  test('1.4 Assistant root container uses .mylaw-assistant-root with zero document-flow footprint', () => {
    const rendered = renderToString(React.createElement(Assistant));
    assert(rendered.includes('mylaw-assistant-root'), 'Assistant rendered markup contains .mylaw-assistant-root');
    
    // Check that AssistantTrigger uses fixed positioning
    const triggerSrc = fs.readFileSync('src/components/assistant/AssistantTrigger.tsx', 'utf8');
    assert(
      triggerSrc.includes('fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50'),
      'AssistantTrigger must be fixed positioned to avoid pushing main content'
    );
  });

  test('1.5 AssistantPanel uses fixed positioning with responsive z-index z-50', () => {
    const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');
    assert(
      panelSrc.includes('fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50'),
      'AssistantPanel must be fixed positioned with z-50'
    );
  });

  // -------------------------------------------------------------------------
  // SUITE 2: Section Preservation & Grid Stability on Homepage (/)
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 2] Homepage (/) Section Preservation & Grid Stability');

  const heroSrc = fs.readFileSync('src/components/landing/HeroSection.tsx', 'utf8');
  const problemSrc = fs.readFileSync('src/components/landing/ProblemSection.tsx', 'utf8');
  const howItWorksSrc = fs.readFileSync('src/components/landing/HowItWorksSection.tsx', 'utf8');
  const whyMyLawSrc = fs.readFileSync('src/components/landing/WhyMyLawSection.tsx', 'utf8');
  const whoItsForSrc = fs.readFileSync('src/components/landing/WhoItsForSection.tsx', 'utf8');
  const aboutSrc = fs.readFileSync('src/components/landing/AboutSection.tsx', 'utf8');
  const finalCtaSrc = fs.readFileSync('src/components/landing/FinalCtaSection.tsx', 'utf8');

  test('2.1 Home page renders Navbar and all 7 sections in exact sequential order', () => {
    const expectedSections = [
      '<Navbar />',
      '<HeroSection />',
      '<ProblemSection />',
      '<HowItWorksSection />',
      '<WhyMyLawSection />',
      '<WhoItsForSection />',
      '<AboutSection />',
      '<FinalCtaSection />'
    ];

    let lastIndex = 0;
    for (const sec of expectedSections) {
      const idx = pageSrc.indexOf(sec, lastIndex);
      assert(idx !== -1, `Home page must contain section ${sec} in sequence`);
      lastIndex = idx;
    }
  });

  test('2.2 Section markers § 01 to § 07 are strictly intact and unchanged', () => {
    const markers = [
      { name: 'S01 Hero', src: heroSrc, marker: '§ 01 / LEGAL HELP, SIMPLIFIED' },
      { name: 'S02 Problem', src: problemSrc, marker: '§ 02 / THE CHALLENGE' },
      { name: 'S03 How It Works', src: howItWorksSrc, marker: '§ 03 / HOW IT WORKS' },
      { name: 'S04 Why MyLaw', src: whyMyLawSrc, marker: '§ 04 / OUR PRINCIPLES' },
      { name: 'S05 Who Its For', src: whoItsForSrc, marker: '§ 05 / WHO IT' },
      { name: 'S06 About', src: aboutSrc, marker: '§ 06 / ABOUT MYLAW' },
      { name: 'S07 Final CTA', src: finalCtaSrc, marker: '§ 07 / PRE-LAUNCH ACCESS' }
    ];

    for (const { name, src, marker } of markers) {
      assert(src.includes(marker), `${name} marker missing or altered: ${marker}`);
    }
  });

  test('2.3 Grid layouts and structural containers across landing sections are completely preserved', () => {
    // S01: Hero full-bleed container with max-w-6xl centered content
    assert(heroSrc.includes('max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'), 'Hero must retain max-w-6xl container');
    assert(heroSrc.includes('max-w-3xl'), 'Hero must retain max-w-3xl content width');

    // S02: Problem centered container
    assert(problemSrc.includes('max-w-3xl mx-auto text-center'), 'Problem must retain centered container');

    // S03: How It Works 3-col grid
    assert(howItWorksSrc.includes('grid-cols-1 md:grid-cols-3'), 'HowItWorks must retain 3-column grid');

    // S04: Why MyLaw 12-col asymmetric grid
    assert(whyMyLawSrc.includes('grid-cols-1 lg:grid-cols-12'), 'WhyMyLaw must retain 12-column grid');
    assert(whyMyLawSrc.includes('lg:col-span-5') && whyMyLawSrc.includes('lg:col-span-7'), 'WhyMyLaw must retain 5/7 column span');

    // S05: Who Its For dual-panel grid
    assert(whoItsForSrc.includes('grid-cols-1 lg:grid-cols-2'), 'WhoItsFor must retain 2-column split grid');

    // S06: About 12-col split grid
    assert(aboutSrc.includes('grid-cols-1 lg:grid-cols-12'), 'AboutSection must retain 12-column split grid');

    // S07: Final CTA full bleed navy container
    assert(finalCtaSrc.includes('bg-[#172033]'), 'FinalCta must retain navy background');
  });

  // -------------------------------------------------------------------------
  // SUITE 3: Waitlist Page Layout & Responsive Grid Preservation
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 3] Waitlist Page (/waitlist) Stability & Grid Preservation');

  test('3.1 Waitlist page retains 12-column asymmetric split (7 left, 5 right)', () => {
    assert(waitlistSrc.includes('grid-cols-1 lg:grid-cols-12'), 'Waitlist must retain 12-column grid');
    assert(waitlistSrc.includes('lg:col-span-7'), 'Waitlist hero must retain lg:col-span-7');
    assert(waitlistSrc.includes('lg:col-span-5'), 'Waitlist card must retain lg:col-span-5');
  });

  test('3.2 Waitlist page retains multi-layered cinematic dark background stack', () => {
    assert(waitlistSrc.includes('-z-30'), 'Waitlist contains -z-30 background image layer');
    assert(waitlistSrc.includes('-z-20'), 'Waitlist contains -z-20 dark navy overlay');
    assert(waitlistSrc.includes('-z-15'), 'Waitlist contains -z-15 color tint layer');
    assert(waitlistSrc.includes('-z-10'), 'Waitlist contains -z-10 radial vignette layers');
  });

  test('3.3 Waitlist page header retains sticky top-0 and z-30 with back link', () => {
    assert(waitlistSrc.includes('sticky top-0 z-30'), 'Waitlist header retains sticky top-0 z-30');
    assert(waitlistSrc.includes('href="/"'), 'Waitlist header contains link back to home');
  });

  // -------------------------------------------------------------------------
  // SUITE 4: Font Configurations & Typography Scale Verification
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 4] Font Configurations & Typography Scale Verification');

  test('4.1 Inter and Geist fonts are imported and configured with CSS variables', () => {
    assert(layoutSrc.includes('import { Inter, Geist } from "next/font/google"'), 'Google fonts Inter & Geist imported');
    assert(layoutSrc.includes("'--font-sans'") || layoutSrc.includes('"--font-sans"'), 'Geist configured with --font-sans');
    assert(layoutSrc.includes("'--font-inter'") || layoutSrc.includes('"--font-inter"'), 'Inter configured with --font-inter');
  });

  test('4.2 <html> element injects both font variables into class attribute', () => {
    assert(layoutSrc.includes('inter.variable'), 'inter.variable injected into html');
    assert(layoutSrc.includes('geist.variable'), 'geist.variable injected into html');
    assert(layoutSrc.includes('font-sans'), 'font-sans injected into html');
  });

  test('4.3 globals.css defines font-sans with --font-inter as primary fallback', () => {
    assert(
      globalsCss.includes('--font-sans: var(--font-inter)'),
      'globals.css defines --font-sans using var(--font-inter)'
    );
  });

  // -------------------------------------------------------------------------
  // SUITE 5: Stacking Context Hierarchy & Occlusion Safety
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 5] Stacking Context Hierarchy & Occlusion Safety');

  test('5.1 Assistant trigger is z-50 and does not occlude or intercept pointer events when idle', () => {
    const triggerSrc = fs.readFileSync('src/components/assistant/AssistantTrigger.tsx', 'utf8');
    assert(triggerSrc.includes('z-50'), 'Trigger uses z-50');
    assert(triggerSrc.includes('pointer-events-none select-none'), 'Tooltip uses pointer-events-none');
  });

  test('5.2 When closed, AssistantPanel returns null with 0px layout box', () => {
    const closedHtml = renderToString(React.createElement(Assistant));
    assert(!closedHtml.includes('role="dialog"'), 'Closed assistant does not render dialog markup');
    assert(!closedHtml.includes('<section'), 'Closed assistant does not render section dialog');
  });

  test('5.3 AssistantPanel dimensions fit mobile viewports without horizontal scrollbar trigger', () => {
    const panelSrc = fs.readFileSync('src/components/assistant/AssistantPanel.tsx', 'utf8');
    assert(panelSrc.includes('w-[calc(100vw-32px)]'), 'Mobile width is 100vw minus 32px padding');
    assert(panelSrc.includes('right-4'), 'Right margin is 16px mobile');
    assert(panelSrc.includes('sm:right-6'), 'Right margin is 24px desktop');
    assert(panelSrc.includes('sm:w-[380px]'), 'Desktop width is constrained to 380px');
  });

  // -------------------------------------------------------------------------
  // SUITE 6: Production Build & Static Prerender Artifacts Verification
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 6] Production Build & Static Prerender Artifacts Verification');

  test('6.1 Static route prerender outputs exist in .next/server/app/', () => {
    const appDir = path.resolve('.next/server/app');
    assert(fs.existsSync(path.join(appDir, 'index.html')), '.next/server/app/index.html must exist');
    assert(fs.existsSync(path.join(appDir, 'waitlist.html')), '.next/server/app/waitlist.html must exist');
    assert(fs.existsSync(path.join(appDir, '_not-found.html')), '.next/server/app/_not-found.html must exist');
  });

  test('6.2 Static index.html contains prerendered Assistant root and trigger button', () => {
    const indexHtml = fs.readFileSync('.next/server/app/index.html', 'utf8');
    assert(indexHtml.includes('mylaw-assistant-root'), 'index.html contains mylaw-assistant-root');
    assert(indexHtml.includes('Ask MyLaw Assistant'), 'index.html contains Ask MyLaw Assistant button');
    assert(indexHtml.includes('Ask MyLaw'), 'index.html contains Ask MyLaw tooltip text');
  });

  test('6.3 Static waitlist.html contains prerendered Assistant root and trigger button', () => {
    const waitlistHtml = fs.readFileSync('.next/server/app/waitlist.html', 'utf8');
    assert(waitlistHtml.includes('mylaw-assistant-root'), 'waitlist.html contains mylaw-assistant-root');
    assert(waitlistHtml.includes('Ask MyLaw Assistant'), 'waitlist.html contains Ask MyLaw Assistant button');
    assert(waitlistHtml.includes('Join the MyLaw waitlist'), 'waitlist.html contains waitlist form heading');
  });

  test('6.4 Prerendered HTML files are complete and valid static pages', () => {
    const indexHtml = fs.readFileSync('.next/server/app/index.html', 'utf8');
    const waitlistHtml = fs.readFileSync('.next/server/app/waitlist.html', 'utf8');

    assert(indexHtml.startsWith('<!DOCTYPE html>'), 'index.html starts with DOCTYPE');
    assert(waitlistHtml.startsWith('<!DOCTYPE html>'), 'waitlist.html starts with DOCTYPE');
    assert(indexHtml.includes('<html'), 'index.html has <html');
    assert(waitlistHtml.includes('<html'), 'waitlist.html has <html');
  });

  // -------------------------------------------------------------------------
  // SUITE 7: Live HTTP Server Verification
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 7] Live HTTP Server Verification');

  let serverInfo;
  try {
    serverInfo = await ensureServer({ port: 3000, timeoutMs: 30000 });
  } catch (err) {
    console.warn(`Server warning: ${err.message}`);
  }

  await asyncTest('7.1 Live HTTP GET / returns 200 with complete HTML and mounted Assistant', async () => {
    const baseUrl = serverInfo ? serverInfo.url : 'http://localhost:3000';
    const res = await fetchPage('/', baseUrl);

    assertEqual(res.status, 200, 'HTTP GET / status is 200');
    assert(res.body.includes('<!DOCTYPE html>'), 'Response is valid HTML');
    assert(res.body.includes('mylaw-assistant-root'), 'Response contains mylaw-assistant-root');
    assert(res.body.includes('Finding the right lawyer'), 'Response contains Hero headline');
    assert(res.body.includes('§ 01 / LEGAL HELP, SIMPLIFIED'), 'Response contains S01 marker');
    assert(res.body.includes('§ 07 / PRE-LAUNCH ACCESS'), 'Response contains S07 marker');
  });

  await asyncTest('7.2 Live HTTP GET /waitlist returns 200 with complete HTML and mounted Assistant', async () => {
    const baseUrl = serverInfo ? serverInfo.url : 'http://localhost:3000';
    const res = await fetchPage('/waitlist', baseUrl);

    assertEqual(res.status, 200, 'HTTP GET /waitlist status is 200');
    assert(res.body.includes('<!DOCTYPE html>'), 'Response is valid HTML');
    assert(res.body.includes('mylaw-assistant-root'), 'Response contains mylaw-assistant-root');
    assert(res.body.includes('COMING SOON / 01'), 'Response contains COMING SOON badge');
    assert(res.body.includes('Join the MyLaw waitlist'), 'Response contains waitlist form heading');
  });

  // -------------------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------------------
  console.log('\n===================================================================');
  console.log(`  VERIFICATION RESULTS: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
  console.log('===================================================================\n');

  if (serverInfo && serverInfo.managed) {
    stopServer();
  }

  if (results.failed > 0) {
    console.error('FAILED ASSERTIONS:');
    results.failures.forEach(f => console.error(`- ${f.name}: ${f.error}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL EMPIRICAL NON-REGRESSION & BUILD ASSERTIONS PASSED (100%).');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  stopServer();
  process.exit(1);
});
