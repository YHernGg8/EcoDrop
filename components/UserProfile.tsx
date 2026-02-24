'use client';

import { motion } from 'motion/react';
import { ArrowLeft, User, Settings, Award, History, LogOut, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

interface UserProfileProps {
  onBack: () => void;
  points: number;
  carbonOffset: number;
}

export default function UserProfile({ onBack, points, carbonOffset }: UserProfileProps) {
  const menuItems = [
    { icon: <Award size={20} className="text-yellow-600" />, label: 'My Achievements', badge: '12' },
    { icon: <History size={20} className="text-blue-600" />, label: 'Recycling History' },
    { icon: <Settings size={20} className="text-gray-600" />, label: 'Account Settings' },
    { icon: <LogOut size={20} className="text-red-600" />, label: 'Sign Out', action: () => signOut(auth) },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header & Profile Card */}
      <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 pb-6 rounded-b-3xl shadow-lg">
        <div className="absolute top-6 left-4">
          <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center pt-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/50 shadow-md">
              <User size={48} className="text-white" />
            </div>
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mt-4"
          >
            Alex Green
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="text-green-100 text-sm opacity-90"
          >
            Eco-Warrior since Jan 2024
          </motion.p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Cards */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 text-center">
            <p className="text-3xl font-bold text-green-600">{points}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Points</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 text-center">
            <p className="text-3xl font-bold text-blue-600">{carbonOffset}kg</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">CO2 Saved</p>
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {menuItems.map((item, index) => (
            <button 
              key={index}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </button>
          ))}
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 space-y-4"
        >
          <h3 className="font-bold text-gray-800 mb-2">Contact Information</h3>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Mail size={18} className="text-gray-400" />
            <span>alex.green@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Phone size={18} className="text-gray-400" />
            <span>+60 12-345 6789</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MapPin size={18} className="text-gray-400" />
            <span>Kuala Lumpur, Malaysia</span>
          </div>
        </motion.div>

        {/* Eco Badge */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1 text-yellow-900">Elite Eco-Member</h3>
            <p className="text-yellow-800 text-sm opacity-90">You are in the top 5% of recyclers in your area!</p>
          </div>
          <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-white/20 rotate-12" />
        </motion.div>
      </div>
    </div>
  );
}
