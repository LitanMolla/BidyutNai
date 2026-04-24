'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import ReportSidebar from '@/components/ReportSidebar';
import ReportModal from '@/components/ReportModal';
import ChatWidget from '@/components/ChatWidget';
import { Loader2 } from 'lucide-react';

// Dynamically import map with SSR disabled
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#fbbf24]"></div>
    </div>
  ),
});

export default function Home() {
  const [deviceId, setDeviceId] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ on: 0, off: 0, total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isFetchingGeo, setIsFetchingGeo] = useState(false);
  const [showFollowUpPrompt, setShowFollowUpPrompt] = useState(null);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]); // Dhaka default
  const [mapZoom, setMapZoom] = useState(12);

  // Initialize Zero-Login Identity
  useEffect(() => {
    let id = localStorage.getItem('bidyut_device_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('bidyut_device_id', id);
    }
    setDeviceId(id);
    
    // Fetch initial reports
    fetchReports();
    
    // Set up polling (since we might not have full pusher yet)
    // In a real app we'd subscribe to Pusher here
    const interval = setInterval(fetchReports, 10000); // 10s poll as fallback
    return () => clearInterval(interval);
  }, []);

  // Follow-up prompt logic
  useEffect(() => {
    if (!deviceId || reports.length === 0 || showFollowUpPrompt) return;

    const checkTimer = setTimeout(() => {
      const myOffReports = reports.filter(r => r.creatorDeviceId === deviceId && r.status === 'OFF');
      
      const promptableReport = myOffReports.find(report => {
        // If prompted in the last 2 hours, skip
        const lastPrompted = localStorage.getItem(`prompted_${report._id}`);
        if (lastPrompted && (Date.now() - parseInt(lastPrompted)) < 2 * 60 * 60 * 1000) return false;

        // Check if the report is older than 30 minutes
        const diffMs = Date.now() - new Date(report.createdAt).getTime();
        return diffMs > 30 * 60 * 1000;
      });

      if (promptableReport) {
        setShowFollowUpPrompt(promptableReport);
      }
    }, 5000); // Wait 5 seconds after load to not disrupt initial UX

    return () => clearTimeout(checkTimer);
  }, [reports, deviceId, showFollowUpPrompt]);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports);
        
        // Calculate stats
        const onCount = data.reports.filter(r => r.status === 'ON').length;
        const offCount = data.reports.filter(r => r.status === 'OFF').length;
        setStats({
          on: onCount,
          off: offCount,
          total: data.reports.length
        });
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  const handleSidebarClick = (report) => {
    setMapCenter([report.location.lat, report.location.lng]);
    setMapZoom(16);
  };

  const [userLocation, setUserLocation] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Ask for location immediately on visit
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
          setMapZoom(14);
        },
        (error) => {
          console.warn("Location access denied on load.");
        }
      );
    }
  }, []);

  const handleAutoLocationReport = () => {
    if (!navigator.geolocation) {
      alert("আপনার ব্রাউজার লোকেশন সাপোর্ট করে না");
      return;
    }
    
    setIsFetchingGeo(true);
    
    // Show a small UI or rely on browser prompt
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = { lat: latitude, lng: longitude };
        
        setMapCenter([latitude, longitude]);
        setUserLocation([latitude, longitude]);
        setMapZoom(16);
        setSelectedLocation(latlng);
        setIsModalOpen(true);
        setIsFetchingGeo(false);
      },
      (error) => {
        console.error("Error getting location", error);
        alert("আপনার এলাকার রিপোর্ট দেওয়ার জন্য লোকেশন অ্যাক্সেস দিতে হবে।");
        setIsFetchingGeo(false);
      }
    );
  };

  const handleReportAdded = (newReport) => {
    setReports(prev => [newReport, ...prev]);
    setIsModalOpen(false);
    fetchReports(); // refresh stats
    showToast("রিপোর্ট সফলভাবে জমা হয়েছে!", "success");
  };

  const handleFollowUpResponse = async (isPowerBack) => {
    const report = showFollowUpPrompt;
    setShowFollowUpPrompt(null);
    localStorage.setItem(`prompted_${report._id}`, Date.now().toString());

    if (isPowerBack) {
      try {
        const payload = {
          location: report.location,
          areaName: report.areaName,
          status: 'ON',
          creatorDeviceId: deviceId,
          imageUrl: null,
          startTime: null
        };
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchReports(); 
          showToast("ধন্যবাদ! আপনার আপডেটটি গ্রহণ করা হয়েছে।", "success");
        }
      } catch(err) {
        console.error(err);
      }
    }
  };

  return (
    <main className="flex flex-col h-screen w-full relative">
      <Header stats={stats} />
      
      {toast && (
        <div className={`fixed top-24 right-4 z-[60] font-bold px-6 py-3 rounded-lg animate-in slide-in-from-right-5 fade-in duration-300 ${
          toast.type === 'error' 
            ? 'bg-[#ef4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
            : 'bg-[#22c55e] text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
        }`}>
          {toast.message}
        </div>
      )}

      {isFetchingGeo && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <Loader2 className="w-16 h-16 text-[#c09a59] animate-spin mb-4 drop-shadow-[0_0_10px_rgba(192,154,89,0.5)]" />
          <h2 className="text-xl font-bold text-[#c09a59] mb-2 text-glow">লোকেশন চেক করা হচ্ছে...</h2>
          <p className="text-gray-300 text-sm text-center">সঠিক রিপোর্ট দেওয়ার জন্য জিপিএস লোকেশন নেওয়া হচ্ছে</p>
        </div>
      )}

      {showFollowUpPrompt && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#111] border border-[#c09a59] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center relative overflow-hidden">
             <div className="w-12 h-12 bg-[#c09a59] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c09a59] border-opacity-50">
               <span className="text-2xl">⚡</span>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">ফলো-আপ আপডেট</h3>
             <p className="text-gray-300 text-sm mb-6 leading-relaxed">
               আমরা লক্ষ্য করেছি আপনার রিপোর্ট করা এলাকা <strong className="text-[#fbbf24]">{showFollowUpPrompt.areaName}</strong> -এ বেশ কিছুক্ষণ ধরে বিদ্যুৎ নেই। সেখানে কি এখন বিদ্যুৎ ফিরে এসেছে?
             </p>
             <div className="flex gap-3">
                <button 
                  onClick={() => handleFollowUpResponse(false)} 
                  className="flex-1 py-2.5 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-gray-300 font-medium transition-colors border border-gray-700 hover:border-gray-500"
                >
                  না, আসেনি
                </button>
                <button 
                  onClick={() => handleFollowUpResponse(true)} 
                  className="flex-1 py-2.5 rounded-lg bg-[#22c55e] text-white font-bold hover:bg-[#16a34a] shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all"
                >
                  হ্যাঁ, এসেছে
                </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative">
        {/* Left Side: Map */}
        <div className="w-full h-[55%] md:h-full md:w-[70%] relative z-0">
          <MapComponent 
            reports={reports} 
            center={mapCenter}
            zoom={mapZoom}
            userLocation={userLocation}
          />
        </div>
        
        {/* Right Side: Sidebar */}
        <div className={`w-full transition-all duration-300 ${isSidebarExpanded ? 'absolute inset-0 z-50 h-full bg-[#111] flex flex-col' : 'h-[45%] relative z-10'} md:!static md:!h-full md:w-[30%] border-t md:border-t-0 md:border-l border-[var(--color-dark-glass-border)] glassmorphism`}>
          <ReportSidebar 
            reports={reports} 
            onReportClick={handleSidebarClick} 
            deviceId={deviceId}
            onVote={fetchReports}
            onAddNewReport={handleAutoLocationReport}
            isExpanded={isSidebarExpanded}
            onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          />
        </div>
      </div>

      {isModalOpen && selectedLocation && (
        <ReportModal 
          location={selectedLocation} 
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={handleReportAdded}
          deviceId={deviceId}
          showToast={showToast}
        />
      )}
      
      <ChatWidget deviceId={deviceId} />
    </main>
  );
}
