import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/waitlist/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Waitlist — MyLaw",
  description: "Be among the first to experience MyLaw. We're building a better way to discover and connect with legal professionals.",
};

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#172033] relative">
      {/* Subtle low-opacity (3.5%) geometric architectural grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.035]"
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 h-full w-full stroke-[#172033]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <defs>
            <pattern
              id="waitlist-grid-pattern"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 48V.5H48" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waitlist-grid-pattern)" />
        </svg>
      </div>

      {/* Clean Top Header with MyLaw wordmark */}
      <header className="w-full border-b border-[#E6E8EC]/80 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#172033] hover:text-[#285A8E] transition-colors duration-150"
          >
            MyLaw
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#667085] hover:text-[#172033] hover:text-[#285A8E] transition-colors duration-150"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Centered Main Section with Generous Whitespace */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative">
        <div className="w-full max-w-xl mx-auto text-center space-y-8">
          {/* Eyebrow Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] text-xs font-semibold tracking-widest text-[#285A8E] bg-[#F7F8FA] border border-[#E6E8EC] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
              <span>COMING SOON</span>
            </span>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#172033] tracking-tight leading-tight">
              Legal help, made simpler.
            </h1>
            <p className="text-base sm:text-lg text-[#667085] max-w-lg mx-auto leading-relaxed">
              We&apos;re building a better way to discover and connect with legal professionals.
            </p>
          </div>

          {/* Waitlist Form Component */}
          <div className="pt-2">
            <WaitlistForm />
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full border-t border-[#E6E8EC] py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#667085]">
          <p>&copy; 2026 MyLaw. All rights reserved.</p>
          <p>Legal help, simplified.</p>
        </div>
      </footer>
    </div>
  );
}
