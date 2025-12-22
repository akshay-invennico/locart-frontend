
const baseFormCss = {
  maxWidth: "700px",
  width: "100%",
  margin: "0 auto",
  fontFamily: "Inter, sans-serif",
  backgroundColor: "#fff",
  borderRadius: "1rem",
  padding: "1.5rem",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "N/A";
  return `$${parseFloat(amount).toFixed(2)}`;
};


const getStatusColor = (status) => {
  const statusColors = {
    active: "#00A78E",
    pending: "#F59E0B",
    completed: "#9CA3AF",
    cancelled: "#EF4444",
    ongoing: "#3B82F6",
    upcoming: "#8B5CF6",
    paid: "#02C8DE",
  };
  return statusColors[status?.toLowerCase()] || "#6B7280";
};



export const viewBookingDetailsConfig = (bookingData) => {
  return {
    formCss: {
      ...baseFormCss,
      ...(bookingData?.formCss || {}), 
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
        columns: 2,
        items: [
          {
            label: "Booking ID",
            value: bookingData?.booking_number || "N/A",
            valueStyle: { color: "#02C8DE" },
          },
          {
            label: "Date & Time",
            value:
              bookingData?.date && bookingData?.time
                ? `${bookingData.date} ${bookingData.time}`
                : "N/A",
          },
          { label: "Services", value: bookingData?.serviceNames || "N/A" },
          { label: "Booked On", value: bookingData?.bookedOn || "N/A" },
          { label: "Stylist", value: bookingData?.stylistName || "N/A" },
          {
            label: "Status",
            value: bookingData?.status || "N/A",
            valueStyle: {
              color: getStatusColor(bookingData?.status),
              textTransform: "capitalize",
            },
          },
        ],
      },
      {
        type: "sectionHeader",
        label: "Client Information",
        css: {
          fontWeight: "600",
          fontSize: "16px",
          marginTop: "24px",
          marginBottom: "12px",
        },
      },
      {
        type: "infoGrid",
        columns: 2,
        items: [
          {
            label: "Client Name",
            value: bookingData?.clientName?.name || "N/A",
          },
          {
            label: "Email",
            value: bookingData?.clientName?.email || "N/A",
            valueStyle: { color: "#02C8DE" },
          },
        ],
      },
      {
        type: "sectionHeader",
        label: "Payment Details",
        css: {
          fontWeight: "600",
          fontSize: "16px",
          marginTop: "24px",
          marginBottom: "12px",
        },
      },
      {
        type: "infoGrid",
        columns: 2,
        items: [
          {
            label: "Amount",
            value: formatCurrency(bookingData?.amount),
            valueStyle: { color: "#000000", fontWeight: 500 },
          },
          {
            label: "Discount",
            value: bookingData?.discount ? `${bookingData.discount}%` : "0%",
          },
          {
            label: "Payment Status",
            value: bookingData?.paymentStatus || "N/A",
            valueStyle: {
              color:
                bookingData?.paymentStatus === "Paid"
                  ? "#00A78E"
                  : "#F59E0B",
              textTransform: "capitalize",
            },
          },
          { label: "Booking Mode", value: bookingData?.bookingMode || "N/A" },
        ],
      },
    ],
  };
};


