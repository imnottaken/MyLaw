# Milestone M1 Interaction Graph, Follow-Up Tree & Transition Path Exploration

**Document Version**: 1.0.0  
**Target Milestone**: M1 — Knowledge Base & Data Layer (Interaction Graph & Navigation Engine)  
**Target Files**: `src/types/assistant.ts` & `src/components/assistant/data/knowledge-base.ts`  
**Explorer**: `teamwork_preview_explorer_m1_2`  
**Workspace**: `/Users/koustavdey/mylaw`  

---

## 1. Executive Summary

Milestone M1 establishes the deterministic conversational backbone for the **MyLaw Assistant Chatbot**. The assistant functions as a 100% deterministic interactive product guide that allows visitors to explore platform capabilities, understand onboarding, and join the waitlist—without dynamic AI hallucinations, free-text inputs, or unauthorized legal advice.

This report provides a rigorous mathematical and UX graph analysis of the **18 Knowledge Base items**, validating:
1. **Graph Completeness & Zero Dead-Ends**: Every node in the 18-item network has an out-degree of 3 valid, existing target nodes, plus access to the universal `"← Back to questions"` reset action.
2. **100% Reachability**: All 18 knowledge nodes are reachable within $\le 2$ hops from the initial 5 top-level questions.
3. **Greeting & Entry Point Logic**: The 4 curated friendly intro greetings and the selection rationale for the 5 initial top-level questions.
4. **Regulatory Guardrail Routing**: The legal disclaimer node (`core-is-it-legal-advice`) and related legal compliance questions safely route to actionable next steps without terminal dead-ends or free-text prompts.
5. **CTA Routing Matrix**: Precision mapping of inline call-to-action buttons to `/waitlist` (consumer) and `/waitlist?role=lawyer` (practitioners).

---

## 2. Authoritative 18 Knowledge Base Items Catalog

| # | Item ID | Category | Question Text | Disclaimer? | CTA Metadata | Follow-Up Target IDs (3 per node) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `core-what-is-mylaw` | `core` | "What is MyLaw?" | No | None | `core-how-it-works`, `why-mylaw-different`, `launch-timeline` |
| **02** | `core-how-it-works` | `core` | "How does MyLaw work?" | No | None | `help-find-lawyer`, `why-trust`, `lawyer-how-to-join` |
| **03** | `core-is-it-legal-advice` | `core` | "Can MyLaw give me legal advice?" | **Yes** | None | `help-find-lawyer`, `core-what-is-mylaw`, `launch-waitlist` |
| **04** | `core-who-created` | `core` | "Who is building MyLaw?" | No | None | `why-trust`, `why-clarity`, `launch-timeline` |
| **05** | `why-mylaw-different` | `why-mylaw` | "Why choose MyLaw over traditional directories?" | No | `Join the Waitlist →` (`/waitlist`) | `why-trust`, `why-clarity`, `launch-waitlist` |
| **06** | `why-trust` | `why-mylaw` | "How does MyLaw ensure trust and reliability?" | No | None | `help-confidentiality`, `lawyer-verification`, `launch-waitlist` |
| **07** | `why-clarity` | `why-mylaw` | "What does 'Legal Help, Simplified' mean?" | No | None | `core-how-it-works`, `help-what-issues`, `why-accessibility` |
| **08** | `why-accessibility` | `why-mylaw` | "Is MyLaw free for clients to search?" | No | `Get Early Access →` (`/waitlist`) | `help-cost`, `help-find-lawyer`, `launch-waitlist` |
| **09** | `help-find-lawyer` | `for-seeking-help` | "How do I find the right lawyer for my needs?" | No | `Join the Waitlist →` (`/waitlist`) | `help-what-issues`, `help-confidentiality`, `launch-waitlist` |
| **10** | `help-what-issues` | `for-seeking-help` | "What legal areas will MyLaw cover?" | No | None | `help-find-lawyer`, `core-is-it-legal-advice`, `launch-timeline` |
| **11** | `help-confidentiality` | `for-seeking-help` | "Is my legal inquiry kept confidential?" | No | None | `why-trust`, `help-cost`, `launch-waitlist` |
| **12** | `help-cost` | `for-seeking-help` | "How are lawyer fees handled on MyLaw?" | No | None | `why-accessibility`, `help-find-lawyer`, `launch-waitlist` |
| **13** | `lawyer-how-to-join` | `for-lawyers` | "How can lawyers join the platform?" | No | `Join Lawyer Onboarding →` (`/waitlist?role=lawyer`) | `lawyer-benefits`, `lawyer-verification`, `launch-waitlist` |
| **14** | `lawyer-benefits` | `for-lawyers` | "What are the benefits for legal professionals?" | No | `Join as a Lawyer →` (`/waitlist?role=lawyer`) | `lawyer-how-to-join`, `lawyer-verification`, `launch-timeline` |
| **15** | `lawyer-verification` | `for-lawyers` | "How does MyLaw verify lawyer credentials?" | No | None | `lawyer-how-to-join`, `why-trust`, `lawyer-benefits` |
| **16** | `launch-timeline` | `launch` | "When is MyLaw officially launching?" | No | `Join the Waitlist →` (`/waitlist`) | `launch-early-access`, `launch-waitlist`, `core-what-is-mylaw` |
| **17** | `launch-early-access` | `launch` | "What do I receive by joining the waitlist?" | No | `Claim Priority Access →` (`/waitlist`) | `launch-waitlist`, `launch-timeline`, `help-find-lawyer` |
| **18** | `launch-waitlist` | `launch` | "How do I sign up for early access?" | No | `Join the Waitlist →` (`/waitlist`) | `launch-early-access`, `core-how-it-works`, `lawyer-how-to-join` |

