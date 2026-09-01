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

/* ── Inline Icons ── */
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3.5 17.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h3A1.5 1.5 0 0 1 13 4.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 11h16" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
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
        className={`text-center py-6 transition-all duration-200 ease-in-out ${
          fadeState === "fading-in" ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="mx-auto w-11 h-11 rounded-full bg-[#2F7C78]/10 text-[#2F7C78] flex items-center justify-center mb-3">
          <CheckCircleIcon className="w-5 h-5 text-[#2F7C78]" strokeWidth={2.2} />
        </div>
        <h3 className="text-xl font-semibold text-[#172033] tracking-tight mb-1.5">
          You&apos;re on the list.
        </h3>
        <p className="text-sm text-[#667085] leading-relaxed mb-5">
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
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Role Selector — Polished Icon Blocks */}
        <div className="space-y-2">
          <span className="block text-[11px] font-medium text-[#667085] uppercase tracking-wider">I am a:</span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setRole(role === "help" ? null : "help")}
              className={`flex items-start gap-2.5 p-3 rounded-[8px] border text-left cursor-pointer transition-all duration-150 select-none ${
                role === "help"
                  ? "border-[#285A8E] bg-[#285A8E]/[0.05] text-[#172033]"
                  : "border-[#E6E8EC] bg-white text-[#172033] hover:bg-[#F7F8FA] hover:border-[#E6E8EC]/80"
              }`}
            >
              <UserIcon className={`w-[18px] h-[18px] mt-0.5 shrink-0 ${role === "help" ? "text-[#285A8E]" : "text-[#667085]"}`} />
              <div>
                <div className={`text-[13px] font-semibold leading-tight ${role === "help" ? "text-[#172033]" : "text-[#172033]"}`}>
                  Individual
                </div>
                <div className="text-[11px] text-[#667085] leading-snug mt-0.5">
                  Seeking legal help
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole(role === "lawyer" ? null : "lawyer")}
              className={`flex items-start gap-2.5 p-3 rounded-[8px] border text-left cursor-pointer transition-all duration-150 select-none ${
                role === "lawyer"
                  ? "border-[#285A8E] bg-[#285A8E]/[0.05] text-[#172033]"
                  : "border-[#E6E8EC] bg-white text-[#172033] hover:bg-[#F7F8FA] hover:border-[#E6E8EC]/80"
              }`}
            >
              <BriefcaseIcon className={`w-[18px] h-[18px] mt-0.5 shrink-0 ${role === "lawyer" ? "text-[#285A8E]" : "text-[#667085]"}`} />
              <div>
                <div className={`text-[13px] font-semibold leading-tight ${role === "lawyer" ? "text-[#172033]" : "text-[#172033]"}`}>
                  Lawyer
                </div>
                <div className="text-[11px] text-[#667085] leading-snug mt-0.5">
                  Professional
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Email + CTA — Cohesive Form Row */}
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
            className="flex-1 h-[50px] px-4 bg-white border border-[#E6E8EC] rounded-[8px] text-sm text-[#172033] placeholder:text-[#667085]/50 focus:outline-none focus:ring-2 focus:ring-[#285A8E]/15 focus:border-[#285A8E] transition-all duration-150"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[50px] px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#285A8E] hover:bg-[#1e4670] text-white text-sm font-semibold rounded-[8px] active:scale-[0.98] transition-all duration-150 shadow-sm group disabled:opacity-60 cursor-pointer"
          >
            <span>{isSubmitting ? "Joining..." : "Join the Waitlist"}</span>
            {!isSubmitting && (
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </button>
        </div>

        {/* Microcopy */}
        <p className="text-[11px] text-[#667085]/70 pt-0.5">
          Private by design. No spam. Just launch updates.
        </p>
      </form>
    </div>
  );
}

function WaitlistFormFallback() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-5 bg-[#F7F8FA] rounded w-12" />
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-16 bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
        <div className="h-16 bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-[50px] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
        <div className="h-[50px] w-36 bg-[#285A8E]/20 rounded-[8px]" />
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
