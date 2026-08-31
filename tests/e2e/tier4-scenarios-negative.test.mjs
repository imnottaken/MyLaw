import assert from 'node:assert/strict';
import { fetchPage } from './helpers/http-client.mjs';
import { WaitlistFormSimulator } from './helpers/dom-simulator.mjs';
import { validateBrandProhibitions } from './helpers/source-scanner.mjs';

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

  // 1. Real-World Scenario: Full Consumer Discovery & Conversion Journey
  await test('Tier 4.01: Full Consumer Journey — Landing discovery -> Waitlist -> Individual role -> Submission -> Success State', async () => {
    // Step 1: User arrives at landing page
    const landing = await fetchPage('/', baseUrl);
    assert.equal(landing.status, 200, 'Landing page reachable');
    assert.match(landing.body, /Finding the right lawyer shouldn['’]t be difficult/i, 'User reads core hero value prop');
    assert.match(landing.body, /01[\s\S]*02[\s\S]*03/i, 'User reads 3-step process');
    assert.match(landing.body, /For Individuals/i, 'User identifies individual segment');

    // Step 2: User navigates to waitlist page
    const waitlist = await fetchPage('/waitlist', baseUrl);
    assert.equal(waitlist.status, 200, 'Waitlist page reachable');
    assert.match(waitlist.body, /COMING SOON/i);
    assert.match(waitlist.body, /Legal help, made simpler/i);

    // Step 3: User fills waitlist form as individual
    const formSim = new WaitlistFormSimulator();
    formSim.setEmail('alex.consumer@example.com');
    formSim.setRole('help');

    // Step 4: User submits form
    const submission = await formSim.submit();
    assert.equal(submission.success, true, 'Form submission successful');
    assert.equal(submission.email, 'alex.consumer@example.com');
    assert.equal(submission.role, 'help');
    assert.equal(submission.submitted, true);
    assert.match(submission.successMessage, /You['’]re on the list/i);
    assert.match(submission.successMessage, /Thanks for joining MyLaw/i);
  });

  // 2. Real-World Scenario: Legal Professional Journey
  await test('Tier 4.02: Full Lawyer Journey — Landing "For Lawyers" -> Waitlist -> Lawyer role -> Submission -> Success State', async () => {
    // Step 1: Lawyer visits landing page and reviews "For Lawyers" section
    const landing = await fetchPage('/', baseUrl);
    assert.equal(landing.status, 200);
    assert.match(landing.body, /For Lawyers/i);
    assert.match(landing.body, /Build your professional presence|connect with people looking for legal/i);

    // Step 2: Lawyer clicks "I'm a Lawyer" CTA and lands on /waitlist
    const waitlist = await fetchPage('/waitlist?role=lawyer', baseUrl);
    assert.equal(waitlist.status, 200);

    // Step 3: Lawyer completes submission with Lawyer role
    const formSim = new WaitlistFormSimulator('lawyer');
    formSim.setEmail('counsel.elena@lawchambers.co.uk');

    const submission = await formSim.submit();
    assert.equal(submission.success, true);
    assert.equal(submission.role, 'lawyer');
    assert.equal(submission.submitted, true);
    assert.match(submission.successMessage, /You['’]re on the list/i);
  });

  // 3. Negative Brand Assertions (Section 26 Prohibitions)
  await test('Tier 4.03: Negative Brand Check — Complete absence of gavels, scales of justice, and courtroom tropes', async () => {
    const brandCheck = validateBrandProhibitions();
    const gavelViolations = brandCheck.violations.filter(v =>
      v.rule.includes('gavel') || v.rule.includes('scales') || v.rule.includes('courtroom')
    );

    assert.equal(
      gavelViolations.length,
      0,
      `Detected prohibited legal imagery tropes in source files: ${JSON.stringify(gavelViolations)}`
    );
  });

  await test('Tier 4.04: Negative Brand Check — Complete absence of fake statistics and fabricated testimonials', async () => {
    const brandCheck = validateBrandProhibitions();
    const statViolations = brandCheck.violations.filter(v =>
      v.rule.includes('statistics') || v.rule.includes('testimonials')
    );

    assert.equal(
      statViolations.length,
      0,
      `Detected fake statistics or fake testimonials in source files: ${JSON.stringify(statViolations)}`
    );
  });

  await test('Tier 4.05: Negative Brand Check — Complete absence of black/gold luxury styles and purple AI hype gradients', async () => {
    const brandCheck = validateBrandProhibitions();
    const styleViolations = brandCheck.violations.filter(v =>
      v.rule.includes('luxury') || v.rule.includes('purple') || v.rule.includes('buzzword')
    );

    assert.equal(
      styleViolations.length,
      0,
      `Detected prohibited luxury or AI styling artifacts: ${JSON.stringify(styleViolations)}`
    );
  });

  return results;
}
