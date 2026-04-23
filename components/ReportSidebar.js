'use client';
import { ThumbsUp, ThumbsDown, ShieldCheck, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ReportSidebar({ reports, onReportClick, deviceId, onVote }) {
  
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
      <div className="p-4 border-b border-[var(--color-dark-glass-border)]">
        <h2 className="text-xl font-bold text-[#c09a59] text-glow">Live Reports</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {reports.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No reports yet</div>
        ) : (
          reports.map(report => {
            const isOwner = report.creatorDeviceId === deviceId;
            const hasVoted = report.votedBy?.includes(deviceId);
            const score = (report.votes?.trueCount || 0) - (report.votes?.falseCount || 0);
            
            const isVerified = report.imageUrl || score >= 5;
            const isBlurred = score <= -5;

            return (
              <div 
                key={report._id}
                onClick={() => onReportClick(report)}
                className={`relative p-4 rounded-xl transition-all cursor-pointer border border-[#c09a59] border-opacity-10 bg-white bg-opacity-5 hover:bg-opacity-10
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
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${report.status === 'ON' ? 'bg-[#fbbf24] text-black' : 'bg-[#ef4444] text-white'}`}>
                    {report.status}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {report.status === 'OFF' && report.duration && (
                  <div className="text-xs text-gray-300 mb-2">
                    Duration: {report.duration} mins
                  </div>
                )}
                
                {report.imageUrl && (
                  <div className="w-full h-20 mb-3 rounded-lg overflow-hidden border border-gray-700">
                    <img src={report.imageUrl} alt="Proof" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <div className="text-xs text-gray-400">
                    Community Verification
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
          })
        )}
      </div>
    </div>
  );
}
