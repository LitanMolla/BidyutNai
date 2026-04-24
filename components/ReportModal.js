'use client';

import { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, MapPin, Loader2 } from 'lucide-react';

export default function ReportModal({ location, onClose, onSubmitSuccess, deviceId, showToast }) {
  const [status, setStatus] = useState('OFF');
  const [areaName, setAreaName] = useState('');
  const getLocalDatetimePattern = () => {
    const now = new Date();
    // Adjust by local time zone offset to get local string correctly
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localTime = new Date(now.getTime() - offsetMs);
    return localTime.toISOString().slice(0, 16);
  };

  const [startTime, setStartTime] = useState(getLocalDatetimePattern());
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fetch area name based on location
  useEffect(() => {
    if (location && location.lat && location.lng) {
      setIsFetchingLocation(true);
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            // Simplify location name to first few parts
            const parts = data.display_name.split(',');
            setAreaName(parts.slice(0, 3).join(', ').trim());
          }
        })
        .catch(err => console.error("Reverse geocoding failed", err))
        .finally(() => setIsFetchingLocation(false));
    }
  }, [location]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        if (showToast) showToast('Image must be less than 5MB (ছবি ৫ মেগাবাইটের কম হতে হবে)', 'error');
        return;
      }
      setImageFile(file);
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const API_KEY = '2d8c1e752f830dc0e7fcdc4a5fc38e05';
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location,
          areaName,
          status,
          startTime: status === 'OFF' && startTime ? new Date(startTime).toISOString() : null,
          imageUrl,
          creatorDeviceId: deviceId
        })
      });

      if (res.ok) {
        const data = await res.json();
        onSubmitSuccess(data.report);
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-5 md:p-6 relative rounded-2xl glassmorphism border border-[#c09a59] border-opacity-30 flex-shrink-0">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-glow">বিদ্যুৎ অবস্হা জানান</h2>

        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-300">
            <Loader2 className="w-16 h-16 text-[#c09a59] animate-spin drop-shadow-[0_0_10px_rgba(192,154,89,0.6)]" />
            <p className="text-[#c09a59] font-bold animate-pulse text-xl mt-4">রিপোর্ট জমা দেওয়া হচ্ছে...</p>
            <p className="text-sm text-gray-400 text-center px-4">দয়া করে একটু অপেক্ষা করুন, সার্ভারে ডাটা আপলোড হচ্ছে।</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center justify-between">
                <span>এলাকা / জায়গার নাম *</span>
                {isFetchingLocation && <span className="text-xs text-[#fbbf24] animate-pulse">চেক করা হচ্ছে...</span>}
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="উদাহরন: মিরপুর ১০, ধানমন্ডি..."
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#c09a59] transition-colors"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                />
                <MapPin className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">বর্তমান অবস্থা</label>
              <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded-lg border border-gray-700">
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md font-bold transition-all ${
                    status === 'ON' 
                      ? 'bg-[#22c55e] text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setStatus('ON')}
                >
                  <span>বিদ্যুৎ আছে</span>
                </button>
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md font-bold transition-all ${
                    status === 'OFF' 
                      ? 'bg-[#ef4444] text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setStatus('OFF')}
                >
                  <span>বিদ্যুৎ নেই</span>
                </button>
              </div>
            </div>

            {status === 'OFF' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-300 mb-1">কখন বিদ্যুৎ গেছে</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">ছবি - ঐচ্ছিক</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-[#1a1a1a] hover:bg-[#222] transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  {imageFile ? (
                    <div className="flex flex-col items-center gap-1 text-[#22c55e]">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="text-xs max-w-[200px] truncate">{imageFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-400">ছবি আপলোড করতে ক্লিক করুন (সর্বোচ্চ ৫ মেগাবাইট)</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 mt-4 flex flex-col items-center justify-center bg-[#c09a59] hover:bg-[#e0b467] text-black font-bold rounded-lg transition-all box-glow disabled:opacity-50"
            >
              <span>রিপোর্ট জমা দিন</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
