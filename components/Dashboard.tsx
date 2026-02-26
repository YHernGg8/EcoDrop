import { useEffect, useRef } from 'react';
import { ViewState } from '@/app/page';
import { Droplet, MapPin, Leaf, ChevronRight, ArrowRight, BookOpen, Languages } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'motion/react';
import { useLanguage } from '@/hooks/useLanguage';

interface DashboardProps {
  verifiedPoints: number;
  pendingPoints: number;
  carbonOffset: number;
  onNavigate: (view: ViewState) => void;
}

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Dashboard({ verifiedPoints, pendingPoints, carbonOffset, onNavigate }: DashboardProps) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.dashboard.greeting}</h1>
          <p className="text-sm text-gray-500">{t.dashboard.role}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Languages size={14} />
            {language === 'en' ? 'BM' : 'EN'}
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold hover:bg-green-200 transition-colors shadow-sm"
          >
            A
          </button>
        </div>
      </header>

      {/* Impact Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-5 text-white shadow-lg shadow-green-200 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 opacity-90">
              <Leaf size={18} />
              <span className="text-xs font-medium uppercase tracking-wider">{t.dashboard.verifiedPoints}</span>
            </div>
            {pendingPoints > 0 && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-yellow-400 text-gray-900 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 shrink-0"
              >
                <div className="w-1 h-1 bg-gray-900 rounded-full animate-pulse" />
                {pendingPoints} {t.dashboard.pending}
              </motion.div>
            )}
          </div>
          <div className="text-3xl font-bold">
            <Counter value={verifiedPoints} />
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Droplet size={18} className="text-blue-500" />
            <span className="text-xs font-medium uppercase tracking-wider">{t.dashboard.co2Offset}</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            <Counter value={carbonOffset} decimals={1} />
            <span className="text-sm font-normal text-gray-500 ml-1">kg</span>
          </div>
        </motion.div>
      </div>

      {/* Learn & Impact Banner */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => onNavigate('education')}
        className="w-full bg-green-50 border border-green-100 rounded-3xl p-5 flex items-center gap-4 text-left hover:bg-green-100 transition-colors group"
      >
        <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-200 shrink-0 group-hover:scale-110 transition-transform">
          <BookOpen size={28} />
        </div>
        <div>
          <h3 className="font-bold text-green-900">{t.dashboard.learnImpact}</h3>
          <p className="text-xs text-green-700 leading-snug mt-1">{t.dashboard.learnImpactDesc}</p>
        </div>
        <ChevronRight size={20} className="text-green-400 ml-auto" />
      </motion.button>

      {/* Pending Points Alert */}
      {pendingPoints > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-yellow-800">{t.dashboard.unlockPoints.replace('{points}', pendingPoints.toString())}</div>
              <div className="text-xs text-yellow-700">{t.dashboard.unlockPointsDesc}</div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('locator')}
            className="bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-xl shadow-sm active:scale-95 transition-transform"
          >
            {t.dashboard.goToMap}
          </button>
        </motion.div>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t.dashboard.quickActions}</h2>
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
                <div className="font-semibold text-lg">{t.dashboard.aiSmartScan}</div>
                <div className="text-sm text-gray-400">{t.dashboard.gradeOil}</div>
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
                <div className="font-semibold text-gray-900">{t.dashboard.findBin}</div>
                <div className="text-sm text-gray-500">{t.dashboard.locateNearest}</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">{t.dashboard.recentActivity}</h2>
          <button className="text-sm text-green-600 font-medium">{t.common.viewAll}</button>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, title: t.dashboard.activityOil, date: `${t.common.today}, 10:24 AM`, points: '+50', icon: Droplet },
            { id: 2, title: t.dashboard.activityVoucher, date: t.common.yesterday, points: '-500', icon: Leaf },
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
