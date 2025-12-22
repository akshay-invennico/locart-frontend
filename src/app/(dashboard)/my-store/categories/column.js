"use client";
import ViewUser from "../../users/viewUser";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import DetailView from "@/components/modules/DetailView";
import {
  editCategoryConfig,
  ViewCategoryDetailsConfig,
  getEditCategoryConfig,
} from "./config";
import { useDispatch } from "react-redux";
import { fetchCategoryById } from "@/state/ecom/ecomSlice";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";

const EditCategoryLoader = ({ rowData, children }) => {
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await dispatch(fetchCategoryById(rowData?._id)).unwrap();
        const d = res || {};

        const mapped = {
          name: d.name || "",
          description: d.description || "",
          image: d.image || "",
          status: d.status ? [d.status.toLowerCase()] : ["inactive"],
        };

        if (mounted) setInitialValues(mapped);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [rowData?._id, dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );

  return children(initialValues);
};

export default EditCategoryLoader;

export const getColumns = (
  handleCancelOrder,
  handleViewCategory,
  handleUpdateCategory,
  handleEditCategory,
  setSidebarContent,
  handleCategoryStatusUpdate
) => [
    {
      key: "category",
      title: "Category",
      isPrimary: true,
      isObject: true,
      structure: {
        name: "categoryName",
        profile: "profile",
      },
      component: {
        type: "standard_avatar",
        style: {
          radius: "rounded-md",
          border: "border border-[#00A78E]",
        },
      },
    },
    {
      key: "productsCount",
      title: "Attached Services",
      component: {
        type: "phone",
        style: { color: "var(--color-dull-text)", fontWeight: "500" },
      },
    },

    {
      key: "status",
      title: "Status",
      component: {
        type: "badge",
        style: {
          borderRadius: "3.15px",
          padding: "8px 12px",
        },
        options: {
          value: {
            active: "#097416",
            inactive: "#9CA3AF",
            used: "#BC0D10",
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
            // row.status determines which actions to show
            if (row.status === "Inactive") {
              return [
                {
                  label: "View Category",
                  iconUrl: "/icons/show.svg",
                  type: "sidebar",
                  onClick: (row) => handleViewCategory(row._id),
                },
                {
                  label: "Edit Category",
                  iconUrl: "/icons/editBooking.svg",
                  type: "sidebar",
                  onClick: (row) =>
                    setSidebarContent(
                      <EditCategoryLoader rowData={row}>
                        {(initialValues) => (
                          <DynamicForm
                            config={getEditCategoryConfig()}
                            isEdit={true}
                            initialValues={initialValues}
                            onApply={(values) =>
                              handleUpdateCategory(row._id, values)
                            }
                            onCancel={() => setSidebarContent(null)}
                          />
                        )}
                      </EditCategoryLoader>
                    ),
                },
                {
                  label: "Mark As Active",
                  iconUrl: "/icons/markCompleted.svg",
                  type: "button",
                  onClick: () =>
                    handleCategoryStatusUpdate(
                      row._id,
                      row.status.toLowerCase() === "active"
                        ? "inactive"
                        : "active"
                    ),
                },

                {
                  label: "Delete Category",
                  iconUrl: "/icons/deleteProduct.svg",
                  type: "button",
                  onClick: (row) => handleCancelOrder(row),
                },
              ];
            }

            // default actions for other statuses
            return [
              {
                label: "View Category",
                iconUrl: "/icons/show.svg",
                type: "sidebar",
                onClick: (row) => handleViewCategory(row._id),
              },
              {
                label: "Edit Category",
                iconUrl: "/icons/editBooking.svg",
                type: "sidebar",
                onClick: (row) =>
                  setSidebarContent(
                    <EditCategoryLoader rowData={row}>
                      {(initialValues) => (
                        <DynamicForm
                          config={getEditCategoryConfig()}
                          isEdit={true}
                          initialValues={initialValues}
                          onApply={(values) =>
                            handleUpdateCategory(row._id, values)
                          }
                          onCancel={() => setSidebarContent(null)}
                        />
                      )}
                    </EditCategoryLoader>
                  ),
              },
              {
                label: "Mark As InActive",
                iconUrl: "/icons/markCompleted.svg",
                type: "button",
                onClick: () =>
                  handleCategoryStatusUpdate(
                    row._id,
                    row.status.toLowerCase() === "active" ? "inactive" : "active"
                  ),
              },

              {
                label: "Delete Category",
                iconUrl: "/icons/deleteProduct.svg",
                type: "button",
                onClick: (row) => handleCancelOrder(row),
              },
            ];
          },
        },
      },
    },
  ];
