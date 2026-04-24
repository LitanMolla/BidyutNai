'use client';
import { Zap, AlertTriangle, Activity } from 'lucide-react';

export default function Header({ stats }) {
  return (
    <header className="w-full h-[4rem] sm:h-[4.5rem] md:min-h-[5rem] glassmorphism relative z-20 flex flex-row items-center px-3 sm:px-4 md:px-6 gap-3 border-b border-[var(--color-dark-glass-border)] overflow-x-auto scrollbar-hide">
      <div className="flex items-center shrink-0">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white text-glow">
          বিদ্যুৎ নাই?
        </h1>
      </div>

      <div className="flex gap-2 md:gap-4 items-center ml-auto shrink-0">
        {/* Active Power */}
        <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-[#1a1a1a] border border-gray-800 box-glow shrink-0">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]"></div>
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider hidden sm:block">বিদ্যুৎ আছে</div>
            <div className="text-sm md:text-lg font-bold text-[#22c55e]">{stats.on} <span className="sm:hidden text-[10px] text-gray-400 uppercase">আছে</span></div>
          </div>
        </div>

        {/* Power Off */}
        <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-[#1a1a1a] border border-gray-800 shrink-0">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ef4444]"></div>
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider hidden sm:block">বিদ্যুৎ নেই</div>
            <div className="text-sm md:text-lg font-bold text-[#ef4444]">{stats.off} <span className="sm:hidden text-[10px] text-gray-400 uppercase">নেই</span></div>
          </div>
        </div>

        {/* Total Reports */}
        <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-[#1a1a1a] border border-gray-800 shrink-0">
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-white opacity-50" />
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider hidden sm:block">মোট রিপোর্ট</div>
            <div className="text-sm md:text-lg font-bold text-white">{stats.total} <span className="sm:hidden text-[10px] text-gray-400 uppercase">মোট</span></div>
          </div>
        </div>
      </div>
    </header>
  );
}
