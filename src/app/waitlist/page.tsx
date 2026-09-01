import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import WaitlistForm from "@/components/waitlist/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Waitlist — MyLaw",
  description:
    "Be among the first to experience MyLaw. We're building a better way to discover and connect with legal professionals.",
};

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between text-white relative overflow-hidden">
      {/* Cinematic Stock Background — Blurred + Dark Navy Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-30" aria-hidden="true">
        <Image
          src="/waitlist-bg.jpg"
          alt=""
          fill
          className="object-cover scale-105 blur-md"
          quality={75}
          priority
        />
      </div>
      {/* Dark Navy Overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[#172033]/75"
        aria-hidden="true"
      />
      {/* Subtle Radial Highlight — adds depth */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_30%_40%,rgba(40,90,142,0.15),transparent_70%)]"
        aria-hidden="true"
      />
      {/* Subtle Warm Vignette Edges */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_40%,rgba(23,32,51,0.5)_100%)]"
        aria-hidden="true"
      />

      {/* Dedicated Header — Glass effect on dark background */}
      <header className="w-full border-b border-white/10 bg-[#172033]/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white hover:text-white/80 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
          >
            MyLaw
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-150 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
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
                className="pointer-events-none absolute -top-12 -left-6 sm:-left-8 text-[7rem] sm:text-[9rem] lg:text-[11.5rem] xl:text-[13rem] font-bold tracking-tighter text-white/[0.04] select-none -z-10 leading-none"
                aria-hidden="true"
              >
                MYLAW
              </div>

              {/* Eyebrow Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-semibold tracking-widest text-white bg-white/10 border border-white/15 uppercase shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
                  <span>COMING SOON / 01</span>
                </span>
                <span className="text-xs font-mono font-medium text-white/40 tracking-wider">
                  EARLY ACCESS
                </span>
              </div>

              {/* Headline & Description */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold text-white tracking-tight leading-[1.15]">
                  Legal help, made simpler.
                </h1>

                {/* Thin Editorial Accent Rule */}
                <div className="w-16 h-0.5 bg-[#285A8E] rounded-full" />

                {/* Brand Statement */}
                <p className="text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
                  We&apos;re building a better way to discover and connect with legal professionals. Experience clarity, curated guidance, and direct communication designed around your needs.
                </p>
              </div>

              {/* Editorial Feature Highlights / Value Pillars */}
              <div className="pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 text-left">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#5B9BD5]">01 / CLARITY</div>
                  <div className="text-xs text-white/50">Transparent insights and guided next steps.</div>
                </div>
                <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-4">
                  <div className="text-xs font-mono font-semibold text-[#5B9BD5]">02 / CHOICE</div>
                  <div className="text-xs text-white/50">Verified legal practitioners by domain expertise.</div>
                </div>
                <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-4">
                  <div className="text-xs font-mono font-semibold text-[#5B9BD5]">03 / TRUST</div>
                  <div className="text-xs text-white/50">Confidential inquiries with zero friction.</div>
                </div>
              </div>
            </div>

            {/* Right Column: Waitlist Card (lg:col-span-5) */}
            <div className="lg:col-span-5 w-full mt-8 lg:mt-0 relative">
              <div className="bg-white/[0.97] backdrop-blur-sm border border-white/20 rounded-[10px] sm:rounded-[14px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-[#172033]">
                <h2 className="text-lg sm:text-xl font-semibold text-[#172033] tracking-tight mb-5">
                  Join the Waitlist
                </h2>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer — Glass on dark */}
      <footer className="w-full border-t border-white/10 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/70">MyLaw</span>
            <span>&bull;</span>
            <p>&copy; 2026 MyLaw. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-white/70 transition-colors duration-150"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-white/70 transition-colors duration-150"
            >
              Terms
            </Link>
            <a
              href="mailto:contact@mylaw.com"
              className="hover:text-white/70 transition-colors duration-150"
            >
              Contact
            </a>
          </div>

          <p className="text-white/30">Legal help, simplified.</p>
        </div>
      </footer>
    </div>
  );
}