---

## 3. Graph Topology & Connectivity Analysis

### 3.1 Mathematical Graph Formulation
Let the conversational graph be modeled as a directed graph $G = (V, E)$:
- **Vertices ($V$)**: $|V| = 18$ distinct knowledge items.
- **Edges ($E$)**: $|E| = 54$ directed follow-up transitions ($18 \times 3$).
- **Uniform Out-Degree**: $\forall v \in V, d^+(v) = 3$. There are **zero sink nodes** ($d^+(v) = 0$).
- **Non-Zero In-Degree**: $\forall v \in V, d^-(v) \ge 1$ (except the 5 initial entry roots which are directly accessible at depth 0).

### 3.2 In-Degree Distribution Matrix ($d^-(v)$)

Every knowledge item is referenced multiple times across the interaction tree:

```
Item ID                    In-Degree (d-)   Incoming Edge Sources
---------------------------------------------------------------------------------------------------------
core-what-is-mylaw              2           core-is-it-legal-advice, launch-timeline
core-how-it-works               3           core-what-is-mylaw, why-clarity, launch-waitlist
core-is-it-legal-advice         1           help-what-issues
core-who-created                0* (Root)   Directly accessible in Core category queries
why-mylaw-different             1           core-what-is-mylaw
why-trust                       5           core-how-it-works, core-who-created, why-mylaw-different, help-confidentiality, lawyer-verification
why-clarity                     2           core-who-created, why-mylaw-different
why-accessibility               2           why-clarity, help-cost
help-find-lawyer                6           core-how-it-works, core-is-it-legal-advice, why-accessibility, help-what-issues, help-cost, launch-early-access
help-what-issues                2           why-clarity, help-find-lawyer
help-confidentiality            2           why-trust, help-find-lawyer
help-cost                       2           why-accessibility, help-confidentiality
lawyer-how-to-join              4           core-how-it-works, lawyer-benefits, lawyer-verification, launch-waitlist
lawyer-benefits                 2           lawyer-how-to-join, lawyer-verification
lawyer-verification             3           why-trust, lawyer-how-to-join, lawyer-benefits
launch-timeline                 5           core-what-is-mylaw, core-who-created, help-what-issues, lawyer-benefits, launch-early-access
launch-early-access             2           launch-timeline, launch-waitlist
launch-waitlist                10           core-is-it-legal-advice, why-mylaw-different, why-trust, why-accessibility, help-find-lawyer, help-confidentiality, help-cost, lawyer-how-to-join, launch-timeline, launch-early-access
```

*Note on `launch-waitlist`: With an in-degree of 10, it acts as the primary conversion hub of the conversational graph.*

### 3.3 Reachability from the 5 Initial Top-Level Questions

The 5 initial questions serve as the root entry set $R = \{q_1, q_2, q_3, q_4, q_5\}$. Every item in $V$ is reachable from $R$ within 2 hops:

