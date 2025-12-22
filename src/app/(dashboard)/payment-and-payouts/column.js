"use client";

import { Eye, Trash } from "lucide-react";

export const paymentColumns = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "date",
    title: "Date",
    component: {
      type: "date",
      style: {},
      options: {
        format: "dd MMM, yyyy", // Example: 15 Jul, 2025
      },
    },
  },
  {
    key: "time",
    title: "Time",
  },
  {
    key: "user",
    title: "User",
  },
  {
    key: "type",
    title: "Type",
  },
  {
    key: "amount",
    title: "Amount",
    component: {
      type: "currency",
      style: {
        color: "#00A78E",
        fontWeight: "500",
      },
      sign: "+$",
      position: "start",
    },
  },
  {
    key: "method",
    title: "Method",
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "6px",
        padding: "6px 12px",
        fontWeight: "500",
      },
      options: {
        value: {
          Paid: "#16A34A", // green
          "In Process": "#F59E0B", // yellow
          Failed: "#DC2626", // red
        },
      },
    },
  },
  {
    key: "actions",
    title: "Action",
    component: {
      type: "action",
      style: {},
      options: {
        actions: [
          {
            label: "View",
            icon: <Eye className="w-4 h-4" />,
            type: "sidebar",
            component: <div>View Payment Details</div>,
          },
          {
            label: "Delete",
            icon: <Trash className="w-4 h-4" />,
            type: "popUp",
            component: <div>Delete Payment</div>,
          },
        ],
      },
    },
  },
];
