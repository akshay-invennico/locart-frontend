"use client";


export const columns = [
  {
    key: "points",
    title: "points",
    component: {
      type: "phone",
      style: {
        color: "#00A78E",
      },
      option: {
        sign: "",
        position: "start",
      },
    },
  },
  {
    key: "date_time",
    title: "Date",
    component: {
      type: "date",
      options: {
        format: "MM dd yyyy",
      },
    },
  },

  {
    key: "action",
    title: "Action Type",
    sortable: true,
    component: {
      type: "",
      style: { text: "text-gray-500" },
      options: {},
    },
  },
  {
    key: "description",
    title: "Description",
    sortable: true,
    component: {
      type: "",
      style: { text: "text-gray-500" },
      options: {},
    },
  },
];
