import React from "react";

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm font-medium">{value || "N/A"}</p>
  </div>
);

const OfferDetailsView = ({ offer }) => {
  if (!offer) return <p className="p-4">No offer data</p>;

  const getDateRange = () => {
    if (offer.dateRange?.from && offer.dateRange?.to) {
      return {
        from: new Date(offer.dateRange.from).toLocaleDateString("en-GB"),
        to: new Date(offer.dateRange.to).toLocaleDateString("en-GB"),
      };
    }
    return { from: "N/A", to: "N/A" };
  };

  const dateRange = getDateRange();

  return (
    <div className="space-y-6 flex flex-col pt-3 pb-8">
      <div>
        <h3 className="text-lg font-bold mb-1">View Offer</h3>
        <p className="text-sm text-gray-500">See all details for this offer.</p>
        <hr className="mt-3" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoItem label="Offer Name" value={offer.offerName} />
        <InfoItem label="Coupon Code" value={offer.couponCode} />
        <InfoItem
          label="Discount"
          value={
            offer.discountType === "fixed"
              ? `$${offer.discount || 0}`
              : `${offer.discount || 0}%`
          }
        />
        {offer.discountType !== "fixed" && (
          <InfoItem label="Max Discount Amount" value={`$${offer.maxDiscount || 0}`} />
        )}
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Status</p>
          <p className="text-sm font-medium text-[#02C8DE]">
            {typeof offer.status === "string"
              ? offer.status.charAt(0).toUpperCase() + offer.status.slice(1)
              : "N/A"}
          </p>
        </div>
        <InfoItem label="Usage" value={offer.usageStats || `${offer.usageCount || 0}/${offer.usageLimit || 100} Used`} />
      </div>

      <hr className="border-gray-200" />

      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Date Range</h4>
        <div className="grid grid-cols-2 gap-6">
          <InfoItem label="From" value={dateRange.from} />
          <InfoItem label="To" value={dateRange.to} />
        </div>
      </div>

      <hr className="border-gray-200" />

      {offer.offerCondition === "Product" && (
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Products</h4>
          {offer.selectedProducts && offer.selectedProducts.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {offer.selectedProducts.map((p, i) => (
                <li key={i} className="text-sm">
                  {typeof p === "string" ? p : p.name || p.productName || p._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No products selected</p>
          )}
        </div>
      )}

      {offer.offerCondition === "Categories" && (
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Categories</h4>
          {offer.selectedCategories && offer.selectedCategories.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {offer.selectedCategories.map((c, i) => (
                <li key={i} className="text-sm">
                  {typeof c === "string" ? c : c.name || c.categoryName || c._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No categories selected</p>
          )}
        </div>
      )}

      {offer.offerCondition === "Cart Value" && (
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Cart Value Condition</h4>
          <p className="text-sm font-medium">
            Minimum Cart Value: <span className="text-[#02C8DE] font-semibold">${offer.cartValue}</span>
          </p>
        </div>
      )}

      <hr className="border-gray-200" />

      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-2">Description</h4>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {offer.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default OfferDetailsView;
