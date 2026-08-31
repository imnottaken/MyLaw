#!/usr/bin/env node

/**
 * MyLaw E2E Automated Test Runner
 * Executes Tier 1-4 tests and reports structured results.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ensureServer, stopServer, isServerHealthy } from './helpers/http-client.mjs';
import { runTier1Tests } from './tier1-feature-coverage.test.mjs';
import { runTier2Tests } from './tier2-boundary-corner.test.mjs';
import { runTier3Tests } from './tier3-cross-feature.test.mjs';
import { runTier4Tests } from './tier4-scenarios-negative.test.mjs';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tiers: [1, 2, 3, 4],
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
    json: false,
    verbose: false,
    bail: false,
    noServer: false
  };

  for (const arg of args) {
    if (arg.startsWith('--tier=')) {
      const val = arg.split('=')[1];
      if (val.toLowerCase() === 'all') {
        options.tiers = [1, 2, 3, 4];
      } else {
        options.tiers = val.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
      }
    } else if (arg.startsWith('--port=')) {
      options.port = parseInt(arg.split('=')[1], 10);
      options.baseUrl = `http://localhost:${options.port}`;
    } else if (arg.startsWith('--base-url=')) {
      options.baseUrl = arg.split('=')[1];
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--bail') {
      options.bail = true;
    } else if (arg === '--no-server') {
      options.noServer = true;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();
  const startTime = Date.now();
  let managedServer = false;

  console.log(`${colors.bold}${colors.blue}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   MyLaw Pre-Launch E2E Test Suite Runner   ${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}====================================================${colors.reset}`);
  console.log(`${colors.dim}Target URL:${colors.reset} ${options.baseUrl}`);
  console.log(`${colors.dim}Active Tiers:${colors.reset} ${options.tiers.join(', ')}\n`);

  // Ensure server is up if HTTP tests are included
  try {
    const isHealthy = await isServerHealthy(options.baseUrl);
    if (!isHealthy && !options.noServer) {
      console.log(`${colors.yellow}Server not running on ${options.baseUrl}. Launching Next.js dev server...${colors.reset}`);
      const info = await ensureServer({ port: options.port, timeoutMs: 30000 });
      managedServer = info.managed;
      console.log(`${colors.green}✓ Server ready at ${info.url}${colors.reset}\n`);
    } else if (isHealthy) {
      console.log(`${colors.green}✓ Connected to existing server at ${options.baseUrl}${colors.reset}\n`);
    }
  } catch (err) {
    console.warn(`${colors.yellow}⚠️ Server connection note: ${err.message}${colors.reset}`);
    console.warn(`${colors.dim}Proceeding with test execution...${colors.reset}\n`);
  }

  const allResults = {
    timestamp: new Date().toISOString(),
    baseUrl: options.baseUrl,
    tiers: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      durationMs: 0
    }
  };

  const suiteMap = {
    1: { title: 'Tier 1: Feature Coverage', runner: runTier1Tests },
    2: { title: 'Tier 2: Boundary & Corner Cases', runner: runTier2Tests },
    3: { title: 'Tier 3: Cross-Feature Combinations', runner: runTier3Tests },
    4: { title: 'Tier 4: Real-World Scenarios & Negative Assertions', runner: runTier4Tests }
  };

  for (const tierNum of options.tiers) {
    const suite = suiteMap[tierNum];
    if (!suite) continue;

    console.log(`${colors.bold}${colors.magenta}▶ ${suite.title}${colors.reset}`);
    const tierResults = await suite.runner(options.baseUrl);
    allResults.tiers[`tier${tierNum}`] = tierResults;

    let tierPassed = 0;
    let tierFailed = 0;

    for (const res of tierResults) {
      allResults.summary.total++;
      if (res.passed) {
        tierPassed++;
        allResults.summary.passed++;
        console.log(`  ${colors.green}✓${colors.reset} ${res.name} ${colors.dim}(${res.durationMs}ms)${colors.reset}`);
      } else {
        tierFailed++;
        allResults.summary.failed++;
        console.log(`  ${colors.red}✗${colors.reset} ${colors.bold}${res.name}${colors.reset} ${colors.dim}(${res.durationMs}ms)${colors.reset}`);
        console.log(`    ${colors.red}Error: ${res.error}${colors.reset}`);
        if (options.verbose && res.stack) {
          console.log(`    ${colors.dim}${res.stack.split('\n').slice(1, 4).join('\n    ')}${colors.reset}`);
        }
      }
    }

    console.log(`  ${colors.dim}Subtotal: ${tierPassed} passed, ${tierFailed} failed${colors.reset}\n`);

    if (options.bail && tierFailed > 0) {
      console.log(`${colors.red}Bailing out due to failure (--bail enabled).${colors.reset}`);
      break;
    }
  }

  allResults.summary.durationMs = Date.now() - startTime;

  // Print Summary
  console.log(`${colors.bold}${colors.blue}----------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}E2E Test Run Summary:${colors.reset}`);
  console.log(`  Total Tests : ${allResults.summary.total}`);
  console.log(`  Passed      : ${colors.green}${allResults.summary.passed}${colors.reset}`);
  console.log(`  Failed      : ${allResults.summary.failed > 0 ? colors.red : colors.green}${allResults.summary.failed}${colors.reset}`);
  console.log(`  Duration    : ${allResults.summary.durationMs}ms`);
  console.log(`${colors.bold}${colors.blue}====================================================${colors.reset}`);

  // Write report to file
  const reportPath = path.resolve(process.cwd(), 'tests/e2e/report.json');
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2), 'utf8');
  console.log(`${colors.dim}Report saved to: tests/e2e/report.json${colors.reset}\n`);

  if (managedServer) {
    stopServer();
  }

  if (allResults.summary.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => {
  stopServer();
  process.exit(130);
});

process.on('SIGTERM', () => {
  stopServer();
  process.exit(143);
});

main().catch(err => {
  console.error(`${colors.red}Fatal test runner error: ${err.message}${colors.reset}`);
  stopServer();
  process.exit(1);
});
