# MyLaw Assistant Chatbot — Comprehensive Specification Report

**Document Status**: Authoritative Specification & Interaction Catalog  
**Target Platform**: Next.js 16 (App Router), React 19, TypeScript (Strict), Tailwind CSS v4  
**Design Tokens**: MyLaw Editorial Design System (`#172033`, `#285A8E`, `#F7F8FA`, `#FFFFFF`, `#E6E8EC`, `#2F7C78`)  
**Scope**: Pre-launch deterministic interactive product assistant (zero free-text input, zero dynamic AI/LLM generation, zero legal advice)

---

## 1. Executive Summary & Product Objective

The **MyLaw Assistant** is a compact, elegant, floating interactive assistant designed to guide website visitors through MyLaw's value proposition, upcoming platform features, lawyer onboarding opportunities, and launch waitlist registration.

### Core Principles & Non-Negotiable Guardrails
1. **100% Deterministic Knowledge Base**: Every interaction is driven by curated, predefined questions, answers, and follow-up trees. No external AI APIs, no LLM streaming, no non-deterministic responses.
2. **Zero Free-Text Input**: No text inputs, search boxes, or textareas. Interaction occurs solely via guided clickable pills and bubbles.
3. **Strict Legal Advice Exclusion**: The assistant explicitly does not provide legal advice, case evaluations, or counsel recommendations. Any inquiry regarding legal advice triggers the standard legal disclaimer.
4. **Non-Destructive Integration**: Global floating component (mounted via `layout.tsx` or global client portal) that does not alter or disrupt the existing landing page (`/`) or waitlist page (`/waitlist`) layout, DOM structure, or styles.
5. **Seamless Waitlist Conversion**: Relevant answers include an inline action button routing users directly to `/waitlist` (with role pre-selection support) without duplicating the waitlist form inside the chat panel.

---

## 2. Floating Button Trigger UI Specification

| Attribute | Specification | Implementation Standard |
| :--- | :--- | :--- |
| **Position** | Fixed, bottom-right corner | `fixed bottom-6 right-6 z-50` (desktop); `fixed bottom-4 right-4 z-50` (mobile) |
| **Dimensions** | Circular, 48px – 56px diameter | `w-14 h-14` (56px) or `w-12 h-12` (48px) |
| **Background Color** | Primary brand blue / navy | `#285A8E` (`bg-[#285A8E]`), hover: `#1e4670` (`hover:bg-[#1e4670]`) |
| **Foreground / Icon** | Pure white icon | `#FFFFFF` (`text-white`) |
| **Icon Graphic** | Chat & Sparkle / Sparkles icon | Lucide `Sparkles` or `MessageSquare` + subtle sparkle badge |
| **Border & Outline** | Subtle border with clean focus ring | `border border-white/20 shadow-[0_4px_16px_rgba(23,32,51,0.18)]` |
| **Hover Tooltip** | "Ask MyLaw" tooltip | Floating label positioned above or to the left of button with 150ms fade transition; `bg-[#172033] text-white text-xs px-2.5 py-1 rounded-[6px] shadow-md` |
| **Accessibility (ARIA)**| Semantic accessible button | `aria-label="Open MyLaw Assistant"`, `aria-expanded={isOpen}`, `aria-controls="mylaw-chat-panel"` |
| **Active/Open State** | Transition to close or active state | Smooth rotation or icon switch when panel is open |

---

## 3. Chat Panel UI & Visual Design Specification

| Component Element | Specification Details | Styling & Design Tokens |
| :--- | :--- | :--- |
| **Panel Position** | Fixed bottom-right overlay | Desktop: `fixed bottom-24 right-6 z-50`; Mobile: `fixed inset-x-4 bottom-20 z-50 max-w-sm ml-auto` |
| **Panel Dimensions** | Compact, readable proportions | Desktop: `w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)]` |
| **Corner Radius** | Soft editorial radius | `rounded-[14px]` or `rounded-[16px]` |
| **Panel Background** | Surface white | `#FFFFFF` (`bg-white`) |
| **Panel Border & Shadow**| Subtle grey border + soft elevation | `border border-[#E6E8EC] shadow-[0_12px_36px_rgba(23,32,51,0.14),0_2px_6px_rgba(16,24,40,0.04)]` |
| **Header Bar** | "MyLaw ● Assistant" with active status dot and close button | Height: `56px`, `bg-[#172033] text-white px-4 flex items-center justify-between border-b border-white/10 rounded-t-[14px]` |
| **Header Title** | Brand wordmark + status indicator | `<span className="font-bold tracking-tight">MyLaw</span> <span className="w-2 h-2 rounded-full bg-[#2F7C78] inline-block animate-pulse"></span> <span className="text-white/80 font-normal text-sm">Assistant</span>` |
| **Header Actions** | Close button & optional Reset button | Close button: `aria-label="Close MyLaw Assistant"`, hover background `hover:bg-white/10 rounded-full p-1.5 transition-colors` |
| **Scrollable Message Area**| Auto-scrolling conversation feed | `p-4 space-y-3.5 overflow-y-auto flex-1 bg-[#FFFFFF] scroll-smooth` |
| **Footer / Disclaimer Area**| Permanent micro-disclaimer footer | Height `36px`, `px-3 py-2 text-[11px] text-[#667085] bg-[#F7F8FA] border-t border-[#E6E8EC] text-center rounded-b-[14px]` with text: *"Informational assistant only. No legal advice provided."* |

