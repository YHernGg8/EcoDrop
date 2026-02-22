import { useState } from 'react';
import { Building2, Truck, Droplets, CalendarPlus, CheckCircle2, Factory, ArrowLeft, MapPin, Users, UserCircle, ChevronRight } from 'lucide-react';

type B2BRole = 'restaurant' | 'fleet' | null;

interface Pickup {
  id: string;
  restaurant: string;
  volume: number;
  date: string;
  status: 'Pending' | 'Assigned' | 'Completed';
  driver?: string;
}

export default function B2BPortal() {
  const [role, setRole] = useState<B2BRole>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  
  // Mock data for fleet manager
  const [pickups, setPickups] = useState<Pickup[]>([
    { id: '1', restaurant: 'Burger King - Downtown', volume: 50, date: 'Tomorrow, 10:00 AM', status: 'Pending' },
    { id: '2', restaurant: 'KFC - Westside', volume: 45, date: 'Today, 08:30 AM', status: 'Completed', driver: 'Mike T.' },
    { id: '3', restaurant: 'Pizza Hut - North', volume: 30, date: 'Today, 02:00 PM', status: 'Assigned', driver: 'Sarah J.' },
  ]);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
    setTimeout(() => {
      setScheduled(false);
      setIsScheduling(false);
      // Add to mock pickups
      setPickups([{ id: Date.now().toString(), restaurant: 'My Restaurant', volume: 40, date: 'Tomorrow, 09:00 AM', status: 'Pending' }, ...pickups]);
    }, 2000);
  };

  const assignDriver = (id: string) => {
    setPickups(pickups.map(p => p.id === id ? { ...p, status: 'Assigned', driver: 'New Driver' } : p));
  };

  if (!role) {
    return (
      <div className="p-6 h-full flex flex-col bg-gray-50 items-center justify-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Building2 size={32} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">B2B Portal Login</h1>
        <p className="text-gray-500 mb-8 text-center">Select your role to access the commercial dashboard.</p>
        
        <div className="w-full space-y-4">
          <button 
            onClick={() => setRole('restaurant')}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-between hover:border-blue-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                <Building2 size={24} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Restaurant Owner</div>
                <div className="text-sm text-gray-500">Schedule pickups & track volume</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button 
            onClick={() => setRole('fleet')}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-between hover:border-blue-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Truck size={24} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Fleet Manager</div>
                <div className="text-sm text-gray-500">Manage logistics & drivers</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    );
  }

  if (role === 'fleet') {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-full pb-24 overflow-y-auto">
        <header className="pt-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h1>
            <p className="text-sm text-gray-500">Logistics & Driver Management</p>
          </div>
          <button onClick={() => setRole(null)} className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full">
            Logout
          </button>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-lg">
             <Truck size={20} className="mb-2 opacity-80 text-blue-400" />
             <div className="text-3xl font-bold">{pickups.filter(p => p.status !== 'Completed').length}</div>
             <div className="text-xs font-medium uppercase tracking-wider mt-1 opacity-90">Active Pickups</div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
             <Users size={20} className="text-gray-400 mb-2" />
             <div className="text-3xl font-bold text-gray-900">12</div>
             <div className="text-xs font-medium uppercase tracking-wider mt-1 text-gray-500">Drivers Online</div>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">All Scheduled Pickups</h2>
          <div className="space-y-3">
            {pickups.map(pickup => (
              <div key={pickup.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{pickup.restaurant}</div>
                    <div className="text-xs text-gray-500">{pickup.date} • Est. {pickup.volume}L</div>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    pickup.status === 'Completed' ? 'bg-green-50 text-green-600' :
                    pickup.status === 'Assigned' ? 'bg-blue-50 text-blue-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {pickup.status}
                  </div>
                </div>
                
                {pickup.status === 'Pending' ? (
                  <button onClick={() => assignDriver(pickup.id)} className="w-full py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors">
                    Assign Driver
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-xl">
                    <UserCircle size={16} className="text-gray-400" />
                    <span>Driver: <span className="font-medium text-gray-900">{pickup.driver}</span></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Restaurant Owner View
  if (isScheduling) {
    return (
      <div className="p-6 h-full flex flex-col bg-white overflow-y-auto pb-24">
        <header className="flex items-center gap-4 mb-6 pt-4">
          <button onClick={() => setIsScheduling(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" placeholder="e.g. Burger King - Downtown" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Volume (Liters)</label>
                <div className="relative">
                  <Droplets size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="number" min="20" placeholder="Minimum 20L" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
                <div className="relative">
                  <CalendarPlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="datetime-local" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                  <textarea required rows={3} placeholder="Full address..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"></textarea>
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
      <header className="pt-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Portal</h1>
          <p className="text-sm text-gray-500">Restaurant Dashboard</p>
        </div>
        <button onClick={() => setRole(null)} className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full">
          Logout
        </button>
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
      <button onClick={() => setIsScheduling(true)} className="w-full bg-gray-900 text-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors shadow-md">
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
          <button className="text-sm text-blue-600 font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {pickups.filter(p => p.restaurant.includes('Burger') || p.restaurant.includes('My')).map(pickup => (
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
