const { BsFilePdf, BsFileSpreadsheet } = require("react-icons/bs");

export const OfferFilterConfig = {
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
      label: "Offer Status",
      column: 3,
      options: [
        { value: "All", label: "All" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Expired", label: "Expired" },
        { value: "Used", label: "Used" },
      ],
    },

    { type: "dateRange", name: "DateRange", label: "Date Range" },
    {
      type: "numberRange",
      name: "DiscountRange",
      label: "Discount Range (in %)",
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
      label: "Apply Filters",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log("Applied Filters", data),
    },
  },
};

export const downloadActions = [
  {
    header: "Download List",
  },
  {
    label: "Download PDF",
    icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
    onClick: () => console.log("Download PDF"),
  },
  {
    label: "Download CSV",
    icon: <BsFileSpreadsheet className="w-4 h-4  text-[#7B7B7B]" />,
    onClick: () => console.log("Download CSV"),
  },
];

export const createOfferConfig = {
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "Create Offer",
    },
    {
      type: "subheader",
      text: "Edit complete category information, pricing, stock status.",
    },
    { type: "divider", name: "divider" },

    {
      type: "inputPair",
      label1: "Offer Name",
      name1: "offerName",
      placeholder1: "SUMMER SALE",
      label2: "Coupon Code",
      name2: "couponCode",
      placeholder2: "SUM20225",
    },
    {
      type: "inputPair",
      label1: "Discount",
      name1: "discount",
      placeholder1: "8%",
      label2: "Max Discount Amount",
      name2: "maxDiscount",
      placeholder2: "$99",
    },
    { type: "dateRange", name: "DateRange", label: "Date Range" },

    {
      type: "selectCheckbox",
      name: "status",
      label: "Offer Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Expired", label: "Expired" },
        { value: "Used", label: "Used" },
      ],
    },

    {
      type: "radioWithConditionalDropdown",
      name: "Offer Condition",
      label: "Booking Note",
      options: [
        {
          value: "Product",
          label: "Product",
          dropdownOptions: [
            {
              value: "Aloe Locking Gel",
              label: "Aloe Locking Gel",
              image: `https://picsum.photos/512?random=${Math.floor(
                Math.random() * 100
              )}`,
            },
            {
              value: "Lavender Calming Mist",
              label: "Lavender Calming Mist",
              image: `https://picsum.photos/512?random=${Math.floor(
                Math.random() * 100
              )}`,
            },
            {
              value: "Cactus Hydrating Serum",
              label: "Cactus Hydrating Serum",
              image: `https://picsum.photos/512?random=${Math.floor(
                Math.random() * 100
              )}`,
            },
          ],
        },
        {
          value: "Categories",
          label: "Categories",
          dropdownOptions: [
            {
              value: "Beauty",
              label: "Beauty",
            },
            {
              value: "Wellness",
              label: "Wellness",
            },
            {
              value: "Accessories",
              label: "Accessories",
            },
          ],
        },
        { value: "Cart Value", label: "Cart Value" },
      ],
      inputPlaceholder: "Enter Minimum Cart Value...",
    },

    {
      type: "textarea",
      name: "description",
      label2: "Max 250 Words",
      label: "Offer Description",
      placeholder: "Enter Category description",
      rows: 5,
    },
  ],
  footer: {
    cancel: {
      label: "Cancel",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
    },
    apply: {
      label: "Create Offer",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
    },
  },
};

