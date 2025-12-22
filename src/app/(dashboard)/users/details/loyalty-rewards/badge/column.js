"use client";
export const columns = [
  
 {
    key: "badge_name",
    title: "Badge Name",
    sortable:true,
    component: {
      type: "",
      style: { text:"text-gray-900"},
      options: {},
    },
  },
  {
    key: "description",
    title: "Description",
    sortable:true,
    component: {
      type: "",
      style: { text:"text-gray-500"},
      options: {},
    },
  },
{
    key: "date_time",
    title: "Date & Time",
    component: {
      type: "date",
      options: {
        format: "MM dd yyyy",
      },
    },
  },
];
