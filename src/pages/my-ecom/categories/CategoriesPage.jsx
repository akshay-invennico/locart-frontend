import React, { useState, useEffect } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  deleteCategory,
  updateCategoryStatus,
  fetchCategoryById,
  createCategory,
  updateCategory,
} from "@/state/ecom/ecomSlice";
import { toast } from "sonner";
import SlidePanel from "@/components/feedback/SlidePanel";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import CreateCategoryForm from "./forms/CreateCategoryForm";
import EditCategoryForm from "./forms/EditCategoryForm";
import CategoryFilterForm from "./forms/CategoryFilterForm";
import CategoryDetailsView from "./CategoryDetailsView";
import Spinner from "@/components/common/Spinner";

const options = {
  select: true,
  order: false,
};

const CategoriesPage = () => {
  const [deletePopup, setDeletePopup] = useState({ show: false, row: null });
  const [bulkDeletePopup, setBulkDeletePopup] = useState({ show: false, rows: [] });

  const [showCreate, setShowCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);
  
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editInitialValues, setEditInitialValues] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filterFormValues, setFilterFormValues] = useState({});

  const dispatch = useDispatch();
  const { categories, pagination, loading } = useSelector(
    (state) => state.ecomOrders
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
            status: "active",
            type: "product",
            page: 1,
            limit: itemsPerPage,
          })
        );
      }, 500),
    [dispatch]
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
    try {
      const result = await dispatch(fetchCategoryById(id)).unwrap();
      setViewCategory(result);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch category details");
    }
  };

  const handleEditCategory = async (row) => {
    setEditCategoryId(row._id);
    setIsEditLoading(true);
    try {
      const res = await dispatch(fetchCategoryById(row._id)).unwrap();
      const d = res || {};
      const mapped = {
        name: d.name || "",
        description: d.description || "",
        image: d.image || "",
        status: d.status ? d.status.toLowerCase() : "inactive",
      };
      setEditInitialValues(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load category details for editing");
      setEditCategoryId(null);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleCreateCategory = async (data) => {
    if (!data?.name?.trim()) {
      toast.error("Category name is required.");
      return false;
    }
    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      type: "product",
      status: "active",
      category_photo: data.category_photo,
    };

    try {
      await dispatch(createCategory(payload)).unwrap();
      await dispatch(
        fetchAllCategories({ search: "", status: "", type: "product" })
      );
      setShowCreate(false);
      toast.success("Category created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    }
  };

  const handleUpdateCategory = async (data) => {
    if (!data?.name?.trim()) {
      toast.error("Category name is required.");
      return false;
    }
    const normalizedStatus = Array.isArray(data.status)
      ? data.status[0]
      : data.status;
    if (!normalizedStatus) {
      toast.error("Please select a category status.");
      return false;
    }

    const payload = {
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || "",
      type: "product",
      status: normalizedStatus,
    };

    if (payload.image) {
      payload.category_photo = payload.image;
      delete payload.image;
    }

    try {
      await dispatch(updateCategory({ categoryId: editCategoryId, payload })).unwrap();
      await dispatch(
        fetchAllCategories({ search: "", status: "", type: "product" })
      );
      setEditCategoryId(null);
      setEditInitialValues(null);
      toast.success("Category updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    }
  };

  useEffect(() => {
    dispatch(
      fetchAllCategories({
        search: searchText,
        status: "active",
        type: "product",
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  const formattedCategories = (categories || []).map((cat) => ({
    ...cat,
    category: {
      name: cat.categoryName,
      profile: cat.image || "/noimage.png",
    },
  }));

  const columns = getColumns(
    handleDeleteCategory,
    handleViewCategory,
    handleEditCategory,
    handleCategoryStatusUpdate
  );

  const applyFilters = (data) => {
    setFilterFormValues(data);

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
        page: 1,
        limit: itemsPerPage,
      })
    );
    setShowFilter(false);
  };

  const handleResetFilters = () => {
    setFilterFormValues({});
    dispatch(
      fetchAllCategories({
        search: searchText,
        status: "",
        type: "product",
        page: 1,
        limit: itemsPerPage,
      })
    );
    setShowFilter(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>
          
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
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
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        )}
        {!loading && <GridCommonComponent
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
              type: "button",
              onClick: (rows) => setBulkDeletePopup({ show: true, rows })
            },
          ]}
        />}
      </div>

      <ConfirmDialog
        open={deletePopup.show}
        onClose={() => setDeletePopup({ show: false, row: null })}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
      />

      <SlidePanel
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title=""
        width="sm:max-w-[600px]"
      >
        <CreateCategoryForm
          onSubmit={handleCreateCategory}
          onCancel={() => setShowCreate(false)}
        />
      </SlidePanel>

      <SlidePanel
        open={!!editCategoryId}
        onClose={() => {
          setEditCategoryId(null);
          setEditInitialValues(null);
        }}
        title=""
        width="sm:max-w-[600px]"
      >
        {isEditLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          editInitialValues && (
            <EditCategoryForm
              initialValues={editInitialValues}
              onSubmit={handleUpdateCategory}
              onCancel={() => {
                setEditCategoryId(null);
                setEditInitialValues(null);
              }}
            />
          )
        )}
      </SlidePanel>

      <SlidePanel
        open={showFilter}
        onClose={() => setShowFilter(false)}
        title="Filter Categories"
        width="sm:max-w-[400px]"
      >
        <CategoryFilterForm
          initialValues={filterFormValues}
          onApply={applyFilters}
          onReset={handleResetFilters}
          onCancel={() => setShowFilter(false)}
        />
      </SlidePanel>

      <SlidePanel
        open={!!viewCategory}
        onClose={() => setViewCategory(null)}
        title=""
        width="sm:max-w-[600px]"
      >
        <CategoryDetailsView
          category={viewCategory}
          onClose={() => setViewCategory(null)}
        />
      </SlidePanel>
    </div>
  );
};

export default CategoriesPage;
