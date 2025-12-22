"use client";

import DynamicForm from "@/components/modules/DynamicFormRendering";
import PopupForm from "@/components/ui/popupform";
import { cancelHolidayConfig, editHolidayConfig } from "./config";


export const Holiday_Columns = (handleDelete, handleEditHoliday) => [
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
      style: {
        color: "#7B7B7B",
      }
    },
  },
  {
    key: "day",
    title: "Day",
    component: {
      style: {
        color: "#7B7B7B",
      }
    },
  },
  {
    key: "occasion",
    title: "Occasion/Reason",
    component: {
      style: {
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
            component: (rowData) => (
              <DynamicForm
                config={editHolidayConfig}
                isEdit={true}
                initialValues={{
                  date: rowData.date?.split("T")[0],
                  occasion: rowData.occasion,
                  // description: rowData.description
                }}
                onApply={(formValues, closeSidebar) =>
                  handleEditHoliday(formValues, closeSidebar, rowData)
                }

              />
            ),

          },
          {
            label: "Delete Holiday",
            iconUrl: "/icons/deleteService.svg",
            type: "popUp",
            component: (rowData) => (
              <PopupForm
                config={cancelHolidayConfig}
                width="500px"
                onApply={() => handleDelete(rowData?._id)}
                onCancel={() => { }}
              />
            ),
          },
        ],
      },
    },
  },
];
