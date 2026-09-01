"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, ArrowRightIcon } from "@/components/icons";

type RoleOption = "help" | "lawyer" | null;

function parseRoleParam(roleParam: string | null): RoleOption {
  if (!roleParam) return null;
  const normalized = roleParam.toLowerCase().trim();
  if (normalized === "lawyer" || normalized === "attorney" || normalized === "professional") {
    return "lawyer";
  }
  if (
    normalized === "help" ||
    normalized === "individual" ||
    normalized === "client" ||
    normalized === "seeker"
  ) {
    return "help";
  }
  return null;
}

function WaitlistFormContent() {
  const searchParams = useSearchParams();
  const initialRole = parseRoleParam(searchParams.get("role"));

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleOption>(initialRole);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeState, setFadeState] = useState<"visible" | "fading-out" | "fading-in">("visible");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedEmail = email.trim();
    if (!sanitizedEmail) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setFadeState("fading-out");
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFadeState("fading-in");
        setTimeout(() => {
          setFadeState("visible");
        }, 50);
      }, 150);
    }, 200);
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`text-center py-4 transition-all duration-200 ease-in-out ${
          fadeState === "fading-in" ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="mx-auto w-10 h-10 rounded-full bg-[#2F7C78]/10 text-[#2F7C78] flex items-center justify-center mb-3">
          <CheckCircleIcon className="w-5 h-5 text-[#2F7C78]" strokeWidth={2.2} />
        </div>
        <h3 className="text-lg font-semibold text-[#172033] tracking-tight mb-1">
          You&apos;re on the list.
        </h3>
        <p className="text-sm text-[#667085] leading-relaxed mb-4">
          Thanks for joining MyLaw. We&apos;ll let you know when we&apos;re ready.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[#285A8E] hover:text-[#1e4670] hover:underline transition-colors duration-150"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`w-full transition-opacity duration-200 ease-in-out ${
        fadeState === "fading-out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        {/* Role Selector */}
        <div className="space-y-2">
          <span className="block text-[11px] font-medium text-[#667085] uppercase tracking-wider">I am a:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole(role === "help" ? null : "help")}
              className={`relative flex items-center justify-center h-[42px] rounded-[8px] border text-[13px] font-medium cursor-pointer transition-all duration-150 select-none ${
                role === "help"
                  ? "border-[#285A8E] bg-[#285A8E]/[0.06] text-[#285A8E] font-semibold ring-1 ring-[#285A8E]/20"
                  : "border-[#E6E8EC] bg-white text-[#172033] hover:bg-[#F7F8FA] hover:border-[#285A8E]/30"
              }`}
            >
              {role === "help" && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#285A8E] flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2.5 5.5L4 7L7.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
              <span>Looking for legal help</span>
            </button>

            <button
              type="button"
              onClick={() => setRole(role === "lawyer" ? null : "lawyer")}
              className={`relative flex items-center justify-center h-[42px] rounded-[8px] border text-[13px] font-medium cursor-pointer transition-all duration-150 select-none ${
                role === "lawyer"
                  ? "border-[#285A8E] bg-[#285A8E]/[0.06] text-[#285A8E] font-semibold ring-1 ring-[#285A8E]/20"
                  : "border-[#E6E8EC] bg-white text-[#172033] hover:bg-[#F7F8FA] hover:border-[#285A8E]/30"
              }`}
            >
              {role === "lawyer" && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#285A8E] flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2.5 5.5L4 7L7.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
              <span>Lawyer</span>
            </button>
          </div>
        </div>

        {/* Email + Submit */}
        <div className="flex gap-2">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 h-[42px] px-3.5 bg-white border border-[#E6E8EC] rounded-[8px] text-sm text-[#172033] placeholder:text-[#667085]/60 focus:outline-none focus:ring-2 focus:ring-[#285A8E]/20 focus:border-[#285A8E] transition-all duration-150"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[42px] px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#285A8E] hover:bg-[#1e4670] text-white text-sm font-semibold rounded-[8px] active:scale-[0.98] transition-all duration-150 shadow-sm group disabled:opacity-60"
          >
            <span>{isSubmitting ? "Joining..." : "Join"}</span>
            {!isSubmitting && (
              <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Microcopy */}
        <p className="text-[11px] text-[#667085]/70 pt-0.5">
          No spam. Just launch updates.
        </p>
      </form>
    </div>
  );
}

function WaitlistFormFallback() {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-6 bg-[#F7F8FA] rounded w-16" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-[42px] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
        <div className="h-[42px] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-[42px] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
        <div className="h-[42px] w-20 bg-[#285A8E]/20 rounded-[8px]" />
      </div>
    </div>
  );
}

export default function WaitlistForm() {
  return (
    <Suspense fallback={<WaitlistFormFallback />}>
      <WaitlistFormContent />
    </Suspense>
  );
}
