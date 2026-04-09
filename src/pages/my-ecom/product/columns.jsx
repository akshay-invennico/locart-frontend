export const getColumns = (handleDeleteProduct, handleProductStatusUpdate, handleViewProduct, handleEditProduct) => [
  {
    key: "product",
    title: "Product",
    isPrimary: true,
    isObject: true,
    sortable: true,
    structure: {
      name: "productName",
      category: "category",
      profile: "profile",
    },
    render: (value, row) => {
      const fallbackImg = "/noimage.png";
      const image =
        row.product?.profile ||
        row.imageUrls?.[0] ||
        row.images?.[0] ||
        fallbackImg;
      const name = row.productName || row.product?.name || "";
      const description = row.description || "";

      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleViewProduct && handleViewProduct(row._id);
          }}
          className="flex items-center gap-3 text-left bg-transparent p-0 border-0 cursor-pointer group w-full"
        >
          <div className="w-12 h-12 rounded-md overflow-hidden border border-[#00A78E] shrink-0">
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
        border: "border border-[#00A78E]",
      },
    },
  },
  {
    key: "category",
    title: "Category",
    component: {
      type: "text",
      style: { color: "var(--color-primary1)" },
    },
  },
  {
    key: "stock",
    title: "Stocks",
    component: { type: "phone", style: { color: "var(--color-dull-text)" } },
  },
  {
    key: "price",
    title: "Price",
    component: {
      type: "currency",
      sign: "$",
      position: "start",
      style: { color: "#7B7B7B" },
    },
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "3.15px",
        padding: "8px 12px",
      },
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
          if (row.status.toLowerCase() === "inactive") {
            return [
              {
                label: "View Product",
                iconUrl: "/icons/show.svg",
                type: "sidebar",
                onClick: (row) => handleViewProduct(row._id),
              },
              {
                label: "Edit Product",
                iconUrl: "/icons/editBooking.svg",
                type: "sidebar",
                onClick: (row) => handleEditProduct(row._id),
              },
              {
                label: "Mark As Active",
                iconUrl: "/icons/markCompleted.svg",
                type: "button",
                onClick: () => handleProductStatusUpdate(row._id, "active"),
              },
              {
                label: "Delete Product",
                iconUrl: "/icons/deleteProduct.svg",
                type: "button",
                onClick: (row) => handleDeleteProduct(row),
              },
            ];
          }

          return [
            {
              label: "View Product",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: (row) => handleViewProduct(row._id),
            },
            {
              label: "Edit Product",
              iconUrl: "/icons/editBooking.svg",
              type: "sidebar",
              onClick: (row) => handleEditProduct(row._id),
            },
            {
              label: "Mark As Inactive",
              iconUrl: "/icons/markCompleted.svg",
              type: "button",
              onClick: () => handleProductStatusUpdate(row._id, "inactive"),
            },
            {
              label: "Delete Product",
              iconUrl: "/icons/deleteProduct.svg",
              type: "button",
              onClick: (row) => handleDeleteProduct(row),
            },
          ];
        },
      },
    },
  },
];
