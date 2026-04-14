export const getRefundColumns = (handleViewRefund) => [
  {
    key: "transaction_id",
    title: "Transaction ID",
    render: (value, row) => (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleViewRefund?.(row);
        }}
        className="inline-flex items-center gap-1.5 text-[#02C8DE] font-medium hover:underline bg-transparent border-0 p-0 cursor-pointer"
      >
        {row.transaction_id ? `#TRN${row.transaction_id}` : `#${row._id?.slice(-8)}`}
      </button>
    ),
  },
  {
    key: "date",
    title: "Date & Time",
    render: (value, row) => {
      try {
        const d = new Date(row.created_at);
        const date = d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const time = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return (
          <span className="text-gray-600">
            {date}
            <span className="ml-3 text-gray-400">{time}</span>
          </span>
        );
      } catch {
        return "-";
      }
    },
  },
  {
    key: "user",
    title: "Client",
    render: (value, row) => (
      <span className="text-[#02C8DE] font-medium">{row.user?.name || "-"}</span>
    ),
  },
  {
    key: "type_label",
    title: "Type",
  },
  {
    key: "amount",
    title: "Amount",
    render: (value) => (
      <span className="text-red-500 font-medium">-${Number(value || 0).toFixed(2)}</span>
    ),
  },
  {
    key: "payment_processor",
    title: "Method",
  },
  {
    key: "transaction_status",
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
          refunded: "#02C8DE",
          "in process": "#F59E0B",
          pending: "#F59E0B",
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
            onClick: (row) => handleViewRefund?.(row),
          },
        ],
      },
    },
  },
];
