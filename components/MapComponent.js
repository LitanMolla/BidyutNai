'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
// Removed date-fns for exact BD time

const createIcon = (status) => {
  const color = status === 'ON' ? '#22c55e' : '#ef4444';
  
  return L.divIcon({
    className: 'custom-dot-marker',
    html: `<div style="width: 14px; height: 14px; background-color: ${color}; border: 2px solid #000; border-radius: 50%; box-shadow: 0 0 10px ${color}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7],
  });
};

function MapUpdater({ center, zoom }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ reports, onMapClick, center, zoom, userLocation }) {
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        <MapUpdater center={center} zoom={zoom} />

        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `<div style="width: 20px; height: 20px; background-color: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8), 0 0 0 4px rgba(59, 130, 246, 0.3);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup className="glass-popup">আপনি এখানে আছেন</Popup>
          </Marker>
        )}
        
        {reports.map((report) => (
          <Marker 
            key={report._id} 
            position={[report.location.lat, report.location.lng]}
            icon={createIcon(report.status)}
          >
            <Popup className="glass-popup">
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1">{report.areaName}</h3>
                <div className="flex gap-2 items-center mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${report.status === 'ON' ? 'bg-[#22c55e] text-white' : 'bg-[#ef4444] text-white'}`}>
                    {report.status === 'ON' ? 'বিদ্যুৎ আছে' : 'বিদ্যুৎ নেই'}
                  </span>
                  {report.status === 'OFF' && report.startTime && (
                    <span className="text-gray-300 text-xs text-glow">
                      {formatBDTime(report.startTime)} থেকে
                    </span>
                  )}
                </div>
                {report.imageUrl && (
                  <img src={report.imageUrl} alt="Proof" className="w-full h-32 object-cover rounded-md mt-2" />
                )}
                <div className="mt-2 text-xs flex justify-between items-center text-gray-400">
                  <span>👍 {report.votes?.trueCount || 0}</span>
                  <span>👎 {report.votes?.falseCount || 0}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
