"use client";

import { reactivateClientConfig, suspendClientConfig } from "./config";
import PopupForm from "@/components/ui/popupform";

export const columns = (
  handleSendResetPasswordLink,
  handleSuspendClients,
  handleReactivateClient,
) => [
    {
      key: "user",
      title: "Clients",
      isObject: true,
      structure: {
        name: "name",
        email: "email",
        profile: "avatar",
      },
      component: {
        type: "standard_avatar",
        style: {
          radius: "rounded-full",
          color: "#02C8DE",
          border: "1px solid #02C8DE",
        },
        options: {
          showEmailBelowName: true,
        },
      },
    },
    {
      key: "phone",
      title: "Phone",
      component: {
        type: "phone",
        style: {
          color: "#02C8DE",
        },
      },
    },
    {
      key: "joinedOn",
      title: "Joined On",
      component: {
        type: "date",
        style: {},
        options: {
          format: "M d yyyy",
        },
        style: {
          color: "#7B7B7B",
        },
      },
    },
    {
      key: "totalBookings",
      title: "Total Booking",
      component: {
        style: {
          color: "#7B7B7B",
        },
      },
    },
    {
      key: "productOrders",
      title: "Product Orders",
      component: {
        style: {
          color: "#7B7B7B",
        },
      },
    },
    {
      key: "totalSpent",
      title: "Total Spent",
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
      key: "loyaltyPoints",
      title: "Loyalty Points",
      component: {
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
        style: {},
        options: {
          actions: (row) => {
            const actions = [
              {
                label: "View Client",
                iconUrl: "/icons/show.svg",
                type: "navigate",
                url: `/users/details/overview/${row.id}`,
              },
            ];

            // ✅ If ACTIVE → Show Suspend
            if (row.status === "active") {
              actions.push({
                label: "Suspend Client",
                iconUrl: "/icons/suspendClient.svg",
                type: "popUp",
                component: (
                  <PopupForm
                    config={suspendClientConfig}
                    width="500px"
                    onApply={(data) => {
                      if (handleSuspendClients) {
                        handleSuspendClients(data, row);
                      }
                    }}
                    onCancel={() => console.log("Cancelled")}
                  />
                ),
              });
            }

            // ✅ If SUSPENDED → Show Reactivate
            if (row.status === "suspended") {
              actions.push({
                label: "Reactivate Client",
                iconUrl: "/icons/reactivateClient.svg",
                type: "popUp",
                component: (
                  <PopupForm
                    config={reactivateClientConfig}
                    width="500px"
                    onApply={() => {
                      if (handleReactivateClient) {
                        handleReactivateClient(row);
                      }
                    }}
                    onCancel={() => console.log("Cancelled")}
                  />
                ),
              });
            }
            return actions;
          },
        },
      },
    },
  ];
