import { Flag } from "lucide-react";

export const getRefundColumns = (handleViewRefund) => [
  {
    key: "transactionId",
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
        {row.transactionId}
      </button>
    ),
  },
  {
    key: "date",
    title: "Date & Time",
    render: (value, row) => {
      const formatted = (() => {
        try {
          const d = new Date(row.date);
          return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        } catch {
          return row.date || "-";
        }
      })();
      return (
        <span className="text-gray-600">
          {formatted}
          <span className="ml-3 text-gray-400">{row.time}</span>
        </span>
      );
    },
  },
  {
    key: "client",
    title: "Client",
    render: (value) => (
      <span className="text-[#02C8DE] font-medium">{value}</span>
    ),
  },
  {
    key: "type",
    title: "Type",
  },
  {
    key: "amount",
    title: "Amount",
    render: (value) => (
      <span className="text-red-500 font-medium">-${value}</span>
    ),
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
          refunded: "#02C8DE",
          "in process": "#F59E0B",
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
