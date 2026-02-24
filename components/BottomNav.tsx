import { ViewState } from '@/app/page';
import { Home, ScanLine, Map, Gift, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

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
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center pb-safe z-[2000]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        
        // Special styling for the Scan button
        if (item.id === 'scan') {
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="relative -top-8 flex flex-col items-center justify-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-green-600 ring-4 ring-green-100' 
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}>
                <Icon size={28} className="text-white" />
              </div>
              <span className={`text-[10px] font-bold mt-1 transition-colors ${isActive ? 'text-green-600' : 'text-gray-900'}`}>
                {item.label}
              </span>
              
              {/* Pulsing indicator when active */}
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -inset-1 rounded-full border-2 border-green-500 opacity-20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center justify-center w-16 gap-1 transition-all duration-200 ${
              isActive ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'
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
