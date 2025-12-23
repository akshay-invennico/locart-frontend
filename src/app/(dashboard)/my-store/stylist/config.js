export const addStylistConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Add New Stylist" },
    {
      type: "subheader",
      text: "Register a new stylist and assign them to one or more Services.",
    },
    { type: "divider" },
    {
      type: "file",
      label: "Stylist Profile Photo",
    },
    {
      type: "textBlock",
      label: "Full Name",
    },
    { type: "input", placeholder: "", name: "fullName" },

    {
      type: "inputPair",
      label1: "Known as(Nick Name)",
      name1: "nickname",
      placeholder1: "e.g, Lock Whisperer Master",
      value1: "",
      label2: "Specialization",
      name2: "Specialization",
      placeholder2: "Location, LocTrainer",
      value2: "",
    },
    {
      type: "inputPair",
      label1: "Email",
      name1: "email",
      placeholder1: "e.g., john.doe@example.com",
      value1: "",
      label2: "Phone Number",
      name2: "phoneNumber",
      placeholder2: "e.g., (555) 123-4567",
      value2: "",
    },
    {
      type: "selectCheckbox",
      name: "services",
      label: "Select Services",
      options: [],
    },
    {
      type: "selectCheckbox",
      name: "workingDays",
      label: "Select Working Days",
      options: [
        { value: "Monday", label: "Mon" },
        { value: "Tuesday", label: "Tue" },
        { value: "Wednesday", label: "Wed" },
        { value: "Thursday", label: "Thu" },
        { value: "Friday", label: "Fri" },
        { value: "Saturday", label: "Sat" },
        { value: "Sunday", label: "Sun" },
      ],
    },

    {
      type: "timeRange",
      name: "workingHours",
      label: "Time Range",
    },

    {
      type: "inputWithSelectCheckboxDropdown",
      input: {
        label: "Experience",
        name: "experience_years",
        placeholder: "e.g, 5 years",
      },
      selectCheckbox: {
        label: "Status",
        name: "status",
        options: [
          { value: "Active", label: "Active" },
          { value: "InActive", label: "InActive" },
        ],
      },
    },
    {
      type: "textarea",
      label: "About Stylist",
      label2: "Max 200 Words",
      placeholder: "Description",
      value: "",
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
      label: "Add Stylist",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: null,
    },
  },
};

export const archiveStylistConfig = {
  title: "",
  fields: [
    { type: "header", label: "Archive Stylist?" },
    {
      type: "subheader",
      text: "Are you certain you want to archive this stylist’s profile?",
    },
    {
      type: "subheader",
      text: " Archived stylists will no longer show in the active list,",
    },
    {
      type: "subheader",
      text: "but their information will be securely retained in the system.",
    },
    {
      type: "subheader",
      text: "You can reactivate this profile later if necessary.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Archive Stylist" },
  },
};

export const deleteStylistConfig = {
  title: "",
  fields: [
    { type: "header", label: "Delete Stylist?" },
    {
      type: "subheader",
      text: "Are you sure you want to permanently remove this stylist’s profile?",
    },
    {
      type: "subheader",
      text: "This action cannot be reversed and will delete all related information.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Delete Stylist", color: "red" },
  },
};

export const archiveStylistConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Archive Selected Stylist?" },
    {
      type: "subheader",
      text: "You are about to archive 12 selected Clients.",
    },
    {
      type: "subheader",
      text: "They will be moved from the active Client list, but their data will remain in the system.",
    },
    {
      type: "subheader",
      text: "You can restore archived Clients anytime.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Confirm Archive" },
  },
};

export const deleteStylistConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Delete Selected Stylist?" },
    {
      type: "subheader",
      text: "Are you sure you want to permanently remove this stylist’s profile?",
    },
    {
      type: "subheader",
      text: "This action cannot be reversed and will delete all related information.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Yes, Delete Stylist", color: "red" },
  },
};

