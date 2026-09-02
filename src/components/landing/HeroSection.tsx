import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";

export default function HeroSection() {
  return (
    <section className="relative min-h-dvh flex items-center border-b border-[#172033]/20 overflow-hidden">
      {/* Full-bleed background image — horizontally mirrored with responsive mobile framing */}
      <Image
        src="/hero page img.png"
        alt="Legal professionals at work"
        fill
        className="object-cover object-[75%_center] sm:object-center select-none pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
        priority
        quality={85}
      />

      {/* Layered overlay — mobile-optimized dark navy gradient for crisp text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#172033]/92 via-[#172033]/80 to-[#172033]/50 sm:from-[#172033]/85 sm:via-[#172033]/65 sm:to-[#172033]/40" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_40%,rgba(23,32,51,0.6)_100%)] pointer-events-none" />
      {/* Subtle teal accent tint at bottom edge */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#2F7C78]/20 to-transparent pointer-events-none" />

      {/* Content — responsive container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:py-32 lg:py-40">
        <div className="max-w-3xl">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-white/80 bg-white/10 border border-white/20 rounded-[6px] uppercase mb-6 sm:mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
            <span>§ 01 / LEGAL HELP, SIMPLIFIED</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-bold tracking-tight text-white leading-[1.1] sm:leading-[1.1]">
            Finding the right lawyer shouldn&apos;t be difficult.
          </h1>

          {/* Supporting Copy */}
          <p className="mt-5 sm:mt-6 text-base sm:text-xl text-white/80 leading-relaxed max-w-2xl">
            MyLaw is building a simpler way to discover and connect with the right legal professionals for your needs.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
            <Link
              href="/waitlist"
              className="group inline-flex items-center justify-center gap-2 h-13 sm:h-14 px-7 sm:px-8 text-sm sm:text-base font-semibold bg-[#285A8E] hover:bg-[#1e4670] text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] rounded-[6px] transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Join the Waitlist</span>
              <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center h-13 sm:h-14 px-7 sm:px-8 text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-[6px] backdrop-blur-sm transition-all cursor-pointer"
            >
              Learn More
            </Link>
          </div>

          {/* Bottom meta line */}
          <p className="mt-10 sm:mt-12 text-xs sm:text-sm text-white/50 tracking-wide uppercase font-medium border-t border-white/10 pt-5 sm:pt-6 inline-block">
            Pre-launch — join the waitlist for early access
          </p>
        </div>
      </div>
    </section>
  );
}
