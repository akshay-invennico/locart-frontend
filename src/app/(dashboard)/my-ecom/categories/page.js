"use client";
import React, { useState, useEffect } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import EditCategoryLoader, { getColumns } from "./column";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react"; // Import the search icon
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import Image from "next/image";
import {
  CategoryFilterConfig,
  createCategoryConfig,
  DeleteCategoryConfig,
  DeleteCategoryConfigAll,
} from "./config";
import PopupForm from "@/components/ui/popupform";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  deleteCategory,
  updateCategoryStatus,
  fetchCategoryById,
  createCategory,
  updateCategory,
} from "@/state/ecom/ecomSlice";
import DetailView from "@/components/modules/DetailView";
import { getViewCategoryDetailsConfig, getEditCategoryConfig } from "./config";
import { toast } from "sonner";

const options = {
  select: true,
  order: false,
};

const CategoryPage = () => {
  const [deletePopup, setDeletePopup] = useState({ show: false, row: null });
  const [sidebarContent, setSidebarContent] = useState(null);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.ecomOrders
  );

  const handleDeleteCategory = (row) => {
    setDeletePopup({ show: true, row });
  };

  const confirmDeleteCategory = async () => {
    if (!deletePopup.row) return;
    try {
      await dispatch(deleteCategory(deletePopup.row._id)).unwrap();
      toast.success(`${deletePopup.row.categoryName} deleted successfully`);
      setDeletePopup({ show: false, row: null });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete ${deletePopup.row?.categoryName}`);
    }
  };

  const handleCategoryStatusUpdate = async (categoryId, status) => {
    const normalizedStatus = status.toLowerCase();
    try {
      await dispatch(
        updateCategoryStatus({ categoryId, status: normalizedStatus })
      ).unwrap();
      toast.success(`Category status updated to ${normalizedStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category status");
    }
  };

  const handleViewCategory = async (id) => {
    const result = await dispatch(fetchCategoryById(id)).unwrap();

    setSidebarContent(
      <DetailView
        config={getViewCategoryDetailsConfig(result)}
        width="600px"
        onCancel={() => setSidebarContent(null)}
      />
    );
  };

  const handleCreateCategory = async (data) => {
    const payload = {
      name: data.name,
      description: data.description,
      type: "product",
      status: "active",
      category_photo: data.category_photo,
    };

    try {
      await dispatch(createCategory(payload)).unwrap();
      await dispatch(
        fetchAllCategories({ search: "", status: "", type: "product" })
      );
      setSidebarContent(null);
      toast.success("Category created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    }
  };

  const handleEditCategory = (id) => {
    setSidebarContent(
      <EditCategoryLoader rowData={{ _id: id }} onEdit={handleUpdateCategory} />
    );
  };

  const handleUpdateCategory = async (id, data) => {
    const payload = {
      ...data,
      type: "product",
      status: Array.isArray(data.status) ? data.status[0] : data.status,
    };

    if (payload.image) {
      payload.category_photo = payload.image;
      delete payload.image;
    }

    try {
      await dispatch(updateCategory({ categoryId: id, payload })).unwrap();
      await dispatch(
        fetchAllCategories({ search: "", status: "", type: "product" })
      );
      setSidebarContent(null);
      toast.success("Category updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    }
  };

  useEffect(() => {
    dispatch(
      fetchAllCategories({ search: "", status: "active", type: "product" })
    );
  }, [dispatch]);

  const formattedCategories = (categories || []).map((cat) => ({
    ...cat,
    category: {
      name: cat.categoryName,
      profile: cat.image || "/noimage.png",
    },
  }));

  const columns = getColumns(
    handleDeleteCategory,
    handleCategoryStatusUpdate,
    handleViewCategory,
    handleEditCategory,
    handleUpdateCategory,
    setSidebarContent
  );

  const applyFilters = (data) => {
    const getCheckboxValues = (prefix) => {
      return Object.keys(data)
        .filter((k) => k.startsWith(`${prefix}_`) && data[k])
        .map((k) => k.replace(`${prefix}_`, ""));
    };

    const statusObj = getCheckboxValues("status");
    const status = statusObj.includes("All") ? "" : statusObj[0] || "";

    dispatch(
      fetchAllCategories({
        search: searchText,
        status: status.toLowerCase(),
        type: "product",
      })
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Buttons container */}
        <div className="flex items-center gap-2">
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={{
                      ...CategoryFilterConfig,
                      footer: {
                        ...CategoryFilterConfig.footer,
                        apply: {
                          ...CategoryFilterConfig.footer.apply,
                          onClick: applyFilters,
                        },
                      },
                    }}
                  />
                ),
              },
            ]}
            icon={<Filter className="w-4 h-4 text-[#02C8DE]" />}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          />

          {/* Create Product */}
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={createCategoryConfig}
                    onApply={handleCreateCategory}
                  />
                ),
              },
            ]}
            icon={
              <Image
                src="/icons/plusbutton.svg"
                alt="Create In-Store Order"
                width={18}
                height={18}
              />
            }
            text={<span className="hidden sm:inline">Create Category</span>}
            buttonClassName="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          />
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={formattedCategories}
          options={options}
          columns={columns?.map((col) => {
            if (col.key === "actions") {
              return {
                ...col,
                component: {
                  ...col.component,
                  options: {
                    ...col.component.options,
                    actions: (row) => col.component.options.actions(row), // pass row dynamically
                  },
                },
              };
            }
            return col;
          })}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
          bulkActionsConfig={[
            {
              label: "Delete Product",
              iconUrl: "/icons/deleteProduct.svg",
              type: "popUp",
              component: (
                <PopupForm
                  config={DeleteCategoryConfigAll}
                  width="500px"
                  height="500px"
                  onApply={(data) => console.log("Archive applied:", data)}
                  onCancel={() => console.log("Cancelled")}
                />
              ),
            },
          ]}
        />
      </div>

      {deletePopup.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 shadow-md rounded-md"
          onClick={() => setDeletePopup({ show: false, row: null })} // click outside closes
        >
          <div onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* prevent closing when clicking inside */}
            <PopupForm
              config={DeleteCategoryConfig}
              width="600px"
              onApply={confirmDeleteCategory}
              onCancel={() => setDeletePopup({ show: false, row: null })}
            />
          </div>
        </div>
      )}

      {sidebarContent && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/30"
          onClick={() => setSidebarContent(null)}
        >
          <div
            className="h-full w-[600px] bg-white shadow-lg overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSidebarContent(null)}
            >
              ✕
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </div>
  );
};
export default CategoryPage;
