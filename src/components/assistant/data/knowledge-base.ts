/**
 * src/components/assistant/data/knowledge-base.ts
 * Authoritative Knowledge Base and Data Access Helpers for MyLaw Assistant Chatbot.
 */

import { AssistantCategoryMeta, KnowledgeItem } from '@/types/assistant';

export const CATEGORIES: readonly AssistantCategoryMeta[] = [
  {
    key: 'core',
    label: 'Core & Platform',
    description: 'Overview and core mechanics of MyLaw'
  },
  {
    key: 'why-mylaw',
    label: 'Why MyLaw',
    description: 'Platform values, differentiation, and trust'
  },
  {
    key: 'for-seeking-help',
    label: 'For Seeking Help',
    description: 'How individuals and businesses find legal help'
  },
  {
    key: 'for-lawyers',
    label: 'For Lawyers',
    description: 'Onboarding, verification, and professional benefits'
  },
  {
    key: 'launch',
    label: 'Launch & Early Access',
    description: 'Timeline, early-bird benefits, and waitlist registration'
  }
];

export const INITIAL_GREETINGS: readonly string[] = [
  "Hello! I'm the MyLaw Assistant. How can I help you discover the right legal support today?",
  "Welcome to MyLaw! Explore our predefined topics below to learn how we connect you with verified legal professionals.",
  "Hi there! I can help you understand how MyLaw simplifies finding and connecting with legal practitioners. What would you like to know?",
  "Greetings! Ask me about MyLaw's mission, how our platform works, or how to join our early access waitlist."
];

// Alias for convenience
export const GREETINGS = INITIAL_GREETINGS;

export const INITIAL_QUESTION_IDS: readonly string[] = [
  'core-what-is-mylaw',
  'help-legal-advice-disclaimer',
  'why-verification',
  'lawyer-joining',
  'launch-timeline'
];

export const STATUTORY_LEGAL_DISCLAIMER =
  "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.";

// Alias for convenience
export const LEGAL_DISCLAIMER_TEXT = STATUTORY_LEGAL_DISCLAIMER;

export const MICRO_DISCLAIMER_TEXT =
  "Informational assistant only. No legal advice provided.";

