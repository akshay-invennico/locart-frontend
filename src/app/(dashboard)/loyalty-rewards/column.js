"use client";

// import ViewUser from "@/app/(users)/users/viewUser";
import { Eye, Trash } from "lucide-react";

export const columns = [
  {
    key: "user",
    title: "User",
    isObject: true,
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
    key: "loyaltyPoints",
    title: "Loyalty Points",
  },
  {
    key: "badgesEarned",
    title: "Badges Earned",
  },
  {
    key: "lifetimeEarning",
    title: "Lifetime Earning",
    component: {
      type: "currency",
      style: {},
      sign: "$",
      position: "start",
    },
  },
  {
    key: "lastActivity",
    title: "Last Activity",
    component: {
      type: "date",
      style: {},
      options: {
        format: "MM dd, yyyy",
      },
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
      style: {},
      options: {
        actions: [
          {
            label: "View",
            icon: <Eye className="w-4 h-4" />,
            type: "sidebar",
            // component: <ViewUser />,
          },
          {
            label: "Delete",
            icon: <Trash className="w-4 h-4" />,
            type: "popUp",
            // component: <ViewUser />,
          },
          {
            label: "View Details",
            onClick: (data) => handleViewDetails(data),
          },
        ],
      },
    },
  },
];