export const getOfferDetailsConfig = (offerData) => {
  console.log("🔍 getOfferDetailsConfig called with:", offerData);

  const getDateRange = () => {
    if (offerData.DateRange?.from && offerData.DateRange?.to) {
      return {
        from: new Date(offerData.DateRange.from).toLocaleDateString("en-GB"),
        to: new Date(offerData.DateRange.to).toLocaleDateString("en-GB"),
      };
    } else if (offerData.date) {
      const formattedDate = new Date(offerData.date).toLocaleDateString(
        "en-GB"
      );
      return {
        from: formattedDate,
        to: formattedDate,
      };
    }
    return { from: "N/A", to: "N/A" };
  };

  const dateRange = getDateRange();
  const baseFields = [
    {
      type: "header",
      label: "View Offer",
    },
    {
      type: "subheader",
      text: "See all details for this offer.",
    },
    { type: "divider" },
    {
      type: "infoGrid",
      name: "offer_summary",
      columns: 3,
      items: [
        {
          label: "Offer Name",
          value: offerData.offerName || "N/A",
        },
        {
          label: "Coupon Code",
          value: offerData.couponCode || "N/A",
        },
        {
          label: "Discount",
          value: offerData.discount || "N/A",
        },
        {
          label: "Max Discount Amount",
          value: offerData.maxDiscount || "N/A",
        },

        {
          label: "Status",
          value: Array.isArray(offerData.status)
            ? offerData.status.join(", ")
            : offerData.status || "N/A",
          valueStyle: { color: "#02C8DE" },
        },
      ],
    },
    { type: "divider" },
    {
      type: "sectionHeader",
      label: "Date Range",
    },

    {
      type: "infoGrid",
      columns: 2,
      items: [
        {
          label: "From",
          value: dateRange.from,
        },
        {
          label: "To",
          value: dateRange.to,
        },
      ],
    },
    { type: "divider" },
  ];

  console.log("🧩 Offer Condition:", offerData.OfferCondition);
  console.log("🧩 Selected Items:", offerData.selectedDropdownItems);

  //  Conditional Rendering Based on Offer Condition
  if (offerData.OfferCondition === "Product") {
    baseFields.push({
      type: "sectionHeader",
      label: "Products",
    });

    if (
      offerData.selectedDropdownItems &&
      offerData.selectedDropdownItems.length > 0
    ) {
      baseFields.push({
        type: "productList",
        items: offerData.selectedDropdownItems.map((p) => ({
          label: p.label,
          value: p.value,
        })),
      });
    } else {
      baseFields.push({
        type: "textBlock",
        content: "No products selected",
        css: { color: "#999", fontStyle: "italic" },
      });
    }
  } else if (offerData.OfferCondition === "Categories") {
    baseFields.push({
      type: "sectionHeader",
      label: "Categories",
    });

    if (
      offerData.selectedDropdownItems &&
      offerData.selectedDropdownItems.length > 0
    ) {
      baseFields.push({
        type: "categoryList",
        items: offerData.selectedDropdownItems.map((c) => ({
          label: c.label,
          value: c.value,
        })),
      });
    } else {
      baseFields.push({
        type: "textBlock",
        content: "No categories selected",
        css: { color: "#999", fontStyle: "italic" },
      });
    }
  } else if (offerData.OfferCondition === "Cart Value") {
    baseFields.push({
      type: "sectionHeader",
      label: "Cart Value Condition",
    });
    baseFields.push({
      type: "infoGrid",
      columns: 1,
      items: [
        {
          label: "Minimum Cart Value",
          value: offerData.cartValue || "N/A",
          valueStyle: { color: "#02C8DE", fontWeight: "600" },
        },
      ],
    });
  }

  baseFields.push({ type: "divider" });
  baseFields.push({
    type: "sectionHeader",
    label: "Description",
  });
  baseFields.push({
    type: "textBlock",
    content: offerData.description || "No description available.",
    css: {
      color: "#374151",
      lineHeight: "1.6",
      whiteSpace: "pre-wrap",
    },
  });

  console.log("✅ Final config fields:", baseFields);

  return {
    formCss: {
      maxWidth: "600px",
      margin: "0 auto",
    },
    fields: baseFields,
  };
};

