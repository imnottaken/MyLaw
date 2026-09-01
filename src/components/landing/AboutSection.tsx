import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="bg-[#F7F8FA] border-b border-[#E6E8EC] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 lg:mb-20">
          {/* Left Column: Heading, Eyebrow & Pull Quote */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#285A8E] bg-white border border-[#E6E8EC] rounded-[6px] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
              <span>§ 06 / ABOUT MYLAW</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#172033] leading-tight">
              We&apos;re building a better starting point for legal help.
            </h2>

            {/* Editorial Mission Callout */}
            <div className="mt-8 border-l-2 border-[#2F7C78] pl-4 py-1">
              <p className="text-base sm:text-lg font-medium text-[#172033] leading-snug">
                &ldquo;Our mission is to empower individuals and businesses with quick access to legal information, document support, and experienced lawyers, helping them resolve legal matters with confidence.&rdquo;
              </p>
              <span className="block mt-2 text-xs font-semibold tracking-wider uppercase text-[#2F7C78]">
                — The MyLaw Mission
              </span>
            </div>
          </div>

          {/* Right Column: Mission narrative */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-[#667085] leading-relaxed pt-2 lg:pt-0">
            <p>
              Navigating legal questions is often stressful, confusing, and fragmented. Most people don&apos;t know where to look, what qualifications matter, or how to begin a conversation with the right counsel.
            </p>
            <p>
              MyLaw was founded with a straightforward conviction: finding legal assistance should be simple, transparent, and approachable. We are building a platform that removes guesswork, aligns expectations, and connects clients with verified legal professionals.
            </p>
            <p>
              We believe in honest technology that respects both the public seeking guidance and the legal practitioners providing counsel.
            </p>
          </div>
        </div>

        {/* Full-width editorial architectural image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-[14px] overflow-hidden shadow-[0_4px_12px_rgba(16,24,40,0.05)] border border-[#E6E8EC]">
          <Image
            src="/about_architecture.jpg"
            alt="Modern professional office space"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
