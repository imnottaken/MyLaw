import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

console.log('====================================================');
console.log('   EMPIRICAL CHALLENGER: MILESTONE 1 TEST SUITE     ');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
    failCount++;
  }
}

const rootDir = process.cwd();

// ----------------------------------------------------
// Test 1: globals.css tokens and dark mode exclusion
// ----------------------------------------------------
test('globals.css - No dark mode styles or media queries', () => {
  const css = fs.readFileSync(path.join(rootDir, 'src/app/globals.css'), 'utf8');
  assert(!css.includes('@media (prefers-color-scheme: dark)'), 'Contains prefers-color-scheme: dark');
  assert(!css.includes('prefers-color-scheme'), 'Contains prefers-color-scheme');
  assert(!css.toLowerCase().includes('dark'), 'Contains dark keyword');
  assert(css.includes('color-scheme: light;'), 'Missing color-scheme: light on root/html');
});

test('globals.css - Design tokens match design.md exactly', () => {
  const css = fs.readFileSync(path.join(rootDir, 'src/app/globals.css'), 'utf8');
  const requiredTokens = [
    ['--font-sans', 'var(--font-inter)'],
    ['--color-brand-bg', '#FFFFFF'],
    ['--color-brand-bg-soft', '#F7F8FA'],
    ['--color-brand-bg-warm', '#F6F3EC'],
    ['--color-brand-surface', '#FFFFFF'],
    ['--color-brand-text-primary', '#172033'],
    ['--color-brand-text-secondary', '#667085'],
    ['--color-brand-border', '#E6E8EC'],
    ['--color-brand-accent', '#285A8E'],
    ['--color-brand-accent-hover', '#1e4670'],
    ['--color-brand-accent-teal', '#2F7C78'],
    ['--radius-brand-sm', '6px'],
    ['--radius-brand-md', '10px'],
    ['--radius-brand-lg', '14px'],
    ['--shadow-brand-subtle', '0 1px 3px rgba(16, 24, 40, 0.05)']
  ];

  for (const [token, value] of requiredTokens) {
    assert(css.includes(token), `Missing token: ${token}`);
    assert(css.includes(value), `Token ${token} does not contain expected value: ${value}`);
  }
});

// ----------------------------------------------------
// Test 2: layout.tsx Inter font & clean metadata
// ----------------------------------------------------
test('layout.tsx - Inter Google font configuration', () => {
  const layout = fs.readFileSync(path.join(rootDir, 'src/app/layout.tsx'), 'utf8');
  assert(layout.includes('import { Inter } from "next/font/google"'), 'Missing Inter import from next/font/google');
  assert(layout.includes('variable: "--font-inter"'), 'Missing variable: "--font-inter"');
  assert(layout.includes('subsets: ["latin"]'), 'Missing latin subset');
  assert(layout.includes('inter.variable'), 'inter.variable not attached to html element');
});

test('layout.tsx - Clean metadata and body styles', () => {
  const layout = fs.readFileSync(path.join(rootDir, 'src/app/layout.tsx'), 'utf8');
  assert(layout.includes('MyLaw — Legal Help, Simplified'), 'Title does not match expected brand title');
  assert(layout.includes('A simpler way to discover and connect with the right legal professionals.'), 'Description does not match brand description');
  assert(layout.includes('bg-white'), 'Missing bg-white on body');
  assert(layout.includes('text-[#172033]'), 'Missing text-[#172033] on body');
  assert(layout.includes('font-sans'), 'Missing font-sans on body');
});

