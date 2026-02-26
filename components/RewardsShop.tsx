'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, Fuel, ShoppingBag, ArrowRight } from 'lucide-react';

interface RewardsShopProps {
  points: number;
  onBack: () => void;
}

export default function RewardsShop({ points, onBack }: RewardsShopProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const vouchers = [
    {
      partner: 'Petronas',
      title: 'RM5 Fuel Voucher',
      points: 500,
      icon: Fuel,
      logo: 'https://logo.clearbit.com/petronas.com',
      bg: 'bg-teal-500',
    },
    {
      partner: 'Shell',
      title: 'RM5 Fuel Voucher',
      points: 500,
      icon: Fuel,
      logo: 'https://logo.clearbit.com/shell.com',
      bg: 'bg-yellow-400',
    },
    {
      partner: 'Tesco',
      title: 'RM10 Grocery Voucher',
      points: 1000,
      icon: ShoppingBag,
      logo: 'https://logo.clearbit.com/tesco.com',
      bg: 'bg-blue-600',
    },
    {
      partner: 'AEON',
      title: 'RM10 Shopping Voucher',
      points: 1000,
      icon: ShoppingBag,
      logo: 'https://logo.clearbit.com/aeon.info',
      bg: 'bg-pink-500',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 pt-12 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Rewards Shop</h1>
            <p className="text-sm text-gray-500">Redeem your green points</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-green-600">{Math.floor(points)}</div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Points</span>
          </div>
        </div>
      </div>

      {/* Vouchers List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {vouchers.map((voucher, index) => {
          const canRedeem = points >= voucher.points;
          const hasError = imageErrors[index];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-3xl p-5 flex items-center gap-5 text-white overflow-hidden shadow-lg ${voucher.bg}`}
            >
              <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10">
                <voucher.icon className="w-full h-full" />
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 p-2 shadow-md overflow-hidden">
                {!hasError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={voucher.logo} 
                    alt={`${voucher.partner} logo`} 
                    className="w-full h-full object-contain"
                    onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                  />
                ) : (
                  <voucher.icon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 relative">
                <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{voucher.partner}</p>
                <h3 className="font-bold text-lg leading-tight">{voucher.title}</h3>
              </div>
              <button 
                disabled={!canRedeem}
                className={`w-28 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-all duration-300 ${
                  canRedeem 
                    ? 'bg-white text-gray-900 shadow-md active:scale-95'
                    : 'bg-black/20 text-white/50 cursor-not-allowed'
                }`}
              >
                <span className="font-bold text-sm">{voucher.points} pts</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider">{canRedeem ? 'Redeem' : 'Needed'}</span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