export const KNOWLEDGE_ITEMS: readonly KnowledgeItem[] = [
  // ── Category 1: Core Platform (4 items) ──
  {
    id: 'core-what-is-mylaw',
    category: 'core',
    question: 'What is MyLaw and how does it work?',
    answer:
      'MyLaw is a modern legal discovery platform that simplifies finding and connecting with the right verified legal professionals. We help individuals and businesses discover qualified lawyers tailored to their specific legal needs through structured guidance and transparent information.',
    followUpIds: ['why-verification', 'help-finding-lawyer', 'launch-timeline']
  },
  {
    id: 'core-is-it-free',
    category: 'core',
    question: 'Is MyLaw free to use for individuals?',
    answer:
      'Yes! Searching, discovering, and requesting initial connections with legal professionals on MyLaw is completely free for individuals and businesses seeking legal assistance.',
    followUpIds: ['core-what-is-mylaw', 'help-consultation', 'launch-early-access']
  },
  {
    id: 'core-how-different',
    category: 'core',
    question: 'How is MyLaw different from traditional directories?',
    answer:
      'Unlike traditional, cluttered directories with paid placement ads, MyLaw offers curated discovery based on verified domain expertise, clear practice area matching, transparent response expectations, and a privacy-first experience.',
    followUpIds: ['why-principles', 'why-verification', 'help-finding-lawyer']
  },
  {
    id: 'core-areas-covered',
    category: 'core',
    question: 'What practice areas does MyLaw cover?',
    answer:
      'MyLaw covers key legal domains including Family Law, Property & Real Estate, Corporate & Commercial, Employment, Intellectual Property, Immigration, and Dispute Resolution.',
    followUpIds: ['core-what-is-mylaw', 'help-finding-lawyer', 'lawyer-joining']
  },

  // ── Category 2: Why MyLaw & Principles (4 items) ──
  {
    id: 'why-principles',
    category: 'why-mylaw',
    question: 'What are MyLaw’s core guiding principles?',
    answer:
      'MyLaw is built on four core principles: Clarity (transparent insights without confusing jargon), Choice (discovering verified practitioners suited to your matter), Trust (privacy-first, confidential inquiries), and Accessibility (removing friction from the first step).',
    followUpIds: ['why-verification', 'why-privacy', 'core-what-is-mylaw']
  },
  {
    id: 'why-verification',
    category: 'why-mylaw',
    question: 'How do you verify lawyers on the platform?',
    answer:
      'Every legal professional on MyLaw undergoes thorough credential verification, active bar/regulatory standing checks, and practice area validation before appearing in our discovery network.',
    followUpIds: ['why-principles', 'lawyer-requirements', 'help-finding-lawyer']
  },
  {
    id: 'why-privacy',
    category: 'why-mylaw',
    question: 'How does MyLaw protect client confidentiality and data?',
    answer:
      'Privacy is foundational to MyLaw. Your inquiries are strictly confidential, protected with modern encryption, and never shared with third parties or sold to advertisers.',
    followUpIds: ['why-principles', 'help-consultation', 'core-is-it-free']
  },
  {
    id: 'why-ratings-trust',
    category: 'why-mylaw',
    question: 'Are ratings or reviews published on lawyer profiles?',
    answer:
      'We focus on objective verification, professional credentials, domain specialism, and confirmed response standards rather than gamified or unverified public rating systems.',
    followUpIds: ['why-verification', 'core-how-different', 'help-finding-lawyer']
  },

  // ── Category 3: For Seeking Help & Legal Disclaimer (4 items) ──
  {
    id: 'help-legal-advice-disclaimer',
    category: 'for-seeking-help',
    question: 'Can MyLaw give me legal advice for my case?',
    answer:
      "MyLaw is designed to help people discover and connect with legal professionals. The MyLaw Assistant doesn't provide legal advice.",
    isDisclaimer: true,
    cta: {
      label: 'Join the Waitlist →',
      href: '/waitlist'
    },
    followUpIds: ['help-finding-lawyer', 'help-consultation', 'core-what-is-mylaw']
  },
  {
    id: 'help-finding-lawyer',
    category: 'for-seeking-help',
    question: 'How do I find the right lawyer for my specific situation?',
    answer:
      'You can describe your legal topic or practice area, and MyLaw matches you with verified specialists who have demonstrated experience in your specific legal domain and jurisdiction.',
    followUpIds: ['help-legal-advice-disclaimer', 'why-verification', 'help-consultation']
  },
  {
    id: 'help-consultation',
    category: 'for-seeking-help',
    question: 'What happens when I request to connect with a lawyer?',
    answer:
      'When you submit a connection inquiry, the selected legal professional receives your confidential summary and typically responds within clear service standards to arrange an initial consultation.',
    followUpIds: ['why-privacy', 'help-response-times', 'help-legal-advice-disclaimer']
  },
  {
    id: 'help-response-times',
    category: 'for-seeking-help',
    question: 'How quickly do legal professionals respond on MyLaw?',
    answer:
      'Verified practitioners on MyLaw adhere to our prompt response commitment, with most initial inquiries addressed within 2 to 24 business hours.',
    followUpIds: ['help-consultation', 'why-verification', 'launch-timeline']
  },

  // ── Category 4: For Lawyers (3 items) ──
  {
    id: 'lawyer-joining',
    category: 'for-lawyers',
    question: 'How can I join MyLaw as a practicing lawyer?',
    answer:
      'Practicing lawyers and chambers can apply for our early access cohort. We are onboarding founding legal partners across key practice areas ahead of our public launch.',
    cta: {
      label: 'Join Lawyer Waitlist →',
      href: '/waitlist?role=lawyer',
      role: 'lawyer'
    },
    followUpIds: ['lawyer-benefits', 'lawyer-requirements', 'launch-early-access']
  },
  {
    id: 'lawyer-benefits',
    category: 'for-lawyers',
    question: 'What are the benefits for legal professionals on MyLaw?',
    answer:
      'MyLaw gives practitioners a curated, professional digital presence, connects you directly with qualified clients seeking your specific domain expertise, and streamlines initial intake communication.',
    cta: {
      label: 'Join Lawyer Waitlist →',
      href: '/waitlist?role=lawyer',
      role: 'lawyer'
    },
    followUpIds: ['lawyer-joining', 'lawyer-requirements', 'why-verification']
  },
  {
    id: 'lawyer-requirements',
    category: 'for-lawyers',
    question: 'What are the requirements for lawyers to join MyLaw?',
    answer:
      'Applicants must hold a valid, unrestricted practicing certificate in their jurisdiction, possess professional indemnity coverage, and have demonstrated expertise in their declared practice areas.',
    cta: {
      label: 'Join Lawyer Waitlist →',
      href: '/waitlist?role=lawyer',
      role: 'lawyer'
    },
    followUpIds: ['lawyer-joining', 'lawyer-benefits', 'why-verification']
  },

  // ── Category 5: Launch & Early Access (3 items) ──
  {
    id: 'launch-timeline',
    category: 'launch',
    question: 'When will MyLaw be available and how do I join early?',
    answer:
      'MyLaw is currently in pre-launch. We are rolling out private beta access in phased cohorts. You can join the early access waitlist to secure priority access when your practice area opens.',
    cta: {
      label: 'Join the Waitlist →',
      href: '/waitlist'
    },
    followUpIds: ['launch-early-access', 'core-what-is-mylaw', 'lawyer-joining']
  },
  {
    id: 'launch-early-access',
    category: 'launch',
    question: 'What do waitlist members receive during pre-launch?',
    answer:
      'Waitlist members receive priority invitations to our early access release, product updates, and founding member benefits for both individuals and legal practitioners.',
    cta: {
      label: 'Join the Waitlist →',
      href: '/waitlist'
    },
    followUpIds: ['launch-timeline', 'core-is-it-free', 'help-finding-lawyer']
  },
  {
    id: 'launch-cities-regions',
    category: 'launch',
    question: 'Which cities and jurisdictions will be supported at launch?',
    answer:
      'We are launching initially across major metropolitan commercial and regional legal centers, with progressive nationwide expansion following our beta release.',
    cta: {
      label: 'Join the Waitlist →',
      href: '/waitlist'
    },
    followUpIds: ['launch-timeline', 'core-what-is-mylaw', 'lawyer-joining']
  }
];

