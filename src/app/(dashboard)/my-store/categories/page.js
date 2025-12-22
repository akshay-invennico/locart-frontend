"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getColumns } from "./column";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import Image from "next/image";
import {
  cannotDeleteCategoryConfig,
  CategoryFilterConfig,
  createCategoryConfig,
  DeleteCategoryConfig,
  DeleteCategoryConfigAll,
  getViewCategoryDetailsConfig,
} from "./config";
import PopupForm from "@/components/ui/popupform";
import {
  fetchAllCategories,
  createCategory,
  fetchCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "@/state/ecom/ecomSlice";
import { toast } from "sonner";
import DetailView from "@/components/modules/DetailView";
import EditCategoryLoader from "./column";

const options = {
  select: true,
  order: false,
};

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.ecomOrders
  );

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCannotDeletePopup, setShowCannotDeletePopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sidebarContent, setSidebarContent] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    type: "service",
  });

  const handleCancelOrder = (row) => {
    setSelectedOrder(row);
    // setShowCancelPopup(true);
    if (row.status === "active") {
      setShowCannotDeletePopup(true);
    } else {
      setShowDeletePopup(true);
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);

    dispatch(
      fetchAllCategories({
        search: e.target.value,
        status: filters.status,
        type: "service",
      })
    );
  };

  const handleCreateCategory = async (data) => {
    const payload = {
      category_photo: data.category_photo,
      name: data.name,
      description: data.description,
      type: "service",
      status: "active",
      categories: data.categories,
    };
    try {
      await dispatch(createCategory(payload)).unwrap();

      await dispatch(
        fetchAllCategories({
          search: "",
          status: "",
          type: "service",
        })
      ).unwrap();

      toast.success("Category created successfully");

      setSidebarContent(null);
    } catch (error) {
      console.error("Create category error:", error);
      toast.error("Failed to create category");
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

  const handleCategoryStatusUpdate = async (categoryId, status) => {
    const normalizedStatus = status.toLowerCase();
    try {
      await dispatch(
        updateCategoryStatus({ categoryId, status: normalizedStatus })
      ).unwrap();
      toast.success(`Category marked as ${normalizedStatus}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(`Failed to update status`);
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
      type: "service",
      status: Array.isArray(data.status) ? data.status[0] : data.status,
    };

    if (payload.image) {
      payload.category_photo = payload.image;
      delete payload.image;
    }

    try {
      await dispatch(updateCategory({ categoryId: id, payload })).unwrap();

      await dispatch(
        fetchAllCategories({ search: "", status: "", type: "service" })
      ).unwrap();

      toast.success("Category updated successfully");
      setSidebarContent(null);
    } catch (error) {
      console.error("Update category error:", error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedOrder?._id) return;

    try {
      await dispatch(deleteCategory(selectedOrder._id)).unwrap();
      await dispatch(
        fetchAllCategories({
          search: searchValue,
          status: filters.status,
          type: "service",
        })
      ).unwrap();

      toast.success("Category deleted successfully");
      setShowDeletePopup(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    dispatch(
      fetchAllCategories({
        search: "",
        status: filters.status,
        type: "service",
      })
    );
  }, [dispatch, filters.status]);

  const handleApplyFilter = (data) => {
    const selectedStatuses = data.status || [];

    let mappedStatus = "";
    if (
      selectedStatuses.includes("Active") &&
      !selectedStatuses.includes("Inactive")
    ) {
      mappedStatus = "active";
    } else if (
      !selectedStatuses.includes("Active") &&
      selectedStatuses.includes("Inactive")
    ) {
      mappedStatus = "inactive";
    } else {
      mappedStatus = "";
    }

    dispatch(
      fetchAllCategories({
        search: searchValue,
        status: mappedStatus,
        type: "service",
      })
    );

    setFilters({ status: mappedStatus });
  };

  const columns = getColumns(
    handleCancelOrder,
    handleViewCategory,
    handleUpdateCategory,
    handleEditCategory,
    setSidebarContent,
    handleCategoryStatusUpdate
  );

  const formattedCategories = (categories || []).map((cat) => ({
    ...cat,
    category: {
      name: cat.categoryName,
      profile: cat.image || "/noimage.png",
    },
  }));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={searchValue}
            onChange={handleSearch}
          />
        </div>

        {/* Buttons container */}
        <div className="flex items-center gap-2">
          {/* Filter */}
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={CategoryFilterConfig}
                    onApply={(data) => handleApplyFilter(data)}
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
          data={formattedCategories || []}
          options={options}
          //  columns={columns}
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
              label: "Delete Category",
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

      {showDeletePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowDeletePopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PopupForm
              config={DeleteCategoryConfig}
              width="600px"
              onApply={handleDeleteCategory}
              onCancel={() => setShowDeletePopup(false)}
            />
          </div>
        </div>
      )}

      {/* Cannot Delete Popup */}
      {showCannotDeletePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCannotDeletePopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PopupForm
              config={cannotDeleteCategoryConfig} // <-- Your new config
              width="400px"
              onApply={() => setShowCannotDeletePopup(false)}
              onCancel={() => setShowCannotDeletePopup(false)}
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
