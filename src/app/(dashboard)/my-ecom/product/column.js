"use client";

import CancelOrderModal from "@/components/common/cancleOrderCompoent";
import OrderSummary from "@/components/common/orderComponent";
import PopupForm from "@/components/ui/popupform";
import { Eye, Trash } from "lucide-react";
import ViewUser from "../../users/viewUser";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import DetailView from "@/components/modules/DetailView";
import {
  archiveOrderConfig,
  flagOrderConfig,
  orderDetailsConfig,
  refundDetailsConfig,
  getProductDetailsConfig,
} from "./config";
import { bookingDetailsConfig } from "../../appointments/config";
import { editBookingConfig } from "./config";
import { ProductDetailsConfig } from "./config";
import { editProductConfig } from "./config";

export const getColumns = (handleDeleteProduct, handleProductStatusUpdate, handleViewProduct) => [
  {
    key: "product",
    title: "Product",
    isPrimary: true,
    isObject: true,
    sortable: true,
    structure: {
      name: "productName",
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
    key: "category",
    title: "Category",
    component: {
      type: "text",
      style: { color: "var(--color-primary1)" },
    },
  },
  {
    key: "stock",
    title: "Stocks",
    component: { type: "phone", style: { color: "var(--color-dull-text)" } },
  },
  {
    key: "price",
    title: "Price",
    component: {
      type: "currency",
      style: {},
      sign: "$",
      position: "start",
      style: {
        color: "#7B7B7B",
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
      options: {
        actions: (row) => {
          // row.status determines which actions to show
          if (row.status === "Inactive") {
            return [
              {
                label: "View Product",
                iconUrl: "/icons/show.svg",
                type: "sidebar",
                onClick: (row) => handleViewProduct(row._id),
              },
              {
                label: "Edit Product",
                iconUrl: "/icons/editBooking.svg",
                type: "sidebar",
                component: <DynamicForm config={editBookingConfig} />,
              },
              {
                label: "Mark As Active",
                iconUrl: "/icons/markCompleted.svg",
                type: "button",
                onClick: () =>
                  handleProductStatusUpdate(
                    row._id,
                    row.status.toLowerCase() === "active" ? "inactive" : "active"
                  ),
              },
              // {
              //   label: "Archive Order",
              //   iconUrl: "/icons/archiveClient.svg",
              //   type: "popUp",
              //   component: (
              //     <PopupForm
              //       config={archiveOrderConfig}
              //       width="500px"
              //       height="500px"
              //       onApply={(data) => console.log("Archive applied:", data)}
              //       onCancel={() => console.log("Cancelled")}
              //     />
              //   ),
              // },
              {
                label: "Delete Product",
                iconUrl: "/icons/deleteProduct.svg",
                type: "button",
                onClick: (row) => handleDeleteProduct(row),
              },
            ];
          }

          // default actions for other statuses
          return [
            {
              label: "View Product",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: (row) => handleViewProduct(row._id),
            },
            {
              label: "Edit Product",
              iconUrl: "/icons/editBooking.svg",
              type: "sidebar",
              component: <DynamicForm config={editProductConfig} />,
            },
            {
              label: "Mark As InActive",
              iconUrl: "/icons/markCompleted.svg",
              type: "button",
              onClick: () =>
                handleProductStatusUpdate(
                  row._id,
                  row.status.toLowerCase() === "active" ? "inactive" : "active"
                ),
            },
            // {
            //   label: "Archive Product",
            //   iconUrl: "/icons/archiveClient.svg",
            //   type: "popUp",
            //   component: (
            //     <PopupForm
            //       config={archiveOrderConfig}
            //       width="500px"
            //       height="500px"
            //       onApply={(data) => console.log("Archive applied:", data)}
            //       onCancel={() => console.log("Cancelled")}
            //     />
            //   ),
            // },
            {
              label: "Delete Product",
              iconUrl: "/icons/deleteProduct.svg",
              type: "button",
              onClick: (row) => handleDeleteProduct(row),
            },
          ];
        },
      },
    },
  },
];
