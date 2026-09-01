# Test Infrastructure & Test Strategy Architecture Report: MyLaw Assistant Chatbot

**Author**: Test Infrastructure Explorer  
**Date**: September 1, 2026  
**Project**: MyLaw Web Platform (`/Users/koustavdey/mylaw`)  
**Target Feature**: MyLaw Assistant Interactive Chatbot (Floating Trigger, Predefined Knowledge Base, Deterministic Q&A, Disclaimer Gatekeeping, Waitlist CTA, Global Non-Destructive Layout)

---

## 1. Executive Summary & Current Test Setup Analysis

### 1.1 Ecosystem & Dependency Audit

The MyLaw repository is built on a modern Next.js 16 App Router stack. A detailed inspection of `package.json`, `tsconfig.json`, `eslint.config.mjs`, and `node_modules` reveals the following architectural baseline:

| Dimension | Package / Tool | Version | Status & Role |
|---|---|---|---|
| **Framework** | `next` | `16.3.3` (Turbopack) | Production framework, App Router, SSR, static page optimization |
| **UI Library** | `react`, `react-dom` | `19.2.8` | React 19 Server & Client Components (`"use client"`) |
| **Language** | `typescript` | `^5.0` | Strict type checking (`npx tsc --noEmit`) |
| **Styling** | `tailwindcss`, `@tailwindcss/postcss` | `^4.0` | Tailwind CSS v4 design tokens in `src/app/globals.css` |
| **UI Primitives** | `@base-ui/react`, `lucide-react`, `clsx`, `tailwind-merge` | Latest | Iconography, utility classes, headless primitives |
| **Linter** | `eslint`, `eslint-config-next` | `^9.0`, `16.3.3` | Code style, React hooks rules, Next.js best practices |
| **Test Runner** | Native Node.js ESM Harness | Custom (`tests/e2e/runner.mjs`) | Zero-dependency, ultra-fast test execution |

### 1.2 Evaluation of Testing Approaches: Native ESM Harness vs. Heavy Frameworks

Neither Jest, Vitest, Playwright, nor Cypress is installed in `package.json`. Investigation reveals this is an intentional, highly optimized architectural decision:
1. **React 19 & Next.js 16 Turbopack Compatibility**: Jest and older versions of React Testing Library frequently encounter module resolution and JSX transform friction with React 19 Server Components and Next.js 16.
2. **Zero-Dependency Native Execution**: The custom ESM harness (`node tests/e2e/runner.mjs`) executes in <3 seconds without requiring external browser binary downloads or headless daemon overhead.
3. **Multi-Layered Verification Architecture**:
   - **Layer 1: Static Code & Token Scanner** (`tests/e2e/helpers/source-scanner.mjs`): Direct AST/regex analysis of files for token compliance, dark mode exclusion, font configurations, and brand safety rules.
   - **Layer 2: Headless SSR Component Renderer** (`react-dom/server` + TypeScript transpiler via `ts.transpileModule`): Verifies server-side rendering, initial DOM markup, accessibility attributes, and hydration shells in-memory.
   - **Layer 3: Interactive State Simulator** (`tests/e2e/helpers/dom-simulator.mjs`): Models client-side state machines, micro-delays, input sanitization, and state transitions without browser overhead.
   - **Layer 4: Live HTTP E2E Engine** (`tests/e2e/helpers/http-client.mjs` & `dom-parser.mjs`): Auto-spawns Next.js dev server, fetches live endpoints (`/`, `/waitlist`), parses HTML into a DOM tree, and asserts on structure, semantic tags, and anchors.

---

## 2. Verification of Build, Types & Linters

### 2.1 Build & Compiler Verification Commands

The test strategy integrates three mandatory verification gates:

```bash
# 1. TypeScript Strict Type Checking (Zero emit, type errors break build)
npx tsc --noEmit

# 2. ESLint Static Analysis (Next.js App Router rules)
npm run lint

# 3. Next.js Production Build (Compiles TS, builds Turbopack bundles, prerenders static routes)
npm run build
```

