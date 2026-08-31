import assert from 'node:assert/strict';
import { fetchPage } from './helpers/http-client.mjs';

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

  // 1. Landing Page Section Target Anchors
  await test('Tier 3.01: Landing page defines section ID targets corresponding to navbar links (#about, #how-it-works, #for-lawyers)', async () => {
    const page = await fetchPage('/', baseUrl);
    const body = page.body;

    const hasAboutId = /id=["']about["']/.test(body);
    const hasHowItWorksId = /id=["']how-it-works["']/.test(body);
    const hasForLawyersId = /id=["']for-lawyers["']/.test(body) || /id=["']who-its-for["']/.test(body);

    assert.ok(hasAboutId, 'Landing page must contain element with id="about"');
    assert.ok(hasHowItWorksId, 'Landing page must contain element with id="how-it-works"');
    assert.ok(hasForLawyersId, 'Landing page must contain element with id="for-lawyers" or id="who-its-for"');
  });

  // 2. Navigation Links Alignment
  await test('Tier 3.02: Navbar navigation anchors correctly map to corresponding landing page sections', async () => {
    const page = await fetchPage('/', baseUrl);
    const links = page.dom.querySelectorAll('nav a, header a');
    const hrefs = links.map(l => l.getAttribute('href') || '');

    assert.ok(
      hrefs.some(h => h === '#about' || h === '/#about' || h.endsWith('#about')),
      'Navbar must contain an anchor linking to #about'
    );
    assert.ok(
      hrefs.some(h => h === '#how-it-works' || h === '/#how-it-works' || h.endsWith('#how-it-works')),
      'Navbar must contain an anchor linking to #how-it-works'
    );
    assert.ok(
      hrefs.some(h => h === '#for-lawyers' || h === '/#for-lawyers' || h.endsWith('#for-lawyers') || h.includes('for-lawyers')),
      'Navbar must contain an anchor linking to #for-lawyers'
    );
  });

  // 3. CTA to /waitlist Convergence
  await test('Tier 3.03: All primary CTA buttons across Landing sections route to /waitlist', async () => {
    const page = await fetchPage('/', baseUrl);
    const allLinks = page.dom.querySelectorAll('a');
    const waitlistLinks = allLinks.filter(a => {
      const href = a.getAttribute('href') || '';
      return href === '/waitlist' || href.startsWith('/waitlist?');
    });

    // There should be at least 4 waitlist CTAs: Navbar, Hero, Section 05 (Individuals or Lawyers), Section 07
    assert.ok(
      waitlistLinks.length >= 3,
      `Expected at least 3 waitlist CTAs across landing page, found ${waitlistLinks.length}`
    );
  });

  // 4. Hero "Learn More" Cross-Anchor
  await test('Tier 3.04: Hero secondary CTA "Learn More" connects to #how-it-works section', async () => {
    const page = await fetchPage('/', baseUrl);
    const learnMoreLinks = page.dom.querySelectorAll('a').filter(a => {
      return a.textContent.toLowerCase().includes('learn more');
    });

    assert.ok(learnMoreLinks.length >= 1, 'Expected "Learn More" link to exist in Hero');
    const href = learnMoreLinks[0].getAttribute('href') || '';
    assert.ok(
      href === '#how-it-works' || href === '/#how-it-works' || href.includes('how-it-works'),
      `"Learn More" CTA should link to #how-it-works, got ${href}`
    );
  });

  // 5. Section 05 "I'm a Lawyer" CTA Behavior
  await test('Tier 3.05: Section 05 "I\'m a Lawyer" CTA routes to /waitlist with role intent', async () => {
    const page = await fetchPage('/', baseUrl);
    const lawyerCtas = page.dom.querySelectorAll('a').filter(a => {
      const text = a.textContent.toLowerCase();
      return text.includes("i'm a lawyer") || text.includes("i’m a lawyer");
    });

    assert.ok(lawyerCtas.length >= 1, 'Expected "I\'m a Lawyer" CTA to exist');
    const href = lawyerCtas[0].getAttribute('href') || '';
    assert.ok(
      href.includes('waitlist'),
      `"I'm a Lawyer" CTA should route to /waitlist (or /waitlist?role=lawyer), got ${href}`
    );
  });

  // 6. Waitlist Page Back Link to Homepage
  await test('Tier 3.06: Waitlist page header and/or back button connects back to homepage (/)', async () => {
    const page = await fetchPage('/waitlist', baseUrl);
    const homeLinks = page.dom.querySelectorAll('a[href="/"], a[href="./"]');
    assert.ok(
      homeLinks.length >= 1,
      'Waitlist page should provide at least one link returning to homepage (/)'
    );
  });

  // 7. Role Query Parameter Handling
  await test('Tier 3.07: Waitlist page successfully renders when navigated with query parameter /waitlist?role=lawyer', async () => {
    const page = await fetchPage('/waitlist?role=lawyer', baseUrl);
    assert.equal(page.status, 200, `Expected HTTP 200 on /waitlist?role=lawyer, got ${page.status}`);
    assert.match(page.body, /Legal help, made simpler/i);
  });

  return results;
}
