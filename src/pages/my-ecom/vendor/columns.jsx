export const getColumns = (handleDeleteVendor, handleVendorStatusUpdate, handleViewVendor, handleEditVendor) => [
  {
    key: "vendor",
    title: "Vendor",
    isPrimary: true,
    isObject: true,
    sortable: true,
    structure: {
      name: "name",
      profile: "profile",
    },
    render: (value, row) => {
      const fallbackImg = "/noimage.png";
      const image = row.profile || fallbackImg;
      const name = row.name || "";
      const email = row.email || "";

      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleViewVendor && handleViewVendor(row._id);
          }}
          className="flex items-center gap-3 text-left bg-transparent p-0 border-0 cursor-pointer group w-full"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border shrink-0">
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
            {email && (
              <div className="text-gray-500 text-sm truncate" title={email}>
                {email}
              </div>
            )}
          </div>
        </button>
      );
    },
    component: {
      type: "standard_avatar",
      style: {
        radius: "rounded-full",
        border: "border",
      },
    },
  },
  {
    key: "phone",
    title: "Phone",
    component: { type: "phone", style: { color: "var(--color-dull-text)" } },
  },
  {
    key: "company",
    title: "Company",
    component: {
      type: "text",
      style: { color: "var(--color-primary1)" },
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
              label: "View Vendor",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: (row) => handleViewVendor(row._id),
            },
            {
              label: "Edit Vendor",
              iconUrl: "/icons/editBooking.svg",
              type: "sidebar",
              onClick: (row) => handleEditVendor(row._id),
            },
            {
              label: isInactive ? "Mark As Active" : "Mark As Inactive",
              iconUrl: "/icons/markCompleted.svg",
              type: "button",
              onClick: () => handleVendorStatusUpdate(row._id),
            },
            {
              label: "Delete Vendor",
              iconUrl: "/icons/deleteProduct.svg",
              type: "button",
              onClick: (row) => handleDeleteVendor(row),
            },
          ];
        },
      },
    },
  },
];
