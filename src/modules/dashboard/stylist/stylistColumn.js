"use client";

import StarRating from "@/components/ui/starRating";

export const stylistColumns = [
  {
    key: "stylist",
    title: "Stylist",
    isPrimary: true,
    isObject: true,
    sortable: true,
    structure: {
      name: "name",
      email: "email",
      profile: "profile",
    },
    component: {
      type: "standard_avatar",
      style: {
        radius: "rounded-full",
      },
    },
  },
  {
    key: "salon",
    title: "Salon",
    sortable: true,
    render: (value) => {
      if (value == null) return "-";
      if (typeof value === "object") {
        return value?.name?.name || value?.name || value?._id || "-";
      }
      return String(value);
    },
    component: {
      type: "",
      style: {
        text: "text-gray-500",
      },
      options: {},
    },
  },

  {
    key: "appointments",
    title: "Appointments",
    sortable: true,
    component: {
      type: "",
      style: {
        text: "text-gray-500",
      },
      options: {},
    },
  },
  {
    key: "avg_rating",
    title: "Avg Rating",
    sortable: true,
    render: (value) => (
      <div className="text-black-500">
        <StarRating value={value} />
      </div>
    ),
  },
  {
    key: "revenue",
    title: "Revenue Generated",
    sortable: true,
    component: {
      type: "currency",
      style: {
        text: "text-black-500",
      },
      options: {
        sign: "$",
        position: "start",
      },
    },
  },
];
