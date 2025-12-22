"use client";
import React, { useState } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { OrderData } from "./orderSample";
import { getColumns } from "./column";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import Image from "next/image";
import {
  createOfferConfig,
  DeleteOfferConfig,
  DeleteOfferConfigAll,
  downloadActions,
  OfferFilterConfig,
  cannotDeleteOfferConfig,
  cannotDeleteOfferConfigAll,
} from "./config";
import PopupForm from "@/components/ui/popupform";

const options = {
  select: true,
  order: false,
};

const OfferPage = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCannotDeletePopup, setShowCannotDeletePopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [createdOffers, setCreatedOffers] = useState([]);
  const [showBulkCannotDeletePopup, setShowBulkCannotDeletePopup] =
    useState(false);
  const [selectedBulkOffers, setSelectedBulkOffers] = useState([]);
  


  const handleCreateOffer = (formData) => {
  

  // Standardize field names to match grid + detail view
  const transformedOffer = {
    id: Date.now(),
    offerName: formData["offerName"] || "",
    couponCode: formData["couponCode"] || "",
    discount: formData["discount"] || "",
    maxDiscount: formData["maxDiscount"] || "",
    status: Array.isArray(formData["status"])
      ? formData["status"][0]?.toLowerCase() 
      : (formData["status"] || "inactive").toLowerCase(),
    date: formData["DateRange_from"] || new Date().toISOString(),
    usageStats: "0/100 Used", // default placeholder
    OfferCondition: formData["Offer Condition"] || "",
    DateRange: {
      from: formData["DateRange_from"],
      to: formData["DateRange_to"],
    },
    description: formData["description"] || "",
    selectedDropdownItems: extractSelectedItems(formData),
    cartValue: formData["Offer Condition_cartValue"] || "",
  };

  
  setCreatedOffers((prev) => [...prev, transformedOffer]);
};


  //  Helper function to extract selected dropdown items
  const extractSelectedItems = (formData) => {
    const items = [];
    const condition = formData["Offer Condition"];


    if (condition === "Product") {
      // Check for product selections
      const productKeys = [
        "Aloe Locking Gel",
        "Lavender Calming Mist",
        "Cactus Hydrating Serum",
      ];
      productKeys.forEach((key) => {
        const fullKey = `Offer Condition_${key}`;
        if (formData[fullKey]) {
          items.push({ value: key, label: key });
        }
      });
    } else if (condition === "Categories") {
      // Check for category selections
      const categoryKeys = ["Beauty", "Wellness", "Accessories"];
      categoryKeys.forEach((key) => {
        const fullKey = `Offer Condition_${key}`;
        if (formData[fullKey]) {
          items.push({ value: key, label: key });
        }
      });
    }

    return items;
  };

  const handleDeleteOffer = (row) => {
    setSelectedOffer(row);
    setShowDeletePopup(true);
  };

  
  const columns = getColumns(handleDeleteOffer);

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

          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: <DynamicForm config={OfferFilterConfig} />,
              },
            ]}
            icon={<Filter className="w-4 h-4 text-[#02C8DE]" />}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          />

          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={{
                      ...createOfferConfig,
                      footer: {
                        ...createOfferConfig.footer,
                        apply: {  
                          ...createOfferConfig.footer.apply,
                          onClick: (formData) => {
                           
                            handleCreateOffer(formData);
                          },
                        },
                      },
                    }}
                  />
                ),
              },
            ]}
            icon={
              <Image
                src="/icons/plusbutton.svg"
                alt="Create Offer"
                width={18}
                height={18}
              />
            }
            text={<span className="hidden sm:inline">Create Offer</span>}
            buttonClassName="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          />
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={[...OrderData,...createdOffers]}
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
              type: "popUp",
              popupConfig: DeleteOfferConfigAll,
              onApply: (formData, selectedRows) => {
                if (!selectedRows || selectedRows.length === 0) {
                  return;
                }

                // Debug each selected offer
                console.log("Analyzing selected offers:");
                selectedRows.forEach((offer, idx) => {
                  console.log(
                    `  Row #${idx + 1}: ${
                      offer?.offerName || "(missing offerName)"
                    }`
                  );
                });

                // Check for offers that exist in OrderData (cannot be deleted)
                const undeletable = selectedRows.filter((selectedOffer) => {
                  const offerName = selectedOffer?.offerName
                    ?.trim()
                    ?.toLowerCase();
                  const existsInOrderData = OrderData.some(
                    (offer) =>
                      offer.offerName?.trim()?.toLowerCase() === offerName
                  );

                  return existsInOrderData;
                });

                if (undeletable.length > 0) {
                  console.warn(
                    " Some offers cannot be deleted - they exist in OrderData"
                  );
                  console.table(
                    undeletable.map((o) => ({
                      offerName: o.offerName,
                      reason: "Exists in OrderData",
                    }))
                  );

                  setSelectedBulkOffers(undeletable);
                  setShowBulkCannotDeletePopup(true);
                } else {
                  setShowBulkCannotDeletePopup(false);
                  alert(`Successfully deleted ${selectedRows.length} offer(s)`);
                }

                console.groupEnd();
              },
              onCancel: () => {},
            },
          ]}
        />
      </div>

      {/* Single Delete Popup */}
      {showDeletePopup && selectedOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowDeletePopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PopupForm
              config={DeleteOfferConfig}
              width="600px"
              onApply={() => {
                const offerName = selectedOffer?.offerName
                  ?.trim()
                  ?.toLowerCase();
                const offerExists = OrderData?.some(
                  (offer) =>
                    offer.offerName?.trim()?.toLowerCase() === offerName
                );

                if (offerExists) {
                  setShowDeletePopup(false);
                  setShowCannotDeletePopup(true);
                } else {
                  setShowDeletePopup(false);
                }
              }}
              onCancel={() => setShowDeletePopup(false)}
            />
          </div>
        </div>
      )}

      {/* Cannot Delete Single Offer Popup */}
      {showCannotDeletePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCannotDeletePopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PopupForm
              config={cannotDeleteOfferConfig}
              width="500px"
              onApply={() => setShowCannotDeletePopup(false)}
              onCancel={() => setShowCannotDeletePopup(false)}
            />
          </div>
        </div>
      )}

      {/* Cannot Delete Bulk Offers Popup */}
      {showBulkCannotDeletePopup && selectedBulkOffers?.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowBulkCannotDeletePopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PopupForm
              config={{
                ...cannotDeleteOfferConfigAll,
                body: {
                  ...cannotDeleteOfferConfigAll.body,
                  content: (
                    <div className="space-y-3">
                      <p className="text-gray-700 text-sm">
                        The following {selectedBulkOffers.length} offer(s)
                        cannot be deleted because they already exist in the
                        system:
                      </p>
                      <ul className="list-disc list-inside text-red-600 text-sm space-y-1 max-h-60 overflow-y-auto">
                        {selectedBulkOffers.map((offer, i) => (
                          <li key={i}>{offer.offerName || "Unnamed Offer"}</li>
                        ))}
                      </ul>
                    </div>
                  ),
                },
              }}
              width="500px"
              onApply={() => {
                setShowBulkCannotDeletePopup(false);
                setSelectedBulkOffers([]);
              }}
              onCancel={() => {
                setShowBulkCannotDeletePopup(false);
                setSelectedBulkOffers([]);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferPage;
