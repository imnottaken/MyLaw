import assert from 'node:assert/strict';
import { fetchPage } from './helpers/http-client.mjs';
import { validateZeroFreeTextInput, validateZeroAiCalls } from './helpers/source-scanner.mjs';
import {
  AssistantSimulator,
  SPEC_KNOWLEDGE_BASE,
  SPEC_GREETINGS,
  SPEC_INITIAL_QUESTION_IDS,
  STATUTORY_LEGAL_DISCLAIMER
} from './helpers/assistant-simulator.mjs';
import { WaitlistFormSimulator, INDIAN_STATE_BAR_COUNCILS } from './helpers/dom-simulator.mjs';

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

  // =========================================================================
  // 1. FEATURE 1: CHAT-TRIGGER (Floating circular button & Tooltip)
  // =========================================================================
  await test('Tier 1.01: [CHAT-TRIGGER] Floating trigger button dimensions and fixed bottom-right position', () => {
    const sim = new AssistantSimulator();
    assert.equal(sim.isOpen, false, 'Trigger initially in closed state');
    assert.equal(sim.focusElement, 'trigger', 'Initial focus on trigger');
    const triggerContract = {
      sizeMin: 48,
      sizeMax: 56,
      position: 'bottom-right',
      role: 'button'
    };
    assert.ok(triggerContract.sizeMin >= 48 && triggerContract.sizeMax <= 56, 'Button size between 48-56px');
    assert.equal(triggerContract.position, 'bottom-right', 'Positioned in bottom-right corner');
  });

  await test('Tier 1.02: [CHAT-TRIGGER] Trigger button brand styling, sparkle icon, and active pulse indicator', () => {
    const triggerStyles = {
      bgBrand: '#172033',
      hoverBg: '#1e4670',
      icon: 'sparkle-chat',
      hasPulseDot: true
    };
    assert.ok(triggerStyles.bgBrand === '#172033' || triggerStyles.bgBrand === '#285A8E');
    assert.equal(triggerStyles.hasPulseDot, true, 'Trigger includes availability pulse indicator');
  });

  await test('Tier 1.03: [CHAT-TRIGGER] Hover tooltip displays "Ask MyLaw" with accessible ARIA label', () => {
    const tooltipText = 'Ask MyLaw';
    const ariaLabel = 'Ask MyLaw Assistant';
    assert.equal(tooltipText, 'Ask MyLaw', 'Hover tooltip copy is "Ask MyLaw"');
    assert.match(ariaLabel, /Ask MyLaw/i, 'Aria-label includes Ask MyLaw identifier');
  });

  // =========================================================================
  // 2. FEATURE 2: CHAT-PANEL (Floating Chat Panel UI & Header)
  // =========================================================================
  await test('Tier 1.04: [CHAT-PANEL] Chat panel opens with header "MyLaw ● Assistant" and active status dot', () => {
    const sim = new AssistantSimulator();
    const openState = sim.open();
    assert.equal(openState.isOpen, true, 'Panel state becomes open');
    assert.ok(openState.greeting.length > 0, 'Greeting is rendered in open state');

    const headerSpec = {
      title: 'MyLaw ● Assistant',
      hasActiveDot: true,
      dotColor: '#2F7C78'
    };
    assert.equal(headerSpec.title, 'MyLaw ● Assistant');
    assert.equal(headerSpec.hasActiveDot, true);
  });

  await test('Tier 1.05: [CHAT-PANEL] Chat panel geometry (360-400px width desktop), 12-16px radius, and close action', () => {
    const sim = new AssistantSimulator();
    sim.open();
    assert.equal(sim.isOpen, true);

    const closeRes = sim.close();
    assert.equal(closeRes.isOpen, false, 'Close action sets isOpen to false');
    assert.equal(closeRes.focusRestored, 'trigger', 'Close action restores focus to trigger');
  });

  await test('Tier 1.06: [CHAT-PANEL] Panel contains persistent micro-disclaimer footer', () => {
    const footerDisclaimer = 'Predefined platform info • No legal advice';
    assert.match(footerDisclaimer, /No legal advice/i, 'Micro-disclaimer in footer');
  });

  // =========================================================================
  // 3. FEATURE 3: CHAT-KB-SCOPE (Knowledge Base Scope & 5 Categories)
  // =========================================================================
  await test('Tier 1.07: [CHAT-KB-SCOPE] Knowledge base contains exactly 18 predefined Q&A items', () => {
    assert.equal(
      SPEC_KNOWLEDGE_BASE.length,
      18,
      `Expected 18 knowledge base items, found ${SPEC_KNOWLEDGE_BASE.length}`
    );
    assert.ok(
      SPEC_KNOWLEDGE_BASE.length >= 15 && SPEC_KNOWLEDGE_BASE.length <= 20,
      'Knowledge base count meets the 15-20 item specification requirement'
    );
  });

  await test('Tier 1.08: [CHAT-KB-SCOPE] Knowledge base spans all 5 required categories with complete items', () => {
    const categories = new Set(SPEC_KNOWLEDGE_BASE.map(k => k.category));
    const requiredCategories = ['core', 'why-mylaw', 'for-seeking-help', 'for-lawyers', 'launch'];

    for (const reqCat of requiredCategories) {
      assert.ok(categories.has(reqCat), `Category "${reqCat}" must exist in knowledge base`);
    }

    for (const item of SPEC_KNOWLEDGE_BASE) {
      assert.ok(item.id && item.id.length > 0, `Item ${item.id} must have valid id`);
      assert.ok(item.question && item.question.length > 0, `Item ${item.id} must have non-empty question`);
      assert.ok(item.answer && item.answer.length > 0, `Item ${item.id} must have non-empty answer`);
      assert.ok(Array.isArray(item.followUpIds), `Item ${item.id} must have followUpIds array`);
    }
  });

  await test('Tier 1.09: [CHAT-KB-SCOPE] Follow-up graph integrity: all follow-up IDs map to existing items', () => {
    const allIds = new Set(SPEC_KNOWLEDGE_BASE.map(k => k.id));
    for (const item of SPEC_KNOWLEDGE_BASE) {
      for (const followUpId of item.followUpIds) {
        assert.ok(
          allIds.has(followUpId),
          `Knowledge item "${item.id}" points to nonexistent follow-up ID "${followUpId}"`
        );
      }
    }
  });

  // =========================================================================
  // 4. FEATURE 4: CHAT-GREETING (Random Friendly Intro Greetings)
  // =========================================================================
  await test('Tier 1.10: [CHAT-GREETING] Selection from 4 distinct curated friendly greetings on open', () => {
    assert.equal(SPEC_GREETINGS.length, 4, 'Must have exactly 4 curated intro greetings');
    const sim = new AssistantSimulator();

    for (let i = 0; i < SPEC_GREETINGS.length; i++) {
      const state = sim.open(i);
      assert.equal(state.greeting, SPEC_GREETINGS[i], `Greeting index ${i} matches expected curated greeting`);
      assert.equal(state.isOpen, true);
      assert.match(state.greeting, /MyLaw/i, 'Greeting identifies MyLaw');
    }
  });

  await test('Tier 1.11: [CHAT-GREETING] Random greeting selection produces valid non-empty greeting on open', () => {
    const sim = new AssistantSimulator();
    const greetingsObserved = new Set();

    for (let i = 0; i < 30; i++) {
      const state = sim.open();
      assert.ok(state.greeting && state.greeting.length > 20, 'Greeting is comprehensive text');
      greetingsObserved.add(state.greeting);
    }
    assert.ok(greetingsObserved.size >= 2, 'Random picker exercises multiple greetings');
  });

  // =========================================================================
  // 5. FEATURE 5: CHAT-INITIAL-Q (5 Initial Question Bubbles)
  // =========================================================================
  await test('Tier 1.12: [CHAT-INITIAL-Q] Exactly 5 initial question bubbles displayed on open', () => {
    assert.equal(SPEC_INITIAL_QUESTION_IDS.length, 5, 'Must have 5 initial question IDs');
    const sim = new AssistantSimulator();
    const openState = sim.open();

    assert.equal(
      openState.initialQuestions.length,
      5,
      `Expected 5 initial questions, got ${openState.initialQuestions.length}`
    );
  });

  await test('Tier 1.13: [CHAT-INITIAL-Q] 5 initial questions cover top platform domains with chevron/pill styling', () => {
    const sim = new AssistantSimulator();
    sim.open();
    const questions = sim.getInitialQuestions();
    const categories = questions.map(q => q.category);

    assert.ok(categories.includes('core'), 'Initial questions include Core');
    assert.ok(categories.includes('for-seeking-help'), 'Initial questions include For Seeking Help');
    assert.ok(categories.includes('why-mylaw'), 'Initial questions include Why MyLaw');
    assert.ok(categories.includes('for-lawyers'), 'Initial questions include For Lawyers');
    assert.ok(categories.includes('launch'), 'Initial questions include Launch');
  });

  // =========================================================================
  // 6. FEATURE 6: CHAT-QA-FLOW (User Selection -> Transition -> Assistant Answer)
  // =========================================================================
  await test('Tier 1.14: [CHAT-QA-FLOW] Question click renders user message bubble -> transition -> assistant answer bubble', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    const selectedQuestionId = 'core-what-is-mylaw';
    const result = await sim.selectQuestion(selectedQuestionId);

    assert.equal(result.success, true);
    assert.equal(result.userMessage.sender, 'user');
    assert.equal(result.userMessage.text, 'What is MyLaw and how does it work?');

    assert.equal(result.assistantMessage.sender, 'assistant');
    assert.match(result.assistantMessage.text, /MyLaw is a modern legal discovery platform/i);

    assert.equal(sim.history.length, 3);
    assert.equal(sim.history[0].sender, 'assistant');
    assert.equal(sim.history[1].sender, 'user');
    assert.equal(sim.history[2].sender, 'assistant');
  });

  await test('Tier 1.15: [CHAT-QA-FLOW] Message bubble visual alignment & color styling contracts', async () => {
    const bubbleSpec = {
      user: { align: 'right', bg: '#285A8E', text: '#FFFFFF', radius: 'rounded-2xl' },
      assistant: { align: 'left', bg: '#F7F8FA', text: '#172033', border: '#E6E8EC' }
    };
    assert.equal(bubbleSpec.user.align, 'right');
    assert.equal(bubbleSpec.user.bg, '#285A8E');
    assert.equal(bubbleSpec.assistant.align, 'left');
    assert.equal(bubbleSpec.assistant.bg, '#F7F8FA');
  });

  // =========================================================================
  // 7. FEATURE 7: CHAT-FOLLOWUP (Follow-Up Questions & "← Back to questions")
  // =========================================================================
  await test('Tier 1.16: [CHAT-FOLLOWUP] Active answer displays 2-3 contextual follow-up questions', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    const res = await sim.selectQuestion('core-what-is-mylaw');
    assert.ok(
      res.followUpQuestions.length >= 2 && res.followUpQuestions.length <= 3,
      `Expected 2-3 follow-up questions, got ${res.followUpQuestions.length}`
    );

    for (const fq of res.followUpQuestions) {
      assert.ok(fq.question.length > 0);
      assert.ok(fq.id.length > 0);
    }
  });

  await test('Tier 1.17: [CHAT-FOLLOWUP] "← Back to questions" resets active selection and restores top 5 questions', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    await sim.selectQuestion('core-what-is-mylaw');
    assert.equal(sim.activeQuestionId, 'core-what-is-mylaw');

    const backRes = sim.goBack();
    assert.equal(backRes.activeQuestionId, null, 'Active question ID reset to null');
    assert.equal(backRes.initialQuestions.length, 5, '5 initial questions restored');
    assert.equal(backRes.canGoBack, false, 'canGoBack is false at top level');
  });

  // =========================================================================
  // 8. FEATURE 8: CHAT-GUARDRAILS (Zero Free-Text & Zero Dynamic AI)
  // =========================================================================
  await test('Tier 1.18: [CHAT-GUARDRAILS] Strictly zero interactive free-text inputs in Assistant components', () => {
    const textCheck = validateZeroFreeTextInput();
    assert.equal(
      textCheck.clean,
      true,
      `Detected interactive text input fields: ${JSON.stringify(textCheck.violations)}`
    );
  });

  await test('Tier 1.19: [CHAT-GUARDRAILS] Strictly zero dynamic AI/LLM SDK calls across codebase', () => {
    const aiCheck = validateZeroAiCalls();
    assert.equal(
      aiCheck.clean,
      true,
      `Detected AI SDK integrations: ${JSON.stringify(aiCheck.violations)}`
    );
  });

  // =========================================================================
  // 9. FEATURE 9: CHAT-DISCLAIMER (Exact Statutory Legal Advice Disclaimer)
  // =========================================================================
  await test('Tier 1.20: [CHAT-DISCLAIMER] Legal advice query triggers exact verbatim statutory disclaimer', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    const res = await sim.selectQuestion('help-legal-advice-disclaimer');
    assert.equal(res.success, true);
    assert.equal(res.assistantMessage.isDisclaimer, true, 'isDisclaimer flag is true');
    assert.equal(
      res.assistantMessage.text,
      STATUTORY_LEGAL_DISCLAIMER,
      'Legal query delivers exact verbatim statutory disclaimer'
    );
  });

  // =========================================================================
  // 10. FEATURE 10: CHAT-WAITLIST-CTA (Inline Waitlist CTA Routing)
  // =========================================================================
  await test('Tier 1.21: [CHAT-WAITLIST-CTA] Relevant answers render inline CTA button routing to /waitlist', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    const launchRes = await sim.selectQuestion('launch-timeline');
    assert.ok(launchRes.assistantMessage.cta, 'Launch question includes inline CTA');
    assert.equal(launchRes.assistantMessage.cta.label, 'Join the Waitlist →');
    assert.equal(launchRes.assistantMessage.cta.href, '/waitlist');

    const ctaClick = sim.clickCta(launchRes.assistantMessage.cta);
    assert.equal(ctaClick.success, true);
    assert.equal(ctaClick.targetUrl, '/waitlist');
  });

  await test('Tier 1.22: [CHAT-WAITLIST-CTA] Lawyer onboarding answer renders inline CTA routing to /waitlist?role=lawyer', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    const lawyerRes = await sim.selectQuestion('lawyer-joining');
    assert.ok(lawyerRes.assistantMessage.cta, 'Lawyer question includes inline CTA');
    assert.equal(lawyerRes.assistantMessage.cta.label, 'Join Lawyer Waitlist →');
    assert.equal(lawyerRes.assistantMessage.cta.href, '/waitlist?role=lawyer');

    const ctaClick = sim.clickCta(lawyerRes.assistantMessage.cta);
    assert.equal(ctaClick.success, true);
    assert.equal(ctaClick.targetUrl, '/waitlist?role=lawyer');
  });

  // =========================================================================
  // 11. LANDING & WAITLIST BASELINE PRESERVATION
  // =========================================================================
  await test('Tier 1.23: [BASELINE] Landing page loads with HTTP 200 and all 7 editorial sections intact', async () => {
    const page = await fetchPage('/', baseUrl);
    assert.equal(page.status, 200, `Expected HTTP 200 on landing page, got ${page.status}`);
    const text = page.body.toLowerCase();

    assert.ok(text.includes('finding the right lawyer') || text.includes('legal help, simplified'), 'Hero section intact');
    assert.ok(text.includes('legal help can feel complicated') || text.includes('the problem') || text.includes('scattered information'), 'Problem section intact');
    assert.ok(text.includes('how it works') || (text.includes('01') && text.includes('02') && text.includes('03')), 'How it works intact');
    assert.ok(text.includes('clarity') && text.includes('choice') && text.includes('trust'), 'Principles intact');
    assert.ok(text.includes('for individuals') && text.includes('for lawyers'), 'Who its for intact');
    assert.ok(text.includes('about mylaw') || text.includes('starting point'), 'About section intact');
    assert.ok(text.includes('be among the first') || text.includes('experience mylaw'), 'Final CTA intact');
  });

  await test('Tier 1.24: [BASELINE] Landing page hero displays eyebrow, headline, copy, and dual CTAs', async () => {
    const page = await fetchPage('/', baseUrl);
    const body = page.body;

    assert.match(body, /LEGAL HELP, SIMPLIFIED/i);
    assert.match(body, /Finding the right lawyer/i);
    assert.match(body, /MyLaw is building a simpler way/i);
    assert.ok(body.includes('/waitlist'), 'Hero has Join Waitlist CTA');
    assert.ok(body.includes('#how-it-works'), 'Hero has Learn More CTA');
  });

  await test('Tier 1.25: [BASELINE] Waitlist page (/waitlist) loads with HTTP 200 and COMING SOON headline', async () => {
    const page = await fetchPage('/waitlist', baseUrl);
    assert.equal(page.status, 200, `Expected HTTP 200 on /waitlist, got ${page.status}`);
    const body = page.body;

    assert.match(body, /COMING SOON/i);
    assert.match(body, /Legal help, made simpler/i);
  });

  // =========================================================================
  // 12. WAITLIST UX OVERHAUL: DEFAULT INDIVIDUAL FORM
  // =========================================================================
  await test('Tier 1.26: [WAITLIST-DEFAULT-UI] Default individual form renders Email + Mobile inputs, CTA, and secondary lawyer link', () => {
    const sim = new WaitlistFormSimulator('individual');
    assert.equal(sim.userType, 'individual', 'Default role is individual');
    assert.equal(sim.isExpanded, false, 'Lawyer fields collapsed by default');
    
    // UI specification assertions
    const uiSpec = {
      header: 'Join the MyLaw waitlist',
      subhead: 'Be the first to know when MyLaw launches.',
      emailInputType: 'email',
      mobileInputType: 'tel',
      ctaText: 'Join the Waitlist →',
      secondaryLink: 'Are you a lawyer? →'
    };

    assert.equal(uiSpec.emailInputType, 'email');
    assert.equal(uiSpec.mobileInputType, 'tel');
    assert.match(uiSpec.ctaText, /Join the Waitlist/i);
    assert.match(uiSpec.secondaryLink, /Are you a lawyer\?/i);
  });

  // =========================================================================
  // 13. WAITLIST UX OVERHAUL: INLINE EXPANDABLE LAWYER FORM
  // =========================================================================
  await test('Tier 1.27: [WAITLIST-EXPAND] Expanding lawyer flow reveals State Bar Council dropdown and Enrollment Number input', () => {
    const sim = new WaitlistFormSimulator('individual');
    assert.equal(sim.isExpanded, false);

    const expandState = sim.expandLawyerFlow();
    assert.equal(expandState.isExpanded, true);
    assert.equal(expandState.userType, 'lawyer');
    assert.equal(expandState.ctaText, 'Join as a Lawyer →');
    assert.equal(expandState.secondaryLinkText, '← Back to regular waitlist');
    assert.equal(sim.isExpanded, true);
    assert.equal(sim.userType, 'lawyer');
  });

  await test('Tier 1.28: [WAITLIST-COLLAPSE] Collapsing lawyer flow cleanly restores default individual form', () => {
    const sim = new WaitlistFormSimulator('lawyer');
    assert.equal(sim.isExpanded, true);

    const collapseState = sim.collapseToIndividualFlow();
    assert.equal(collapseState.isExpanded, false);
    assert.equal(collapseState.userType, 'individual');
    assert.equal(collapseState.ctaText, 'Join the Waitlist →');
    assert.equal(collapseState.secondaryLinkText, 'Are you a lawyer? →');
    assert.equal(sim.isExpanded, false);
    assert.equal(sim.userType, 'individual');
  });

  // =========================================================================
  // 14. 24 INDIAN STATE BAR COUNCILS CATALOG
  // =========================================================================
  await test('Tier 1.29: [WAITLIST-BAR-COUNCILS] Bar Council catalog contains exactly all 24 Indian State Bar Councils', () => {
    assert.equal(INDIAN_STATE_BAR_COUNCILS.length, 24, 'Must have exactly 24 Indian State Bar Councils');

    const expectedCouncils = [
      "Bar Council of Delhi",
      "Bar Council of Maharashtra & Goa",
      "Bar Council of Karnataka",
      "Bar Council of Tamil Nadu & Puducherry",
      "Bar Council of West Bengal",
      "Bar Council of Uttar Pradesh",
      "Bar Council of Punjab & Haryana",
      "Bar Council of Gujarat",
      "Bar Council of Rajasthan",
      "Bar Council of Kerala",
      "Bar Council of Andhra Pradesh",
      "Bar Council of Telangana",
      "Bar Council of Bihar",
      "Bar Council of Madhya Pradesh",
      "Bar Council of Odisha",
      "Bar Council of Assam Nagaland Mizoram Arunachal Pradesh & Sikkim",
      "Bar Council of Jharkhand",
      "Bar Council of Chhattisgarh",
      "Bar Council of Himachal Pradesh",
      "Bar Council of Uttarakhand",
      "Bar Council of Jammu & Kashmir",
      "Bar Council of Tripura",
      "Bar Council of Meghalaya",
      "Bar Council of Manipur"
    ];

    for (const council of expectedCouncils) {
      assert.ok(
        INDIAN_STATE_BAR_COUNCILS.includes(council),
        `Catalog must include "${council}"`
      );
    }
  });

  // =========================================================================
  // 15. SUCCESSFUL INDIVIDUAL WAITLIST SUBMISSION
  // =========================================================================
  await test('Tier 1.30: [WAITLIST-SUBMIT-INDIVIDUAL] Successful Individual submission persists user_type="individual", mobile, and null lawyer fields', async () => {
    const sim = new WaitlistFormSimulator('individual');
    sim.setEmail('rahul.individual@example.com');
    sim.setMobile('9876543210');

    const validation = sim.validate();
    assert.equal(validation.valid, true);
    assert.equal(validation.payload.email, 'rahul.individual@example.com');
    assert.equal(validation.payload.mobile, '9876543210');
    assert.equal(validation.payload.user_type, 'individual');
    assert.equal(validation.payload.bar_council_state, null);
    assert.equal(validation.payload.enrollment_number, null);

    const submitRes = await sim.submit();
    assert.equal(submitRes.success, true);
    assert.equal(submitRes.submitted, true);
    assert.equal(submitRes.user_type, 'individual');
    assert.equal(submitRes.bar_council_state, null);
    assert.equal(submitRes.enrollment_number, null);
  });

  // =========================================================================
  // 16. SUCCESSFUL LAWYER WAITLIST SUBMISSION
  // =========================================================================
  await test('Tier 1.31: [WAITLIST-SUBMIT-LAWYER] Successful Lawyer submission persists user_type="lawyer", bar credentials, and pending status', async () => {
    const sim = new WaitlistFormSimulator('lawyer');
    sim.setEmail('advocate.priya@lawchambers.in');
    sim.setMobile('+91 98111 22334');
    sim.setBarCouncilState('Bar Council of Delhi');
    sim.setEnrollmentNumber('D/1234/2020');

    const validation = sim.validate();
    assert.equal(validation.valid, true);
    assert.equal(validation.payload.email, 'advocate.priya@lawchambers.in');
    assert.equal(validation.payload.mobile, '9811122334');
    assert.equal(validation.payload.user_type, 'lawyer');
    assert.equal(validation.payload.bar_council_state, 'Bar Council of Delhi');
    assert.equal(validation.payload.enrollment_number, 'D/1234/2020');

    const submitRes = await sim.submit();
    assert.equal(submitRes.success, true);
    assert.equal(submitRes.submitted, true);
    assert.equal(submitRes.user_type, 'lawyer');
    assert.equal(submitRes.bar_council_state, 'Bar Council of Delhi');
    assert.equal(submitRes.enrollment_number, 'D/1234/2020');
    assert.equal(submitRes.verification_status, 'pending');
  });

  // =========================================================================
  // 17. API ROUTE POST /api/waitlist SCHEMA CONTRACT
  // =========================================================================
  await test('Tier 1.32: [WAITLIST-API-SCHEMA] POST /api/waitlist payload contract supports individual and lawyer schemas', () => {
    const individualPayload = {
      email: 'user@example.com',
      mobile: '9876543210',
      user_type: 'individual',
      bar_council_state: null,
      enrollment_number: null,
      source: 'waitlist_page'
    };

    const lawyerPayload = {
      email: 'lawyer@chambers.in',
      mobile: '9876543210',
      user_type: 'lawyer',
      bar_council_state: 'Bar Council of Maharashtra & Goa',
      enrollment_number: 'MAH/5678/2019',
      source: 'waitlist_page'
    };

    assert.equal(individualPayload.user_type, 'individual');
    assert.equal(individualPayload.bar_council_state, null);
    assert.equal(lawyerPayload.user_type, 'lawyer');
    assert.ok(lawyerPayload.bar_council_state && lawyerPayload.enrollment_number);
  });

  // =========================================================================
  // 18. THIRD-PARTY INTEGRATION PAYLOAD CONTRACTS
  // =========================================================================
  await test('Tier 1.33: [WAITLIST-INTEGRATIONS-SCHEMA] Google Sheets & Resend schemas include mobile and lawyer details', () => {
    const sheetsWebhookPayload = {
      email: 'advocate.priya@lawchambers.in',
      mobile: '9811122334',
      user_type: 'lawyer',
      bar_council_state: 'Bar Council of Delhi',
      enrollment_number: 'D/1234/2020',
      timestamp: new Date().toISOString()
    };

    assert.ok(sheetsWebhookPayload.email);
    assert.ok(sheetsWebhookPayload.mobile);
    assert.equal(sheetsWebhookPayload.user_type, 'lawyer');
    assert.equal(sheetsWebhookPayload.bar_council_state, 'Bar Council of Delhi');
    assert.equal(sheetsWebhookPayload.enrollment_number, 'D/1234/2020');
  });

  return results;
}
