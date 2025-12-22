"use client";

import DynamicForm from "@/components/modules/DynamicFormRendering";
import PopupForm from "@/components/ui/popupform";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveBookingConfig,
  bookingDetailsConfig,
  cancelBookingConfig,
  editBookingConfig,
  flagBookingConfig,
  getBookingDetailsConfig,
  refundDetailsConfig,
  stylistManageAvailability,
} from "./config";
import {
  viewBookingDetailsConfig,
  viewBookingDetailsConfigFromAPI,
  createEditBookingConfig,
} from "./dynamicConfig.js";
import { fetchAppointmentDetails } from "@/state/appointment/appointmentSlice";
import { fetchStylists } from "@/state/stylist/stylistSlice";
import Spinner from "@/components/common/Spinner";
import DetailView from "@/components/modules/DetailView";
import ViewUser from "../users/viewUser";

const EditBookingSidebar = ({ row, onApply }) => {
  const dispatch = useDispatch();
  const { selectedAppointment } = useSelector((state) => state.appointment);
  const { stylists } = useSelector((state) => state.stylists);
  const { services } = useSelector((state) => state.salon);

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  // Fetch appointment details & stylists
  useEffect(() => {
    if (row?.bookingId) dispatch(fetchAppointmentDetails(row.bookingId));
    dispatch(fetchStylists());
  }, [dispatch, row?.bookingId]);

  // Map data to initialValues once everything is loaded
  useEffect(() => {
    const appt = selectedAppointment?.data || selectedAppointment || {};

    // Wait until services & stylists are loaded
    if (!services?.length || !stylists?.length) return;

    const mapped = {
      booking_id: appt.booking_id || "",
      client_name: appt.client?.name || "",
      client_mobile: appt.client?.phone || "",
      service_id: appt.services?.map((s) => s._id) || [],
      stylist_id: appt.stylist?.id ? [appt.stylist.id] : [],
      date: appt.date || "",
      time_slot: appt.time || "",
      amount: appt.invoice?.service_charges || 0,
      discount: appt.invoice?.loyalty_discount || 0,
      booking_status: appt.status ? [appt.status] : [],
      booking_note: appt.booking_note || "",
      payment_status: appt.payment?.payment_status
        ? [appt.payment.payment_status]
        : [],
    };

    setInitialValues(mapped);
    setLoading(false);
  }, [selectedAppointment, services, stylists]);

  if (loading) return <Spinner />;

  const updatedConfig = {
    ...editBookingConfig,
    data: initialValues,
    fields: editBookingConfig.fields.map((f) => {
      if (f.name === "stylist_id") {
        return {
          ...f,
          options: stylists.map((s) => ({
            value: s._id,
            label: s.fullName || s.name,
          })),
        };
      }
      if (f.name === "service_id") {
        return {
          ...f,
          options: services.map((s) => ({ value: s._id, label: s.name })),
        };
      }
      return f;
    }),
    footer: {
      ...editBookingConfig.footer,
      apply: {
        ...editBookingConfig.footer.apply,
        onClick: (data) => onApply(row, data),
      },
    },
  };

  return <DynamicForm config={updatedConfig} isEdit />;
};

export default EditBookingSidebar;

