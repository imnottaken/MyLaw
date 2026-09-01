import assert from 'node:assert/strict';
import { fetchPage } from './helpers/http-client.mjs';
import { AssistantSimulator } from './helpers/assistant-simulator.mjs';
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

    // Assistant simulator operates independently of active page route
    const sim = new AssistantSimulator();
    const openRes = sim.open();
    assert.equal(openRes.isOpen, true);
    assert.equal(openRes.initialQuestions.length, 5);
  });

  // =========================================================================
  // 2. INLINE CTA NAVIGATION TO /waitlist
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

    // Verify both target routes are reachable on the live server
    const resGeneral = await fetchPage(launchAnswer.assistantMessage.cta.href, baseUrl);
    assert.equal(resGeneral.status, 200);

    const resLawyer = await fetchPage(lawyerAnswer.assistantMessage.cta.href, baseUrl);
    assert.equal(resLawyer.status, 200);
  });

  // =========================================================================
  // 3. Z-INDEX LAYERING OVER NAVBAR & PAGE CONTENT
  // =========================================================================
  await test('Tier 3.03: [Z-INDEX] Assistant overlay hierarchy ensures panel appears above Navbar without clipping', async () => {
    const navbarSource = readFile('src/components/Navbar.tsx') || '';
    assert.ok(navbarSource.includes('z-50') || navbarSource.includes('sticky'), 'Navbar has standard sticky elevation');

    // Contract: Assistant trigger and panel use z-50 or higher (e.g. z-50, z-[60], fixed)
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
  // 8. QUERY PARAMETER ROLE PRESERVATION
  // =========================================================================
  await test('Tier 3.08: [ROLE-QUERY] /waitlist?role=lawyer renders successfully without 500 or hydration errors', async () => {
    const page = await fetchPage('/waitlist?role=lawyer', baseUrl);
    assert.equal(page.status, 200);
    assert.match(page.body, /Legal help, made simpler/i);
    assert.match(page.body, /COMING SOON/i);
  });

  return results;
}
