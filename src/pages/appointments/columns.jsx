import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";

export const getColumns = ({
  onView,
  onEdit,
  onRefund,
  onFlag,
  onCancel,
  onStatusUpdate,
  onManageAvailability,
  onDownloadInvoice,
  isLoctitian = false,
}) => [
  {
    key: "booking_number",
    title: "Booking ID",
    component: {
      type: "phone",
      style: {
        color: "var(--color-primary1)",
      },
    },
  },
  {
    key: "date",
    title: "Date",
    component: {
      type: "date",
      options: {
        format: "dd MM, yyyy",
      },
    },
  },
  {
    title: "Time",
    key: "time",
    component: {
      type: "date",
      options: {
        format: "time",
      },
      style: {
        text: "text-gray-900",
      },
    },
  },
  {
    key: "clientName",
    title: "Client",
    isObject: true,
    structure: {
      name: "name",
      email: "email",
      profile: "profilePhoto",
    },
    component: {
      type: "standard_avatar",
      style: {
        radius: "rounded-full",
      },
    },
  },
  {
    key: "stylistName",
    title: "Stylist",
  },
  {
    key: "serviceNames",
    title: "Service",
  },
  {
    key: "amount",
    title: "Amount",
    component: {
      type: "currency",
      sign: "$",
      position: "start",
    },
  },
  {
    key: "status",
    title: "Status",
    component: {
      type: "badge",
      style: {
        borderRadius: "3.15px",
        padding: "8px 12px",
      },
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
          // Loctitian actions
          if (isLoctitian) {
            return [
              {
                label: "View Booking",
                iconUrl: "/icons/show.svg",
                onClick: () => onView(row),
              },
              {
                label: "Mark As Ongoing",
                iconUrl: "/icons/markCompleted.svg",
                onClick: () => onStatusUpdate([row], "ongoing"),
              },
              {
                label: "Mark As Completed",
                iconUrl: "/icons/markCompleted.svg",
                onClick: () => onStatusUpdate([row], "completed"),
              },
              {
                label: "Manage Availability",
                iconUrl: "/icons/stylist_manage_availability.svg",
                onClick: () => onManageAvailability(row),
              },
              {
                label: "Flag Booking",
                iconUrl: "/icons/flag.svg",
                onClick: () => onFlag(row),
              },
            ];
          }

          // Cancelled bookings specifically
          if (row.status === "cancelled") {
            return [
              {
                label: "View Booking",
                iconUrl: "/icons/show.svg",
                onClick: () => onView(row),
              },
              {
                label: "Download Invoice",
                iconUrl: "/icons/downloadGray.svg",
                onClick: () => onDownloadInvoice && onDownloadInvoice(row),
              },
              {
                label: "Initiate Refund",
                iconUrl: "/icons/refund.svg",
                style: { color: "#BC0D10" },
                onClick: () => onRefund(row),
              },
            ];
          }

          // Active/Pending/Ongoing bookings
          return [
            {
              label: "View Booking",
              iconUrl: "/icons/show.svg",
              onClick: () => onView(row),
            },
            {
              label: "Edit Booking",
              iconUrl: "/icons/editBooking.svg",
              onClick: () => onEdit(row),
            },
            {
              label: "Mark As Completed",
              iconUrl: "/icons/markCompleted.svg",
              onClick: () => onStatusUpdate([row], "completed"),
            },
            {
              label: "Flag Booking",
              iconUrl: "/icons/flag.svg",
              onClick: () => onFlag(row),
            },
            {
              label: "Download Invoice",
              iconUrl: "/icons/downloadGray.svg",
              onClick: () => onDownloadInvoice && onDownloadInvoice(row),
            },
            {
              label: "Cancel Booking",
              iconUrl: "/icons/cancel.svg",
              onClick: () => onCancel(row),
            },
          ];
        },
      },
    },
  },
];
