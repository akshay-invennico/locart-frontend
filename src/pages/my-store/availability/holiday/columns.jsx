export const getHolidayColumns = (handleDelete, handleEditHoliday) => [
  {
    key: "date",
    title: "Date",
    sortable: false,
    component: {
      type: "date",
      options: {
        format: "MMM dd yyyy",
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
      options: {
        actions: (row) => [
          {
            label: "Edit Holiday",
            iconUrl: "/icons/editService.svg",
            type: "sidebar",
            onClick: (row) => handleEditHoliday(row)
          },
          {
            label: "Delete Holiday",
            iconUrl: "/icons/deleteService.svg",
            type: "button",
            onClick: (row) => handleDelete(row)
          },
        ],
      },
    },
  },
];
