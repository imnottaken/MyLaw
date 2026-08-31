"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

    // Snappy transition <= 200ms
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
        className={`w-full max-w-md mx-auto bg-white border border-[#E6E8EC] rounded-[10px] p-8 sm:p-10 shadow-[0_1px_3px_rgba(16,24,40,0.05)] text-center transition-all duration-200 ease-in-out ${
          fadeState === "fading-in" ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-[#2F7C78]/10 text-[#2F7C78] flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-6 h-6 text-[#2F7C78]" strokeWidth={2.2} />
        </div>
        <h2 className="text-2xl font-semibold text-[#172033] tracking-tight mb-2">
          You&apos;re on the list.
        </h2>
        <p className="text-base text-[#667085] leading-relaxed mb-6">
          Thanks for joining MyLaw. We&apos;ll let you know when we&apos;re ready.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-[#285A8E] hover:text-[#1e4670] hover:underline transition-colors duration-150"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-md mx-auto transition-opacity duration-200 ease-in-out ${
        fadeState === "fading-out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Optional Role Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-5 text-sm">
          <span className="text-xs sm:text-sm font-medium text-[#667085]">I am a:</span>
          <div className="flex items-center gap-2">
            <label
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] border text-xs sm:text-sm font-medium cursor-pointer transition-all duration-150 select-none ${
                role === "help"
                  ? "border-[#285A8E] bg-[#285A8E]/8 text-[#285A8E] font-semibold"
                  : "border-[#E6E8EC] bg-white text-[#172033] hover:bg-[#F7F8FA] hover:border-[#285A8E]/30"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="help"
                checked={role === "help"}
                onChange={() => setRole("help")}
                className="accent-[#285A8E] h-3.5 w-3.5 cursor-pointer"
              />
              <span>Looking for legal help</span>
            </label>

            <label
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] border text-xs sm:text-sm font-medium cursor-pointer transition-all duration-150 select-none ${
                role === "lawyer"
                  ? "border-[#285A8E] bg-[#285A8E]/8 text-[#285A8E] font-semibold"
                  : "border-[#E6E8EC] bg-white text-[#172033] hover:bg-[#F7F8FA] hover:border-[#285A8E]/30"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="lawyer"
                checked={role === "lawyer"}
                onChange={() => setRole("lawyer")}
                className="accent-[#285A8E] h-3.5 w-3.5 cursor-pointer"
              />
              <span>Lawyer</span>
            </label>
          </div>
        </div>

        {/* Input & Submit Button */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <Input
            id="waitlist-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 h-12 px-4 bg-white text-base shadow-sm focus-visible:ring-[#285A8E]/20 focus-visible:border-[#285A8E]"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#285A8E] hover:bg-[#1e4670] active:scale-[0.98] transition-all shadow-sm group"
          >
            <span>{isSubmitting ? "Joining..." : "Join the Waitlist"}</span>
            {!isSubmitting && (
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </Button>
        </div>

        {/* Microcopy */}
        <p className="text-xs text-[#667085] text-center pt-1">
          No spam. Just launch updates.
        </p>
      </form>
    </div>
  );
}

function WaitlistFormFallback() {
  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-[#F7F8FA] rounded-[6px] max-w-xs mx-auto mb-5" />
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1 h-11 bg-[#F7F8FA] border border-[#E6E8EC] rounded-[6px]" />
        <div className="h-11 w-36 bg-[#285A8E]/20 rounded-[6px]" />
      </div>
      <div className="h-4 bg-[#F7F8FA] rounded w-40 mx-auto mt-2" />
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
