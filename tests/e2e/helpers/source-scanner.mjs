import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();

/**
 * Read file content safely
 */
export function readFile(relativePath) {
  const fullPath = path.resolve(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Scan all files in directory recursively matching extension filter
 */
export function scanFiles(dirPath, extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json']) {
  const results = [];
  const fullDirPath = path.resolve(PROJECT_ROOT, dirPath);

  if (!fs.existsSync(fullDirPath)) {
    return results;
  }

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

/**
 * Validate Theme Tokens in globals.css
 */
export function validateThemeTokens() {
  const css = readFile('src/app/globals.css') || '';
  const requiredTokens = [
    { name: 'white background', token: '#ffffff', pattern: /#ffffff/i },
    { name: 'soft background', token: '#f7f8fa', pattern: /#f7f8fa/i },
    { name: 'warm background', token: '#f6f3ec', pattern: /#f6f3ec/i },
    { name: 'primary text', token: '#172033', pattern: /#172033/i },
    { name: 'secondary text', token: '#667085', pattern: /#667085/i },
    { name: 'border', token: '#e6e8ec', pattern: /#e6e8ec/i },
    { name: 'primary accent blue', token: '#285a8e', pattern: /#285a8e/i },
    { name: 'accent hover', token: '#1e4670', pattern: /#1e4670/i },
    { name: 'accent teal', token: '#2f7c78', pattern: /#2f7c78/i },
    { name: 'radius sm (6px)', token: '6px', pattern: /6px/ },
    { name: 'radius md (10px)', token: '10px', pattern: /10px/ },
    { name: 'radius lg (14px)', token: '14px', pattern: /14px/ }
  ];

  const results = requiredTokens.map(req => ({
    ...req,
    present: req.pattern.test(css)
  }));

  return {
    allPresent: results.every(r => r.present),
    results
  };
}

/**
 * Validate Light Mode Enforcement (No dark mode overrides)
 */
export function validateLightModeOnly() {
  const css = readFile('src/app/globals.css') || '';
  const hasDarkMediaQuery = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/i.test(css);
  const hasDarkModeClassOverrides = /\.dark\s*\{/i.test(css);

  return {
    isLightOnly: !hasDarkMediaQuery && !hasDarkModeClassOverrides,
    hasDarkMediaQuery,
    hasDarkModeClassOverrides
  };
}

/**
 * Validate Typography (Inter Google font configuration)
 */
export function validateFontConfiguration() {
  const layout = readFile('src/app/layout.tsx') || '';
  const hasInterImport = /import\s*\{[^}]*Inter[^}]*\}\s*from\s*["']next\/font\/google["']/.test(layout);
  const loadsInter = /Inter\s*\(\s*\{[\s\S]*?subsets:\s*\[\s*["']latin["']\s*\]/m.test(layout);

  return {
    isConfigured: hasInterImport && loadsInter,
    hasInterImport,
    loadsInter
  };
}

/**
 * Validate Section 26 Brand Prohibitions across codebase
 */
export function validateBrandProhibitions() {
  const srcFiles = scanFiles('src');
  const violations = [];

  const forbiddenPatterns = [
    { rule: 'No gavels', pattern: /\b(gavel|gavels)\b/i },
    { rule: 'No scales of justice', pattern: /\bscales[_-]of[_-]justice\b|\bscale\s+of\s+justice\b/i },
    { rule: 'No courtroom columns/benches', pattern: /\bcourtroom\s+(column|bench|seat)\b/i },
    { rule: 'No fake statistics', pattern: /\b(10,000\+\s*lawyers|99%\s*success\s*rate|50,000\+\s*cases)\b/i },
    { rule: 'No fake testimonials', pattern: /\b(John\s+Doe,\s*Client|Sarah\s+M\.,\s*Verified\s*Client|fake[_-]testimonial)\b/i },
    { rule: 'No luxury black & gold branding', pattern: /\b(#d4af37|#ffd700|gold-500|gold-600)\b/i },
    { rule: 'No purple AI gradient hype', pattern: /\b(purple-600|fuchsia-600|from-purple|to-pink)\b/i },
    { rule: 'No buzzword hype', pattern: /\b(revolutionizing\s+the\s+legal\s+ecosystem|disrupting\s+the\s+legal\s+industry)\b/i }
  ];

  for (const filePath of srcFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(PROJECT_ROOT, filePath);

    for (const { rule, pattern } of forbiddenPatterns) {
      if (pattern.test(content)) {
        violations.push({
          file: relativePath,
          rule,
          match: content.match(pattern)?.[0]
        });
      }
    }
  }

  return {
    clean: violations.length === 0,
    violations
  };
}