---

## 4. Message Bubbles & Interaction Styling

### 4.1 Assistant Message Bubble
- **Container**: Left-aligned, max-width `88%` of panel.
- **Styling**: `bg-[#F7F8FA] text-[#172033] border border-[#E6E8EC] rounded-[12px] rounded-tl-sm p-3.5 text-[13.5px] leading-relaxed shadow-sm`
- **Avatar/Indicator**: Small 20px badge with MyLaw logo or `Sparkles` icon.
- **Animation**: Smooth entry fade + slide-up (`150ms–200ms ease-out`).

### 4.2 User Message Bubble
- **Container**: Right-aligned, max-width `82%` of panel.
- **Styling**: `bg-[#285A8E] text-white rounded-[12px] rounded-tr-sm p-3 text-[13.5px] font-medium leading-snug shadow-sm`
- **Animation**: Instant entry with subtle `scale(0.98 -> 1.0)`.

### 4.3 Question & Follow-Up Option Bubbles (Interactive Pills)
- **Container**: Full width or flex-wrap pill group beneath assistant answer.
- **Styling**: `w-full text-left px-3.5 py-2.5 rounded-[8px] bg-white border border-[#E6E8EC] hover:border-[#285A8E]/40 hover:bg-[#F7F8FA] text-[#172033] text-[13px] font-medium flex items-center justify-between gap-2 transition-all duration-150 shadow-[0_1px_2px_rgba(16,24,40,0.03)] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#285A8E]`
- **Trailing Icon**: Subtle `ChevronRight` icon (`text-[#667085] w-3.5 h-3.5`).

### 4.4 "← Back to Questions" Action
- **Styling**: `w-full text-center py-2 px-3 rounded-[6px] text-xs font-semibold text-[#285A8E] bg-[#F7F8FA] hover:bg-[#E6E8EC]/70 border border-[#E6E8EC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer`
- **Behavior**: Clears current drilled-down branch or appends navigation reset, displaying the 5 top-level category questions.

### 4.5 Inline Waitlist CTA Button
- **Placement**: Nested inside or directly attached to relevant answer bubbles.
- **Styling**: `mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] bg-[#285A8E] hover:bg-[#1e4670] text-white text-xs font-semibold tracking-wide transition-all shadow-sm`
- **Action**: Direct client-side route navigation to `/waitlist` (or `/waitlist?role=help` / `/waitlist?role=lawyer`).

---

## 5. Conversational State Machine Specification

```
                  ┌────────────────────────────────────────┐
                  │              [Panel Closed]            │
                  └───────────────────┬────────────────────┘
                                      │ Click Trigger / Shortcut
                                      ▼
                  ┌────────────────────────────────────────┐
                  │            [Initial State]             │
                  │ - Pick Random Greeting (1 of 4)        │
                  │ - Render 5 Initial Question Bubbles    │
                  └───────────────────┬────────────────────┘
                                      │ User clicks question (ID: q)
                                      ▼
                  ┌────────────────────────────────────────┐
                  │           [Question Selected]          │
                  │ 1. Render User Message Bubble (q.text) │
                  │ 2. Wait 150ms transition               │
                  │ 3. Render Assistant Answer (q.answer)  │
                  │ 4. If q.hasCta -> Render Inline CTA    │
                  │ 5. Render 2-3 Follow-up Bubbles        │
                  │ 6. Render "← Back to questions" Button │
                  └───────┬────────────────────────┬───────┘
                          │                        │
        User clicks Follow-up (ID: f)     User clicks "← Back to questions"
                          │                        │
                          ▼                        ▼
                  ┌─────────────────┐      ┌─────────────────────────────┐
                  │ [Drill-down     │      │   [Return to Main Menu]     │
                  │  Answer & Next  │      │ - Render 5 Initial Questions│
                  │  Follow-ups]    │      │ - Preserve Chat History     │
                  └───────┬─────────┘      └─────────────────────────────┘
                          │ (loop or back)
```

