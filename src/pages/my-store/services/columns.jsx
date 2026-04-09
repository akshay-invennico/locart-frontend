import EditServiceForm from "./forms/EditServiceForm";

export const createColumns = ({ onDelete, onEdit, categoryOptions }) => [
  {
    key: "serviceName",
    title: "Service Name",
    isObject: true,
    sortable: true,
    structure: { name: "name", profile: "profile" },
    render: (value, row) => {
      const fallbackImg = "/noimage.png";
      const image =
        row.serviceName?.profile || row.images?.[0] || fallbackImg;
      const name = row.name || row.serviceName?.name || "";
      const description = row.description || "";

      return (
        <div className="flex items-center gap-3 w-full">
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
            <div className="font-medium text-gray-900 truncate">{name}</div>
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
        </div>
      );
    },
    component: {
      type: "standard_avatar",
      style: { radius: "rounded-full" },
    },
  },
  {
    key: "category_id",
    title: "Category",
    render: (value) => {
      if (!value) return "N/A";
      if (typeof value === "object" && value.name) return value.name;
      if (typeof value === "string") {
        const category = categoryOptions?.find((cat) => cat.value === value);
        return category ? category.label : value;
      }
      return "N/A";
    },
  },
  { key: "duration", title: "Duration" },
  {
    key: "base_price",
    title: "Price",
    component: { type: "currency", sign: "$", position: "start" },
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: { borderRadius: "0.15rem" },
      options: {
        value: { active: "#00A78E", completed: "#9CA3AF", cancelled: "#EF4444" },
      },
    },
  },
  {
    key: "actions",
    title: "Actions",
    component: {
      type: "action",
      options: {
        actions: [
          {
            label: "Edit Service",
            iconUrl: "/icons/editService.svg",
            type: "sidebar",
            component: (rowData) => (
              <EditServiceForm
                service={rowData}
                onEdit={onEdit}
                onSubmit={onEdit}
                categoryOptions={categoryOptions}
              />
            ),
          },
          {
            label: "Delete Service",
            iconUrl: "/icons/deleteService.svg",
            type: "popUp",
            onAction: (data, rowData) => onDelete(rowData),
          },
        ],
      },
    },
  },
];
