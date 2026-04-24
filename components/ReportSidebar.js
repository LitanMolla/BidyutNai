'use client';
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, ShieldCheck, Clock, Maximize2, Minimize2 } from 'lucide-react';
// Removed date-fns usage for exact BD time

export default function ReportSidebar({ reports, onReportClick, deviceId, onVote, onAddNewReport, isExpanded, onToggleExpand }) {
  const [filter, setFilter] = useState('all');
  
  const formatBDTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('bn-BD', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return '';
    }
  };

  const handleVote = async (reportId, voteType, e) => {
    e.stopPropagation();
    
    try {
      const res = await fetch(`/api/reports/${reportId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, voteType })
      });
      if (res.ok) {
        onVote(); // Trigger refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-[var(--color-dark-glass-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#c09a59] text-glow">লাইভ রিপোর্টস</h2>
          <button 
            onClick={onToggleExpand} 
            className="md:hidden p-1.5 rounded-md bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white transition-colors"
            title={isExpanded ? "ছোট করুন" : "বড় করুন"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
        <button 
          onClick={onAddNewReport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c09a59] hover:bg-[#fbbf24] text-black text-xs sm:text-sm font-bold rounded-lg transition-all box-glow shrink-0"
          title="নতুন রিপোর্ট যোগ করুন"
        >
          <span className="text-lg leading-none">+</span>
          <span className="flex flex-col items-start leading-tight">
            <span>নতুন রিপোর্ট দিন</span>
          </span>
        </button>
      </div>

      <div className="flex border-b border-[var(--color-dark-glass-border)] bg-[#161616]">
        <button 
          className={`flex-1 py-2 text-sm font-bold transition-colors ${filter === 'all' ? 'text-[#c09a59] border-b-2 border-[#c09a59]' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          সব রিপোর্ট
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-bold transition-colors ${filter === 'my' ? 'text-[#c09a59] border-b-2 border-[#c09a59]' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setFilter('my')}
        >
          আমার রিপোর্ট
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(() => {
          const filteredReports = filter === 'all' ? reports : reports.filter(r => r.creatorDeviceId === deviceId);
          if (filteredReports.length === 0) {
            return <div className="text-center text-gray-500 mt-10">এখনো কোনো রিপোর্ট নেই</div>;
          }
          return filteredReports.map(report => {
            const isOwner = report.creatorDeviceId === deviceId;
            const hasVoted = report.votedBy?.includes(deviceId);
            const score = (report.votes?.trueCount || 0) - (report.votes?.falseCount || 0);
            
            const isVerified = report.imageUrl || score >= 5;
            const isBlurred = score <= -5;

            return (
              <div 
                key={report._id}
                onClick={() => onReportClick(report)}
                className={`relative p-4 rounded-xl transition-all cursor-pointer border border-[#c09a59] border-opacity-10 bg-[#1a1a1a] hover:bg-[#222]
                  ${isBlurred ? 'blur-[3px] opacity-60 hover:blur-none hover:opacity-100' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white">{report.areaName}</h3>
                  {isVerified && (
                    <ShieldCheck className="w-5 h-5 text-[#fbbf24] drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${report.status === 'ON' ? 'bg-[#22c55e] text-white' : 'bg-[#ef4444] text-white'}`}>
                    {report.status === 'ON' ? 'বিদ্যুৎ আছে' : 'বিদ্যুৎ নেই'}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatBDTime(report.createdAt)}
                  </span>
                </div>

                {report.status === 'OFF' && report.duration && (
                  <div className="text-xs text-gray-300 mb-2">
                    সময়কাল: {report.duration} মিনিট
                  </div>
                )}
                
                {report.imageUrl && (
                  <div className="w-full h-20 mb-3 rounded-lg overflow-hidden border border-gray-700">
                    <img src={report.imageUrl} alt="Proof" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <div className="text-xs text-gray-400">
                    ইউজার ভেরিফিকেশন
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => handleVote(report._id, 'true', e)}
                      disabled={isOwner || hasVoted}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        (isOwner || hasVoted) ? 'opacity-50 cursor-not-allowed text-gray-500' : 'text-gray-400 hover:text-[#fbbf24]'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" /> {report.votes?.trueCount || 0}
                    </button>
                    <button 
                      onClick={(e) => handleVote(report._id, 'false', e)}
                      disabled={isOwner || hasVoted}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        (isOwner || hasVoted) ? 'opacity-50 cursor-not-allowed text-gray-500' : 'text-gray-400 hover:text-[#ef4444]'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" /> {report.votes?.falseCount || 0}
                    </button>
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
