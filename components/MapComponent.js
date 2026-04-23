'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { formatDistanceToNow } from 'date-fns';

const createIcon = (status) => {
  const color = status === 'ON' ? '#fbbf24' : '#ef4444';
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#000"></circle>
    </svg>
  `;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width: 32px; height: 32px; filter: drop-shadow(0 0 8px ${color});">${svgIcon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function ClickHandler() {
  useMapEvents({
    click: (e) => {
      alert("You can only report for your current location. Please use the 'Report Outage' button at the top.");
    },
  });
  return null;
}

function MapUpdater({ center, zoom }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ reports, onMapClick, center, zoom }) {
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
        <ClickHandler onMapClick={onMapClick} />
        <MapUpdater center={center} zoom={zoom} />
        
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
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${report.status === 'ON' ? 'bg-[#fbbf24] text-black' : 'bg-[#ef4444] text-white'}`}>
                    Power {report.status}
                  </span>
                  {report.status === 'OFF' && report.startTime && (
                    <span className="text-gray-300 text-xs text-glow">
                      Since {formatDistanceToNow(new Date(report.startTime), { addSuffix: true })}
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
