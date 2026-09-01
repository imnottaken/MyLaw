/**
 * src/types/assistant.ts
 * Type definitions and contracts for the MyLaw Assistant Chatbot.
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
  readonly isAnimated?: boolean;
  readonly cta?: AssistantCTA;
  readonly followUpIds?: readonly string[];
}

export interface AssistantState {
  readonly isOpen: boolean;
  readonly activeQuestionId: string | null;
  readonly messages: readonly ChatMessage[];
  readonly currentFollowUpIds: readonly string[];
  readonly isTransitioning: boolean;
  readonly hasInitialized?: boolean;
}

export type AssistantAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT_QUESTION'; payload: { questionId: string } }
  | { type: 'RESET_TO_INITIAL' }
  | { type: 'CLEAR_HISTORY' };