### 2.2 Chatbot TypeScript Data Contracts & Interfaces

To ensure compile-time safety and eliminate runtime `undefined` errors in the deterministic Q&A engine, the chatbot implementation must conform to strict TypeScript data definitions located at `src/types/assistant.ts` (or `src/components/assistant/types.ts`):

```typescript
export type AssistantCategory = 
  | "core" 
  | "why-mylaw" 
  | "for-individuals" 
  | "for-lawyers" 
  | "launch-roadmap";

export interface FollowUpQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly targetQuestionId: string;
}

export interface AssistantCTA {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

export interface KnowledgeItem {
  readonly id: string;
  readonly category: AssistantCategory;
  readonly question: string;
  readonly answer: string;
  readonly isDisclaimer?: boolean;
  readonly cta?: AssistantCTA;
  readonly followUpIds: readonly string[];
}

export interface ChatMessage {
  readonly id: string;
  readonly sender: "assistant" | "user";
  readonly text: string;
  readonly timestamp: number;
  readonly isDisclaimer?: boolean;
  readonly cta?: AssistantCTA;
  readonly followUps?: readonly string[];
}

export interface ChatState {
  readonly isOpen: boolean;
  readonly activeQuestionId: string | null;
  readonly conversationHistory: readonly ChatMessage[];
  readonly currentFollowUps: readonly string[];
  readonly introGreeting: string;
}
```

---

## 3. Chatbot Opaque-Box Test Harness Design

### 3.1 Headless Assistant State Simulator (`tests/e2e/helpers/assistant-simulator.mjs`)

A dedicated simulator models the entire chatbot lifecycle, question resolution, follow-up progression, back-to-menu transitions, and disclaimer triggers:

```javascript
/**
 * Assistant State Machine Simulator for Opaque-Box Test Verification
 */
export class AssistantSimulator {
  constructor(knowledgeBase, introGreetings) {
    this.knowledgeBase = new Map(knowledgeBase.map(k => [k.id, k]));
    this.introGreetings = introGreetings;
    this.isOpen = false;
    this.activeIntro = null;
    this.history = [];
    this.currentFollowUps = [];
    this.isTransitioning = false;
  }

  open() {
    this.isOpen = true;
    this.activeIntro = this.introGreetings[Math.floor(Math.random() * this.introGreetings.length)];
    this.history = [
      {
        id: 'msg-intro',
        sender: 'assistant',
        text: this.activeIntro,
        timestamp: Date.now()
      }
    ];
    // Select 5 initial questions across primary categories
    this.currentFollowUps = Array.from(this.knowledgeBase.values())
      .filter(k => k.isInitial)
      .slice(0, 5)
      .map(k => k.id);
    return {
      isOpen: this.isOpen,
      intro: this.activeIntro,
      initialQuestions: this.currentFollowUps
    };
  }

  close() {
    this.isOpen = false;
    return { isOpen: false };
  }

  async selectQuestion(questionId) {
    if (!this.isOpen) throw new Error('Cannot select question when assistant is closed');
    const item = this.knowledgeBase.get(questionId);
    if (!item) throw new Error(`Unknown question ID: ${questionId}`);

    this.isTransitioning = true;

    // 1. Append User Message
    this.history.push({
      id: `user-${Date.now()}`,
      sender: 'user',
      text: item.question,
      timestamp: Date.now()
    });

    // 2. Micro-delay simulation (150-250ms transition)
    await new Promise(r => setTimeout(r, 50));

    // 3. Append Assistant Answer
    this.history.push({
      id: `assistant-${Date.now()}`,
      sender: 'assistant',
      text: item.answer,
      isDisclaimer: item.isDisclaimer || false,
      cta: item.cta || null,
      timestamp: Date.now()
    });

    this.currentFollowUps = item.followUpIds || [];
    this.isTransitioning = false;

    return {
      userMessage: item.question,
      answer: item.answer,
      isDisclaimer: item.isDisclaimer || false,
      cta: item.cta || null,
      followUps: this.currentFollowUps,
      historyLength: this.history.length
    };
  }

  backToQuestions() {
    this.currentFollowUps = Array.from(this.knowledgeBase.values())
      .filter(k => k.isInitial)
      .slice(0, 5)
      .map(k => k.id);
    return {
      initialQuestions: this.currentFollowUps
    };
  }
}
```

