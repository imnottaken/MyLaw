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
  onCtaClick
}: AssistantPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const lastAsstMsgRef = useRef<HTMLDivElement>(null);

  // Smart auto-scroll: ensures the reader sees the question and answer without skipping past it
  useEffect(() => {
    if (!isOpen) return;

    if (isTransitioning && lastUserMsgRef.current) {
      // Scroll to user message when submitted
      lastUserMsgRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
      className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] max-h-[580px] flex flex-col bg-[#131B2E]/95 backdrop-blur-xl border border-white/15 rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden transition-all duration-200 ease-out"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3.5 bg-[#172033]/90 border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#285A8E]/30 border border-[#285A8E]/40 text-[#60A5FA] flex items-center justify-center shadow-inner">
            <BotIcon className="w-4 h-4" />
          </div>
          <h2 id="assistant-panel-title" className="text-sm font-semibold text-white flex items-center gap-2">
            <span>MyLaw</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2F7C78] shadow-[0_0_6px_#2F7C78]" aria-hidden="true" />
            <span className="text-slate-300 font-normal">Assistant</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="p-1.5 rounded-[6px] text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E]"
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
              <MessageBubble message={msg} onCtaClick={onCtaClick} />
            </div>
          );
        })}

        {/* Transition indicator */}
        {isTransitioning && (
          <div className="flex justify-start items-center gap-1.5 py-2 px-3.5 rounded-[12px] bg-[#1E293B] border border-white/10 w-fit shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-bounce" />
          </div>
        )}

        {/* Question Selector Area */}
        {!isTransitioning && (
          <div className="pt-2 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
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
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#60A5FA] hover:text-white px-2.5 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E]"
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
      <footer className="px-3.5 py-2 bg-[#0D1322] border-t border-white/10 text-center select-none">
        <p className="text-[11px] text-slate-400 font-normal leading-tight">
          {MICRO_DISCLAIMER_TEXT}
        </p>
      </footer>
    </section>
  );
}
