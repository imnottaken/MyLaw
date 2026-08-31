import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";

export default function FinalCtaSection() {
  return (
    <section className="bg-[#172033] relative overflow-hidden border-t border-[#172033] min-h-dvh flex flex-col justify-between">
      {/* Background Image */}
      <Image
        src="/final_cta_bg.jpg"
        alt="Abstract dark architectural background"
        fill
        className="object-cover object-center opacity-100 mix-blend-overlay"
        quality={100}
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-[#172033]/40 bg-gradient-to-t from-[#172033] via-[#172033]/50 to-transparent" />

      {/* Restrained teal top accent rule */}
      <div className="absolute top-0 inset-x-0 h-1 w-full bg-[#2F7C78] z-10" />

      <div className="flex-1 flex flex-col justify-center w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#2F7C78] bg-[#2F7C78]/10 border border-[#2F7C78]/25 rounded-[6px] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
            <span>§ 07 / PRE-LAUNCH ACCESS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Be among the first to experience MyLaw.
          </h2>

          <p className="mt-8 text-xl sm:text-2xl text-[#E6E8EC]/90 leading-relaxed max-w-2xl mx-auto font-medium">
            We&apos;re getting ready to launch. Join the waitlist and we&apos;ll keep you updated.
          </p>

          <div className="mt-12 flex justify-center">
            <Link
              href="/waitlist"
              className="group inline-flex items-center justify-center gap-2 h-16 px-10 text-lg font-semibold text-[#172033] bg-white hover:bg-[#F6F3EC] active:scale-[0.98] rounded-[8px] transition-all duration-200 shadow-xl cursor-pointer hover:shadow-2xl"
            >
              <span>Join the Waitlist</span>
              <ArrowRightIcon className="w-5 h-5 text-[#172033] ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Ultra-Minimal Dark Footer */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-auto border-t border-white/10 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 MyLaw. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-white/60">
            <Link href="/#about" className="hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:contact@mylaw.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </section>
  );
}
