"use client";

import PopupForm from "@/components/ui/popupform";
import { useSelector } from "react-redux";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import { bookingDetailsConfig, flagBookingConfig } from "./config";
import { editBookingConfig } from "./config";
import ViewUser from "../../viewUser";
import DetailView from "@/components/modules/DetailView";
import { fetchAppointmentDetails } from "@/state/appointment/appointmentSlice";
import Spinner from "@/components/common/Spinner";

export default function ViewBookingDetails() {
  const { appointmentDetails, loading } = useSelector(
    (state) => state.appointment
  );

  if (loading) return <div className="flex justify-center items-center h-[60vh]">
    <Spinner />
  </div>;

  if (!appointmentDetails) return <p className="flex justify-center items-center h-[60vh]">No booking details found</p>;

  return <DetailView config={bookingDetailsConfig(appointmentDetails)} />;
}


export const columns = ({ handleViewBooking, selectedBooking, handleBulkStatusUpdate }) => [
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
          active: "#00A78E", // Green
          pending: "#F59E0B", // Amber
          completed: "#9CA3AF", // Gray
          cancelled: "#EF4444", // Red
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
        actions: [
          {
            label: "View Booking",
            iconUrl: "/icons/show.svg",
            type: "sidebar",
            onClick: (row) => handleViewBooking(row),
            component: <DetailView config={bookingDetailsConfig(selectedBooking)} />
          },
          {
            label: "Edit Booking",
            iconUrl: "/icons/editBooking.svg",
            type: "sidebar",
            component: <DynamicForm config={editBookingConfig} />,
          },
          {
            label: "Mark As Completed",
            iconUrl: "/icons/markCompleted.svg",
            type: "action",
            onClick: (row) => handleBulkStatusUpdate([row], "completed")
          },
          {
            label: "Flag Booking",
            iconUrl: "/icons/flag.svg",
            type: "popUp",
            component: (
              <PopupForm
                config={flagBookingConfig}
                width="500px"
                onApply={(formData, rows) =>
                  handleBulkStatusUpdate([rows], "flagged", formData.reason)
                }
                onCancel={() => console.log("Cancelled")}
              />
            ),
          },

          {
            label: "Download Invoice",
            iconUrl: "/icons/downloadGray.svg",
            // type: "popUp",
            onClick: (data) => console.log("password Reset link send", data),
          },
        ],
      },
    },
  },
];