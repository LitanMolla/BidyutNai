'use client';
import { Zap, AlertTriangle, Activity } from 'lucide-react';

export default function Header({ stats, onReportClick }) {
  return (
    <header className="w-full h-20 glassmorphism relative z-20 flex items-center justify-between px-6 border-b border-[var(--color-dark-glass-border)]">
      <div className="flex items-center gap-3">
        <div className="bg-[#c09a59] p-2 rounded-lg bg-opacity-20 border border-[#c09a59] border-opacity-30">
          <Zap className="text-[#fbbf24] w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white text-glow">
          Bidyut Geche?
        </h1>
      </div>

      <div className="flex gap-4">
        {/* Active Power */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 box-glow">
          <div className="w-3 h-3 rounded-full bg-[#fbbf24] animate-pulse"></div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Power Active</div>
            <div className="text-lg font-bold text-[#fbbf24]">{stats.on}</div>
          </div>
        </div>

        {/* Power Off */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Power Off</div>
            <div className="text-lg font-bold text-[#ef4444]">{stats.off}</div>
          </div>
        </div>

        {/* Total Reports */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 hidden md:flex">
          <Activity className="w-5 h-5 text-white opacity-50" />
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Total Reports</div>
            <div className="text-lg font-bold text-white">{stats.total}</div>
          </div>
        </div>

        {/* Report Button */}
        <button 
          onClick={onReportClick}
          className="ml-2 flex items-center gap-2 px-5 py-2 rounded-xl bg-[#c09a59] text-black font-bold hover:bg-[#fbbf24] transition-all box-glow"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="hidden sm:inline">Report Outage</span>
        </button>
      </div>
    </header>
  );
}
