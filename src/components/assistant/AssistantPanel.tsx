"use client";

import React, { useEffect, useRef } from "react";
import { CloseIcon, SparklesIcon } from "@/components/icons";
import { ChatMessage, KnowledgeItem, AssistantCTA } from "@/types/assistant";
import { MessageBubble } from "./MessageBubble";
import { QuestionPill } from "./QuestionPill";
import { MICRO_DISCLAIMER_TEXT } from "./data/knowledge-base";

export interface AssistantPanelProps {
  isOpen: boolean;
  messages: readonly ChatMessage[];
  currentQuestions: readonly KnowledgeItem[];
  activeQuestionId: string | null;
  isTransitioning: boolean;
  onClose: () => void;
  onSelectQuestion: (questionId: string) => void;
  onResetToInitial: () => void;
  onCtaClick?: (cta: AssistantCTA) => void;
}

/**
 * AssistantPanel
 * Floating responsive chat dialogue card.
 * - Header: "MyLaw ● Assistant" + active status indicator + close button
 * - Scrollable Feed: aria-live="polite", auto-scroll on new content
 * - Question Options Area: top 5 initial questions OR follow-up options + "← Back to questions"
 * - Micro-disclaimer Footer: "Informational assistant only. No legal advice provided."
 */
export function AssistantPanel({
  isOpen,
  messages,
  currentQuestions,
  activeQuestionId,
  isTransitioning,
  onClose,
  onSelectQuestion,
  onResetToInitial,
  onCtaClick
}: AssistantPanelProps) {
  const feedEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages or state changes
  useEffect(() => {
    if (isOpen) {
      feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTransitioning, currentQuestions, isOpen]);

  if (!isOpen) return null;

  return (
    <section
      ref={panelRef}
      id="mylaw-assistant-panel"
      role="dialog"
      aria-labelledby="assistant-panel-title"
      aria-modal="false"
      className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] max-h-[580px] flex flex-col bg-white border border-[#E6E8EC] rounded-[14px] shadow-[0_12px_40px_rgba(23,32,51,0.14),0_2px_8px_rgba(23,32,51,0.04)] overflow-hidden transition-all duration-200 ease-out"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E6E8EC] select-none">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#285A8E]/10 text-[#285A8E] flex items-center justify-center">
            <SparklesIcon className="w-3.5 h-3.5" />
          </div>
          <h2 id="assistant-panel-title" className="text-sm font-semibold text-[#172033] flex items-center gap-1.5">
            <span>MyLaw</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2F7C78]" aria-hidden="true" />
            <span>Assistant</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="p-1.5 rounded-[6px] text-[#667085] hover:text-[#172033] hover:bg-[#F7F8FA] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E]"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </header>

      {/* Scrollable Message Feed */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Assistant conversation"
        className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 max-h-[400px] overscroll-contain bg-white"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onCtaClick={onCtaClick} />
        ))}

        {/* Transition indicator */}
        {isTransitioning && (
          <div className="flex justify-start items-center gap-1.5 py-2 px-3.5 rounded-[12px] bg-[#F7F8FA] border border-[#E6E8EC] w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#285A8E] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#285A8E] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#285A8E] animate-bounce" />
          </div>
        )}

        {/* Question Selector Area */}
        {!isTransitioning && (
          <div className="pt-2 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
              {activeQuestionId ? "Suggested Next Questions" : "Choose a topic"}
            </div>
            <div className="space-y-1.5">
              {currentQuestions.map((q) => (
                <QuestionPill
                  key={q.id}
                  question={q}
                  onClick={onSelectQuestion}
                  disabled={isTransitioning}
                />
              ))}
            </div>

            {/* "← Back to questions" Action */}
            {activeQuestionId && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onResetToInitial}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#285A8E] hover:text-[#1e4670] hover:underline px-2.5 py-1 rounded-[6px] bg-[#F7F8FA] hover:bg-[#E6E8EC]/70 border border-[#E6E8EC] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E]"
                >
                  <span>←</span>
                  <span>Back to questions</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div ref={feedEndRef} />
      </div>

      {/* Micro-Disclaimer Footer */}
      <footer className="px-3.5 py-2 bg-[#F7F8FA] border-t border-[#E6E8EC] text-center select-none">
        <p className="text-[11px] text-[#667085] font-medium leading-tight">
          {MICRO_DISCLAIMER_TEXT}
        </p>
      </footer>
    </section>
  );
}
