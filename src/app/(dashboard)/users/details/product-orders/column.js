"use client";
import ViewUser from "../../viewUser";
import PopupForm from "@/components/ui/popupform";

import DetailView from "@/components/modules/DetailView";
import {
  cancelOrderConfig,
  flagOrderConfig,
  orderDetailsConfig,
} from "./config";

export const columns = [
  {
    key: "product",
    title: "Product",
    isPrimary: true,
    isObject: true,
    sortable: true,
    structure: {
      name: "name",
      category: "category",
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
    key: "order_id",
    title: "Order ID",
    component: {
      type: "phone",
      style: {
        color: "#02C8DE",
      },
    },
  },
  {
    key: "order_date",
    title: "Order Date",
    component: {
      type: "date",
      options: {
        format: "MM dd yyyy",
      },
    },
  },
  {
    key: "amount_paid",
    title: "Amount Paid",
    component: {
      type: "currency",
      sign: "$",
      position: "start",
      style: {
        color: "#111111",
      },
    },
  },
  {
    key: "delivery_status",
    title: "Delivery Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "3.15px",
        padding: "8px 12px",
      },
      options: {
        value: {
          active: "#00A78E", // Green
          pending: "#F59E0B", // Amber
          completed: "#9CA3AF", // Gray
          cancelled: "#EF4444", // Red
        },
      },
    },
  },
  {
    key: "actions",
    title: "Action",
    component: {
      type: "action",
      options: {
        actions: [
          {
            label: "View Order",
            iconUrl: "/icons/show.svg",
            type: "sidebar",
            component: <DetailView config={orderDetailsConfig} />,
          },
          {
            label: "Mark As Completed",
            iconUrl: "/icons/markCompleted.svg",
            type: "popUp",
            component: <ViewUser />,
          },
          {
            label: "Flag Order",
            iconUrl: "/icons/flag.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={flagOrderConfig}
                width="500px"
                onApply={(data) => console.log("Reactivated:", data)}
                onCancel={() => console.log("Cancelled")}
              />
            ),
          },
          {
            label: "Download Invoice",
            iconUrl: "/icons/downloadGray.svg",
            type: "popUp",
            component: <ViewUser />,
          },
          {
            label: "Cancel Order",
            iconUrl: "/icons/cancel.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={cancelOrderConfig}
                width="500px"
                onApply={(data) => console.log("done:", data)}
                onCancel={() => console.log("Cancelled")}
              />
            ),
          },
        ],
      },
    },
  },
];