### 3.2 Live DOM & Accessibility Scanner for Chatbot

The test runner interacts with the rendered HTML/SSR markup and live HTTP endpoints to assert:
- Floating button geometry classes: `w-12 h-12` / `w-14 h-14` (48–56px), `rounded-full`, `fixed bottom-6 right-6`, `z-50`.
- Hover tooltip existence: Tooltip text "Ask MyLaw", `role="tooltip"`.
- Panel container: `w-[360px]` to `w-[400px]`, `rounded-[14px]` (12–16px radius), `border border-[#E6E8EC]`, background `#FFFFFF`.
- Header text: `"MyLaw ● Assistant"` (or `"MyLaw • Assistant"`), close icon button with `aria-label="Close Assistant"`.
- Keyboard bindings: `ESC` keydown closes the panel; Tab focus wraps inside panel; focus returns to the launcher button on close.
- Strict Absence of Free-Text Entry: Zero `<input type="text">`, `<input type="search">`, `<textarea>`, or `[contenteditable]` elements inside the assistant panel.

---

## 4. Comprehensive 4-Tier Test Architecture

### 4.1 Feature Inventory & Test Mapping

| # | Feature Code | Feature Description | Requirement Source | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|:---:|:---:|:---:|:---:|
| **F1** | `CHAT-TRIGGER` | Floating Circular Trigger Button (48-56px), Sparkle/Chat Icon, Tooltip ("Ask MyLaw") | ORIGINAL_REQUEST §R1 | ✓ (5) | ✓ (3) | ✓ (2) | ✓ (2) |
| **F2** | `CHAT-PANEL` | Responsive Chat Panel (360-400px), Header "MyLaw ● Assistant", Close Action | ORIGINAL_REQUEST §R1 | ✓ (5) | ✓ (3) | ✓ (2) | ✓ (1) |
| **F3** | `CHAT-GREETING` | Randomized Friendly Intro Greetings on Panel Open | ORIGINAL_REQUEST §R2 | ✓ (3) | ✓ (2) | ✓ (1) | ✓ (1) |
| **F4** | `CHAT-INITIAL-Q` | 5 Initial Question Bubbles with Subtle Pill/Chevron Styling | ORIGINAL_REQUEST §R2 | ✓ (4) | ✓ (2) | ✓ (1) | ✓ (2) |
| **F5** | `CHAT-QA-FLOW` | User Selection Bubble -> Assistant Answer Bubble with Smooth Transition | ORIGINAL_REQUEST §R2 | ✓ (5) | ✓ (3) | ✓ (2) | ✓ (3) |
| **F6** | `CHAT-FOLLOWUP` | 2-3 Contextual Follow-up Questions & "← Back to questions" Button | ORIGINAL_REQUEST §R2 | ✓ (4) | ✓ (3) | ✓ (2) | ✓ (2) |
| **F7** | `CHAT-KB-SCOPE` | 15-20 Predefined Items across Core, Why, Help, Lawyers, Launch | ORIGINAL_REQUEST §R2 | ✓ (5) | ✓ (3) | ✓ (1) | ✓ (1) |
| **F8** | `CHAT-DISCLAIMER` | Zero Legal Advice Guardrail & Exact Disclaimer Verification | ORIGINAL_REQUEST §R2 | ✓ (3) | ✓ (3) | ✓ (1) | ✓ (2) |
| **F9** | `CHAT-WAITLIST-CTA`| Inline "Join the Waitlist →" CTA for Launch/Roadmap/Lawyer Queries | ORIGINAL_REQUEST §R3 | ✓ (4) | ✓ (2) | ✓ (3) | ✓ (2) |
| **F10** | `CHAT-A11Y-INTEGR` | Keyboard Navigation (ESC to close, ARIA attributes) & Non-Destructive Layout | ORIGINAL_REQUEST §R4 | ✓ (5) | ✓ (4) | ✓ (3) | ✓ (2) |

