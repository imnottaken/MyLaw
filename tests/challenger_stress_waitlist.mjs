#!/usr/bin/env node

/**
 * tests/challenger_stress_waitlist.mjs
 * 
 * CHALLENGER 1: ADVERSARIAL STRESS TEST SUITE FOR MYLAW WAITLIST
 * 
 * Comprehensive empirical stress testing covering:
 * 1. Rapid Toggle & State Machine Invariants (150+ cycles of expand/collapse & interleaved edits)
 * 2. Mobile Normalization Edge Cases (valid formats, invalid prefixes, alphabets, SQLi/XSS in phone)
 * 3. Extreme Inputs & Security Fuzzing (SQL injection, XSS payloads, 10,000 char Unicode, emojis, null bytes)
 * 4. High-Concurrency Burst Simulation & Postgres 23505 Race Conditions
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { WaitlistFormSimulator, INDIAN_STATE_BAR_COUNCILS } from './e2e/helpers/dom-simulator.mjs';

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Test result accumulator
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: []
};

async function test(name, fn) {
  testResults.total++;
  const start = Date.now();
  try {
    await fn();
    testResults.passed++;
    const duration = Date.now() - start;
    console.log(`  ✓ PASS: ${name} (${duration}ms)`);
  } catch (err) {
    testResults.failed++;
    const duration = Date.now() - start;
    testResults.failures.push({ name, error: err.message, stack: err.stack, duration });
    console.error(`  ✗ FAIL: ${name} (${duration}ms)`);
    console.error(`    Error: ${err.message}`);
  }
}

async function postWaitlist(payload, baseUrl = BASE_URL) {
  const url = `${baseUrl}/api/waitlist`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

// =========================================================================
// SUITE 1: RAPID TOGGLE & STATE MACHINE INVARIANTS (150+ CYCLES)
// =========================================================================
async function runSuite1() {
  console.log('\n======================================================================');
  console.log('▶ [Suite 1] Rapid Toggle & State Retention Stress (150+ Cycles)');
  console.log('======================================================================');

  await test('1.1: 150 consecutive expand/collapse cycles retain email and mobile perfectly', async () => {
    const sim = new WaitlistFormSimulator('individual');
    const initialEmail = 'advocate.toggle@delhibar.org';
    const initialMobile = '+91 98765-43210';

    sim.setEmail(initialEmail);
    sim.setMobile(initialMobile);

    for (let i = 0; i < 150; i++) {
      if (i % 2 === 0) {
        sim.expandLawyerFlow();
        assert.equal(sim.userType, 'lawyer', `Cycle ${i}: Expected userType to be lawyer`);
        assert.equal(sim.isExpanded, true, `Cycle ${i}: Expected isExpanded to be true`);
      } else {
        sim.collapseToIndividualFlow();
        assert.equal(sim.userType, 'individual', `Cycle ${i}: Expected userType to be individual`);
        assert.equal(sim.isExpanded, false, `Cycle ${i}: Expected isExpanded to be false`);
      }

      assert.equal(sim.email, initialEmail, `Cycle ${i}: Email lost or mutated`);
      assert.equal(sim.mobile, initialMobile, `Cycle ${i}: Mobile lost or mutated`);
    }
  });

  await test('1.2: 150 cycles with fully populated lawyer fields retain bar council and enrollment', async () => {
    const sim = new WaitlistFormSimulator('lawyer');
    const email = 'kavita.sharma@advocates.in';
    const mobile = '9810098100';
    const barCouncil = 'Bar Council of Maharashtra & Goa';
    const enrollment = 'MAH/4567/2019';

    sim.setEmail(email);
    sim.setMobile(mobile);
    sim.setBarCouncilState(barCouncil);
    sim.setEnrollmentNumber(enrollment);

    for (let i = 0; i < 150; i++) {
      if (i % 2 === 0) {
        sim.collapseToIndividualFlow();
      } else {
        sim.expandLawyerFlow();
      }
      assert.equal(sim.email, email, `Cycle ${i}: Email modified`);
      assert.equal(sim.mobile, mobile, `Cycle ${i}: Mobile modified`);
      assert.equal(sim.barCouncilState, barCouncil, `Cycle ${i}: Bar council lost`);
      assert.equal(sim.enrollmentNumber, enrollment, `Cycle ${i}: Enrollment number lost`);
    }
  });

  await test('1.3: Interleaved edits during rapid toggles preserve latest inputs without race corruption', async () => {
    const sim = new WaitlistFormSimulator('individual');
    sim.setEmail('v1@example.com');
    sim.setMobile('9876543210');

    for (let i = 0; i < 100; i++) {
      sim.expandLawyerFlow();
      if (i === 25) {
        sim.setEmail('v2_edited@example.com');
      }
      if (i === 50) {
        sim.setMobile('9123456780');
        sim.setBarCouncilState('Bar Council of Karnataka');
      }
      if (i === 75) {
        sim.setEnrollmentNumber('KAR/123/2021');
      }
      sim.collapseToIndividualFlow();
    }

    assert.equal(sim.email, 'v2_edited@example.com');
    assert.equal(sim.mobile, '9123456780');
    assert.equal(sim.barCouncilState, 'Bar Council of Karnataka');
    assert.equal(sim.enrollmentNumber, 'KAR/123/2021');
  });

  await test('1.4: Codebase AST verification: WaitlistForm.tsx maintains independent React state hooks', async () => {
    const formCode = fs.readFileSync(path.resolve('src/components/waitlist/WaitlistForm.tsx'), 'utf8');
    assert.match(formCode, /const\s+\[email,\s*setEmail\]\s*=\s*useState/);
    assert.match(formCode, /const\s+\[mobile,\s*setMobile\]\s*=\s*useState/);
    assert.match(formCode, /const\s+\[barCouncilState,\s*setBarCouncilState\]\s*=\s*useState/);
    assert.match(formCode, /const\s+\[enrollmentNumber,\s*setEnrollmentNumber\]\s*=\s*useState/);
    assert.match(formCode, /const\s+\[userType,\s*setUserType\]\s*=\s*useState/);
  });
}

// =========================================================================
// SUITE 2: MOBILE NORMALIZATION & BOUNDARY EDGE CASES
// =========================================================================
async function runSuite2() {
  console.log('\n======================================================================');
  console.log('▶ [Suite 2] Mobile Normalization & Boundary Matrix');
  console.log('======================================================================');

  const validFormats = [
    { raw: '+91 98765-43210', expected: '9876543210' },
    { raw: '09876543210', expected: '9876543210' },
    { raw: '919876543210', expected: '9876543210' },
    { raw: '+91 (987) 654-3210', expected: '9876543210' },
    { raw: '+919876543210', expected: '9876543210' },
    { raw: '9876543210', expected: '9876543210' },
    { raw: '+91-98765-43210', expected: '9876543210' },
    { raw: '(0) 9876543210', expected: '9876543210' },
    { raw: ' +91 98765 43210 ', expected: '9876543210' },
    { raw: '+91  98765   43210', expected: '9876543210' },
    { raw: '+91-(987)-654-3210', expected: '9876543210' }
  ];

  await test('2.1: DOM Simulator validates all 11 Indian mobile representations to 10-digit core', async () => {
    const sim = new WaitlistFormSimulator();
    for (const { raw, expected } of validFormats) {
      const res = sim.validateMobile(raw);
      assert.equal(res.valid, true, `Format "${raw}" failed validation`);
      assert.equal(res.sanitized, expected, `Format "${raw}" sanitized incorrectly to "${res.sanitized}"`);
    }
  });

  await test('2.2: Live API POST /api/waitlist normalizes varied mobile phone formats to standard 10 digits', async () => {
    let index = 0;
    for (const { raw, expected } of validFormats) {
      index++;
      const uniqueEmail = `normalization_test_${Date.now()}_${index}@mylaw-test.internal`;
      const res = await postWaitlist({
        email: uniqueEmail,
        mobile: raw,
        user_type: 'individual'
      });

      assert.equal(res.status, 200, `POST failed for mobile format "${raw}": ${JSON.stringify(res.data)}`);
      assert.equal(res.data.success, true);
      assert.equal(res.data.data.mobile, expected, `API stored "${res.data.data.mobile}" instead of "${expected}" for format "${raw}"`);
    }
  });

  const invalidMobiles = [
    { val: '', desc: 'empty string' },
    { val: '   ', desc: 'whitespace only' },
    { val: '12345', desc: '5 digits (too short)' },
    { val: '987654321', desc: '9 digits (too short)' },
    { val: '98765432101234', desc: '14 digits (too long)' },
    { val: '+91 98765-4321a', desc: 'contains alphabet char' },
    { val: '+1 9876543210', desc: 'US country code +1' },
    { val: '+44 7911 123456', desc: 'UK phone number' },
    { val: '9876543210; DROP TABLE waitlist;--', desc: 'SQL injection string' },
    { val: '<script>alert(1)</script>', desc: 'XSS script payload' },
    { val: '+91 98765#43210', desc: 'invalid special character #' },
    { val: '009876543210', desc: 'double leading zero' }
  ];

  await test('2.3: Live API POST /api/waitlist rejects all invalid mobile representations with HTTP 400', async () => {
    let count = 0;
    for (const { val, desc } of invalidMobiles) {
      count++;
      const testEmail = `invalid_mobile_test_${Date.now()}_${count}@mylaw-test.internal`;
      const res = await postWaitlist({
        email: testEmail,
        mobile: val,
        user_type: 'individual'
      });

      assert.equal(res.status, 400, `Expected 400 for invalid mobile "${val}" (${desc}), got ${res.status}`);
      assert.equal(res.data.success, false);
      assert.ok(res.data.error.includes('mobile') || res.data.error.includes('10-digit'));
    }
  });
}

// =========================================================================
// SUITE 3: EXTREME INPUTS & SECURITY FUZZING
// =========================================================================
async function runSuite3() {
  console.log('\n======================================================================');
  console.log('▶ [Suite 3] Extreme Inputs & Security Fuzzing (SQLi, XSS, Unicode, 10k chars)');
  console.log('======================================================================');

  const sqliPayloads = [
    "' OR '1'='1",
    "admin'--",
    "'; DROP TABLE waitlist; --",
    "' UNION SELECT id, email, mobile, user_type FROM waitlist --",
    "' OR 1=1; --",
    "1'; WAITFOR DELAY '0:0:2'--"
  ];

  await test('3.1: SQL injection payloads in enrollment_number handled safely via parameterization', async () => {
    for (const payload of sqliPayloads) {
      const email = `sqli_enrollment_${Date.now()}_${Math.random().toString(36).slice(2)}@mylaw-test.internal`;
      const res = await postWaitlist({
        email,
        mobile: '9876543210',
        user_type: 'lawyer',
        bar_council_state: 'Bar Council of Delhi',
        enrollment_number: payload
      });

      assert.equal(res.status, 200, `Expected 200 handled parameterization, got ${res.status}`);
      assert.equal(res.data.success, true);
      assert.equal(res.data.data.enrollment_number, payload.trim().toUpperCase());
    }
  });

  await test('3.2: Malformed SQL injection email attempts rejected with HTTP 400; RFC valid names preserved safely', async () => {
    // 1. Raw SQLi payloads (spaces, semicolons, quotes outside RFC) must return 400
    const malformedSqliEmails = [
      "test' OR '1'='1",
      "'; DROP TABLE waitlist; --@example.com",
      "admin' OR '1'='1'--@example.com",
      "user union select * from waitlist@example.com",
      "user;--@example.com"
    ];

    for (const badEmail of malformedSqliEmails) {
      const res = await postWaitlist({
        email: badEmail,
        mobile: '9876543210',
        user_type: 'individual'
      });

      assert.equal(res.status, 400, `Expected 400 for SQLi email "${badEmail}", got ${res.status}`);
      assert.equal(res.data.success, false);
    }

    // 2. RFC-valid names with quotes (e.g. o'connor) safely parameterized
    const rfcValidEmail = `advocate.o'connor_${Date.now()}@mylaw-test.internal`;
    const rfcRes = await postWaitlist({
      email: rfcValidEmail,
      mobile: '9876543210',
      user_type: 'individual'
    });
    assert.equal(rfcRes.status, 200);
    assert.equal(rfcRes.data.success, true);
    assert.equal(rfcRes.data.data.email, rfcValidEmail.toLowerCase());
  });

  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(document.cookie)>',
    '"><svg onload=alert(1)>',
    '<iframe src="javascript:alert(1)"></iframe>',
    'javascript:alert(1)'
  ];

  await test('3.3: XSS payloads in enrollment_number sanitized to uppercase string without execution', async () => {
    for (const payload of xssPayloads) {
      const email = `xss_test_${Date.now()}_${Math.random().toString(36).slice(2)}@mylaw-test.internal`;
      const res = await postWaitlist({
        email,
        mobile: '9876543210',
        user_type: 'lawyer',
        bar_council_state: 'Bar Council of Karnataka',
        enrollment_number: payload
      });

      assert.equal(res.status, 200);
      assert.equal(res.data.success, true);
      assert.equal(res.data.data.enrollment_number, payload.trim().toUpperCase());
    }
  });

  await test('3.4: Massive 10,000-character inputs survive gracefully without server crash or 500 errors', async () => {
    // 1. 10,000-char string in source metadata parameter
    const longSource = 'source_' + 'S'.repeat(10000);
    const sourceEmail = `massive_source_${Date.now()}@mylaw-test.internal`;
    const sourceRes = await postWaitlist({
      email: sourceEmail,
      mobile: '9876543210',
      user_type: 'individual',
      source: longSource
    });
    assert.notEqual(sourceRes.status, 500, 'Long source must not trigger 500 error');
    assert.equal(sourceRes.data.success, true);

    // 2. 10,000-char string in enrollment number
    const longEnrollment = 'D/' + '9'.repeat(10000) + '/2026';
    const lawyerEmail = `massive_enrollment_${Date.now()}@mylaw-test.internal`;
    const enrollRes = await postWaitlist({
      email: lawyerEmail,
      mobile: '9876543210',
      user_type: 'lawyer',
      bar_council_state: 'Bar Council of Delhi',
      enrollment_number: longEnrollment
    });

    assert.notEqual(enrollRes.status, 500, 'Long enrollment must not trigger 500 error');
    assert.equal(enrollRes.status, 200);
    assert.equal(enrollRes.data.success, true);
    assert.equal(enrollRes.data.data.enrollment_number.length, longEnrollment.length);
  });

  await test('3.5: Multi-byte Unicode, emojis, and RTL character handling in fields', async () => {
    const emojiEnrollment = 'D/1234/2026 ⚖️ 🔥 🛡️ 🏛️ 🚀';
    const email = `emoji_test_${Date.now()}@mylaw-test.internal`;

    const res = await postWaitlist({
      email,
      mobile: '+91 98765 43210',
      user_type: 'lawyer',
      bar_council_state: 'Bar Council of West Bengal',
      enrollment_number: emojiEnrollment
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.enrollment_number, emojiEnrollment.trim().toUpperCase());
  });

  await test('3.6: Strict State Bar Council whitelist validation: unauthorized bar council strings rejected', async () => {
    const invalidCouncils = [
      'Bar Council of London',
      'Bar Council of New York',
      'Bar Council of Mars',
      '<script>alert(1)</script>',
      'Bar Council of Delhi; DROP TABLE waitlist;'
    ];

    for (const council of invalidCouncils) {
      const email = `bad_council_${Date.now()}@mylaw-test.internal`;
      const res = await postWaitlist({
        email,
        mobile: '9876543210',
        user_type: 'lawyer',
        bar_council_state: council,
        enrollment_number: 'D/1234/2020'
      });

      assert.equal(res.status, 400, `Expected 400 for invalid council "${council}"`);
      assert.equal(res.data.success, false);
      assert.match(res.data.error, /State Bar Council/i);
    }
  });
}

// =========================================================================
// SUITE 4: CONCURRENT SUBMISSIONS & POSTGRES 23505 RACE CONDITIONS
// =========================================================================
async function runSuite4() {
  console.log('\n======================================================================');
  console.log('▶ [Suite 4] High Concurrency Simulation & Postgres 23505 Race Conditions');
  console.log('======================================================================');

  await test('4.1: High-concurrency race condition: 20 simultaneous submissions with identical email', async () => {
    const raceEmail = `race_condition_${Date.now()}@mylaw-test.internal`;
    const concurrency = 20;

    const promises = Array.from({ length: concurrency }, (_, i) =>
      postWaitlist({
        email: raceEmail,
        mobile: `98765${String(10000 + i)}`,
        user_type: 'individual'
      })
    );

    const responses = await Promise.all(promises);

    let successCreatedCount = 0;
    let alreadyRegisteredCount = 0;
    let failedCount = 0;

    for (const res of responses) {
      assert.equal(res.status, 200, `Concurrent request failed with status ${res.status}: ${JSON.stringify(res.data)}`);
      assert.equal(res.data.success, true);
      if (res.data.data && res.data.data.id) {
        successCreatedCount++;
      } else if (res.data.alreadyRegistered) {
        alreadyRegisteredCount++;
      } else {
        failedCount++;
      }
    }

    // Exactly 1 request successfully inserts, and 19 catch code 23505 gracefully
    assert.equal(successCreatedCount, 1, `Expected exactly 1 new record created, got ${successCreatedCount}`);
    assert.equal(alreadyRegisteredCount, concurrency - 1, `Expected ${concurrency - 1} duplicate handles, got ${alreadyRegisteredCount}`);
    assert.equal(failedCount, 0, `Expected 0 unhandled failures`);
  });

  await test('4.2: Parallel burst of 30 distinct registrations (15 Individuals + 15 Lawyers)', async () => {
    const count = 30;
    const promises = Array.from({ length: count }, (_, i) => {
      const isLawyer = i % 2 === 0;
      const email = `parallel_burst_${Date.now()}_${i}@mylaw-test.internal`;
      return postWaitlist({
        email,
        mobile: `98100${String(10000 + i)}`,
        user_type: isLawyer ? 'lawyer' : 'individual',
        bar_council_state: isLawyer ? 'Bar Council of Delhi' : null,
        enrollment_number: isLawyer ? `D/${1000 + i}/2024` : null
      });
    });

    const responses = await Promise.all(promises);

    for (let i = 0; i < count; i++) {
      const res = responses[i];
      assert.equal(res.status, 200, `Burst item ${i} failed: ${JSON.stringify(res.data)}`);
      assert.equal(res.data.success, true);
      const isLawyer = i % 2 === 0;
      assert.equal(res.data.data.user_type, isLawyer ? 'lawyer' : 'individual');
    }
  });

  await test('4.3: Mixed stress burst of 40 simultaneous requests (valid, invalid, duplicate, SQLi)', async () => {
    const duplicateEmail = `mixed_dup_${Date.now()}@mylaw-test.internal`;

    // Pre-insert duplicate email
    await postWaitlist({ email: duplicateEmail, mobile: '9876543210', user_type: 'individual' });

    const requests = [];
    for (let i = 0; i < 40; i++) {
      if (i % 4 === 0) {
        // Valid fresh email
        requests.push(postWaitlist({
          email: `mixed_fresh_${Date.now()}_${i}@mylaw-test.internal`,
          mobile: '9876543210',
          user_type: 'individual'
        }));
      } else if (i % 4 === 1) {
        // Duplicate email
        requests.push(postWaitlist({
          email: duplicateEmail,
          mobile: '9876543210',
          user_type: 'individual'
        }));
      } else if (i % 4 === 2) {
        // Malformed mobile
        requests.push(postWaitlist({
          email: `mixed_badmob_${Date.now()}_${i}@mylaw-test.internal`,
          mobile: 'invalid-phone',
          user_type: 'individual'
        }));
      } else {
        // Malformed email
        requests.push(postWaitlist({
          email: 'not-an-email',
          mobile: '9876543210',
          user_type: 'individual'
        }));
      }
    }

    const responses = await Promise.all(requests);
    assert.equal(responses.length, 40);

    for (let i = 0; i < 40; i++) {
      const res = responses[i];
      if (i % 4 === 0) {
        assert.equal(res.status, 200, `Item ${i} (valid) expected 200`);
        assert.equal(res.data.success, true);
      } else if (i % 4 === 1) {
        assert.equal(res.status, 200, `Item ${i} (duplicate) expected 200`);
        assert.equal(res.data.alreadyRegistered, true);
      } else {
        assert.equal(res.status, 400, `Item ${i} (invalid) expected 400`);
        assert.equal(res.data.success, false);
      }
    }
  });
}

// =========================================================================
// RUN ALL SUITES
// =========================================================================
async function main() {
  console.log('======================================================================');
  console.log('   CHALLENGER 1: ADVERSARIAL WAITLIST STRESS TEST HARNESS             ');
  console.log('======================================================================');
  console.log(`Target URL: ${BASE_URL}\n`);

  const startTime = Date.now();

  try {
    await runSuite1();
    await runSuite2();
    await runSuite3();
    await runSuite4();
  } catch (err) {
    console.error('Suite error:', err);
  }

  const duration = Date.now() - startTime;

  console.log('\n======================================================================');
  console.log('CHALLENGER 1 STRESS TEST RESULTS:');
  console.log(`  Total Tests : ${testResults.total}`);
  console.log(`  Passed      : ${testResults.passed}`);
  console.log(`  Failed      : ${testResults.failed}`);
  console.log(`  Duration    : ${duration}ms`);
  console.log('======================================================================\n');

  if (testResults.failed > 0) {
    console.error(`Verdict: REJECT (${testResults.failed} tests failed)`);
    process.exit(1);
  } else {
    console.log('Verdict: APPROVE (All adversarial stress tests passed cleanly with 0 defects)');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
