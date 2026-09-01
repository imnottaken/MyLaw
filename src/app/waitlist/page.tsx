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
    <div className="min-h-screen flex flex-col bg-white text-[#172033] relative overflow-hidden">
      {/* Very subtle background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
        aria-hidden="true"
      >
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wl-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#172033" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wl-dots)" />
        </svg>
      </div>

      {/* Navbar */}
      <header className="w-full border-b border-[#E6E8EC] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity duration-150"
          >
            <Image
              src="/logo mylaw.jpeg"
              alt="MyLaw logo"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
            <span className="text-lg font-bold tracking-tight text-[#172033]">
              MyLaw
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#667085] hover:text-[#172033] transition-colors duration-150 flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center lg:min-h-[calc(100vh-10rem)]">

            {/* ─── Left Column: Typography & Copy ─── */}
            <div className="space-y-8 relative">
              {/* Oversized faint numbering */}
              <div
                className="pointer-events-none absolute -top-6 -left-4 sm:-left-6 text-[8rem] sm:text-[10rem] lg:text-[12rem] font-bold tracking-tighter text-[#172033]/[0.03] select-none -z-10 leading-none font-mono"
                aria-hidden="true"
              >
                01
              </div>

              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#285A8E]" />
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#285A8E] uppercase">
                  Coming Soon
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-semibold text-[#172033] tracking-tight leading-[1.1]">
                Legal help,<br />
                made simpler.
              </h1>

              {/* Thin accent rule */}
              <div className="w-12 h-[2px] bg-[#285A8E]/40" />

              {/* Supporting copy */}
              <p className="text-base sm:text-lg text-[#667085] max-w-md leading-relaxed">
                We&apos;re building a simpler way to discover and connect with legal professionals.
              </p>

              {/* Small editorial detail */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-[10px] font-mono font-medium text-[#667085]/50 tracking-widest uppercase">
                  MyLaw / 2026
                </span>
                <div className="w-px h-3 bg-[#E6E8EC]" />
                <span className="text-[10px] font-mono font-medium text-[#667085]/50 tracking-widest uppercase">
                  Early Access
                </span>
              </div>
            </div>

            {/* ─── Right Column: Image + Form ─── */}
            <div className="space-y-6 lg:space-y-0 relative">

              {/* Editorial Image Block */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/5] shadow-[0_8px_40px_rgba(23,32,51,0.12)]">
                <Image
                  src="/hero page img.png"
                  alt="Lady Justice — symbol of fair and accessible legal representation"
                  fill
                  className="object-cover"
                  quality={85}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Dark navy gradient overlay — bottom-heavy for form contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/90 via-[#172033]/30 to-[#172033]/10" />

                {/* Small editorial accent on image */}
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-white/70 uppercase">
                    Est. 2026
                  </span>
                </div>

                {/* Form overlaid at the bottom of the image */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="bg-white rounded-[10px] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                    <div className="mb-4 space-y-1">
                      <h2 className="text-lg font-semibold text-[#172033] tracking-tight">
                        Join the Waitlist
                      </h2>
                      <p className="text-xs text-[#667085]">
                        Be among the first to experience MyLaw.
                      </p>
                    </div>
                    <WaitlistForm />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E6E8EC] py-6">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#667085]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172033]">MyLaw</span>
            <span className="text-[#E6E8EC]">·</span>
            <span>&copy; 2026 MyLaw. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-[#172033] transition-colors duration-150">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[#172033] transition-colors duration-150">
              Terms
            </Link>
            <a href="mailto:contact@mylaw.com" className="hover:text-[#172033] transition-colors duration-150">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
