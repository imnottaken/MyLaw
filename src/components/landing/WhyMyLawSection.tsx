import { FileTextIcon, CompassIcon, GlobeIcon, LockIcon } from "@/components/icons";

export default function WhyMyLawSection() {
  const supportingPrinciples = [
    {
      title: "Clarity",
      description: "Make finding legal help easier to understand with plain language and transparent details.",
      icon: FileTextIcon,
    },
    {
      title: "Choice",
      description: "Help people discover qualified professionals suited directly to their needs and circumstances.",
      icon: CompassIcon,
    },
    {
      title: "Accessibility",
      description: "Make the first step toward legal counsel straightforward, welcoming, and easy to take.",
      icon: GlobeIcon,
    },
  ];

  return (
    <section className="bg-[#F6F3EC] border-b border-[#E6E8EC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Section Header & Central Anchor Statement */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#285A8E] bg-white border border-[#E6E8EC] rounded-[6px] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
            <span>§ 04 / OUR PRINCIPLES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#172033]">
            Built on clarity, choice, and trust.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#667085] leading-relaxed">
            Technology designed for trust, not transaction. Four guiding standards govern every feature of MyLaw to ensure a dependable experience.
          </p>
        </div>

        {/* Hierarchical Grid: 1 Featured Anchor Card + 3 Supporting Blocks */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Anchor Card: Trust */}
          <div className="lg:col-span-5 bg-white border border-[#E6E8EC] rounded-[10px] p-8 sm:p-10 shadow-[0_1px_3px_rgba(16,24,40,0.05)] flex flex-col justify-between transition-all duration-200 hover:border-[#285A8E]/40 hover:-translate-y-0.5">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[8px] bg-[#2F7C78]/10 border border-[#2F7C78]/20 flex items-center justify-center text-[#2F7C78]">
                  <LockIcon className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold tracking-wider uppercase text-[#2F7C78] bg-[#2F7C78]/10 border border-[#2F7C78]/20 rounded-[4px]">
                  Anchor Principle
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#172033] mb-3">
                Trust
              </h3>
              <p className="text-base text-[#667085] leading-relaxed">
                Present useful professional information clearly and responsibly. Every practitioner credential, response expectation, and guidance standard is built to inspire confidence from the first interaction.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E6E8EC] flex items-center gap-2 text-xs font-medium text-[#2F7C78]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
              <span>Verified standards across all legal disciplines</span>
            </div>
          </div>

          {/* 3 Supporting Principle Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-6">
            {supportingPrinciples.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 sm:p-7 bg-white border border-[#E6E8EC] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,40,0.05)] flex items-start gap-5 transition-all duration-200 hover:border-[#285A8E]/30 hover:-translate-y-0.5"
                >
                  <div className="w-11 h-11 rounded-[6px] bg-[#F7F8FA] border border-[#E6E8EC] flex items-center justify-center text-[#285A8E] flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#172033] mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
