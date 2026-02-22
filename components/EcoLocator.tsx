'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import MapContainer to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

import 'leaflet/dist/leaflet.css';

interface EcoLocatorProps {
  onBack: () => void;
}

export default function EcoLocator({ onBack }: EcoLocatorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedBin, setSelectedBin] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mock data for bins with coordinates
  const bins = [
    { id: 1, name: 'Central Park UCO Bin', distance: '0.8 km', status: 'Active', fillLevel: 45, lat: 40.7812, lng: -73.9665 },
    { id: 2, name: 'Downtown Community Center', distance: '1.2 km', status: 'Active', fillLevel: 80, lat: 40.7750, lng: -73.9700 },
    { id: 3, name: 'Westside Supermarket', distance: '2.5 km', status: 'Full', fillLevel: 100, lat: 40.7850, lng: -73.9800 },
  ];

  const userLocation = { lat: 40.7800, lng: -73.9700 };

  // Custom icon setup for Leaflet using L.divIcon
  const createIcon = (fillLevel: number) => {
    if (typeof window === 'undefined') return null;
    const L = require('leaflet');
    const color = fillLevel >= 90 ? '#ef4444' : fillLevel >= 70 ? '#eab308' : '#16a34a';
    
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const userIcon = typeof window !== 'undefined' ? require('leaflet').divIcon({
    className: 'user-leaflet-icon',
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  }) : null;

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-md px-4 py-4 flex items-center gap-4 shadow-sm z-[1000]">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Eco-Locator</h1>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-blue-50 z-0">
        {isMounted && (
          <MapContainer 
            center={[userLocation.lat, userLocation.lng]} 
            zoom={14} 
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="topright" />
            
            {/* User Location */}
            {userIcon && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {/* Bins */}
            {bins.map((bin) => {
              const icon = createIcon(bin.fillLevel);
              if (!icon) return null;
              
              return (
                <Marker 
                  key={bin.id} 
                  position={[bin.lat, bin.lng]} 
                  icon={icon}
                  eventHandlers={{
                    click: () => setSelectedBin(bin.id),
                  }}
                >
                  <Popup>
                    <div className="font-semibold">{bin.name}</div>
                    <div className="text-sm text-gray-600">{bin.fillLevel}% Full</div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Bottom Sheet (Nearby Bins) */}
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[1000] pb-6 absolute bottom-0 left-0 right-0 max-h-[50vh] flex flex-col">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 shrink-0"></div>
        <div className="px-6 flex-1 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Nearby Drop-off Points</h2>
          
          <div className="space-y-4 pb-4">
            {bins.map((bin) => (
              <div 
                key={bin.id} 
                onClick={() => setSelectedBin(bin.id)}
                className={`border rounded-2xl p-4 flex items-center justify-between transition-colors cursor-pointer ${
                  selectedBin === bin.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200'
                }`}
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{bin.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{bin.distance}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      bin.fillLevel >= 90 ? 'bg-red-100 text-red-700' :
                      bin.fillLevel >= 70 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {bin.fillLevel}% Full
                    </span>
                  </div>
                </div>
                <button 
                  disabled={bin.fillLevel >= 100}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    bin.fillLevel >= 100 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <Navigation size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