---

### 4.2 Tier 1: Feature Coverage Test Suite Specification

*Objective: Verify full functional and structural compliance of all 10 feature requirements with at least 3-5 assertions per feature.*

#### 1. Floating Trigger Button & Tooltip (F1)
- `T1.01`: Trigger button is fixed in bottom-right viewport corner (`fixed`, `bottom-6`, `right-6`, `z-50`).
- `T1.02`: Trigger button has circular dimensions within 48–56px range (`w-12 h-12` to `w-14 h-14` or equivalent 48-56px).
- `T1.03`: Trigger button uses brand primary styling (`#172033` or `#285A8E`) with subtle shadow (`shadow-md` / `shadow-lg`).
- `T1.04`: Trigger button contains a chat / sparkle SVG icon.
- `T1.05`: Trigger button displays a hover tooltip with exact label `"Ask MyLaw"`.

#### 2. Panel UI & Header (F2)
- `T1.06`: Clicking trigger opens chat panel with smooth slide-up / fade transition (150–250ms).
- `T1.07`: Panel width is constrained between 360px and 400px on desktop viewports.
- `T1.08`: Panel header contains brand text `"MyLaw ● Assistant"` (or `"MyLaw • Assistant"`).
- `T1.09`: Panel header includes an accessible close button with `aria-label="Close Assistant"`.
- `T1.10`: Panel border radius complies with design token specifications (12–16px / `rounded-[14px]`).

#### 3. Intro Greetings & Initial Questions (F3, F4)
- `T1.11`: On opening, an intro greeting message bubble is rendered from a randomized pool of friendly greetings.
- `T1.12`: Exactly 5 initial clickable question bubbles are displayed beneath the intro greeting.
- `T1.13`: Initial question bubbles feature pill / rounded borders (`rounded-[8px]` or `rounded-full`) and subtle chevron / arrow cues.
- `T1.14`: Initial questions span diverse categories (Core, Why MyLaw, For Individuals, For Lawyers, Launch).

#### 4. Conversational Q&A Transitions (F5, F6)
- `T1.15`: Clicking a question bubble renders the user message bubble aligned to the right in brand secondary tint.
- `T1.16`: Assistant answer bubble renders aligned to the left with brand styling (`#F7F8FA` background, `#172033` text).
- `T1.17`: Exactly 2 to 3 contextual follow-up question bubbles appear beneath the assistant answer.
- `T1.18`: A prominent `"← Back to questions"` navigation option is rendered with follow-up questions.
- `T1.19`: Clicking `"← Back to questions"` returns the prompt list to the initial 5 questions without destroying chat history.

#### 5. Predefined Knowledge Base (F7)
- `T1.20`: Knowledge base contains between 15 and 20 verified predefined items.
- `T1.21`: Every knowledge item has a unique non-empty `id`, `question`, `answer`, `category`, and valid `followUpIds`.
- `T1.22`: All categories (`core`, `why-mylaw`, `for-individuals`, `for-lawyers`, `launch-roadmap`) have representation.

#### 6. Legal Advice Guardrail & Standard Disclaimer (F8)
- `T1.23`: Questions pertaining to legal assistance or legal advice trigger the exact mandatory disclaimer:
  `"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."`
- `T1.24`: Disclaimer bubble is styled with subtle visual differentiation (e.g. teal or neutral border, info icon).
- `T1.25`: Disclaimer answers direct the user to connect with verified lawyers via MyLaw.

#### 7. Waitlist CTA Integration (F9)
- `T1.26`: Knowledge items in the Launch / Early Access / Lawyer Onboarding categories display an inline CTA button.
- `T1.27`: Waitlist CTA button text contains `"Join the Waitlist →"` or `"Want to be among the first? [ Join the Waitlist → ]"`.
- `T1.28`: CTA button links directly to `/waitlist` (or `/waitlist?role=lawyer`).
- `T1.29`: No duplicate waitlist form inputs (`<input type="email">`) are embedded inside the chat panel.

