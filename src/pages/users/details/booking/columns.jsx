import BookingDetailsView from "./BookingDetailsView";
import EditBookingForm from "./forms/EditBookingForm";

export const columns = ({
  handleViewBooking,
  handleBulkStatusUpdate,
  handleEditBooking,
  handleDownloadInvoice,
  handleFlagBooking,
}) => [
  {
    key: "booking_number",
    title: "Booking ID",
    component: {
      type: "phone",
      style: { color: "#02C8DE" },
    },
  },
  {
    key: "date",
    title: "Date & Time",
    component: {
      type: "date",
      options: { format: "MM dd yyyy" },
      style: { color: "#7B7B7B" },
    },
  },
  {
    key: "stylist",
    title: "Stylist",
    component: {
      style: { color: "#7B7B7B" },
      render: (value) => value?.name || "N/A",
    },
  },
  {
    key: "amount_paid",
    title: "Amount",
    component: {
      type: "currency",
      sign: "$",
      position: "start",
      style: { color: "#000000" },
    },
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: { borderRadius: "3.15px", padding: "8px 12px" },
      options: {
        value: {
          active: "#00A78E",
          pending: "#F59E0B",
          completed: "#9CA3AF",
          cancelled: "#EF4444",
        },
      },
    },
  },
  {
    key: "actions",
    title: "Actions",
    component: {
      type: "action",
      options: {
        actions: (row) => {
          const actions = [
            {
              label: "View Booking",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: () => handleViewBooking(row),
              component: <BookingDetailsView />,
            },
            {
              label: "Edit Booking",
              iconUrl: "/icons/editBooking.svg",
              type: "sidebar",
              component: (
                <EditBookingForm
                  row={row}
                  onSubmit={(formData) => handleEditBooking(formData, row)}
                />
              ),
            },
          ];

          if (row.status !== "completed") {
            actions.push({
              label: "Mark As Completed",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: () => handleBulkStatusUpdate([row], "completed"),
            });
          }

          actions.push({
            label: "Flag Booking",
            iconUrl: "/icons/flag.svg",
            type: "popUp",
            onAction: (data) =>
              handleBulkStatusUpdate([row], "flagged", data?.reason),
          });

          actions.push({
            label: "Download Invoice",
            iconUrl: "/icons/downloadGray.svg",
            onClick: () => handleDownloadInvoice(row),
          });

          return actions;
        },
      },
    },
  },
];