export const getColumns = (
  handleViewBooking,
  handleEditBooking,
  handleInitiateRefundClick,
  handleBulkStatusUpdate,
  isLoctitan = false,
  paymentStatus = "Paid"
) => [
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
      title: "Date & Time",
      component: {
        type: "date",
        options: {
          format: "dd MM, yyyy hh:mm a",
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
        profile: "profile",
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
            // role = loctitan actions
            if (isLoctitan) {
              return [
                {
                  label: "View Booking",
                  iconUrl: "/icons/show.svg",
                  type: "sidebar",
                  component: (
                    <DetailView
                      config={getBookingDetailsConfig(isLoctitan, paymentStatus)}
                    />
                  ),
                },
                {
                  label: "Mark As Ongoing",
                  iconUrl: "/icons/markCompleted.svg",
                  type: "popUp",
                  component: <ViewUser />,
                },
                {
                  label: "Mark As Completed",
                  iconUrl: "/icons/markCompleted.svg",
                  type: "popUp",
                  component: <ViewUser />,
                },
                {
                  label: "Manage Availability",
                  iconUrl: "/icons/stylist_manage_availability.svg",
                  type: "sidebar",
                  component: <DetailView config={stylistManageAvailability} />,
                },
                {
                  label: "Flag Booking",
                  iconUrl: "/icons/flag.svg",
                  type: "popUp",
                  component: (
                    <PopupForm
                      config={flagBookingConfig}
                      width="500px"
                      onApply={(data) => console.log("Flagged:", data)}
                      onCancel={() => console.log("Cancelled")}
                    />
                  ),
                },
              ];
            }

            // role = admin/merchant actions
            // based on grid component's status_column status the actions are displayed
            if (row.status === "cancelled") {
              return [
                {
                  label: "View Booking",
                  iconUrl: "/icons/show.svg",
                  type: "sidebar",
                  // component: <DetailView config={bookingDetailsConfig} />,
                  component: (
                    <DetailView
                      config={viewBookingDetailsConfig(row)}
                      onDataLoad={() => handleViewBooking(row)}
                      dataSelector={(state) =>
                        state.appointment.selectedAppointment
                      }
                      buildConfigFromData={(data) =>
                        viewBookingDetailsConfigFromAPI(data)
                      }
                    />
                  ),
                },
                {
                  label: "Archive Booking",
                  iconUrl: "/icons/archiveClient.svg",
                  type: "popUp",
                  component: (
                    <DetailView
                      config={viewBookingDetailsConfig(row)}
                      onDataLoad={() => handleViewBooking(row)}
                      dataSelector={(state) =>
                        state.appointment.selectedAppointment
                      }
                      buildConfigFromData={(data) =>
                        viewBookingDetailsConfigFromAPI(data)
                      }
                    />
                  ),
                },
                // {
                //   label: "Archive Booking",
                //   iconUrl: "/icons/archiveClient.svg",
                //   type: "popUp",
                //   component: (
                //     <PopupForm
                //       config={archiveBookingConfig}
                //       width="500px"
                //       height="500px"
                //       onApply={(data) => console.log("Archive applied:", data)}
                //       onCancel={() => console.log("Cancelled")}
                //     />
                //   ),
                // },
                {
                  label: "Download Invoice",
                  iconUrl: "/icons/downloadGray.svg",
                  onClick: (data) => console.log("Download Invoice", data),
                },
                {
                  label: "Initiate Refund",
                  iconUrl: "/icons/refund.svg",
                  type: "popUp",
                  style: { color: "#BC0D10" },
                  onClick: (row) => handleInitiateRefundClick(row),
                },
              ];
            }

            //  for row.status non-cancelled the below actions will be displayed.
            //  for row.status non-cancelled the below actions will be displayed.
            return [
              {
                label: "View Booking",
                iconUrl: "/icons/show.svg",
                type: "sidebar",
                component: (
                  <DetailView
                    config={viewBookingDetailsConfig(row)}
                    onDataLoad={() => handleViewBooking(row)}
                    dataSelector={(state) =>
                      state.appointment.selectedAppointment
                    }
                    buildConfigFromData={(data) =>
                      viewBookingDetailsConfigFromAPI(data)
                    }
                  />
                ),
              },
              {
                label: "Edit Booking",
                iconUrl: "/icons/editBooking.svg",
                type: "sidebar",
                component: (
                  <EditBookingSidebar row={row} onApply={handleEditBooking} />
                ),
              },
              {
                label: "Mark As Completed",
                iconUrl: "/icons/markCompleted.svg",
                type: "action",
                onClick: (row) => handleBulkStatusUpdate([row], "completed"),
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
                onClick: (data) => console.log("Download Invoice", data),
              },
              // {
              //   label: "Archive Booking",
              //   iconUrl: "/icons/archiveClient.svg",
              //   type: "popUp",
              //   component: (
              //     <PopupForm
              //       config={archiveBookingConfig}
              //       width="500px"
              //       height="500px"
              //       onApply={(data) => console.log("Archive applied:", data)}
              //       onCancel={() => console.log("Cancelled")}
              //     />
              //   ),
              // },
              {
                label: "Cancel Booking",
                iconUrl: "/icons/cancel.svg",
                type: "button",
                onClick: () => handleBulkStatusUpdate([row], "cancelled"),
              },
            ];
          },
        },
      },
    },
  ];
