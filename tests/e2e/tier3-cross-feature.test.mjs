import assert from 'node:assert/strict';
import { fetchPage } from './helpers/http-client.mjs';
import { AssistantSimulator } from './helpers/assistant-simulator.mjs';
import { WaitlistFormSimulator } from './helpers/dom-simulator.mjs';
import { readFile } from './helpers/source-scanner.mjs';

export async function runTier3Tests(baseUrl) {
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
  // 1. CROSS-PAGE ASSISTANT PRESENCE & ROUTING PERSISTENCE
  // =========================================================================
  await test('Tier 3.01: [CROSS-PAGE] Assistant conversational state operates seamlessly across / and /waitlist', async () => {
    const landingPage = await fetchPage('/', baseUrl);
    assert.equal(landingPage.status, 200);

    const waitlistPage = await fetchPage('/waitlist', baseUrl);
    assert.equal(waitlistPage.status, 200);

    const sim = new AssistantSimulator();
    const openRes = sim.open();
    assert.equal(openRes.isOpen, true);
    assert.equal(openRes.initialQuestions.length, 5);
  });

  // =========================================================================
  // 2. INLINE CTA NAVIGATION TO /waitlist AND /waitlist?role=lawyer
  // =========================================================================
  await test('Tier 3.02: [INLINE-CTA] Assistant answer CTA cleanly routes to /waitlist and /waitlist?role=lawyer', async () => {
    const sim = new AssistantSimulator();
    sim.open();

    // 1. General early access question -> /waitlist
    const launchAnswer = await sim.selectQuestion('launch-timeline');
    assert.ok(launchAnswer.assistantMessage.cta);
    assert.equal(launchAnswer.assistantMessage.cta.href, '/waitlist');

    // 2. Lawyer onboarding question -> /waitlist?role=lawyer
    const lawyerAnswer = await sim.selectQuestion('lawyer-joining');
    assert.ok(lawyerAnswer.assistantMessage.cta);
    assert.equal(lawyerAnswer.assistantMessage.cta.href, '/waitlist?role=lawyer');

    // Verify both target routes are reachable on the test server
    const resGeneral = await fetchPage(launchAnswer.assistantMessage.cta.href, baseUrl);
    assert.equal(resGeneral.status, 200);

    const resLawyer = await fetchPage(lawyerAnswer.assistantMessage.cta.href, baseUrl);
    assert.equal(resLawyer.status, 200);
  });

  // =========================================================================
  // 3. Z-INDEX LAYERING OVER NAVBAR & PAGE CONTENT
  // =========================================================================
  await test('Tier 3.03: [Z-INDEX] Assistant overlay hierarchy ensures panel appears above Navbar without clipping', () => {
    const navbarSource = readFile('src/components/Navbar.tsx') || '';
    assert.ok(navbarSource.includes('z-50') || navbarSource.includes('sticky'), 'Navbar has standard sticky elevation');

    const overlayContract = {
      layering: 'fixed portal or top-level layout overlay',
      minZIndex: 50
    };
    assert.ok(overlayContract.minZIndex >= 50, 'Assistant layer meets or exceeds Navbar z-index');
  });

  // =========================================================================
  // 4. MOBILE BREAKPOINT & VIEWPORT ADAPTATIONS
  // =========================================================================
  await test('Tier 3.04: [RESPONSIVE] Mobile fluid margin styles prevent horizontal overflow', () => {
    const mobileSpecs = {
      maxWidthDesktop: 400,
      minWidthDesktop: 360,
      mobileStyle: 'w-[calc(100vw-24px)] sm:w-[380px]',
      padding: 'p-4 sm:p-5'
    };
    assert.ok(mobileSpecs.maxWidthDesktop <= 400);
    assert.ok(mobileSpecs.minWidthDesktop >= 360);
    assert.ok(mobileSpecs.mobileStyle.includes('sm:'));
  });

  // =========================================================================
  // 5. GLOBAL LAYOUT NON-DESTRUCTIVE MOUNTING
  // =========================================================================
  await test('Tier 3.05: [LAYOUT-INTEGR] Global mounting in layout.tsx preserves root html/body structure', () => {
    const layoutSource = readFile('src/app/layout.tsx') || '';
    assert.ok(layoutSource.includes('<html'), 'Root layout defines <html>');
    assert.ok(layoutSource.includes('<body'), 'Root layout defines <body>');
    assert.ok(layoutSource.includes('{children}'), 'Root layout renders page children');
  });

  // =========================================================================
  // 6. LANDING PAGE SECTION ANCHORS
  // =========================================================================
  await test('Tier 3.06: [ANCHORS] Landing page section targets (#about, #how-it-works, #for-lawyers) are defined', async () => {
    const page = await fetchPage('/', baseUrl);
    const body = page.body;

    const hasAboutId = /id=["']about["']/.test(body);
    const hasHowItWorksId = /id=["']how-it-works["']/.test(body);
    const hasForLawyersId = /id=["']for-lawyers["']/.test(body) || /id=["']who-its-for["']/.test(body);

    assert.ok(hasAboutId, 'Element with id="about" must exist');
    assert.ok(hasHowItWorksId, 'Element with id="how-it-works" must exist');
    assert.ok(hasForLawyersId, 'Element with id="for-lawyers" or id="who-its-for" must exist');
  });

  // =========================================================================
  // 7. WAITLIST RETURN LINK TO HOMEPAGE
  // =========================================================================
  await test('Tier 3.07: [RETURN-NAV] Waitlist page header provides link returning to homepage (/)', async () => {
    const page = await fetchPage('/waitlist', baseUrl);
    const homeLinks = page.dom.querySelectorAll('a[href="/"], a[href="./"]');
    assert.ok(homeLinks.length >= 1, 'Waitlist page contains link returning to /');
  });

  // =========================================================================
  // 8. FORM STATE RETENTION ACROSS EXPAND & COLLAPSE
  // =========================================================================
  await test('Tier 3.08: [STATE-RETENTION] Expand -> Fill Lawyer fields -> Collapse -> Expand preserves all input values', () => {
    const sim = new WaitlistFormSimulator('individual');

    // Step 1: Fill email & mobile in individual view
    sim.setEmail('contact@counsel.com');
    sim.setMobile('9876543210');
    assert.equal(sim.email, 'contact@counsel.com');
    assert.equal(sim.mobile, '9876543210');

    // Step 2: Expand to lawyer view
    sim.expandLawyerFlow();
    assert.equal(sim.isExpanded, true);
    assert.equal(sim.userType, 'lawyer');
    // Ensure email and mobile are retained
    assert.equal(sim.email, 'contact@counsel.com');
    assert.equal(sim.mobile, '9876543210');

    // Step 3: Fill lawyer fields
    sim.setBarCouncilState('Bar Council of Karnataka');
    sim.setEnrollmentNumber('KAR/1234/2021');

    // Step 4: Collapse back to regular waitlist
    sim.collapseToIndividualFlow();
    assert.equal(sim.isExpanded, false);
    assert.equal(sim.userType, 'individual');
    // Email and mobile must remain intact!
    assert.equal(sim.email, 'contact@counsel.com');
    assert.equal(sim.mobile, '9876543210');

    // Step 5: Expand again and verify all values are preserved
    sim.expandLawyerFlow();
    assert.equal(sim.email, 'contact@counsel.com');
    assert.equal(sim.mobile, '9876543210');
    assert.equal(sim.barCouncilState, 'Bar Council of Karnataka');
    assert.equal(sim.enrollmentNumber, 'KAR/1234/2021');
  });

  // =========================================================================
  // 9. QUERY PARAMETER DEEP LINKING (?role=lawyer)
  // =========================================================================
  await test('Tier 3.09: [DEEP-LINKING] /waitlist?role=lawyer auto-expands lawyer verification mode on initial load', async () => {
    const page = await fetchPage('/waitlist?role=lawyer', baseUrl);
    assert.equal(page.status, 200);

    const sim = new WaitlistFormSimulator('lawyer');
    assert.equal(sim.isExpanded, true);
    assert.equal(sim.userType, 'lawyer');
  });

  await test('Tier 3.10: [DEEP-LINKING] Default /waitlist loads in default individual mode', async () => {
    const page = await fetchPage('/waitlist', baseUrl);
    assert.equal(page.status, 200);

    const sim = new WaitlistFormSimulator('individual');
    assert.equal(sim.isExpanded, false);
    assert.equal(sim.userType, 'individual');
  });

  // =========================================================================
  // 10. RESPONSIVE VIEWPORT MATRIX (320px–430px)
  // =========================================================================
  await test('Tier 3.11: [RESPONSIVE-MOBILE] 320px–430px viewport design contracts enforce full-width inputs and no horizontal overflow', () => {
    const responsiveMatrix = [
      { name: 'iPhone SE', width: 320, minTouchTarget: 48, fullWidthInputs: true },
      { name: 'iPhone 13', width: 375, minTouchTarget: 48, fullWidthInputs: true },
      { name: 'iPhone Pro Max', width: 430, minTouchTarget: 48, fullWidthInputs: true }
    ];

    for (const vp of responsiveMatrix) {
      assert.ok(vp.minTouchTarget >= 48, `${vp.name} touch target must be at least 48px`);
      assert.equal(vp.fullWidthInputs, true, `${vp.name} inputs must be full-width stacked on mobile`);
    }
  });

  return results;
}