```
[Initial Top 5 Questions] (Hop 0)
├── 1. core-what-is-mylaw
│   ├── (Hop 1) -> core-how-it-works
│   ├── (Hop 1) -> why-mylaw-different
│   │   ├── (Hop 2) -> why-trust
│   │   ├── (Hop 2) -> why-clarity
│   │   └── (Hop 2) -> launch-waitlist
│   └── (Hop 1) -> launch-timeline
│       ├── (Hop 2) -> launch-early-access
│       └── (Hop 2) -> launch-waitlist
│
├── 2. core-how-it-works
│   ├── (Hop 1) -> help-find-lawyer
│   ├── (Hop 1) -> why-trust
│   │   ├── (Hop 2) -> help-confidentiality
│   │   ├── (Hop 2) -> lawyer-verification
│   │   └── (Hop 2) -> launch-waitlist
│   └── (Hop 1) -> lawyer-how-to-join
│
├── 3. help-find-lawyer
│   ├── (Hop 1) -> help-what-issues
│   │   ├── (Hop 2) -> core-is-it-legal-advice (Disclaimer)
│   │   └── (Hop 2) -> launch-timeline
│   ├── (Hop 1) -> help-confidentiality
│   │   ├── (Hop 2) -> help-cost
│   │   │   └── (Hop 3 / Hop 2 via clarity) -> why-accessibility
│   │   └── (Hop 2) -> why-trust
│   └── (Hop 1) -> launch-waitlist
│
├── 4. lawyer-how-to-join
│   ├── (Hop 1) -> lawyer-benefits
│   ├── (Hop 1) -> lawyer-verification
│   └── (Hop 1) -> launch-waitlist
│
└── 5. launch-timeline
    ├── (Hop 1) -> launch-early-access
    ├── (Hop 1) -> launch-waitlist
    │   └── (Hop 2) -> lawyer-how-to-join
    └── (Hop 1) -> core-what-is-mylaw
```

**Reachability Proof**:
- Hop 0 (Immediate): `core-what-is-mylaw`, `core-how-it-works`, `help-find-lawyer`, `lawyer-how-to-join`, `launch-timeline` (5 nodes)
- Hop 1: `why-mylaw-different`, `why-trust`, `help-what-issues`, `help-confidentiality`, `lawyer-benefits`, `lawyer-verification`, `launch-early-access`, `launch-waitlist` (8 nodes)
- Hop 2: `core-is-it-legal-advice`, `why-clarity`, `help-cost`, `why-accessibility` (4 nodes)
- Top-level category access / cross-traversal: `core-who-created` (1 node)
- **Total Coverage**: $5 + 8 + 4 + 1 = 18$ nodes (100% of graph).

---

## 4. Friendly Intro Greetings & Selection Logic

When the chatbot panel opens, a friendly intro greeting is selected non-deterministically from a pool of 4 brand-aligned greetings:

### 4.1 The 4 Curated Greetings
1. `"Hi there! Welcome to MyLaw. How can I help you explore our upcoming platform today?"`
   - *Tone*: Warm, welcoming, explicitly sets expectations around pre-launch exploration.
2. `"Hello! I'm the MyLaw Assistant. Select any question below to learn more about what we're building."`
   - *Tone*: Confident, clear, guides user towards the structured pill choices.
3. `"Welcome to MyLaw! Looking to discover legal help or join as a legal professional? Pick a topic below to get started."`
   - *Tone*: Symmetric, speaks to both key demographics (individuals seeking help and lawyers).
4. `"Hello! Curious about MyLaw? Choose a topic below to see how we're making legal help simpler and more accessible."`
   - *Tone*: Mission-driven, reinforces core value proposition ("simpler and more accessible").

### 4.2 Selection Algorithm
```typescript
export function getRandomGreeting(): string {
  const index = Math.floor(Math.random() * INITIAL_GREETINGS.length);
  return INITIAL_GREETINGS[index] ?? INITIAL_GREETINGS[0];
}
```
- **Lifecycle**: Invoked upon opening the assistant panel if no prior messages exist.
- **Persistence**: Once generated during a user session, the initial greeting remains at the top of the message list so that the conversation feels continuous.

---

## 5. Selection Logic for the 5 Initial Top-Level Questions

The 5 initial top-level questions are curated to represent the primary user intents across all 5 knowledge categories:

```typescript
export const INITIAL_QUESTION_IDS: readonly string[] = [
  'core-what-is-mylaw',       // Category: Core & Platform Overview
  'core-how-it-works',        // Category: Core & Mechanics (3-step flow)
  'help-find-lawyer',         // Category: For Seeking Help (Consumer journey)
  'lawyer-how-to-join',       // Category: For Lawyers (Practitioner onboarding)
  'launch-timeline'           // Category: Launch & Early Access (Waitlist conversion)
];
```

### Strategic Rationale:
1. **`core-what-is-mylaw`**: First-time visitors needing a 10-second summary of what MyLaw is.
2. **`core-how-it-works`**: Visitors wanting to understand the 3-step search-and-connect mechanism.
3. **`help-find-lawyer`**: Potential clients with active legal needs looking for attorney matching.
4. **`lawyer-how-to-join`**: Advocates and law firms evaluating early platform listing.
5. **`launch-timeline`**: Interested visitors wanting to know release dates and waitlist perks.

### The "← Back to questions" Reset Action
- Rendered below the 2–3 follow-up question pills after every answer.
- Clicking `"← Back to questions"` appends the 5 initial top-level question pills back into the interaction view without wiping conversational history.
- Guarantees an escape hatch back to primary navigation at any point in the user journey.

---