#### 8. Accessibility & Non-Destructive Layout (F10)
- `T1.30`: Trigger button has `aria-label="Ask MyLaw"`, `aria-expanded`, and `aria-haspopup="dialog"`.
- `T1.31`: Panel container has `role="dialog"` (or `role="region"`) and `aria-label="MyLaw Assistant"`.
- `T1.32`: Pressing `Escape` key closes the open chat panel.
- `T1.33`: Chatbot is integrated globally (e.g., `src/app/layout.tsx`) without altering landing page (`/`) or waitlist page (`/waitlist`) layouts.

---

### 4.3 Tier 2: Boundary, Edge Cases & Negative Testing Suite Specification

*Objective: Stress test the chatbot against unexpected user actions, rapid toggling, keyboard shortcuts, viewport limits, and negative constraints.*

#### 1. Rapid Toggle & Animation Debounce
- `T2.01`: Rapidly toggling trigger button 10 times in 200ms does not produce inconsistent open/closed states or orphaned DOM elements.
- `T2.02`: Rapidly clicking multiple question bubbles simultaneously or in rapid succession only processes the first clicked question (debounced state).

#### 2. Keyboard & Focus Management Boundaries
- `T2.03`: Pressing `Escape` while in the initial question view closes the panel and returns focus to the trigger button.
- `T2.04`: Pressing `Escape` while viewing an answer bubble closes the panel cleanly.
- `T2.05`: Pressing `Escape` when the panel is already closed does not throw errors or trigger unwanted actions.
- `T2.06`: Tabbing through the chat panel cycles focus through the close button, message links, and question bubbles without escaping into background page elements (focus trap / containment).

#### 3. Conversational State & Deep Navigation Boundaries
- `T2.07`: Navigating 5 levels deep into follow-up questions maintains valid history stack without exceeding container scroll limits.
- `T2.08`: Clicking `"← Back to questions"` multiple times consecutively is idempotent.
- `T2.09`: Closing and re-opening the chatbot maintains session continuity or cleanly resets to a fresh friendly greeting without stale pending animations.

#### 4. Absolute Negative Constraints (Strict Prohibition Checks)
- `T2.10`: **Zero Free-Text Input Check**: Static scanner and DOM validator confirm zero `<input type="text">`, `<input type="search">`, `<textarea>`, or `contenteditable` elements inside the assistant component.
- `T2.11`: **Zero AI/LLM API Call Check**: Static scanner verifies zero external network calls (`fetch('https://api.openai.com'...)`, `fetch('https://generativelanguage.googleapis.com'...)`, or dynamic LLM inference libraries).
- `T2.12`: **Zero Dark Mode Check**: Assistant styles contain zero `dark:` utility classes and zero `@media (prefers-color-scheme: dark)` overrides.
- `T2.13`: **Design Token Purity**: Colors used in assistant styles are strictly constrained to MyLaw palette (`#172033`, `#285A8E`, `#1e4670`, `#2F7C78`, `#FFFFFF`, `#F7F8FA`, `#E6E8EC`).

---

### 4.4 Tier 3: Cross-Feature Interactions & Route Integration Suite Specification

*Objective: Verify seamless interoperability between the chatbot and other platform components (Navbar, Waitlist, Hero, Mobile Drawers).*

#### 1. Route Navigation & Cross-Page Persistence
- `T3.01`: Chatbot trigger button is present and functional on both the Landing page (`/`) and the Waitlist page (`/waitlist`).
- `T3.02`: Clicking the inline `"Join the Waitlist →"` CTA inside a chatbot answer on `/` navigates the browser cleanly to `/waitlist`.
- `T3.03`: If the chatbot is open on `/waitlist`, clicking the `"Join the Waitlist →"` CTA retains focus on the waitlist email form.

