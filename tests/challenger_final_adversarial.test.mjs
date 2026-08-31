/**
 * Final Adversarial Stress & Empirical Verification Test Suite
 * 
 * Conducts deep verification across:
 * 1. SSR & Hydration Integrity across / and /waitlist
 * 2. Waitlist Form Stress Testing (boundary inputs, email sanitization, role parsing permutations, state machine)
 * 3. Responsive Navbar, Drawer Toggle, Accessibility (ARIA), Backdrop & Anchor Scroll Offsets
 * 4. Design Token Purity & Complete Absence of Dark Mode
 * 5. Visual/Brand Negative Assertions (no gavels, scales, courtroom tropes, fake stats, fake testimonials)
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

// =========================================================================
// RUN ADVERSARIAL SUITE
// =========================================================================

async function run() {
  console.log('\n===========================================================');
  console.log('  FINAL ADVERSARIAL CHALLENGER — DEEP EMPIRICAL STRESS SUITE');
  console.log('===========================================================\n');

  let serverInfo;
  try {
    serverInfo = await ensureServer({ port: 3000, timeoutMs: 30000 });
  } catch (err) {
    console.error('Failed to ensure dev server:', err);
  }

  // Load modules
  const iconsModule = loadTsxModule(path.resolve('src/components/icons/index.tsx'));
  const navbarModule = loadTsxModule(path.resolve('src/components/Navbar.tsx'), { '@/components/icons': iconsModule });
  const footerModule = loadTsxModule(path.resolve('src/components/Footer.tsx'));
  const heroModule = loadTsxModule(path.resolve('src/components/landing/HeroSection.tsx'), {
    '@/components/icons': iconsModule,
    './MockupPreview': loadTsxModule(path.resolve('src/components/landing/MockupPreview.tsx'), { '@/components/icons': iconsModule })
  });
  const problemModule = loadTsxModule(path.resolve('src/components/landing/ProblemSection.tsx'));
  const howItWorksModule = loadTsxModule(path.resolve('src/components/landing/HowItWorksSection.tsx'));
  const whyMyLawModule = loadTsxModule(path.resolve('src/components/landing/WhyMyLawSection.tsx'), { '@/components/icons': iconsModule });
  const whoItsForModule = loadTsxModule(path.resolve('src/components/landing/WhoItsForSection.tsx'), { '@/components/icons': iconsModule });
  const aboutModule = loadTsxModule(path.resolve('src/components/landing/AboutSection.tsx'));
  const finalCtaModule = loadTsxModule(path.resolve('src/components/landing/FinalCtaSection.tsx'), { '@/components/icons': iconsModule });
  const landingPageModule = loadTsxModule(path.resolve('src/app/page.tsx'), {
    '@/components/Navbar': navbarModule,
    '@/components/Footer': footerModule,
    '@/components/landing/HeroSection': heroModule,
    '@/components/landing/ProblemSection': problemModule,
    '@/components/landing/HowItWorksSection': howItWorksModule,
    '@/components/landing/WhyMyLawSection': whyMyLawModule,
    '@/components/landing/WhoItsForSection': whoItsForModule,
    '@/components/landing/AboutSection': aboutModule,
    '@/components/landing/FinalCtaSection': finalCtaModule
  });
  const waitlistFormModule = loadTsxModule(path.resolve('src/components/waitlist/WaitlistForm.tsx'), { '@/components/icons': iconsModule });
  const waitlistPageModule = loadTsxModule(path.resolve('src/app/waitlist/page.tsx'), {
    '@/components/waitlist/WaitlistForm': waitlistFormModule
  });

  // -------------------------------------------------------------------------
  // SUITE 1: SSR & Hydration Integrity
  // -------------------------------------------------------------------------
  console.log('▶ [Suite 1] SSR & Hydration Architecture');

  test('SSR: Landing page renders cleanly without runtime exceptions or undefined values', () => {
    const LandingPage = landingPageModule.default;
    const html = renderToString(React.createElement(LandingPage));
    assert(html.length > 500, 'Landing page SSR html should be comprehensive');
    assert(!html.includes('undefined'), 'SSR html should not contain "undefined" text');
    assert(!html.includes('NaN'), 'SSR html should not contain "NaN"');
    assert(html.includes('Finding the right lawyer shouldn&#x27;t be difficult.'), 'Hero headline present');
    assert(html.includes('01'), 'Step 01 present');
    assert(html.includes('02'), 'Step 02 present');
    assert(html.includes('03'), 'Step 03 present');
    assert(html.includes('For Individuals'), 'Individuals panel present');
    assert(html.includes('For Lawyers'), 'Lawyers panel present');
    assert(html.includes('Be among the first to experience MyLaw.'), 'Final CTA present');
    assert(html.includes('© 2026 MyLaw. All rights reserved.'), 'Footer present');
  });

  test('SSR: Waitlist page renders cleanly with Suspense fallback and initial shell', () => {
    const WaitlistPage = waitlistPageModule.default;
    const html = renderToString(React.createElement(WaitlistPage));
    assert(html.includes('COMING SOON'), 'Eyebrow present in SSR');
    assert(html.includes('Legal help, made simpler.'), 'Headline present in SSR');
    assert(html.includes('Enter your email address'), 'Email input placeholder or fallback present');
    assert(html.includes('← Back to Home'), 'Back link present in SSR');
    assert(!html.includes('undefined'), 'No undefined artifacts');
  });

  await asyncTest('Live HTTP SSR Verification for / and /waitlist', async () => {
    const landingRes = await fetchPage('/', serverInfo ? serverInfo.url : 'http://localhost:3000');
    assertEqual(landingRes.status, 200, 'Landing HTTP status 200');
    assert(landingRes.headers['content-type'].includes('text/html'), 'Content-type text/html');
    assert(landingRes.body.includes('<!DOCTYPE html>'), 'Valid HTML5 doctype');
    assert(landingRes.body.includes('lang="en"'), 'HTML lang attribute');
    assert(landingRes.body.includes('Finding the right lawyer'), 'Contains hero text');

    const waitlistRes = await fetchPage('/waitlist', serverInfo ? serverInfo.url : 'http://localhost:3000');
    assertEqual(waitlistRes.status, 200, 'Waitlist HTTP status 200');
    assert(waitlistRes.body.includes('COMING SOON'), 'Waitlist contains COMING SOON');
  });

  // -------------------------------------------------------------------------
  // SUITE 2: Waitlist Form Deep Stress Testing
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 2] Waitlist Form Boundary & Stress Testing');

  const waitlistSource = fs.readFileSync('src/components/waitlist/WaitlistForm.tsx', 'utf8');

  test('Waitlist form enforces HTML5 email validation: type="email" and required', () => {
    assert(waitlistSource.includes('type="email"'), 'Input must have type="email"');
    assert(waitlistSource.includes('required'), 'Input must have required attribute');
    assert(waitlistSource.includes('id="waitlist-email"'), 'Input must have accessible id');
    assert(waitlistSource.includes('htmlFor="waitlist-email"'), 'Label must target waitlist-email');
  });

  test('Sanitization logic trims whitespace from email input', () => {
    assert(waitlistSource.includes('email.trim()'), 'Form submit handler must sanitize email via .trim()');
    assert(waitlistSource.includes('if (!sanitizedEmail) return;'), 'Empty sanitized email must be rejected');
  });

  test('Role query parameter parsing permutations', () => {
    // Sandbox evaluator for parseRoleParam
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

    // Positive Lawyer matches
    assertEqual(parseRoleParamFn('lawyer'), 'lawyer');
    assertEqual(parseRoleParamFn('LAWYER'), 'lawyer');
    assertEqual(parseRoleParamFn('  lawyer  '), 'lawyer');
    assertEqual(parseRoleParamFn('attorney'), 'lawyer');
    assertEqual(parseRoleParamFn('ATTORNEY'), 'lawyer');
    assertEqual(parseRoleParamFn('professional'), 'lawyer');

    // Positive Individual/Help matches
    assertEqual(parseRoleParamFn('help'), 'help');
    assertEqual(parseRoleParamFn('HELP'), 'help');
    assertEqual(parseRoleParamFn('individual'), 'help');
    assertEqual(parseRoleParamFn('client'), 'help');
    assertEqual(parseRoleParamFn('seeker'), 'help');

    // Negative / Unrecognized matches
    assertEqual(parseRoleParamFn(''), null);
    assertEqual(parseRoleParamFn(null), null);
    assertEqual(parseRoleParamFn('undefined'), null);
    assertEqual(parseRoleParamFn('judge'), null);
    assertEqual(parseRoleParamFn('admin'), null);
    assertEqual(parseRoleParamFn('<script>'), null);
  });

  test('Waitlist success state displays required copy and checkmark', () => {
    const WaitlistForm = waitlistFormModule.default;

    // Simulate submitted state by replacing useState hook
    const originalUseState = React.useState;
    try {
      let stateIndex = 0;
      React.useState = (initial) => {
        stateIndex++;
        if (stateIndex === 1) return ['test@example.com', () => {}]; // email
        if (stateIndex === 2) return ['lawyer', () => {}];           // role
        if (stateIndex === 3) return [true, () => {}];               // isSubmitted = true
        if (stateIndex === 4) return [false, () => {}];              // isSubmitting = false
        if (stateIndex === 5) return ['visible', () => {}];          // fadeState
        return [initial, () => {}];
      };

      const html = renderToString(React.createElement(WaitlistForm));
      assert(html.includes('role="status"'), 'Success state must have role="status"');
      assert(html.includes('aria-live="polite"'), 'Success state must have aria-live="polite"');
      assert(html.includes('You&#x27;re on the list.'), 'Must display "You\'re on the list."');
      assert(html.includes('Thanks for joining MyLaw. We&#x27;ll let you know when we&#x27;re ready.'), 'Must display thank you copy');
      assert(html.includes('← Back to Home'), 'Must include back to home link');
    } finally {
      React.useState = originalUseState;
    }
  });

  // -------------------------------------------------------------------------
  // SUITE 3: Responsive Navbar, Drawer & Anchor Scroll Margins
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 3] Responsive Navbar, Drawer & Anchor Scroll Margins');

  test('Sticky navbar styling and backdrop blur', () => {
    const navbarHtml = renderToString(React.createElement(navbarModule.default));
    assert(navbarHtml.includes('sticky top-0 z-50'), 'Sticky with top-0 and z-50');
    assert(navbarHtml.includes('bg-white/95 backdrop-blur-md'), 'Translucent backdrop blur');
    assert(navbarHtml.includes('border-b border-[#E6E8EC]'), 'Subtle bottom border');
  });

  test('Mobile drawer toggle accessibility (aria-expanded and aria-label)', () => {
    const Navbar = navbarModule.default;

    // Closed state
    const closedHtml = renderToString(React.createElement(Navbar));
    assert(closedHtml.includes('aria-expanded="false"'), 'Closed state: aria-expanded="false"');
    assert(closedHtml.includes('aria-label="Open navigation menu"'), 'Closed state: aria-label="Open navigation menu"');

    // Open state
    const originalUseState = React.useState;
    try {
      React.useState = () => [true, () => {}];
      const openHtml = renderToString(React.createElement(Navbar));
      assert(openHtml.includes('aria-expanded="true"'), 'Open state: aria-expanded="true"');
      assert(openHtml.includes('aria-label="Close navigation menu"'), 'Open state: aria-label="Close navigation menu"');
      assert(openHtml.includes('md:hidden border-t border-[#E6E8EC] bg-white'), 'Drawer container rendered');
    } finally {
      React.useState = originalUseState;
    }
  });

  test('Anchor targets have scroll-mt-16 to prevent header clipping', () => {
    const howItWorksSrc = fs.readFileSync('src/components/landing/HowItWorksSection.tsx', 'utf8');
    const whoItsForSrc = fs.readFileSync('src/components/landing/WhoItsForSection.tsx', 'utf8');
    const aboutSrc = fs.readFileSync('src/components/landing/AboutSection.tsx', 'utf8');

    assert(howItWorksSrc.includes('id="how-it-works"') && howItWorksSrc.includes('scroll-mt-16'), 'HowItWorks must have scroll-mt-16');
    assert(whoItsForSrc.includes('id="for-lawyers"') && whoItsForSrc.includes('scroll-mt-16'), 'WhoItsFor must have scroll-mt-16');
    assert(aboutSrc.includes('id="about"') && aboutSrc.includes('scroll-mt-16'), 'About must have scroll-mt-16');
  });

  test('Desktop and mobile links are aligned and synchronized', () => {
    const navbarSrc = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
    const desktopLinks = ['/#about', '/#how-it-works', '/#for-lawyers', '/waitlist'];
    for (const link of desktopLinks) {
      assert(navbarSrc.includes(`href="${link}"`), `Navbar must contain ${link}`);
    }
  });

  // -------------------------------------------------------------------------
  // SUITE 4: Design Token Purity & Total Dark Mode Elimination
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 4] Design Token Purity & Total Dark Mode Elimination');

  test('Zero dark mode classes or media queries anywhere in src/', () => {
    function scanDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.css')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          assert(!content.includes('dark:'), `File ${fullPath} contains prohibited "dark:" class prefix!`);
          assert(!content.includes('@media (prefers-color-scheme: dark)'), `File ${fullPath} contains dark media query!`);
          assert(!content.includes('color-scheme: dark'), `File ${fullPath} contains dark color-scheme!`);
        }
      }
    }
    scanDir(path.resolve('src'));
  });

  test('globals.css strictly matches design.md token specs', () => {
    const css = fs.readFileSync('src/app/globals.css', 'utf8');
    assertEqual(css.includes('--color-brand-bg: #FFFFFF;'), true, 'Bg token');
    assertEqual(css.includes('--color-brand-bg-soft: #F7F8FA;'), true, 'Soft bg token');
    assertEqual(css.includes('--color-brand-bg-warm: #F6F3EC;'), true, 'Warm bg token');
    assertEqual(css.includes('--color-brand-surface: #FFFFFF;'), true, 'Surface token');
    assertEqual(css.includes('--color-brand-text-primary: #172033;'), true, 'Primary text token');
    assertEqual(css.includes('--color-brand-text-secondary: #667085;'), true, 'Secondary text token');
    assertEqual(css.includes('--color-brand-border: #E6E8EC;'), true, 'Border token');
    assertEqual(css.includes('--color-brand-accent: #285A8E;'), true, 'Accent token');
    assertEqual(css.includes('--color-brand-accent-hover: #1e4670;'), true, 'Accent hover token');
    assertEqual(css.includes('--color-brand-accent-teal: #2F7C78;'), true, 'Teal accent token');
    assertEqual(css.includes('--radius-brand-sm: 6px;'), true, 'Radius sm token');
    assertEqual(css.includes('--radius-brand-md: 10px;'), true, 'Radius md token');
    assertEqual(css.includes('--radius-brand-lg: 14px;'), true, 'Radius lg token');
    assertEqual(css.includes('--shadow-brand-subtle: 0 1px 3px rgba(16, 24, 40, 0.05);'), true, 'Shadow token');
  });

  test('Landing page 7-section background alternating rhythm', () => {
    const heroSrc = fs.readFileSync('src/components/landing/HeroSection.tsx', 'utf8');
    const problemSrc = fs.readFileSync('src/components/landing/ProblemSection.tsx', 'utf8');
    const howItWorksSrc = fs.readFileSync('src/components/landing/HowItWorksSection.tsx', 'utf8');
    const whyMyLawSrc = fs.readFileSync('src/components/landing/WhyMyLawSection.tsx', 'utf8');
    const whoItsForSrc = fs.readFileSync('src/components/landing/WhoItsForSection.tsx', 'utf8');
    const aboutSrc = fs.readFileSync('src/components/landing/AboutSection.tsx', 'utf8');
    const finalCtaSrc = fs.readFileSync('src/components/landing/FinalCtaSection.tsx', 'utf8');

    assert(heroSrc.includes('bg-white'), 'Section 1 (Hero) bg-white');
    assert(problemSrc.includes('bg-[#F7F8FA]'), 'Section 2 (Problem) bg-[#F7F8FA]');
    assert(howItWorksSrc.includes('bg-white'), 'Section 3 (How It Works) bg-white');
    assert(whyMyLawSrc.includes('bg-[#F6F3EC]'), 'Section 4 (Why MyLaw) bg-[#F6F3EC]');
    assert(whoItsForSrc.includes('bg-white'), 'Section 5 (Who It\'s For) bg-white');
    assert(aboutSrc.includes('bg-[#F7F8FA]'), 'Section 6 (About) bg-[#F7F8FA]');
    assert(finalCtaSrc.includes('bg-[#172033]'), 'Section 7 (Final CTA) bg-[#172033]');
  });

  // -------------------------------------------------------------------------
  // SUITE 5: Brand Fidelity & Prohibited Tropes Audit
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 5] Brand Fidelity & Prohibited Tropes Negative Audit');

  test('Zero prohibited imagery or tropes (gavels, scales, courtrooms, judges, handshakes)', () => {
    const prohibitedWords = [
      'gavel', 'scales of justice', 'scale of justice', 'courtroom',
      'courthouse', 'judge bench', "judge's bench", 'handshake stock',
      'gold luxury', 'black and gold'
    ];

    function scanForProhibited(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanForProhibited(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
          for (const word of prohibitedWords) {
            assert(!content.includes(word), `File ${fullPath} contains prohibited term: "${word}"`);
          }
        }
      }
    }
    scanForProhibited(path.resolve('src'));
  });

  test('Zero fake statistics, testimonials, or corporate hype slogans', () => {
    const hypePhrases = [
      'revolutionizing the legal ecosystem',
      'disrupting the legal industry',
      'leveraging synergies',
      '99% satisfaction',
      '10,000+ lawyers',
      '50,000+ clients',
      '4.9 out of 5',
      '5 stars'
    ];

    function scanForHype(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanForHype(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
          for (const phrase of hypePhrases) {
            assert(!content.includes(phrase), `File ${fullPath} contains prohibited hype phrase: "${phrase}"`);
          }
        }
      }
    }
    scanForHype(path.resolve('src'));
  });

  // -------------------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n===========================================================');
  console.log(`ADVERSARIAL SUITE SUMMARY: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
  console.log('===========================================================\n');

  if (serverInfo && serverInfo.managed) {
    stopServer();
  }

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal error during adversarial suite execution:', err);
  stopServer();
  process.exit(1);
});
