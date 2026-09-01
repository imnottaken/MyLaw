"use client";

import React from "react";
import { KnowledgeItem } from "@/types/assistant";
import { ChevronRightIcon } from "@/components/icons";

export interface QuestionPillProps {
  question: KnowledgeItem;
  onClick: (questionId: string) => void;
  disabled?: boolean;
}

/**
 * QuestionPill
 * Interactive pill button for choosing a predefined question topic.
 * Clean, subtle editorial design with hover contrast and chevron indicator.
 */
export function QuestionPill({ question, onClick, disabled = false }: QuestionPillProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(question.id)}
      aria-label={question.question}
      className="w-full text-left px-3.5 py-2.5 rounded-[10px] bg-[#1E293B]/80 hover:bg-[#283652] active:bg-[#334466] border border-white/10 hover:border-[#60A5FA]/40 text-xs sm:text-[13px] font-medium text-slate-200 hover:text-white flex items-center justify-between gap-2.5 transition-all duration-150 shadow-[0_2px_4px_rgba(0,0,0,0.2)] cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E]"
    >
      <span className="flex-1 text-left leading-snug">{question.question}</span>
      <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#60A5FA] group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}
