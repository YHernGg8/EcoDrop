'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Navigation, LocateFixed } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

interface EcoLocatorProps {
  onBack: () => void;
}

export default function EcoLocator({ onBack }: EcoLocatorProps) {
  const [selectedBin, setSelectedBin] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 3.1390, lng: 101.6869 }); // Default to KL
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [bins, setBins] = useState<any[]>([]);

  // Helper to calculate distance between two points in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Function to generate mock bins around a location
  const generateNearbyBins = useCallback((lat: number, lng: number) => {
    const rawBins = [
      { id: 1, name: 'Community Recycling Hub', status: 'Active', fillLevel: 45, lat: lat + 0.002, lng: lng + 0.003, type: 'eco' as const },
      { id: 2, name: 'Green Point Center', status: 'Active', fillLevel: 80, lat: lat - 0.004, lng: lng + 0.001, type: 'eco' as const },
      { id: 3, name: 'Eco-Collection Station', status: 'Full', fillLevel: 100, lat: lat + 0.005, lng: lng - 0.002, type: 'eco' as const },
      { id: 4, name: 'Neighborhood Eco-Bin', status: 'Active', fillLevel: 20, lat: lat - 0.001, lng: lng - 0.005, type: 'eco' as const },
      { id: 5, name: 'UCO Collection Point', status: 'Active', fillLevel: 30, lat: lat + 0.001, lng: lng - 0.001, type: 'uco' as const },
      { id: 6, name: 'UCO Disposal Hub', status: 'Active', fillLevel: 60, lat: lat - 0.003, lng: lng + 0.004, type: 'uco' as const },
    ];

    const processedBins = rawBins.map(bin => {
      const dist = calculateDistance(lat, lng, bin.lat, bin.lng);
      return {
        ...bin,
        distanceValue: dist,
        distance: dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`
      };
    }).sort((a, b) => a.distanceValue - b.distanceValue);

    setBins(processedBins);
  }, []);

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationAccuracy(accuracy);
        generateNearbyBins(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [generateNearbyBins]);

  // Initialize with default bins
  useEffect(() => {
    const timer = setTimeout(() => {
      generateNearbyBins(3.1390, 101.6869);
      handleLocateUser();
    }, 100);
    return () => clearTimeout(timer);
  }, [generateNearbyBins, handleLocateUser]);

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
        <MapComponent 
          bins={bins} 
          userLocation={userLocation} 
          locationAccuracy={locationAccuracy}
          selectedBin={selectedBin} 
          setSelectedBin={setSelectedBin} 
        />
        
        {/* Locate Me Button */}
        <button 
          onClick={handleLocateUser}
          className={`absolute bottom-64 right-4 p-3 bg-white rounded-full shadow-lg z-[1000] transition-all active:scale-95 ${isLocating ? 'animate-pulse text-blue-500' : 'text-gray-700'}`}
          title="Locate Me"
        >
          <LocateFixed size={24} />
        </button>
      </div>

      {/* Bottom Sheet (Nearby Bins) */}
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[1000] pb-24 absolute bottom-0 left-0 right-0 max-h-[50vh] flex flex-col border-t border-gray-100">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 shrink-0"></div>
        <div className="px-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Nearby Drop-off Points</h2>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{bins.length} locations found</span>
          </div>
          
          <div className="space-y-3 pb-4">
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
