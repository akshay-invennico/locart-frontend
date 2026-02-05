import Table from '@/components/common/Table';
import React from 'react';

export const data = [
  {
    id: 1,
    action: "1st time client (service booking)",
    points: 5,
    description: "Points awarded when a client books their first service.",
  },
  {
    id: 2,
    action: "Referrals",
    points: 3,
    description: "Points given when a client successfully refers another customer.",
  },
  {
    id: 3,
    action: "Leave a review",
    points: 2,
    description: "Points awarded when a client leaves a review for a service or product.",
  },
  {
    id: 4,
    action: "Download app",
    points: 2,
    description: "Points given when a client downloads and installs the mobile app.",
  },
  {
    id: 5,
    action: "Sign up for class",
    points: 10,
    description: "Points awarded when a client registers for a class or workshop.",
  },
  {
    id: 6,
    action: "Product purchase",
    points: 1,
    description: "Points earned for purchasing products from the salon.",
  },
];

const EarnRules = () => {
  const columns = [
    {
      header: "Action",
      accessor: "action",
      className: "text-gray-900 text-left font-medium",
    },
    {
      header: "Point Value",
      accessor: "points",
      className: "text-gray-600 text-left font-semibold",
    },
    {
      header: "Description",
      accessor: "description",
      className: "text-gray-500 text-left",
    },
  ];


  return (
    <div className="flex flex-col items-start justify-start">
      <Table
        title=""
        data={data}
        columns={columns}
        enableSearch={false}
        enableDownload={false}
        itemsPerPage={10}
      />
    </div>
  );
};

export default EarnRules;
