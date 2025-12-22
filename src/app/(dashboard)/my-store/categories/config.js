const { BsFilePdf, BsFileSpreadsheet } = require("react-icons/bs");

export const CategoryFilterConfig = {
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
      label: "Category Status",
      options: [
        { value: "All", label: "All" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
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
      label: "Apply Filters",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: null,
    },
  },
};

export const createCategoryConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Add Category" },
    {
      type: "subheader",
      text: "Add a new category to your store catalogue by entering product details.",
    },
    { type: "divider" },

    {
      type: "file",
      label: "Category Icon",
      label2: "(Max 10 files)",
      name: "category_photo",
    },
    {
      type: "textBlock",
      label: "Category Name",
    },
    { type: "input", placeholder: "e.g, Loc Retwist", name: "name" },
    {
      type: "textarea",
      label: "Description",
      placeholder: "Category Description",
      name: "description",
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
      label: "Add Category",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: null,
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

export const ViewCategoryDetailsConfig = {
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "View Category",
      css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
    },
    {
      type: "subheader",
      text: "View complete Category information, pricing, stock status.",
      css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
    },
    { type: "divider", name: "divider" },

    {
      type: "sectionHeader",
      label: "Category Icon",
    },

    {
      type: "thumbnailList",
      label: "Category Icon",
      images: [
        {
          src: `https://picsum.photos/512?random=${Math.floor(
            Math.random() * 100
          )}`,
          alt: "Product 1",
          onChange: (updatedImages) =>
            console.log("Updated images:", updatedImages),
        },
      ],
    },

    {
      type: "infoGrid",
      name: "category_details",
      columns: 2,
      items: [
        { label: "Category Name", value: "Starter Locs" },
        { label: "Status", value: "Active", valueStyle: { color: "#02C8DE" } },
        {
          label: "Attached Services",
          value: "305",
          valueStyle: { color: "#02C8DE" },
        },
      ],
    },

    {
      type: "sectionHeader",
      label: "Category Description",
      css: {
        fontWeight: "600",
        fontSize: "16px",
        marginTop: "24px",
        marginBottom: "12px",
      },
    },
    {
      type: "textBlock",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
      css: { fontSize: "14px", color: "#374151" },
    },
  ],
};

export const editCategoryConfig = {
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "Edit Category",
    },
    {
      type: "subheader",
      text: "Edit complete category information, pricing, stock status.",
    },
    { type: "divider", name: "divider" },

    { type: "textBlock", label: "Category Icon" },
    {
      type: "thumbnailList",
      label: "Category Photos",
      images: [
        {
          src: `https://picsum.photos/512?random=${Math.floor(
            Math.random() * 100
          )}`,
          alt: "Product 1",
          onChange: (updatedImages) =>
            console.log("Updated images:", updatedImages),
        },
      ],
    },

    {
      type: "input",
      name: "categoryname",
      label: "Category Name",
      placeholder: "Enter Category name",
    },

    {
      type: "selectCheckbox",
      name: "status",
      label: "Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "InActive", value: "InActive" },
      ],
    },
    {
      type: "textarea",
      name: "description",
      label: "Category Description",
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
      label: "Update Category",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
    },
  },
};

export const DeleteCategoryConfig = {
  title: "",
  fields: [
    { type: "header", label: "Delete Category?" },
    {
      type: "subheader",
      text: "Are you sure you want to delete this Category?",
    },
    {
      type: "subheader",
      text: "This action will notify the Clients and initiate the removal process.",
    },
    {
      type: "subheader",
      text: "applicable. Once cancelled, this Category cannot be undone",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Delete Category", color: "red" },
  },
};

export const DeleteCategoryConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Remove Selected Category?" },
    {
      type: "subheader",
      text: "Are you sure you want to delete this Category?",
    },
    {
      type: "subheader",
      text: "This action will notify the Clients and initiate the removal process.",
    },
    {
      type: "subheader",
      text: "applicable. Once cancelled, this Category cannot be undone",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Delete Selection", color: "red" },
  },
};

export const cannotDeleteCategoryConfig = {
  title: "",
  fields: [
    { type: "header", label: "Cannot Delete Category" },
    {
      type: "subheader",
      text: "This category cannot be deleted because there are products",
    },
    {
      type: "subheader",
      text: "currently listed under it. Please remove the products before",
    },
    {
      type: "subheader",
      text: "attempting to delete the category.",
    },
  ],
  footer: {
    cancel: { label: "Close" },
    apply: { label: "Back To Main Page" },
  },
};

export const getViewCategoryDetailsConfig = (category) => ({
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "Category Details",
      css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
    },

    {
      type: "subheader",
      text: "View complete Category information.",
      css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
    },

    { type: "divider" },

    {
      type: "sectionHeader",
      label: "Category Icon",
    },

    {
      type: "thumbnailList",
      label: "Category Icon",
      images: [
        {
          src: category?.image || "/no-image.png",
          alt: category?.name,
        },
      ],
    },

    {
      type: "infoGrid",
      columns: 2,
      items: [
        { label: "Category Name", value: category?.name || "N/A" },
        { label: "Status", value: category?.status, valueStyle: { color: "#02C8DE" } },
        { label: "Attached Services", value: category?.services?.length || 0 },
      ],
    },

    {
      type: "sectionHeader",
      label: "Category Description",
      css: { marginTop: "20px" },
    },

    {
      type: "textBlock",
      content: category?.description || "No description available.",
    },
  ],
});

export const getEditCategoryConfig = () => ({
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
  },

  fields: [
    { type: "header", label: "Edit Category" },
    { type: "subheader", text: "Update category details" },
    { type: "divider" },

    { type: "file", name: "image", label: "Category Icon" },

    { type: "input", name: "name", label: "Category Name" },

    {
      type: "selectCheckbox",
      name: "status",
      label: "Category Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },

    {
      type: "textarea",
      name: "description",
      label: "Description",
      rows: 4,
    },
  ],

  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Update Category" },
  },
});