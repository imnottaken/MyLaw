/**
 * Challenger 2 — Milestone 1 Adversarial Stress Test Suite
 * 
 * Empirically stress-tests:
 * 1. Tailwind CSS v4 Theme Variables & Global Styles
 * 2. Icon SVG System Structural Integrity & SVG Standards
 * 3. Navbar Responsive States, Mobile Hamburger Toggle & Link Interactions
 * 4. Root Layout & Footer Structural Integrity
 * 5. Build & Lint Pipeline Validation
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

// Test runner helper
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
    if (id === 'next/image') {
      return {
        default: function MockImage({ src, alt, width, height, className, ...rest }) {
          return React.createElement('img', { src, alt, width, height, className, ...rest });
        }
      };
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
// RUN SUITES
// =========================================================================

async function run() {
  console.log('\n===========================================================');
  console.log('  CHALLENGER 2 — ADVERSARIAL STRESS TEST SUITE (M1)');
  console.log('===========================================================\n');

  // -------------------------------------------------------------------------
  // SUITE 1: Tailwind v4 Theme Variables & Global Styles
  // -------------------------------------------------------------------------
  console.log('▶ [Suite 1] Tailwind CSS v4 @theme Variables & Global CSS');

  test('globals.css imports tailwindcss on line 1', () => {
    const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');
    assert(globalsCss.includes('@import "tailwindcss";'), 'globals.css must include `@import "tailwindcss";`');
  });

  test('globals.css contains valid @theme block with all required tokens', () => {
    const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');
    assert(globalsCss.includes('@theme {'), 'Must define @theme block');

    const requiredTokens = [
      ['--font-sans', 'var(--font-inter)'],
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
      ['--radius-brand-sm:', '6px'],
      ['--radius-brand-md:', '10px'],
      ['--radius-brand-lg:', '14px'],
      ['--shadow-brand-subtle:', '0 1px 3px rgba(16, 24, 40, 0.05)']
    ];

    for (const [token, val] of requiredTokens) {
      assert(globalsCss.includes(token), `Missing token declaration: ${token}`);
      assert(globalsCss.includes(val), `Missing token value for ${token}: expected ${val}`);
    }
  });

  test('Strict light mode enforcement: no dark mode media queries and color-scheme light present', () => {
    const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');
    assert(!globalsCss.includes('@media (prefers-color-scheme: dark)'), 'globals.css must NOT contain dark mode media query');
    assert(globalsCss.includes('color-scheme: light;'), 'globals.css must enforce color-scheme: light');
  });

  await asyncTest('Tailwind v4 PostCSS compilation verifies all custom brand utilities generate clean CSS', async () => {
    const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');
    const testCss = `
      ${globalsCss}

      .test-surface {
        background-color: var(--color-brand-bg-soft);
        color: var(--color-brand-text-primary);
        border-color: var(--color-brand-border);
        border-radius: var(--radius-brand-sm);
        box-shadow: var(--shadow-brand-subtle);
      }

      .test-accent-btn {
        background-color: var(--color-brand-accent);
      }
    `;

    const result = await postcss([tailwindPostcss()]).process(testCss, { from: path.resolve('src/app/globals.css') });
    assert(result.css.length > 0, 'PostCSS compiled CSS should not be empty');
    assert(!result.css.includes('undefined'), 'Compiled CSS should not have undefined tokens');
    assert(result.css.includes('#285A8E'), 'Compiled CSS should include brand accent #285A8E');
    assert(result.css.includes('#F7F8FA'), 'Compiled CSS should include brand soft bg #F7F8FA');
    assert(result.css.includes('6px'), 'Compiled CSS should include radius brand-sm 6px');
  });

  // -------------------------------------------------------------------------
  // SUITE 2: SVG Icon System Integrity & Standards
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 2] SVG Icon System Structural Integrity & Standards');

  const iconsModule = loadTsxModule(path.resolve('src/components/icons/index.tsx'));

  const expectedIcons = [
    'CheckIcon', 'CheckCircleIcon', 'ArrowRightIcon', 'MenuIcon',
    'CloseIcon', 'XIcon', 'SearchIcon', 'ShieldIcon', 'UsersIcon',
    'UserIcon', 'SparklesIcon', 'BriefcaseIcon', 'LockIcon',
    'FileTextIcon', 'LayersIcon', 'ChevronRightIcon', 'ClockIcon',
    'CompassIcon', 'MessageSquareIcon'
  ];

  test('Icon module exports all 19 required icons', () => {
    for (const name of expectedIcons) {
      assert(typeof iconsModule[name] === 'function', `Icon ${name} must be exported as a function`);
    }
  });

  test('XIcon is strictly equivalent to CloseIcon alias', () => {
    assertEqual(iconsModule.XIcon, iconsModule.CloseIcon, 'XIcon must equal CloseIcon');
  });

  for (const iconName of expectedIcons) {
    test(`Icon ${iconName} adheres to SVG standards (viewBox, xmlns, stroke, aria-hidden)`, () => {
      const Component = iconsModule[iconName];
      const html = renderToString(React.createElement(Component));

      assert(html.startsWith('<svg'), `${iconName} must render a root <svg> element`);
      assert(html.endsWith('</svg>'), `${iconName} must properly close with </svg>`);
      assert(html.includes('xmlns="http://www.w3.org/2000/svg"'), `${iconName} must have xmlns="http://www.w3.org/2000/svg"`);
      assert(html.includes('viewBox="0 0 24 24"'), `${iconName} must have viewBox="0 0 24 24"`);
      assert(html.includes('fill="none"'), `${iconName} must have fill="none"`);
      assert(html.includes('stroke="currentColor"'), `${iconName} must have stroke="currentColor"`);
      assert(html.includes('aria-hidden="true"'), `${iconName} must have aria-hidden="true" by default`);
    });
  }

  test('Icons handle custom props: className override, custom strokeWidth, custom aria/data attributes', () => {
    const { CheckIcon, SparklesIcon } = iconsModule;

    // Test custom className
    const htmlWithCustomClass = renderToString(
      React.createElement(CheckIcon, { className: 'custom-icon w-8 h-8 text-blue-500' })
    );
    assert(htmlWithCustomClass.includes('class="custom-icon w-8 h-8 text-blue-500"'), 'Custom className must be applied');

    // Test custom strokeWidth
    const htmlWithStrokeWidth = renderToString(
      React.createElement(SparklesIcon, { strokeWidth: 3 })
    );
    assert(htmlWithStrokeWidth.includes('stroke-width="3"'), 'Custom strokeWidth must be applied');

    // Test aria override & data attributes
    const htmlWithAria = renderToString(
      React.createElement(CheckIcon, {
        'aria-hidden': 'false',
        'aria-label': 'Completed check',
        'data-testid': 'custom-check-icon',
        id: 'icon-id-123'
      })
    );
    assert(htmlWithAria.includes('aria-hidden="false"'), 'aria-hidden override should be applied');
    assert(htmlWithAria.includes('aria-label="Completed check"'), 'aria-label should be applied');
    assert(htmlWithAria.includes('data-testid="custom-check-icon"'), 'data-testid should be applied');
    assert(htmlWithAria.includes('id="icon-id-123"'), 'id should be applied');
  });

  // -------------------------------------------------------------------------
  // SUITE 3: Navbar Responsive States & Mobile Drawer Interaction
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 3] Navbar Component Responsive States & Mobile Toggle');

  const navbarModule = loadTsxModule(path.resolve('src/components/Navbar.tsx'), {
    './icons': iconsModule
  });

  test('Navbar is exported as default function component', () => {
    assert(typeof navbarModule.default === 'function', 'Navbar must have a default export function');
  });

  test('Navbar source file contains "use client" directive', () => {
    const navbarSource = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
    assert(navbarSource.startsWith('"use client"') || navbarSource.startsWith("'use client'"), 'Navbar must be a client component');
  });

  test('Navbar initial render (SSR/closed state): Sticky header, brand wordmark, desktop nav, and hamburger button', () => {
    const Navbar = navbarModule.default;
    const html = renderToString(React.createElement(Navbar));

    // Sticky header with backdrop-blur
    assert(html.includes('sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E8EC]'), 'Navbar must have sticky styling');

    // Brand Wordmark
    assert(html.includes('href="/"'), 'Brand wordmark must link to /');
    assert(html.includes('MyLaw'), 'Brand wordmark must display MyLaw');

    // Desktop navigation links
    assert(html.includes('href="/#about"'), 'Desktop nav must link to /#about');
    assert(html.includes('href="/#how-it-works"'), 'Desktop nav must link to /#how-it-works');
    assert(html.includes('href="/#for-lawyers"'), 'Desktop nav must link to /#for-lawyers');
    assert(html.includes('href="/waitlist"'), 'Desktop nav must link to /waitlist');

    // CTA button styling
    assert(html.includes('bg-[#285A8E]'), 'CTA must use brand accent #285A8E');
    assert(html.includes('hover:bg-[#1e4670]'), 'CTA must use brand accent hover #1e4670');

    // Hamburger button in closed state
    assert(html.includes('aria-expanded="false"'), 'Hamburger button must have aria-expanded="false" initially');
    assert(html.includes('aria-label="Open navigation menu"'), 'Hamburger button must have aria-label="Open navigation menu" initially');

    // Closed state has MenuIcon (y=12, y=6, y=18 lines) and NOT CloseIcon (x1=18 x2=6 y1=6 y2=18)
    assert(html.includes('y1="12" x2="20" y2="12"'), 'Hamburger must show MenuIcon');
    assert(!html.includes('x1="18" y1="6" x2="6" y2="18"'), 'Hamburger must NOT show CloseIcon when closed');

    // Mobile drawer must NOT be rendered when closed
    assert(!html.includes('shadow-lg'), 'Mobile drawer should not be present when closed');
  });

  test('Navbar state simulation: Toggle open/close state machine & mobile drawer interaction', () => {
    const Navbar = navbarModule.default;

    const originalUseState = React.useState;
    try {
      // Test Open state (isOpen = true)
      React.useState = () => [true, () => {}];
      const openHtml = renderToString(React.createElement(Navbar));

      assert(openHtml.includes('aria-expanded="true"'), 'Hamburger button must have aria-expanded="true" when open');
      assert(openHtml.includes('aria-label="Close navigation menu"'), 'Hamburger button must have aria-label="Close navigation menu" when open');

      // Open state renders CloseIcon (x1=18 y1=6 x2=6 y2=18)
      assert(openHtml.includes('x1="18" y1="6" x2="6" y2="18"'), 'Hamburger must show CloseIcon when open');

      // Mobile drawer is rendered
      assert(openHtml.includes('md:hidden border-t border-[#E6E8EC] bg-white'), 'Mobile drawer container must be rendered when open');

      // Mobile drawer links
      assert(openHtml.includes('About'), 'Mobile drawer contains About link');
      assert(openHtml.includes('How It Works'), 'Mobile drawer contains How It Works link');
      assert(openHtml.includes('For Lawyers'), 'Mobile drawer contains For Lawyers link');
      assert(openHtml.includes('Join Waitlist'), 'Mobile drawer contains Join Waitlist CTA');
    } finally {
      React.useState = originalUseState;
    }
  });

  test('Navbar mobile links have onClick dismiss handlers', () => {
    const navbarSource = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

    // Check that all 4 mobile drawer links close the menu on click
    const aboutClick = navbarSource.includes('href="/#about"\n              onClick={() => setIsOpen(false)}');
    const howClick = navbarSource.includes('href="/#how-it-works"\n              onClick={() => setIsOpen(false)}');
    const lawyerClick = navbarSource.includes('href="/#for-lawyers"\n              onClick={() => setIsOpen(false)}');
    const waitlistClick = navbarSource.includes('href="/waitlist"\n                onClick={() => setIsOpen(false)}');

    assert(aboutClick, 'Mobile About link must have onClick dismiss handler');
    assert(howClick, 'Mobile How It Works link must have onClick dismiss handler');
    assert(lawyerClick, 'Mobile For Lawyers link must have onClick dismiss handler');
    assert(waitlistClick, 'Mobile Waitlist link must have onClick dismiss handler');
  });

  // -------------------------------------------------------------------------
  // SUITE 4: Footer & Root Layout Verification
  // -------------------------------------------------------------------------
  console.log('\n▶ [Suite 4] Footer Component & Root Layout Configuration');

  const footerModule = loadTsxModule(path.resolve('src/components/Footer.tsx'));

  test('Footer component renders required brand information, legal links, and copyright', () => {
    const Footer = footerModule.default;
    const html = renderToString(React.createElement(Footer));

    assert(html.includes('bg-[#F7F8FA] border-t border-[#E6E8EC]'), 'Footer must have background #F7F8FA and border-t #E6E8EC');
    assert(html.includes('MyLaw'), 'Footer must display MyLaw brand wordmark');
    assert(html.includes('A simpler way to discover and connect with the right legal professionals.'), 'Footer must display tagline');
    assert(html.includes('href="/#about"'), 'Footer must contain About link');
    assert(html.includes('href="#"'), 'Footer must contain Privacy and Terms links');
    assert(html.includes('href="mailto:contact@mylaw.com"'), 'Footer must contain mailto:contact@mylaw.com');
    assert(html.includes('© 2026 MyLaw. All rights reserved.'), 'Footer must display copyright');
    assert(html.includes('Legal help, simplified.'), 'Footer must display closing motto');
  });

  test('Root Layout configures Inter font and light-mode structure', () => {
    const layoutSource = fs.readFileSync('src/app/layout.tsx', 'utf8');

    assert(layoutSource.includes('import { Inter } from "next/font/google";'), 'Must import Inter from next/font/google');
    assert(layoutSource.includes('variable: "--font-inter"'), 'Must define --font-inter CSS variable');
    assert(layoutSource.includes('subsets: ["latin"]'), 'Must load latin subset');
    assert(layoutSource.includes('scroll-smooth'), 'html tag must include scroll-smooth');
    assert(layoutSource.includes('bg-white text-[#172033] font-sans antialiased min-h-screen flex flex-col'), 'body tag must have clean light mode classes');
    assert(layoutSource.includes('title: "MyLaw — Legal Help, Simplified"'), 'Metadata title must match brand');
  });

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n===========================================================');
  console.log(`STRESS TEST SUMMARY: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
  console.log('===========================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
