import Image from "next/image";

export const AddAppointmentConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "hidden", name: "user_id" },
    { type: "header", label: "Add Appointment" },
    {
      type: "subheader",
      text: "Create a new booking by selecting Client, service, stylist, and time.",
    },
    { type: "divider" },

    {
      type: "toggle",
      label: "Client Type",
      name: "clientType",
      options: [
        { label: "Existing Client", value: "existing" },
        {
          label: "New Client",
          value: "new",
          clearFields: ["user_id", "existingClient"],
        },
      ],
    },

    {
      type: "conditional",
      name: "existingClientSection",
      condition: (formData) => formData.clientType === "existing",
      fields: [
        {
          key: "existingClient",
          label: "Existing Client",
          type: "search_dropdown",
          options: [],
          renderOption: (user) => (
            <div className="flex items-center gap-2">
              <Image
                src={user.profile || "/default.png"}
                width={20}
                height={20}
                className="rounded-full"
                alt=""
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-gray-500 text-sm">{user.email}</div>
                <div className="text-gray-500 text-sm">{user.phone}</div>
              </div>
            </div>
          ),
          renderSelected: (user) => (
            <div className="flex items-center gap-2">
              <Image
                src={user.profile || "/default.png"}
                width={24}
                height={24}
                className="rounded-full"
                alt=""
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-gray-500 text-sm">{user.email}</div>
                <div className="text-gray-500 text-sm">{user.phone}</div>
              </div>
            </div>
          ),
        },
      ],
    },

    // New Client Section
    {
      type: "conditional",
      name: "newClientSection",
      condition: (formData) => formData.clientType === "new",
      fields: [
        {
          type: "input",
          label: "Client Name",
          name: "clientName",
          placeholder: "Enter full name",
          fullWidth: true,
        },
        {
          type: "inputGroup",

          fields: [
            {
              type: "input",
              label: "Email",
              name: "clientEmail",
              placeholder: "Enter email",
            },
            {
              type: "input",
              label: "Phone Number",
              name: "clientPhone",
              placeholder: "Enter phone",
            },
          ],
        },
      ],
    },
    {
      type: "selectCheckbox",
      name: "service_id",
      label: "Select Service",
      options: [],
    },
    {
      type: "selectCheckbox",
      name: "stylist_id",
      label: "Stylist",
      options: [],
    },

    {
      type: "inputGroup",
      columns: 2,
      fields: [
        { type: "date", label: "Date", name: "appointmentDate" },
        { type: "time", label: "Time", name: "appointmentTime" },
      ],
    },
    {
      type: "inputGroup",
      columns: 3,
      fields: [
        {
          type: "input",
          label: "Amount",
          name: "amount",
          placeholder: "$99",
        },
        {
          type: "input",
          label: "Discount",
          name: "discount",
          placeholder: "2%",
        },
        {
          type: "input",
          label: "(Optional) Payable Amount",
          name: "payable",
          placeholder: "$97",
        },
      ],
    },

    {
      type: "inputGroup",
      columns: 2,
      fields: [
        {
          type: "selectCheckbox",
          name: "paymentStatus",
          label: "Payment Status",
          placeholder: "Select Status",
          options: [
            { value: "Unpaid", label: "Unpaid" },
            { value: "Paid", label: "Paid" },
          ],
        },
        {
          type: "selectCheckbox",
          name: "paymentMethod",
          label: "Payment Method",
          placeholder: "Select Method",
          options: [
            { value: "Cash", label: "Cash" },
            { value: "DebitCard", label: "Debit Card" },
            { value: "CreditCard", label: "Credit Card" },
          ],
        },
      ],
    },

    {
      type: "selectCheckbox",
      name: "bookingstatus",
      label: "Booking Status",
      placeholder: "Select Status",
      options: [
        { value: "Upcoming", label: "Upcoming" },
        { value: "Ongoing", label: "Ongoing" },
        { value: "Pending", label: "Pending" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
    {
      type: "textarea",
      label: "Booking Note",
      label2: "Max 200 Words | Optional",
      placeholder: "Note",
      name: "booking_note",
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
      label: "Confirm Booking",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: null,
    },
  },
};

export const AppointmentFilterConfig = {
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
      label: "Status",
      options: [
        { value: "all", label: "All" },
        { value: "ongoing", label: "Ongoing" },
        { value: "upcoming", label: "Upcoming" },
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    { type: "dateRange", name: "joinedDate", label: "Join Date" },
    { type: "numberRange", name: "numberRange", label: "Amount Range" },
    { type: "timeRange", name: "TimeRange", label: "Time Range" },

    {
      type: "selectCheckbox",
      name: "stylist_ids",
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
      name: "service",
      label: "Select Service",
      options: [],
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

export const getAppointmentFilterConfig = (isLoctitan = false) => {
  const baseConfig = {
    ...AppointmentFilterConfig,
    fields: AppointmentFilterConfig.fields.filter((f) => {
      if (isLoctitan && f.name === "stylist") return false;
      return true;
    }),
  };
  return baseConfig;
};

export const getBookingDetailsConfig = (
  isLoctitan = false,
  paymentStatus = "Refunded"
) => {
  const paymentColor = paymentStatus === "Paid" ? "#02C8DE" : "#EF4444";

  const baseConfig = {
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

      // Order Summary Section
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
            value: "booking_number",
            valueStyle: { color: "#02C8DE" },
          },
          { label: "Date & Time", value: "15 Jul, 2025 2:00 PM" },
          { label: "Services", value: "Hair Loc#111" },
          { label: "Booked On", value: "10 Jul,2025" },
          { label: "Stylist", value: "Aaliyah Johnson" },
          {
            label: "Status",
            value: "Completed",
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
            value: "$160.00",
            valueStyle: { color: "#000000" },
          },
          {
            label: "Status",
            value: paymentStatus,
            valueStyle: { color: paymentColor },
          },
        ],
      },

      ...(paymentStatus === "Refunded"
        ? [
          {
            type: "infoGrid",
            name: "refund_reason",
            columns: 1,
            items: [
              {
                label: "Refund Reason",
                value: "Service was cancelled by Client.",
                valueStyle: { color: "#000000" },
              },
            ],
          },
        ]
        : []),

      ...(!isLoctitan
        ? [
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
              { label: "Service Charges", value: "$120.00" },
              { label: "Taxes", value: "$2.00" },
              { label: "Total", value: "$1602.00" },
              {
                label: "Loyalty Points Discount",
                value: "-$2.00",
                color: "#EF4444",
              },
              {
                label: "Total Payable Amount",
                value: "$1600.00",
                bold: true,
                valueStyle: { color: "#000000" },
              },
            ],
          },
        ]
        : []),
    ],
  };
  return baseConfig;
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

