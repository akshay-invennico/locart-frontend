import OrderStatus from "./OrderStatus";

const statusOptions = [
  {
    label: "Pending",
    value: "pending",
    bgColor: "#E0F8FF",
    textColor: "#0077A3",
  },
  {
    label: "Shipped",
    value: "shipped",
    bgColor: "#E0F8FF",
    textColor: "#0077A3",
  },
  {
    label: "Dispatched",
    value: "dispatched",
    bgColor: "#FFECD9",
    textColor: "#FF6B00",
  },
  {
    label: "Delivered",
    value: "delivered",
    bgColor: "#E8FFEC",
    textColor: "#28A745",
  },
  {
    label: "Cancelled",
    value: "cancelled",
    bgColor: "#FFE5E5",
    textColor: "#D10000",
  },
  {
    label: "Returned",
    value: "returned",
    bgColor: "#F0F0F0",
    textColor: "#4F4F4F",
  },
];

export const getColumns = (
  handleCancelOrder,
  handleStatusUpdate,
  handleFlagOrders,
  handleViewOrder,
  handleDownloadInvoice
) => [
  {
    key: "order_id",
    title: "Order ID",
    component: {
      type: "phone",
      style: { color: "var(--color-primary1)" },
    },
  },
  {
    key: "date",
    title: "Date",
    component: {
      type: "date",
      style: { color: "var(--color-dull-text)" },
      options: { format: "MM dd yyyy" },
    },
  },
  {
    key: "customerName",
    title: "Customer Name",
    component: {
      type: "phone",
      style: { color: "var(--color-primary1)" },
    },
  },
  {
    key: "totalItems",
    title: "Total Items",
    component: {
      type: "phone",
      style: { color: "var(--color-dull-text)" },
    },
  },
  {
    key: "amount",
    title: "Amount",
    component: {
      type: "currency",
      sign: "$",
      position: "start",
      style: { color: "var(--color-dull-text)" },
    },
  },
  {
    key: "paymentStatus",
    title: "Payment Status",
    component: {
      type: "phone",
      style: { borderRadius: "4px", padding: "6px 10px" },
      options: {
        value: {
          Paid: "#097416",
          Unpaid: "#BC0D10",
          Refunded: "#9CA3AF",
        },
      },
    },
  },
  {
    key: "orderStatus",
    title: "Order Status",
    component: {
      type: "badge",
      style: { borderRadius: "4px", padding: "6px 10px", cursor: "pointer" },
      options: {
        value: {
          pending: "#02C8DE",
          shipped: "#02C8DE",
          dispatched: "#F7630C",
          delivered: "#097416",
          cancelled: "#BC0D10",
          returned: "#7B7B7B",
        },
        render: (value, row) => (
          <OrderStatus
            value={value?.toLowerCase()}
            row={row}
            options={statusOptions}
            onStatusChange={handleStatusUpdate}
          />
        ),
      },
    },
  },
  {
    key: "actions",
    title: "Actions",
    component: {
      style: { cursor: "pointer" },
      type: "action",
      options: {
        actions: (row) => {
          if (row.status === "cancelled") {
            return [
              {
                label: "View Order",
                iconUrl: "/icons/show.svg",
                type: "sidebar",
                onClick: (row) => handleViewOrder(row.id),
              },
              {
                label: "Download Invoice",
                iconUrl: "/icons/downloadGray.svg",
                onClick: () => handleDownloadInvoice(row),
              },
            ];
          }

          return [
            {
              label: "View Order",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: (row) => handleViewOrder(row.id),
            },
            {
              label: "Mark As Delivered",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: (row) => handleStatusUpdate([row.order_id], "Delivered"),
            },
            {
              label: "Flag Order",
              iconUrl: "/icons/flag.svg",
              type: "popUp",
              onAction: (data) => {
                const reason = data?.reason || "";
                if (!reason.trim()) return;
                handleFlagOrders([row.order_id], reason.trim());
              },
            },
            {
              label: "Download Invoice",
              iconUrl: "/icons/downloadGray.svg",
              onClick: () => handleDownloadInvoice(row),
            },
            {
              label: "Cancel Order",
              iconUrl: "/icons/cancel.svg",
              type: "action",
              onClick: (row) => handleStatusUpdate([row.order_id], "Cancelled"),
            },
          ];
        },
      },
    },
  },
];
