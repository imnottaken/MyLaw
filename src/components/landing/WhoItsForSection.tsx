import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, UserIcon, BriefcaseIcon } from "@/components/icons";

export default function WhoItsForSection() {
  return (
    <section id="for-lawyers" className="bg-white border-b border-[#E6E8EC] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#285A8E] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[6px] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
            <span>§ 05 / WHO IT&apos;S FOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#172033]">
            Designed for both sides of legal care.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#667085] leading-relaxed">
            A balanced platform that serves people looking for guidance and legal professionals looking to connect with clients.
          </p>
        </div>

        {/* Asymmetric Dual-Panel Editorial Layout */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Panel 1: For Individuals */}
          <div className="p-8 sm:p-10 bg-[#F7F8FA] border border-[#E6E8EC] rounded-[10px] flex flex-col justify-between transition-all duration-200 hover:border-[#285A8E]/40 hover:-translate-y-0.5 group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[8px] bg-white border border-[#E6E8EC] flex items-center justify-center text-[#285A8E]">
                  <UserIcon className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#285A8E] bg-white border border-[#E6E8EC] rounded-[4px] uppercase">
                  Individuals &amp; Families
                </span>
              </div>
              <span className="text-xs font-semibold tracking-wider text-[#285A8E] uppercase">
                For Individuals
              </span>
              <h3 className="text-2xl font-bold text-[#172033] mt-2 mb-4">
                Find legal help with confidence.
              </h3>
              <p className="text-base text-[#667085] leading-relaxed mb-6">
                Whether you have a specific legal question or need comprehensive representation, MyLaw connects you with qualified legal professionals who match your needs.
              </p>
              
              {/* Editorial Image */}
              <div className="relative w-full h-48 sm:h-56 mb-8 rounded-[8px] overflow-hidden border border-[#E6E8EC]">
                <Image
                  src="/individuals_help.jpg"
                  alt="Person reviewing legal documents"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6E8EC]">
              <Link
                href="/waitlist"
                className="group/btn inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#285A8E] hover:bg-[#1e4670] active:scale-[0.98] rounded-[6px] transition-all duration-200 shadow-[0_1px_3px_rgba(16,24,40,0.05)] w-full sm:w-auto text-center cursor-pointer"
              >
                <span>Join the Waitlist</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Panel 2: For Lawyers */}
          <div className="p-8 sm:p-10 bg-white border border-[#E6E8EC] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,40,0.05)] flex flex-col justify-between transition-all duration-200 hover:border-[#285A8E]/40 hover:-translate-y-0.5 group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[8px] bg-[#F7F8FA] border border-[#E6E8EC] flex items-center justify-center text-[#285A8E]">
                  <BriefcaseIcon className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#2F7C78] bg-[#2F7C78]/10 border border-[#2F7C78]/20 rounded-[4px] uppercase">
                  Qualified Practitioners
                </span>
              </div>
              <span className="text-xs font-semibold tracking-wider text-[#285A8E] uppercase">
                For Lawyers
              </span>
              <h3 className="text-2xl font-bold text-[#172033] mt-2 mb-4">
                Build your professional presence.
              </h3>
              <p className="text-base text-[#667085] leading-relaxed mb-6">
                Showcase your experience, credentials, and practice areas to clients seeking your specific expertise. Expand your reach through a platform built for quality and trust.
              </p>

              {/* Editorial Image */}
              <div className="relative w-full h-48 sm:h-56 mb-8 rounded-[8px] overflow-hidden border border-[#E6E8EC]">
                <Image
                  src="/lawyers_office.jpg"
                  alt="Professional lawyer working at desk"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6E8EC]">
              <Link
                href="/waitlist?role=lawyer"
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-[#172033] bg-[#F7F8FA] hover:bg-white hover:border-[#285A8E]/40 border border-[#E6E8EC] rounded-[6px] transition-all duration-200 w-full sm:w-auto text-center cursor-pointer"
              >
                <span>I&apos;m a Lawyer</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
