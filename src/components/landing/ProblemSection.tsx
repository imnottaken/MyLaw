export default function ProblemSection() {
  return (
    <section className="bg-[#F7F8FA] border-b border-[#E6E8EC] min-h-dvh flex flex-col justify-center relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full stroke-[#172033]/5" xmlns="http://www.w3.org/2000/svg" fill="none">
          <defs>
            <pattern id="challenge-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 60V.5H60" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#challenge-grid)" />
        </svg>
      </div>

      {/* Large Faint Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
        <span className="text-[300px] lg:text-[400px] font-bold text-[#172033]/[0.02] tracking-tighter leading-none">
          02
        </span>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section Marker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#285A8E] bg-white border border-[#E6E8EC] rounded-[6px] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
            <span>§ 02 / THE CHALLENGE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#172033] leading-[1.15]">
            Legal help can feel complicated before it even begins.
          </h2>

          <div className="w-12 h-px bg-[#2F7C78]/40 mx-auto my-8" />

          <p className="text-lg sm:text-xl lg:text-2xl text-[#667085] leading-relaxed max-w-2xl mx-auto font-medium">
            Finding a suitable lawyer often involves searching through scattered information, relying on recommendations, or simply not knowing where to start.
          </p>
        </div>
      </div>
    </section>
  );
}
