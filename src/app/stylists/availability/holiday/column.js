"use client";

import DynamicForm from "@/components/modules/DynamicFormRendering";
import PopupForm from "@/components/ui/popupform";
import { cancelHolidayConfig, editHolidayConfig } from "./config";


export const Holiday_Columns = [
  {
    key: "date",
    title: "Date",
   
    sortable: false,
    component: {
      type: "date",
      style: {},
      options: {
        format: "M d yyyy",
      },
       style:{
        color: "#7B7B7B",
      }
    },
  },
  {
    key: "day",
    title: "Day",
    component:{
      style:{
        color: "#7B7B7B",
      }
    },
  },
  {
    key: "reason",
    title: "Occasion/Reason",
    component: {
      style:{
        color: "#7B7B7B",
      }
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
            label: "Edit Holiday",
            iconUrl: "/icons/editService.svg",
            type: "sidebar",
            component: <DynamicForm config={editHolidayConfig} />,
          },
          {
            label: "Delete Holiday",
            iconUrl: "/icons/deleteService.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={cancelHolidayConfig}
                width="500px"
                onApply={(data) => console.log("Deleted:", data)}
                onCancel={() => console.log("Cancelled")}
              />
            ),
          },
        ],
      },
    },
  },
];
