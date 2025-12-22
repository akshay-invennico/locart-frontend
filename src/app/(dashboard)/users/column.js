"use client";

import { reactivateClientConfig } from "./config";
import PopupForm from "@/components/ui/popupform";

export const columns = [
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
      }
    },
  },
  {
    key: "totalBookings", title: "Total Booking", component: {
      style: {
        color: "#7B7B7B",
      }
    }
  },
  {
    key: "productOrders", title: "Product Orders", component: {
      style: {
        color: "#7B7B7B",
      }
    }
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
      }
    },
  },
  {
    key: "loyaltyPoints",
    title: "Loyalty Points",
    component: {
      style: {
        color: "#7B7B7B",
      }
    }
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
            label: "View Client",
            iconUrl: "/icons/show.svg",
            type: "navigate",
            url: (row) => `/users/details/overview/${row.id}`
            // url: "/users/details/overview/",
          },
          // {
          //   label: "Archive Client",
          //   iconUrl: "/icons/archiveClient.svg",
          //   type: "popUp",
          //   component: (
          //     <PopupForm
          //       config={archiveClientConfig}
          //       width="500px"
          //       height="500px"
          //       onApply={(data) => console.log("Archive applied:", data)}
          //       onCancel={() => console.log("Cancelled")}
          //     />
          //   ),
          // },
          {
            label: "Suspend Client",
            iconUrl: "/icons/suspendClient.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={reactivateClientConfig}
                width="500px"
                onApply={(data) => console.log("Reactivated:", data)}
                onCancel={() => console.log("Cancelled")}
              />
            ),
          },

          // {
          //   label: "Share Reset Password Link",
          //   iconUrl: "/icons/lock.svg",
          //   // type: "popUp",
          //   onClick: (data) => console.log("password Reset link send", data),
          // },
        ],
      },
    },
  },
];