export const cancelBookingConfig = {
  title: "",
  fields: [
    { type: "header", label: "Cancel Booking?" },
    {
      type: "subheader",
      text: "Are you sure you want to cancel this Booking?",
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
    apply: { label: "Cancel Booking", color: "red" },
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
    {
      type: "inputReadOnly",
      name: "booking_id",
      label: "Booking ID",
      placeholder: "#BK1023102456145258",
      css: { backgroundColor: "#F5F5F5" },
      readonly: true,
    },

    {
      type: "date",
      name: "date",
      label: "Booking Date",
    },
    {
      type: "time",
      name: "time_slot",
      label: "Booking Time",
    },
    {
      type: "selectCheckbox",
      name: "stylist_id",
      label: "Select Stylist",
      options: [],
    },
    {
      type: "selectCheckbox",
      name: "service_id",
      label: "Select Service",
      options: [],
    },
    {
      type: "selectCheckbox",
      name: "payment_status",
      label: "Payment Status",
      options: [
        { value: "unpaid", label: "Unpaid" },
        { value: "paid", label: "Paid" },
        ,
      ],
    },

    {
      type: "selectCheckbox",
      name: "booking_status",
      label: "Booking Status",
      options: [
        { value: "upcoming", label: "Upcoming" },
        { value: "ongoing", label: "Ongoing" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
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
      onClick: null,
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

export const archiveBookingConfig = {
  title: "",
  fields: [
    { type: "header", label: "Archive Booking?" },
    {
      type: "subheader",
      text: "Are you sure you want to archive this booking? Archived bookings",
    },
    {
      type: "subheader",
      text: "will no longer appear in the active booking list, but all details will remain securely stored in the system.",
    },
    {
      type: "subheader",
      text: "You can restore this booking later if necessary.",
    },
  ],
  footer: {
    cancel: { label: "Cancel" },
    apply: { label: "Confirm Archive" },
  },
};

export const refundDetailsConfig = (apiResponse) => {
  const booking = apiResponse?.booking || {};
  const payment = apiResponse?.payment || {};

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
        label: "Initiate Refund?",
        css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
      },
      {
        type: "subheader",
        text: "This booking has been cancelled.",
        css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
      },
      {
        type: "subheader",
        text: "Please review the payment details below and confirm refund initiation.",
        css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
      },

      // Booking Summary
      {
        type: "sectionHeader",
        label: "Booking Summary",
        css: { fontWeight: "600", fontSize: "16px", marginBottom: "12px" },
      },
      {
        type: "textBlock",
        label: "Booking Summary",
      },
      {
        type: "infoGrid",
        name: "booking_summary",
        items: [
          {
            label: "Booking ID",
            value: booking.booking_id || "-",
            valueStyle: { color: "#02C8DE" },
          },
          {
            label: "Date & Time",
            value: booking.date_time
              ? new Date(booking.date_time).toLocaleString()
              : "-",
          },
          {
            label: "Services",
            value: Array.isArray(booking.services)
              ? booking.services
                .map((s) => (typeof s === "string" ? s : s.name || "-"))
                .join(", ")
              : "-",
          },
          {
            label: "Booked On",
            value: booking.booked_on
              ? new Date(booking.booked_on).toLocaleDateString()
              : "-",
          },
          {
            label: "Stylist",
            value: booking?.stylist?.name || booking.stylist || "-",
          },
          {
            label: "Status",
            value: booking.status || "-",
            valueStyle: { color: "#02C8DE" },
          },
        ],
      },

      // Payment Summary
      {
        type: "textBlock",
        label: "Payment Summary",
      },
      {
        type: "infoGrid",
        name: "payment_summary",
        items: [
          {
            label: "Amount Paid",
            value: `$${payment.amount_paid || 0}`,
            valueStyle: { color: "#000000" },
          },
          {
            label: "Payment Method",
            value: payment.payment_method || "-",
            valueStyle: { color: "#000000" },
          },
          {
            label: "Refundable Amount",
            value: `$${payment.refundable_amount || 0}`,
            valueStyle: { color: "#BC0D10" },
          },
          {
            label: "Refund Status",
            value: payment.refund_status || "-",
            valueStyle: { color: "#BC0D10" },
          },
        ],
      },

      {
        type: "input",
        placeholder: "",
        label: "Confirm Refund Amount",
        name: "confirm_amount",
      },
    ],

    footer: {
      cancel: { label: "Stay Pending" },
      apply: { label: "Confirm Refund" },
    },
  };
};

export const archiveBookingConfigAll = {
  title: "",
  fields: [
    { type: "header", label: "Archive Selected Booking?" },
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

export const flagBookingConfigAll = {
  title: "",
  fields: [
    {
      type: "header",
      label: "Flag Selected Booking?",
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

export const stylistManageAvailability = {
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "header",
      label: "Manage Availability",
      css: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
    },
    {
      type: "subheader",
      text: "Adjust your availability if you expect to finish this booking early.",
      css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
    },
    {
      type: "divider",
    },
    {
      type: "infoGrid",
      name: "booking_summary",
      columns: 2,
      items: [
        {
          label: "Client Name",
          value: "Alicia Brown",
          valueStyle: { color: "#000000" },
        },
        {
          label: "Service",
          value: "Loc Detox",
          valueStyle: { color: "#000000" },
        },
        {
          label: "Booking Date",
          value: "09 Sept 2025",
          valueStyle: { color: "#000000" },
        },
        {
          label: "Scheduled Time",
          value: "12:00 PM - 3:00 PM (3 Hrs)",
          valueStyle: { color: "#000000" },
        },
      ],
    },

    {
      type: "selectCheckbox",
      name: "service",
      placeholder: "Select Time",
      label: "How much earlier do you expect to finish this session?",
      options: [
        { value: "15 mins early", label: "15 mins early" },
        { value: "30 mins early", label: "30 mins early" },
        { value: "45 mins early", label: "45 mins early" },
        { value: "1 Hour early", label: "1 Hour early" },
      ],
    },

    {
      type: "infoGrid",
      name: "new_schedule_summary",
      columns: 1,
      items: [
        {
          label: "New Scheduled Time",
          value: "12:00 PM - 3:00 PM (3 Hrs)",
          valueStyle: { color: "#000000" },
        },
      ],
    },
    {
      type: "infoGrid",
      name: "slot_summary",
      columns: 1,
      items: [
        {
          label: "Available Slot",
          value: "2:00 PM - 3:00 PM will be released for new bookings.",
          valueStyle: { color: "#000000" },
        },
      ],
    },

    {
      type: "toggle",
      name: "publish_slot",
      label: "Publish Slot to booking calendar",
      description: "Auto-publish released slot to public booking calendar.",
      valueStyle: { color: "#000000" },
      value: true,
      onChange: (checked) => console.log("Toggle changed:", checked),
    },
    {
      type: "toggle",
      name: "notify_client",
      label: "Notify Current Client",
      description: "Notify your client you’ll finish earlier than planned.",
      valueStyle: { color: "#000000" },
      value: false,
      onChange: (checked) =>
        console.log("Toggle changed: Notified Client", checked),
    },

    {
      type: "textarea",
      label: "Remark",
      name: "remark",
      label2: "Max 200 Words | Optional",
      placeholder: "Write your Remarks.",
      value: "",
    },
  ],
  footer: {
    close: {
      label: "Cancel",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
      onClick: () => console.log("Cancelled"),
    },
    actions: [
      {
        label: "Confirm Release Slot",
        className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
        onClick: (data) => console.log("Confirmed Release Slot", data),
      },
    ],
  },
};