### Initial Greeting Randomizer
On chat panel mount/open, one greeting is selected at random:
1. *"Hi there! Welcome to MyLaw. How can I help you explore our upcoming platform today?"*
2. *"Hello! I'm the MyLaw Assistant. Select any question below to learn more about what we're building."*
3. *"Welcome to MyLaw! Looking to discover legal help or join as a legal professional? Pick a topic below to get started."*
4. *"Hello! Curious about MyLaw? Choose a topic below to see how we're making legal help simpler and more accessible."*

---

## 6. Authoritative Knowledge Base Q&A Dataset (18 Items)

### Category 1: Core & Platform Overview
| ID | Question Text | Answer Content | Follow-up IDs | Has CTA | CTA Metadata |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `core-what-is-mylaw` | What is MyLaw? | **MyLaw** is a legal-tech platform designed to make it simpler and more transparent for people to discover and connect with qualified legal professionals. We're creating a clear, approachable starting point for finding legal help. | `core-how-it-works`, `why-mylaw-different`, `launch-timeline` | No | - |
| `core-how-it-works` | How does MyLaw work? | MyLaw works in three simple steps:<br>1. **Tell us what you need**: Select your legal category and issue details.<br>2. **Discover professionals**: View verified legal practitioners tailored to your needs.<br>3. **Connect with confidence**: Reach out directly without hidden friction. | `help-find-lawyer`, `core-what-is-mylaw`, `lawyer-how-to-join` | No | - |
| `core-is-it-legal-advice` | Can MyLaw give me legal advice? | *MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.* For specific legal concerns, our platform connects you with licensed, verified attorneys. | `help-find-lawyer`, `core-what-is-mylaw`, `launch-waitlist` | No | - |
| `core-who-created` | Who is building MyLaw? | MyLaw is built by a dedicated legal-technology team committed to bringing modern clarity, accessibility, and trust to the process of finding legal representation. | `why-trust`, `launch-timeline`, `core-what-is-mylaw` | No | - |

### Category 2: Why MyLaw (Values & Differentiation)
| ID | Question Text | Answer Content | Follow-up IDs | Has CTA | CTA Metadata |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `why-mylaw-different` | Why choose MyLaw over traditional directories? | Traditional directories are often cluttered, confusing, and filled with aggressive ads. MyLaw offers clean editorial clarity, verified credentials, guided matching, and a calm, transparent experience. | `why-trust`, `why-clarity`, `launch-waitlist` | Yes | Text: "Join the Waitlist →", Role: `help` |
| `why-trust` | How does MyLaw ensure trust and reliability? | We prioritize transparency: all featured lawyers undergo credential verification, professional background checks, and clear practice area categorization. Inquiries are kept completely confidential. | `help-confidentiality`, `why-mylaw-different`, `launch-waitlist` | No | - |
| `why-clarity` | What does "Legal Help, Simplified" mean? | It represents our promise to cut through legal jargon, eliminate scattered searches, and give individuals and businesses clear, structured pathways to appropriate legal assistance. | `core-how-it-works`, `help-what-issues`, `launch-timeline` | No | - |
| `why-accessibility` | Is MyLaw free for clients to search? | Yes! Searching for and discovering verified legal professionals on MyLaw will be completely free for individuals and businesses seeking legal assistance. | `help-cost`, `core-how-it-works`, `launch-waitlist` | Yes | Text: "Get Early Access →", Role: `help` |

