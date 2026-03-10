"use client";
import React, { useState } from "react";
import Table from "@/components/common/Table";
import { getLoyaltyUsers } from "@/state/loyalty/loyaltyService";
import LoyaltySidebar from "./components/LoyaltySidebar";
import LoyaltyStats from "./components/LoyaltyStats";
import EarnRules from "./components/EarnRules";
import PointsSettings from "./components/PointsSettings";

const Page = () => {
  const [activeTab, setActiveTab] = useState('loc-points');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getLoyaltyUsers();
        if (response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const tableColumns = [
    {
      header: "Clients",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.profile_picture || "/user.png"}
            alt={row.name}
            className="h-10 w-10 rounded-full object-cover shadow-sm"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/user.png";
            }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{row.name}</span>
            <span className="text-xs text-gray-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Loyalty Points",
      accessor: "loyalty_points",
      render: (row) => (
        <span>{row.loyalty_points !== null && row.loyalty_points !== undefined ? row.loyalty_points : '-'}</span>
      )
    },
    {
      header: "Lifetime Points",
      accessor: "lifetime_points_value",
      render: (row) => (
        <span className="text-primary1 font-bold">
          ${row.lifetime_points_value !== null && row.lifetime_points_value !== undefined ? row.lifetime_points_value : '0'}
        </span>
      ),
    },
    {
      header: "Last Activity",
      accessor: "last_activity",
      render: (row) => {
        if (!row.last_activity) return <span className="text-gray-400 text-sm">-</span>;
        const date = new Date(row.last_activity);
        return (
          <span className="text-gray-500 text-sm">
            {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        )
      }
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'earn-rules':
        return <EarnRules />;
      case 'points-settings':
        return <PointsSettings />;
      case 'loc-points':
      default:
        return (
          <>
            <LoyaltyStats />
            <div className="">
              <Table
                title=""
                data={users}
                columns={tableColumns}
                enableSearch={true}
                enableDownload={true}
                itemsPerPage={5}
                loading={loading}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <LoyaltySidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 pl-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;
