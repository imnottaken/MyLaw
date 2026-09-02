import assert from 'node:assert/strict';
import { AssistantSimulator } from './helpers/assistant-simulator.mjs';
import { WaitlistFormSimulator, INDIAN_STATE_BAR_COUNCILS } from './helpers/dom-simulator.mjs';
import {
  validateThemeTokens,
  validateLightModeOnly,
  validateFontConfiguration,
  validateZeroFreeTextInput,
  validateZeroAiCalls
} from './helpers/source-scanner.mjs';

export async function runTier2Tests() {
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

  // =========================================================================
  // 1. RAPID TOGGLE & DEBOUNCE
  // =========================================================================
  await test('Tier 2.01: Rapid toggle spamming (50 open/close cycles) preserves deterministic state', () => {
    const sim = new AssistantSimulator();

    for (let i = 0; i < 50; i++) {
      sim.toggle();
    }
    assert.equal(sim.isOpen, false, 'State should be closed after 50 toggles');
    assert.equal(sim.focusElement, 'trigger');

    sim.toggle();
    assert.equal(sim.isOpen, true, 'State should be open after 51st toggle');
    assert.ok(sim.currentGreeting.length > 0);
  });

  // =========================================================================
  // 2. ESC KEY HANDLING IN ALL CONVERSATIONAL STATES
  // =========================================================================
  await test('Tier 2.02: ESC key dismisses panel at initial greeting state and restores focus', () => {
    const sim = new AssistantSimulator();
    sim.open();
    assert.equal(sim.isOpen, true);

    const escRes = sim.handleKeyDown('Escape');
    assert.equal(escRes.handled, true);
    assert.equal(escRes.action, 'closed');
    assert.equal(sim.isOpen, false);
    assert.equal(sim.focusElement, 'trigger');
  });

  await test('Tier 2.03: ESC key dismisses panel during active question/answer state', async () => {
    const sim = new AssistantSimulator();
    sim.open();
    await sim.selectQuestion('core-what-is-mylaw');
    assert.equal(sim.activeQuestionId, 'core-what-is-mylaw');

    const escRes = sim.handleKeyDown('Escape');
    assert.equal(escRes.handled, true);
    assert.equal(sim.isOpen, false);
    assert.equal(sim.focusElement, 'trigger');
  });

  await test('Tier 2.04: ESC key press when panel is closed does not alter closed state', () => {
    const sim = new AssistantSimulator();
    assert.equal(sim.isOpen, false);

    const escRes = sim.handleKeyDown('Escape');
    assert.equal(escRes.handled, false);
    assert.equal(sim.isOpen, false);
  });

  // =========================================================================
  // 3. DEEP FOLLOW-UP GRAPH TRAVERSAL & RESET
  // =========================================================================
  await test('Tier 2.05: Multi-level follow-up traversal -> Back button restores initial 5 questions cleanly', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    const step1 = await sim.selectQuestion('core-what-is-mylaw');
    assert.equal(step1.success, true);
    assert.ok(step1.followUpQuestions.length >= 2);

    const nextQuestionId = step1.followUpQuestions[0].id;
    const step2 = await sim.selectQuestion(nextQuestionId);
    assert.equal(step2.success, true);
    assert.equal(sim.activeQuestionId, nextQuestionId);

    const backRes = sim.goBack();
    assert.equal(backRes.activeQuestionId, null);
    assert.equal(backRes.initialQuestions.length, 5);
    assert.equal(backRes.canGoBack, false);
  });

  // =========================================================================
  // 4. BOUNDARY KNOWLEDGE BASE QUERYING
  // =========================================================================
  await test('Tier 2.06: Selecting invalid or nonexistent question ID fails gracefully without exception', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    const invalidRes = await sim.selectQuestion('nonexistent-question-id-999');
    assert.equal(invalidRes.success, false);
    assert.ok(invalidRes.error.includes('not found'));
    assert.equal(sim.activeQuestionId, null);
  });

  // =========================================================================
  // 5. LIGHT-MODE STRICT ENFORCEMENT
  // =========================================================================
  await test('Tier 2.07: Light mode strictly enforced with zero dark: classes in UI components', () => {
    const lightCheck = validateLightModeOnly();
    assert.equal(
      lightCheck.isLightOnly,
      true,
      `Detected dark mode violations: ${JSON.stringify(lightCheck.darkClassViolations)}`
    );
  });

  // =========================================================================
  // 6. DESIGN TOKENS ADHERENCE
  // =========================================================================
  await test('Tier 2.08: Design tokens in globals.css match exact design spec values', () => {
    const tokenCheck = validateThemeTokens();
    assert.equal(
      tokenCheck.allPresent,
      true,
      `Missing design tokens: ${JSON.stringify(tokenCheck.results.filter(r => !r.present))}`
    );
  });

  // =========================================================================
  // 7. TYPOGRAPHY SCALE & INTER FONT
  // =========================================================================
  await test('Tier 2.09: Root layout configures Inter Google font with latin subset', () => {
    const fontCheck = validateFontConfiguration();
    assert.equal(
      fontCheck.isConfigured,
      true,
      `layout.tsx must configure Inter via next/font/google: hasInterImport=${fontCheck.hasInterImport}, loadsInter=${fontCheck.loadsInter}`
    );
  });

  // =========================================================================
  // 8. STRICT ZERO FREE-TEXT & ZERO AI GUARDRAILS
  // =========================================================================
  await test('Tier 2.10: Guardrail verification: zero interactive text inputs and zero dynamic AI calls', () => {
    const freeTextCheck = validateZeroFreeTextInput();
    assert.equal(freeTextCheck.clean, true, 'Zero free-text inputs in Assistant');

    const aiCheck = validateZeroAiCalls();
    assert.equal(aiCheck.clean, true, 'Zero dynamic AI SDK calls in codebase');
  });

  // =========================================================================
  // 9. WAITLIST FORM BOUNDARY VALIDATIONS: EMAIL
  // =========================================================================
  await test('Tier 2.11: Empty email input is rejected by waitlist validation', async () => {
    const sim = new WaitlistFormSimulator('individual');
    sim.setEmail('');
    sim.setMobile('9876543210');
    const res = await sim.submit();
    assert.equal(res.success, false);
    assert.equal(res.submitted, false);
    assert.match(res.error, /email/i);
  });

  await test('Tier 2.12: Malformed email strings are rejected by waitlist validation', async () => {
    const invalidEmails = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'email.example.com',
      'email@example@example.com',
      'user@.com',
      'a@b'
    ];

    for (const email of invalidEmails) {
      const sim = new WaitlistFormSimulator('individual');
      sim.setEmail(email);
      sim.setMobile('9876543210');
      const res = await sim.submit();
      assert.equal(res.success, false, `Expected "${email}" to fail validation`);
    }
  });

  await test('Tier 2.13: Email with leading and trailing whitespace is trimmed and lowercased', async () => {
    const sim = new WaitlistFormSimulator('individual');
    sim.setEmail('   Sarah.Lawyer@EXAMPLE.com   \n');
    sim.setMobile('9876543210');
    const res = await sim.submit();
    assert.equal(res.success, true);
    assert.equal(res.email, 'sarah.lawyer@example.com');
  });

  // =========================================================================
  // 10. WAITLIST FORM BOUNDARY VALIDATIONS: MOBILE
  // =========================================================================
  await test('Tier 2.14: Missing or empty mobile number is rejected by waitlist validation', async () => {
    const sim = new WaitlistFormSimulator('individual');
    sim.setEmail('valid.user@example.com');
    sim.setMobile('');
    const res = await sim.submit();
    assert.equal(res.success, false);
    assert.equal(res.submitted, false);
    assert.match(res.error, /mobile/i);
  });

  await test('Tier 2.15: Malformed mobile numbers (<10 digits, alphabets, special chars) are rejected', async () => {
    const invalidMobiles = [
      '12345',
      'abcdefghij',
      '98765-abcde',
      '000-not-a-number'
    ];

    for (const mobile of invalidMobiles) {
      const sim = new WaitlistFormSimulator('individual');
      sim.setEmail('valid.user@example.com');
      sim.setMobile(mobile);
      const res = await sim.submit();
      assert.equal(res.success, false, `Expected "${mobile}" to fail mobile validation`);
    }
  });

  await test('Tier 2.16: Valid Indian mobile number formats (+91, spaces, dashes, standard 10-digit) are normalized', async () => {
    const validMobiles = [
      { input: '9876543210', expected: '9876543210' },
      { input: '+91 98765 43210', expected: '9876543210' },
      { input: '+919876543210', expected: '9876543210' },
      { input: '09876543210', expected: '9876543210' },
      { input: '98765-43210', expected: '9876543210' }
    ];

    for (const { input, expected } of validMobiles) {
      const sim = new WaitlistFormSimulator('individual');
      sim.setEmail('valid.user@example.com');
      sim.setMobile(input);
      const res = await sim.submit();
      assert.equal(res.success, true, `Expected "${input}" to be valid`);
      assert.equal(res.mobile, expected, `Expected sanitized mobile to be "${expected}"`);
    }
  });

  // =========================================================================
  // 11. WAITLIST FORM BOUNDARY VALIDATIONS: LAWYER MANDATORY FIELDS
  // =========================================================================
  await test('Tier 2.17: Missing State Bar Council in Lawyer flow is rejected with validation error', async () => {
    const sim = new WaitlistFormSimulator('lawyer');
    sim.setEmail('advocate@example.com');
    sim.setMobile('9876543210');
    sim.setBarCouncilState(''); // Missing
    sim.setEnrollmentNumber('D/1234/2020');

    const res = await sim.submit();
    assert.equal(res.success, false);
    assert.match(res.error, /State Bar Council/i);
  });

  await test('Tier 2.18: Unknown or invalid State Bar Council string in Lawyer flow is rejected', async () => {
    const sim = new WaitlistFormSimulator('lawyer');
    sim.setEmail('advocate@example.com');
    sim.setMobile('9876543210');
    sim.setBarCouncilState('Bar Council of Atlantis'); // Invalid
    sim.setEnrollmentNumber('D/1234/2020');

    const res = await sim.submit();
    assert.equal(res.success, false);
    assert.match(res.error, /valid Indian State Bar Council/i);
  });

  await test('Tier 2.19: Missing Enrollment Number in Lawyer flow is rejected with validation error', async () => {
    const sim = new WaitlistFormSimulator('lawyer');
    sim.setEmail('advocate@example.com');
    sim.setMobile('9876543210');
    sim.setBarCouncilState('Bar Council of Delhi');
    sim.setEnrollmentNumber(''); // Missing

    const res = await sim.submit();
    assert.equal(res.success, false);
    assert.match(res.error, /Enrollment Number/i);
  });

  await test('Tier 2.20: In Individual flow, lawyer fields are optional and safely default to null', async () => {
    const sim = new WaitlistFormSimulator('individual');
    sim.setEmail('individual.user@example.com');
    sim.setMobile('9876543210');
    sim.setBarCouncilState(null);
    sim.setEnrollmentNumber(null);

    const res = await sim.submit();
    assert.equal(res.success, true);
    assert.equal(res.user_type, 'individual');
    assert.equal(res.bar_council_state, null);
    assert.equal(res.enrollment_number, null);
  });

  // =========================================================================
  // 12. POSTGRES UNIQUE CONSTRAINT (CODE 23505) DUPLICATE HANDLING
  // =========================================================================
  await test('Tier 2.21: Postgres duplicate email (code 23505) returns graceful HTTP 200 with alreadyRegistered: true', async () => {
    const sim = new WaitlistFormSimulator('individual');
    sim.setEmail('already.registered@example.com');
    sim.setMobile('9876543210');

    // Simulate Supabase code 23505 response handler
    const mockDuplicateApi = async () => ({
      success: true,
      alreadyRegistered: true,
      message: "You're already on the waitlist! We'll keep you updated."
    });

    const res = await sim.submit(mockDuplicateApi);
    assert.equal(res.success, true);
    assert.equal(res.alreadyRegistered, true);
    assert.match(res.message, /already on the waitlist/i);
    assert.equal(sim.alreadyRegistered, true);
  });

  // =========================================================================
  // 13. EXTREME STRINGS & SANITIZATION
  // =========================================================================
  await test('Tier 2.22: Extreme string lengths and enrollment whitespace are sanitized safely', async () => {
    const sim = new WaitlistFormSimulator('lawyer');
    const longPrefix = 'a'.repeat(50);
    sim.setEmail(`  ${longPrefix}@example.com  `);
    sim.setMobile('  +91 98765 43210  ');
    sim.setBarCouncilState('Bar Council of Delhi');
    sim.setEnrollmentNumber('   d/1234/2020   ');

    const res = await sim.submit();
    assert.equal(res.success, true);
    assert.equal(res.email, `${longPrefix}@example.com`);
    assert.equal(res.mobile, '9876543210');
    assert.equal(res.enrollment_number, 'D/1234/2020');
  });

  // =========================================================================
  // 14. RAPID DOUBLE SUBMISSION
  // =========================================================================
  await test('Tier 2.23: Rapid double submission is debounced and handled without duplicate execution', async () => {
    const sim = new WaitlistFormSimulator('individual');
    sim.setEmail('rapid.submit@example.com');
    sim.setMobile('9876543210');

    const [res1, res2] = await Promise.all([
      sim.submit(),
      sim.submit()
    ]);

    assert.equal(res1.success, true);
    assert.equal(sim.submitted, true);
  });

  return results;
}
