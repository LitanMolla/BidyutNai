'use client';
import { Zap, AlertTriangle, Activity } from 'lucide-react';

export default function Header({ stats, onReportClick }) {
  return (
    <header className="w-full h-auto min-h-[5rem] py-3 md:py-0 glassmorphism relative z-20 flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 gap-3 border-b border-[var(--color-dark-glass-border)]">
      <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-[#c09a59] p-1.5 md:p-2 rounded-lg bg-opacity-20 border border-[#c09a59] border-opacity-30">
            <Zap className="text-[#fbbf24] w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white text-glow shrink-0">
            Bidyut Geche?
          </h1>
        </div>
        
        {/* Mobile Report Button (shown only on very small screens inline with logo) */}
        <button 
          onClick={onReportClick}
          className="sm:hidden ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#c09a59] text-black text-sm font-bold hover:bg-[#fbbf24] transition-all box-glow"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>

      <div className="flex gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        {/* Active Power */}
        <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 box-glow shrink-0">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#fbbf24] animate-pulse"></div>
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider hidden sm:block">Power Active</div>
            <div className="text-sm md:text-lg font-bold text-[#fbbf24]">{stats.on} <span className="sm:hidden text-[10px] text-gray-400 uppercase">ON</span></div>
          </div>
        </div>

        {/* Power Off */}
        <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 shrink-0">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ef4444]"></div>
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider hidden sm:block">Power Off</div>
            <div className="text-sm md:text-lg font-bold text-[#ef4444]">{stats.off} <span className="sm:hidden text-[10px] text-gray-400 uppercase">OFF</span></div>
          </div>
        </div>

        {/* Total Reports */}
        <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 shrink-0">
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-white opacity-50" />
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider hidden sm:block">Total Reports</div>
            <div className="text-sm md:text-lg font-bold text-white">{stats.total} <span className="sm:hidden text-[10px] text-gray-400 uppercase">Total</span></div>
          </div>
        </div>

        {/* Desktop Report Button */}
        <button 
          onClick={onReportClick}
          className="hidden sm:flex ml-2 items-center gap-2 px-4 py-2 rounded-xl bg-[#c09a59] text-black font-bold hover:bg-[#fbbf24] transition-all box-glow shrink-0"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="hidden md:inline">Report Outage</span>
          <span className="inline md:hidden">Report</span>
        </button>
      </div>
    </header>
  );
}
