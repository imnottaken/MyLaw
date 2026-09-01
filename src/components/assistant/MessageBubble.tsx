"use client";

import React, { useState, useEffect } from "react";
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
 * - Assistant answer bubbles: Left-aligned with animated typewriter effect
 * - Legal disclaimer callout with statutory compliance
 * - Inline waitlist CTA button routing to /waitlist or /waitlist?role=lawyer
 */
export function MessageBubble({ message, onCtaClick }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const [displayedText, setDisplayedText] = useState(() => (isUser ? message.text : ""));
  const [isTypingComplete, setIsTypingComplete] = useState(() => isUser);

  useEffect(() => {
    if (isUser) return;

    // Fast, natural AI typewriter effect (~14ms per char)
    let currentIndex = 0;
    const fullText = message.text;
    const typingInterval = 14;

    const timer = setInterval(() => {
      currentIndex += 1;
      setDisplayedText(fullText.slice(0, currentIndex));

      if (currentIndex >= fullText.length) {
        clearInterval(timer);
        setIsTypingComplete(true);
      }
    }, typingInterval);

    return () => clearInterval(timer);
  }, [message.text, isUser]);

  if (isUser) {
    return (
      <div className="flex justify-end w-full animate-in fade-in slide-in-from-bottom-2 duration-150">
        <div className="max-w-[85%] bg-[#285A8E] text-white px-3.5 py-2.5 rounded-[14px] rounded-br-[4px] shadow-sm">
          <p className="text-[13px] leading-relaxed font-normal select-text">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start w-full animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div
        className={`max-w-[88%] bg-white border border-[#D5E1EC] text-[#172033] px-3.5 py-2.5 rounded-[14px] rounded-tl-[4px] shadow-[0_1px_3px_rgba(16,24,40,0.04)] space-y-2.5 ${
          message.isDisclaimer ? "border-l-2 border-l-[#2F7C78] bg-[#F2F8F8]" : ""
        }`}
      >
        {message.isDisclaimer && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2F7C78] uppercase tracking-wider">
            <ShieldIcon className="w-3 h-3" />
            <span>Notice</span>
          </div>
        )}

        <div className="text-[13px] leading-relaxed text-[#172033] whitespace-pre-line select-text">
          <span>{displayedText}</span>
          {!isTypingComplete && (
            <span
              className="inline-block w-1.5 h-3.5 bg-[#285A8E] ml-0.5 rounded-sm animate-pulse align-middle"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Inline Waitlist CTA Button (fades in once typing completes) */}
        {message.cta && isTypingComplete && (
          <div className="pt-1 animate-in fade-in duration-200">
            <Link
              href={message.cta.href}
              onClick={() => onCtaClick?.(message.cta!)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[6px] text-white bg-[#285A8E] hover:bg-[#1E4670] active:scale-95 transition-all duration-150 shadow-sm cursor-pointer group"
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
