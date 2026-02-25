'use client';

import { motion } from 'motion/react';
import { BookOpen, Recycle, Leaf, Trash2, CheckCircle2, ArrowRight, Info } from 'lucide-react';

export default function EducationSection() {
  const sections = [
    {
      title: "The Silent Pollutant",
      subtitle: "Why UCO matters",
      icon: Recycle,
      color: "text-red-500",
      bg: "bg-red-50",
      content: "One liter of used cooking oil can contaminate up to one million liters of clean water. When poured down drains, it solidifies and causes 'fatbergs', leading to massive sewage backups and expensive repairs."
    },
    {
      title: "From Waste to Energy",
      subtitle: "The Circular Economy",
      icon: Leaf,
      color: "text-green-500",
      bg: "bg-green-50",
      content: "Properly recycled UCO is a primary feedstock for Biodiesel. It burns 75% cleaner than petroleum diesel and reduces greenhouse gas emissions significantly. Your waste literally powers the future."
    },
    {
      title: "Proper Disposal",
      subtitle: "Step-by-step guide",
      icon: Trash2,
      color: "text-blue-500",
      bg: "bg-blue-50",
      content: "1. Cool the oil completely. 2. Filter out food particles. 3. Pour into a clean, leak-proof container. 4. Use EcoDrop to find the nearest collection point."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto custom-scrollbar">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white p-8 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 -mr-16 -mt-16">
          <BookOpen size={300} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <span className="text-green-400 font-bold text-xs uppercase tracking-widest mb-2 block">Eco-Education</span>
          <h1 className="text-4xl font-black tracking-tighter leading-none mb-4">
            Small Drops,<br />Big Impact.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
            Learn how your recycling efforts are transforming the environmental landscape of Malaysia.
          </p>
        </motion.div>
      </div>

      {/* Content Cards */}
      <div className="px-6 -mt-8 relative z-20 space-y-6 pb-24">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-100 border border-gray-50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl ${section.bg} ${section.color}`}>
                <section.icon size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{section.subtitle}</span>
                <h3 className="text-lg font-bold text-gray-900 leading-none">{section.title}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}

        {/* Fact Sheet */}
        <div className="bg-green-600 rounded-3xl p-8 text-white">
          <div className="flex items-center gap-2 mb-6">
            <Info size={20} className="text-green-200" />
            <h3 className="font-bold uppercase tracking-widest text-xs text-green-200">Did you know?</h3>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-3xl font-black text-green-300 opacity-50">01</span>
              <p className="text-sm font-medium leading-snug">Biodiesel from UCO reduces CO2 emissions by up to 88% compared to fossil fuels.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl font-black text-green-300 opacity-50">02</span>
              <p className="text-sm font-medium leading-snug">Recycled oil can be used to make eco-friendly soaps, candles, and industrial lubricants.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl font-black text-green-300 opacity-50">03</span>
              <p className="text-sm font-medium leading-snug">Malaysia generates over 500,000 tonnes of UCO annually, but only a fraction is recycled properly.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
            <p className="text-xs font-bold text-gray-900">Start your first scan today</p>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