export const editOfferConfig = {
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "Edit Offer",
    },
    {
      type: "subheader",
      text: "Edit complete category information, pricing, stock status.",
    },
    { type: "divider", name: "divider" },

    {
      type: "inputPair",
      label1: "Offer Name",
      name1: "offerName",
      placeholder1: "SUMMER SALE",
      label2: "Coupon Code",
      name2: "couponCode",
      placeholder2: "SUM20225",
    },
    {
      type: "inputPair",
      label1: "Discount",
      name1: "discount",
      placeholder1: "8%",
      label2: "Max Discount Amount",
      name2: "maxDiscount",
      placeholder2: "$99",
    },
    { type: "dateRange", name: "DateRange", label: "Date Range" },

    {
      type: "selectCheckbox",
      name: "status",
      label: "Offer Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Expired", label: "Expired" },
        { value: "Used", label: "Used" },
      ],
    },

    {
      type: "radioWithConditionalDropdown",
      name: "Offer Condition",
      label: "Booking Note",
      options: [
        {
          value: "Product",
          label: "Product",
          dropdownOptions: [
            {
              value: "Aloe Locking Gel",
              label: "Aloe Locking Gel",
              image: `https://picsum.photos/512?random=${Math.floor(
                Math.random() * 100
              )}`,
            },
            {
              value: "Lavender Calming Mist",
              label: "Lavender Calming Mist",
              image: `https://picsum.photos/512?random=${Math.floor(
                Math.random() * 100
              )}`,
            },
            {
              value: "Cactus Hydrating Serum",
              label: "Cactus Hydrating Serum",
              image: `https://picsum.photos/512?random=${Math.floor(
                Math.random() * 100
              )}`,
            },
          ],
        },
        {
          value: "Categories",
          label: "Categories",
          dropdownOptions: [
            { value: "Beauty", label: "Beauty" },
            { value: "Wellness", label: "Wellness" },
            { value: "Accessories", label: "Accessories" },
          ],
        },
        { value: "Cart Value", label: "Cart Value" },
      ],
      inputPlaceholder: "Enter Minimum Cart Value...",
    },

    {
      type: "textarea",
      name: "description",
      label2: "Max 250 Words",
      label: "Offer Description",
      placeholder: "Enter Category description",
      rows: 5,
    },
  ],
  footer: {
    cancel: {
      label: "Cancel",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
    },
    apply: {
      label: "Update Offer",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
    },
  },
  
};

export const DeleteOfferConfig = {
  title: "",
  fields: [
    { type: "header", label: "Delete Offers?" },
    {
      type: "subheader",
      text: "Are you sure you want to delete this selected Offers?",
    },
    {
      type: "subheader",
      text: "This action will notify the Clients and initiate the deletion process.",
    },
    {
      type: "subheader",
      text: "applicable. Once deleted, this offers cannot be undone",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Delete Offer", color: "red" },
  },
};
export const DeleteOfferConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Delete Selected Offers?" },
    {
      type: "subheader",
      text: "Are you sure you want to delete this selected Offers?",
    },
    {
      type: "subheader",
      text: "This action will notify the Clients and initiate the deletion process.",
    },
    {
      type: "subheader",
      text: "applicable. Once deleted, this offers cannot be undone",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Delete Selection", color: "red" },
  },
};

export const cannotDeleteOfferConfig = {
  title: "",
  fields: [
    { type: "header", label: "Cannot Delete Offers" },
    {
      type: "subheader",
      text: "This offer cannot be deleted because there are Offers",
    },
    {
      type: "subheader",
      text: "currently listed under it. Please remove the offers before",
    },
    {
      type: "subheader",
      text: "attempting to delete the offer.",
    },
  ],
  footer: {
    cancel: { label: "Close" },
    apply: { label: "Back To Main Page" },
  },
};
export const cannotDeleteOfferConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Cannot Delete Selected Offers" },
    {
      type: "subheader",
      text: "This selected offer cannot be deleted because there are Offers",
    },
    {
      type: "subheader",
      text: "currently listed under it. Please remove the offers before",
    },
    {
      type: "subheader",
      text: "attempting to delete the offer.",
    },
  ],
  footer: {
    cancel: { label: "Close" },
    apply: { label: "Back To Main Page" },
  },
};
