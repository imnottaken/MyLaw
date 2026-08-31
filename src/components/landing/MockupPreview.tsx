"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SearchIcon,
  CheckCircleIcon,
  ShieldIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@/components/icons";

export default function MockupPreview() {
  const [selectedTag, setSelectedTag] = useState<string>("Family Law");

  const practiceAreas = [
    "Family Law",
    "Property",
    "Corporate",
    "Criminal",
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-[#E6E8EC] rounded-[14px] shadow-[0_1px_3px_rgba(16,24,40,0.05)] overflow-hidden transition-all duration-200 hover:border-[#285A8E]/30">
      {/* Top simulated browser/panel bar */}
      <div className="px-5 py-3 bg-[#F7F8FA] border-b border-[#E6E8EC] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E6E8EC]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E6E8EC]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E6E8EC]" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#667085]">
          <ShieldIcon className="w-3.5 h-3.5 text-[#285A8E]" />
          <span>MyLaw Counsel Discovery • Verified Directory</span>
        </div>
      </div>

      {/* Main card body */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Search header & input preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#172033]">
              Find legal help
            </h3>
            <span className="text-xs text-[#2F7C78] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F7C78]" />
              Verified Counsel
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#667085]">
              <SearchIcon className="w-4 h-4" />
            </div>
            <div className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F8FA] border border-[#E6E8EC] rounded-[6px] text-sm text-[#667085] flex items-center justify-between">
              <span>What do you need help with?</span>
              <span className="text-xs bg-white px-2 py-0.5 rounded-[4px] border border-[#E6E8EC] text-[#172033] font-medium hidden sm:inline">
                Search
              </span>
            </div>
          </div>
        </div>

        {/* Practice area chips */}
        <div>
          <p className="text-xs font-medium text-[#667085] mb-2">
            Suggested Practice Areas
          </p>
          <div className="flex flex-wrap gap-2">
            {practiceAreas.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition-all duration-150 border cursor-pointer ${
                    isSelected
                      ? "bg-[#172033] text-white border-[#172033] shadow-sm"
                      : "bg-[#F7F8FA] text-[#172033] border-[#E6E8EC] hover:bg-white hover:border-[#285A8E]/30"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Match preview result card */}
        <div className="pt-2 border-t border-[#E6E8EC]">
          <div className="p-4 bg-[#F7F8FA] border border-[#E6E8EC] rounded-[8px] space-y-3 transition-colors duration-150 hover:border-[#285A8E]/30">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#172033] text-white flex items-center justify-center font-semibold text-xs tracking-wider flex-shrink-0">
                  EV
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-[#172033]">
                      Elena Vance
                    </span>
                    <CheckCircleIcon className="w-4 h-4 text-[#2F7C78]" />
                  </div>
                  <p className="text-xs text-[#667085]">
                    {selectedTag} • Specialist Counsel
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-medium text-[#2F7C78] bg-[#2F7C78]/10 border border-[#2F7C78]/20 rounded-[4px] whitespace-nowrap">
                Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#667085] pt-1 border-t border-[#E6E8EC]/80">
              <div className="flex items-center gap-1 text-[#2F7C78] font-medium">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>Typically responds in &lt; 2 hrs</span>
              </div>
              <Link
                href="/waitlist"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-[#285A8E] hover:text-[#1e4670] transition-colors"
              >
                <span>View profile &amp; connect</span>
                <ArrowRightIcon className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
