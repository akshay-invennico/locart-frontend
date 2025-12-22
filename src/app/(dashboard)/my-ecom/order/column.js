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
  changeOrderStatusConfig,
  flagOrderConfig,
  orderDetailsConfig,
  refundDetailsConfig,
} from "./config";
import { bookingDetailsConfig } from "../../appointments/config";
import ActionComponent from "@/components/grid/actionComponent";
import OrderStatus from "./OrderStatus";

export const getColumns = (handleCancelOrder, handleStatusUpdate, handleFlagOrders, handleViewOrder) => [
  {
    key: "order_id",
    title: "Order ID",
    component: {
      type: "phone",
      style: {
        color: "var(--color-primary1)",
      },
    },
  },
  {
    key: "date",
    title: "Date",
    component: {
      type: "date",
      style: { color: "var(--color-dull-text)" },
      options: {
        format: "MM dd yyyy", // Example: Jul 15, 2025
      },
    },
  },
  {
    key: "customerName",
    title: "Customer Name",
    component: {
      type: "phone",
      style: {
        color: "var(--color-primary1)",
      },
    },
  },
  {
    key: "totalItems",
    title: "Total Items",
    component: {
      type: "phone",
      style: {
        color: "var(--color-dull-text)",
      },
    },
  },
  {
    key: "amount",
    title: "Amount",
    component: {
      type: "currency",
      style: {
        color: "var(--color-dull-text)",
      },
      sign: "$",
      position: "start",
    },
  },
  {
    key: "paymentStatus",
    title: "Payment Status",
    component: {
      type: "phone",
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
  // {
  //   key: "status",
  //   title: "Order Status",
  //   component: {
  //     type: "badge",
  //     style: {
  //       borderRadius: "4px",
  //       padding: "6px 10px",
  //     },
  //     options: {
  //       value: {
  //         placed: "#E3B320",
  //         shipped: "#02C8DE",
  //         dispatched: "#F7630C",
  //         delivered: "#097416",
  //         cancelled: "#BC0D10",
  //         returned: "#7B7B7B",
  //       },
  //       onClick: (value, row, e) => {
  //       row.onOpenStatus(row, e);   // <-- you will add this
  //     }
  //     },
  //   },
  // },

  {
    key: "orderStatus",
    title: "Order Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "4px",
        padding: "6px 10px",
        cursor: "pointer",
      },
      options: {
        value: {
          pending: "#02C8DE",
          shipped: "#02C8DE",
          dispatched: "#F7630C",
          delivered: "#097416",
          cancelled: "#BC0D10",
          returned: "#7B7B7B",
        },
        render: (value, row) => (
          <OrderStatus
            value={value?.toLowerCase()}
            row={row}
            options={changeOrderStatusConfig.fields[0].options}
            onStatusChange={handleStatusUpdate}
          />
        ),
      },
    },
  },

  {
    key: "actions",
    title: "Actions",
    component: {
      style: {
        cursor: "pointer",
      },
      type: "action",
      options: {
        actions: (row) => {
          // row.status determines which actions to show
          if (row.status === "cancelled") {
            return [
              {
                label: "View Order",
                iconUrl: "/icons/show.svg",
                type: "sidebar",
                component: <DetailView config={orderDetailsConfig} />,
              },
              // {
              //   label: "Archive Booking",
              //   iconUrl: "/icons/archiveClient.svg",
              //   type: "popUp",
              //   component: (
              //     <PopupForm
              //       config={archiveBookingConfig}
              //       width="500px"
              //       height="500px"
              //       onApply={(data) => console.log("Archive applied:", data)}
              //       onCancel={() => console.log("Cancelled")}
              //     />
              //   ),
              // },
              {
                label: "Download Invoice",
                iconUrl: "/icons/downloadGray.svg",
                onClick: (data) => console.log("Download Invoice", data),
              },

              {
                label: "Initiate Refund",
                iconUrl: "/icons/refund.svg",
                type: "popUp",
                style: {
                  color: "#BC0D10",
                },
                component: (
                  <PopupForm
                    config={refundDetailsConfig}
                    width="600px"
                    onApply={(data) => console.log("Refund confirmed", data)}
                    onCancel={() => console.log("Cancelled")}
                  />
                ),
              },
            ];
          }

          // default actions for other statuses
          return [
            {
              label: "View Order",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: (row) => handleViewOrder(row.id),
            },
            // {
            //   label: "Edit Order",
            //   iconUrl: "/icons/editBooking.svg",
            //   type: "sidebar",
            //   component: <DynamicForm config={editBookingConfig} />,
            // },
            {
              label: "Mark As Delivered",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: (row) => handleStatusUpdate([row.order_id], "Delivered"),
            },

            {
              label: "Flag Order",
              iconUrl: "/icons/flag.svg",
              type: "popUp",
              component: (
                <PopupForm
                  config={flagOrderConfig}
                  width="500px"
                  onApply={(data) => {
                    const reasonArray = data?.suspend_reason;
                    const reason = Array.isArray(reasonArray) ? reasonArray.join(" - ") : "";

                    if (!reason.trim()) {
                      alert("Please enter a reason for flagging");
                      return;
                    }

                    handleFlagOrders([row.order_id], reason.trim());
                  }}

                // onCancel={(closePopup) => closePopup()}
                />
              ),
            },
            {
              label: "Download Invoice",
              iconUrl: "/icons/downloadGray.svg",
              onClick: (data) => console.log("Download Invoice", data),
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
              label: "Cancel Order",
              iconUrl: "/icons/cancel.svg",
              type: "action",
              onClick: (row) => handleStatusUpdate([row.order_id], "Cancelled"),
            },
          ];
        },
      },
    },
  },
];
