# Milestone M1 Exploration: Knowledge Base & Data Layer

**Document Version**: 1.0.0  
**Target Milestone**: M1 — Knowledge Base & Data Layer  
**Target Module**: `src/types/assistant.ts` & `src/components/assistant/data/knowledge-base.ts`  
**Dependencies**: Next.js 16.3.3, React 19.2.8, TypeScript Strict Mode  

---

## 1. Executive Summary

Milestone M1 establishes the authoritative data foundation and TypeScript contracts for the **MyLaw Assistant Chatbot**. The assistant is a 100% deterministic, interactive product guide designed to inform users about MyLaw's platform, facilitate lawyer onboarding, and drive waitlist registrations — while strictly prohibiting free-text input, dynamic AI/LLM generation, and legal advice.

This document details:
1. **TypeScript Interface Contracts** (`src/types/assistant.ts`)
2. **Authoritative Knowledge Base Dataset (18 Q&A Items)** across 5 categories
3. **Follow-Up Linkage Graph & Routing Map** (2–3 contextual follow-ups per node + main menu reset)
4. **Curated Random Greetings & Verbatim Statutory Disclaimers**
5. **Data Access Helper Layer** for M2 conversational UI components

---

## 2. TypeScript Interface Contracts (`src/types/assistant.ts`)

```typescript
/**
 * src/types/assistant.ts
 * Type definitions for the MyLaw Assistant Chatbot.
 */

export type AssistantCategory =
  | 'core'
  | 'why-mylaw'
  | 'for-seeking-help'
  | 'for-lawyers'
  | 'launch';

export interface AssistantCategoryMeta {
  readonly key: AssistantCategory;
  readonly label: string;
  readonly description: string;
}

export interface AssistantCTA {
  readonly label: string;
  readonly href: string;
  readonly role?: 'help' | 'lawyer';
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
  readonly followUpIds?: readonly string[];
}

export interface AssistantState {
  readonly isOpen: boolean;
  readonly messages: readonly ChatMessage[];
  readonly activeQuestionId: string | null;
  readonly currentFollowUpIds: readonly string[];
  readonly isTransitioning: boolean;
  readonly hasInitialized: boolean;
}

export type AssistantAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT_QUESTION'; payload: { questionId: string } }
  | { type: 'RESET_TO_INITIAL' }
  | { type: 'CLEAR_HISTORY' };
```

---

## 3. Categories & Meta Definitions

| Category Key | Category Label | Description |
| :--- | :--- | :--- |
| `core` | Core & Platform | Overview and core mechanics of MyLaw |
| `why-mylaw` | Why MyLaw | Platform values, differentiation, and trust |
| `for-seeking-help` | For Seeking Help | How individuals and businesses find legal help |
| `for-lawyers` | For Lawyers | Onboarding, verification, and professional benefits |
| `launch` | Launch & Early Access | Timeline, early-bird benefits, and waitlist registration |

---

## 4. Exact 18 Knowledge Base Items Specification

### Category 1: Core & Platform (`core`) — 4 Items

#### 1. `core-what-is-mylaw`
- **Question**: "What is MyLaw?"
- **Answer**: "MyLaw is a modern legal platform designed to simplify how individuals and businesses discover, evaluate, and connect with qualified legal professionals. We provide editorial clarity, verified credentials, and structured pathways to legal help."
- **Follow-up IDs**: `['core-how-it-works', 'why-mylaw-different', 'launch-timeline']`
- **CTA**: None

#### 2. `core-how-it-works`
- **Question**: "How does MyLaw work?"
- **Answer**: "MyLaw works in three simple steps:\n1. Describe your need: Select your legal category and issue details.\n2. Discover verified practitioners: Browse tailored, credential-verified lawyers.\n3. Connect with confidence: Initiate direct inquiries with upfront clarity."
- **Follow-up IDs**: `['help-find-lawyer', 'why-trust', 'lawyer-how-to-join']`
- **CTA**: None

