"use client";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import DetailView from "@/components/modules/DetailView";
import {
  editOfferConfig,
  getOfferDetailsConfig,
} from "./config";


export const getColumns = (handleDeleteOffer) => [
  {
    key: "offerName",
    title: "Offer Name",
    component: {
      type: "phone",
      style: {
        color: "var(--color-black)",
      },
    },
  },

  {
    key: "couponCode",
    title: "Coupon Code",
    component: {
      type: "phone",
      style: {
        color: "var(--color-dull-text)",
      },
    },
  },
  {
    key: "discount",
    title: "Discount(%)",
    component: {
      type: "phone",
      style: {
        color: "var(--color-dull-text)",
      },
    },
  },
  {
    key: "date",
    title: "Validity",
    component: {
      type: "date",
      style: { color: "var(--color-dull-text)" },
      options: {
        format: "MM dd yyyy - MM dd yyyy", // Example: Jul 15, 2025
      },
    },
  },
  {
    key: "usageStats",
    title: "Usage Stats",
    component: {
      type: "phone",
      style: {
        color: "var(--color-dull-text)",
      },

      position: "start",
    },
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "4px",
        padding: "6px 10px",
      },
      options: {
        value: {
          used: "#02C8DE",
          active: "#097416",
          expired: "#BC0D10",
          inactive: "#7B7B7B",
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
          // console.log(row, "row");
          // default actions for other statuses
          return [
            {
              label: "View Offer",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              // component: <DetailView config={OfferDetailsConfig} />,
              component: () => (
                <DetailView config={getOfferDetailsConfig(row)} /> // ✅ Dynamic data-driven config
              ),
            },
            {
              label: "Edit Offer",
              iconUrl: "/icons/editBooking.svg",
              type: "sidebar",
              component: <DynamicForm config={editOfferConfig} />,
            },
            {
              label: "Delete Offer",
              iconUrl: "/icons/cancel.svg",
              type: "button",
              onClick: (row) => handleDeleteOffer(row),
            },
          ];
        },
      },
    },
  },
];
