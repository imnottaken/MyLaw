export default function ProblemSection() {
  return (
    <section className="bg-[#F7F8FA] border-b border-[#E6E8EC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section Marker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#285A8E] bg-white border border-[#E6E8EC] rounded-[6px] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
            <span>§ 02 / THE CHALLENGE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#172033] leading-snug">
            Legal help can feel complicated before it even begins.
          </h2>

          <div className="w-12 h-px bg-[#2F7C78]/40 mx-auto my-6" />

          <p className="text-base sm:text-lg lg:text-xl text-[#667085] leading-relaxed">
            Finding a suitable lawyer often involves searching through scattered information, relying on recommendations, or simply not knowing where to start.
          </p>
        </div>
      </div>
    </section>
  );
}