// ----------------------------------------------------
// Test 3: Navbar.tsx links, responsive drawer, accessibility
// ----------------------------------------------------
test('Navbar.tsx - Desktop links & Brand Wordmark', () => {
  const navbar = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.tsx'), 'utf8');
  assert(navbar.includes('href="/"'), 'Missing home link on wordmark');
  assert(navbar.includes('MyLaw'), 'Missing MyLaw wordmark');
  assert(navbar.includes('href="/#about"'), 'Missing About link (/#about)');
  assert(navbar.includes('href="/#how-it-works"'), 'Missing How It Works link (/#how-it-works)');
  assert(navbar.includes('href="/#for-lawyers"'), 'Missing For Lawyers link (/#for-lawyers)');
  assert(navbar.includes('href="/waitlist"'), 'Missing Join Waitlist link (/waitlist)');
  assert(navbar.includes('bg-[#285A8E]'), 'CTA missing primary brand blue bg-[#285A8E]');
  assert(navbar.includes('hover:bg-[#1e4670]'), 'CTA missing hover blue hover:bg-[#1e4670]');
  assert(navbar.includes('rounded-[6px]'), 'CTA missing small border radius rounded-[6px]');
});

test('Navbar.tsx - Mobile drawer toggle & accessibility attributes', () => {
  const navbar = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.tsx'), 'utf8');
  assert(navbar.includes('aria-expanded={isOpen}'), 'Missing aria-expanded on mobile menu button');
  assert(navbar.includes('aria-label='), 'Missing aria-label on mobile menu button');
  assert(navbar.includes('setIsOpen(!isOpen)') || navbar.includes('setIsOpen((prev) => !prev)'), 'Missing toggle handler');
  assert(navbar.includes('CloseIcon') && navbar.includes('MenuIcon'), 'Missing Menu/Close icon toggle');
});

// ----------------------------------------------------
// Test 4: Footer.tsx layout, links, copyright
// ----------------------------------------------------
test('Footer.tsx - Brand, Tagline, Navigation, Legal & Copyright', () => {
  const footer = fs.readFileSync(path.join(rootDir, 'src/components/Footer.tsx'), 'utf8');
  assert(footer.includes('bg-[#F7F8FA]'), 'Footer missing soft background #F7F8FA');
  assert(footer.includes('border-t border-[#E6E8EC]'), 'Footer missing top border #E6E8EC');
  assert(footer.includes('MyLaw'), 'Footer missing MyLaw brand');
  assert(footer.includes('A simpler way to discover and connect with the right legal professionals.'), 'Footer missing tagline');
  assert(footer.includes('href="/#about"'), 'Footer missing About link');
  assert(footer.includes('href="#"') || footer.includes('Privacy'), 'Footer missing Privacy link');
  assert(footer.includes('href="#"') || footer.includes('Terms'), 'Footer missing Terms link');
  assert(footer.includes('mailto:contact@mylaw.com'), 'Footer missing Contact mailto');
  assert(footer.includes('© 2026 MyLaw. All rights reserved.'), 'Footer missing exact copyright statement');
  assert(footer.includes('Legal help, simplified.'), 'Footer missing secondary motto');
});

// ----------------------------------------------------
// Test 5: Icon system completeness & SVG attributes
// ----------------------------------------------------
test('icons/index.tsx - Required icons and SVG accessibility', () => {
  const icons = fs.readFileSync(path.join(rootDir, 'src/components/icons/index.tsx'), 'utf8');
  const expectedIcons = [
    'CheckIcon',
    'CheckCircleIcon',
    'ArrowRightIcon',
    'MenuIcon',
    'CloseIcon',
    'SearchIcon',
    'ShieldIcon',
    'UsersIcon',
    'UserIcon',
    'SparklesIcon',
    'BriefcaseIcon',
    'LockIcon',
    'FileTextIcon',
    'LayersIcon',
    'ChevronRightIcon',
    'ClockIcon',
    'CompassIcon',
    'MessageSquareIcon'
  ];

  for (const iconName of expectedIcons) {
    assert(icons.includes(`export function ${iconName}`) || icons.includes(`export const ${iconName}`), `Missing icon export: ${iconName}`);
  }
  assert(icons.includes('aria-hidden="true"'), 'Icons missing aria-hidden="true"');
  assert(icons.includes('viewBox="0 0 24 24"'), 'Icons missing standard viewBox');
});

console.log(`\n====================================================`);
console.log(`Test Summary: ${passCount} passed, ${failCount} failed`);
console.log(`====================================================`);

if (failCount > 0) {
  process.exit(1);
}
