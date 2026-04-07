import React, { useState, useEffect } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import ActionComponent from "@/components/grid/actionComponent";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import {
  fetchAllProducts,
  updateProductStatus,
  deleteProduct,
  createProduct,
  updateProduct,
  fetchAllCategories,
  bulkUpdateProductStatus,
  bulkDeleteProducts,
  fetchProductById,
} from "@/state/ecom/ecomSlice";
import { useDispatch, useSelector } from "react-redux";
import { exportGridCSV, exportGridPDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";
import { SlidePanel, ConfirmDialog } from "@/components/feedback";
import ProductFilterForm from "./forms/ProductFilterForm";
import CreateProductForm from "./forms/CreateProductForm";
import EditProductForm from "./forms/EditProductForm";
import ProductDetailsView from "./ProductDetailsView";

const options = {
  select: true,
  order: false,
};

const ProductPage = () => {
  const [deletePopup, setDeletePopup] = useState({ show: false, row: null });
  const [bulkDeletePopup, setBulkDeletePopup] = useState({ show: false, rows: [] });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [detailContent, setDetailContent] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const { categories, products, pagination } = useSelector(
    (state) => state.ecomOrders
  );

  const [filters, setFilters] = useState({
    search: "",
    category: [],
    status: "",
    priceMin: "",
    priceMax: "",
    stockMin: "",
    stockMax: "",
    page: 1,
    limit: 10,
    type: "",
  });

  const dispatch = useDispatch();

  const categoryOptions = categories.map((c) => ({
    label: c.categoryName,
    value: c._id,
  }));

  useEffect(() => {
    dispatch(fetchAllProducts(filters));
  }, [filters]);

  useEffect(() => {
    dispatch(fetchAllCategories({ type: "product" }));
  }, [dispatch]);

  const handleDeleteProduct = (row) => {
    setDeletePopup({ show: true, row });
  };

  const confirmDeleteProduct = () => {
    if (!deletePopup.row) return;
    dispatch(deleteProduct(deletePopup.row._id))
      .unwrap()
      .then(() => {
        toast.success(`${deletePopup.row.productName} deleted successfully.`);
        setDeletePopup({ show: false, row: null });
        dispatch(fetchAllProducts(filters));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete product.");
      });
  };

  const handleViewProduct = async (id) => {
    try {
      const result = await dispatch(fetchProductById(id)).unwrap();
      setDetailContent(
        <ProductDetailsView product={result} />
      );
      setShowDetailPanel(true);
    } catch (e) {
      toast.error("Failed to load product details");
    }
  };

  const handleProductStatusUpdate = (productId, status) => {
    dispatch(updateProductStatus({ productId, status }))
      .unwrap()
      .then(() => {
        toast.success(`Product status updated to ${status}.`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update product status.");
      });
  };

  const handleCreateProduct = async (data) => {
    const formData = new FormData();

    if (data.products) {
      const files = Array.isArray(data.products)
        ? data.products
        : [data.products];
      files.forEach((file) => {
        formData.append("products", file);
      });
    }

    formData.append("name", data.productName);
    formData.append("unit_price", data.price);
    formData.append("stock_quantity", data.stock);
    formData.append("description", data.description);

    data.category?.forEach((catId) => {
      formData.append("category_id[]", catId);
    });

    const res = await dispatch(createProduct(formData));

    if (createProduct.fulfilled.match(res)) {
      toast.success("Product created successfully");
      setShowCreatePanel(false);
      await dispatch(fetchAllProducts(filters));
    }
  };

  const handleBulkStatusUpdate = (rows) => {
    const ids = rows.map((r) => r._id);
    const currentStatus = rows[0].status?.toLowerCase();
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    dispatch(bulkUpdateProductStatus({ productIds: ids, status: newStatus }))
      .unwrap()
      .then(() => {
        toast.success(`Products marked as ${newStatus}.`);
        dispatch(fetchAllProducts(filters));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update product status.");
      });
  };

  const handleBulkDelete = (selectedRows) => {
    const ids = selectedRows.map((r) => r._id);

    dispatch(bulkDeleteProducts({ productIds: ids }))
      .unwrap()
      .then(() => {
        toast.success("Products deleted successfully");
        setBulkDeletePopup({ show: false, rows: [] });
        dispatch(fetchAllProducts(filters));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete products");
      });
  };

  const handleUpdateProductSubmit = async (data, originalProduct) => {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.unit_price) formData.append("unit_price", data.unit_price);
    if (data.stock_quantity) formData.append("stock_quantity", data.stock_quantity);
    if (data.category_id) {
      const categoryIds = Array.isArray(data.category_id)
        ? data.category_id
        : [data.category_id];
      categoryIds.forEach((catId) => {
        if (catId) formData.append("category_id[]", catId);
      });
    }

    if (data.new_images && data.new_images.length > 0) {
      if (typeof data.new_images === "string") {
        // skip
      } else if (data.new_images instanceof FileList || Array.isArray(data.new_images)) {
        Array.from(data.new_images).forEach((file) => {
          formData.append("products", file);
        });
      } else if (data.new_images instanceof File) {
        formData.append("products", data.new_images);
      }
    }

    const keptImages = data.product_images || [];
    const imagesToDelete = originalProduct.images.filter(
      (oldImg) => !keptImages.includes(oldImg)
    );

    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach((img) => formData.append("images_to_delete[]", img));
    }

    try {
      await dispatch(
        updateProduct({
          productId: originalProduct._id,
          formData,
        })
      ).unwrap();

      toast.success("Product updated successfully");
      setShowEditPanel(false);
      setEditProduct(null);
      dispatch(fetchAllProducts(filters));
    } catch (error) {
      console.error("Update failed", error);
      toast.error(error.message || "Failed to update product");
    }
  };

  const handleEditProduct = async (id) => {
    try {
      const product = await dispatch(fetchProductById(id)).unwrap();
      setEditProduct(product);
      setShowEditPanel(true);
    } catch (error) {
      toast.error("Failed to load product details");
    }
  };

  const handleFilterSubmit = (values) => {
    setFilters((prev) => ({ ...prev, ...values, page: 1 }));
    setShowFilterPanel(false);
  };

  const handleFilterReset = () => {
    setFilters({
      search: "",
      category: [],
      status: "",
      priceMin: "",
      priceMax: "",
      stockMin: "",
      stockMax: "",
      page: 1,
      limit: 10,
      type: "",
    });
  };

  const downloadActions = [
    { header: "Download List" },
    {
      label: "Download PDF",
      icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridPDF({
          rows: products,
          columns: getColumns(),
          filename: `products.pdf`,
          title: "Products Details",
        });
      },
    },
    {
      label: "Download CSV",
      icon: <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridCSV({
          rows: products,
          columns: getColumns(),
          filename: `products.csv`,
        });
      },
    },
  ];

  const columns = getColumns(
    handleDeleteProduct,
    handleProductStatusUpdate,
    handleViewProduct,
    handleEditProduct
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        {/* Buttons container */}
        <div className="flex items-center gap-2">
          {/* Download */}
          <ActionComponent
            actions={downloadActions}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

          {/* Filter */}
          <button
            onClick={() => setShowFilterPanel(true)}
            className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>

          {/* Create Product */}
          <button
            onClick={() => setShowCreatePanel(true)}
            className="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          >
            <img
              src="/icons/plusbutton.svg"
              alt="Create Product"
              width={18}
              height={18}
            />
            <span className="hidden sm:inline">Create Product</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={products || []}
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
            onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
          }}
          bulkActionsConfig={[
            {
              label: "Mark As Active/InActive",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: (rows) => handleBulkStatusUpdate(rows),
            },
            {
              label: "Delete Product",
              iconUrl: "/icons/archiveClient.svg",
              type: "popUp",
              onClick: (rows) => setBulkDeletePopup({ show: true, rows }),
            },
          ]}
        />
      </div>

      {/* Filter Panel */}
      <SlidePanel
        open={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        width="sm:max-w-md"
      >
        <ProductFilterForm
          initialValues={filters}
          onSubmit={handleFilterSubmit}
          onReset={handleFilterReset}
        />
      </SlidePanel>

      {/* Create Product Panel */}
      <SlidePanel
        open={showCreatePanel}
        onClose={() => setShowCreatePanel(false)}
        width="sm:max-w-lg"
      >
        <CreateProductForm
          categoryOptions={categoryOptions}
          onSubmit={handleCreateProduct}
          onCancel={() => setShowCreatePanel(false)}
        />
      </SlidePanel>

      {/* Edit Product Panel */}
      <SlidePanel
        open={showEditPanel}
        onClose={() => {
          setShowEditPanel(false);
          setEditProduct(null);
        }}
        width="sm:max-w-lg"
      >
        {editProduct && (
          <EditProductForm
            product={editProduct}
            categoryOptions={categoryOptions}
            onSubmit={handleUpdateProductSubmit}
            onCancel={() => {
              setShowEditPanel(false);
              setEditProduct(null);
            }}
          />
        )}
      </SlidePanel>

      {/* View Product Detail Panel */}
      <SlidePanel
        open={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        width="sm:max-w-[600px]"
      >
        {detailContent}
      </SlidePanel>

      {/* Delete Single Product Dialog */}
      <ConfirmDialog
        open={deletePopup.show}
        onClose={() => setDeletePopup({ show: false, row: null })}
        title="Delete Product?"
        description="Are you sure you want to delete this Product? This action will notify the Clients and initiate the removal process. Once deleted, this action cannot be undone."
        confirmLabel="Delete Product"
        confirmVariant="destructive"
        onConfirm={confirmDeleteProduct}
      />

      {/* Bulk Delete Products Dialog */}
      <ConfirmDialog
        open={bulkDeletePopup.show}
        onClose={() => setBulkDeletePopup({ show: false, rows: [] })}
        title="Delete Selected Products?"
        description="Are you sure you want to delete the selected Products? This action will notify the Clients and initiate the removal process. Once deleted, this action cannot be undone."
        confirmLabel="Delete Products"
        confirmVariant="destructive"
        onConfirm={() => handleBulkDelete(bulkDeletePopup.rows)}
      />
    </div>
  );
};

export default ProductPage;
