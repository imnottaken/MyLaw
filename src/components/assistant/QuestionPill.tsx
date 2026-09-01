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
      className="w-full text-left px-3.5 py-2.5 rounded-[10px] bg-white hover:bg-[#EAF2F8] active:bg-[#DFEAF4] border border-[#D2DFEB] hover:border-[#285A8E]/50 text-xs sm:text-[13px] font-medium text-[#172033] flex items-center justify-between gap-2.5 transition-all duration-150 shadow-[0_1px_2px_rgba(16,24,40,0.04)] cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E]"
    >
      <span className="flex-1 text-left leading-snug">{question.question}</span>
      <ChevronRightIcon className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#285A8E] group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}