export const viewBookingDetailsConfigFromAPI = (apiResponse) => {
  const booking = apiResponse?.data || apiResponse;
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
        columns: 2,
        items: [
          {
            label: "Booking ID",
            value: booking?.booking_number || "N/A",
            valueStyle: { color: "#02C8DE" },
          },
          {
            label: "Date & Time",
            value:
              booking?.date && booking?.time
                ? `${booking.date} ${booking.time}`
                : "N/A",
          },
          {
            label: "Services",
            value:
              booking?.services?.map((s) => s.name).join(", ") || "N/A",
          },
          {
            label: "Booked On",
            value: booking?.created_at || booking?.date || "N/A",
          },
          {
            label: "Stylist",
            value: booking?.stylist?.name || "N/A",
            valueStyle: { color: "#02C8DE" },
          },
          {
            label: "Status",
            value: booking?.status || "N/A",
            valueStyle: {
              color: getStatusColor(booking?.status),
              textTransform: "capitalize",
            },
          },
        ],
      },
      // {
      //   type: "sectionHeader",
      //   label: "Client Information",
      //   css: {
      //     fontWeight: "600",
      //     fontSize: "16px",
      //     marginTop: "24px",
      //     marginBottom: "12px",
      //   },
      // },
      // {
      //   type: "profileCard",
      //   name: booking?.client?.name || "Client",
      //   email: booking?.client?.email || "N/A",
      //   avatar:
      //     booking?.client?.profile_picture ||
      //     booking?.client?.avatar ||
      //     "",
      //   subtitle: `Client ID: ${booking?.client?.id || "N/A"}`,
      //   phone: booking?.client?.phone
      //     ? { label: "Phone", value: booking.client.phone }
      //     : null,
      // },
      {
        type: "sectionHeader",
        label: "Payment Details",
        css: {
          fontWeight: "600",
          fontSize: "16px",
          marginTop: "24px",
          marginBottom: "12px",
        },
      },
      {
        type: "infoGrid",
        columns: 2,
        items: [
          {
            label: "Amount",
            value: formatCurrency(booking?.payment?.amount_paid),
            valueStyle: { color: "#000", fontWeight: "600" },
          },
          {
            label: "Status",
            value: booking?.payment?.payment_status || "N/A",
            valueStyle: {
              color: getStatusColor(booking?.payment?.payment_status),
              textTransform: "capitalize",
            },
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
        invoiceId: booking?.invoice?.invoice_id || booking?.invoice_id || "N/A",
        items: [
          { label: "Service Charges", value: booking?.invoice?.service_charges || "N/A" },
          { label: "Taxes", value: booking?.invoice?.taxes || 0 },
          { label: "Total", value: booking?.invoice?.service_charges + booking?.invoice?.taxes || "N/A" },
          {
            label: "Loyalty Points Discount",
            value: booking?.invoice?.loyalty_discount || 0,
            color: "#EF4444",
          },
          {
            label: "Total Payable Amount",
            value: booking?.invoice?.total_payable || "N/A",
            bold: true,
            valueStyle: { color: "#000000" },
          },
        ],
      },
    ],
  };
};



export const createEditBookingConfig = (bookingData = {}, stylistList = []) => {
  return {
    formCss: {
      ...baseFormCss,
      maxWidth: "600px",
    },
    fields: [
      { type: "header", label: "Edit Booking" },
      {
        type: "subheader",
        text: "Update booking details to reflect the latest information.",
        css: { color: "#6B7280", fontSize: "14px", marginBottom: "20px" },
      },
      { type: "divider" },

      {
        type: "inputReadOnly",
        name: "booking_id",
        label: "Booking ID",
        value: bookingData?.booking_id || "N/A",
        // placeholder: "#BK00000000",
        css: { backgroundColor: "#F5F5F5" },
        readonly: true,
      },

      {
        type: "date",
        name: "booking_date",
        label: "Booking Date",
        value: bookingData?.date || "",
      },
      {
        type: "time",
        name: "booking_time",
        label: "Booking Time",
        value: bookingData?.time || "",
      },
      {
        type: "selectCheckbox",
        name: "stylist",
        label: "Select Stylist",
        value: bookingData?.stylist?._id || bookingData?.stylist?.id
          ? [bookingData.stylist._id || bookingData.stylist.id]
          : [],
        options: stylistList.map((s) => ({
          value: s._id || s.id,
          label: s.fullName || s.name,
        })),
      },
      {
        type: "selectCheckbox",
        name: "payment_status",
        label: "Payment Status",
        value: bookingData?.payment?.payment_status
          ? [bookingData.payment.payment_status.toLowerCase()]
          : [],
        options: [
          { value: "pending", label: "Pending" },
          { value: "paid", label: "Paid" },
        ],
      },

      {
        type: "selectCheckbox",
        name: "booking_status",
        label: "Booking Status",
        value:
          bookingData?.status
            ? [bookingData.status]
            : [],
        options: [
          { value: "confirmed", label: "Confirmed" },
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
        onClick: () => console.log("Cancelled Edit"),
      },
      apply: {
        label: "Update Booking",
        className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
        onClick: (data) => console.log("Updated Booking Data:"),
      },
    },

    initialValues: {
      clientName: bookingData?.clientName || "",
      stylistName: bookingData?.stylistName || "",
      serviceNames: Array.isArray(bookingData?.serviceNames)
        ? bookingData.serviceNames.join(", ")
        : bookingData?.serviceNames || "",
      amount: bookingData?.amount || "",
      date: bookingData?.date || "",
    },
  };
};


