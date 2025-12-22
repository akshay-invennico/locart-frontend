"use client";

export const columns = [
  {
    key: "user",
    title: "User",
    isObject: true,
    structure: {
      name: "name",
      email: "email",
      profile: "profile",
      image: "profile1",
      // image1: "profile2",
      image2: "profile2",
      quantity: "quantity",
    },
    component: {
      type: "standard_avatar",
      style: {
        border: "1px solid #00A78E",
        radius: "rounded-xl",
        // backgroundColor: "#f3f4f6",
      },
    },
  },
  {
    key: "order_items",
    isObject: true,
    structure: {
      images: "order_items.icon",
      names: "order_items.name",
      quantity: "order_items.length",
    },
    component: {
      type: "products_avatar",
      style: {
        border: "1px solid #00A78E",
        radius: "rounded-xl",
      },
    },
  },
  { key: "role", title: "Role" },
  {
    key: "status",
    title: "Status",
    render: (status) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status}
      </span>
    ),
  },
  { key: "total_bookings", title: "Bookings" },
  {
    key: "total_spent",
    title: "Total Spent",
    render: (amount) => `$${amount}`,
  },
  {
    key: "actions",
    title: "Actions",
    render: (actions) => (
      <div className="flex gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
            onClick={() => console.log(action.url)}
          >
            {action.action}
          </button>
        ))}
      </div>
    ),
  },
];
