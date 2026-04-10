export const getPaymentColumns = (handleViewTransaction) => [
  {
    key: "id",
    title: "ID",
    render: (value, row) => (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleViewTransaction?.(row);
        }}
        className="text-[#02C8DE] font-medium hover:underline bg-transparent border-0 p-0 cursor-pointer"
      >
        {row.transactionId}
      </button>
    ),
  },
  {
    key: "date",
    title: "Date",
    component: {
      type: "date",
      style: {},
      options: {
        format: "dd MMM, yyyy",
      },
    },
  },
  {
    key: "time",
    title: "Time",
  },
  {
    key: "user",
    title: "User",
  },
  {
    key: "type",
    title: "Type",
  },
  {
    key: "amount",
    title: "Amount",
    component: {
      type: "currency",
      style: {
        color: "#02C8DE",
        fontWeight: "500",
      },
      sign: "+$",
      position: "start",
    },
  },
  {
    key: "method",
    title: "Method",
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "6px",
        padding: "6px 12px",
        fontWeight: "500",
      },
      options: {
        value: {
          paid: "#16A34A",
          "in process": "#F59E0B",
          failed: "#DC2626",
        },
      },
    },
  },
  {
    key: "actions",
    title: "Action",
    component: {
      type: "action",
      style: {},
      options: {
        actions: (row) => [
          {
            label: "View",
            iconUrl: "/icons/show.svg",
            type: "sidebar",
            onClick: (row) => handleViewTransaction?.(row),
          },
        ],
      },
    },
  },
];