#### 2. Layout Layering & Z-Index Coordination
- `T3.04`: Chatbot trigger and open panel (`z-50` / `z-40`) layer correctly above sticky Navbar (`z-50`), landing page sections (`z-10`), and waitlist split container.
- `T3.05`: Opening the mobile navbar drawer while the chatbot is open does not cause visual clipping or overlapping interaction deadlocks.
- `T3.06`: Floating trigger button bottom-right spacing (`bottom-6 right-6`) does not obscure or block the footer copyright or bottom CTAs on small screens.

#### 3. Responsive Breakpoint Adaptation
- `T3.07`: On mobile viewports (<640px), chat panel adapts to a bottom sheet or full-width drawer with comfortable margins (`inset-x-3 bottom-20` or `w-auto max-w-[calc(100vw-24px)]`), avoiding horizontal overflow.
- `T3.08`: On desktop viewports (>=1024px), chat panel floats cleanly anchored to the bottom-right corner without shifting page layout.

---

### 4.5 Tier 4: Realistic User Journeys & End-to-End Scenarios

*Objective: Execute complete, multi-step real-world personas validating the platform's behavior from first arrival to conversion.*

#### Journey 1: Consumer Discovery & Clarity Journey
```
1. User arrives at https://mylaw.com (HTTP 200).
2. User scrolls through Landing page, notices floating "Ask MyLaw" trigger in bottom-right.
3. User hovers trigger -> Tooltip "Ask MyLaw" appears.
4. User clicks trigger -> Chat panel opens with animated entrance.
5. Intro greeting displays: "Hi there! Welcome to MyLaw. How can we help you today?"
6. 5 initial questions are visible. User clicks: "What is MyLaw?"
7. User bubble "What is MyLaw?" appears on right.
8. Assistant answer bubble appears explaining MyLaw's verified discovery platform.
9. 2 follow-ups appear: "How do I find a lawyer?", "Is MyLaw free to use?".
10. User clicks "Is MyLaw free to use?" -> Answer renders.
11. User clicks "← Back to questions" -> Initial question list reappears.
12. User clicks close button -> Panel smoothly collapses.
```

#### Journey 2: Legal Professional Onboarding & Waitlist Conversion Journey
```
1. Lawyer arrives on Landing page.
2. Lawyer clicks "Ask MyLaw" trigger.
3. Lawyer selects question: "How does MyLaw work for lawyers?"
4. Assistant renders answer explaining directory profiles, client discovery, and launch onboarding.
5. Answer includes inline CTA: "Want to be among the first? [ Join the Waitlist → ]".
6. Lawyer clicks CTA -> Browser routes to /waitlist (or /waitlist?role=lawyer).
7. Waitlist page renders with asymmetric split layout and email input.
8. Lawyer fills email counsel@chambers.com, selects "Lawyer" block, submits.
9. Success state "You're on the list." renders with smooth transition.
```

#### Journey 3: Legal Advice Guardrail & Disclaimer Journey
```
1. User opens MyLaw Assistant.
2. User selects question: "Can you give me legal advice for my case?"
3. Assistant immediately renders the mandatory disclaimer:
   "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."
4. Follow-up options provide guidance: "How do I connect with a lawyer?", "What practice areas are covered?".
5. User clicks "What practice areas are covered?" -> Receives list of family, property, corporate, criminal law.
6. User verifies assistant never generates unvetted legal counsel.
```

#### Journey 4: Keyboard-Only Accessibility Journey
```
1. Keyboard user lands on homepage, uses `Tab` key to navigate interactive elements.
2. Focus lands on "Ask MyLaw" floating trigger with clear focus ring.
3. User presses `Enter` -> Chat panel opens, focus shifts into dialog.
4. User tabs through initial question options using keyboard.
5. User presses `Space` on question 3 -> Question selection triggers, answer loads.
6. Screen reader receives polite announcement (`aria-live="polite"`).
7. User presses `Escape` key -> Chat panel immediately closes.
8. Focus returns to the "Ask MyLaw" floating trigger button.
```

