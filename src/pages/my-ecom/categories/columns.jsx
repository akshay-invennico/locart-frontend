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
      render: (value, row) => {
        const fallbackImg = "/noimage.png";
        const image = row.category?.profile || row.image || fallbackImg;
        const name = row.categoryName || row.category?.name || "";
        const description = row.description || "";

        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCategory && handleViewCategory(row._id);
            }}
            className="flex items-center gap-3 text-left bg-transparent p-0 border-0 cursor-pointer group w-full"
          >
            <div className="w-12 h-12 rounded-md overflow-hidden border shrink-0">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImg;
                }}
              />
            </div>
            <div className="flex-1 min-w-0 max-w-[220px]">
              <div className="font-medium text-gray-900 truncate group-hover:underline">
                {name}
              </div>
              {description && (
                <div
                  className="text-gray-500 text-sm truncate"
                  title={description}
                >
                  {description.length > 40
                    ? `${description.slice(0, 40)}...`
                    : description}
                </div>
              )}
            </div>
          </button>
        );
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