// Alias for convenience
export const KNOWLEDGE_BASE = KNOWLEDGE_ITEMS;

const KNOWLEDGE_MAP = new Map<string, KnowledgeItem>(
  KNOWLEDGE_ITEMS.map((item) => [item.id, item])
);

// Compatibility alias map for alternative IDs
const ALIAS_MAP = new Map<string, string>([
  ['core-how-it-works', 'core-what-is-mylaw'],
  ['core-is-it-legal-advice', 'help-legal-advice-disclaimer'],
  ['core-who-created', 'why-principles'],
  ['why-mylaw-different', 'core-how-different'],
  ['why-trust', 'why-verification'],
  ['why-clarity', 'why-principles'],
  ['why-accessibility', 'core-is-it-free'],
  ['help-find-lawyer', 'help-finding-lawyer'],
  ['help-what-issues', 'core-areas-covered'],
  ['help-confidentiality', 'why-privacy'],
  ['help-cost', 'core-is-it-free'],
  ['lawyer-how-to-join', 'lawyer-joining'],
  ['lawyer-verification', 'lawyer-requirements'],
  ['launch-waitlist', 'launch-timeline']
]);

/**
 * Retrieve a specific knowledge item by its unique ID (or alias).
 */
export function getKnowledgeItemById(id: string): KnowledgeItem | undefined {
  const direct = KNOWLEDGE_MAP.get(id);
  if (direct) return direct;
  const aliasTarget = ALIAS_MAP.get(id);
  if (aliasTarget) return KNOWLEDGE_MAP.get(aliasTarget);
  return undefined;
}

/**
 * Retrieve the 5 initial top-level questions shown when the assistant opens.
 */
export function getInitialQuestions(): KnowledgeItem[] {
  return INITIAL_QUESTION_IDS
    .map((id) => getKnowledgeItemById(id))
    .filter((item): item is KnowledgeItem => Boolean(item));
}

/**
 * Retrieve the contextual follow-up questions for a given item ID.
 * If the item or follow-ups cannot be resolved, falls back to initial questions.
 */
export function getFollowUpQuestions(currentId: string): KnowledgeItem[] {
  const current = getKnowledgeItemById(currentId);
  if (!current || !current.followUpIds || current.followUpIds.length === 0) {
    return getInitialQuestions();
  }
  const items = current.followUpIds
    .map((id) => getKnowledgeItemById(id))
    .filter((item): item is KnowledgeItem => Boolean(item));

  return items.length > 0 ? items : getInitialQuestions();
}

/**
 * Retrieve follow-up items directly from a KnowledgeItem record.
 */
export function getFollowUpItems(item: KnowledgeItem): readonly KnowledgeItem[] {
  if (!item.followUpIds || item.followUpIds.length === 0) {
    return getInitialQuestions();
  }
  const items = item.followUpIds
    .map((id) => getKnowledgeItemById(id))
    .filter((it): it is KnowledgeItem => Boolean(it));

  return items.length > 0 ? items : getInitialQuestions();
}

/**
 * Pick a random intro greeting from the curated greetings pool.
 */
export function getRandomGreeting(): string {
  const index = Math.floor(Math.random() * INITIAL_GREETINGS.length);
  return INITIAL_GREETINGS[index] ?? INITIAL_GREETINGS[0];
}

/**
 * Get all category definitions with metadata.
 */
export function getAllCategories(): readonly AssistantCategoryMeta[] {
  return CATEGORIES;
}