### Category 3: For Seeking Help (Individuals & Businesses)
| ID | Question Text | Answer Content | Follow-up IDs | Has CTA | CTA Metadata |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `help-find-lawyer` | How do I find the right lawyer for my needs? | When MyLaw launches, you will simply select your legal matter (such as Property, Corporate, Family, or Civil Law). The platform will present curated, verified lawyers matched to your location and requirements. | `help-what-issues`, `help-confidentiality`, `launch-waitlist` | Yes | Text: "Join the Waitlist →", Role: `help` |
| `help-what-issues` | What legal areas will MyLaw cover? | MyLaw will cover major legal domains including Corporate & Business Law, Real Estate & Property, Family Law, Employment & Labor, Intellectual Property, Civil Litigation, and Estate Planning. | `help-find-lawyer`, `core-is-it-legal-advice`, `launch-waitlist` | No | - |
| `help-confidentiality` | Is my legal inquiry kept confidential? | Absolutely. Your privacy and discretion are foundational. Initial inquiry details are encrypted and shared only with the specific legal professionals you choose to contact. | `why-trust`, `help-cost`, `launch-waitlist` | No | - |
| `help-cost` | How are lawyer fees handled on MyLaw? | While searching and connecting through MyLaw is free for clients, legal service fees are determined directly and transparently by the individual legal practitioners. MyLaw promotes upfront pricing clarity. | `why-accessibility`, `help-find-lawyer`, `launch-waitlist` | No | - |