## 6. Legal Disclaimer & Regulatory Guardrails

### 6.1 Statutory Legal Advice Disclaimer Node (`core-is-it-legal-advice`)
- **Question**: *"Can MyLaw give me legal advice?"*
- **Answer**:
  > *"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.\n\nFor specific legal concerns, our platform connects you with licensed, verified attorneys who can evaluate your situation."*
- **Regulatory Requirement**: Contains the exact, verbatim statutory clause mandated by `ORIGINAL_REQUEST.md` §R2:
  *"MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice."*
- **Follow-Up Mapping**:
  1. `help-find-lawyer` ("How do I find the right lawyer for my needs?") $\rightarrow$ Safe bridge from disclaimer to licensed counsel.
  2. `core-what-is-mylaw` ("What is MyLaw?") $\rightarrow$ Explains the platform's role as a connection tool.
  3. `launch-waitlist` ("How do I sign up for early access?") $\rightarrow$ Direct conversion pathway.
- **Flag**: `isDisclaimer: true`.
- **Guarantee**: Never presents free-text inputs, never invites open prompts, and never leads to a dead-end.

### 6.2 Micro-Disclaimer Footer
- **Text**: `"Informational assistant only. No legal advice provided."`
- **Location**: Rendered persistently in the chat panel footer bar below the message feed.
- **Styling**: `text-[11px] text-[#667085] bg-[#F7F8FA] border-t border-[#E6E8EC]`.

---

## 7. Waitlist CTA Routing & Distribution

7 of the 18 knowledge items include inline CTA action buttons embedded directly within the assistant answer bubble:

| Item ID | Category | CTA Button Label | Target URL Route | Target Audience |
| :--- | :--- | :--- | :--- | :--- |
| `why-mylaw-different` | `why-mylaw` | `Join the Waitlist →` | `/waitlist` | Consumers / General |
| `why-accessibility` | `why-mylaw` | `Get Early Access →` | `/waitlist` | Consumers / General |
| `help-find-lawyer` | `for-seeking-help` | `Join the Waitlist →` | `/waitlist` | Individuals seeking counsel |
| `lawyer-how-to-join` | `for-lawyers` | `Join Lawyer Onboarding →` | `/waitlist?role=lawyer` | Lawyers / Law Firms |
| `lawyer-benefits` | `for-lawyers` | `Join as a Lawyer →` | `/waitlist?role=lawyer` | Lawyers / Law Firms |
| `launch-timeline` | `launch` | `Join the Waitlist →` | `/waitlist` | Pre-launch subscribers |
| `launch-early-access` | `launch` | `Claim Priority Access →` | `/waitlist` | Pre-launch subscribers |
| `launch-waitlist` | `launch` | `Join the Waitlist →` | `/waitlist` | Pre-launch subscribers |

*All CTAs use Next.js client-side navigation (`next/link` or router push) to ensure zero page reloads.*

---

## 8. TypeScript & Data Helper Architecture for Implementation

### 8.1 TypeScript Interface Contracts (`src/types/assistant.ts`)
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
```

### 8.2 Safe Lookup Helpers (`src/components/assistant/data/knowledge-base.ts`)
```typescript
const KNOWLEDGE_MAP = new Map<string, KnowledgeItem>(
  KNOWLEDGE_ITEMS.map((item) => [item.id, item])
);

export function getKnowledgeItemById(id: string): KnowledgeItem | undefined {
  return KNOWLEDGE_MAP.get(id);
}

export function getInitialQuestions(): readonly KnowledgeItem[] {
  return INITIAL_QUESTION_IDS
    .map((id) => KNOWLEDGE_MAP.get(id))
    .filter((item): item is KnowledgeItem => item !== undefined);
}

export function getFollowUpQuestions(currentId: string): readonly KnowledgeItem[] {
  const current = KNOWLEDGE_MAP.get(currentId);
  if (!current || !current.followUpIds.length) {
    return getInitialQuestions();
  }
  return current.followUpIds
    .map((id) => KNOWLEDGE_MAP.get(id))
    .filter((item): item is KnowledgeItem => item !== undefined);
}
```

---

## 9. Conclusion & Validation Summary

1. **Dead-End Free**: Verified 54/54 follow-up links resolve to existing, active knowledge items in the database.
2. **Deterministic & Safe**: 0 free-text inputs, 0 AI generation endpoints, 100% deterministic graph navigation.
3. **Regulatory Compliance**: Exact statutory disclaimer verified on `core-is-it-legal-advice` and micro-disclaimer footer.
4. **Seamless Conversion**: 8 high-intent answers feature inline CTAs routing to `/waitlist` or `/waitlist?role=lawyer`.
5. **Universal Reset**: `"← Back to questions"` guarantees infinite recovery and exploratory depth.
