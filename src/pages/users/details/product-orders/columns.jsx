export const columns = ({ handleDownloadInvoice } = {}) => [
  {
    key: "product",
    title: "Product",
    isPrimary: true,
    isObject: true,
    sortable: true,
    structure: {
      name: "name",
      category: "category",
      profile: "profile",
    },
    component: {
      type: "standard_avatar",
      style: {
        radius: "rounded-md",
        border: "border",
      },
    },
  },
  {
    key: "order_id",
    title: "Order ID",
    component: {
      type: "phone",
      style: { color: "#02C8DE" },
    },
  },
  {
    key: "order_date",
    title: "Order Date",
    component: {
      type: "date",
      options: { format: "MM dd yyyy" },
    },
  },
  {
    key: "amount_paid",
    title: "Amount Paid",
    component: {
      type: "currency",
      sign: "$",
      position: "start",
      style: { color: "#111111" },
    },
  },
  {
    key: "delivery_status",
    title: "Delivery Status",
    component: {
      type: "badge",
      style: { borderRadius: "3.15px", padding: "8px 12px" },
      options: {
        value: {
          active: "#00A78E",
          pending: "#F59E0B",
          completed: "#9CA3AF",
          cancelled: "#EF4444",
        },
      },
    },
  },
  {
    key: "actions",
    title: "Action",
    component: {
      type: "action",
      options: {
        actions: (row) => [
          {
            label: "View Order",
            iconUrl: "/icons/show.svg",
            type: "sidebar",
            onAction: () => { },
          },
          {
            label: "Flag Order",
            iconUrl: "/icons/flag.svg",
            type: "popUp",
            onAction: (data) => console.log("Flagged:", data),
          },
          {
            label: "Download Invoice",
            iconUrl: "/icons/downloadGray.svg",
            onClick: () => handleDownloadInvoice?.(row),
          },
          {
            label: "Cancel Order",
            iconUrl: "/icons/cancel.svg",
            type: "popUp",
            onAction: (data) => console.log("Cancelled:", data),
          },
        ],
      },
    },
  },
];
