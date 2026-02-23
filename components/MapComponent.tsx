'use client';

import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

interface Bin {
  id: number;
  name: string;
  distance: string;
  status: string;
  fillLevel: number;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  bins: Bin[];
  userLocation: { lat: number; lng: number };
  selectedBin: number | null;
  setSelectedBin: (id: number) => void;
}

export default function MapComponent({ bins, userLocation, selectedBin, setSelectedBin }: MapComponentProps) {
  const createIcon = (fillLevel: number) => {
    const color = fillLevel >= 90 ? '#ef4444' : fillLevel >= 70 ? '#eab308' : '#16a34a';
    
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const getUserIcon = () => {
    return L.divIcon({
      className: 'user-leaflet-icon',
      html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  const userIcon = getUserIcon();

  return (
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
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Bins */}
      {bins.map((bin) => {
        const icon = createIcon(bin.fillLevel);
        
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
  );
}
