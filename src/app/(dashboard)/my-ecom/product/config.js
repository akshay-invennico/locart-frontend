export const ProductFilterConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Advanced Filters" },
    {
      type: "subheader",
      text: "Refine your search results using custom criteria across modules.",
    },
    { type: "divider" },
    { type: "filterBy", text: "Filter By:" },

    {
      type: "checkboxGroup",
      name: "status",
      label: "Product Status",
      options: [
        { value: "All", label: "All" },
        { value: "In-stock", label: "In-Stock" },
        { value: "Out-of-Stock", label: "Out-of-Stock" },
      ],
    },

    {
      type: "selectCheckbox",
      name: "category",
      label: "Categories",
      options: [
        { label: "Care Kit", value: "Care Kit" },
        { label: "Moisturizing Cream", value: "Moisturizing Cream" },
        { label: "Detangling Spray", value: "Detangling Spray" },
        { label: "Nourishing Oil", value: "Nourishing Oil" },
        {
          label: "Curl Defining Gel",
          value: "Curl Defining Gel",
        },
        { label: "Smoothing Serum", value: "Smoothing Serum" },
        { label: "Heat Protectant Spray", value: "Heat Protectant Spray" },
        { label: "Leave-In Conditioner", value: "Leave-In Conditioner" },
      ],
    },

    { type: "numberRange", name: "StockRange", label: "Stock Range" },
    { type: "numberRange", name: "PriceRange", label: "Price Range" },
  ],
  footer: {
    cancel: {
      label: "Cancel",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
      onClick: () => console.log("Cancelled"),
    },
    apply: {
      label: "Apply Filters",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log("Applied Filters", data),
    },
  },
};

export const createProductConfig = (onSubmit, categoryOptions) => ({
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Add Product" },

    {
      type: "subheader",
      text: "Add a new item to your store catalogue by entering product details.",
    },
    { type: "divider" },

    { type: "textBlock", label: "Product Photos" },
    {
      type: "file",
      name: "products",
      label: "Product Photos",
      multiple: true,
    },

    { type: "textBlock", label: "Product Name" },
    {
      type: "input",
      name: "productName",
      placeholder: "e.g, Loc Retwist",
    },

    {
      type: "selectCheckbox",
      name: "category",
      label: "Categories",
      options: categoryOptions,
    },

    {
      type: "inputPair",
      label1: "Price",
      name1: "price",
      placeholder1: "$99",

      label2: "Stock",
      name2: "stock",
      placeholder2: "230",
    },

    {
      type: "textarea",
      name: "description",
      label: "Description",
      placeholder: "Product Description",
    },
  ],

  footer: {
    cancel: {
      label: "Cancel",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
      onClick: () => console.log("Cancelled"),
    },
    apply: {
      label: "Add Product",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => onSubmit(data),
    },
  },
});

export const getEditProductConfig = (product, onSubmit, onCancel, categoryOptions) => {
  const categoryIds = Array.isArray(product?.category_id)
    ? product.category_id
    : product?.category_id
      ? [product.category_id]
      : Array.isArray(product?.category)
        ? product.category
          .map((c) => c?._id || c?.id || c?.category_id)
          .filter(Boolean)
        : product?.category?._id || product?.category?.id || product?.category?.category_id
          ? [product?.category?._id || product?.category?.id || product?.category?.category_id]
          : [];

  return ({
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  initialValues: {
    name: product?.name || product?.productName,
    category_id: categoryIds,
    unit_price: product?.unit_price || product?.price?.$numberDecimal || product?.price,
    stock_quantity: product?.stock_quantity || product?.stock,
    description: product?.description,
    product_images: product?.images || product?.imageUrls || []
  },

  fields: [
    {
      type: "header",
      label: "Edit Product",
    },
    {
      type: "subheader",
      text: "Edit complete product information, pricing, stock status.",
    },
    { type: "divider", name: "divider" },

    { type: "textBlock", label: "Product Photos" },
    {
      type: "file",
      name: "new_images",
      label: "Add New Photos",
      multiple: true
    },
    {
      type: "thumbnailList",
      label: "Current Product Photos",
      name: "product_images"
    },

    {
      type: "input",
      name: "name",
      label: "Product Name",
      placeholder: "Enter product name",
    },

    {
      type: "selectCheckbox",
      name: "category_id",
      label: "Categories",
      options: categoryOptions,
    },
    {
      type: "inputPair",
      label1: "Price",
      name1: "unit_price",
      placeholder1: "Enter price",
      label2: "Stock",
      name2: "stock_quantity",
      placeholder2: "Enter stock quantity",
    },
    {
      type: "textarea",
      name: "description",
      label: "Product Description",
      placeholder: "Enter product description",
      rows: 5,
    },
  ],
  footer: {
    cancel: {
      label: "Cancel",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
      onClick: onCancel,
    },
    apply: {
      label: "Update Product",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => onSubmit(data),
    },
  },
});
};

