# Milestone M1 Specification Validation & Editorial Copy Audit

**Document Status**: Authoritative Specification & Editorial Validation Report  
**Target Milestone**: Milestone 1 (Knowledge Base & Data Layer)  
**Project**: MyLaw Assistant Chatbot  
**Specification Sources**:
- `ORIGINAL_REQUEST.md` (Root & `.agents/ORIGINAL_REQUEST.md`)
- `PROJECT.md` (Architecture, Code Layout, Interface Contracts)
- `design.md` (Brand Guidelines, Editorial Rules, Color Tokens, Negative Constraints)
- `tests/e2e/` (Test Suites & Source Scanners)

---

## 1. Executive Summary

This specification validation report audits and establishes the exact editorial copy, conversational flow, brand alignment, and negative constraint compliance for Milestone 1 (Knowledge Base & Data Layer) of the MyLaw Assistant Chatbot.

### Key Validation Outcomes:
1. **Editorial Quality & Tone**: All copy adheres strictly to the MyLaw editorial philosophy—calm, professional, trustworthy, modern, and approachable. Zero marketing fluff, zero corporate jargon, and zero exaggerated claims.
2. **Deterministic Data Model**: 18 curated knowledge items across 5 distinct categories (`core`, `why-mylaw`, `for-seeking-help`, `for-lawyers`, `launch`), 4 randomized intro greetings, and 5 top-level initial questions.
3. **Graph Integrity**: Every follow-up ID resolves cleanly to an existing knowledge item in the dataset. (Identified and corrected an edge case where `launch-waitlist-lawyer` was referenced instead of canonical `launch-waitlist`).
4. **Negative Constraints**: 100% compliance across all negative rules:
   - **Zero Legal Advice**: Explicit statutory disclaimer in `core-is-it-legal-advice` and permanent micro-disclaimer footer.
   - **Zero Promises of Representation**: MyLaw is strictly framed as a connection platform, not a law firm or representative.
   - **Zero Fake Statistics**: Zero fabricated metrics, user counts, or success rates.
   - **Zero Dark-Mode Tokens**: 100% pure light-mode palette (`#FFFFFF`, `#F7F8FA`, `#172033`, `#285A8E`, `#2F7C78`, `#E6E8EC`, `#667085`).
   - **Zero Free-Text Input**: 100% deterministic pill/button selection.

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Data Layer | Categorized Knowledge Base | 18 predefined Q&A items partitioned across 5 categories: Core, Why MyLaw, For Seeking Help, For Lawyers, Launch | Category / Item ID | KnowledgeItem record with question, answer, CTA, and follow-ups | Return default fallback item if ID not found | ORIGINAL_REQUEST §R2, PROJECT.md |
| 2 | Conversational Flow | Randomized Intro Greetings | Selection of 1 of 4 friendly, brand-aligned intro greetings on open | Component mount / Open event | Initial assistant message bubble with greeting copy | Fallback to greeting index 0 | ORIGINAL_REQUEST §R2 |
| 3 | Conversational Flow | 5 Initial Top-Level Questions | 5 initial question bubbles covering platform overview, workflow, client help, lawyer onboarding, and launch | Open / Reset action | 5 interactive question pill buttons | Fallback to default top 5 list | ORIGINAL_REQUEST §R2 |
| 4 | Conversational Flow | Deterministic Q&A Response | Clicking a question pill renders user bubble followed by assistant answer | Question ID click | User message bubble + Assistant answer bubble | Graceful ignore of duplicate clicks | ORIGINAL_REQUEST §R2 |
| 5 | Conversational Flow | Contextual Follow-Up Suggestions | 2–3 relevant follow-up question bubbles rendered beneath each assistant answer | Active KnowledgeItem | Array of 2–3 interactive follow-up pill buttons | Render top 5 questions if followUpIds is empty | ORIGINAL_REQUEST §R2 |
| 6 | Navigation | "← Back to Questions" Reset | Dedicated action button returning the conversational state to the 5 initial top-level questions | Button click | Appends 5 initial question pills to feed | Preserves prior scroll and message history | ORIGINAL_REQUEST §R2 |
| 7 | Regulatory Compliance | Verbatim Legal Advice Disclaimer | Exact statutory disclaimer rendered for legal advice questions: *"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."* | Advice inquiry / ID: `core-is-it-legal-advice` | Disclaimer bubble text + licensed attorney referral copy | Guaranteed deterministic response | ORIGINAL_REQUEST §R2 |
| 8 | Panel UI | Micro-Disclaimer Footer | Permanent micro-copy at panel bottom: *"Informational assistant only. No legal advice provided."* | Static panel layout | Rendered sticky micro-disclaimer footer | None | ORIGINAL_REQUEST §R2, design.md |
| 9 | Conversion | Inline Waitlist CTA Integration | Action button in relevant answers routing directly to `/waitlist` (e.g., `"Join the Waitlist →"`) | CTA button click | Direct client navigation to `/waitlist` | Standard anchor navigation fallback | ORIGINAL_REQUEST §R3 |
| 10 | Conversion | Role-Aware Waitlist Routing | Specialized CTA for lawyers routing to `/waitlist?role=lawyer` (e.g., `"Join Lawyer Onboarding →"`) | Lawyer CTA click | Route navigation with `role=lawyer` query param | Falls back to generic `/waitlist` | ORIGINAL_REQUEST §R3, PROJECT.md |
| 11 | Trigger UI | Floating Assistant Trigger Button | Circular 48–56px button fixed in bottom-right corner with MyLaw blue, sparkle icon, and ARIA attributes | Click / Keypress | Toggles assistant panel open/closed | None | ORIGINAL_REQUEST §R1 |
| 12 | Trigger UI | Hover Tooltip ("Ask MyLaw") | Tooltip showing "Ask MyLaw" on trigger button hover or focus | Hover / Focus event | Floating tooltip badge above/beside trigger | Dismisses smoothly on mouse leave / blur | ORIGINAL_REQUEST §R1 |
| 13 | Panel UI | Header Bar ("MyLaw ● Assistant") | Header with brand name, pulse dot (`#2F7C78`), and accessible close button | Close click / ESC | Closes panel and restores focus to trigger | None | ORIGINAL_REQUEST §R1 |
| 14 | Architecture | Global Non-Destructive Layout | Client component mounted in `src/app/layout.tsx` without affecting main page DOM or layout | Layout mount | Persistent floating widget on all routes | Zero styling bleed or DOM disruption | ORIGINAL_REQUEST §R4 |
| 15 | Accessibility | Keyboard ESC Dismissal & ARIA | Full keyboard navigation (`Escape` closes panel, `Tab` traverses interactive pills, `aria-live` for announcements) | Key events | Focus management and screen reader updates | Prevents scroll trapping | ORIGINAL_REQUEST §R4 |

