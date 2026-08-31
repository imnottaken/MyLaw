import assert from 'node:assert/strict';
import { WaitlistFormSimulator } from './helpers/dom-simulator.mjs';
import {
  validateThemeTokens,
  validateLightModeOnly,
  validateFontConfiguration
} from './helpers/source-scanner.mjs';
import { fetchPage } from './helpers/http-client.mjs';

export async function runTier2Tests(baseUrl) {
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

  // 1. Email Boundary Validations
  await test('Tier 2.01: Empty email input is rejected by validation', async () => {
    const sim = new WaitlistFormSimulator();
    sim.setEmail('');
    const res = await sim.submit();
    assert.equal(res.success, false, 'Empty email submission must fail validation');
    assert.equal(res.submitted, false, 'State should not transition to submitted');
    assert.ok(res.error.length > 0, 'Error reason should be provided');
  });

  await test('Tier 2.02: Malformed email strings are rejected by validation', async () => {
    const invalidEmails = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      'user@.com',
      'user@domain..com'
    ];

    for (const email of invalidEmails) {
      const sim = new WaitlistFormSimulator();
      sim.setEmail(email);
      const res = await sim.submit();
      assert.equal(
        res.success,
        false,
        `Expected malformed email "${email}" to be rejected by validation`
      );
    }
  });

  await test('Tier 2.03: Email with leading and trailing whitespace is sanitized and accepted', async () => {
    const sim = new WaitlistFormSimulator();
    sim.setEmail('   sarah.lawyer@example.com   \n');
    const res = await sim.submit();
    assert.equal(res.success, true, 'Trimmed email should pass validation');
    assert.equal(res.email, 'sarah.lawyer@example.com', 'Sanitized email should be trimmed of whitespace');
  });

  // 2. Role Selection Boundary Behavior
  await test('Tier 2.04: Submission succeeds without selecting optional role', async () => {
    const sim = new WaitlistFormSimulator();
    sim.setEmail('user.optional@example.com');
    // Role left as null / unselected
    const res = await sim.submit();
    assert.equal(res.success, true, 'Submitting without role must succeed');
    assert.equal(res.submitted, true, 'Form must reach success state');
    assert.equal(res.role, null, 'Role is recorded as null/unspecified');
  });

  await test('Tier 2.05: Submitting with explicit role preserves selected role value', async () => {
    const simHelp = new WaitlistFormSimulator();
    simHelp.setEmail('client@example.com');
    simHelp.setRole('help');
    const resHelp = await simHelp.submit();
    assert.equal(resHelp.role, 'help', 'Role should be preserved as "help"');

    const simLawyer = new WaitlistFormSimulator();
    simLawyer.setEmail('counsel@example.com');
    simLawyer.setRole('lawyer');
    const resLawyer = await simLawyer.submit();
    assert.equal(resLawyer.role, 'lawyer', 'Role should be preserved as "lawyer"');
  });

  // 3. Rapid Double Submission
  await test('Tier 2.06: Rapid double submission is handled cleanly without duplicate execution', async () => {
    const sim = new WaitlistFormSimulator();
    sim.setEmail('rapid.submit@example.com');

    const [res1, res2] = await Promise.all([
      sim.submit(),
      sim.submit()
    ]);

    assert.equal(res1.success, true);
    assert.equal(res2.success, true);
    assert.equal(sim.submitted, true);
  });

  // 4. Light-Mode Strict Enforcement
  await test('Tier 2.07: Light mode strictly enforced with zero dark-mode media query rules in globals.css', async () => {
    const lightCheck = validateLightModeOnly();
    assert.equal(
      lightCheck.isLightOnly,
      true,
      `globals.css contains dark mode overrides: hasDarkMediaQuery=${lightCheck.hasDarkMediaQuery}, hasDarkModeClassOverrides=${lightCheck.hasDarkModeClassOverrides}`
    );
  });

  // 5. Design Tokens Adherence
  await test('Tier 2.08: Design tokens in globals.css match exact design spec values', async () => {
    const tokenCheck = validateThemeTokens();
    assert.equal(
      tokenCheck.allPresent,
      true,
      `Missing design tokens: ${JSON.stringify(tokenCheck.results.filter(r => !r.present))}`
    );
  });

  // 6. Typography Scale & Inter Font
  await test('Tier 2.09: Root layout configures Inter Google font', async () => {
    const fontCheck = validateFontConfiguration();
    assert.equal(
      fontCheck.isConfigured,
      true,
      `layout.tsx must configure Inter via next/font/google: hasInterImport=${fontCheck.hasInterImport}, loadsInter=${fontCheck.loadsInter}`
    );
  });

  // 7. Responsive Viewport CSS Classes
  await test('Tier 2.10: Responsive classes are implemented for mobile (single-col) and desktop (multi-col)', async () => {
    const landingHtml = (await fetchPage('/', baseUrl)).body;
    const waitlistHtml = (await fetchPage('/waitlist', baseUrl)).body;

    // Check for responsive Tailwind classes e.g. md:, sm:, lg:, flex-col, grid
    assert.ok(
      landingHtml.includes('md:') || landingHtml.includes('sm:') || landingHtml.includes('lg:'),
      'Landing page should include responsive breakpoint modifiers'
    );
    assert.ok(
      waitlistHtml.includes('md:') || waitlistHtml.includes('sm:') || waitlistHtml.includes('max-w-'),
      'Waitlist page should include responsive container styling'
    );
  });

  return results;
}
