import React from 'react';
import { Gift, RefreshCw, DollarSign, CheckCircle2 } from 'lucide-react';
import { getSummary } from '@/state/loyalty/loyaltyService';

const StatCard = ({ title, value, description, icon: Icon, colorClass }) => {
  return (
    <div className={`${colorClass} rounded-lg p-4 text-white flex flex-col justify-between h-40`}>
      <div>
        <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-white/20`}>
            <Icon size={24} color="white" />
          </div>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
      </div>
      <p className="text-xs opacity-80 mt-2">{description}</p>
    </div>
  );
};

const LoyaltyStats = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getSummary();
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch loyalty summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const stats = [
    {
      title: 'Total Points Earned',
      value: loading ? '...' : data?.totalPointsEarned ?? 0,
      description: 'Lifetime points accumulated by all Clients.',
      icon: CheckCircle2,
      colorClass: 'bg-[#02C8DE]',
    },
    {
      title: 'Total Points Redeemed',
      value: loading ? '...' : data?.totalPointsRedeemed ?? 0,
      description: 'Points converted into rewards/discounts.',
      icon: Gift,
      colorClass: 'bg-[#00A78E]',
    },
    {
      title: 'Active Points in Circulation',
      value: loading ? '...' : data?.activePoints ?? 0,
      description: 'Points still available with Clients to redeem.',
      icon: RefreshCw,
      colorClass: 'bg-[#3B82F6]',
    },
    {
      title: 'Estimated Discount Value',
      value: loading ? '...' : `$${data?.estimatedDiscountValue ?? 0}`,
      description: 'Approx. cost of all circulating points.',
      icon: DollarSign,
      colorClass: 'bg-[#7C3AED]',
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
