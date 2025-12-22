"use client";
import React, { useState, useEffect } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";

import { getColumns } from "./column";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react"; // Import the search icon
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import Image from "next/image";
import { getProductDetailsConfig } from "./config";
import PopupForm from "@/components/ui/popupform";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import { ProductFilterConfig } from "./config";
import { createProductConfig } from "./config";
import { DeleteProductConfig } from "./config";
import { DeleteProductConfigAll } from "./config";
import {
  fetchAllProducts,
  updateProductStatus,
  deleteProduct,
  createProduct,
  fetchAllCategories,
  bulkUpdateProductStatus,
  bulkDeleteProducts,
  fetchProductById,
} from "@/state/ecom/ecomSlice";
import { useDispatch, useSelector } from "react-redux";
import DetailView from "@/components/modules/DetailView";
import { exportGridCSV, exportGridPDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";

const options = {
  select: true,
  order: false,
};

const ProductPage = () => {
  const [deletePopup, setDeletePopup] = useState({ show: false, row: null });
  const [sidebarContent, setSidebarContent] = useState(null);

  const { categories, products } = useSelector(
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
    limit: 20,
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
    dispatch(fetchAllCategories());
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
    const result = await dispatch(fetchProductById(id)).unwrap();

    setSidebarContent(
      <DetailView
        config={getProductDetailsConfig(result)}
        width="600px"
        onCancel={() => setSidebarContent(null)}
      />
    );
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

      files.forEach((file, index) => {
        formData.append("products", file);
      });
    } else {
      console.warn(" No products/files found in data");
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
        dispatch(fetchAllProducts(filters));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete products");
      });
  };

  const downloadActions = [
    {
      header: "Download List",
    },
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
      icon: <BsFileSpreadsheet className="w-4 h-4  text-[#7B7B7B]" />,
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
    handleViewProduct
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
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={ProductFilterConfig}
                    onApply={(data) =>
                      setFilters((prev) => ({ ...prev, ...data }))
                    }
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
                    config={createProductConfig(
                      handleCreateProduct,
                      categoryOptions
                    )}
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
            text={<span className="hidden sm:inline">Create Product</span>}
            buttonClassName="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          />
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={products || []}
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
              label: "Mark As Active/InActive",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: (rows) => {
                handleBulkStatusUpdate(rows);
              },
            },
            {
              label: "Delete Product",
              iconUrl: "/icons/archiveClient.svg",
              type: "popUp",
              component: (
                <PopupForm
                  config={DeleteProductConfigAll}
                  width="500px"
                  height="500px"
                  onApply={(data, selectedRows) => {
                    handleBulkDelete(selectedRows);
                  }}
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
              config={DeleteProductConfig}
              width="600px"
              onApply={confirmDeleteProduct}
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
export default ProductPage;