#### 3. `core-is-it-legal-advice`
- **Question**: "Can MyLaw give me legal advice?"
- **Answer**: "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.\n\nFor specific legal counsel, our platform connects you with licensed, verified attorneys who can evaluate your situation."
- **isDisclaimer**: `true`
- **Follow-up IDs**: `['help-find-lawyer', 'core-what-is-mylaw', 'launch-waitlist']`
- **CTA**: None

#### 4. `core-who-created`
- **Question**: "Who is building MyLaw?"
- **Answer**: "MyLaw is built by an experienced legal-technology team dedicated to making legal representation more transparent, accessible, and approachable for everyone."
- **Follow-up IDs**: `['why-trust', 'why-clarity', 'launch-timeline']`
- **CTA**: None

---

### Category 2: Why MyLaw (`why-mylaw`) — 4 Items

#### 5. `why-mylaw-different`
- **Question**: "Why choose MyLaw over traditional directories?"
- **Answer**: "Traditional directories are cluttered, opaque, and driven by aggressive ads. MyLaw offers curated editorial clarity, independent credential checks, transparent pricing expectations, and a calm, guided matching experience."
- **Follow-up IDs**: `['why-trust', 'why-clarity', 'launch-waitlist']`
- **CTA**: `{ label: "Join the Waitlist →", href: "/waitlist", role: "help" }`

#### 6. `why-trust`
- **Question**: "How does MyLaw ensure trust and reliability?"
- **Answer**: "Trust is foundational at MyLaw. Every legal practitioner undergoes rigorous bar registration verification and good-standing checks. In addition, client inquiries are encrypted and handled with strict confidentiality."
- **Follow-up IDs**: `['help-confidentiality', 'lawyer-verification', 'launch-waitlist']`
- **CTA**: None

#### 7. `why-clarity`
- **Question**: "What does 'Legal Help, Simplified' mean?"
- **Answer**: "It is our core mission to eliminate legal jargon, reduce search friction, and replace confusing directories with intuitive, guided pathways to qualified legal representation."
- **Follow-up IDs**: `['core-how-it-works', 'help-what-issues', 'why-accessibility']`
- **CTA**: None

#### 8. `why-accessibility`
- **Question**: "Is MyLaw free for clients to search?"
- **Answer**: "Yes! Searching for, comparing, and discovering verified legal professionals on MyLaw is 100% free for clients. You only pay for legal services arranged directly with your chosen practitioner."
- **Follow-up IDs**: `['help-cost', 'help-find-lawyer', 'launch-waitlist']`
- **CTA**: `{ label: "Get Early Access →", href: "/waitlist", role: "help" }`

---

### Category 3: For Seeking Help (`for-seeking-help`) — 4 Items

#### 9. `help-find-lawyer`
- **Question**: "How do I find the right lawyer for my needs?"
- **Answer**: "Simply select your legal domain (such as Property, Corporate, Family, or Civil Law). MyLaw presents curated, verified lawyers matched to your jurisdiction, requirements, and budget."
- **Follow-up IDs**: `['help-what-issues', 'help-confidentiality', 'launch-waitlist']`
- **CTA**: `{ label: "Join the Waitlist →", href: "/waitlist", role: "help" }`

#### 10. `help-what-issues`
- **Question**: "What legal areas will MyLaw cover?"
- **Answer**: "MyLaw will launch with comprehensive coverage across Corporate & Commercial Law, Real Estate & Property, Family & Estate, Employment & Labor, Intellectual Property, and Civil Litigation."
- **Follow-up IDs**: `['help-find-lawyer', 'core-is-it-legal-advice', 'launch-timeline']`
- **CTA**: None

#### 11. `help-confidentiality`
- **Question**: "Is my legal inquiry kept confidential?"
- **Answer**: "Yes, absolutely. Your initial inquiries and matter descriptions are encrypted and shared exclusively with the verified legal professionals you choose to contact."
- **Follow-up IDs**: `['why-trust', 'help-cost', 'launch-waitlist']`
- **CTA**: None

