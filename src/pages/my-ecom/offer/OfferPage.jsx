import React, { useState } from "react";
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

const options = {
  select: true,
  order: false,
};

const OfferPage = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCannotDeletePopup, setShowCannotDeletePopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [createdOffers, setCreatedOffers] = useState([]);

  const [showBulkCannotDeletePopup, setShowBulkCannotDeletePopup] = useState(false);
  const [selectedBulkOffers, setSelectedBulkOffers] = useState([]);
  const [showBulkDeletePopup, setShowBulkDeletePopup] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewOffer, setViewOffer] = useState(null);
  const [editOffer, setEditOffer] = useState(null);

  const productOptions = [
    { value: "Aloe Locking Gel", label: "Aloe Locking Gel" },
    { value: "Lavender Calming Mist", label: "Lavender Calming Mist" },
    { value: "Cactus Hydrating Serum", label: "Cactus Hydrating Serum" },
  ];

  const categoryOptions = [
    { value: "Beauty", label: "Beauty" },
    { value: "Wellness", label: "Wellness" },
    { value: "Accessories", label: "Accessories" },
  ];

  const handleCreateOffer = (formData) => {
    const transformedOffer = {
      id: Date.now(),
      offerName: formData.offerName || "",
      couponCode: formData.couponCode || "",
      discount: formData.discount || "",
      maxDiscount: formData.maxDiscount || "",
      status: formData.status?.toLowerCase() || "inactive",
      date: formData.dateRange?.from || new Date().toISOString(),
      usageStats: "0/100 Used",
      OfferCondition: formData.offerCondition || "",
      DateRange: {
        from: formData.dateRange?.from,
        to: formData.dateRange?.to,
      },
      description: formData.description || "",
      selectedDropdownItems: formData.offerCondition === "Product"
        ? productOptions.filter(p => formData.selectedProducts?.includes(p.value))
        : formData.offerCondition === "Categories"
          ? categoryOptions.filter(c => formData.selectedCategories?.includes(c.value))
          : [],
      cartValue: formData.cartValue || "",
    };

    setCreatedOffers((prev) => [...prev, transformedOffer]);
    setShowCreate(false);
    toast.success("Offer created successfully");
  };

  const handleUpdateOffer = (formData) => {
    const transformedOffer = { ...editOffer, ...formData };
    setCreatedOffers((prev) => prev.map(o => o.id === editOffer.id ? transformedOffer : o));
    setEditOffer(null);
    toast.success("Offer updated successfully");
  };

  const handleDeleteOffer = (row) => {
    setSelectedOffer(row);
    setShowDeletePopup(true);
  };

  const confirmDeleteOffer = () => {
    const offerName = selectedOffer?.offerName?.trim()?.toLowerCase();
    const offerExists = createdOffers?.some(
      (offer) =>
        offer.offerName?.trim()?.toLowerCase() === offerName
    );

    if (offerExists) {
      setShowDeletePopup(false);
      setShowCannotDeletePopup(true);
    } else {
      setShowDeletePopup(false);
      setCreatedOffers(prev => prev.filter(o => o.id !== selectedOffer?.id));
      toast.success("Offer deleted successfully");
    }
  };

  const columns = getColumns(
    handleDeleteOffer,
    (row) => setViewOffer(row),
    (row) => {
      const initialValues = {
        offerName: row.offerName || "",
        couponCode: row.couponCode || "",
        discount: typeof row.discount === 'string' ? row.discount.replace('%', '') : row.discount || "",
        maxDiscount: typeof row.maxDiscount === 'string' ? row.maxDiscount.replace('$', '') : row.maxDiscount || "",
        status: Array.isArray(row.status) ? (row.status[0] ? row.status[0].charAt(0).toUpperCase() + row.status[0].slice(1) : "Active") : row.status || "Active",
        dateRange: row.DateRange || { from: null, to: null },
        offerCondition: row.OfferCondition || "Product",
        selectedProducts: row.OfferCondition === 'Product' && row.selectedDropdownItems ? row.selectedDropdownItems.map(i => i.value) : [],
        selectedCategories: row.OfferCondition === 'Categories' && row.selectedDropdownItems ? row.selectedDropdownItems.map(i => i.value) : [],
        cartValue: row.cartValue ? String(row.cartValue).replace('$', '') : "",
        description: row.description || ""
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
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
          data={[...createdOffers]}
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

                const undeletable = selectedRows.filter((selectedOffer) => {
                  const offerName = selectedOffer?.offerName?.trim()?.toLowerCase();
                  return createdOffers.some(
                    (offer) => offer.offerName?.trim()?.toLowerCase() === offerName
                  );
                });

                if (undeletable.length > 0) {
                  setSelectedBulkOffers(undeletable);
                  setShowBulkCannotDeletePopup(true);
                } else {
                  setSelectedBulkOffers(selectedRows);
                  setShowBulkDeletePopup(true);
                }
              }
            },
          ]}
        />
      </div>

      {/* Delete Single Offer */}
      <ConfirmDialog
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={confirmDeleteOffer}
        title="Delete Offers?"
        description="Are you sure you want to delete this selected Offers? This action will notify the Clients and initiate the deletion process. Once deleted, this offers cannot be undone."
        confirmLabel="Delete Offer"
        confirmVariant="destructive"
      />

      {/* Cannot Delete Single */}
      <ConfirmDialog
        open={showCannotDeletePopup}
        onClose={() => setShowCannotDeletePopup(false)}
        onConfirm={() => setShowCannotDeletePopup(false)}
        title="Cannot Delete Offers"
        description="This offer cannot be deleted because there are Offers currently listed under it. Please remove the offers before attempting to delete the offer."
        confirmLabel="Back To Main Page"
        cancelLabel="Close"
      />

      {/* Bulk Delete Offers */}
      <ConfirmDialog
        open={showBulkDeletePopup}
        onClose={() => setShowBulkDeletePopup(false)}
        onConfirm={() => {
          setShowBulkDeletePopup(false);
          toast.success(`Successfully deleted ${selectedBulkOffers.length} offer(s)`);
        }}
        title="Delete Selected Offers?"
        description="Are you sure you want to delete this selected Offers? This action will notify the Clients and initiate the deletion process. Once deleted, this offers cannot be undone."
        confirmLabel="Delete Selection"
        confirmVariant="destructive"
      />

      {/* Cannot Delete Bulk */}
      <ConfirmDialog
        open={showBulkCannotDeletePopup}
        onClose={() => {
          setShowBulkCannotDeletePopup(false);
          setSelectedBulkOffers([]);
        }}
        onConfirm={() => {
          setShowBulkCannotDeletePopup(false);
          setSelectedBulkOffers([]);
        }}
        title="Cannot Delete Selected Offers"
        description="These selected offers cannot be deleted because they already exist in the system. Please remove the offers before attempting to delete."
        confirmLabel="Back To Main Page"
        cancelLabel="Close"
      >
        <div className="mt-4">
          <ul className="list-disc list-inside text-red-600 text-sm space-y-1 max-h-40 overflow-y-auto bg-red-50 p-3 rounded-md">
            {selectedBulkOffers.map((offer, i) => (
              <li key={i}>{offer.offerName || "Unnamed Offer"}</li>
            ))}
          </ul>
        </div>
      </ConfirmDialog>

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
            console.log("Filters Applied", data);
            setShowFilter(false);
          }}
          onReset={() => console.log("Filters Reset")}
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
