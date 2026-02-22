import { ViewState } from '@/app/page';
import { Droplet, MapPin, Leaf, ChevronRight, ArrowRight } from 'lucide-react';

interface DashboardProps {
  points: number;
  carbonOffset: number;
  onNavigate: (view: ViewState) => void;
}

export default function Dashboard({ points, carbonOffset, onNavigate }: DashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hi, Alex 👋</h1>
          <p className="text-sm text-gray-500">Household Contributor</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
          A
        </div>
      </header>

      {/* Impact Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-5 text-white shadow-lg shadow-green-200">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Leaf size={18} />
            <span className="text-xs font-medium uppercase tracking-wider">Green Points</span>
          </div>
          <div className="text-3xl font-bold">{Math.floor(points)}</div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Droplet size={18} className="text-blue-500" />
            <span className="text-xs font-medium uppercase tracking-wider">CO₂ Offset</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{carbonOffset.toFixed(1)}<span className="text-sm font-normal text-gray-500 ml-1">kg</span></div>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button 
            onClick={() => onNavigate('scan')}
            className="w-full bg-gray-900 text-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Droplet size={24} className="text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">AI Smart Scan</div>
                <div className="text-sm text-gray-400">Grade your used oil</div>
              </div>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
          </button>

          <button 
            onClick={() => onNavigate('locator')}
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <MapPin size={24} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Find Drop-off Bin</div>
                <div className="text-sm text-gray-500">Locate nearest collection point</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <button className="text-sm text-green-600 font-medium">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, title: 'Oil Deposit - Grade A', date: 'Today, 10:24 AM', points: '+50', icon: Droplet },
            { id: 2, title: 'Shell Voucher Redeemed', date: 'Yesterday', points: '-500', icon: Leaf },
          ].map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.points.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  <activity.icon size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{activity.title}</div>
                  <div className="text-xs text-gray-500">{activity.date}</div>
                </div>
              </div>
              <div className={`font-bold ${activity.points.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                {activity.points}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
