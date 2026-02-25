'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import SmartScan from '@/components/SmartScan';
import EcoLocator from '@/components/EcoLocator';
import B2BPortal from '@/components/B2BPortal';
import EducationSection from '@/components/EducationSection';
import RewardsShop from '@/components/RewardsShop';
import BottomNav from '@/components/BottomNav';
import UserProfile from '@/components/UserProfile';
import AuthPage from '@/components/AuthPage';
import { useAuth } from '@/hooks/useAuth';

export type ViewState = 'dashboard' | 'scan' | 'locator' | 'rewards' | 'b2b' | 'profile' | 'education';

export default function App() {
  const auth = useAuth();
  const user = auth?.user;
  const loading = auth?.loading;
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [verifiedPoints, setVerifiedPoints] = useState(1250);
  const [pendingPoints, setPendingPoints] = useState(0);
  const [carbonOffset, setCarbonOffset] = useState(12.4);

  const handleScanComplete = (earnedPoints: number) => {
    setPendingPoints(prev => prev + earnedPoints);
  };

  const handleVerifyComplete = (pointsToVerify: number) => {
    setVerifiedPoints(prev => prev + pointsToVerify);
    setPendingPoints(0);
    setCarbonOffset(prev => prev + (pointsToVerify * 0.01));
    setCurrentView('dashboard');
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
                  verifiedPoints={verifiedPoints} 
                  pendingPoints={pendingPoints}
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
                <EcoLocator 
                  onBack={() => setCurrentView('dashboard')} 
                  pendingPoints={pendingPoints}
                  onVerify={handleVerifyComplete}
                />
              </motion.div>
            )}
            {currentView === 'rewards' && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <RewardsShop points={verifiedPoints} onBack={() => setCurrentView('dashboard')} />
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
                  points={verifiedPoints} 
                  carbonOffset={carbonOffset} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {currentView === 'education' && (
            <motion.div
              key="education-modal"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 z-[5000] bg-white"
            >
              <EducationSection />
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="absolute top-6 left-6 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <BottomNav currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </div>
  );
}
