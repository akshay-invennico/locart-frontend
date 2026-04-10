import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import { toast } from "sonner";
import ActionComponent from "@/components/grid/actionComponent";

import SlidePanel from "@/components/feedback/SlidePanel";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import CreateOfferForm from "./forms/CreateOfferForm";
import OfferFilterForm from "./forms/OfferFilterForm";
import OfferDetailsView from "./OfferDetailsView";

import {
  fetchAllOffers,
  createOffer,
  updateOffer,
  deleteOfferAction,
  bulkDeleteOffers,
  fetchAllProducts,
  fetchAllCategories,
} from "@/state/ecom/ecomSlice";

const options = {
  select: true,
  order: false,
};

const OfferPage = () => {
  const dispatch = useDispatch();
  const { offers, offerLoading, products, categories } = useSelector(
    (state) => state.ecomOrders
  );

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [showBulkDeletePopup, setShowBulkDeletePopup] = useState(false);
  const [selectedBulkOffers, setSelectedBulkOffers] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewOffer, setViewOffer] = useState(null);
  const [editOffer, setEditOffer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllOffers());
    dispatch(fetchAllProducts({ limit: 1000 }));
    dispatch(fetchAllCategories({ limit: 1000, type: "ecommerce" }));
  }, [dispatch]);

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p._id,
        label: p.productName || p.product?.name || p._id,
      })),
    [products]
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        value: c._id,
        label: c.categoryName || c.name || c._id,
      })),
    [categories]
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch(fetchAllOffers({ search: query }));
  };

  const handleCreateOffer = async (formData, { setSubmitting }) => {
    try {
      const payload = {
        offerName: formData.offerName,
        couponCode: formData.couponCode,
        discountType: formData.discountType,
        discount: Number(formData.discount),
        maxDiscount: formData.discountType === "percentage" ? Number(formData.maxDiscount) : null,
        dateRange: formData.dateRange,
        status: formData.status,
        offerCondition: formData.offerCondition,
        selectedProducts:
          formData.offerCondition === "Product"
            ? formData.selectedProducts
            : [],
        selectedCategories:
          formData.offerCondition === "Categories"
            ? formData.selectedCategories
            : [],
        cartValue:
          formData.offerCondition === "Cart Value"
            ? Number(formData.cartValue)
            : null,
        description: formData.description,
      };

      await dispatch(createOffer(payload)).unwrap();
      setShowCreate(false);
      toast.success("Offer created successfully");
      dispatch(fetchAllOffers());
    } catch (err) {
      toast.error(err?.message || "Failed to create offer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateOffer = async (formData, { setSubmitting }) => {
    try {
      const payload = {
        offerName: formData.offerName,
        couponCode: formData.couponCode,
        discountType: formData.discountType,
        discount: Number(formData.discount),
        maxDiscount: formData.discountType === "percentage" ? Number(formData.maxDiscount) : null,
        dateRange: formData.dateRange,
        status: formData.status,
        offerCondition: formData.offerCondition,
        selectedProducts:
          formData.offerCondition === "Product"
            ? formData.selectedProducts
            : [],
        selectedCategories:
          formData.offerCondition === "Categories"
            ? formData.selectedCategories
            : [],
        cartValue:
          formData.offerCondition === "Cart Value"
            ? Number(formData.cartValue)
            : null,
        description: formData.description,
      };

      await dispatch(
        updateOffer({ offerId: editOffer._id, payload })
      ).unwrap();
      setEditOffer(null);
      toast.success("Offer updated successfully");
      dispatch(fetchAllOffers());
    } catch (err) {
      toast.error(err?.message || "Failed to update offer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOffer = (row) => {
    setSelectedOffer(row);
    setShowDeletePopup(true);
  };

  const confirmDeleteOffer = async () => {
    try {
      await dispatch(deleteOfferAction(selectedOffer._id)).unwrap();
      setShowDeletePopup(false);
      setSelectedOffer(null);
      toast.success("Offer deleted successfully");
    } catch (err) {
      setShowDeletePopup(false);
      toast.error(
        err?.message || "Failed to delete offer"
      );
    }
  };

  const columns = getColumns(
    handleDeleteOffer,
    (row) => setViewOffer(row),
    (row) => {
      const initialValues = {
        offerName: row.offerName || "",
        couponCode: row.couponCode || "",
        discountType: row.discountType || "percentage",
        discount: row.discount || "",
        maxDiscount: row.maxDiscount || "",
        status:
          typeof row.status === "string"
            ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
            : "Active",
        dateRange: row.dateRange || { from: null, to: null },
        offerCondition: row.offerCondition || "Product",
        selectedProducts:
          row.offerCondition === "Product" && row.selectedProducts
            ? row.selectedProducts.map((p) =>
                typeof p === "string" ? p : p._id
              )
            : [],
        selectedCategories:
          row.offerCondition === "Categories" && row.selectedCategories
            ? row.selectedCategories.map((c) =>
                typeof c === "string" ? c : c._id
              )
            : [],
        cartValue: row.cartValue ? String(row.cartValue) : "",
        description: row.description || "",
      };
      setEditOffer({ ...row, _initialValues: initialValues });
    }
  );

  const downloadActions = [
    {
      header: "Download List",
    },
    {
      label: "Download PDF",
      icon: <Download className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => toast.success("Downloading PDF..."),
    },
    {
      label: "Download CSV",
      icon: <Download className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => toast.success("Downloading CSV..."),
    },
  ];

  // Map offers for grid display
  const gridData = offers.map((offer) => ({
    ...offer,
    date: offer.dateRange?.from || offer.createdAt,
  }));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-2">
          <ActionComponent
            actions={downloadActions}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

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
              alt="Create Offer"
              width={18}
              height={18}
            />
            <span className="hidden sm:inline">Create Offer</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={gridData}
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
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
          bulkActionsConfig={[
            {
              label: "Delete Offer",
              iconUrl: "/icons/deleteProduct.svg",
              type: "button",
              onClick: (selectedRows) => {
                if (!selectedRows || selectedRows.length === 0) return;
                setSelectedBulkOffers(selectedRows);
                setShowBulkDeletePopup(true);
              },
            },
          ]}
        />
      </div>

      {/* Delete Single Offer */}
      <ConfirmDialog
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={confirmDeleteOffer}
        title="Delete Offer?"
        description="Are you sure you want to delete this selected Offer? This action cannot be undone."
        confirmLabel="Delete Offer"
        confirmVariant="destructive"
      />

      {/* Bulk Delete Offers */}
      <ConfirmDialog
        open={showBulkDeletePopup}
        onClose={() => setShowBulkDeletePopup(false)}
        onConfirm={async () => {
          try {
            const ids = selectedBulkOffers.map((o) => o._id);
            const result = await dispatch(bulkDeleteOffers(ids)).unwrap();
            setShowBulkDeletePopup(false);
            setSelectedBulkOffers([]);

            const deletedCount = result?.deleted?.length || 0;
            const skippedCount = result?.skipped?.length || 0;

            if (skippedCount > 0) {
              toast.warning(
                `Deleted ${deletedCount} offer(s). ${skippedCount} offer(s) skipped (already used).`
              );
            } else {
              toast.success(
                `Successfully deleted ${deletedCount} offer(s)`
              );
            }
            dispatch(fetchAllOffers());
          } catch (err) {
            toast.error(err?.message || "Failed to delete offers");
            setShowBulkDeletePopup(false);
          }
        }}
        title="Delete Selected Offers?"
        description="Are you sure you want to delete the selected Offers? This action cannot be undone."
        confirmLabel="Delete Selection"
        confirmVariant="destructive"
      />

      <SlidePanel
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title=""
        width="sm:max-w-[600px]"
      >
        <CreateOfferForm
          onSubmit={handleCreateOffer}
          onCancel={() => setShowCreate(false)}
          productOptions={productOptions}
          categoryOptions={categoryOptions}
        />
      </SlidePanel>

      <SlidePanel
        open={!!editOffer}
        onClose={() => setEditOffer(null)}
        title=""
        width="sm:max-w-[600px]"
      >
        {editOffer && (
          <CreateOfferForm
            isEdit
            initialValues={editOffer._initialValues}
            onSubmit={handleUpdateOffer}
            onCancel={() => setEditOffer(null)}
            productOptions={productOptions}
            categoryOptions={categoryOptions}
          />
        )}
      </SlidePanel>

      <SlidePanel
        open={showFilter}
        onClose={() => setShowFilter(false)}
        title="Advanced Filters"
        description="Refine your search results using custom criteria across modules."
        width="sm:max-w-[500px]"
      >
        <OfferFilterForm
          onApply={(data) => {
            const filters = {};
            if (data.status) filters.status = data.status;
            dispatch(fetchAllOffers(filters));
            setShowFilter(false);
          }}
          onReset={() => {
            dispatch(fetchAllOffers());
            setShowFilter(false);
          }}
        />
      </SlidePanel>

      <SlidePanel
        open={!!viewOffer}
        onClose={() => setViewOffer(null)}
        title=""
        width="sm:max-w-[600px]"
      >
        <OfferDetailsView offer={viewOffer} />
      </SlidePanel>
    </div>
  );
};

export default OfferPage;
