import React from 'react';
import { Gift, RefreshCw, DollarSign, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, description, icon: Icon, colorClass, iconBgClass }) => {
  return (
    <div className={`${colorClass} rounded-lg p-4 text-white flex flex-col justify-between h-40`}>
      <div>
        <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${iconBgClass} bg-opacity-20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
      </div>
      <p className="text-xs opacity-80 mt-2">{description}</p>
    </div>
  );
};

const LoyaltyStats = () => {
  const stats = [
    {
      title: 'Total Points Earned',
      value: '125,430',
      description: 'Lifetime points accumulated by all Clients.',
      icon: CheckCircle2,
      colorClass: 'bg-[#02C8DE]',
      iconBgClass: 'bg-white'
    },
    {
      title: 'Total Points Redeemed',
      value: '98,700',
      description: 'Points converted into rewards/discounts.',
      icon: Gift,
      colorClass: 'bg-[#00A78E]',
      iconBgClass: 'bg-white'
    },
    {
      title: 'Active Points in Circulation',
      value: '26,730',
      description: 'Points still available with Clients to redeem.',
      icon: RefreshCw,
      colorClass: 'bg-[#3B82F6]',
      iconBgClass: 'bg-white'
    },
    {
      title: 'Estimated Discount Value',
      value: '$2,673',
      description: 'Approx. cost of all circulating points.',
      icon: DollarSign,
      colorClass: 'bg-[#7C3AED]',
      iconBgClass: 'bg-white'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default LoyaltyStats;
