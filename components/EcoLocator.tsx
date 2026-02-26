import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Navigation, LocateFixed, CheckCircle2, Camera, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/hooks/useLanguage';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

interface EcoLocatorProps {
  onBack: () => void;
  pendingPoints: number;
  onVerify: (points: number) => void;
}

type VerificationStep = 'idle' | 'verifying_location' | 'camera_proof' | 'success';

export default function EcoLocator({ onBack, pendingPoints, onVerify }: EcoLocatorProps) {
  const { t } = useLanguage();
  const [selectedBin, setSelectedBin] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 3.1390, lng: 101.6869 }); // Default to KL
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [bins, setBins] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'eco' | 'uco'>('all');
  
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('idle');
  const [isVerifying, setIsVerifying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // ... (calculateDistance and generateNearbyBins remain the same)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [generateNearbyBins]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateNearbyBins(3.1390, 101.6869);
      handleLocateUser();
    }, 100);
    return () => clearTimeout(timer);
  }, [generateNearbyBins, handleLocateUser]);

  const startVerification = () => {
    setVerificationStep('verifying_location');
    setIsVerifying(true);
    
    // Simulate Geofencing Check
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep('camera_proof');
    }, 2000);
  };

  const captureProof = () => {
    setIsVerifying(true);
    // Simulate photo capture and AI validation
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep('success');
    }, 1500);
  };

  const handleFinish = () => {
    onVerify(pendingPoints);
  };

  const selectedBinData = bins.find(b => b.id === selectedBin);

  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || bin.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-md px-4 py-4 flex flex-col gap-3 shadow-sm z-[1000]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{t.locator.title}</h1>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder={t.locator.search} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-green-500 transition-all"
            />
            <Navigation size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-gray-100 border-none rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-green-500"
          >
            <option value="all">{t.locator.allBins}</option>
            <option value="eco">{t.locator.ecoBins}</option>
            <option value="uco">{t.locator.ucoBins}</option>
          </select>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-blue-50 z-0">
        <MapComponent 
          bins={filteredBins} 
          userLocation={userLocation} 
          locationAccuracy={locationAccuracy}
          selectedBin={selectedBin} 
          setSelectedBin={setSelectedBin} 
        />
        
        <button 
          onClick={handleLocateUser}
          className={`absolute bottom-64 right-4 p-3 bg-white rounded-full shadow-lg z-[1000] transition-all active:scale-95 ${isLocating ? 'animate-pulse text-blue-500' : 'text-gray-700'}`}
        >
          <LocateFixed size={24} />
        </button>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {verificationStep === 'idle' ? (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[1000] pb-24 absolute bottom-0 left-0 right-0 max-h-[50vh] flex flex-col border-t border-gray-100"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 shrink-0"></div>
            <div className="px-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">{t.locator.nearby}</h2>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{filteredBins.length} {t.locator.locations}</span>
              </div>
              
              <div className="space-y-3 pb-4">
                {filteredBins.length > 0 ? (
                  filteredBins.map((bin) => (
                    <div 
                      key={bin.id} 
                      onClick={() => setSelectedBin(bin.id)}
                      className={`border rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer ${
                        selectedBin === bin.id ? 'border-green-500 bg-green-50 ring-2 ring-green-100' : 'border-gray-100 hover:border-green-200'
                      }`}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{bin.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">{bin.distance}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            bin.fillLevel >= 90 ? 'bg-red-100 text-red-700' :
                            bin.fillLevel >= 70 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {bin.fillLevel}% {t.locator.full}
                          </span>
                        </div>
                      </div>
                      
                      {selectedBin === bin.id && pendingPoints > 0 ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); startVerification(); }}
                          className="bg-green-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-2"
                        >
                          <ShieldCheck size={16} />
                          {t.locator.verifyDropoff}
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                          <Navigation size={18} />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-gray-900 font-bold">{t.locator.noResults}</h3>
                    <p className="text-gray-500 text-sm max-w-[200px] mt-1">
                      {t.locator.noResults} &quot;{searchQuery}&quot;
                    </p>
                    <button 
                      onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                      className="mt-4 text-green-600 font-bold text-sm hover:underline"
                    >
                      {t.locator.clearFilters}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 z-[2000] flex flex-col items-center justify-center p-6 text-white text-center"
          >
            {verificationStep === 'verifying_location' && (
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center">
                    <LocateFixed size={48} className="text-blue-400 animate-pulse" />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-4 border-blue-500 rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t.locator.geofencing}</h2>
                <p className="text-gray-400 max-w-xs">{t.locator.verifyingDist.replace('{name}', selectedBinData?.name)}</p>
                <div className="mt-8 flex items-center gap-2 text-blue-400 text-sm font-medium">
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t.locator.gpsData}</span>
                </div>
              </div>
            )}

            {verificationStep === 'camera_proof' && (
              <div className="w-full max-w-sm flex flex-col items-center">
                <div className="w-full aspect-[3/4] bg-gray-800 rounded-3xl mb-8 relative overflow-hidden border-2 border-white/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <Camera size={64} className="text-white/20 mb-4" />
                    <p className="text-sm text-white/40 font-medium">{t.locator.actionProof}</p>
                  </div>
                  
                  {/* Simulated Camera Overlay */}
                  <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none" />
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-red-500 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    REC 00:00:04
                  </div>
                  
                  {isVerifying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                      <Loader2 size={48} className="text-green-500 animate-spin mb-4" />
                      <p className="text-green-500 font-bold">{t.locator.validating}</p>
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mb-2">{t.locator.actionProof}</h2>
                <p className="text-gray-400 mb-8">{t.locator.actionProofDesc}</p>
                
                <button 
                  onClick={captureProof}
                  disabled={isVerifying}
                  className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-xl"
                >
                  <Camera size={24} />
                  {t.locator.captureVerify}
                </button>
                
                <button 
                  onClick={() => setVerificationStep('idle')}
                  className="mt-6 text-white/50 font-bold text-sm uppercase tracking-widest"
                >
                  {t.common.cancel}
                </button>
              </div>
            )}

            {verificationStep === 'success' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2">{t.locator.pointsUnlocked}</h2>
                <p className="text-green-400 font-bold text-lg mb-6">+{pendingPoints} {t.common.points}</p>
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 mb-10 max-w-xs">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {t.locator.successDesc}
                  </p>
                </div>
                <button 
                  onClick={handleFinish}
                  className="w-full max-w-xs bg-green-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-900/20 active:scale-95 transition-transform"
                >
                  {t.locator.returnDashboard}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
