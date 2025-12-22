export const archiveClientConfig = {
  title: "",
  fields: [
    { type: "header", label: "Archive Client" },
    {
      type: "subheader",
      text: "Are you sure you want to archive this Client’s account?",
    },
    {
      type: "subheader",
      text: "Archived Clients will no longer appear in the active Client list but their data will remain securely stored in the system.",
    },
    {
      type: "subheader",
      text: "You can restore this account later if needed.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Archive Client" },
  },
};
export const archiveClientConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Archive Selected Clients?" },
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

export const reactivateClientConfig = {
  title: "",
  fields: [
    { type: "header", label: "Reactivate Client" },
    {
      type: "subheader",
      text: "Are you sure you want to reactivate this Client’s account? Once reactivated, the Client will regain full access to LocArt, including booking appointments and making purchases.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Confirm Reactivate Client" },
  },
};

export const suspendClientConfig = {
  title: "",
  fields: [
    { type: "header", label: "Suspend Client" },
    {
      type: "subheader",
      text: "Select reason for suspension and optionally add notes.",
    },
    {
      type: "selectCheckbox",
      name: "suspend_reason",
      label: "Select Reason",
      showTextarea: true,
      textareaLabel: "Note",
      textareaName: "note",
      textareaPlaceholder: "Add note if 'Other' selected",

      options: [
        { label: "Inappropriate behavior", value: "Inappropriate  behavior" },
        { label: "Multiple no-shows", value: "Payment-related issues" },
        { label: "Spam or fake account", value: "Spam or fake account" },
        { label: "Client request", value: "Client request" },
        {
          label: "Missing essential Client details.",
          value: "Missing essential Client details.",
        },
        { label: "Other", value: "Other" },
      ],
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Suspend Client" ,color:"red"},
  },
};

export const suspendClientConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Suspend Selected Client" },
    {
      type: "subheader",
      text: "You are about to suspend 12 Clients.",
    },
    {
      type: "subheader",
      text: "They will lose access to all app features until reactivated.",
    },
    {
      type: "subheader",
      text: "Please select a common reason for suspension.",
    },
    {
      type: "selectCheckbox",
      name: "suspend_reason",
      label: "Select Reason",
      showTextarea: true,
      textareaLabel: "Note",
      textareaName: "note",
      textareaPlaceholder: "Add note if 'Other' selected",

      options: [
        { label: "Inappropriate behavior", value: "Inappropriate  behavior" },
        { label: "Multiple no-shows", value: "Payment-related issues" },
        { label: "Spam or fake account", value: "Spam or fake account" },
        { label: "Client request", value: "Client request" },
        {
          label: "Missing essential Client details.",
          value: "Missing essential Client details.",
        },
        { label: "Other", value: "Other" },
      ],
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Confirm Suspend All" , color: "red"},
  },
};
