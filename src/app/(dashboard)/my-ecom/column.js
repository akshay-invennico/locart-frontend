"use client";

import CancelOrderModal from "@/components/common/cancleOrderCompoent";
import OrderSummary from "@/components/common/orderComponent";
import { Eye, Trash } from "lucide-react";

export const orderColumns = [
  {
    key: "orderId",
    title: "Order ID",
  },
  {
    key: "date",
    title: "Date",
    component: {
      type: "date",
      style: {},
      options: {
        format: "MM dd yyyy", // Example: Jul 15, 2025
      },
    },
  },
  {
    key: "customerName",
    title: "Customer",
  },
  {
    key: "totalItems",
    title: "Items",
  },
  {
    key: "amount",
    title: "Amount",
    component: {
      type: "currency",
      style: {},
      sign: "$",
      position: "start",
    },
  },
  {
    key: "paymentStatus",
    title: "Payment",
    component: {
      type: "badge",
      style: {
        borderRadius: "4px",
        padding: "6px 10px",
      },
      options: {
        value: {
          Paid: "#097416",
          Unpaid: "#BC0D10",
          Refunded: "#9CA3AF",
        },
      },
    },
  },
  {
    key: "orderStatus",
    title: "Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "4px",
        padding: "6px 10px",
      },
      options: {
        value: {
          Placed: "#2563EB",
          Shipped: "#9333EA",
          Dispatched: "#F59E0B",
          Delivered: "#16A34A",
          Cancelled: "#DC2626",
          Returned: "#6B7280",
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
            component: <OrderSummary />,
          },
          {
            label: "Delete",
            icon: <Trash className="w-4 h-4" />,
            type: "popUp",
            component: <CancelOrderModal />,
          },
        ],
      },
    },
  },
];