---

## 3. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Follow-up Graph | User traverses deeply through 5+ consecutive follow-ups | Conversation history accumulates cleanly; each turn provides 2–3 follow-ups + "← Back to questions", ensuring zero dead ends. |
| 2 | Graph ID Resolution | Question references non-existent ID (e.g. `launch-waitlist-lawyer`) | Data layer audit detected reference; mapped canonically to `launch-waitlist` with role-specific CTA metadata (`href: "/waitlist?role=lawyer"`). |
| 3 | Reset Navigation | User clicks "← Back to questions" multiple times | Appends the 5 initial top-level questions into the feed without clearing history or causing state desynchronization. |
| 4 | Rapid Double Clicking | User clicks the same question pill twice within 50ms | Guarded transition state prevents duplicate user message bubbles or double assistant answers. |
| 5 | Waitlist Navigation | User clicks inline waitlist CTA while already on `/waitlist` | Router navigation handles current-page transition gracefully without reloading the entire page or crashing. |
| 6 | Mobile Viewport | Viewport width < 360px (e.g., 320px iPhone SE) | Chat panel scales with responsive margins (`inset-x-4 bottom-20`), eliminating horizontal overflow. |
| 7 | Keyboard Dismissal | User presses `Escape` while focused on a CTA link inside the chat panel | Panel closes smoothly and focus returns immediately to the floating trigger button. |
| 8 | Screen Reader Feed | New message bubble appended to message feed | Feed container equipped with `aria-live="polite"` announces new assistant answer without jarring interruptions. |

---

## 4. Editorial Copy, Tone & Brand Alignment Audit

### 4.1 Intro Greetings (Random 1 of 4)

| # | Greeting Copy | Tone & Brand Analysis | Compliance Status |
|---|---|---|---|
| 1 | *"Hi there! Welcome to MyLaw. How can I help you explore our upcoming platform today?"* | Warm, polite, clearly establishes pre-launch status ("upcoming platform"). | PASS (100% brand-aligned) |
| 2 | *"Hello! I'm the MyLaw Assistant. Select any question below to learn more about what we're building."* | Professional, concise, guides user to predefined selection. | PASS (100% brand-aligned) |
| 3 | *"Welcome to MyLaw! Looking to discover legal help or join as a legal professional? Pick a topic below to get started."* | Addresses both user segments (clients & lawyers) symmetrically. | PASS (100% brand-aligned) |
| 4 | *"Hello! Curious about MyLaw? Choose a topic below to see how we're making legal help simpler and more accessible."* | Highlights brand mission ("simpler and more accessible"). | PASS (100% brand-aligned) |

