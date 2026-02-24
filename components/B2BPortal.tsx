import { useState } from 'react';
import { Building2, Truck, Droplets, CalendarPlus, CheckCircle2, Factory, ArrowLeft, MapPin } from 'lucide-react';

interface Pickup {
  id: string;
  restaurant: string;
  volume: number;
  date: string;
  status: 'Pending' | 'Assigned' | 'Completed';
  driver?: string;
}

export default function B2BPortal() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  
  // Mock data for restaurant owner
  const [pickups, setPickups] = useState<Pickup[]>([
    { id: '1', restaurant: 'Burger King - Downtown', volume: 50, date: 'Tomorrow, 10:00 AM', status: 'Pending' },
    { id: '2', restaurant: 'Burger King - Downtown', volume: 45, date: 'Today, 08:30 AM', status: 'Completed', driver: 'Mike T.' },
  ]);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
    setTimeout(() => {
      setScheduled(false);
      setIsScheduling(false);
      // Add to mock pickups
      setPickups([{ id: Date.now().toString(), restaurant: 'Burger King - Downtown', volume: 40, date: 'Tomorrow, 09:00 AM', status: 'Pending' }, ...pickups]);
    }, 2000);
  };

  if (isScheduling) {
    return (
      <div className="p-6 h-full flex flex-col bg-white overflow-y-auto pb-24">
        <header className="flex items-center gap-4 mb-6 pt-4">
          <button 
            onClick={() => setIsScheduling(false)} 
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Schedule Pickup</h1>
        </header>

        {scheduled ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup Scheduled!</h2>
            <p className="text-gray-500">Our driver will arrive at the designated time.</p>
          </div>
        ) : (
          <form onSubmit={handleSchedule} className="flex-1 flex flex-col">
            <div className="space-y-5 flex-1">
              <div>
                <label htmlFor="restaurant-name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    id="restaurant-name"
                    required 
                    type="text" 
                    defaultValue="Burger King - Downtown" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">Estimated Volume (Liters)</label>
                <div className="relative">
                  <Droplets size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    id="volume"
                    required 
                    type="number" 
                    min="20" 
                    placeholder="Minimum 20L" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
                <div className="relative">
                  <CalendarPlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    id="pickup-time"
                    required 
                    type="datetime-local" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                  <textarea 
                    id="address"
                    required 
                    rows={3} 
                    placeholder="Full address..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors mt-6 shadow-lg shadow-blue-200">
              Confirm Pickup
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full pb-24 overflow-y-auto">
      <header className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900">Partner Portal</h1>
        <p className="text-sm text-gray-500">Restaurant Dashboard</p>
      </header>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-200">
           <Droplets size={20} className="mb-2 opacity-80" />
           <div className="text-3xl font-bold">2,450<span className="text-lg font-normal opacity-80 ml-1">L</span></div>
           <div className="text-xs font-medium uppercase tracking-wider mt-1 opacity-90">Total Recycled</div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
           <Factory size={20} className="text-gray-400 mb-2" />
           <div className="text-3xl font-bold text-gray-900">1.2<span className="text-lg font-normal text-gray-500 ml-1">k</span></div>
           <div className="text-xs font-medium uppercase tracking-wider mt-1 text-gray-500">Points Earned</div>
        </div>
      </div>

      {/* Action */}
      <button 
        onClick={() => setIsScheduling(true)} 
        className="w-full bg-gray-900 text-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors shadow-md"
        aria-label="Schedule a bulk oil pickup for volumes greater than 20 liters"
      >
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Truck size={24} className="text-blue-400" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg">Schedule Bulk Pickup</div>
              <div className="text-sm text-gray-400">For volumes &gt; 20 Liters</div>
            </div>
         </div>
         <CalendarPlus size={20} className="text-gray-400" />
      </button>

      {/* Upcoming Pickups */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Pickups</h2>
          <button 
            className="text-sm text-blue-600 font-medium"
            aria-label="View all pickup history"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {pickups.map(pickup => (
            <div key={pickup.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pickup.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {pickup.status === 'Completed' ? <CheckCircle2 size={20} /> : <Building2 size={20} />}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{pickup.date}</div>
                  <div className="text-xs text-gray-500">Est. {pickup.volume}L</div>
                </div>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${pickup.status === 'Completed' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`}>
                {pickup.status}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
