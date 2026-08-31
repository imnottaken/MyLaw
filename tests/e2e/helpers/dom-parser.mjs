/**
 * Zero-dependency HTML / DOM parser for E2E testing
 */

export class DOMNode {
  constructor(tagName = 'root', attributes = {}, parent = null) {
    this.tagName = tagName.toLowerCase();
    this.attributes = attributes;
    this.parent = parent;
    this.children = [];
    this.textNodes = [];
  }

  get id() {
    return this.attributes.id || '';
  }

  get classList() {
    const cls = this.attributes.class || this.attributes.className || '';
    return cls.split(/\s+/).filter(Boolean);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }

  get textContent() {
    let text = this.textNodes.join(' ');
    for (const child of this.children) {
      text += ' ' + child.textContent;
    }
    return text.replace(/\s+/g, ' ').trim();
  }

  get innerHTML() {
    return this.rawInner || '';
  }

  querySelector(selector) {
    const results = this.querySelectorAll(selector);
    return results.length > 0 ? results[0] : null;
  }

  querySelectorAll(selector) {
    const results = [];
    this._matchSelector(selector, results);
    return results;
  }

  _matchSelector(selector, results) {
    // Check direct match
    if (this._matches(selector) && this.tagName !== 'root') {
      results.push(this);
    }
    for (const child of this.children) {
      child._matchSelector(selector, results);
    }
  }

  _matches(selector) {
    // Handle comma-separated selectors
    if (selector.includes(',')) {
      return selector.split(',').some(s => this._matches(s.trim()));
    }

    // Handle space-separated descendant selectors
    const parts = selector.trim().split(/\s+/);
    if (parts.length > 1) {
      // For descendant matching, the last part must match this element
      const target = parts[parts.length - 1];
      if (!this._matchesSingle(target)) return false;
      // An ancestor must match the preceding part
      let ancestor = this.parent;
      const preceding = parts.slice(0, -1).join(' ');
      while (ancestor && ancestor.tagName !== 'root') {
        if (ancestor._matches(preceding)) return true;
        ancestor = ancestor.parent;
      }
      return false;
    }

    return this._matchesSingle(selector);
  }

  _matchesSingle(sel) {
    if (!sel || sel === '*') return true;

    // Attribute selector e.g. [type="email"], [href], [href*="/waitlist"], [name="role"]
    const attrMatch = sel.match(/^([a-zA-Z0-9_-]*)\[([a-zA-Z0-9_-]+)(?:([*^$]?=)(["']?)(.*?)\4)?\]$/);
    if (attrMatch) {
      const [, tag, attrName, op, , attrVal] = attrMatch;
      if (tag && tag.toLowerCase() !== this.tagName) return false;
      if (!this.hasAttribute(attrName)) return false;
      if (!op) return true; // Just existence of attribute
      const val = this.getAttribute(attrName) || '';
      if (op === '=') return val === attrVal;
      if (op === '*=') return val.includes(attrVal);
      if (op === '^=') return val.startsWith(attrVal);
      if (op === '$=') return val.endsWith(attrVal);
    }

    // ID selector e.g. #hero, section#how-it-works
    const idMatch = sel.match(/^([a-zA-Z0-9_-]*)#([a-zA-Z0-9_-]+)$/);
    if (idMatch) {
      const [, tag, id] = idMatch;
      if (tag && tag.toLowerCase() !== this.tagName) return false;
      return this.id === id;
    }

    // Class selector e.g. .btn, a.cta-btn
    const classMatch = sel.match(/^([a-zA-Z0-9_-]*)\.([a-zA-Z0-9_-]+)$/);
    if (classMatch) {
      const [, tag, cls] = classMatch;
      if (tag && tag.toLowerCase() !== this.tagName) return false;
      return this.classList.includes(cls);
    }

    // Simple tag name
    return this.tagName === sel.toLowerCase();
  }

  find(predicate) {
    const results = [];
    if (predicate(this) && this.tagName !== 'root') {
      results.push(this);
    }
    for (const child of this.children) {
      results.push(...child.find(predicate));
    }
    return results;
  }

  findByText(textOrRegex) {
    return this.find(node => {
      const text = node.textContent;
      if (typeof textOrRegex === 'string') {
        return text.toLowerCase().includes(textOrRegex.toLowerCase());
      }
      return textOrRegex.test(text);
    });
  }
}

/**
 * Parse HTML string into DOMNode tree
 */
export function parseHTML(html) {
  const root = new DOMNode('root');
  let currentNode = root;

  // Clean scripts and comments for structural analysis
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  const tagRegex = /<(\/)?([a-zA-Z0-9_-]+)((?:\s+[^=>\s]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)/g;

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  let match;
  while ((match = tagRegex.exec(cleaned)) !== null) {
    const [, isClosing, tagName, attrString, isSelfClosing, textContent] = match;

    if (textContent) {
      const decoded = textContent
        .replace(/&#x27;|&#39;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      const trimmed = decoded.trim();
      if (trimmed) {
        currentNode.textNodes.push(trimmed);
      }
      continue;
    }

    const tag = tagName.toLowerCase();

    if (isClosing) {
      // Walk up parents until matching tag
      let ancestor = currentNode;
      while (ancestor && ancestor.tagName !== tag && ancestor !== root) {
        ancestor = ancestor.parent;
      }
      if (ancestor && ancestor.parent) {
        currentNode = ancestor.parent;
      }
    } else {
      // Parse attributes
      const attributes = {};
      if (attrString) {
        const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrString)) !== null) {
          const key = attrMatch[1].toLowerCase();
          const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
          attributes[key] = val;
        }
      }

      const newNode = new DOMNode(tag, attributes, currentNode);
      currentNode.children.push(newNode);

      const selfClosing = isSelfClosing === '/' || voidTags.has(tag);
      if (!selfClosing) {
        currentNode = newNode;
      }
    }
  }

  return root;
}