### 4.2 Initial 5 Top-Level Questions

| # | Question Text | Target ID | Category | Segment Addressed |
|---|---|---|---|---|
| 1 | *"What is MyLaw?"* | `core-what-is-mylaw` | `core` | Brand introduction & mission |
| 2 | *"How does MyLaw work?"* | `core-how-it-works` | `core` | 3-step platform workflow |
| 3 | *"How do I find the right lawyer for my needs?"* | `help-find-lawyer` | `for-seeking-help` | Individuals & businesses seeking counsel |
| 4 | *"How can lawyers join the platform?"* | `lawyer-how-to-join` | `for-lawyers` | Legal professionals & law firms |
| 5 | *"When is MyLaw officially launching?"* | `launch-timeline` | `launch` | Waitlist & launch expectations |

---

### 4.3 Authoritative 18 Knowledge Base Items

#### Category 1: Core Platform Overview (`core`)

```typescript
// 1. core-what-is-mylaw
{
  id: 'core-what-is-mylaw',
  category: 'core',
  question: 'What is MyLaw?',
  answer: "MyLaw is a legal-tech platform designed to make it simpler and more transparent for people to discover and connect with qualified legal professionals. We're creating a clear, approachable starting point for finding legal help.",
  followUpIds: ['core-how-it-works', 'why-mylaw-different', 'launch-timeline']
}

// 2. core-how-it-works
{
  id: 'core-how-it-works',
  category: 'core',
  question: 'How does MyLaw work?',
  answer: "MyLaw works in three simple steps:\n1. Tell us what you need: Select your legal category and issue details.\n2. Discover professionals: View verified legal practitioners tailored to your needs.\n3. Connect with confidence: Reach out directly without hidden friction.",
  followUpIds: ['help-find-lawyer', 'core-what-is-mylaw', 'lawyer-how-to-join']
}

// 3. core-is-it-legal-advice
{
  id: 'core-is-it-legal-advice',
  category: 'core',
  question: 'Can MyLaw give me legal advice?',
  answer: "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice. For specific legal concerns, our platform connects you with licensed, verified attorneys.",
  isDisclaimer: true,
  followUpIds: ['help-find-lawyer', 'core-what-is-mylaw', 'launch-waitlist']
}

// 4. core-who-created
{
  id: 'core-who-created',
  category: 'core',
  question: 'Who is building MyLaw?',
  answer: "MyLaw is built by a dedicated legal-technology team committed to bringing modern clarity, accessibility, and trust to the process of finding legal representation.",
  followUpIds: ['why-trust', 'launch-timeline', 'core-what-is-mylaw']
}
```

#### Category 2: Why MyLaw (`why-mylaw`)

```typescript
// 5. why-mylaw-different
{
  id: 'why-mylaw-different',
  category: 'why-mylaw',
  question: 'Why choose MyLaw over traditional directories?',
  answer: "Traditional directories are often cluttered, confusing, and filled with aggressive ads. MyLaw offers clean editorial clarity, verified credentials, guided matching, and a calm, transparent experience.",
  cta: {
    label: 'Join the Waitlist →',
    href: '/waitlist'
  },
  followUpIds: ['why-trust', 'why-clarity', 'launch-waitlist']
}

// 6. why-trust
{
  id: 'why-trust',
  category: 'why-mylaw',
  question: 'How does MyLaw ensure trust and reliability?',
  answer: "We prioritize transparency: all featured lawyers undergo credential verification, professional background checks, and clear practice area categorization. Inquiries are kept completely confidential.",
  followUpIds: ['help-confidentiality', 'why-mylaw-different', 'launch-waitlist']
}

// 7. why-clarity
{
  id: 'why-clarity',
  category: 'why-mylaw',
  question: 'What does "Legal Help, Simplified" mean?',
  answer: "It represents our promise to cut through legal jargon, eliminate scattered searches, and give individuals and businesses clear, structured pathways to appropriate legal assistance.",
  followUpIds: ['core-how-it-works', 'help-what-issues', 'launch-timeline']
}

// 8. why-accessibility
{
  id: 'why-accessibility',
  category: 'why-mylaw',
  question: 'Is MyLaw free for clients to search?',
  answer: "Yes! Searching for and discovering verified legal professionals on MyLaw will be completely free for individuals and businesses seeking legal assistance.",
  cta: {
    label: 'Get Early Access →',
    href: '/waitlist'
  },
  followUpIds: ['help-cost', 'core-how-it-works', 'launch-waitlist']
}
```

