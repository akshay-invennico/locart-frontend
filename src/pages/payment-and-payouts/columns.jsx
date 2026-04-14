export const getPaymentColumns = (handleViewTransaction) => [
  {
    key: "transaction_id",
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
        {row.transaction_id ? `#TRN${row.transaction_id}` : `#${row._id?.slice(-8)}`}
      </button>
    ),
  },
  {
    key: "date",
    title: "Date",
    render: (value, row) => {
      try {
        const d = new Date(row.created_at);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      } catch {
        return "-";
      }
    },
  },
  {
    key: "time",
    title: "Time",
    render: (value, row) => {
      try {
        const d = new Date(row.created_at);
        return d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch {
        return "-";
      }
    },
  },
  {
    key: "user",
    title: "User",
    render: (value, row) => row.user?.name || "-",
  },
  {
    key: "type_label",
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
    key: "payment_processor",
    title: "Method",
    render: () => "Stripe",
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
          paid: "#16A34A",
          completed: "#16A34A",
          "in process": "#F59E0B",
          pending: "#F59E0B",
          failed: "#DC2626",
          refunded: "#6B7280",
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
        actions: () => {
          const items = [
            {
              label: "View",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: (row) => handleViewTransaction?.(row),
            },
          ];
          return items;
        },
      },
    },
  },
];
