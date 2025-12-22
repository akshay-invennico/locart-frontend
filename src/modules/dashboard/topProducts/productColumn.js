"use client";


export const productColumns = [
  {
    key: "product",
    title: "Product",
    isPrimary: true,
    isObject: true,
    sortable: true,
    structure: {
      name: "name",
      profile: "profile",
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
    key: "unit_sold",
    title: "Units Sold",
    sortable: true,
    component: {
      type: "",
      style: { text: "text-gray-500" },
      options: {},
    },
  },

  {
    key: "revenue",
    title: "Revenue Generated",
    sortable: true,
    component: {
      type: "currency",
      style: { text: "text-gray-500" },
      options: {
        sign: "$",
        position: "start",
      },
    },
  },
];
