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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSubtitle, setSuccessSubtitle] = useState("Thanks for joining MyLaw. We'll let you know when we're ready.");
  const [fadeState, setFadeState] = useState<"visible" | "fading-out" | "fading-in">("visible");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedEmail = email.trim();
    if (!sanitizedEmail) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sanitizedEmail, role, source: "waitlist_page" }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to join waitlist. Please check your email and try again.");
        setIsSubmitting(false);
        return;
      }

      if (data.alreadyRegistered) {
        setSuccessSubtitle("You're already on the priority access list! We'll keep you updated.");
      }

      // Smooth transition to success
      setFadeState("fading-out");
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFadeState("fading-in");
        setTimeout(() => {
          setFadeState("visible");
        }, 50);
      }, 150);
    } catch (err) {
      console.error("Waitlist submit error:", err);
      setErrorMessage("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
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
          {successSubtitle}
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
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setRole(role === "help" ? null : "help")}
              className={`flex items-start gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-[8px] border text-left cursor-pointer transition-all duration-150 select-none ${
                role === "help"
                  ? "border-[#285A8E] bg-[#285A8E]/[0.05] text-[#172033]"
                  : "border-[#E6E8EC] bg-white text-[#172033] hover:bg-[#F7F8FA] hover:border-[#E6E8EC]/80"
              }`}
            >
              <UserIcon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] mt-0.5 shrink-0 ${role === "help" ? "text-[#285A8E]" : "text-[#667085]"}`} />
              <div className="min-w-0">
                <div className={`text-xs sm:text-[13px] font-semibold leading-tight truncate ${role === "help" ? "text-[#172033]" : "text-[#172033]"}`}>
                  Individual
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#667085] leading-snug mt-0.5 truncate sm:whitespace-normal">
                  Seeking help
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole(role === "lawyer" ? null : "lawyer")}
              className={`flex items-start gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-[8px] border text-left cursor-pointer transition-all duration-150 select-none ${
                role === "lawyer"
                  ? "border-[#285A8E] bg-[#285A8E]/[0.05] text-[#172033]"
                  : "border-[#E6E8EC] bg-white text-[#172033] hover:bg-[#F7F8FA] hover:border-[#E6E8EC]/80"
              }`}
            >
              <BriefcaseIcon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] mt-0.5 shrink-0 ${role === "lawyer" ? "text-[#285A8E]" : "text-[#667085]"}`} />
              <div className="min-w-0">
                <div className={`text-xs sm:text-[13px] font-semibold leading-tight truncate ${role === "lawyer" ? "text-[#172033]" : "text-[#172033]"}`}>
                  Lawyer
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#667085] leading-snug mt-0.5 truncate sm:whitespace-normal">
                  Professional
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Email + CTA — Responsive Form Row */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2">
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
            className="w-full sm:flex-1 h-[48px] sm:h-[50px] px-3.5 sm:px-4 bg-white border border-[#E6E8EC] rounded-[8px] text-sm text-[#172033] placeholder:text-[#667085]/50 focus:outline-none focus:ring-2 focus:ring-[#285A8E]/15 focus:border-[#285A8E] transition-all duration-150"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-[48px] sm:h-[50px] px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#285A8E] hover:bg-[#1e4670] text-white text-sm font-semibold rounded-[8px] active:scale-[0.98] transition-all duration-150 shadow-sm group disabled:opacity-60 cursor-pointer"
          >
            <span>{isSubmitting ? "Joining..." : "Join the Waitlist"}</span>
            {!isSubmitting && (
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-2.5 rounded-[6px] bg-red-50 border border-red-200 text-xs text-red-700 text-center font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}

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
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        <div className="h-14 sm:h-16 bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
        <div className="h-14 sm:h-16 bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2">
        <div className="w-full sm:flex-1 h-[48px] sm:h-[50px] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
        <div className="w-full sm:w-36 h-[48px] sm:h-[50px] bg-[#285A8E]/20 rounded-[8px]" />
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
