import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { SlidePanel, ConfirmDialog } from "@/components/feedback";

import { getColumns } from "./columns";
import EditCategoryLoader from "./columns";
import CreateCategoryForm from "./forms/CreateCategoryForm";
import CategoryFilterForm from "./forms/CategoryFilterForm";
import CategoryDetailsView from "./CategoryDetailsView";
import {
  fetchAllCategories,
  createCategory,
  fetchCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "@/state/ecom/ecomSlice";

const options = { select: true, order: false };

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error, pagination } = useSelector(
    (state) => state.ecomOrders
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filterFormValues, setFilterFormValues] = useState({});
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({ status: "", type: "service" });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCannotDeletePopup, setShowCannotDeletePopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sidebarContent, setSidebarContent] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value) => {
        setCurrentPage(1);
        dispatch(
          fetchAllCategories({
            search: value,
            status: filters.status,
            type: "service",
            page: 1,
            limit: itemsPerPage,
          })
        );
      }, 500),
    [dispatch, filters.status]
  );

  const handleCancelOrder = (row) => {
    setSelectedOrder(row);
    if (row.status === "active") {
      setShowCannotDeletePopup(true);
    } else {
      setShowDeletePopup(true);
    }
  };

  const handleCreateCategory = async (values, { resetForm }) => {
    if (!values?.name?.trim()) {
      toast.error("Category name is required.");
      return;
    }
    const payload = {
      category_photo: values.category_photo,
      name: values.name.trim(),
      description: values.description?.trim() || "",
      type: "service",
      status: "active",
      categories: values.categories,
    };
    try {
      await dispatch(createCategory(payload)).unwrap();
      await dispatch(
        fetchAllCategories({
          search: "",
          status: "",
          type: "service",
          page: 1,
          limit: itemsPerPage,
        })
      ).unwrap();
      toast.success("Category created successfully");
      setAddOpen(false);
      resetForm();
    } catch (error) {
      console.error("Create category error:", error);
      toast.error("Failed to create category");
    }
  };

  const handleViewCategory = async (id) => {
    const result = await dispatch(fetchCategoryById(id)).unwrap();
    setSidebarContent(
      <CategoryDetailsView category={result} onClose={() => setSidebarContent(null)} />
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
      toast.error("Failed to update status");
    }
  };

  const handleUpdateCategory = async (id, data) => {
    if (!data?.name?.trim()) {
      toast.error("Category name is required.");
      return;
    }
    const normalizedStatus = data.status || "inactive";
    if (!normalizedStatus) {
      toast.error("Please select a category status.");
      return;
    }

    const payload = {
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || "",
      type: "service",
      status: normalizedStatus,
    };

    if (payload.image) {
      payload.category_photo = payload.image;
      delete payload.image;
    }

    try {
      await dispatch(updateCategory({ categoryId: id, payload })).unwrap();
      await dispatch(
        fetchAllCategories({
          search: "",
          status: "",
          type: "service",
          page: currentPage,
          limit: itemsPerPage,
        })
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
          page: currentPage,
          limit: itemsPerPage,
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
        search: searchValue,
        status: filters.status,
        type: "service",
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, filters.status, currentPage]);

  const handleApplyFilter = (data) => {
    setFilterFormValues(data);

    const selectedStatuses = Array.isArray(data.status) ? data.status : [];
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
        page: 1,
        limit: itemsPerPage,
      })
    );

    setFilters({ status: mappedStatus });
    setFilterOpen(false);
  };

  const handleResetFilter = () => {
    setFilterFormValues({});
    setFilters({ status: "", type: "service" });
    dispatch(
      fetchAllCategories({
        search: searchValue,
        status: "",
        type: "service",
        page: 1,
        limit: itemsPerPage,
      })
    );
    setFilterOpen(false);
  };

  const columns = getColumns(
    handleCancelOrder,
    handleViewCategory,
    handleUpdateCategory,
    null,
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
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
            onClick={() => setFilterOpen(true)}
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
            onClick={() => setAddOpen(true)}
          >
            <img
              src="/icons/plusbutton.svg"
              alt="Create Category"
              width={18}
              height={18}
            />
            <span className="hidden sm:inline">Create Category</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={formattedCategories || []}
          options={options}
          columns={columns?.map((col) => {
            if (col.key === "actions") {
              return {
                ...col,
                component: {
                  ...col.component,
                  options: {
                    ...col.component.options,
                    actions: (row) => col.component.options.actions(row),
                  },
                },
              };
            }
            return col;
          })}
          pagination={{
            currentPage: pagination?.page || 1,
            totalPages: pagination?.totalPages || 1,
            totalItems: pagination?.total || 0,
            itemsPerPage: pagination?.limit || 10,
            onPageChange: (page) => setCurrentPage(page),
          }}
          theme={{ border: "border-gray-300", header: { bg: "bg-gray-100" } }}
          bulkActionsConfig={[
            {
              label: "Delete Category",
              iconUrl: "/icons/deleteProduct.svg",
              type: "popUp",
              component: (
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Remove Selected Category?
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    Are you sure you want to delete this Category?
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    This action will notify the Clients and initiate the removal
                    process. Once cancelled, this Category cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded">
                      Cancel
                    </button>
                    <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded">
                      Delete Selection
                    </button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Delete Popup */}
      <ConfirmDialog
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category?"
        description="Are you sure you want to delete this Category? This action will notify the Clients and initiate the removal process. Once deleted, this Category cannot be undone."
        confirmLabel="Delete Category"
        confirmVariant="destructive"
      />

      {/* Cannot Delete Popup */}
      <ConfirmDialog
        open={showCannotDeletePopup}
        onClose={() => setShowCannotDeletePopup(false)}
        onConfirm={() => setShowCannotDeletePopup(false)}
        title="Cannot Delete Category"
        description="This category cannot be deleted because there are products currently listed under it. Please remove the products before attempting to delete the category."
        confirmLabel="Back To Main Page"
        cancelLabel="Close"
      />

      {/* Add Category Sidebar */}
      <SlidePanel
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title=""
        width="sm:max-w-lg"
      >
        <CreateCategoryForm
          onSubmit={handleCreateCategory}
          onCancel={() => setAddOpen(false)}
        />
      </SlidePanel>

      {/* Filter Sidebar */}
      <SlidePanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title=""
        width="sm:max-w-md"
      >
        <CategoryFilterForm
          initialValues={filterFormValues}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
          onCancel={() => setFilterOpen(false)}
        />
      </SlidePanel>

      {/* Generic sidebar for view/edit actions from columns */}
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
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
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