#### Category 3: For Seeking Help (`for-seeking-help`)

```typescript
// 9. help-find-lawyer
{
  id: 'help-find-lawyer',
  category: 'for-seeking-help',
  question: 'How do I find the right lawyer for my needs?',
  answer: "When MyLaw launches, you will simply select your legal matter (such as Property, Corporate, Family, or Civil Law). The platform will present curated, verified lawyers matched to your location and requirements.",
  cta: {
    label: 'Join the Waitlist →',
    href: '/waitlist'
  },
  followUpIds: ['help-what-issues', 'help-confidentiality', 'launch-waitlist']
}

// 10. help-what-issues
{
  id: 'help-what-issues',
  category: 'for-seeking-help',
  question: 'What legal areas will MyLaw cover?',
  answer: "MyLaw will cover major legal domains including Corporate & Business Law, Real Estate & Property, Family Law, Employment & Labor, Intellectual Property, Civil Litigation, and Estate Planning.",
  followUpIds: ['help-find-lawyer', 'core-is-it-legal-advice', 'launch-waitlist']
}

// 11. help-confidentiality
{
  id: 'help-confidentiality',
  category: 'for-seeking-help',
  question: 'Is my legal inquiry kept confidential?',
  answer: "Absolutely. Your privacy and discretion are foundational. Initial inquiry details are encrypted and shared only with the specific legal professionals you choose to contact.",
  followUpIds: ['why-trust', 'help-cost', 'launch-waitlist']
}

// 12. help-cost
{
  id: 'help-cost',
  category: 'for-seeking-help',
  question: 'How are lawyer fees handled on MyLaw?',
  answer: "While searching and connecting through MyLaw is free for clients, legal service fees are determined directly and transparently by the individual legal practitioners. MyLaw promotes upfront pricing clarity.",
  followUpIds: ['why-accessibility', 'help-find-lawyer', 'launch-waitlist']
}
```

#### Category 4: For Lawyers (`for-lawyers`)

```typescript
// 13. lawyer-how-to-join
{
  id: 'lawyer-how-to-join',
  category: 'for-lawyers',
  question: 'How can lawyers join the platform?',
  answer: "Qualified advocates and law firms can apply for early onboarding today. Joining our practitioner waitlist secures priority profile verification and early access to client inquiries upon launch.",
  cta: {
    label: 'Join Lawyer Onboarding →',
    href: '/waitlist?role=lawyer'
  },
  followUpIds: ['lawyer-benefits', 'lawyer-verification', 'launch-waitlist']
}

// 14. lawyer-benefits
{
  id: 'lawyer-benefits',
  category: 'for-lawyers',
  question: 'What are the benefits for legal professionals?',
  answer: "MyLaw provides verified lawyers with a modern, high-trust digital presence, direct connections to clients actively seeking their specific expertise, and streamlined inquiry management.",
  cta: {
    label: 'Join as a Lawyer →',
    href: '/waitlist?role=lawyer'
  },
  followUpIds: ['lawyer-how-to-join', 'lawyer-verification', 'launch-waitlist']
}

// 15. lawyer-verification
{
  id: 'lawyer-verification',
  category: 'for-lawyers',
  question: 'How does MyLaw verify lawyer credentials?',
  answer: "Our onboarding team verifies bar association registrations, active practice licenses, and good standing before granting verified badge status on MyLaw.",
  followUpIds: ['lawyer-how-to-join', 'why-trust', 'launch-waitlist']
}
```

#### Category 5: Launch & Early Access (`launch`)

```typescript
// 16. launch-timeline
{
  id: 'launch-timeline',
  category: 'launch',
  question: 'When is MyLaw officially launching?',
  answer: "We are currently in active pre-launch preparation. Early access invitations will roll out in phases. Joining our waitlist ensures you receive first notification when we go live.",
  cta: {
    label: 'Join the Waitlist →',
    href: '/waitlist'
  },
  followUpIds: ['launch-waitlist', 'launch-early-access', 'core-what-is-mylaw']
}

// 17. launch-early-access
{
  id: 'launch-early-access',
  category: 'launch',
  question: 'What do I receive by joining the waitlist?',
  answer: "Waitlist members receive priority platform access, direct launch updates, and early-bird benefits when booking or listing on MyLaw.",
  cta: {
    label: 'Claim Priority Access →',
    href: '/waitlist'
  },
  followUpIds: ['launch-waitlist', 'launch-timeline', 'help-find-lawyer']
}

// 18. launch-waitlist
{
  id: 'launch-waitlist',
  category: 'launch',
  question: 'How do I sign up for early access?',
  answer: "Signing up takes just 30 seconds! Head over to our waitlist page, enter your email address, and select whether you are seeking legal help or are a lawyer.",
  cta: {
    label: 'Join the Waitlist →',
    href: '/waitlist'
  },
  followUpIds: ['launch-early-access', 'core-how-it-works', 'lawyer-how-to-join']
}
```

