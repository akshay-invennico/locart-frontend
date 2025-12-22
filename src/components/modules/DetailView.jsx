 "use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, Check } from "lucide-react";
import GridCommonComponent from "../grid/gridCommonComponent";

const DetailView = ({
  config,
  onClose,
  onDataLoad,
  dataSelector,
  buildConfigFromData,
  productColumns,
}) => {
  const [showReviews, setShowReviews] = useState(false);
  const [thumbnailImages, setThumbnailImages] = useState(
    () => config?.fields?.find((f) => f.type === "thumbnailList")?.images || []
  );

  const selectedData = dataSelector ? useSelector(dataSelector) : null;

  useEffect(() => {
    if (onDataLoad) {
      onDataLoad();
    }
  }, [onDataLoad]);
  const displayConfig =
    selectedData && typeof buildConfigFromData === "function"
      ? buildConfigFromData(selectedData)
      : config;

  const reviewCardField = displayConfig?.fields?.find(
    (f) => f.type === "reviewCard"
  );
  const allReviews = reviewCardField?.reviews || [];
  const productTableField = displayConfig?.fields?.find(
    (f) => f.type === "productTable"
  );
  const products = productTableField?.rows || [];

  const renderField = (field) => {
    switch (field.type) {
      case "header":
        return (
          <h2
            className="text-base sm:text-lg font-bold break-words"
            style={field.css}
          >
            {field.label}
          </h2>
        );

      case "subheader":
        return (
          <p
            className="text-xs sm:text-sm text-gray-600 break-words leading-relaxed whitespace-pre-wrap"
            style={field.css}
          >
            {field.text}
          </p>
        );

      case "profileCard":
        return (
          <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
            <div className="flex-shrink-0">
              {field.avatar ? (
                <img
                  src={field.avatar}
                  alt={field.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-primary1"
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xl">
                  {field.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {field.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#02C8DE] break-all">
                {field.email}
              </p>
              <p className="text-xs text-gray-600 mt-1">{field.subtitle}</p>
            </div>
            {field.phone && (
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-500 mb-1">
                  {field.phone.label}
                </p>
                <p className="text-xs sm:text-sm font-medium text-primary1 break-all">
                  {field.phone.value}
                </p>
              </div>
            )}
          </div>
        );

      case "divider":
        return <hr className="border-gray-300 my-3 sm:my-4" />;

      case "textBlock":
        return (
          <p className="text-xs sm:text-sm break-words" style={field.css}>
            {field.content}
          </p>
        );

      case "sectionHeader":
        return (
          <div
            className="flex justify-between items-center gap-2"
            style={field.css}
          >
            <h3 className="font-semibold text-sm sm:text-base break-words flex-1">
              {field.label}
            </h3>
          </div>
        );

      case "infoGrid":
        const cols = field.columns || 2;
        const gridClass =
          cols === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

        return (
          <div
            className={`grid ${gridClass} gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4`}
          >
            {field.items.map((item, idx) => {
              const isRating = item.renderType === "rating";
              return (
                <div
                  key={idx}
                  className={`flex flex-col min-w-0 ${
                    isRating ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (isRating) setShowReviews(true);
                  }}
                >
                  <span className="text-xs text-gray-500 mb-1 break-words">
                    {item.label}
                  </span>
                  <span
                    className="text-xs sm:text-sm font-medium break-words flex items-center gap-1"
                    style={item.valueStyle || {}}
                  >
                    {isRating && (
                      <>
                        <svg
                          className={`w-5 h-5 ${
                            item.rating >= 1
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.954a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.286 3.954c.3.921-.755 1.688-1.538 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.783.57-1.838-.197-1.538-1.118l1.286-3.954a1 1 0 00-.364-1.118L2.073 9.38c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.954z" />
                        </svg>
                        <span className="ml-1 text-[#02C8DE] text-xs sm:text-sm">
                          ({item.totalReviews})
                        </span>
                      </>
                    )}
                    {!isRating && item.value}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case "serviceGrid":
        const serviceCols = field.columns || 3;
        const serviceGridClass =
          serviceCols === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

        return (
          <div className={`grid ${serviceGridClass} gap-3`}>
            {field.services.map((service, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                    service.checked
                      ? "bg-[#02C8DE] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {service.checked && (
                    <Check className="w-3 h-3" strokeWidth={3} />
                  )}
                </div>
                <span className="text-black break-words">{service.name}</span>
              </div>
            ))}
          </div>
        );

      case "phoneNumber":
        return (
          <div className="flex items-center gap-2 flex-wrap" style={field.css}>
            <span className="text-gray-600">📞</span>
            <span className="text-xs sm:text-sm break-all">{field.value}</span>
          </div>
        );

      case "remarkBadge":
        return (
          <div
            className="flex items-start gap-2 sm:gap-3 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200"
            style={field.css}
          >
            <div className="bg-purple-500 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold flex-shrink-0 text-xs sm:text-sm">
              {field.avatar || "M"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-semibold mb-1">
                {field.remarkLabel || "Remark"}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 break-words">
                {field.text}
              </p>
            </div>
          </div>
        );

      case "keyValue":
        return (
          <div className="flex justify-between items-center py-2 gap-2">
            <span className="text-xs sm:text-sm text-gray-600 break-words flex-1">
              {field.label}
            </span>
            <span
              className="text-xs sm:text-sm font-medium break-all flex-shrink-0"
              style={field.valueStyle || {}}
            >
              {field.value}
            </span>
          </div>
        );

      case "image":
        return (
          <div className="flex justify-center" style={field.css}>
            <img
              src={field.src}
              alt={field.alt || ""}
              className={field.className || "max-w-full h-auto"}
              style={field.imageStyle}
            />
          </div>
        );

      case "thumbnailList":
        const handleRemove = (index) => {
          const updated = thumbnailImages.filter((_, i) => i !== index);
          setThumbnailImages(updated);
          field.onChange?.(updated); // ✅ now `field` exists in this scope
        };

        return (
          <div className="flex flex-wrap gap-3 mt-2">
            {thumbnailImages.map((img, idx) => (
              <div
                key={idx}
                className="relative w-18 h-16 rounded-lg overflow-hidden border border-gray-300"
              >
                <img
                  src={img.src}
                  alt={img.alt || `image-${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-gray-500 text-white text-xs rounded-full p-1 hover:bg-red-600"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        );

      case "productTable":
        if (!productColumns) return null;
        return (
          <div className="mt-4">
            <GridCommonComponent
              data={[
                ...productTableField.rows.map((row, idx) => ({
                  id: idx,
                  product: {
                    name: row.product.name,
                    image: row.product.image,
                  },
                  quantity: row.quantity,
                  price: row.price,
                  subtotal: row.subtotal,
                })),
                {
                  id: "total",
                  product: { name: "Total", profile: "" },
                  quantity: "",
                  price: "",
                  subtotal: productTableField.total,
                  isTotalRow: true,
                },
              ]}
              columns={productColumns}
              options={{ select: false, order: false }}
              theme={{
                border: "border-gray-300",
                header: { bg: "bg-gray-100" },
              }}
              rowClassName={(row) =>
                row.isTotalRow
                  ? "bg-gray-50 font-semibold border-t border-gray-300"
                  : ""
              }
              cellRenderer={(key, value, row) => {
                if (row.isTotalRow) {
                  if (key === "product")
                    return (
                      <div className="text-right font-semibold">Total</div>
                    );
                  if (key === "subtotal")
                    return (
                      <div className="font-semibold text-[#02C8DE]">
                        {value || "-"}
                      </div>
                    );
                  return null;
                }

                // Normal rendering for product cell with image
                if (key === "product" && value?.name) {
                  return (
                    <div className="flex items-center gap-3">
                      {value.image ? (
                        <img
                          src={value.image}
                          alt={value.name}
                          className="w-10 h-10 rounded-md border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-200" />
                      )}
                      <span className="text-sm font-medium text-gray-800">
                        {value.name}
                      </span>
                    </div>
                  );
                }

                return <span className="text-sm text-gray-700">{value}</span>;
              }}
            />
          </div>
        );

      case "invoiceSummary":
        return (
          <div className="border rounded-lg p-3 sm:p-4 bg-gray-50 space-y-2">
            {field.invoiceId && (
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-300 gap-2">
                <span className="text-xs text-gray-500 font-medium break-words">
                  Invoice ID
                </span>
                <span
                  className="text-xs sm:text-sm font-medium break-all"
                  style={{ color: "#02C8DE" }}
                >
                  {field.invoiceId}
                </span>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              {field.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center gap-2 pb-2 ${
                    item.divider !== false && idx !== field.items.length - 1
                      ? "border-b border-dashed border-gray-300"
                      : ""
                  }`}
                >
                  <span
                    className={`text-xs sm:text-sm ${
                      item.bold ? "font-semibold" : ""
                    } break-words flex-1`}
                    style={{ color: item.color || "#374151" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-xs sm:text-sm ${
                      item.bold ? "font-bold" : ""
                    } ${
                      item.large ? "text-sm sm:text-base" : ""
                    } break-all flex-shrink-0`}
                    style={{ color: item.color || "#111111" }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "productList":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {field.items?.map((product, idx) => (
              <div
                key={idx}
                className=" rounded-lg p-3 flex flex-col items-center bg-white hover:shadow-md transition-shadow"
              >
                <span className="bg-[#E5FCFF] text-sm text-center font-medium text-[#02C8DE] break-words">
                  {product.label}
                </span>
              </div>
            ))}
          </div>
        );

      case "categoryList":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            {field.items?.map((category, idx) => (
              <div
                key={idx}
                className="bg-[#E5FCFF] text-[#02C8DE] px-4 py-2 rounded-md text-sm font-medium border border-[#02C8DE]/20"
              >
                {category.label}
              </div>
            ))}
          </div>
        );

      default:
        console.warn(`Unknown field type: ${field.type}`);
        return null;
    }
  };

  return (
    <div className="flex h-full w-full bg-white">
      {/* Reviews Sidebar */}
      {showReviews && (
        <div className="w-[100%] h-full bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Reviews
              </h3>
              <button
                onClick={() => setShowReviews(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded"
                aria-label="Close reviews"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {allReviews && allReviews.length > 0 ? (
                allReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-4 mx-auto w-full max-w-md overflow-hidden"
                    style={{ minHeight: "250px" }}
                  >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 break-words whitespace-normal">
                      {review.description}
                    </p>

                    <div className="flex items-center gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                          {review.name}
                        </span>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, starIdx) => {
                            const filled = starIdx < Math.floor(review.rating);
                            return (
                              <svg
                                key={starIdx}
                                className={`w-4 h-4 ${
                                  filled ? "text-yellow-400" : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.954a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.286 3.954c.3.921-.755 1.688-1.538 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.783.57-1.838-.197-1.538-1.118l1.286-3.954a1 1 0 00-.364-1.118L2.073 9.38c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.954z" />
                              </svg>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm mt-8">
                  No reviews available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col h-full bg-white transition-all duration-300 ${
          showReviews ? "w-[60%]" : "w-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {displayConfig?.title && (
            <h2
              className="text-xl font-bold mb-4"
              style={displayConfig.titleCss}
            >
              {displayConfig.title}
            </h2>
          )}

          <div className="space-y-4">
            {displayConfig?.fields?.map((field, index) => (
              <div
                key={field.name || `${field.type}-${index}`}
                className={`detail-section ${
                  field.type === "divider" ? "-mx-4 sm:-mx-6" : ""
                }`}
                style={field.containerCss || {}}
              >
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {displayConfig?.footer && (
          <div className="border-t bg-white px-6 py-4 flex-shrink-0">
            <div className="flex gap-3">
              {displayConfig.footer.close && (
                <button
                  type="button"
                  onClick={onClose}
                  className={
                    displayConfig.footer.close.className ||
                    "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded hover:bg-[#02C8DE] hover:text-white transition-colors"
                  }
                >
                  {displayConfig.footer.close.label || "Close"}
                </button>
              )}
              {displayConfig.footer.actions &&
                displayConfig.footer.actions.map((action, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={action.onClick}
                    className={
                      action.className ||
                      "w-full bg-[#02C8DE] text-white px-4 py-2 rounded hover:bg-[#01B0C5] transition-colors"
                    }
                  >
                    {action.label}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;
