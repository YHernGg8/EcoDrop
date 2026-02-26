'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Bin {
  id: number;
  name: string;
  distance: string;
  status: string;
  fillLevel: number;
  lat: number;
  lng: number;
  type?: 'eco' | 'uco';
}

interface MapComponentProps {
  bins: Bin[];
  userLocation: { lat: number; lng: number };
  locationAccuracy: number | null;
  selectedBin: number | null;
  setSelectedBin: (id: number) => void;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapComponent({ bins, userLocation, locationAccuracy, selectedBin, setSelectedBin }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const createIcon = (fillLevel: number, type?: 'eco' | 'uco') => {
    const color = type === 'uco' ? '#f97316' : (fillLevel >= 90 ? '#ef4444' : fillLevel >= 70 ? '#eab308' : '#16a34a');
    
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">${type === 'uco' ? 'U' : ''}</div>`,
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

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <MapContainer 
      center={[userLocation.lat, userLocation.lng]} 
      zoom={14} 
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <ChangeView center={[userLocation.lat, userLocation.lng]} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="topright" />
      
      {/* Accuracy Circle */}
      {locationAccuracy && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={locationAccuracy}
          pathOptions={{
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            color: '#3b82f6',
            weight: 1,
            dashArray: '5, 5'
          }}
        />
      )}

      {/* User Location */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <p className="font-semibold">You are here</p>
            {locationAccuracy && (
              <p className="text-xs text-gray-500 mt-1">
                Accuracy: ±{Math.round(locationAccuracy)}m
              </p>
            )}
          </div>
        </Popup>
      </Marker>

      {/* Bins with Clustering */}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
      >
        {bins.map((bin: Bin) => {
          const icon = createIcon(bin.fillLevel, bin.type);
          
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
                <div className="text-sm text-gray-600">
                  {bin.type === 'uco' ? 'Used Cooking Oil' : 'Eco-Bin'}
                </div>
                <div className="text-sm text-gray-600">{bin.fillLevel}% Full</div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
