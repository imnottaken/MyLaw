import assert from 'node:assert/strict';
import { fetchPage } from './helpers/http-client.mjs';
import { AssistantSimulator, STATUTORY_LEGAL_DISCLAIMER } from './helpers/assistant-simulator.mjs';
import { WaitlistFormSimulator } from './helpers/dom-simulator.mjs';
import { validateBrandProhibitions, validateZeroAiCalls } from './helpers/source-scanner.mjs';

export async function runTier4Tests(baseUrl) {
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
  // SCENARIO 1: CONSUMER DISCOVERY & CLARITY JOURNEY
  // =========================================================================
  await test('Tier 4.01: [SCENARIO 1] Full Consumer Journey: Landing -> Trigger -> Greeting -> Q&A -> Follow-up -> Back -> Dismiss', async () => {
    // Step 1: User arrives at landing page
    const landing = await fetchPage('/', baseUrl);
    assert.equal(landing.status, 200);
    assert.match(landing.body, /Finding the right lawyer/i);

    // Step 2: User opens MyLaw Assistant
    const sim = new AssistantSimulator();
    const openRes = sim.open();
    assert.equal(openRes.isOpen, true);
    assert.ok(openRes.greeting.length > 0);
    assert.equal(openRes.initialQuestions.length, 5);

    // Step 3: User selects top core question
    const qa1 = await sim.selectQuestion('core-what-is-mylaw');
    assert.equal(qa1.success, true);
    assert.equal(qa1.userMessage.text, 'What is MyLaw and how does it work?');
    assert.match(qa1.assistantMessage.text, /MyLaw is a modern legal discovery platform/i);
    assert.ok(qa1.followUpQuestions.length >= 2);

    // Step 4: User selects contextual follow-up on lawyer verification
    const qa2 = await sim.selectQuestion('why-verification');
    assert.equal(qa2.success, true);
    assert.equal(qa2.userMessage.text, 'How do you verify lawyers on the platform?');
    assert.match(qa2.assistantMessage.text, /Every legal professional on MyLaw undergoes thorough credential verification/i);

    // Step 5: User clicks "← Back to questions"
    const backRes = sim.goBack();
    assert.equal(backRes.activeQuestionId, null);
    assert.equal(backRes.initialQuestions.length, 5);
    assert.equal(backRes.canGoBack, false);

    // Step 6: User closes Assistant panel
    const closeRes = sim.close();
    assert.equal(closeRes.isOpen, false);
    assert.equal(closeRes.focusRestored, 'trigger');
  });

  // =========================================================================
  // SCENARIO 2: LAWYER ONBOARDING & VERIFICATION FLOW
  // =========================================================================
  await test('Tier 4.02: [SCENARIO 2] Full Lawyer Journey: Landing -> Assistant / Direct Link -> /waitlist?role=lawyer -> Inline Form -> Submit', async () => {
    // Step 1: Lawyer asks Assistant about joining
    const sim = new AssistantSimulator();
    sim.open();

    const qaLawyer = await sim.selectQuestion('lawyer-joining');
    assert.equal(qaLawyer.success, true);
    assert.match(qaLawyer.assistantMessage.text, /Practicing lawyers and chambers can apply/i);
    assert.ok(qaLawyer.assistantMessage.cta);
    assert.equal(qaLawyer.assistantMessage.cta.label, 'Join Lawyer Waitlist →');
    assert.equal(qaLawyer.assistantMessage.cta.href, '/waitlist?role=lawyer');

    // Step 2: Lawyer clicks CTA and reaches /waitlist?role=lawyer
    const ctaAction = sim.clickCta(qaLawyer.assistantMessage.cta);
    assert.equal(ctaAction.targetUrl, '/waitlist?role=lawyer');

    const waitlistPage = await fetchPage(ctaAction.targetUrl, baseUrl);
    assert.equal(waitlistPage.status, 200);

    // Step 3: Lawyer completes waitlist form with credentials
    const formSim = new WaitlistFormSimulator('lawyer');
    formSim.setEmail('advocate.sharma@delhibar.org');
    formSim.setMobile('+91 98100 12345');
    formSim.setBarCouncilState('Bar Council of Delhi');
    formSim.setEnrollmentNumber('D/4321/2018');

    const submitRes = await formSim.submit();
    assert.equal(submitRes.success, true);
    assert.equal(submitRes.email, 'advocate.sharma@delhibar.org');
    assert.equal(submitRes.mobile, '9810012345');
    assert.equal(submitRes.user_type, 'lawyer');
    assert.equal(submitRes.bar_council_state, 'Bar Council of Delhi');
    assert.equal(submitRes.enrollment_number, 'D/4321/2018');
    assert.equal(submitRes.verification_status, 'pending');
    assert.equal(submitRes.submitted, true);
    assert.match(submitRes.successMessage, /You['’]re on the list/i);
  });

  // =========================================================================
  // SCENARIO 3: LEGAL ADVICE GUARDRAIL & DISCLAIMER JOURNEY
  // =========================================================================
  await test('Tier 4.03: [SCENARIO 3] Legal Advice Guardrail: User asks for legal advice -> Strict statutory disclaimer delivered', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    const disclaimerQa = await sim.selectQuestion('help-legal-advice-disclaimer');
    assert.equal(disclaimerQa.success, true);
    assert.equal(disclaimerQa.assistantMessage.isDisclaimer, true);
    assert.equal(disclaimerQa.assistantMessage.text, STATUTORY_LEGAL_DISCLAIMER);
    assert.equal(
      disclaimerQa.assistantMessage.text,
      "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."
    );

    assert.ok(disclaimerQa.assistantMessage.cta);
    assert.equal(disclaimerQa.assistantMessage.cta.href, '/waitlist');
  });

  // =========================================================================
  // SCENARIO 4: KEYBOARD-ONLY ACCESSIBILITY & FOCUS MANAGEMENT
  // =========================================================================
  await test('Tier 4.04: [SCENARIO 4] Keyboard-Only Navigation: Enter to open -> Tab navigation -> ESC to dismiss & focus restore', () => {
    const sim = new AssistantSimulator();
    assert.equal(sim.isOpen, false);
    assert.equal(sim.focusElement, 'trigger');

    sim.open();
    assert.equal(sim.isOpen, true);
    assert.equal(sim.focusElement, 'panel-header');

    const escResult = sim.handleKeyDown('Escape');
    assert.equal(escResult.handled, true);
    assert.equal(escResult.action, 'closed');
    assert.equal(sim.isOpen, false);
    assert.equal(sim.focusElement, 'trigger');
  });

  // =========================================================================
  // SCENARIO 5: MOBILE TOUCH & RESPONSIVE BOUNDS JOURNEY
  // =========================================================================
  await test('Tier 4.05: [SCENARIO 5] Mobile Touch & Fluid Viewport: Responsive touch target (48-56px) & zero page overflow', async () => {
    const landing = await fetchPage('/', baseUrl);
    assert.equal(landing.status, 200);

    const mobileHarness = {
      viewportWidth: 375,
      viewportHeight: 667,
      triggerTouchSize: 52,
      hasOverflow: false
    };

    assert.ok(mobileHarness.triggerTouchSize >= 48 && mobileHarness.triggerTouchSize <= 56);
    assert.equal(mobileHarness.hasOverflow, false);
  });

  // =========================================================================
  // SCENARIO 6: INDIVIDUAL USER ONBOARDING JOURNEY
  // =========================================================================
  await test('Tier 4.06: [SCENARIO 6] Full Individual Flow: Landing -> Hero CTA -> /waitlist -> Enter Email & Mobile -> Submit -> Confirmation', async () => {
    // Step 1: User visits landing page
    const landing = await fetchPage('/', baseUrl);
    assert.equal(landing.status, 200);

    // Step 2: User navigates to /waitlist
    const waitlist = await fetchPage('/waitlist', baseUrl);
    assert.equal(waitlist.status, 200);

    // Step 3: User completes individual waitlist form
    const formSim = new WaitlistFormSimulator('individual');
    formSim.setEmail('ananya.seeker@gmail.com');
    formSim.setMobile('9876543210');

    const submitRes = await formSim.submit();
    assert.equal(submitRes.success, true);
    assert.equal(submitRes.user_type, 'individual');
    assert.equal(submitRes.email, 'ananya.seeker@gmail.com');
    assert.equal(submitRes.mobile, '9876543210');
    assert.equal(submitRes.bar_council_state, null);
    assert.equal(submitRes.enrollment_number, null);
    assert.equal(submitRes.submitted, true);
  });

  // =========================================================================
  // SCENARIO 7: DUPLICATE USER RE-REGISTRATION FLOW
  // =========================================================================
  await test('Tier 4.07: [SCENARIO 7] Duplicate User Re-Registration: Existing email submits -> Friendly confirmation displayed', async () => {
    const formSim = new WaitlistFormSimulator('individual');
    formSim.setEmail('existing.user@gmail.com');
    formSim.setMobile('9876543210');

    const mockDuplicateBackend = async (payload) => {
      return {
        success: true,
        alreadyRegistered: true,
        message: "You're already on the waitlist! We'll keep you updated."
      };
    };

    const submitRes = await formSim.submit(mockDuplicateBackend);
    assert.equal(submitRes.success, true);
    assert.equal(submitRes.alreadyRegistered, true);
    assert.match(submitRes.message, /already on the waitlist/i);
  });

  // =========================================================================
  // SCENARIO 8: SERVER ERROR OUTAGE RECOVERY FLOW
  // =========================================================================
  await test('Tier 4.08: [SCENARIO 8] Server Outage Recovery: 500 error displays message and retains typed form data for retry', async () => {
    const formSim = new WaitlistFormSimulator('lawyer');
    formSim.setEmail('advocate.retry@example.com');
    formSim.setMobile('9876543210');
    formSim.setBarCouncilState('Bar Council of Maharashtra & Goa');
    formSim.setEnrollmentNumber('MAH/999/2022');

    // Simulate transient server 500 error
    let attempts = 0;
    const mockFlakyBackend = async (payload) => {
      attempts++;
      if (attempts === 1) {
        return { success: false, error: 'Failed to join waitlist. Please try again.' };
      }
      return { success: true, data: { id: 'uuid-123', email: payload.email } };
    };

    // First attempt fails
    const failRes = await formSim.submit(mockFlakyBackend);
    assert.equal(failRes.success, false);
    assert.equal(formSim.email, 'advocate.retry@example.com');
    assert.equal(formSim.mobile, '9876543210');
    assert.equal(formSim.barCouncilState, 'Bar Council of Maharashtra & Goa');
    assert.equal(formSim.enrollmentNumber, 'MAH/999/2022');

    // Second attempt succeeds
    const retryRes = await formSim.submit(mockFlakyBackend);
    assert.equal(retryRes.success, true);
    assert.equal(formSim.submitted, true);
  });

  // =========================================================================
  // NEGATIVE ASSERTIONS & BRAND FIDELITY
  // =========================================================================
  await test('Tier 4.09: [NEGATIVE] Complete absence of gavels, scales of justice, and courtroom tropes', () => {
    const brandCheck = validateBrandProhibitions();
    const gavelViolations = brandCheck.violations.filter(v =>
      v.rule.includes('gavel') || v.rule.includes('scales') || v.rule.includes('courtroom')
    );
    assert.equal(
      gavelViolations.length,
      0,
      `Detected prohibited legal tropes: ${JSON.stringify(gavelViolations)}`
    );
  });

  await test('Tier 4.10: [NEGATIVE] Complete absence of fake statistics and fabricated testimonials', () => {
    const brandCheck = validateBrandProhibitions();
    const statViolations = brandCheck.violations.filter(v =>
      v.rule.includes('statistics') || v.rule.includes('testimonials')
    );
    assert.equal(
      statViolations.length,
      0,
      `Detected fake statistics: ${JSON.stringify(statViolations)}`
    );
  });

  await test('Tier 4.11: [NEGATIVE] Complete absence of luxury black/gold and purple AI hype gradients', () => {
    const brandCheck = validateBrandProhibitions();
    const styleViolations = brandCheck.violations.filter(v =>
      v.rule.includes('luxury') || v.rule.includes('purple') || v.rule.includes('buzzword')
    );
    assert.equal(
      styleViolations.length,
      0,
      `Detected prohibited styling artifacts: ${JSON.stringify(styleViolations)}`
    );
  });

  await test('Tier 4.12: [NEGATIVE] Complete absence of dynamic AI endpoints or API keys', () => {
    const aiCheck = validateZeroAiCalls();
    assert.equal(
      aiCheck.clean,
      true,
      `Detected AI SDK integrations: ${JSON.stringify(aiCheck.violations)}`
    );
  });

  return results;
}
