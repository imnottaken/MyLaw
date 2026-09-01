"use client";

import React from "react";
import Link from "next/link";
import { ChatMessage, AssistantCTA } from "@/types/assistant";
import { ArrowRightIcon, ShieldIcon } from "@/components/icons";

export interface MessageBubbleProps {
  message: ChatMessage;
  onCtaClick?: (cta: AssistantCTA) => void;
}

/**
 * MessageBubble
 * Renders individual chat message entries.
 * - User selection bubbles: Right-aligned (#285A8E, #FFFFFF)
 * - Assistant answer bubbles: Left-aligned (#F7F8FA, #172033, border #E6E8EC)
 * - Legal disclaimer callout with statutory compliance
 * - Inline waitlist CTA button routing to /waitlist or /waitlist?role=lawyer
 */
export function MessageBubble({ message, onCtaClick }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end w-full">
        <div className="max-w-[85%] bg-[#285A8E] text-white px-3.5 py-2.5 rounded-[14px] rounded-br-[4px] shadow-sm border border-white/10">
          <p className="text-[13px] leading-relaxed font-normal select-text">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start w-full">
      <div
        className={`max-w-[88%] bg-[#1E293B]/95 border border-white/10 text-slate-100 px-3.5 py-2.5 rounded-[14px] rounded-tl-[4px] shadow-sm space-y-2.5 ${
          message.isDisclaimer ? "border-l-2 border-l-[#2F7C78] bg-[#1a2638]" : ""
        }`}
      >
        {message.isDisclaimer && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2DD4BF] uppercase tracking-wider">
            <ShieldIcon className="w-3 h-3" />
            <span>Notice</span>
          </div>
        )}

        <div className="text-[13px] leading-relaxed text-slate-200 whitespace-pre-line select-text">
          {message.text}
        </div>

        {/* Inline Waitlist CTA Button */}
        {message.cta && (
          <div className="pt-1">
            <Link
              href={message.cta.href}
              onClick={() => onCtaClick?.(message.cta!)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[6px] text-white bg-[#285A8E] hover:bg-[#1e4670] active:scale-95 transition-all duration-150 shadow-md border border-white/15 cursor-pointer group"
            >
              <span>{message.cta.label}</span>
              <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
