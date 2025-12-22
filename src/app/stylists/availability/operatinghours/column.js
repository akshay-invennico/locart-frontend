"use client";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import PopupForm from "@/components/ui/popupform";
import TimeRangeCell from "@/components/ui/timerangecell";

export const OperatingHours_Columns = [
  {
    key: "day",
    title: "Day",
    component: {},
  },
  {
    key: "openTime",
    title: "Open Time",
    component: { type: "timeRange" },
  },
  {
    key: "closeTime",
    title: "Close Time",
    component: { type: "timeRange" },
  },

  {
    key: "actions",
    title: "Actions",
    component:{type:"toggle"},
  },

  // {
  //   key: "actions",
  //   title: "Actions",
  // //   component: {
  //     type: "action",
  //     style: {},
  //     options: {
  //       actions: [
  //         {
  //           label: "Edit Holiday",
  //           iconUrl: "/icons/editService.svg",
  //           type: "sidebar",
  //           component: <DynamicForm config={editHolidayConfig} />,
  //         },
  //         {
  //           label: "Delete Holiday",
  //           iconUrl: "/icons/deleteService.svg",
  //           type: "popUp",
  //           component: (
  //             <PopupForm
  //               config={cancelHolidayConfig}
  //               width="500px"
  //               onApply={(data) => console.log("Deleted:", data)}
  //               onCancel={() => console.log("Cancelled")}
  //             />
  //           ),
  //         },
  //       ],
  //     },
  //   },
  // },
];
