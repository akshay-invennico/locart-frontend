"use client";

import React, { useEffect, useState } from "react";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import PopupForm from "@/components/ui/popupform";
import {
  addServiceConfig,
  cancelServiceConfig,
  editServiceConfig,
} from "./config";
import { getServiceById } from "@/state/store/storeService";
import Spinner from "@/components/common/Spinner";

const EditServiceLoader = ({ rowData, data, onEdit, categoryOptions = [] }) => {
  const current = rowData || data || {};

  console.log("EditServiceLoader - Current row data:", current);

  const initialValues = {
    name: current.name || "",
    icon: current.icon || "",
    description: current.description || "",
    duration: current.duration ? String(current.duration) : "",
    base_price: current.base_price ? String(current.base_price) : "",
    status: current.status
      ? current.status.charAt(0).toUpperCase() + current.status.slice(1)
      : "Active",
    category_id: current.category_id || "",
  };

  console.log("Initial values for form:", initialValues);

  return (
    <DynamicForm
      key={`edit-${current._id}`}
      config={editServiceConfig(categoryOptions)}
      initialValues={initialValues}
      recordKey={current._id}
      isEdit={true}
      width="600px"
      onApply={(formData) => {
        console.log("Submitting edit:", formData);
        onEdit(current._id, formData);
      }}
      onCancel={() => console.log("edit cancelled")}
    />
  );
};

export const createColumns = ({ onDelete, onEdit, categoryOptions }) => [
  {
    key: "serviceName",
    title: "Service Name",
    isObject: true,
    sortable: true,
    structure: {
      name: "name",
      profile: "profile",
    },
    component: {
      type: "standard_avatar",
      style: { radius: "rounded-full" },
    },
  },
  {
    key: "category_id",
    title: "Category",
    render: (value) => {
      if (!value) return "N/A";
      if (typeof value === "object" && value.name) {
        return value.name;
      }
      if (typeof value === "string") {
        const category = categoryOptions?.find((cat) => cat.value === value);
        return category ? category.label : value;
      }

      return "N/A";
    },
  },
  {
    key: "duration",
    title: "Duration",
  },
  {
    key: "base_price",
    title: "Price",
    component: {
      type: "currency",
      sign: "$",
      position: "start",
    },
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: { borderRadius: "0.15rem" },
      options: {
        value: {
          active: "#00A78E",
          completed: "#9CA3AF",
          cancelled: "#EF4444",
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
        actions: [
          {
            label: "Edit Service",
            iconUrl: "/icons/editService.svg",
            type: "sidebar",
            component: (rowData) => (
              <EditServiceLoader
                rowData={rowData}
                onEdit={onEdit}
                categoryOptions={categoryOptions}
              />
            ),
          },
          {
            label: "Delete Service",
            iconUrl: "/icons/deleteService.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={cancelServiceConfig}
                width="500px"
                onApply={(data, rowData) => onDelete(rowData)}
                onCancel={() => console.log("Cancelled")}
              />
            ),
          },
        ],
      },
    },
  },
];