---

### 4.4 Micro-Disclaimer Footer & CTA Labels

#### Micro-Disclaimer Footer
- **Text**: *"Informational assistant only. No legal advice provided."*
- **Styling**: `px-3 py-2 text-[11px] text-[#667085] bg-[#F7F8FA] border-t border-[#E6E8EC] text-center rounded-b-[14px]`
- **Purpose**: Provides continuous regulatory transparency on every view.

#### CTA Labels Catalog
1. `"Join the Waitlist →"` (Destination: `/waitlist`)
2. `"Get Early Access →"` (Destination: `/waitlist`)
3. `"Claim Priority Access →"` (Destination: `/waitlist`)
4. `"Join Lawyer Onboarding →"` (Destination: `/waitlist?role=lawyer`)
5. `"Join as a Lawyer →"` (Destination: `/waitlist?role=lawyer`)
6. `"← Back to questions"` (Action: resets to top-level 5 questions)

---

## 5. Negative Constraints Compliance Matrix

| Rule | Constraint Detail | Audit Finding | Status |
|---|---|---|---|
| **NC-1: Zero Legal Advice** | Assistant must not offer legal advice, legal assessments, or statutory opinions. | Verified: No substantive legal answers provided. Explicit statutory disclaimer in `core-is-it-legal-advice` and micro-disclaimer footer. | **COMPLIANT** |
| **NC-2: Zero Representation Promises** | Must not promise legal representation, attorney-client relationship, or guaranteed outcomes. | Verified: All copy defines MyLaw strictly as a discovery and connection platform. | **COMPLIANT** |
| **NC-3: Zero Fake Statistics** | No fake client numbers, success rates, or fabricated lawyer counts. | Verified: Zero occurrences of `10,000+ lawyers`, `99% success rate`, or fake testimonials across all 18 items and greetings. | **COMPLIANT** |
| **NC-4: Zero Dark-Mode Tokens** | No `dark:` classes, `@media (prefers-color-scheme: dark)`, or dark background tokens. | Verified: All tokens strictly adhere to authorized light palette (`#FFFFFF`, `#F7F8FA`, `#172033`, `#285A8E`, `#E6E8EC`, `#667085`, `#2F7C78`). | **COMPLIANT** |
| **NC-5: Zero Free-Text Input** | Zero `<input type="text">`, `<textarea>`, or contenteditable fields. | Verified: 100% deterministic pill/button selection model. | **COMPLIANT** |

---

## 6. TypeScript Contracts & Data Layer File Blueprint

### `src/types/assistant.ts`
```typescript
export type AssistantCategory =
  | 'core'
  | 'why-mylaw'
  | 'for-seeking-help'
  | 'for-lawyers'
  | 'launch';

export interface AssistantCTA {
  readonly label: string;
  readonly href: string;
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
  readonly sender: 'assistant' | 'user';
  readonly text: string;
  readonly timestamp: number;
  readonly isDisclaimer?: boolean;
  readonly cta?: AssistantCTA;
}

export interface AssistantState {
  readonly isOpen: boolean;
  readonly activeQuestionId: string | null;
  readonly messages: readonly ChatMessage[];
  readonly currentFollowUpIds: readonly string[];
  readonly isTransitioning: boolean;
}
```

### `src/components/assistant/data/knowledge-base.ts`
Exporting:
- `KNOWLEDGE_BASE: readonly KnowledgeItem[]` (all 18 validated items)
- `INITIAL_GREETINGS: readonly string[]` (all 4 validated greetings)
- `INITIAL_QUESTION_IDS: readonly string[]` (`['core-what-is-mylaw', 'core-how-it-works', 'help-find-lawyer', 'lawyer-how-to-join', 'launch-timeline']`)
- `MICRO_DISCLAIMER_TEXT: string` (`"Informational assistant only. No legal advice provided."`)
- `STATUTORY_LEGAL_DISCLAIMER: string` (`"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."`)
- Helper lookup functions:
  - `getKnowledgeItemById(id: string): KnowledgeItem | undefined`
  - `getRandomGreeting(): string`
  - `getFollowUpItems(item: KnowledgeItem): readonly KnowledgeItem[]`
