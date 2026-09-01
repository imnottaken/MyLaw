"use client";

import React, { forwardRef } from "react";
import { SparklesIcon, CloseIcon } from "@/components/icons";

export interface AssistantTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * AssistantTrigger
 * Floating action button anchored in the bottom-right corner.
 * Features brand navy background (#172033), hover state (#1e4670),
 * sparkle/close icon crossfade, active availability pulse indicator,
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
            className="hidden sm:block absolute right-full mr-3 px-2.5 py-1 text-xs font-semibold text-white bg-[#172033] border border-white/10 rounded-[6px] shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none select-none"
          >
            Ask MyLaw
            <span
              className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#172033]"
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
          className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center text-white bg-[#172033] hover:bg-[#1e4670] active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(23,32,51,0.22)] hover:shadow-[0_6px_24px_rgba(23,32,51,0.32)] border border-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E] focus-visible:ring-offset-2 ${className}`}
        >
          {isOpen ? (
            <CloseIcon className="w-5 h-5 text-white transition-transform duration-200 rotate-0" />
          ) : (
            <SparklesIcon className="w-5 h-5 text-white transition-transform duration-200" />
          )}

          {/* Active Availability Pulse Dot */}
          {!isOpen && (
            <span className="absolute top-0.5 right-0.5 flex h-3 w-3" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F7C78] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2F7C78] ring-2 ring-white" />
            </span>
          )}
        </button>
      </div>
    );
  }
);

AssistantTrigger.displayName = "AssistantTrigger";