#### Journey 5: Mobile Viewport Touch & Dismiss Journey
```
1. Mobile user visits site on 375x667 viewport (iPhone SE simulation).
2. Chat trigger is comfortably positioned in bottom-right corner without overlapping bottom navigation.
3. User taps trigger -> Panel opens as responsive bottom-sheet container.
4. Message bubbles format text with proper padding and word wrapping; zero horizontal scroll is introduced.
5. User reads answer, taps follow-up question.
6. User taps header close '✕' button -> Panel collapses smoothly.
7. Landing page remains perfectly responsive and scrollable.
```

---

## 5. Implementation Roadmap & Test File Architecture

### 5.1 Test Suite Directory Layout

To maintain full isolation and follow project conventions, the chatbot test infrastructure should be organized as follows:

```
tests/
├── e2e/
│   ├── helpers/
│   │   ├── assistant-simulator.mjs   # Chatbot state machine & interaction simulator
│   │   ├── dom-parser.mjs            # HTML parser & selector query engine
│   │   ├── dom-simulator.mjs         # Form simulator for waitlist interactions
│   │   ├── http-client.mjs           # Next.js test server runner & fetcher
│   │   └── source-scanner.mjs        # Static token, dark-mode, and brand prohibition scanner
│   ├── runner.mjs                    # Master test runner (invoked via npm test)
│   ├── tier1-feature-coverage.test.mjs    # Core landing, waitlist & chatbot feature tests
│   ├── tier2-boundary-corner.test.mjs     # Boundary, debounce, ESC, & token tests
│   ├── tier3-cross-feature.test.mjs       # Routing, z-index, & layout tests
│   ├── tier4-scenarios-negative.test.mjs  # User journeys, brand safety & guardrails
│   └── report.json                   # Automated JSON test execution log
```

### 5.2 Knowledge Base Validation Helper

Add a knowledge base static validator to `tests/e2e/helpers/source-scanner.mjs`:

```javascript
/**
 * Validate Chatbot Knowledge Base Structure & Disclaimer
 */
export function validateKnowledgeBase(kbArray) {
  const issues = [];
  if (!Array.isArray(kbArray) || kbArray.length < 15 || kbArray.length > 20) {
    issues.push(`Knowledge base item count must be between 15 and 20 (got ${kbArray?.length})`);
  }

  const requiredDisclaimerText = "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.";
  const hasDisclaimer = kbArray.some(k => k.answer.includes(requiredDisclaimerText));
  if (!hasDisclaimer) {
    issues.push(`Mandatory disclaimer text missing from knowledge base: "${requiredDisclaimerText}"`);
  }

  const categories = new Set(kbArray.map(k => k.category));
  const expectedCategories = ['core', 'why-mylaw', 'for-individuals', 'for-lawyers', 'launch-roadmap'];
  for (const cat of expectedCategories) {
    if (!categories.has(cat)) {
      issues.push(`Missing required knowledge base category: "${cat}"`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
```

---

## 6. Verification and Exit Criteria

| Criterion | Verification Method | Target Result |
|---|---|---|
| **TypeScript Compilation** | `npx tsc --noEmit` | Exit code `0`, zero type errors |
| **Next.js Production Build** | `npm run build` | Exit code `0`, static routes compiled cleanly |
| **ESLint Static Analysis** | `npm run lint` | Exit code `0`, zero lint warnings/errors |
| **Tier 1 Feature Coverage** | `node tests/e2e/runner.mjs --tier=1` | 100% pass across all features |
| **Tier 2 Boundary Tests** | `node tests/e2e/runner.mjs --tier=2` | 100% pass across all boundary & negative checks |
| **Tier 3 Cross-Feature Tests**| `node tests/e2e/runner.mjs --tier=3` | 100% pass across all routing & layout checks |
| **Tier 4 Real-World Journeys** | `node tests/e2e/runner.mjs --tier=4` | 100% pass across all 5 realistic scenarios |
| **Overall Test Suite** | `npm test` | Exit code `0`, 100% test pass rate |
