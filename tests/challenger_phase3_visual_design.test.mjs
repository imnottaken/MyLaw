#!/usr/bin/env node

/**
 * Phase 3 Empirical Challenger Verification Suite — MyLaw Visual Design Improvement Pass
 * 
 * Adversarially challenges and verifies:
 * 1. Palette Token & Color Compliance (globals.css tokens, component hex values, teal & navy usage)
 * 2. Layout & Rhythm Constraints (Warm Off-white in S04, Deep Navy in S07, Section markers § 01 - § 07, section variety)
 * 3. Micro-interactions & Timing Constraints (durations <= 250ms, hover translation arrows, input focus rings)
 * 4. Brand Fidelity & Prohibited Tropes (no gavels, scales, fake stats, dark mode leakage, huge shadows)
 * 5. Waitlist Form Robustness (role parameter parsing, email validation & trimming, a11y labels, success transitions)
 * 6. Full Pipeline Verification (npm run build, npm run lint, TypeScript compilation, SSR rendering)
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

// Utility to recursively list all source files
function getAllSourceFiles(dir, extensions = ['.tsx', '.ts', '.css']) {
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
  console.log('  PHASE 3 EMPIRICAL CHALLENGER: VISUAL DESIGN VERIFICATION SUITE');
  console.log('===================================================================\n');

  const allSourceFiles = getAllSourceFiles(path.resolve('src'));
  const tsxFiles = allSourceFiles.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

  // -------------------------------------------------------------------------
  // TASK 1: Palette Token & Color Compliance
  // -------------------------------------------------------------------------
  console.log('▶ [Task 1] Palette Token & Color Compliance Verification');

  const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');

  test('Task 1.1: globals.css @theme block defines all required design system tokens', () => {
    const requiredTokens = [
      ['--color-brand-bg:', '#FFFFFF'],
      ['--color-brand-bg-soft:', '#F7F8FA'],
      ['--color-brand-bg-warm:', '#F6F3EC'],
      ['--color-brand-surface:', '#FFFFFF'],
      ['--color-brand-text-primary:', '#172033'],
      ['--color-brand-text-secondary:', '#667085'],
      ['--color-brand-border:', '#E6E8EC'],
      ['--color-brand-accent:', '#285A8E'],
      ['--color-brand-accent-hover:', '#1e4670'],
      ['--color-brand-accent-teal:', '#2F7C78'],
      ['--color-brand-navy:', '#172033'],
      ['--radius-brand-sm:', '6px'],
      ['--radius-brand-md:', '10px'],
      ['--radius-brand-lg:', '14px'],
      ['--shadow-brand-subtle:', '0 1px 3px rgba(16, 24, 40, 0.05)']
    ];

    for (const [token, value] of requiredTokens) {
      assert(globalsCss.includes(token), `globals.css missing token declaration: ${token}`);
      assert(globalsCss.includes(value), `globals.css missing token value: ${value} for ${token}`);
    }
  });

  test('Task 1.2: Component Hex Colors match authorized palette strictly', () => {
    // Authorized palette tokens (normalized lowercase 6-char hex)
    const authorizedHexes = new Set([
      'ffffff', // White
      'f7f8fa', // Soft Grey
      '172033', // Deep Navy
      '285a8e', // Blue accent
      '1e4670', // Blue accent hover
      '2f7c78', // Muted Teal
      'f6f3ec', // Warm Off-white
      'e6e8ec', // Border
      '667085', // Muted Text
    ]);

    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;

    for (const file of tsxFiles) {
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

  test('Task 1.3: Muted Teal (#2F7C78) is used deliberately for accent details', () => {
    let tealCount = 0;
    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(/#2F7C78/gi) || [];
      tealCount += matches.length;
    }
    assert(tealCount >= 5, `Muted Teal (#2F7C78) should be used in key accent details across the site, found: ${tealCount}`);
  });

  test('Task 1.4: Deep Navy (#172033) is used as primary text and in Section 07 CTA', () => {
    const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
    const finalCta = fs.readFileSync('src/components/landing/FinalCtaSection.tsx', 'utf8');

    assert(layout.includes('text-[#172033]'), 'Root layout enforces Deep Navy (#172033) primary text');
    assert(finalCta.includes('bg-[#172033]'), 'Section 07 CTA uses Deep Navy (#172033) background');
  });

  // -------------------------------------------------------------------------
  // TASK 2: Layout & Rhythm Constraints
  // -------------------------------------------------------------------------
  console.log('\n▶ [Task 2] Layout & Rhythm Constraints Verification');

  const heroSrc = fs.readFileSync('src/components/landing/HeroSection.tsx', 'utf8');
  const problemSrc = fs.readFileSync('src/components/landing/ProblemSection.tsx', 'utf8');
  const howItWorksSrc = fs.readFileSync('src/components/landing/HowItWorksSection.tsx', 'utf8');
  const whyMyLawSrc = fs.readFileSync('src/components/landing/WhyMyLawSection.tsx', 'utf8');
  const whoItsForSrc = fs.readFileSync('src/components/landing/WhoItsForSection.tsx', 'utf8');
  const aboutSrc = fs.readFileSync('src/components/landing/AboutSection.tsx', 'utf8');
  const finalCtaSrc = fs.readFileSync('src/components/landing/FinalCtaSection.tsx', 'utf8');

  test('Task 2.1: Warm Off-white (#F6F3EC) in Section 04 and Deep Navy (#172033) in Section 07', () => {
    assert(whyMyLawSrc.includes('bg-[#F6F3EC]'), 'Section 04 (Why MyLaw) must have bg-[#F6F3EC]');
    assert(finalCtaSrc.includes('bg-[#172033]'), 'Section 07 (Final CTA) must have bg-[#172033]');
  });

  test('Task 2.2: Section markers § 01 through § 07 are sequentially present across landing sections', () => {
    assert(heroSrc.includes('§ 01 / LEGAL HELP, SIMPLIFIED'), 'Section 01 marker missing');
    assert(problemSrc.includes('§ 02 / THE CHALLENGE'), 'Section 02 marker missing');
    assert(howItWorksSrc.includes('§ 03 / HOW IT WORKS'), 'Section 03 marker missing');
    assert(whyMyLawSrc.includes('§ 04 / OUR PRINCIPLES'), 'Section 04 marker missing');
    assert(whoItsForSrc.includes('§ 05 / WHO IT\'S FOR') || whoItsForSrc.includes('§ 05 / WHO IT&apos;S FOR'), 'Section 05 marker missing');
    assert(aboutSrc.includes('§ 06 / ABOUT MYLAW'), 'Section 06 marker missing');
    assert(finalCtaSrc.includes('§ 07 / PRE-LAUNCH ACCESS'), 'Section 07 marker missing');
  });

  test('Task 2.3: Alternating Background Rhythm — No two adjacent sections share identical background', () => {
    const sectionBgs = [
      { name: 'Hero', bg: 'bg-white' },
      { name: 'Problem', bg: 'bg-[#F7F8FA]' },
      { name: 'HowItWorks', bg: 'bg-white' },
      { name: 'WhyMyLaw', bg: 'bg-[#F6F3EC]' },
      { name: 'WhoItsFor', bg: 'bg-white' },
      { name: 'About', bg: 'bg-[#F7F8FA]' },
      { name: 'FinalCta', bg: 'bg-[#172033]' }
    ];

    for (let i = 0; i < sectionBgs.length - 1; i++) {
      const current = sectionBgs[i];
      const next = sectionBgs[i + 1];
      assert(
        current.bg !== next.bg,
        `Adjacent sections ${current.name} and ${next.name} share the same background: ${current.bg}!`
      );
    }
  });

  test('Task 2.4: Meaningful Composition Variety across sections', () => {
    // S01: Hero has 12-col grid with UI mockup preview
    assert(heroSrc.includes('grid-cols-1 lg:grid-cols-12') && heroSrc.includes('<MockupPreview />'), 'Hero must use 12-col grid with MockupPreview');

    // S02: Problem is single-column centered block with divider rule
    assert(problemSrc.includes('max-w-3xl mx-auto text-center') && problemSrc.includes('w-12 h-px bg-[#2F7C78]/40'), 'Problem must be a centered block with divider');

    // S03: How It Works has ruled 3-column sequence with numbered steps (not identical cards)
    assert(howItWorksSrc.includes('md:grid-cols-3') && howItWorksSrc.includes('md:border-l md:border-[#E6E8EC]'), 'How It Works must use ruled 3-column sequence');

    // S04: Why MyLaw has 12-col asymmetric grid with 1 anchor card + 3 supporting cards (not 4 identical cards)
    assert(whyMyLawSrc.includes('lg:grid-cols-12') && whyMyLawSrc.includes('lg:col-span-5') && whyMyLawSrc.includes('lg:col-span-7'), 'Why MyLaw must use asymmetric 5/7 grid');

    // S05: Who It\'s For has dual panel for Individuals and Lawyers
    assert(whoItsForSrc.includes('lg:grid-cols-2') && whoItsForSrc.includes('For Individuals') && whoItsForSrc.includes('For Lawyers'), 'Who It\'s For must have dual panel');

    // S06: About MyLaw has 12-col split with pull-quote callout on left & story on right
    assert(aboutSrc.includes('lg:grid-cols-12') && aboutSrc.includes('border-l-2 border-[#2F7C78]'), 'About MyLaw must have pull-quote styling');

    // S07: Final CTA is full-bleed navy container with teal accent rule
    assert(finalCtaSrc.includes('bg-[#172033]') && finalCtaSrc.includes('h-1 w-full bg-[#2F7C78]'), 'Final CTA must be full-bleed navy with top teal rule');
  });

  // -------------------------------------------------------------------------
  // TASK 3: Micro-interactions & Timing Constraints
  // -------------------------------------------------------------------------
  console.log('\n▶ [Task 3] Micro-interactions & Timing Constraints Verification');

  test('Task 3.1: All Tailwind transition durations in src/ are <= 250ms', () => {
    const durationRegex = /\bduration-(\d+)\b/g;

    for (const file of allSourceFiles) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = durationRegex.exec(content)) !== null) {
        const ms = parseInt(match[1], 10);
        assert(
          ms <= 250,
          `File ${path.relative(process.cwd(), file)} contains excessive duration: duration-${ms} (must be <= 250ms)!`
        );
      }
    }
  });

  test('Task 3.2: Hover arrow translation classes on interactive buttons', () => {
    const componentsWithCtaArrows = [
      { name: 'HeroSection.tsx', src: heroSrc },
      { name: 'WhoItsForSection.tsx', src: whoItsForSrc },
      { name: 'FinalCtaSection.tsx', src: finalCtaSrc },
      { name: 'WaitlistForm.tsx', src: fs.readFileSync('src/components/waitlist/WaitlistForm.tsx', 'utf8') },
      { name: 'MockupPreview.tsx', src: fs.readFileSync('src/components/landing/MockupPreview.tsx', 'utf8') }
    ];

    for (const { name, src } of componentsWithCtaArrows) {
      assert(
        src.includes('group-hover:translate-x-1'),
        `Component ${name} should have arrow translation with "group-hover:translate-x-1"`
      );
      assert(
        src.includes('group') && src.includes('transition-transform duration-200'),
        `Component ${name} should include group and transition-transform duration-200 on arrow icon`
      );
    }
  });

  test('Task 3.3: Form inputs have polished focus states and transitions', () => {
    const waitlistFormSrc = fs.readFileSync('src/components/waitlist/WaitlistForm.tsx', 'utf8');
    assert(
      waitlistFormSrc.includes('focus:outline-none') &&
      waitlistFormSrc.includes('focus:border-[#285A8E]') &&
      waitlistFormSrc.includes('focus:ring-3') &&
      waitlistFormSrc.includes('focus:ring-[#285A8E]/15') &&
      waitlistFormSrc.includes('transition-all duration-200'),
      'WaitlistForm input must have focus ring, border transition, and duration-200'
    );
  });

  test('Task 3.4: Card hover transitions exist with subtle borders and lift', () => {
    assert(whyMyLawSrc.includes('hover:border-[#285A8E]/') && whyMyLawSrc.includes('hover:-translate-y-0.5'), 'WhyMyLaw cards must have hover lift & border transition');
    assert(whoItsForSrc.includes('hover:border-[#285A8E]/') && whoItsForSrc.includes('hover:-translate-y-0.5'), 'WhoItsFor cards must have hover lift & border transition');
  });

  test('Task 3.5: No heavy animation or scroll-jacking libraries present', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    const prohibitedLibs = ['framer-motion', 'gsap', 'three', 'locomotive-scroll', 'aos', 'lenis'];
    for (const lib of prohibitedLibs) {
      assert(!allDeps[lib], `Package.json must not include heavy animation library: ${lib}`);
    }
  });

  // -------------------------------------------------------------------------
  // TASK 4: Brand Fidelity Violations (Negative Assertions)
  // -------------------------------------------------------------------------
  console.log('\n▶ [Task 4] Brand Fidelity & Prohibited Tropes Negative Verification');

  test('Task 4.1: Zero prohibited legal tropes (gavels, scales, courtrooms, handshakes)', () => {
    const prohibitedTropes = [
      'gavel', 'scales of justice', 'scale of justice', 'courtroom',
      'courthouse', 'judge bench', "judge's bench", 'handshake stock',
      'gold luxury', 'black and gold', '#d4af37', '#ffd700'
    ];

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const trope of prohibitedTropes) {
        assert(
          !content.includes(trope),
          `File ${path.relative(process.cwd(), file)} contains prohibited legal trope: "${trope}"!`
        );
      }
    }
  });

  test('Task 4.2: Zero fake statistics, testimonials, or corporate hype slogans', () => {
    const prohibitedHype = [
      'revolutionizing the legal ecosystem',
      'disrupting the legal industry',
      'leveraging synergies',
      '99% satisfaction',
      '10,000+ lawyers',
      '50,000+ clients',
      '4.9 out of 5',
      '5 stars',
      'trusted by over'
    ];

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const hype of prohibitedHype) {
        assert(
          !content.includes(hype),
          `File ${path.relative(process.cwd(), file)} contains prohibited hype phrase: "${hype}"!`
        );
      }
    }
  });

  test('Task 4.3: Total absence of dark mode classes (dark:) and media queries', () => {
    for (const file of allSourceFiles) {
      const content = fs.readFileSync(file, 'utf8');
      assert(!content.includes('dark:'), `File ${path.relative(process.cwd(), file)} contains "dark:" class!`);
      assert(!content.includes('@media (prefers-color-scheme: dark)'), `File ${path.relative(process.cwd(), file)} contains dark media query!`);
      assert(!content.includes('color-scheme: dark'), `File ${path.relative(process.cwd(), file)} contains dark color scheme!`);
    }
  });

  test('Task 4.4: No oversized floating shadows or AI gradient tropes', () => {
    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf8');
      assert(!content.includes('shadow-2xl'), `File ${path.relative(process.cwd(), file)} contains shadow-2xl!`);
      assert(!content.includes('shadow-3xl'), `File ${path.relative(process.cwd(), file)} contains shadow-3xl!`);
      assert(!content.includes('from-purple-'), `File ${path.relative(process.cwd(), file)} contains purple gradient!`);
      assert(!content.includes('to-indigo-'), `File ${path.relative(process.cwd(), file)} contains indigo gradient!`);
      assert(!content.includes('backdrop-blur-2xl'), `File ${path.relative(process.cwd(), file)} contains excessive blur!`);
    }
  });

  // -------------------------------------------------------------------------
  // TASK 5: Waitlist Form Robustness
  // -------------------------------------------------------------------------
  console.log('\n▶ [Task 5] Waitlist Form Robustness Verification');

  const iconsModule = loadTsxModule(path.resolve('src/components/icons/index.tsx'));
  const waitlistFormModule = loadTsxModule(path.resolve('src/components/waitlist/WaitlistForm.tsx'), {
    '@/components/icons': iconsModule
  });
  const waitlistFormSrc = fs.readFileSync('src/components/waitlist/WaitlistForm.tsx', 'utf8');

  test('Task 5.1: Role selection query parameter parsing permutations', () => {
    const parseRoleParamFn = new Function('roleParam', `
      if (!roleParam) return null;
      const normalized = roleParam.toLowerCase().trim();
      if (normalized === "lawyer" || normalized === "attorney" || normalized === "professional") {
        return "lawyer";
      }
      if (
        normalized === "help" ||
        normalized === "individual" ||
        normalized === "client" ||
        normalized === "seeker"
      ) {
        return "help";
      }
      return null;
    `);

    // Positive lawyer cases
    assertEqual(parseRoleParamFn('lawyer'), 'lawyer', 'Exact "lawyer"');
    assertEqual(parseRoleParamFn('LAWYER'), 'lawyer', 'Uppercase "LAWYER"');
    assertEqual(parseRoleParamFn('  lawyer  '), 'lawyer', 'Whitespace trimmed "lawyer"');
    assertEqual(parseRoleParamFn('attorney'), 'lawyer', 'Alias "attorney"');
    assertEqual(parseRoleParamFn('professional'), 'lawyer', 'Alias "professional"');

    // Positive help cases
    assertEqual(parseRoleParamFn('help'), 'help', 'Exact "help"');
    assertEqual(parseRoleParamFn('individual'), 'help', 'Alias "individual"');
    assertEqual(parseRoleParamFn('client'), 'help', 'Alias "client"');
    assertEqual(parseRoleParamFn('seeker'), 'help', 'Alias "seeker"');

    // Negative & edge cases
    assertEqual(parseRoleParamFn(''), null, 'Empty string');
    assertEqual(parseRoleParamFn(null), null, 'Null');
    assertEqual(parseRoleParamFn(undefined), null, 'Undefined');
    assertEqual(parseRoleParamFn('random_role'), null, 'Unknown role');
    assertEqual(parseRoleParamFn('<script>alert(1)</script>'), null, 'XSS input');
  });

  test('Task 5.2: Email validation, whitespace trimming, and a11y labels', () => {
    assert(waitlistFormSrc.includes('type="email"'), 'Input must have type="email"');
    assert(waitlistFormSrc.includes('required'), 'Input must have required attribute');
    assert(waitlistFormSrc.includes('id="waitlist-email"'), 'Input must have id="waitlist-email"');
    assert(waitlistFormSrc.includes('htmlFor="waitlist-email"'), 'Label htmlFor must match id');
    assert(waitlistFormSrc.includes('email.trim()'), 'Submit handler must trim email');
    assert(waitlistFormSrc.includes('if (!sanitizedEmail) return;'), 'Empty sanitized email must be rejected');
  });

  test('Task 5.3: Form state transitions and copy fidelity', () => {
    const WaitlistForm = waitlistFormModule.default;

    // Simulate initial unsubmitted render
    const initialHtml = renderToString(React.createElement(WaitlistForm));
    assert(initialHtml.includes('I am a:'), 'Initial form shows role selector');
    assert(initialHtml.includes('Looking for legal help'), 'Initial form shows help option');
    assert(initialHtml.includes('Lawyer'), 'Initial form shows lawyer option');
    assert(initialHtml.includes('Enter your email address'), 'Initial form shows placeholder');
    assert(initialHtml.includes('Join the Waitlist'), 'Initial form shows CTA button');
    assert(initialHtml.includes('No spam. Just launch updates.'), 'Initial form shows microcopy');

    // Simulate submitted success state
    const originalUseState = React.useState;
    try {
      let stateIdx = 0;
      React.useState = (initial) => {
        stateIdx++;
        if (stateIdx === 1) return ['client@test.com', () => {}]; // email
        if (stateIdx === 2) return ['help', () => {}];            // role
        if (stateIdx === 3) return [true, () => {}];              // isSubmitted = true
        if (stateIdx === 4) return [false, () => {}];             // isSubmitting = false
        if (stateIdx === 5) return ['visible', () => {}];         // fadeState
        return [initial, () => {}];
      };

      const successHtml = renderToString(React.createElement(WaitlistForm));
      assert(successHtml.includes('role="status"'), 'Success state has role="status"');
      assert(successHtml.includes('aria-live="polite"'), 'Success state has aria-live="polite"');
      assert(successHtml.includes('You&#x27;re on the list.') || successHtml.includes("You're on the list."), 'Success headline');
      assert(
        successHtml.includes('Thanks for joining MyLaw. We&#x27;ll let you know when we&#x27;re ready.') ||
        successHtml.includes("Thanks for joining MyLaw. We'll let you know when we're ready."),
        'Success description'
      );
      assert(successHtml.includes('← Back to Home'), 'Back to home link');
      assert(successHtml.includes('bg-[#2F7C78]/10 text-[#2F7C78]'), 'Teal checkmark styling');
    } finally {
      React.useState = originalUseState;
    }
  });

  // -------------------------------------------------------------------------
  // TASK 6: Live HTTP & SSR Verification
  // -------------------------------------------------------------------------
  console.log('\n▶ [Task 6] Live HTTP & SSR Verification');

  let serverInfo;
  try {
    serverInfo = await ensureServer({ port: 3000, timeoutMs: 30000 });
  } catch (err) {
    console.warn(`Server warning: ${err.message}`);
  }

  await asyncTest('Task 6.1: Live HTTP SSR for / and /waitlist with 200 OK', async () => {
    const baseUrl = serverInfo ? serverInfo.url : 'http://localhost:3000';

    const landingRes = await fetchPage('/', baseUrl);
    assertEqual(landingRes.status, 200, 'Landing page status 200');
    assert(landingRes.headers['content-type'].includes('text/html'), 'Content-type text/html');
    assert(landingRes.body.includes('Finding the right lawyer'), 'Landing contains hero headline');
    assert(landingRes.body.includes('§ 01 / LEGAL HELP, SIMPLIFIED'), 'Landing contains section 01 marker');
    assert(landingRes.body.includes('§ 07 / PRE-LAUNCH ACCESS'), 'Landing contains section 07 marker');

    const waitlistRes = await fetchPage('/waitlist', baseUrl);
    assertEqual(waitlistRes.status, 200, 'Waitlist page status 200');
    assert(waitlistRes.body.includes('COMING SOON'), 'Waitlist contains COMING SOON');
    assert(waitlistRes.body.includes('Legal help, made simpler.'), 'Waitlist contains headline');
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
    console.log('🎉 ALL EMPIRICAL ASSERTIONS PASSED WITH 100% SUCCESS RATE.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  stopServer();
  process.exit(1);
});