#### 12. `help-cost`
- **Question**: "How are lawyer fees handled on MyLaw?"
- **Answer**: "Searching on MyLaw is completely free. Legal service fees are established directly and transparently by the legal practitioners. MyLaw encourages upfront fee clarity and transparent billing models."
- **Follow-up IDs**: `['why-accessibility', 'help-find-lawyer', 'launch-waitlist']`
- **CTA**: None

---

### Category 4: For Lawyers (`for-lawyers`) — 3 Items

#### 13. `lawyer-how-to-join`
- **Question**: "How can lawyers join the platform?"
- **Answer**: "Licensed advocates and law firms can apply for early practitioner onboarding today. Joining our lawyer waitlist ensures priority profile verification and early access to client inquiries upon launch."
- **Follow-up IDs**: `['lawyer-benefits', 'lawyer-verification', 'launch-waitlist']`
- **CTA**: `{ label: "Join Lawyer Onboarding →", href: "/waitlist?role=lawyer", role: "lawyer" }`

#### 14. `lawyer-benefits`
- **Question**: "What are the benefits for legal professionals?"
- **Answer**: "MyLaw provides verified practitioners with an editorial digital profile, direct connections to clients actively seeking their specific domain expertise, and high-trust visibility without advertising clutter."
- **Follow-up IDs**: `['lawyer-how-to-join', 'lawyer-verification', 'launch-timeline']`
- **CTA**: `{ label: "Join as a Lawyer →", href: "/waitlist?role=lawyer", role: "lawyer" }`

#### 15. `lawyer-verification`
- **Question**: "How does MyLaw verify lawyer credentials?"
- **Answer**: "Our compliance team validates bar council registrations, active practice credentials, and disciplinary records to ensure all listed practitioners maintain verified good standing."
- **Follow-up IDs**: `['lawyer-how-to-join', 'why-trust', 'lawyer-benefits']`
- **CTA**: None

---

### Category 5: Launch & Early Access (`launch`) — 3 Items

#### 16. `launch-timeline`
- **Question**: "When is MyLaw launching?"
- **Answer**: "We are currently in active pre-launch development. Early access will roll out in phases. Joining our waitlist ensures you receive first access as soon as invitations open."
- **Follow-up IDs**: `['launch-early-access', 'launch-waitlist', 'core-what-is-mylaw']`
- **CTA**: `{ label: "Join the Waitlist →", href: "/waitlist", role: "help" }`

#### 17. `launch-early-access`
- **Question**: "What do I receive by joining the waitlist?"
- **Answer**: "Waitlist members receive priority invitation codes, direct product updates, and early-bird benefits when booking or listing legal services on MyLaw."
- **Follow-up IDs**: `['launch-waitlist', 'launch-timeline', 'help-find-lawyer']`
- **CTA**: `{ label: "Claim Priority Access →", href: "/waitlist", role: "help" }`

#### 18. `launch-waitlist`
- **Question**: "How do I sign up for early access?"
- **Answer**: "Signing up takes less than 30 seconds! Visit our waitlist page, enter your email address, and select whether you are seeking legal help or are a lawyer."
- **Follow-up IDs**: `['launch-early-access', 'core-how-it-works', 'lawyer-how-to-join']`
- **CTA**: `{ label: "Join the Waitlist →", href: "/waitlist", role: "help" }`

---

## 5. Initial 5 Top-Level Questions

When the chat panel opens or the user resets via `"← Back to questions"`, these 5 primary questions are presented:

1. `core-what-is-mylaw` — *"What is MyLaw?"*
2. `core-how-it-works` — *"How does MyLaw work?"*
3. `help-find-lawyer` — *"How do I find the right lawyer for my needs?"*
4. `lawyer-how-to-join` — *"How can lawyers join the platform?"*
5. `launch-timeline` — *"When is MyLaw launching?"*

---

## 6. Curated Greetings Pool (Random Selector)

When the assistant opens, one of the following 4 greetings is selected at random:

