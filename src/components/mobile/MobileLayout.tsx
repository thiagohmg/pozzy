import React, { useState } from 'react';
import { FaRegBell, FaCrown, FaStar, FaSuitcase, FaHeart, FaBars } from 'react-icons/fa';
import Descobrir from './MobileDescobrir';
import Consultoria from './MobileConsultoria';
import Menu from './MobileMenu';

const tabs = [
  { label: 'Descobrir', icon: <FaStar />, component: <Descobrir /> },
  { label: 'Consultoria', icon: <FaSuitcase />, component: <Consultoria /> },
  { label: 'Menu', icon: <FaBars />, component: <Menu /> },
];

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-[#faf9fb]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 rounded-full p-2">
            <FaStar className="text-purple-700" />
          </div>
          <span className="font-bold text-lg text-purple-900 tracking-wide">POZZY</span>
        </div>
        <div className="flex items-center gap-3">
          <FaRegBell className="text-purple-700 text-xl" />
          <button className="bg-purple-800 text-white rounded-lg px-3 py-1 flex items-center gap-1 text-sm font-medium">
            <FaCrown className="mr-1" /> Upgrade
          </button>
        </div>
      </header>

      {/* Conteúdo da aba */}
      <main className="flex-1 overflow-y-auto pb-20">
        {tabs[activeTab].component}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-20">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`flex flex-col items-center justify-center flex-1 h-full text-xs ${activeTab === idx ? 'text-purple-800 font-semibold' : 'text-gray-400'}`}
            onClick={() => setActiveTab(idx)}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
} 