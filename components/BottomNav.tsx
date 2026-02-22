import { ViewState } from '@/lib/types';
import { Home, ScanLine, Map, Gift, Building2 } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'locator', icon: Map, label: 'Map' },
    { id: 'scan', icon: ScanLine, label: 'Scan' },
    { id: 'b2b', icon: Building2, label: 'B2B' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
  ] as const;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center pb-safe">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        
        // Special styling for the Scan button
        if (item.id === 'scan') {
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="relative -top-6 flex flex-col items-center justify-center"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${isActive ? 'bg-green-600 scale-110' : 'bg-gray-900 hover:bg-gray-800'}`}>
                <Icon size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-medium mt-1 text-gray-900">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${
              isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
