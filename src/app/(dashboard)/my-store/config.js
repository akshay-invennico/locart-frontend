
export const getStoreFormConfig = (mode = "create", initialData = {}) => {
  return {
    formCss: {
      maxWidth: "500px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
   fields: [
      { type: "header", label: mode === "create" ? "Create Store" : "Edit Store" },
      { type: "subheader", text: mode === "create" ? "Enter details" : "Update details" },
      { type: "divider" },

      { type: "textBlock", label: "Street Logo" },
      { type: "file", name: "logo", value: initialData.logo || "" },

      { type: "textBlock", label: "Cover Image" },
      { type: "file", name: "coverImage", value: initialData.coverImage || "" },

      { type: "textBlock", label: "Store Name" },
      { type: "input", name: "name", placeholder: "Store Name", value: initialData.name || "" },

      { type: "textBlock", label: "Street Address" },
      { type: "input", name: "streetAddress", placeholder: "Street Name", value: initialData.streetAddress || "" },

      {
        type: "inputPair",
        label1: "City",
        name1: "city",
        placeholder1: "Enter City",
        value1: initialData.city || "",

        label2: "State",
        name2: "state",
        placeholder2: "Enter State",
        value2: initialData.state || "",
      },

      {
        type: "inputPair",
        label1: "Zip Code",
        name1: "zipCode",
        placeholder1: "Zip Code",
        value1: initialData.zipCode || "",

        label2: "Map Link",
        name2: "mapLink",
        placeholder2: "Map Link",
        value2: initialData.mapLink || "",
      },

      {
        type: "inputPair",
        label1: "Phone",
        name1: "phone",
        placeholder1: "Phone",
        value1: initialData.phone || "",

        label2: "Email",
        name2: "email",
        placeholder2: "Email",
        value2: initialData.email || "",
      },

      { type: "textBlock", label: "Website" },
      { type: "input", name: "website", placeholder: "URL", value: initialData.website || "" },

      {
        type: "inputPair",
        label1: "Facebook",
        name1: "facebook",
        placeholder1: "Link",
        value1: initialData.facebook || "",

        label2: "Instagram",
        name2: "instagram",
        placeholder2: "Link",
        value2: initialData.instagram || "",
      },

      {
        type: "inputPair",
        label1: "LinkedIn",
        name1: "linkedin",
        placeholder1: "Link",
        value1: initialData.linkedin || "",

        label2: "Twitter",
        name2: "twitter",
        placeholder2: "Link",
        value2: initialData.twitter || "",
      },

      {
        type: "textarea",
        name: "about",
        label: "About the Salon",
        placeholder: "About the Salon",
        value: initialData.about || "",
      },
    ],
     footer: {
      cancel: {
        label: "Cancel",
        className: "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
        onClick: () => console.log("Cancelled"),
      },
      apply: {
        label: mode === "create" ? "Create Store" : "Update Store",
        className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
        onClick : null,
      },
    },
  };
};


export const bannerProfileConfig = {
  coverImage: {
    label: "Cover Image",
    key: "coverImage",
    type: "image",
    value: "/icons/bannerImage.svg", 
  },
  profileImage: {
    label: "Profile Image",
    key: "profileImage",
    type: "image",
    value: "/icons/bannerProfile.svg", 
  },
  storeName: {
    label: "Store Name",
    key: "name",
    type: "text",
    value: "Loc Art Studio",
  },
  aboutStoreHeader: {
    label: "About Salon Header",
    key: "aboutHeader",
    type: "text",
    value: "About the Salon",
  },
  aboutStoreText: {
    label: "About Store Text",
    key: "about",
    type: "text",
    value: "We are a premium salon providing professional hair and beauty services with experienced stylists.",
  },
  locationHeader: {
    label: "Location Header",
    key: "locationHeader",
    type: "text",
    value: "Location",
  },
  locationText: {
    label: "Location Text",
    key: "location",
    type: "text",
    value: "2047 Auburn Ave NE, Atlanta, Atlanta, USA 30303",
  },
};