export const flagOrderConfig = {
  title: "",
  fields: [
    { type: "header", label: "Flag This Order?" },
    {
      type: "subheader",
      text: "Are you sure you want to flag this Order for further review?",
    },
    {
      type: "subheader",
      text: "Flagged Orders will be marked in the system and may require",
    },
    {
      type: "subheader",
      text: "follow-up by the support or moderation team.",
    },
    {
      type: "selectCheckbox",
      name: "suspend_reason",
      label: "Please select a reason for flagging this Order",
      showTextarea: true,
      textareaLabel: "Note",
      textareaName: "note",
      textareaPlaceholder: "Add note if 'Other' selected",

      options: [
        { label: "Suspicious activity", value: "Suspicious activity" },
        { label: "Payment discrepancy", value: "Payment discrepancy" },
        { label: "Client complaint", value: "Client complaint" },
        { label: "No-show without update", value: "No-show without update" },
        { label: "Stylist issue", value: "Stylist issue" },
        { label: "Other", value: "Other" },
      ],
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Confirm Flag", color: "blue" },
  },
};

export const DeleteProductConfig = {
  title: "",
  fields: [
    { type: "header", label: "Delete Product?" },
    {
      type: "subheader",
      text: "Are you sure you want to delete this Product?",
    },
    {
      type: "subheader",
      text: "This action will notify the Clients and initiate the removal process.",
    },
    {
      type: "subheader",
      text: "applicable. Once cancelled, this order cannot be undone",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Delete Product", color: "red" },
  },
};
export const DeleteProductConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Delete Selected Product?" },
    {
      type: "subheader",
      text: "Are you sure you want to delete this Product?",
    },
    {
      type: "subheader",
      text: "This action will notify the Clients and initiate the removal process.",
    },
    {
      type: "subheader",
      text: "applicable. Once cancelled, this order cannot be undone",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Delete Product", color: "red" },
  },
};

export const editBookingConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Edit Booking" },
    {
      type: "subheader",
      text: "Update booking details to reflect the latest information.",
    },
    { type: "divider" },
    { type: "Booking ID", text: "Booking ID" },

    {
      type: "date",
      name: "booking_date",
      label: "Booking Date",
    },
    {
      type: "time",
      name: "booking_time",
      label: "Booking Time",
    },

    {
      type: "selectCheckbox",
      name: "stylist",
      label: "Select Stylist",
      options: [
        { value: "AaliyahJohnson", label: "Aaliyah Johnson" },
        { value: "BennyCarter", label: "Benny Carter" },
        { value: "ChloeKim", label: "Chloe Kim" },
        { value: "DavidLee", label: "David Lee" },
        { value: "EvaMartinez", label: "Eva Martinez" },
      ],
    },
    {
      type: "selectCheckbox",
      name: "booking_status",
      label: "Booking Status",
      options: [
        { value: "Upcoming", label: "Upcoming" },
        { value: "Ongoing", label: "Ongoing" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
  ],
  footer: {
    cancel: {
      label: "Cancel",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
      onClick: () => console.log("Cancelled"),
    },
    apply: {
      label: "Update Booking",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log("Saved", data),
    },
  },
};

export const archiveOrderConfig = {
  title: "",
  fields: [
    { type: "header", label: "Archive Product?" },
    {
      type: "subheader",
      text: "Are you sure you want to archive this Order account?",
    },
    {
      type: "subheader",
      text: "Archived Order will no longer appear in the active Client list but their data will remain securely stored in the system.",
    },
    {
      type: "subheader",
      text: "You can restore this account later if needed.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Confirm Archive" },
  },
};

export const archiveProductConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Archive Selected Product?" },
    {
      type: "subheader",
      text: "You are about to archive 12 selected Orders.",
    },
    {
      type: "subheader",
      text: "They will be moved from the active Orders list, but their data will remain in the system.",
    },
    {
      type: "subheader",
      text: "You can restore archived Orders anytime.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Confirm Archive" },
  },
};

export const getProductDetailsConfig = (product) => ({
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "Product Details",
      css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
    },

    {
      type: "subheader",
      text: "View complete product information, pricing, stock status.",
      css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
    },

    { type: "divider" },

    // -----------------
    // Product Images
    // -----------------
    {
      type: "sectionHeader",
      label: "Product Photos",
      css: { fontWeight: "600", fontSize: "16px", marginBottom: "12px" },
    },

    {
      type: "thumbnailList",
      label: "Product Photos",
      readonly: true,
      images: product?.images?.length
        ? product.images.map((img) => ({
          src: img,
          alt: product.productName,
        }))
        : [
          {
            src: "/placeholder.png",
            alt: "No Image",
          },
        ],
    },


    {
      type: "infoGrid",
      name: "product_details",
      columns: 2,
      items: [
        { label: "Product Name", value: product?.name || "-" },
        { label: "Category", value: product?.category?.[0]?.categoryName || "-" },
        { label: "Price", value: `$${product?.unit_price || 0}` },
        { label: "Stock", value: product?.stock_quantity || "-" },
        {
          label: "Status",
          value: product?.status,
          valueStyle: { color: product?.status === "Active" ? "#02C8DE" : "red" },
        },
      ],
    },

    // -----------------
    // DESCRIPTION
    // -----------------
    {
      type: "sectionHeader",
      label: "Product Description",
      css: {
        fontWeight: "600",
        fontSize: "16px",
        marginTop: "24px",
        marginBottom: "12px",
      },
    },
    {
      type: "textBlock",
      content: product?.description || "No description available.",
      css: { fontSize: "14px", color: "#374151" },
    },
  ],
});
