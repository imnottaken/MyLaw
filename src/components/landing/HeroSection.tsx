import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";

export default function HeroSection() {
  return (
    <section className="relative min-h-dvh flex items-center border-b border-[#172033]/20 overflow-hidden">
      {/* Full-bleed background image — horizontally mirrored */}
      <Image
        src="/hero page img.png"
        alt="Legal professionals at work"
        fill
        className="object-cover object-center"
        style={{ transform: 'scaleX(-1)' }}
        priority
        quality={90}
      />

      {/* Layered overlay — dark navy gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#172033]/80 via-[#172033]/65 to-[#172033]/50" />
      {/* Subtle teal accent tint at bottom edge */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#2F7C78]/20 to-transparent" />

      {/* Content — centered column over the image */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-white/80 bg-white/10 border border-white/20 rounded-[6px] uppercase mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
            <span>§ 01 / LEGAL HELP, SIMPLIFIED</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-bold tracking-tight text-white leading-[1.08] sm:leading-[1.1]">
            Finding the right lawyer shouldn&apos;t be difficult.
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl">
            MyLaw is building a simpler way to discover and connect with the right legal professionals for your needs.
          </p>

          {/* Dual CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/waitlist"
              className="group inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-semibold bg-[#285A8E] hover:bg-[#1e4670] text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] rounded-[6px] transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Join the Waitlist</span>
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center h-14 px-8 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-[6px] backdrop-blur-sm transition-all cursor-pointer"
            >
              Learn More
            </Link>
          </div>

          {/* Bottom meta line */}
          <p className="mt-12 text-sm text-white/40 tracking-wide uppercase font-medium border-t border-white/10 pt-6 inline-block">
            Pre-launch — join the waitlist for early access
          </p>
        </div>
      </div>
    </section>
  );
}
