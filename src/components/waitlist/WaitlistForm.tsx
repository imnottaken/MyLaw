"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, ArrowRightIcon } from "@/components/icons";
import { INDIAN_STATE_BAR_COUNCILS } from "@/lib/constants";

export type UserType = "individual" | "lawyer";

export function parseRoleParam(roleParam: string | null): UserType {
  if (!roleParam) return "individual";
  const normalized = roleParam.toLowerCase().trim();
  if (
    normalized === "lawyer" ||
    normalized === "attorney" ||
    normalized === "professional"
  ) {
    return "lawyer";
  }
  return "individual";
}

function WaitlistFormContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const initialUserType = parseRoleParam(roleParam);

  const [userType, setUserType] = useState<UserType>(initialUserType);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [barCouncilState, setBarCouncilState] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSubtitle, setSuccessSubtitle] = useState(
    "Thanks for joining MyLaw. We'll let you know when we're ready."
  );
  const [fadeState, setFadeState] = useState<"visible" | "fading-out" | "fading-in">("visible");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedEmail = email.trim();
    if (!sanitizedEmail) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMessage("Please enter a valid email address format.");
      return;
    }

    const sanitizedMobile = mobile.trim();
    if (!sanitizedMobile) {
      setErrorMessage("Please provide your mobile number.");
      return;
    }

    const digitsOnly = sanitizedMobile.replace(/[\s\-()]/g, "");
    let coreDigits = digitsOnly;
    if (coreDigits.startsWith("+91")) {
      coreDigits = coreDigits.slice(3);
    } else if (coreDigits.startsWith("91") && coreDigits.length === 12) {
      coreDigits = coreDigits.slice(2);
    } else if (coreDigits.startsWith("0") && coreDigits.length === 11) {
      coreDigits = coreDigits.slice(1);
    }

    if (!/^\d{10}$/.test(coreDigits)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (userType === "lawyer") {
      if (!barCouncilState.trim()) {
        setErrorMessage("Please select your State Bar Council.");
        return;
      }
      if (!enrollmentNumber.trim()) {
        setErrorMessage("Please provide your Bar Council Enrollment Number.");
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        email: sanitizedEmail,
        mobile: sanitizedMobile,
        user_type: userType,
        role: userType === "lawyer" ? "lawyer" : "individual",
        bar_council_state: userType === "lawyer" ? barCouncilState.trim() : null,
        enrollment_number: userType === "lawyer" ? enrollmentNumber.trim().toUpperCase() : null,
        source: "waitlist_page",
      };

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.error || "Failed to join waitlist. Please check your details and try again."
        );
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
      <form onSubmit={handleSubmit} className="w-full space-y-3.5" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="waitlist-email" className="block text-xs font-medium text-[#172033]">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="waitlist-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full h-[48px] sm:h-[50px] px-3.5 sm:px-4 bg-white border border-[#E6E8EC] rounded-[8px] text-sm text-[#172033] placeholder:text-[#667085]/50 focus:outline-none focus:ring-2 focus:ring-[#285A8E]/15 focus:border-[#285A8E] transition-all duration-200"
          />
        </div>

        {/* Mobile Number Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="waitlist-mobile" className="block text-xs font-medium text-[#172033]">
            Mobile number <span className="text-red-500">*</span>
          </label>
          <input
            id="waitlist-mobile"
            type="tel"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile number e.g. +91 98765 43210"
            className="w-full h-[48px] sm:h-[50px] px-3.5 sm:px-4 bg-white border border-[#E6E8EC] rounded-[8px] text-sm text-[#172033] placeholder:text-[#667085]/50 focus:outline-none focus:ring-2 focus:ring-[#285A8E]/15 focus:border-[#285A8E] transition-all duration-200"
          />
        </div>

        {/* Smooth Expandable Lawyer Verification Section */}
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            userType === "lawyer"
              ? "max-h-[320px] opacity-100 space-y-3.5 pt-0.5"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
          aria-hidden={userType !== "lawyer"}
        >
          {/* State Bar Council Dropdown */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="waitlist-bar-council" className="block text-xs font-medium text-[#172033]">
              State Bar Council <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="waitlist-bar-council"
                required={userType === "lawyer"}
                value={barCouncilState}
                onChange={(e) => setBarCouncilState(e.target.value)}
                className="w-full h-[48px] sm:h-[50px] px-3.5 sm:px-4 bg-white border border-[#E6E8EC] rounded-[8px] text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#285A8E]/15 focus:border-[#285A8E] transition-all duration-200 appearance-none cursor-pointer pr-10"
              >
                <option value="" disabled className="text-[#667085]">
                  Select State Bar Council
                </option>
                {INDIAN_STATE_BAR_COUNCILS.map((council) => (
                  <option key={council} value={council} className="text-[#172033]">
                    {council}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#667085]">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M6 8l4 4 4-4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bar Council Enrollment Number */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="waitlist-enrollment-number" className="block text-xs font-medium text-[#172033]">
              Bar Council Enrollment Number <span className="text-red-500">*</span>
            </label>
            <input
              id="waitlist-enrollment-number"
              type="text"
              required={userType === "lawyer"}
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
              placeholder="e.g. D/1234/2020"
              className="w-full h-[48px] sm:h-[50px] px-3.5 sm:px-4 bg-white border border-[#E6E8EC] rounded-[8px] text-sm text-[#172033] placeholder:text-[#667085]/50 focus:outline-none focus:ring-2 focus:ring-[#285A8E]/15 focus:border-[#285A8E] transition-all duration-200"
            />
          </div>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="p-2.5 rounded-[6px] bg-red-50 border border-red-200 text-xs text-red-700 text-center font-medium animate-in fade-in duration-200"
          >
            {errorMessage}
          </div>
        )}

        {/* Submit CTA Button (Full Width, Stacking on Mobile & Desktop) */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[48px] sm:h-[50px] px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#285A8E] hover:bg-[#1e4670] text-white text-sm font-semibold rounded-[8px] active:scale-[0.98] transition-all duration-200 shadow-sm group disabled:opacity-60 cursor-pointer"
          >
            <span>
              {isSubmitting
                ? "Joining..."
                : userType === "lawyer"
                ? "Join as a Lawyer"
                : "Join the Waitlist"}
            </span>
            {!isSubmitting && (
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </button>
        </div>

        {/* Secondary Navigation Flow Toggle */}
        <div className="text-center pt-1.5 pb-0.5">
          {userType === "individual" ? (
            <button
              type="button"
              onClick={() => {
                setUserType("lawyer");
                setErrorMessage(null);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#285A8E] hover:text-[#1e4670] underline-offset-4 hover:underline transition-colors duration-150 cursor-pointer font-medium"
            >
              <span>Are you a lawyer? →</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setUserType("individual");
                setErrorMessage(null);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#667085] hover:text-[#172033] underline-offset-4 hover:underline transition-colors duration-150 cursor-pointer font-medium"
            >
              <span>← Back to regular waitlist</span>
            </button>
          )}
        </div>

        {/* Editorial Trust Microcopy */}
        <p className="text-[11px] text-[#667085]/70 text-center pt-0.5">
          Private by design. No spam. Just launch updates.
        </p>
      </form>
    </div>
  );
}

function WaitlistFormFallback() {
  return (
    <div className="w-full space-y-3.5 animate-pulse">
      <div className="space-y-1.5">
        <div className="h-3 bg-[#F7F8FA] rounded w-20" />
        <div className="w-full h-[48px] sm:h-[50px] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-[#F7F8FA] rounded w-24" />
        <div className="w-full h-[48px] sm:h-[50px] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px]" />
      </div>
      <div className="w-full h-[48px] sm:h-[50px] bg-[#285A8E]/20 rounded-[8px]" />
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