### Category 4: For Lawyers (Practitioners & Law Firms)
| ID | Question Text | Answer Content | Follow-up IDs | Has CTA | CTA Metadata |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lawyer-how-to-join` | How can lawyers join the platform? | Qualified advocates and law firms can apply for early onboarding today. Joining our practitioner waitlist secures priority profile verification and early access to client inquiries upon launch. | `lawyer-benefits`, `lawyer-verification`, `launch-waitlist-lawyer` | Yes | Text: "Join Lawyer Onboarding →", Role: `lawyer` |
| `lawyer-benefits` | What are the benefits for legal professionals? | MyLaw provides verified lawyers with a modern, high-trust digital presence, direct connections to clients actively seeking their specific expertise, and streamlined inquiry management. | `lawyer-how-to-join`, `lawyer-verification`, `launch-waitlist-lawyer` | Yes | Text: "Join as a Lawyer →", Role: `lawyer` |
| `lawyer-verification` | How does MyLaw verify lawyer credentials? | Our onboarding team verifies bar association registrations, active practice licenses, and good standing before granting verified badge status on MyLaw. | `lawyer-how-to-join`, `why-trust`, `launch-waitlist-lawyer` | No | - |

### Category 5: Launch & Early Access
| ID | Question Text | Answer Content | Follow-up IDs | Has CTA | CTA Metadata |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `launch-timeline` | When is MyLaw officially launching? | We are currently in active pre-launch preparation. Early access invitations will roll out in phases. Joining our waitlist ensures you receive first notification when we go live. | `launch-waitlist`, `launch-early-access`, `core-what-is-mylaw` | Yes | Text: "Join the Waitlist →", Role: `help` |
| `launch-early-access` | What do I receive by joining the waitlist? | Waitlist members receive priority platform access, direct launch updates, and early-bird benefits when booking or listing on MyLaw. | `launch-waitlist`, `launch-timeline`, `help-find-lawyer` | Yes | Text: "Claim Priority Access →", Role: `help` |
| `launch-waitlist` | How do I sign up for early access? | Signing up takes just 30 seconds! Head over to our waitlist page, enter your email address, and select whether you are seeking legal help or are a lawyer. | `launch-early-access`, `core-how-it-works`, `lawyer-how-to-join` | Yes | Text: "Join the Waitlist →", Role: `help` |

---

## 7. Initial 5 Top-Level Question Set
When the chat panel opens (or when the user clicks `"← Back to questions"`), the assistant displays these 5 primary questions:
1. `core-what-is-mylaw` — *"What is MyLaw?"*
2. `core-how-it-works` — *"How does MyLaw work?"*
3. `help-find-lawyer` — *"How do I find a lawyer for my needs?"*
4. `lawyer-how-to-join` — *"How can lawyers join the platform?"*
5. `launch-timeline` — *"When is MyLaw launching?"*

---

## 8. Guardrails & Compliance Matrix

| Area | Guardrail Rule | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Legal Advice** | Strictly NO legal advice or analysis | Disclaimers on all legal queries + permanent footer notice + explicit `core-is-it-legal-advice` handling. |
| **Input Method** | Strictly NO free-text input | Zero `<input>`, `<textarea>`, or contenteditable elements in the chat panel. |
| **Data Generation** | Strictly NO dynamic LLM / AI calls | 100% deterministic static dataset bundled locally; zero external API requests. |
| **Personal Data** | Strictly NO data collection inside chat | No email inputs in the chat panel; all conversion actions route cleanly to `/waitlist`. |
| **Layout Integrity**| Zero disruption to existing page layouts | Global fixed container mounted in root layout without touching `<main>` or existing sections. |

---

## 9. Accessibility, Responsiveness & Keyboard Navigation

### 9.1 Keyboard Interactions
- **`Tab` / `Shift+Tab`**: Natural logical focus progression through header close button -> conversation messages -> follow-up question buttons -> CTA links -> footer.
- **`Enter` / `Space`**: Triggers selected question button or CTA link.
- **`Escape` (ESC)**: Closes the chat panel immediately from anywhere within the component and restores focus to the floating trigger button.

### 9.2 ARIA Attributes & Semantics
- Floating trigger button: `aria-label="Open MyLaw Assistant"`, `aria-expanded={isOpen}`, `aria-haspopup="dialog"`.
- Chat panel container: `role="dialog"`, `aria-modal="false"`, `aria-label="MyLaw Assistant"`.
- Message feed container: `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`.
- Close button: `aria-label="Close MyLaw Assistant"`.

### 9.3 Responsive Viewport Rules
- **Desktop (`>= 640px`)**: Fixed width `380px`, height `520px`, bottom `24px`, right `24px`.
- **Mobile (`< 640px`)**: Responsive margin `bottom-20 left-4 right-4`, width auto (up to `380px`), max height `75vh`, preventing body scroll trapping and eliminating horizontal viewport overflow.

---

## 10. Specification Miner Features & Edge Cases Catalog

## Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Trigger UI | Floating Assistant Button | Bottom-right circular button with MyLaw blue styling and sparkle/chat icon | Click / Enter key | Toggles chat panel open/closed | None; always present on screen | ORIGINAL_REQUEST §R1 |
| 2 | Trigger UI | Hover Tooltip ("Ask MyLaw") | Tooltip showing "Ask MyLaw" on trigger hover or keyboard focus | Mouse hover / Focus | Renders floating tooltip pill | Graceful dismiss on mouse leave / blur | ORIGINAL_REQUEST §R1 |
| 3 | Panel UI | Header Bar ("MyLaw ● Assistant") | Header with title, active status indicator, and close button | Click close / ESC | Dismisses chat panel | None | ORIGINAL_REQUEST §R1 |
| 4 | Panel UI | Pre-launch Disclaimers & Footer | Permanent micro-disclaimer affirming informational purpose and no legal advice | None (static) | Renders footer text | None | ORIGINAL_REQUEST §R2 |
| 5 | Data Logic | Random Intro Message | Randomly selects 1 of 4 friendly intro greetings upon opening | Panel open trigger | Displays selected greeting bubble | Fallback to greeting #1 if index undefined | ORIGINAL_REQUEST §R2 |
| 6 | Data Logic | 5 Initial Top-Level Questions | Presents 5 top-level questions covering Core, Help, Lawyers, and Launch | Initial load / reset | Renders 5 clickable question pills | Fallback to full category list | ORIGINAL_REQUEST §R2 |
| 7 | Interaction | User Selection Bubble | Renders right-aligned user question bubble when a question pill is clicked | Pill click | Inserts user message bubble into feed | Ignore duplicate rapid clicks | ORIGINAL_REQUEST §R2 |
| 8 | Interaction | Predefined Assistant Answer | Renders left-aligned answer bubble with smooth 150-250ms transition | Question selection | Inserts assistant answer into feed | Render default error fallback if ID missing | ORIGINAL_REQUEST §R2 |
| 9 | Interaction | 2-3 Follow-Up Question Pills | Contextual follow-up suggestions rendered below the assistant answer | Active answer state | Renders 2-3 relevant follow-up pills | If no follow-ups defined, show main menu | ORIGINAL_REQUEST §R2 |
| 10 | Interaction | "← Back to Questions" Navigation | Reset action allowing user to return to the 5 initial top-level questions | Button click | Renders initial 5 questions in feed | Never enters unreachable dead-end | ORIGINAL_REQUEST §R2 |
| 11 | Compliance | Legal Advice Standard Disclaimer | Verbatim disclaimer rendered when legal advice topics are requested | Advice question trigger | Displays verbatim statutory disclaimer | Guaranteed deterministic response | ORIGINAL_REQUEST §R2 |
| 12 | Conversion | Inline Waitlist CTA Integration | Action button inside relevant answers routing directly to `/waitlist` | CTA button click | Next.js navigation to `/waitlist` | Standard fallback link if router fails | ORIGINAL_REQUEST §R3 |
| 13 | Conversion | Role-Aware Waitlist Routing | Passes `?role=help` or `?role=lawyer` in waitlist CTA links | Lawyer/Client topic CTA | Routes to `/waitlist?role=...` | Falls back to generic `/waitlist` | ORIGINAL_REQUEST §R3, PROJECT.md |
| 14 | Architecture | Global Non-Destructive Layout | Client component mounted in `layout.tsx` without modifying landing or waitlist pages | Route change / Mount | Persistent assistant across all pages | Zero visual regression on main content | ORIGINAL_REQUEST §R4 |
| 15 | Accessibility | Keyboard ESC Dismissal | Pressing ESC key closes chat panel and refocuses trigger button | `Escape` key event | Closes panel, triggers `triggerRef.focus()`| None | ORIGINAL_REQUEST §R4 |
| 16 | Accessibility | Full ARIA & Focus Trap Support | Complete `aria-expanded`, `aria-label`, and visible focus rings | Keyboard navigation | Accessible screen reader and focus outlines| None | ORIGINAL_REQUEST §R4 |
| 17 | Polish | Micro-Animations & Auto-Scroll | 150-250ms smooth CSS transitions and smooth auto-scroll to newest message | New message addition | Smooth scroll container to bottom | Graceful degrade if `scrollIntoView` fails | ORIGINAL_REQUEST §R4 |

## Edge Cases
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Chat Panel UI | Extremely small mobile viewport (e.g. 320px width) | Panel adjusts with `left-4 right-4 w-auto`, max-height `75vh`, preventing horizontal viewport overflow and scroll clipping. |
| 2 | Conversational Logic | Rapid double-clicking on a question pill | Single state update handled cleanly; duplicate user bubbles and duplicate answers are prevented. |
| 3 | Conversational Logic | Deep follow-up traversal (user clicks 5+ follow-ups consecutively) | Conversation history scrolls smoothly; each turn provides 2-3 follow-ups + "← Back to questions", ensuring zero dead-ends. |
| 4 | Conversational Logic | User navigates back to initial questions repeatedly | Cleanly appends the 5 initial options without corrupting previous history or breaking scroll anchor. |
| 5 | Waitlist Navigation | User clicks inline CTA while on `/waitlist` page | Router navigates or smoothly retains waitlist view without reloading or crashing. |
| 6 | Keyboard Accessibility | User presses `Escape` while focus is inside panel | Panel closes smoothly and focus returns to the floating trigger button. |
| 7 | Accessibility / ARIA | Screen reader reading dynamic message additions | `aria-live="polite"` announces newly rendered assistant answers without interrupting user actions. |
| 8 | Visual Theme Contrast | Assistant open on dark waitlist background vs white landing page | Floating button and panel use explicit opaque background colors (`#FFFFFF` panel, `#285A8E` trigger, `#172033` header) with clear borders, ensuring crisp visibility on both dark and light pages. |
| 9 | Page Scroll Lock | User scrolling conversation feed | Scroll events are contained within the message viewport (`overscroll-contain`) without unintentionally scrolling the background webpage. |

