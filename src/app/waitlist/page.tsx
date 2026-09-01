import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/waitlist/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Waitlist — MyLaw",
  description:
    "Be among the first to experience MyLaw. We're building a better way to discover and connect with legal professionals.",
};

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#172033] relative overflow-hidden">
      {/* Subtle Atmospheric Gradient / Tint */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#F7F8FA] via-white to-white"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-96 -z-20 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(40,90,142,0.035),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Low-Opacity Architectural Grid Background (3.5% Opacity) */}
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

      {/* Dedicated Header with Wordmark and Back Link */}
      <header className="w-full border-b border-[#E6E8EC]/80 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#172033] hover:text-[#285A8E] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E] rounded-sm"
          >
            MyLaw
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#667085] hover:text-[#285A8E] transition-colors duration-150 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285A8E] rounded-sm"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Asymmetric Split Layout */}
      <main className="flex-1 flex items-center py-10 sm:py-14 lg:py-20 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Hero & Brand Authority (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 relative">
              {/* Background Watermark Typography */}
              <div
                className="pointer-events-none absolute -top-12 -left-6 sm:-left-8 text-[7rem] sm:text-[9rem] lg:text-[11.5rem] xl:text-[13rem] font-bold tracking-tighter text-[#172033]/[0.025] select-none -z-10 leading-none"
                aria-hidden="true"
              >
                MYLAW
              </div>

              {/* Eyebrow Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-semibold tracking-widest text-[#285A8E] bg-[#F7F8FA] border border-[#E6E8EC] uppercase shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
                  <span>COMING SOON / 01</span>
                </span>
                <span className="text-xs font-mono font-medium text-[#667085]/60 tracking-wider">
                  EARLY ACCESS
                </span>
              </div>

              {/* Headline & Description */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold text-[#172033] tracking-tight leading-[1.15]">
                  Legal help, made simpler.
                </h1>

                {/* Thin Editorial Accent Rule */}
                <div className="w-16 h-0.5 bg-[#285A8E]/60 rounded-full" />

                {/* Brand Statement */}
                <p className="text-base sm:text-lg text-[#667085] max-w-xl leading-relaxed">
                  We&apos;re building a better way to discover and connect with legal professionals. Experience clarity, curated guidance, and direct communication designed around your needs.
                </p>
              </div>

              {/* Editorial Feature Highlights / Value Pillars */}
              <div className="pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E6E8EC]/80 text-left">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#285A8E]">01 / CLARITY</div>
                  <div className="text-xs text-[#667085]">Transparent insights and guided next steps.</div>
                </div>
                <div className="space-y-1 sm:border-l sm:border-[#E6E8EC] sm:pl-4">
                  <div className="text-xs font-mono font-semibold text-[#285A8E]">02 / CHOICE</div>
                  <div className="text-xs text-[#667085]">Verified legal practitioners by domain expertise.</div>
                </div>
                <div className="space-y-1 sm:border-l sm:border-[#E6E8EC] sm:pl-4">
                  <div className="text-xs font-mono font-semibold text-[#285A8E]">03 / TRUST</div>
                  <div className="text-xs text-[#667085]">Confidential inquiries with zero friction.</div>
                </div>
              </div>
            </div>

            {/* Right Column: Elevated Waitlist Card Container (lg:col-span-5) */}
            <div className="lg:col-span-5 w-full mt-8 lg:mt-0 relative">
              <div className="bg-white border border-[#E6E8EC] rounded-[10px] sm:rounded-[14px] p-6 sm:p-8 lg:p-10 shadow-[0_1px_3px_rgba(16,24,40,0.05)] relative overflow-hidden">
                {/* Translucent "01" Index Marker */}
                <div
                  className="pointer-events-none absolute top-4 right-5 text-2xl font-mono font-bold text-[#285A8E]/10 select-none"
                  aria-hidden="true"
                >
                  01
                </div>

                {/* Card Title & Description */}
                <div className="mb-6 space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#285A8E] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
                    <span>Priority Access</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#172033] tracking-tight">
                    Join the Waitlist
                  </h2>
                  <p className="text-xs sm:text-sm text-[#667085]">
                    Be among the first to experience MyLaw when we launch. Select your role for tailored early access.
                  </p>
                </div>

                {/* Interactive Waitlist Form Component */}
                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-[#E6E8EC] py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172033]">MyLaw</span>
            <span>&bull;</span>
            <p>&copy; 2026 MyLaw. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-[#285A8E] transition-colors duration-150"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-[#285A8E] transition-colors duration-150"
            >
              Terms
            </Link>
            <a
              href="mailto:contact@mylaw.com"
              className="hover:text-[#285A8E] transition-colors duration-150"
            >
              Contact
            </a>
          </div>

          <p className="text-[#667085]">Legal help, simplified.</p>
        </div>
      </footer>
    </div>
  );
}
