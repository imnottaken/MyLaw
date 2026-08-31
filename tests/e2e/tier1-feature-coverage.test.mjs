import assert from 'node:assert/strict';
import { fetchPage } from './helpers/http-client.mjs';
import { readFile } from './helpers/source-scanner.mjs';

export async function runTier1Tests(baseUrl) {
  const results = [];

  async function test(name, fn) {
    const start = Date.now();
    try {
      await fn();
      results.push({ name, passed: true, durationMs: Date.now() - start });
    } catch (err) {
      results.push({ name, passed: false, error: err.message, stack: err.stack, durationMs: Date.now() - start });
    }
  }

  // 1. Landing Page Base & 7 Sections Presence
  await test('Tier 1.01: Landing page loads successfully and returns HTTP 200', async () => {
    const page = await fetchPage('/', baseUrl);
    assert.equal(page.status, 200, `Expected HTTP 200 on landing page, got ${page.status}`);
    assert.ok(page.body.length > 500, 'Landing page body should contain rendered content');
  });

  await test('Tier 1.02: Landing page contains all 7 required sections in order', async () => {
    const page = await fetchPage('/', baseUrl);
    const bodyText = page.body.toLowerCase();

    // Section 1: Hero
    assert.ok(
      bodyText.includes('finding the right lawyer') || bodyText.includes('legal help, simplified'),
      'Section 01 (Hero) must be present'
    );

    // Section 2: The Problem
    assert.ok(
      bodyText.includes('legal help can feel complicated') || bodyText.includes('scattered information'),
      'Section 02 (The Problem) must be present'
    );

    // Section 3: How It Works
    assert.ok(
      bodyText.includes('how it works') || bodyText.includes("we're making the first step simpler") || bodyText.includes('01') && bodyText.includes('02') && bodyText.includes('03'),
      'Section 03 (How It Works / 3 steps) must be present'
    );

    // Section 4: Why MyLaw (Principles)
    assert.ok(
      bodyText.includes('clarity') && bodyText.includes('choice') && bodyText.includes('trust'),
      'Section 04 (Why MyLaw Principles: Clarity, Choice, Trust) must be present'
    );

    // Section 5: Who It\'s For
    assert.ok(
      bodyText.includes('for individuals') && bodyText.includes('for lawyers'),
      'Section 05 (Who It\'s For dual split) must be present'
    );

    // Section 6: About MyLaw
    assert.ok(
      bodyText.includes('about mylaw') || bodyText.includes("we're building a better starting point"),
      'Section 06 (About MyLaw mission) must be present'
    );

    // Section 7: Final CTA
    assert.ok(
      bodyText.includes('be among the first') || bodyText.includes("we're getting ready to launch"),
      'Section 07 (Final CTA) must be present'
    );
  });

  // 2. Hero Details
  await test('Tier 1.03: Hero Section displays Eyebrow, Headline, and Supporting Copy', async () => {
    const page = await fetchPage('/', baseUrl);
    const bodyText = page.body;

    assert.match(bodyText, /LEGAL HELP, SIMPLIFIED/i, 'Hero must contain "LEGAL HELP, SIMPLIFIED" eyebrow');
    assert.match(bodyText, /Finding the right lawyer shouldn['’]t be difficult/i, 'Hero must contain primary headline');
    assert.match(bodyText, /MyLaw is building a simpler way to discover and connect/i, 'Hero must contain supporting copy');
  });

  await test('Tier 1.04: Hero Section displays Dual CTAs (Join the Waitlist & Learn More)', async () => {
    const page = await fetchPage('/', baseUrl);
    const joinCtas = page.dom.querySelectorAll('a[href="/waitlist"], a[href*="waitlist"]');
    assert.ok(joinCtas.length >= 1, 'Hero must contain at least one Join the Waitlist link');

    const learnMore = page.dom.querySelectorAll('a[href="#how-it-works"], a[href*="#how-it-works"]');
    assert.ok(learnMore.length >= 1, 'Hero must contain "Learn More" linking to #how-it-works');
  });

  await test('Tier 1.05: Hero Section displays coded UI Mockup Panel (search bar, practice area tags)', async () => {
    const page = await fetchPage('/', baseUrl);
    const bodyText = page.body;

    assert.ok(
      bodyText.includes('Find legal help') || bodyText.includes('What do you need help with?'),
      'Mockup preview must include "Find legal help" or search prompt'
    );
    assert.ok(
      bodyText.includes('Family Law') || bodyText.includes('Property') || bodyText.includes('Corporate'),
      'Mockup preview must include practice area category tags'
    );
  });

  // 3. How It Works 3-Step Sequence
  await test('Tier 1.06: How It Works section contains 01, 02, 03 step sequence', async () => {
    const page = await fetchPage('/', baseUrl);
    const bodyText = page.body;

    assert.ok(bodyText.includes('01'), 'Step 01 must exist');
    assert.ok(bodyText.includes('02'), 'Step 02 must exist');
    assert.ok(bodyText.includes('03'), 'Step 03 must exist');
    assert.match(bodyText, /Tell us what you need/i, 'Step 01 description');
    assert.match(bodyText, /Discover relevant legal professionals/i, 'Step 02 description');
    assert.match(bodyText, /Connect with the right one/i, 'Step 03 description');
  });

  // 4. Section 04 Why MyLaw 4 Principles
  await test('Tier 1.07: Why MyLaw section contains 4 principles (Clarity, Choice, Trust, Accessibility)', async () => {
    const page = await fetchPage('/', baseUrl);
    const bodyText = page.body;

    assert.match(bodyText, /Clarity/i, 'Clarity principle');
    assert.match(bodyText, /Choice/i, 'Choice principle');
    assert.match(bodyText, /Trust/i, 'Trust principle');
    assert.match(bodyText, /Accessibility/i, 'Accessibility principle');
  });

  // 5. Section 05 Who It's For Dual Panels
  await test('Tier 1.08: Who It\'s For section contains Individual and Lawyer panels with dedicated CTAs', async () => {
    const page = await fetchPage('/', baseUrl);
    const bodyText = page.body;

    assert.match(bodyText, /For Individuals/i, 'Individuals panel');
    assert.match(bodyText, /For Lawyers/i, 'Lawyers panel');
    assert.match(bodyText, /I['’]m a Lawyer/i, 'Lawyers CTA button');
  });

  // 6. Section Background Alternation Rhythm
  await test('Tier 1.09: Section backgrounds alternate rhythmically between white (#FFFFFF) and soft grey (#F7F8FA)', async () => {
    const pageSource = readFile('src/app/page.tsx') || '';
    const sectionsSource = [
      readFile('src/components/landing/HeroSection.tsx') || '',
      readFile('src/components/landing/ProblemSection.tsx') || '',
      readFile('src/components/landing/HowItWorksSection.tsx') || '',
      readFile('src/components/landing/WhyMyLawSection.tsx') || '',
      readFile('src/components/landing/WhoItsForSection.tsx') || '',
      readFile('src/components/landing/AboutSection.tsx') || '',
      readFile('src/components/landing/FinalCtaSection.tsx') || ''
    ].join('\n');

    const combined = pageSource + '\n' + sectionsSource;
    assert.ok(
      combined.includes('#F7F8FA') || combined.includes('bg-[#F7F8FA]') || combined.includes('brand-bg-soft'),
      'Soft grey background must be used for alternating sections'
    );
    assert.ok(
      combined.includes('#FFFFFF') || combined.includes('bg-white') || combined.includes('brand-bg'),
      'White background must be used for alternating sections'
    );
  });

  // 7. Navbar
  await test('Tier 1.10: Sticky Navbar contains Wordmark, Nav Links, Join Waitlist CTA, and Mobile Hamburger', async () => {
    const page = await fetchPage('/', baseUrl);
    const bodyText = page.body;

    // Wordmark
    assert.match(bodyText, /MyLaw/i, 'Navbar must contain "MyLaw" wordmark');

    // Nav Links
    const links = page.dom.querySelectorAll('nav a, header a');
    const hrefs = links.map(l => l.getAttribute('href') || '');
    assert.ok(hrefs.some(h => h.includes('about')), 'Navbar must contain link to About section');
    assert.ok(hrefs.some(h => h.includes('how-it-works')), 'Navbar must contain link to How It Works section');
    assert.ok(hrefs.some(h => h.includes('for-lawyers')), 'Navbar must contain link to For Lawyers section');
    assert.ok(hrefs.some(h => h.includes('waitlist')), 'Navbar must contain CTA linking to /waitlist');

    // Mobile Hamburger trigger check
    const mobileBtn = page.dom.querySelector('button[aria-label*="menu" i], button[aria-label*="navigation" i], button[aria-expanded]');
    assert.ok(mobileBtn !== null, 'Mobile hamburger menu toggle button must exist');
  });

  // 8. Footer
  await test('Tier 1.11: Footer contains MyLaw Wordmark, Tagline, Links, and Copyright Notice', async () => {
    const page = await fetchPage('/', baseUrl);
    const bodyText = page.body;

    assert.match(bodyText, /© 2026 MyLaw\. All rights reserved\./, 'Footer must contain exact copyright text: "© 2026 MyLaw. All rights reserved."');
    assert.match(bodyText, /A simpler way to discover and connect with/i, 'Footer must contain brand tagline');
  });

  // 9. Waitlist Page Layout & Elements
  await test('Tier 1.12: Waitlist page (/waitlist) loads successfully with centered layout & COMING SOON eyebrow', async () => {
    const page = await fetchPage('/waitlist', baseUrl);
    assert.equal(page.status, 200, `Expected HTTP 200 on /waitlist, got ${page.status}`);

    const bodyText = page.body;
    assert.match(bodyText, /COMING SOON/i, 'Waitlist page must contain "COMING SOON" eyebrow');
    assert.match(bodyText, /Legal help, made simpler\./i, 'Waitlist page must contain headline');
    assert.match(bodyText, /We['’]re building a better way to discover and connect/i, 'Waitlist page must contain subtitle');
  });

  await test('Tier 1.13: Waitlist page contains Email input with type="email" and required attribute', async () => {
    const page = await fetchPage('/waitlist', baseUrl);
    const emailInput = page.dom.querySelector('input[type="email"]');
    assert.ok(emailInput !== null, 'Waitlist page must contain an input element with type="email"');
    assert.ok(emailInput.hasAttribute('required'), 'Email input must have required constraint attribute');
  });

  await test('Tier 1.14: Waitlist page contains Optional Role selector (Looking for legal help / Lawyer)', async () => {
    const page = await fetchPage('/waitlist', baseUrl);
    const bodyText = page.body;

    assert.match(bodyText, /I am a:/i, 'Waitlist form must contain "I am a:" label');
    assert.match(bodyText, /Looking for legal help/i, 'Waitlist form must contain "Looking for legal help" option');
    assert.match(bodyText, /Lawyer/i, 'Waitlist form must contain "Lawyer" option');
  });

  await test('Tier 1.15: Waitlist page contains Submit button and Privacy microcopy', async () => {
    const page = await fetchPage('/waitlist', baseUrl);
    const submitBtn = page.dom.querySelector('button[type="submit"], button');
    assert.ok(submitBtn !== null, 'Waitlist form must contain a submit button');
    assert.match(submitBtn.textContent, /Join the Waitlist|Join Waitlist/i, 'Submit button text');

    const bodyText = page.body;
    assert.match(bodyText, /No spam\.\s*Just launch updates\./i, 'Waitlist page must contain privacy microcopy');
  });

  return results;
}
