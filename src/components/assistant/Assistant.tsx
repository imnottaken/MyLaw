"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage, KnowledgeItem, AssistantCTA } from "@/types/assistant";
import {
  getRandomGreeting,
  getInitialQuestions,
  getFollowUpQuestions,
  getKnowledgeItemById
} from "./data/knowledge-base";
import { AssistantTrigger } from "./AssistantTrigger";
import { AssistantPanel } from "./AssistantPanel";

export interface AssistantProps {
  className?: string;
  onCtaClick?: (cta: AssistantCTA) => void;
}

/**
 * Assistant
 * Root client-side container managing conversational state machine,
 * open/close transitions, focus management, ESC key dismissals,
 * and deterministic knowledge base traversal.
 */
export default function Assistant({ className = "", onCtaClick }: AssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session greeting when opened
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      const greeting = getRandomGreeting();
      setMessages([
        {
          id: `greeting-${Date.now()}`,
          sender: "assistant",
          text: greeting,
          timestamp: Date.now()
        }
      ]);
    }
  }, [messages.length]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Restore focus to trigger button
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  }, []);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleClose, handleOpen]);

  // Handle ESC key listener globally when panel is open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, [isOpen, handleClose]);

  // Handle Question Selection
  const handleSelectQuestion = useCallback((questionId: string) => {
    const item = getKnowledgeItemById(questionId);
    if (!item) return;

    // 1. Render User Message Bubble immediately
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: item.question,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTransitioning(true);

    // 2. Smooth Transition (180ms delay)
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    transitionTimerRef.current = setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        text: item.answer,
        isDisclaimer: Boolean(item.isDisclaimer),
        cta: item.cta,
        followUpIds: item.followUpIds,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveQuestionId(item.id);
      setIsTransitioning(false);
    }, 180);
  }, []);

  // Handle "← Back to questions"
  const handleResetToInitial = useCallback(() => {
    setActiveQuestionId(null);
  }, []);

  // Derive available questions based on state
  const currentQuestions: KnowledgeItem[] = activeQuestionId
    ? getFollowUpQuestions(activeQuestionId)
    : getInitialQuestions();

  return (
    <div className={`mylaw-assistant-root ${className}`}>
      <AssistantTrigger
        ref={triggerRef}
        isOpen={isOpen}
        onToggle={handleToggle}
      />
      <AssistantPanel
        isOpen={isOpen}
        messages={messages}
        currentQuestions={currentQuestions}
        activeQuestionId={activeQuestionId}
        isTransitioning={isTransitioning}
        onClose={handleClose}
        onSelectQuestion={handleSelectQuestion}
        onResetToInitial={handleResetToInitial}
        onCtaClick={onCtaClick}
      />
    </div>
  );
}
