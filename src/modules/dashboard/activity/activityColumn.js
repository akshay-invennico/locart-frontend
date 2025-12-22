"use client";
export const activityColumns = [
  {
    key: "activity",
    title: "Activity",
    isPrimary: true,
    isObject: true,
    sortable: true,
    structure: {
      profile: "activity.profile",
      description: "activity.description",
      time: "activity.time",
    },
    component: {
      type: "activity_cell",
      style: {
        radius: "rounded-full",
        size: "w-10 h-10",
        border: "border border-gray-200",
      },
    },
    nonExpandable: true,
  },
];
