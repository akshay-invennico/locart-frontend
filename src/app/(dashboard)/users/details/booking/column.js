"use client";

import PopupForm from "@/components/ui/popupform";
import { useSelector } from "react-redux";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import { bookingDetailsConfig, flagBookingConfig } from "./config";
import { editBookingConfig } from "./config";
import DetailView from "@/components/modules/DetailView";
import Spinner from "@/components/common/Spinner";

export default function ViewBookingDetails() {
  const { selectedAppointment, loading } = useSelector(
    (state) => state.appointment
  );

  if (loading) return <div className="flex justify-center items-center h-[60vh]">
    <Spinner />
  </div>;

  if (!selectedAppointment) return <p className="flex justify-center items-center h-[60vh]">No booking details found</p>;

  return <DetailView config={bookingDetailsConfig(selectedAppointment)} />;
}


export const columns = ({ handleViewBooking, selectedBooking, handleBulkStatusUpdate, handleEditBooking, handleDownloadInvoice }) => [
  {
    key: "booking_id",
    title: "Booking ID",
    component: {
      type: "phone",
      style: {
        color: "#02C8DE",
      },
    },
  },
  {
    key: "date",
    title: "Date & Time",
    component: {
      type: "date",
      options: {
        format: "MM dd yyyy",
      },
      style: {
        color: "#7B7B7B",
      },
    },
  },
  {
    key: "stylist",
    title: "Stylist",
    component: {
      style: {
        color: "#7B7B7B",
      },
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
      style: {
        color: "#000000",
      },
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
          const actions = [
            {
              label: "View Booking",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              onClick: () => handleViewBooking(row),
              component: <ViewBookingDetails />,
            },
            {
              label: "Edit Booking",
              iconUrl: "/icons/editBooking.svg",
              type: "sidebar",
              component: <DynamicForm config={editBookingConfig(row)} />,
              onApply: (formData) => handleEditBooking(formData, row),
            },
          ];

          // ✅ Only show if NOT completed
          if (row.status !== "completed") {
            actions.push({
              label: "Mark As Completed",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: () => handleBulkStatusUpdate([row], "completed"),
            });
          }

          // Flag (always visible)
          actions.push({
            label: "Flag Booking",
            iconUrl: "/icons/flag.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={flagBookingConfig}
                width="500px"
                onApply={(formData) =>
                  handleBulkStatusUpdate([row], "flagged", formData.reason)
                }
                onCancel={() => console.log("Cancelled")}
              />
            ),
          });

          // Download (always visible)
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