```typescript
export const GREETINGS: readonly string[] = [
  "Hi there! Welcome to MyLaw. How can I help you explore our upcoming platform today?",
  "Hello! I'm the MyLaw Assistant. Select any question below to learn more about what we're building.",
  "Welcome to MyLaw! Looking to discover legal help or join as a legal professional? Pick a topic below to get started.",
  "Hello! Curious about MyLaw? Choose a topic below to see how we're making legal help simpler and more accessible."
];
```

---

## 7. Legal Disclaimer Verifications

### 7.1 Mandatory Conversational Disclaimer (Verbatim)
> *"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."*

- **Embedded in**: `core-is-it-legal-advice` response.
- **Flag**: `isDisclaimer: true`.

### 7.2 Micro-Disclaimer Footer (Verbatim)
> *"Informational assistant only. No legal advice provided."*

- **Embedded in**: Permanent panel footer bar.

---

## 8. Data Access Helper Functions (`src/components/assistant/data/knowledge-base.ts`)

```typescript
/**
 * src/components/assistant/data/knowledge-base.ts
 */

import { AssistantCategoryMeta, KnowledgeItem } from '@/types/assistant';

export const CATEGORIES: readonly AssistantCategoryMeta[] = [
  { key: 'core', label: 'Core & Platform', description: 'Overview and core mechanics of MyLaw' },
  { key: 'why-mylaw', label: 'Why MyLaw', description: 'Platform values, differentiation, and trust' },
  { key: 'for-seeking-help', label: 'For Seeking Help', description: 'How individuals and businesses find legal help' },
  { key: 'for-lawyers', label: 'For Lawyers', description: 'Onboarding, verification, and professional benefits' },
  { key: 'launch', label: 'Launch & Early Access', description: 'Timeline, early-bird benefits, and waitlist registration' }
];

export const INITIAL_QUESTION_IDS: readonly string[] = [
  'core-what-is-mylaw',
  'core-how-it-works',
  'help-find-lawyer',
  'lawyer-how-to-join',
  'launch-timeline'
];

export const LEGAL_DISCLAIMER_TEXT =
  "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.";

export const MICRO_DISCLAIMER_TEXT =
  "Informational assistant only. No legal advice provided.";

export const KNOWLEDGE_ITEMS: readonly KnowledgeItem[] = [
  // 18 items as specified in Section 4
];

const KNOWLEDGE_MAP = new Map<string, KnowledgeItem>(
  KNOWLEDGE_ITEMS.map((item) => [item.id, item])
);

export function getKnowledgeItemById(id: string): KnowledgeItem | undefined {
  return KNOWLEDGE_MAP.get(id);
}

export function getInitialQuestions(): KnowledgeItem[] {
  return INITIAL_QUESTION_IDS
    .map((id) => KNOWLEDGE_MAP.get(id))
    .filter((item): item is KnowledgeItem => Boolean(item));
}

export function getFollowUpQuestions(currentId: string): KnowledgeItem[] {
  const current = KNOWLEDGE_MAP.get(currentId);
  if (!current) return getInitialQuestions();
  return current.followUpIds
    .map((id) => KNOWLEDGE_MAP.get(id))
    .filter((item): item is KnowledgeItem => Boolean(item));
}

export function getRandomGreeting(): string {
  const index = Math.floor(Math.random() * GREETINGS.length);
  return GREETINGS[index] ?? GREETINGS[0];
}
```

---

## 9. Verification & Graph Integrity Matrix

A static validation check confirms:
- **Total Knowledge Items**: Exactly 18 items.
- **Category Distribution**: 4 `core`, 4 `why-mylaw`, 4 `for-seeking-help`, 3 `for-lawyers`, 3 `launch`. Total = 18.
- **Graph Completeness**: 100% of the 54 `followUpIds` (3 per item * 18 items) resolve to valid, existing IDs in the knowledge map. Zero dead-ends, zero broken links.
- **CTA Metadata Integrity**: All CTAs point to `/waitlist` or `/waitlist?role=lawyer`.
- **Initial Questions**: All 5 IDs exist and represent diverse top-level categories.
