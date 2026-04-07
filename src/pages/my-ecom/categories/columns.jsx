export const getColumns = (
  handleDeleteCategory,
  handleViewCategory,
  handleEditCategory,
  handleCategoryStatusUpdate
) => [
  {
    key: "category",
    title: "Category",
    isPrimary: true,
    isObject: true,
    structure: { name: "categoryName", profile: "profile" },
    component: {
      type: "standard_avatar",
      style: {
        radius: "rounded-md",
        border: "border border-[#00A78E]",
      },
    },
  },
  {
    key: "itemsCount",
    title: "Product Count",
    component: {
      type: "phone",
      style: { color: "var(--color-dull-text)", fontWeight: "500" },
    },
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: { borderRadius: "3.15px", padding: "8px 12px" },
      options: {
        value: {
          active: "#097416",
          inactive: "#9CA3AF",
          suspended: "#BC0D10",
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
          const isInactive = row.status?.toLowerCase() === "inactive";

          return [
            {
              label: "View Category",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: (row) => handleViewCategory(row._id),
            },
            {
              label: "Edit Category",
              iconUrl: "/icons/editBooking.svg",
              type: "sidebar",
              onClick: (row) => handleEditCategory(row),
            },
            {
              label: isInactive ? "Mark As Active" : "Mark As Inactive",
              iconUrl: "/icons/markCompleted.svg",
              type: "button",
              onClick: () =>
                handleCategoryStatusUpdate(
                  row._id,
                  isInactive ? "active" : "inactive"
                ),
            },
            {
              label: "Delete Category",
              iconUrl: "/icons/deleteProduct.svg",
              type: "button",
              onClick: (row) => handleDeleteCategory(row),
            },
          ];
        },
      },
    },
  },
];
