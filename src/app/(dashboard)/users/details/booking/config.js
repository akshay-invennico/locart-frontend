export const bookingDetailsConfig = (data = {}) => {
  const {
    booking_id = "",
    date = "",
    time = "",
    booked_on = "",
    status = "",
    booking_mode = "",
    client = {},
    stylist = {},
    services = [],
    payment = {},
    invoice = {},
  } = data || {};
  
  return {
    formCss: {
      maxWidth: "600px",
      width: "100%",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },

    fields: [
      {
        type: "header",
        label: "Booking Details",
        css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
      },
      {
        type: "subheader",
        text: "Review booking information with accuracy and ease.",
        css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
      },

      {
        type: "sectionHeader",
        label: "Booking Summary",
        css: { fontWeight: "600", fontSize: "16px", marginBottom: "12px" },
      },
      {
        type: "infoGrid",
        name: "booking_summary",
        columns: 2,
        items: [
          {
            label: "Booking ID",
            value: booking_id ? `${booking_id}` : "N/A",
            valueStyle: { color: "#02C8DE" },
          },
          {
            label: "Date & Time",
            value: date && time ? `${date} ${time}` : "N/A",
          },
          {
            label: "Services",
            value: services?.length
              ? services.map((s) => `${s.name}`)
              : "N/A",
          },
          {
            label: "Booked On",
            value: booked_on || "N/A",
          },
          {
            label: "Stylist",
            value: stylist?.name || "N/A",
          },
          {
            label: "Status",
            value: status || "N/A",
            valueStyle: { color: "#02C8DE" },
          },
        ],
      },
      {
        type: "sectionHeader",
        label: "Payment Details",
        css: { fontWeight: "600", fontSize: "16px", marginBottom: "12px" },
      },
      {
        type: "infoGrid",
        name: "payment_summary",
        columns: 2,
        items: [
          {
            label: "Amount Paid",
            value: payment?.amount_paid
              ? `$${payment.amount_paid}`
              : "$0.00",
          },
          {
            label: "Status",
            value: payment?.payment_status || "N/A",
            valueStyle: { color: "#02C8DE" },
          },
        ],
      },
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
        invoiceId: data?.invoice_id
          ? `#${data.invoice_id}`
          : "N/A",
        items: [
          {
            label: "Service Charges",
            value: invoice?.service_charges
              ? `$${invoice.service_charges}`
              : "$0.00",
          },
          {
            label: "Taxes",
            value: invoice?.taxes ? `$${invoice.taxes}` : "$0.00",
          },
          {
            label: "Total",
            value: invoice?.total_payable ? `$${invoice.total_payable}` : "$0.00",
          },
          {
            label: "Loyalty Points Discount",
            value: invoice?.loyalty_discount
              ? `- $${invoice.loyalty_discount}`
              : "- $0.00",
            color: "#EF4444",
          },
          {
            label: "Total Payable Amount",
            value: invoice?.payable_amount
              ? `$${invoice.payable_amount}`
              : "$0.00",
            bold: true,
            valueStyle: { color: "#000000" },
          },
        ],
      },
    ],
  };
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

export const flagBookingConfig = {
  title: "",
  fields: [
    {
      type: "header",
      label: "Flag This Booking?",
    },
    {
      type: "subheader",
      text: "Are you sure you want to flag this booking for further review?",
    },
    {
      type: "subheader",
      text: "Flagged bookings will be marked in the system",
    },
    {
      type: "subheader",
      text: "and may require follow-up by the support or moderation team.",
    },
    {
      type: "selectCheckbox",
      name: "suspend_reason",
      label: "Please select a reason for flagging this Booking",
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
