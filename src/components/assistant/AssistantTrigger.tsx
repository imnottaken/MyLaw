"use client";

import React, { forwardRef } from "react";
import { MessageSquareDotIcon, CloseIcon } from "@/components/icons";

export interface AssistantTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * AssistantTrigger
 * Floating action button anchored in the bottom-right corner.
 * Features brand deep navy background (#172033), refined hover glow,
 * Lucide icon from shadcn ecosystem, active availability pulse indicator,
 * and hover tooltip ("Ask MyLaw").
 */
export const AssistantTrigger = forwardRef<HTMLButtonElement, AssistantTriggerProps>(
  ({ isOpen, onToggle, className = "" }, ref) => {
    return (
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center group">
        {/* Accessible Hover Tooltip */}
        {!isOpen && (
          <div
            role="tooltip"
            id="assistant-trigger-tooltip"
            className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 text-xs font-semibold text-white bg-[#0F172A] border border-white/15 rounded-[8px] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none select-none"
          >
            Ask MyLaw
            <span
              className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#0F172A]"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Trigger Button */}
        <button
          ref={ref}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls="mylaw-assistant-panel"
          aria-label={isOpen ? "Close MyLaw Assistant" : "Ask MyLaw Assistant"}
          aria-describedby={!isOpen ? "assistant-trigger-tooltip" : undefined}
          className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center text-white bg-[#172033] hover:bg-[#202D47] active:scale-95 transition-all duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.12)] hover:shadow-[0_10px_35px_rgba(40,90,142,0.4)] border border-white/15 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E] focus-visible:ring-offset-2 ${className}`}
        >
          {isOpen ? (
            <CloseIcon className="w-5 h-5 text-white transition-transform duration-200 rotate-0" />
          ) : (
            <MessageSquareDotIcon className="w-5 h-5 text-white transition-transform duration-200" />
          )}

          {/* Active Availability Pulse Dot */}
          {!isOpen && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F7C78] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2F7C78] ring-2 ring-[#172033]" />
            </span>
          )}
        </button>
      </div>
    );
  }
);

AssistantTrigger.displayName = "AssistantTrigger";