---

## 11. Verification & Test Plan

To verify full compliance with requirements:
1. **Static Analysis & Build Verification**:
   - Run `npm run build` to ensure zero TypeScript errors, zero lint warnings, and clean bundle generation.
2. **Visual & Design Token Verification**:
   - Confirm trigger button dimensions (48-56px), `#285A8E` background, hover tooltip "Ask MyLaw", and bottom-right anchor.
   - Confirm chat panel header "MyLaw ● Assistant", `#172033` header background, `#FFFFFF` panel body, `#F7F8FA` bubble background, and 12-16px border radius.
3. **Conversational Flow & Knowledge Base Verification**:
   - Verify random greeting on open.
   - Verify 5 initial top-level question pills.
   - Verify clicking any question renders user bubble followed by assistant answer.
   - Verify 2-3 follow-up bubbles and "← Back to questions" button.
   - Verify clicking "← Back to questions" presents the 5 initial questions.
   - Verify verbatim legal disclaimer on legal advice queries.
4. **Waitlist Integration Verification**:
   - Verify inline CTA buttons inside relevant answers navigate directly to `/waitlist` (and `/waitlist?role=lawyer` for lawyer queries).
   - Verify no duplicate email forms exist inside the chat panel.
5. **Accessibility Verification**:
   - Verify `Escape` key closes the panel and focuses the trigger.
   - Verify all buttons and links are reachable and operable via keyboard (`Tab`, `Enter`, `Space`).
   - Verify `aria-expanded`, `aria-label`, and `aria-live` attributes.
