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


