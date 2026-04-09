import React from 'react';
import { FileText, Settings, Sparkles } from 'lucide-react';

const LoyaltySidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'loc-points', label: 'Loc Points', icon: Sparkles },
    { id: 'earn-rules', label: 'Earn Rules', icon: FileText },
    { id: 'points-settings', label: 'Points Settings', icon: Settings },
  ];

  return (
    <div className="w-[220px] bg-white border-r border-gray-200 min-h-screen pr-4 flex flex-col gap-6 z-10">
      <div>
        <h2 className="text-[12px] font-medium text-[#7B7B7B] tracking-wider mb-4">
          Incentive Programs
        </h2>
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`flex items-center w-full px-4 py-3 text-[14px] font-medium rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-[#F0FEFF] text-primary1 border border-primary1'
                  : 'text-black  border border-transparent'
                  }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary1' : 'text-black'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoyaltySidebar;
