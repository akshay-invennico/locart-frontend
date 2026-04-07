import EditServiceForm from "./forms/EditServiceForm";

export const createColumns = ({ onDelete, onEdit, categoryOptions }) => [
  {
    key: "serviceName",
    title: "Service Name",
    isObject: true,
    sortable: true,
    structure: { name: "name", profile: "profile" },
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
