import { spawn } from 'node:child_process';
import { parseHTML } from './dom-parser.mjs';

let serverProcess = null;
const DEFAULT_PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${DEFAULT_PORT}`;

/**
 * Check if a port is currently listening
 */
export async function isServerHealthy(url = BASE_URL) {
  try {
    const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(1500) });
    return res.status >= 200 && res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Ensure Next.js server is running
 */
export async function ensureServer(options = { port: DEFAULT_PORT, timeoutMs: 25000 }) {
  if (await isServerHealthy(BASE_URL)) {
    return { url: BASE_URL, managed: false };
  }

  const port = options.port || DEFAULT_PORT;
  const url = `http://localhost:${port}`;

  serverProcess = spawn('npx', ['next', 'dev', '--port', String(port)], {
    cwd: process.cwd(),
    stdio: 'pipe',
    env: { ...process.env, PORT: String(port) }
  });

  const startTime = Date.now();
  while (Date.now() - startTime < options.timeoutMs) {
    if (await isServerHealthy(url)) {
      return { url, managed: true };
    }
    await new Promise(r => setTimeout(r, 500));
  }

  throw new Error(`Next.js server failed to start on ${url} within ${options.timeoutMs}ms`);
}

/**
 * Stop server if spawned by test runner
 */
export function stopServer() {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
}

/**
 * Fetch a page from the test server and return raw text and parsed DOM
 */
export async function fetchPage(path = '/', baseUrl = BASE_URL) {
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'MyLaw-E2E-Tester/1.0'
    }
  });

  const body = await response.text();
  const dom = parseHTML(body);

  return {
    url,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body,
    dom
  };
}
