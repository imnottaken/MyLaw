export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Tell us what you need",
      description:
        "Describe your legal matter or the specific area of law where you need guidance in plain, straightforward terms.",
    },
    {
      number: "02",
      title: "Discover relevant legal professionals",
      description:
        "Browse verified practitioners and legal specialists suited to your specific circumstances, location, and requirements.",
    },
    {
      number: "03",
      title: "Connect with the right one",
      description:
        "Directly reach out to arrange an initial consultation and move your legal matters forward with confidence.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-white border-b border-[#E6E8EC] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#285A8E] bg-[#F7F8FA] border border-[#E6E8EC] rounded-[6px] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
            <span>§ 03 / HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#172033]">
            We&apos;re making the first step simpler.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#667085] leading-relaxed">
            MyLaw is being built to bring legal professionals and people looking for legal help together through a clearer, more accessible platform.
          </p>
        </div>

        {/* Editorial Ruled 3-Column Sequence */}
        <div className="mt-12 lg:mt-16 border-t border-[#E6E8EC] pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className={`flex flex-col justify-between ${
                  idx !== 0 ? "md:border-l md:border-[#E6E8EC] md:pl-8 lg:pl-10" : ""
                } ${idx !== steps.length - 1 ? "md:pr-8 lg:pr-10" : ""}`}
              >
                <div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-[#285A8E] tracking-tight">
                      {step.number}
                    </span>
                    <span className="text-xl font-light text-[#667085]/40">/</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#172033] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