export const EditStylistConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Edit Stylist" },
    {
      type: "subheader",
      text: "Register a new stylist and assign them to one or more Services.",
    },
    { type: "divider" },
    {
      type: "textBlock",
      label: "Stylist Profile Photo",
    },
    {
      type: "file",
      label: "Stylist Profile Photo",
      name: "profile_photo",
    },
    {
      type: "textBlock",
      label: "Full Name",
    },
    { type: "input", placeholder: "", name: "fullName" },

    {
      type: "inputPair",
      label1: "Known as(Nick Name)",
      name1: "nickname",
      placeholder1: "e.g, Lock Whisperer Master",
      value1: "",
      label2: "Specialization",
      name2: "specialization",
      placeholder2: "Location, LocTrainer",
      value2: "",
    },
    {
      type: "inputPair",
      label1: "Email",
      name1: "email",
      placeholder1: "e.g., john.doe@example.com",
      value1: "",
      label2: "Phone Number",
      name2: "phoneNumber",
      placeholder2: "e.g., (555) 123-4567",
      value2: "",
    },
    {
      type: "selectCheckbox",
      name: "services",
      label: "Select Services",
      options: [],
    },
    {
      type: "selectCheckbox",
      name: "workingDays",
      label: "Select Working Days",
      options: [
        { value: "Monday", label: "Mon" },
        { value: "Tuesday", label: "Tue" },
        { value: "Wednesday", label: "Wed" },
        { value: "Thursday", label: "Thu" },
        { value: "Friday", label: "Fri" },
        { value: "Saturday", label: "Sat" },
        { value: "Sunday", label: "Sun" },
      ],
    },

    {
      type: "timeRange",
      name: "workingHours",
      label: "Time Range",
    },

    {
      type: "inputWithSelectCheckboxDropdown",
      input: {
        label: "Experience",
        name: "experience_years",
        placeholder: "e.g, 5 years",
      },
      selectCheckbox: {
        label: "Status",
        name: "status",
        options: [
          { value: "Active", label: "Active" },
          { value: "InActive", label: "InActive" },
        ],
      },
    },
    {
      type: "textarea",
      name: "about",
      label: "About Stylist",
      label2: "Max 200 Words",
      placeholder: "Description",
      value: "",
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
      label: "Update Stylist",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log(" updated", data),
    },
  },
};

export const stylistDetailsConfig = {
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "Stylist Details",
      css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
    },
    {
      type: "subheader",
      text: "View and manage stylist details, including their linked services.",
      css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
    },

    {
      type: "profileCard",
      name: "profile",
      avatar: "/icons/stylist photo.svg",
      name: "Jimmy Fraz",
      email: "jimmy@selocarl.com",
      subtitle: "The Loc Whisperer | Master",
      phone: {
        label: "Phone Number",
        value: "!555!123-4567",
      },
    },

    {
      type: "infoGrid",
      name: "Details",
      columns: 2,
      items: [
        {
          label: "Joined On",
          value: "07 july, 2025",
          valueStyle: { color: "#000000" },
        },
        {
          label: "Status",
          value: "Active",
          valueStyle: { color: "#02C8DE" },
        },
        {
          label: "Total Bookings",
          value: "160",
          valueStyle: { color: "#000000" },
        },

        { label: "Total Earning", value: "$16000" },
        { label: "Experience", value: "05 Year 3 Months" },
        {
          label: "Ratings",
          value: "4.8/5 (332 reviews)",
          renderType: "rating",
          rating: 4.8,
          totalReviews: 332,
          valueStyle: { color: "#02C8DE", cursor: "pointer" },
        },
        {
          label: "Working Days",
          value: "Mon, Tue, Wed, Thu",
          valueStyle: { color: "#000000" },
        },
        {
          label: "Working Hours",
          value: "08:30 AM to 6:30 PM",
          valueStyle: { color: "#000000" },
        },
        {
          label: "Specialization",
          value: "Loctician, Loc Trainer, Licensed Cosmetologist",
          valueStyle: { color: "#000000" },
        },
      ],
    },

    {
      type: "textBlock",
      content: "Services Offered",
      css: { fontSize: "14px", color: "#374151" },
    },
    {
      type: "serviceGrid",
      name: "services",
      columns: 3,
      services: [
        { name: "Curley Loc", checked: true, css: { color: "#000000" } },
        { name: "Starter Loc", checked: true },
        { name: "Thin Loc", checked: true },
        { name: "Medium Loc", checked: true },
        { name: "Long Loc", checked: true },
        { name: "Sunny Oaks", checked: true },
        { name: "Medium Loc", checked: true },
        { name: "Thick Loc", checked: true },
        { name: "Maple Grove", checked: true },
      ],
    },

    {
      type: "textBlock",
      content: "About Stylist",
      css: { fontSize: "14px", color: "#374151" },
    },
    {
      type: "textBlock",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      css: { fontSize: "14px", color: "#374151" },
    },

    {
      type: "reviewCard",
      reviews: [
        {
          description:
            "Jimmy did an amazing job with my locs! Highly professional and friendly. Will definitely come back.",
          name: "Alicia R.",
          avatar: "/icons/user1.svg",
          rating: 5,
        },
        {
          description:
            "Very skilled stylist. Explained every step and the results were perfect. The ambiance was cozy too.",
          name: "Michael T.",
          avatar: "/icons/user2.svg",
          rating: 4.5,
        },
        {
          description:
            "Great experience overall. Jimmy is attentive and knowledgeable. Loved the final look!",
          name: "Sara K.",
          avatar: "/icons/user3.svg",
          rating: 4.8,
        },
        {
          description:
            "Professional and friendly. My locs have never looked better. Highly recommend.",
          name: "David L.",
          avatar: "/icons/user4.svg",
          rating: 5,
        },
      ],
    },
  ],
};

