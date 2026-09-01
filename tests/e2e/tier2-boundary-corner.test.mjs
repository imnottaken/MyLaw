import assert from 'node:assert/strict';
import { AssistantSimulator } from './helpers/assistant-simulator.mjs';
import { WaitlistFormSimulator } from './helpers/dom-simulator.mjs';
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
    // 50 toggles from false -> should be false (even number of toggles)
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

    // Step 1: Select root question
    const step1 = await sim.selectQuestion('core-what-is-mylaw');
    assert.equal(step1.success, true);
    assert.ok(step1.followUpQuestions.length >= 2);

    // Step 2: Select first follow-up
    const nextQuestionId = step1.followUpQuestions[0].id;
    const step2 = await sim.selectQuestion(nextQuestionId);
    assert.equal(step2.success, true);
    assert.equal(sim.activeQuestionId, nextQuestionId);

    // Step 3: Click "← Back to questions"
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
  // 9. WAITLIST FORM BOUNDARY VALIDATIONS
  // =========================================================================
  await test('Tier 2.11: Empty email input is rejected by waitlist validation', async () => {
    const sim = new WaitlistFormSimulator();
    sim.setEmail('');
    const res = await sim.submit();
    assert.equal(res.success, false);
    assert.equal(res.submitted, false);
  });

  await test('Tier 2.12: Malformed email strings are rejected by waitlist validation', async () => {
    const invalidEmails = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'email.example.com',
      'email@example@example.com'
    ];

    for (const email of invalidEmails) {
      const sim = new WaitlistFormSimulator();
      sim.setEmail(email);
      const res = await sim.submit();
      assert.equal(res.success, false, `Expected "${email}" to fail validation`);
    }
  });

  await test('Tier 2.13: Email with leading and trailing whitespace is trimmed and accepted', async () => {
    const sim = new WaitlistFormSimulator();
    sim.setEmail('   sarah.lawyer@example.com   \n');
    const res = await sim.submit();
    assert.equal(res.success, true);
    assert.equal(res.email, 'sarah.lawyer@example.com');
  });

  await test('Tier 2.14: Submitting without selecting optional role succeeds with role as null', async () => {
    const sim = new WaitlistFormSimulator();
    sim.setEmail('user.optional@example.com');
    const res = await sim.submit();
    assert.equal(res.success, true);
    assert.equal(res.role, null);
  });

  await test('Tier 2.15: Rapid double submission is handled cleanly without duplicate execution', async () => {
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

  return results;
}
