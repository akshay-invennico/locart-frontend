export const getColumns = (handleDeleteOffer, handleViewOffer, handleEditOffer) => [
  {
    key: "offerName",
    title: "Offer Name",
    component: {
      type: "phone",
      style: {
        color: "var(--color-black)",
      },
    },
  },

  {
    key: "couponCode",
    title: "Coupon Code",
    component: {
      type: "phone",
      style: {
        color: "var(--color-dull-text)",
      },
    },
  },
  {
    key: "discount",
    title: "Discount",
    render: (value, row) => (
      <span style={{ color: "var(--color-dull-text)" }}>
        {row.discountType === "fixed" ? `$${value}` : `${value}%`}
      </span>
    ),
  },
  {
    key: "date",
    title: "Offer Dates",
    component: {
      type: "date",
      style: { color: "var(--color-dull-text)" },
      options: {
        format: "MM dd yyyy - MM dd yyyy", // Example: Jul 15, 2025
      },
    },
  },
  {
    key: "usageStats",
    title: "Usage Stats",
    component: {
      type: "phone",
      style: {
        color: "var(--color-dull-text)",
      },

      position: "start",
    },
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "4px",
        padding: "6px 10px",
      },
      options: {
        value: {
          used: "#02C8DE",
          active: "#097416",
          expired: "#BC0D10",
          inactive: "#7B7B7B",
        },
      },
    },
  },
  {
    key: "actions",
    title: "Actions",
    component: {
      type: "action",
      options: {
        actions: (row) => {
          return [
            {
              label: "View Offer",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: (row) => handleViewOffer(row),
            },
            {
              label: "Edit Offer",
              iconUrl: "/icons/editBooking.svg",
              type: "sidebar",
              onClick: (row) => handleEditOffer(row),
            },
            {
              label: "Delete Offer",
              iconUrl: "/icons/cancel.svg",
              type: "button",
              onClick: (row) => handleDeleteOffer(row),
            },
          ];
        },
      },
    },
  },
];