export const getStylistDetailsConfig = (stylist) => ({
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    {
      type: "header",
      label: "Stylist Details",
      css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
    },
    {
      type: "subheader",
      text: "View and manage stylist details, including their linked services.",
      css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
    },

    {
      type: "profileCard",
      name: "profile",
      avatar: stylist?.avatarUrl || "/noimage.png",
      name: stylist?.fullName || "N/A",
      email: stylist?.email || "N/A",
      subtitle: "Stylist",
      phone: {
        label: "Phone Number",
        value: stylist?.phone || "N/A",
      },
    },

    {
      type: "infoGrid",
      name: "Details",
      columns: 2,
      items: [
        {
          label: "Joined On",
          value: stylist?.createdAt
            ? new Date(stylist.createdAt).toLocaleDateString()
            : "N/A",
        },
        {
          label: "Status",
          value: stylist?.status || "N/A",
          valueStyle: { color: "#02C8DE" },
        },
        {
          label: "Total Bookings",
          value: `${stylist?.totalBookings || 0}`,
          valueStyle: { color: "#000000" },
        },

        { label: "Total Earning", value: `${stylist?.totalEarnings || 0}` },
        {
          label: "Experience",
          value: `${stylist?.experience_years || 0} Year(s)`,
        },
        {
          label: "Rating",
          renderType: "rating",
          rating: Number(stylist?.rating?.$numberDecimal || stylist?.rating || 0),
          value: `${Number(
            stylist?.rating?.$numberDecimal || stylist?.rating || 0
          )}/5`,
        },
        {
          label: "Working Days",
          value:
            (stylist?.workingDays || [])
              .map((d) => {
                const dayMap = {
                  0: "Sun",
                  1: "Mon",
                  2: "Tue",
                  3: "Wed",
                  4: "Thu",
                  5: "Fri",
                  6: "Sat",
                  Sunday: "Sun",
                  Monday: "Mon",
                  Tuesday: "Tue",
                  Wednesday: "Wed",
                  Thursday: "Thu",
                  Friday: "Fri",
                  Saturday: "Sat",
                };
                return dayMap[d] || d;
              })
              .join(", ") || "N/A",
        },
        {
          label: "Working Hours",
          value: stylist?.workingHours
            ? `${stylist.workingHours.start} - ${stylist.workingHours.end}`
            : "N/A",
        },
      ],
    },

    {
      type: "textBlock",
      content: "Services Offered",
      css: { fontSize: "14px", color: "#374151" },
    },
    {
      type: "serviceGrid",
      name: "services",
      columns: 3,
      services: (stylist?.services || []).map((s) => ({
        name: s.name || s,
        checked: true,
      })),
    },
  ],
  footer: {
    close: {
      label: "Close",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded hover:bg-[#02C8DE] hover:text-white transition-colors",
    },
  },
});
