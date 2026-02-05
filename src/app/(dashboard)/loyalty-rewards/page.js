"use client";
import React, { useState } from "react";
import Table from "@/components/common/Table";
import { LocUsersData } from "./loyaltesPoints";
import LoyaltySidebar from "./components/LoyaltySidebar";
import LoyaltyStats from "./components/LoyaltyStats";
import EarnRules from "./components/EarnRules";
import PointsSettings from "./components/PointsSettings";

const Page = () => {
  const [activeTab, setActiveTab] = useState('loc-points');

  const tableColumns = [
    {
      header: "Clients",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.profile}
            alt={row.name}
            className="h-10 w-10 rounded-full object-cover shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`;
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
      accessor: "loyaltyPoints",
    },
    {
      header: "Badges Earned",
      accessor: "badgesEarned",
    },
    {
      header: "Lifetime Points",
      accessor: "lifetimeEarning",
      render: (row) => (
        <span className="text-primary1 font-bold">
          ${row.lifetimeEarning}
        </span>
      ),
    },
    {
      header: "Last Activity",
      accessor: "lastActivity",
      render: (row) => {
        const date = new Date(row.lastActivity);
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
                data={LocUsersData}
                columns={tableColumns}
                enableSearch={true}
                enableDownload={true}
                itemsPerPage={10}
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
