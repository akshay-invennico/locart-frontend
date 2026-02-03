"use client";

import DynamicForm from "@/components/modules/DynamicFormRendering";
import PopupForm from "@/components/ui/popupform";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editBookingConfig,
  flagBookingConfig,
  getBookingDetailsConfig,
  stylistManageAvailability,
} from "./config";
import {
  viewBookingDetailsConfig,
  viewBookingDetailsConfigFromAPI,
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

  useEffect(() => {
    if (row?.bookingId) dispatch(fetchAppointmentDetails(row.bookingId));
    dispatch(fetchStylists());
  }, [dispatch, row?.bookingId]);

  useEffect(() => {
    const appt = selectedAppointment?.data || selectedAppointment;

    if (!services?.length || !stylists?.length) return;
    if (!appt || (appt.booking_id !== row.bookingId && appt.booking_id !== row.booking_id)) {
      return;
    }

    const getServiceIds = () => {
      if (Array.isArray(appt.services) && appt.services.length > 0) {
        return appt.services.map(s => s._id || s.id);
      }
      if (appt.service_id) return [appt.service_id];
      return [];
    };

    const getStylistId = () => {
      if (appt.stylist?.id || appt.stylist?._id) return appt.stylist.id || appt.stylist._id;
      if (appt.stylist_id) return appt.stylist_id;
      return "";
    };

    const mapped = {
      booking_id: appt.booking_number || "",
      date: appt.date || "",
      client_name: appt.client?.name || "",
      client_mobile: appt.client?.phone || "",

      service_id: getServiceIds(),
      stylist_id: getStylistId(),

      time_slot: appt.time || appt.time_slot || row?.time || "",
      amount: appt.amount || row?.amount || 0,
      discount: appt.discount || row?.discount || 0,

      booking_status: appt.status
        ? appt.status.toLowerCase()
        : row?.status
          ? row.status.toLowerCase()
          : "",

      booking_note: appt.booking_note || "",

      payment_status: appt.payment?.payment_status
        ? appt.payment.payment_status.toLowerCase()
        : appt.payment_status
          ? appt.payment_status.toLowerCase()
          : row?.paymentStatus
            ? row.paymentStatus.toLowerCase()
            : "",
    };

    setInitialValues(mapped);
    setLoading(false);
  }, [selectedAppointment, services, stylists, row]);

  if (loading) return <Spinner />;

  const updateFieldOptions = (field) => {
    if (field.type === "inputGroup" && field.fields) {
      return {
        ...field,
        fields: field.fields.map(updateFieldOptions),
      };
    }

    if (field.name === "stylist_id") {
      return {
        ...field,
        options: stylists.map((s) => ({
          value: s._id,
          label: s.fullName || s.name,
        })),
      };
    }

    if (field.name === "service_id") {
      return {
        ...field,
        options: services.map((s) => ({ value: s._id, label: s.name })),
      };
    }

    return field;
  };

  const updatedConfig = {
    ...editBookingConfig,
    initialValues: initialValues,
    fields: editBookingConfig.fields.map(updateFieldOptions),
    footer: {
      ...editBookingConfig.footer,
      apply: {
        ...editBookingConfig.footer.apply,
        onClick: (data) => onApply(row, data),
      },
    },
  };

  return <DynamicForm config={updatedConfig} isEdit initialValues={initialValues} recordKey={row.bookingId
  } />;
};

export default EditBookingSidebar;

export const getColumns = (
  handleViewBooking,
  handleEditBooking,
  handleInitiateRefundClick,
  handleBulkStatusUpdate,
  isLoctitan = false,
  paymentStatus = "Paid",
  handleDownloadInvoice
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
          format: "time"
        },
        style: {
          text: "text-gray-900"
        }
      }
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
                  onClick: (row) => {
                    if (handleDownloadInvoice) handleDownloadInvoice(row);
                  },
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
                onClick: (row) => {
                  if (handleDownloadInvoice) handleDownloadInvoice(row);
                },
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
