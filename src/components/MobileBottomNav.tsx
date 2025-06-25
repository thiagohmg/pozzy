import React from 'react';
import { Sparkles, Briefcase, Heart } from 'lucide-react';
import { MobileProfileMenu } from './MobileProfileMenu';

interface MobileBottomNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userId: string;
}

export const MobileBottomNav = ({ activeSection, onSectionChange, userId }: MobileBottomNavProps) => {
  const navItems = [
    { id: 'descobrir', label: 'Descobrir', icon: Sparkles, anchor: 'inicio' },
    { id: 'consultoria', label: 'Consultoria', icon: Briefcase, anchor: 'consultoria' },
    { id: 'perfil', label: 'Closet', icon: Heart, anchor: 'closet' },
  ];

  const handleNavClick = (sectionId: string, anchor: string) => {
    onSectionChange(sectionId);
    setTimeout(() => {
      const sectionElement = document.getElementById(anchor);
      if (sectionElement) {
        sectionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-soft md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.anchor)}
              className={`flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 touch-target
                ${isActive ? 'text-purple-dark font-semibold' : 'text-gray-500'}
              `}
              style={{ 
                backgroundColor: 'transparent',
                color: isActive ? '#4C1F4B' : '#5E5E5E'
              }}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-purple-dark' : ''}`} />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
        <MobileProfileMenu userId={userId} />
      </div>
    </nav>
  );
};

