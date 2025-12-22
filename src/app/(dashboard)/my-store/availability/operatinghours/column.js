"use client";

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
  }
];
