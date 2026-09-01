"use client";

import React, { useEffect, useRef } from "react";
import { CloseIcon, BotIcon } from "@/components/icons";
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
  onMessageAnimated?: (id: string) => void;
  onCtaClick?: (cta: AssistantCTA) => void;
}

/**
 * AssistantPanel
 * Floating responsive chat dialogue card styled with MyLaw deep navy luxury theme.
 * - Header: "MyLaw ● Assistant" + active status indicator + close button
 * - Scrollable Feed: Auto-scrolls smartly to ensure the latest answer is in full view
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
  onMessageAnimated,
  onCtaClick
}: AssistantPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const lastAsstMsgRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);

  // Smart auto-scroll: ensures the reader sees the question and answer without skipping past it
  useEffect(() => {
    if (!isOpen) return;

    if (isTransitioning && typingRef.current) {
      // Scroll to typing indicator when user asks a question
      typingRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (!isTransitioning && messages.length > 0) {
      // When assistant message arrives, smoothly bring the assistant answer into view
      if (lastAsstMsgRef.current) {
        lastAsstMsgRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [messages, isTransitioning, isOpen]);

  if (!isOpen) return null;

  const lastUserIndex = messages.map(m => m.sender).lastIndexOf("user");
  const lastAsstIndex = messages.map(m => m.sender).lastIndexOf("assistant");

  return (
    <section
      id="mylaw-assistant-panel"
      role="dialog"
      aria-labelledby="assistant-panel-title"
      aria-modal="false"
      className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] max-h-[580px] flex flex-col bg-[#F3F7FA] border border-[#D2DFEB] rounded-[16px] shadow-[0_16px_48px_rgba(23,32,51,0.16),0_2px_8px_rgba(23,32,51,0.06)] overflow-hidden transition-all duration-200 ease-out"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3.5 bg-[#E6EFF6] border-b border-[#D0DDE8] select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#285A8E] text-white flex items-center justify-center shadow-sm">
            <BotIcon className="w-4 h-4" />
          </div>
          <h2 id="assistant-panel-title" className="text-sm font-semibold text-[#172033] flex items-center gap-2">
            <span>MyLaw</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2F7C78]" aria-hidden="true" />
            <span className="text-[#5A6E85] font-normal">Assistant</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="p-1.5 rounded-[6px] text-[#667085] hover:text-[#172033] hover:bg-[#D5E2EC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E]"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </header>

      {/* Scrollable Message Feed */}
      <div
        ref={scrollContainerRef}
        role="log"
        aria-live="polite"
        aria-label="Assistant conversation"
        className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 max-h-[400px] overscroll-contain bg-transparent scroll-smooth"
      >
        {messages.map((msg, idx) => {
          const isLastUser = idx === lastUserIndex;
          const isLastAsst = idx === lastAsstIndex;

          return (
            <div
              key={msg.id}
              ref={isLastUser ? lastUserMsgRef : isLastAsst ? lastAsstMsgRef : undefined}
            >
              <MessageBubble
                message={msg}
                onAnimated={onMessageAnimated}
                onCtaClick={onCtaClick}
              />
            </div>
          );
        })}

        {/* Transition indicator (3 jumping dots simulating typing) */}
        {isTransitioning && (
          <div
            ref={typingRef}
            className="flex items-center gap-1.5 py-3 px-4 rounded-[14px] rounded-tl-[4px] bg-white border border-[#D5E1EC] w-fit shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
            aria-label="Assistant is typing"
          >
            <span className="w-2 h-2 rounded-full bg-[#285A8E] animate-bounce [animation-duration:0.8s] [animation-delay:-0.32s]" />
            <span className="w-2 h-2 rounded-full bg-[#285A8E] animate-bounce [animation-duration:0.8s] [animation-delay:-0.16s]" />
            <span className="w-2 h-2 rounded-full bg-[#285A8E] animate-bounce [animation-duration:0.8s]" />
          </div>
        )}

        {/* Question Selector Area */}
        {!isTransitioning && (
          <div className="pt-2 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#526B84]">
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
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#285A8E] hover:text-[#1E4670] px-2.5 py-1 rounded-[6px] bg-[#E3EDF5] hover:bg-[#D5E3EE] border border-[#CBDCE9] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E]"
                >
                  <span>←</span>
                  <span>Back to questions</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Micro-Disclaimer Footer */}
      <footer className="px-3.5 py-2 bg-[#E6EFF6] border-t border-[#D0DDE8] text-center select-none">
        <p className="text-[11px] text-[#5A6E85] font-normal leading-tight">
          {MICRO_DISCLAIMER_TEXT}
        </p>
      </footer>
    </section>
  );
}
