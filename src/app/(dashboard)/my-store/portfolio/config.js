export const addAlbumConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Add Photos" },
    {
      type: "subheader",
      text: "Upload your salon's photos to showcase your work in the LocArt gallery.",
    },
    { type: "divider" },
    {
      type: "textBlock",
      label: "Album Name",
    },
    { type: "input", placeholder: "" },
    
    {
      type: "selectCheckbox",
      name: "Add Stylist",
      label: "Add Stylist",
      options: [
        { value: "Aaliyah John", label: "Aaliyah John" },
        { value: "Benny Carter", label: "Benny Carter" },
        
      ],
    },
    
    {
      type: "textarea",
      label: "Description",
      label2: "Max 200 Words",
      placeholder: "Description",
      value: "",
    },
    {
      type: "textBlock",
      label: "Gallery Photos",
    },
    {
      type: "file",
      label: "Gallery Photos",
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
      label: "Add Album",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log("Added", data),
    },
  },
};

export const editAlbumConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Edit Photos" },
    {
      type: "subheader",
      text: "Upload your salon's photos to showcase your work in the LocArt gallery.",
    },
    { type: "divider" },
    {
      type: "textBlock",
      label: "Album Name",
    },
    { type: "input", placeholder: "" },
    {
      type: "textBlock",
      label: "Add Stylist",
    },
    {
      type: "selectCheckbox",
      name: "Add Stylist",
      label: "Add Stylist",
      options: [
        { value: "Aaliyah John", label: "Aaliyah John" },
        { value: "Benny Carter", label: "Benny Carter" },
        
      ],
    },
    
    {
      type: "textarea",
      label: "Description",
      label2: "Max 200 Words",
      placeholder: "Description",
      value: "",
    },
    {
      type: "textBlock",
      label: "Gallery Photos",
    },
    {
      type: "file",
      label: "Gallery Photos",
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
      label: "Edit Album",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log("Added", data),
    },
  },
};

