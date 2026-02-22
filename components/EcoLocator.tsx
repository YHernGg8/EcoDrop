import { ArrowLeft, MapPin, Navigation } from 'lucide-react';

interface EcoLocatorProps {
  onBack: () => void;
}

export default function EcoLocator({ onBack }: EcoLocatorProps) {
  // Mock data for bins
  const bins = [
    { id: 1, name: 'Central Park UCO Bin', distance: '0.8 km', status: 'Active', fillLevel: 45 },
    { id: 2, name: 'Downtown Community Center', distance: '1.2 km', status: 'Active', fillLevel: 80 },
    { id: 3, name: 'Westside Supermarket', distance: '2.5 km', status: 'Full', fillLevel: 100 },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Eco-Locator</h1>
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 relative bg-blue-50 overflow-hidden">
        {/* Decorative Map Background (Simulated) */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Simulated User Location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10"></div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
        </div>

        {/* Simulated Bin Markers */}
        <div className="absolute top-1/3 left-1/4">
          <MapPin size={32} className="text-green-600 drop-shadow-md" fill="white" />
        </div>
        <div className="absolute bottom-1/3 right-1/4">
          <MapPin size={32} className="text-green-600 drop-shadow-md" fill="white" />
        </div>
        <div className="absolute top-1/4 right-1/3">
          <MapPin size={32} className="text-red-500 drop-shadow-md" fill="white" />
        </div>
      </div>

      {/* Bottom Sheet (Nearby Bins) */}
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 pb-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3"></div>
        <div className="px-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Nearby Drop-off Points</h2>
          
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pb-4">
            {bins.map((bin) => (
              <div key={bin.id} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-green-200 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-900">{bin.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{bin.distance}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      bin.fillLevel >= 90 ? 'bg-red-50 text-red-600' :
                      bin.fillLevel >= 70 ? 'bg-yellow-50 text-yellow-600' :
                      'bg-green-50 text-green-600'
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
