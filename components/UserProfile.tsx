'use client';

import { motion } from 'motion/react';
import { ArrowLeft, User, Settings, Award, History, LogOut, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

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
    { icon: <LogOut size={20} className="text-red-600" />, label: 'Sign Out' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
            <User size={48} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Alex Green</h2>
          <p className="text-gray-500 text-sm">Eco-Warrior since Jan 2024</p>
          
          <div className="flex gap-4 mt-6 w-full">
            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-green-600">{points}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Points</p>
            </div>
            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-blue-600">{carbonOffset}kg</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">CO2 Saved</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail size={16} />
            <span>alex.green@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone size={16} />
            <span>+60 12-345 6789</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin size={16} />
            <span>Kuala Lumpur, Malaysia</span>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-bottom border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Eco Badge */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">Elite Eco-Member</h3>
            <p className="text-green-100 text-sm opacity-90">You are in the top 5% of recyclers in your area!</p>
          </div>
          <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
        </div>
      </div>
    </div>
  );
}
