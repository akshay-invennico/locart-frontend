import React from "react";

const InfoItem = ({ label, value, valueClassName = "" }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className={`text-sm font-medium ${valueClassName}`}>{value || "N/A"}</p>
  </div>
);

const ProductDetailsView = ({ product }) => {
  if (!product) return <div className="p-4">No product data available</div>;

  const images = product?.images?.length
    ? product.images
    : ["/placeholder.png"];

  return (
    <div className="space-y-6 flex flex-col pt-3 pb-8">
      <div>
        <h3 className="text-lg font-bold mb-1">Product Details</h3>
        <p className="text-sm text-gray-500">
          View complete product information, pricing, stock status.
        </p>
        <hr className="mt-3 border-gray-200" />
      </div>

      <div>
        <h4 className="text-base font-semibold text-gray-800 mb-3">Product Photos</h4>
        <div className="flex flex-wrap gap-4">
          {images.map((src, idx) => (
            <div key={idx} className="w-24 h-24 rounded-md overflow-hidden border border-gray-200">
              <img
                src={src}
                alt={`${product.name || 'Product'} image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <InfoItem label="Product Name" value={product?.name || "-"} />
        <InfoItem label="Category" value={product?.category?.[0]?.categoryName || "-"} />
        <InfoItem label="Price" value={`$${product?.unit_price || 0}`} />
        <InfoItem label="Stock" value={product?.stock_quantity || "0"} />
        <InfoItem
          label="Status"
          value={product?.status || "-"}
          valueClassName={product?.status === "Active" ? "text-[#02C8DE]" : "text-red-500"}
        />
        <InfoItem
          label="Vendor"
          value={product?.vendor?.name || "Admin"}
        />
      </div>

      <hr className="border-gray-200" />

      <div>
        <h4 className="text-base font-semibold text-gray-800 mb-2">Product Description</h4>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {product?.description || "No description available."}
        </p>
      </div>

      {product?.vendor && (
        <>
          <hr className="border-gray-200" />

          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4">Vendor Details</h4>
            <div className="flex items-center gap-3 mb-4">
              {product.vendor.profile ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <img
                    src={product.vendor.profile}
                    alt={product.vendor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/noimage.png"; }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#02C8DE]/10 flex items-center justify-center text-[#02C8DE] font-semibold text-sm shrink-0">
                  {product.vendor.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{product.vendor.name}</p>
                {product.vendor.company && (
                  <p className="text-xs text-gray-500">{product.vendor.company}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="Email" value={product.vendor.email} />
              <InfoItem label="Phone" value={product.vendor.phone} />
              {product.vendor.company && (
                <InfoItem label="Company" value={product.vendor.company} />
              )}
            </div>
          </div>

          {(product.sales_price || product.salesPrice) && (
            <>
              <hr className="border-gray-200" />

              <div>
                <h4 className="text-base font-semibold text-gray-800 mb-4">Vendor Pricing</h4>
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem
                    label="Sales Price"
                    value={`$${product.sales_price || product.salesPrice || 0}`}
                  />
                  <InfoItem
                    label="Sales Type"
                    value={(product.sales_type || product.salesType || "-").replace(/^\w/, (c) => c.toUpperCase())}
                  />
                  <InfoItem
                    label="Vendor Payment Type"
                    value={(product.vendor_payment_type || product.vendorPaymentType || "-").replace(/^\w/, (c) => c.toUpperCase())}
                  />
                  <InfoItem
                    label="Vendor Payment"
                    value={
                      (product.vendor_payment_type || product.vendorPaymentType) === "percentage"
                        ? `${product.vendor_payment_value || product.vendorPaymentValue || 0}%`
                        : `$${product.vendor_payment_value || product.vendorPaymentValue || 0}`
                    }
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetailsView;
