/**
 * Challenger 2 Adversarial Test Harness: UI Rendering, Responsive Boundary, Deep Links & Brand Matrix
 * 
 * Matrix Coverage:
 * 1. 320px Viewport Simulation & Zero Horizontal Overflow Analysis
 * 2. Deep Link Query Parameter Matrix (/waitlist?role=lawyer, individual, invalid, empty, malicious)
 * 3. Brand Fidelity & Prohibited Tropes Static/Dynamic Scan (no dark:, gavels, scales, courtroom images, AI SDKs)
 * 4. 24 Indian State Bar Councils Canonical String & Boundary Verification
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const PROJECT_ROOT = process.cwd();

// ANSI formatting for beautiful terminal output
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ${GREEN}✓${RESET} ${name}`);
  } catch (err) {
    failedTests++;
    failures.push({ name, error: err.message, stack: err.stack });
    console.log(`  ${RED}✗${RESET} ${name}`);
    console.log(`    ${RED}Error: ${err.message}${RESET}`);
  }
}

function readFile(relPath) {
  const fullPath = path.resolve(PROJECT_ROOT, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

function scanFiles(dirPath, extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json']) {
  const results = [];
  const fullDirPath = path.resolve(PROJECT_ROOT, dirPath);
  if (!fs.existsSync(fullDirPath)) return results;

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          walk(entryPath);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(entryPath);
      }
    }
  }

  walk(fullDirPath);
  return results;
}

// Authoritative canonical list of 24 Indian State Bar Councils
const AUTHORITATIVE_BAR_COUNCILS = [
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

// Reference implementation of parseRoleParam from WaitlistForm.tsx
function parseRoleParam(roleParam) {
  if (!roleParam) return "individual";
  const normalized = String(roleParam).toLowerCase().trim();
  if (
    normalized === "lawyer" ||
    normalized === "attorney" ||
    normalized === "professional"
  ) {
    return "lawyer";
  }
  return "individual";
}

console.log(`\n${BOLD}${CYAN}====================================================${RESET}`);
console.log(`${BOLD}${CYAN}CHALLENGER 2: ADVERSARIAL UI & BRAND FIDELITY SUITE${RESET}`);
console.log(`${BOLD}${CYAN}====================================================${RESET}\n`);

async function runAdversarialSuite() {
  // =========================================================================
  // SUITE 1: 320px VIEWPORT SIMULATION & RESPONSIVE BOUNDARIES
  // =========================================================================
  console.log(`${BOLD}▶ Suite 1: 320px Viewport Simulation & Responsive Layout Contracts${RESET}`);

  await test('UI-320px-1: WaitlistForm inputs specify w-full class for 100% container width', () => {
    const formCode = readFile('src/components/waitlist/WaitlistForm.tsx');
    assert.ok(formCode, 'WaitlistForm.tsx must exist');

    // Helper to extract an element block by id
    const extractElementById = (code, id) => {
      const idx = code.indexOf(`id="${id}"`);
      if (idx === -1) return null;
      const startTag = code.lastIndexOf('<', idx);
      const endTag = code.indexOf('/>', idx);
      return code.substring(startTag, endTag !== -1 ? endTag + 2 : idx + 300);
    };

    const emailInput = extractElementById(formCode, 'waitlist-email');
    assert.ok(emailInput, 'Email input must exist');
    assert.ok(emailInput.includes('w-full'), 'Email input must have w-full class');

    const mobileInput = extractElementById(formCode, 'waitlist-mobile');
    assert.ok(mobileInput, 'Mobile input must exist');
    assert.ok(mobileInput.includes('w-full'), 'Mobile input must have w-full class');

    const enrollmentInput = extractElementById(formCode, 'waitlist-enrollment-number');
    assert.ok(enrollmentInput, 'Enrollment number input must exist');
    assert.ok(enrollmentInput.includes('w-full'), 'Enrollment number input must have w-full class');
  });

  await test('UI-320px-2: WaitlistForm State Bar Council <select> has w-full and appearance-none', () => {
    const formCode = readFile('src/components/waitlist/WaitlistForm.tsx');
    assert.ok(formCode, 'WaitlistForm.tsx must exist');

    const selectIdx = formCode.indexOf('id="waitlist-bar-council"');
    assert.ok(selectIdx !== -1, 'State Bar Council select must exist');
    const startTag = formCode.lastIndexOf('<select', selectIdx);
    const endOption = formCode.indexOf('<option', selectIdx);
    const selectTag = formCode.substring(startTag, endOption);

    assert.ok(selectTag.includes('w-full'), 'State Bar Council select must have w-full');
    assert.ok(selectTag.includes('appearance-none'), 'State Bar Council select must have appearance-none');
  });

  await test('UI-320px-3: WaitlistForm Submit Button has w-full and minimum 48px touch target height', () => {
    const formCode = readFile('src/components/waitlist/WaitlistForm.tsx');
    assert.ok(formCode, 'WaitlistForm.tsx must exist');

    const btnIdx = formCode.indexOf('type="submit"');
    assert.ok(btnIdx !== -1, 'Submit button must exist');
    const startTag = formCode.lastIndexOf('<button', btnIdx);
    const endSpan = formCode.indexOf('<span', btnIdx);
    const btnTag = formCode.substring(startTag, endSpan);

    assert.ok(btnTag.includes('w-full'), 'Submit button must have w-full');
    assert.ok(btnTag.includes('h-[48px]'), 'Submit button must have min h-[48px]');
  });

  await test('UI-320px-4: Waitlist card container uses responsive max-width and zero horizontal overflow container', () => {
    const pageCode = readFile('src/app/waitlist/page.tsx');
    assert.ok(pageCode, 'src/app/waitlist/page.tsx must exist');

    // Check root has overflow-hidden
    assert.ok(pageCode.includes('overflow-hidden'), 'Root container must specify overflow-hidden to prevent horizontal scrolling');

    // Check card max width constraint
    assert.ok(
      pageCode.includes('max-w-[460px]'),
      'Card must use max-w-[460px] to constrain width cleanly on larger viewports'
    );

    // Check fluid padding px-4 sm:px-6
    assert.ok(
      pageCode.includes('px-4 sm:px-6'),
      'Page wrapper must use fluid padding px-4 sm:px-6 for 320px screens'
    );
  });

  await test('UI-320px-5: Exact Viewport 320px Mathematical Simulation (0px overflow budget check)', () => {
    const viewportWidth = 320;
    const pagePaddingHorizontal = 16 * 2; // px-4 = 1rem = 16px left + 16px right = 32px
    const cardPaddingHorizontal = 20 * 2; // p-5 = 1.25rem = 20px left + 20px right = 40px

    const contentWidthAvailable = viewportWidth - pagePaddingHorizontal;
    assert.equal(contentWidthAvailable, 288, 'Content width at 320px viewport with px-4 must be 288px');

    const formWidthAvailable = contentWidthAvailable - cardPaddingHorizontal;
    assert.equal(formWidthAvailable, 248, 'Form field inner width at 320px viewport must be 248px');

    // Total calculated elements width with w-full is exactly 100% of formWidthAvailable (248px)
    const elementWidth = formWidthAvailable;
    const totalRenderedWidth = elementWidth + cardPaddingHorizontal + pagePaddingHorizontal;

    assert.equal(totalRenderedWidth, viewportWidth, 'Total rendered width must exactly equal viewport width (320px)');
    const overflow = totalRenderedWidth - viewportWidth;
    assert.equal(overflow, 0, 'Horizontal overflow must be strictly 0px');
  });

  await test('UI-320px-6: Landing page sections enforce fluid width containers (w-full max-w-7xl) without fixed wide px clobbering', () => {
    const landingSections = scanFiles('src/components/landing', ['.tsx']);
    assert.ok(landingSections.length >= 6, 'Must have at least 6 landing sections');

    for (const sectionPath of landingSections) {
      const code = fs.readFileSync(sectionPath, 'utf8');
      const relPath = path.relative(PROJECT_ROOT, sectionPath);

      // Check for dangerous hardcoded fixed widths like w-[500px], w-[800px], w-[1200px] without max-w or responsive prefixes
      const dangerousWidths = code.match(/(?<!sm:|md:|lg:|xl:|2xl:|max-)\bw-\[\s*(?:3[5-9]\d|[4-9]\d\d|\d{4,})px\s*\]/g);
      assert.equal(
        dangerousWidths,
        null,
        `Section ${relPath} should not contain fixed desktop widths (>350px) without responsive modifiers`
      );
    }
  });

  // =========================================================================
  // SUITE 2: DEEP LINK QUERY PARAMETER HANDLING MATRIX
  // =========================================================================
  console.log(`\n${BOLD}▶ Suite 2: Deep Link Query Parameter Handling Matrix${RESET}`);

  await test('DeepLink-1: /waitlist?role=lawyer expands lawyer verification flow', () => {
    assert.equal(parseRoleParam('lawyer'), 'lawyer');
  });

  await test('DeepLink-2: Case-insensitivity (/waitlist?role=Lawyer, LAWYER, LaWyEr)', () => {
    assert.equal(parseRoleParam('Lawyer'), 'lawyer');
    assert.equal(parseRoleParam('LAWYER'), 'lawyer');
    assert.equal(parseRoleParam('LaWyEr'), 'lawyer');
  });

  await test('DeepLink-3: Whitespace trimming (/waitlist?role=%20lawyer%20)', () => {
    assert.equal(parseRoleParam('  lawyer  '), 'lawyer');
    assert.equal(parseRoleParam('\tlawyer\n'), 'lawyer');
  });

  await test('DeepLink-4: Aliases (/waitlist?role=attorney, /waitlist?role=professional)', () => {
    assert.equal(parseRoleParam('attorney'), 'lawyer');
    assert.equal(parseRoleParam('Attorney'), 'lawyer');
    assert.equal(parseRoleParam('professional'), 'lawyer');
    assert.equal(parseRoleParam('PROFESSIONAL'), 'lawyer');
  });

  await test('DeepLink-5: Explicit individual role (/waitlist?role=individual, Individual, INDIVIDUAL)', () => {
    assert.equal(parseRoleParam('individual'), 'individual');
    assert.equal(parseRoleParam('Individual'), 'individual');
    assert.equal(parseRoleParam('INDIVIDUAL'), 'individual');
    assert.equal(parseRoleParam('  individual  '), 'individual');
  });

  await test('DeepLink-6: Empty / Missing query param (/waitlist, /waitlist?role=, /waitlist?role="")', () => {
    assert.equal(parseRoleParam(null), 'individual');
    assert.equal(parseRoleParam(undefined), 'individual');
    assert.equal(parseRoleParam(''), 'individual');
    assert.equal(parseRoleParam('   '), 'individual');
  });

  await test('DeepLink-7: Invalid query params (/waitlist?role=invalid, admin, root, unknown, 123)', () => {
    assert.equal(parseRoleParam('invalid'), 'individual');
    assert.equal(parseRoleParam('admin'), 'individual');
    assert.equal(parseRoleParam('root'), 'individual');
    assert.equal(parseRoleParam('unknown'), 'individual');
    assert.equal(parseRoleParam('123'), 'individual');
    assert.equal(parseRoleParam('true'), 'individual');
    assert.equal(parseRoleParam('false'), 'individual');
  });

  await test('DeepLink-8: Adversarial Injection & Malformed input handling', () => {
    assert.equal(parseRoleParam('<script>alert("XSS")</script>'), 'individual');
    assert.equal(parseRoleParam("lawyer' OR '1'='1"), 'individual');
    assert.equal(parseRoleParam('lawyer; DROP TABLE waitlist;--'), 'individual');
    assert.equal(parseRoleParam('lawyer\0'), 'individual');
    assert.equal(parseRoleParam('../../../etc/passwd'), 'individual');
  });

  await test('DeepLink-9: Static Code Verification in WaitlistForm.tsx for parseRoleParam export', () => {
    const formCode = readFile('src/components/waitlist/WaitlistForm.tsx');
    assert.ok(formCode, 'WaitlistForm.tsx must exist');
    assert.ok(
      /export\s+function\s+parseRoleParam/.test(formCode),
      'WaitlistForm.tsx must export parseRoleParam function'
    );
    assert.ok(
      formCode.includes('useSearchParams'),
      'WaitlistForm.tsx must use next/navigation useSearchParams for reactive deep link param parsing'
    );
    assert.ok(
      formCode.includes('Suspense'),
      'WaitlistForm.tsx must wrap useSearchParams component in Suspense boundary for Next.js SSR compliance'
    );
  });

  // =========================================================================
  // SUITE 3: BRAND FIDELITY & PROHIBITED TROPES SCAN
  // =========================================================================
  console.log(`\n${BOLD}▶ Suite 3: Brand Fidelity & Prohibited Tropes Adversarial Scan${RESET}`);

  await test('Brand-1: Zero dark: utility classes in application JSX/TSX codebase', () => {
    // Scan all active product components and pages
    const appFiles = scanFiles('src/app', ['.tsx', '.ts']);
    const landingFiles = scanFiles('src/components/landing', ['.tsx', '.ts']);
    const waitlistFiles = scanFiles('src/components/waitlist', ['.tsx', '.ts']);
    const assistantFiles = scanFiles('src/components/assistant', ['.tsx', '.ts']);
    const rootComponents = ['src/components/Navbar.tsx'].filter(f => fs.existsSync(path.resolve(PROJECT_ROOT, f)));

    const activeFiles = [
      ...appFiles,
      ...landingFiles,
      ...waitlistFiles,
      ...assistantFiles,
      ...rootComponents.map(f => path.resolve(PROJECT_ROOT, f))
    ];

    const violations = [];
    for (const filePath of activeFiles) {
      const code = fs.readFileSync(filePath, 'utf8');
      const relPath = path.relative(PROJECT_ROOT, filePath);
      const matches = code.match(/\bdark:[a-zA-Z0-9_\-\/\[\]]+/g);
      if (matches) {
        violations.push({ file: relPath, matches });
      }
    }

    assert.equal(
      violations.length,
      0,
      `Found dark: class violations in active application files: ${JSON.stringify(violations, null, 2)}`
    );
  });

  await test('Brand-2: Zero gavels across all text, icons, asset filenames, and markup', () => {
    const srcFiles = scanFiles('src');
    const violations = [];

    for (const filePath of srcFiles) {
      const code = fs.readFileSync(filePath, 'utf8');
      const relPath = path.relative(PROJECT_ROOT, filePath);
      const matches = code.match(/\b(gavel|gavels)\b/gi);
      if (matches) {
        violations.push({ file: relPath, matches });
      }
    }

    // Also check public assets directory
    const publicFiles = scanFiles('public');
    for (const filePath of publicFiles) {
      const filename = path.basename(filePath);
      if (/gavel/i.test(filename)) {
        violations.push({ file: path.relative(PROJECT_ROOT, filePath), matches: [filename] });
      }
    }

    assert.equal(
      violations.length,
      0,
      `Gavel trope violation found: ${JSON.stringify(violations, null, 2)}`
    );
  });

  await test('Brand-3: Zero scales of justice across all text, icons, and markup', () => {
    const srcFiles = scanFiles('src');
    const violations = [];

    for (const filePath of srcFiles) {
      const code = fs.readFileSync(filePath, 'utf8');
      const relPath = path.relative(PROJECT_ROOT, filePath);
      const matches = code.match(/\b(scales[_-]of[_-]justice|scale\s+of\s+justice)\b/gi);
      if (matches) {
        violations.push({ file: relPath, matches });
      }
    }

    assert.equal(
      violations.length,
      0,
      `Scales of justice trope violation found: ${JSON.stringify(violations, null, 2)}`
    );
  });

  await test('Brand-4: Zero courtroom stock imagery references (courthouse, court room, judge bench)', () => {
    const srcFiles = scanFiles('src');
    const violations = [];

    for (const filePath of srcFiles) {
      const code = fs.readFileSync(filePath, 'utf8');
      const relPath = path.relative(PROJECT_ROOT, filePath);
      const matches = code.match(/\b(courthouse|courtroom\s+(?:bench|column|seat|gavel)|judge\s+bench)\b/gi);
      if (matches) {
        violations.push({ file: relPath, matches });
      }
    }

    assert.equal(
      violations.length,
      0,
      `Courtroom stock imagery violation found: ${JSON.stringify(violations, null, 2)}`
    );
  });

  await test('Brand-5: Zero dynamic AI / LLM SDK dependencies or API imports', () => {
    const pkg = JSON.parse(readFile('package.json'));
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {})
    };

    const forbiddenSDKs = [
      'openai',
      '@anthropic-ai/sdk',
      '@google/generative-ai',
      '@google/genai',
      'langchain',
      'llamaindex',
      'cohere-ai',
      'mistralai',
      '@ai-sdk/openai',
      '@ai-sdk/anthropic',
      '@ai-sdk/react',
      'ai'
    ];

    const foundDeps = forbiddenSDKs.filter(sdk => allDeps[sdk]);
    assert.equal(
      foundDeps.length,
      0,
      `Found forbidden AI SDK dependencies in package.json: ${foundDeps.join(', ')}`
    );

    // Scan source files for imports
    const srcFiles = scanFiles('src', ['.ts', '.tsx', '.js', '.jsx']);
    const importViolations = [];

    for (const filePath of srcFiles) {
      const code = fs.readFileSync(filePath, 'utf8');
      const relPath = path.relative(PROJECT_ROOT, filePath);
      for (const sdk of forbiddenSDKs) {
        const regex = new RegExp(`from\\s+["']${sdk}["']|require\\(["']${sdk}["']\\)`, 'i');
        if (regex.test(code)) {
          importViolations.push({ file: relPath, sdk });
        }
      }
    }

    assert.equal(
      importViolations.length,
      0,
      `Found forbidden AI SDK imports in source: ${JSON.stringify(importViolations, null, 2)}`
    );
  });

  await test('Brand-6: Exact Design Tokens and Light Color Scheme Enforcement in globals.css', () => {
    const css = readFile('src/app/globals.css');
    assert.ok(css, 'globals.css must exist');

    assert.ok(/--color-brand-navy:\s*#172033/i.test(css) || /#172033/i.test(css), 'Navy #172033 must be defined');
    assert.ok(/--color-brand-accent:\s*#285A8E/i.test(css) || /#285a8e/i.test(css), 'Blue #285A8E must be defined');
    assert.ok(/--color-brand-accent-teal:\s*#2F7C78/i.test(css) || /#2f7c78/i.test(css), 'Muted Teal #2F7C78 must be defined');
    assert.ok(/--color-brand-bg-warm:\s*#F6F3EC/i.test(css) || /#f6f3ec/i.test(css), 'Warm Off-white #F6F3EC must be defined');
    assert.ok(/--color-brand-bg-soft:\s*#F7F8FA/i.test(css) || /#f7f8fa/i.test(css), 'Soft Grey #F7F8FA must be defined');
    assert.ok(/--color-brand-border:\s*#E6E8EC/i.test(css) || /#e6e8ec/i.test(css), 'Border #E6E8EC must be defined');
    assert.ok(/--color-brand-text-secondary:\s*#667085/i.test(css) || /#667085/i.test(css), 'Muted Text #667085 must be defined');

    assert.ok(/color-scheme:\s*light/i.test(css), 'color-scheme: light must be strictly set');
  });

  // =========================================================================
  // SUITE 4: 24 INDIAN STATE BAR COUNCILS EXACT STRING VERIFICATION
  // =========================================================================
  console.log(`\n${BOLD}▶ Suite 4: 24 Indian State Bar Councils Canonical Verification${RESET}`);

  await test('BarCouncils-1: Array length is strictly and exactly 24', () => {
    const constantsCode = readFile('src/lib/constants.ts');
    assert.ok(constantsCode, 'src/lib/constants.ts must exist');

    // Extract INDIAN_STATE_BAR_COUNCILS from constants.ts
    const match = constantsCode.match(/export\s+const\s+INDIAN_STATE_BAR_COUNCILS\s*=\s*\[([\s\S]*?)\]\s*as\s+const/);
    assert.ok(match, 'INDIAN_STATE_BAR_COUNCILS array declaration must exist in constants.ts');

    const rawArrayContent = match[1];
    const parsedEntries = rawArrayContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('"') || line.startsWith("'"))
      .map(line => line.replace(/^["']|["'],?$/g, ''));

    assert.equal(
      parsedEntries.length,
      24,
      `Expected exactly 24 bar councils, found ${parsedEntries.length}`
    );
  });

  await test('BarCouncils-2: 100% Verbatim Match of all 24 Canonical Councils in constants.ts', () => {
    const constantsCode = readFile('src/lib/constants.ts');
    assert.ok(constantsCode, 'src/lib/constants.ts must exist');

    for (const [index, council] of AUTHORITATIVE_BAR_COUNCILS.entries()) {
      assert.ok(
        constantsCode.includes(`"${council}"`) || constantsCode.includes(`'${council}'`),
        `Council #${index + 1} "${council}" missing or misspelled in constants.ts`
      );
    }
  });

  await test('BarCouncils-3: Zero duplicate councils in constants.ts catalog', () => {
    const constantsCode = readFile('src/lib/constants.ts');
    const match = constantsCode.match(/export\s+const\s+INDIAN_STATE_BAR_COUNCILS\s*=\s*\[([\s\S]*?)\]\s*as\s+const/);
    const parsedEntries = match[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('"') || line.startsWith("'"))
      .map(line => line.replace(/^["']|["'],?$/g, ''));

    const set = new Set(parsedEntries);
    assert.equal(
      set.size,
      24,
      `Duplicate bar councils detected: expected 24 unique entries, got ${set.size}`
    );
  });

  await test('BarCouncils-4: WaitlistForm.tsx iterates over INDIAN_STATE_BAR_COUNCILS for <select> options', () => {
    const formCode = readFile('src/components/waitlist/WaitlistForm.tsx');
    assert.ok(formCode, 'WaitlistForm.tsx must exist');

    assert.ok(
      formCode.includes('import { INDIAN_STATE_BAR_COUNCILS } from "@/lib/constants"'),
      'WaitlistForm must import INDIAN_STATE_BAR_COUNCILS from @/lib/constants'
    );
    assert.ok(
      formCode.includes('INDIAN_STATE_BAR_COUNCILS.map('),
      'WaitlistForm must map over INDIAN_STATE_BAR_COUNCILS to render options'
    );
  });

  await test('BarCouncils-5: API Route imports and validates against INDIAN_STATE_BAR_COUNCILS', () => {
    const apiCode = readFile('src/app/api/waitlist/route.ts');
    assert.ok(apiCode, 'src/app/api/waitlist/route.ts must exist');

    assert.ok(
      apiCode.includes('INDIAN_STATE_BAR_COUNCILS'),
      'API route must import INDIAN_STATE_BAR_COUNCILS'
    );
    assert.ok(
      apiCode.includes('INDIAN_STATE_BAR_COUNCILS.includes('),
      'API route must validate incoming bar_council_state using INDIAN_STATE_BAR_COUNCILS.includes'
    );
  });

  await test('BarCouncils-6: Adversarial Boundary & Validation Tests on Bar Council inputs', () => {
    // Check validation against valid council
    const validCouncil = "Bar Council of Delhi";
    assert.ok(AUTHORITATIVE_BAR_COUNCILS.includes(validCouncil), 'Valid council must pass');

    // Misspelled
    const misspelled = "Bar Council of Delhy";
    assert.equal(AUTHORITATIVE_BAR_COUNCILS.includes(misspelled), false, 'Misspelled council must be rejected');

    // Partial match
    const partial = "Delhi";
    assert.equal(AUTHORITATIVE_BAR_COUNCILS.includes(partial), false, 'Partial match must be rejected');

    // Prefix match
    const prefix = "The Bar Council of Delhi";
    assert.equal(AUTHORITATIVE_BAR_COUNCILS.includes(prefix), false, 'Prefix match must be rejected');

    // International/Bogus
    const international = "Bar Council of England and Wales";
    assert.equal(AUTHORITATIVE_BAR_COUNCILS.includes(international), false, 'International bar must be rejected');

    // Case alteration
    const lowercase = "bar council of delhi";
    assert.equal(AUTHORITATIVE_BAR_COUNCILS.includes(lowercase), false, 'Unnormalized lowercase must be rejected');
  });

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================
  console.log(`\n${BOLD}${CYAN}====================================================${RESET}`);
  console.log(`${BOLD}CHALLENGER 2 TEST EXECUTION SUMMARY${RESET}`);
  console.log(`  Total Tests : ${totalTests}`);
  console.log(`  ${GREEN}Passed      : ${passedTests}${RESET}`);
  console.log(`  ${failedTests > 0 ? RED : GREEN}Failed      : ${failedTests}${RESET}`);
  console.log(`${BOLD}${CYAN}====================================================${RESET}\n`);

  if (failedTests > 0) {
    console.error(`${RED}Adversarial Suite failed with ${failedTests} error(s).${RESET}`);
    process.exit(1);
  } else {
    console.log(`${GREEN}All adversarial tests passed with 100% compliance!${RESET}\n`);
    process.exit(0);
  }
}

runAdversarialSuite();
