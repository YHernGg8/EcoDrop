'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from '@/components/Dashboard';
import SmartScan from '@/components/SmartScan';
import EcoLocator from '@/components/EcoLocator';
import B2BPortal from '@/components/B2BPortal';
import BottomNav from '@/components/BottomNav';
import UserProfile from '@/components/UserProfile';
import AuthPage from '@/components/AuthPage';
import { useAuth } from '@/hooks/useAuth';

export type ViewState = 'dashboard' | 'scan' | 'locator' | 'rewards' | 'b2b' | 'profile';

export default function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [points, setPoints] = useState(1250);
  const [carbonOffset, setCarbonOffset] = useState(12.4);

  const handleScanComplete = (earnedPoints: number) => {
    setPoints(prev => prev + earnedPoints);
    setCarbonOffset(prev => prev + (earnedPoints * 0.01)); // Rough estimate
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen font-sans text-gray-900">
      {/* Mobile App Container */}
      <div className="w-full max-w-md bg-white h-[100dvh] flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Dashboard 
                  points={points} 
                  carbonOffset={carbonOffset} 
                  onNavigate={setCurrentView} 
                />
              </motion.div>
            )}
            {currentView === 'scan' && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <SmartScan onComplete={handleScanComplete} onBack={() => setCurrentView('dashboard')} />
              </motion.div>
            )}
            {currentView === 'locator' && (
              <motion.div
                key="locator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <EcoLocator onBack={() => setCurrentView('dashboard')} />
              </motion.div>
            )}
            {currentView === 'rewards' && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="h-full flex items-center justify-center p-6 text-center"
              >
                <div>
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Green Rewards</h2>
                  <p className="text-gray-500 mb-6">Redeem your {Math.floor(points)} points for exclusive vouchers.</p>
                  <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                    <p className="text-sm text-green-800">Rewards catalog coming soon to the prototype!</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="mt-8 text-green-600 font-medium"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
            {currentView === 'b2b' && (
              <motion.div
                key="b2b"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <B2BPortal />
              </motion.div>
            )}
            {currentView === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <UserProfile 
                  onBack={() => setCurrentView('dashboard')} 
                  points={points} 
                  carbonOffset={carbonOffset} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <BottomNav currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </div>
  );
}
