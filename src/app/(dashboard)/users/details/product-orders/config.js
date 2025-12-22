export const orderDetailsConfig = {
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "Order Details",
      css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
    },
    {
      type: "subheader",
      text: "View complete information about this order, including items, delivery, and payment summary.",
      css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
    },

    // Order Summary Section
    {
      type: "sectionHeader",
      label: "Order Summary",
      css: { fontWeight: "600", fontSize: "16px", marginBottom: "12px" },
    },
    {
      type: "infoGrid",
      name: "order_summary",
      columns: 3,
      items: [
        {
          label: "Order ID",
          value: "#BK10231024561A5258",
          valueStyle: { color: "#02C8DE" },
        },
        { label: "Total Amount", value: "$1600" },
        {
          label: "Transaction ID",
          value: "TXN542183V0",
          valueStyle: { color: "#02C8DE" },
        },
        { label: "Date", value: "15 Jul, 2025" },
        { label: "Payment Method", value: "Credit Card" },
        {
          label: "Status",
          value: "Delivered",
          valueStyle: { color: "#02C8DE" },
        },
      ],
    },

    {
      type: "sectionHeader",
      label: "Products Ordered",
      css: {
        fontWeight: "600",
        fontSize: "16px",
        marginTop: "24px",
        marginBottom: "12px",
      },
    },

    {
      type: "productTable",
      name: "products",
      headers: ["Product Name", "Quantity", "Price", "Subtotal"],
      rows: [
        {
          product: { name: "Aloe Locking Gel", image: "/product-image.jpg" },
          quantity: 2,
          price: "$400",
          subtotal: "$800.00"
        },
        {
          product: { name: "Aloe Locking Gel", image: "/product-image.jpg" },
          quantity: 2,
          price: "$400",
          subtotal: "$800.00"
        }
      ],
      total: "$1600.00"
    },

    

    // Shipping Address
    {
      type: "sectionHeader",
      label: "Shipping Address",
      css: {
        fontWeight: "600",
        fontSize: "16px",
        marginTop: "24px",
        marginBottom: "12px",
      },
    },
    {
      type: "textBlock",
      content:
        "Nia Banks 203, Lakshmi Towers, Sector 17 New Delhi - 110075, India",
      css: { fontSize: "14px", color: "#374151" },
    },
    {
      type: "phoneNumber",
      value: "+91 9876543210",
      css: { fontSize: "14px", color: "#374151", marginTop: "8px" },
    },

    // Shipping Details
    {
      type: "sectionHeader",
      label: "Shipping Details",
      css: {
        fontWeight: "600",
        fontSize: "16px",
        marginTop: "24px",
        marginBottom: "12px",
      },
    },
    {
      type: "infoGrid",
      name: "shipping_details",
      columns: 3,
      items: [
        { label: "Courier Partner", value: "Delhivery" },
        {
          label: "Tracking ID",
          value: "DLV123456578",
          valueStyle: { color: "#02C8DE" },
        },
        {
          label: "Shipping Method",
          value: "Standard",
          valueStyle: { color: "#02C8DE" },
        },
        { label: "Dispatched On", value: "15 Jul, 2025" },
        { label: "Delivered On", value: "20 Jul, 2025" },
      ],
    },

    // Invoice Details
    {
      type: "sectionHeader",
      label: "Invoice Details",
      css: {
        fontWeight: "600",
        fontSize: "16px",
        marginTop: "24px",
        marginBottom: "12px",
      },
      action: {
        icon: "download",
        color: "#02C8DE",
      },
    },
    {
      type: "invoiceSummary",
      name: "invoice",
      invoiceId: "#BK10231024561A5258",
      items: [
        { label: "Item Total", value: "$1600.00" },
        { label: "Taxes", value: "$2.00" },
        { label: "Total", value: "$1602.00", bold: true },
        {
          label: "Loyalty Points Discount",
          value: "- $2.00",
          color: "#EF4444",
        },
        {
          label: "Total Payable Amount",
          value: "$1600.00",
          bold: true,
          large: true,
        },
      ],
    },
  ],
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
export const cancelOrderConfig = {
  title: "",
  fields: [
    { type: "header", label: "Cancel Product Order?" },
    {
      type: "subheader",
      text: "Are you sure you want to cancel this order?",
    },
    {
      type: "subheader",
      text: "This action will notify the Client and initiate a refund process if",
    },
    {
      type: "subheader",
      text: "applicable. Once cancelled, this order cannot be undone",
    },
    {
      type: "selectCheckbox",
      name: "suspend_reason",
      label: "Cancellation Reason",
      showTextarea: true,
      textareaLabel: "Note",
      textareaName: "note",
      textareaPlaceholder: "Add note if 'Other' selected",

      options: [
        { label: "Inappropriate behavior", value: "Inappropriate behavior" },
        { label: "Out of stock", value: "Out of stock" },
        { label: "Incorrect address", value: "Incorrect address" },
        { label: "Payment issue", value: "Payment issue" },
        { label: "Other", value: "Other" },
      ],
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Cancel Order", color: "red" },
  },
};
