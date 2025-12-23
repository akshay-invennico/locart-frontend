"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import {
  AddAppointmentConfig,
  AppointmentFilterConfig,
  archiveBookingConfigAll,
  flagBookingConfigAll,
  getAppointmentFilterConfig,
  refundDetailsConfig,
  cancelBookingConfig,
} from "./config";
import PopupForm from "@/components/ui/popupform";
import Image from "next/image";
import {
  fetchAllAppointments,
  fetchAppointmentDetails,
  fetchRefundSummary,
  updateAppointment,
  addAppointment,
  confirmRefundThunk,
  updateAppointmentStatus,
} from "@/state/appointment/appointmentSlice";
import { getColumns } from "./column";
import Spinner from "@/components/common/Spinner";
import ViewUser from "../users/viewUser";
import { fetchStoreServices } from "@/state/store/storeSlice";
import { fetchStylists } from "@/state/stylist/stylistSlice";
import { exportGridCSV, exportGridPDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";

const options = {
  select: true,
  order: false,
};

const AppointmentPage = () => {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refundData, setRefundData] = useState(null);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { data, selectedAppointment, loading, error } = useSelector(
    (state) => state.appointment
  );
  const { services } = useSelector((state) => state.salon);
  const { stylists } = useSelector((state) => state.stylists);
  const user = useSelector((state) => state.auth?.user);


  useEffect(() => {
    dispatch(fetchStoreServices());
    dispatch(fetchStylists());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  const serviceOptions =
    services?.map((s) => ({
      value: s._id,
      label: s.name,
    })) || [];

  const stylistOptions =
    stylists?.map((s) => ({
      value: s._id,
      label: s.fullName || s.name,
    })) || [];

  const existingClients = Array.from(
    new Map(
      (data || []).map((b) => [
        b.client?.id,
        {
          user_id: b.client?.id,
          name: b.client?.name,
          email: b.client?.email,
          phone: b.client?.phone,
          profile: b.client?.profile_picture,
        },
      ])
    ).values()
  );

  const existingClientOptions = existingClients.map((c) => ({
    label: c.name,
    value: c.user_id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    profile: c.profile || "",
  }));

  const updatedConfig = {
    ...AddAppointmentConfig,
    fields: AddAppointmentConfig.fields.map((field) => {
      if (
        field.type === "conditional" &&
        field.name === "existingClientSection"
      ) {
        return {
          ...field,
          fields: field.fields.map((sub) => {
            if (sub.key === "existingClient") {
              return {
                ...sub,
                options: existingClientOptions,
              };
            }
            return sub;
          }),
        };
      }

      if (field.name === "service_id") {
        return { ...field, options: serviceOptions };
      }
      if (field.name === "stylist_id") {
        return { ...field, options: stylistOptions };
      }
      return field;
    }),
  };

  const handleApplyFilters = (formData) => {
    const filters = {};

    // Status
    const statusKeys = Object.keys(formData).filter(
      (key) => key.startsWith("status_") && formData[key]
    );
    if (statusKeys.length) {
      filters.status = statusKeys.map((k) => k.replace("status_", ""));
    }

    // Amount
    if (formData.numberRange_from || formData.numberRange_to) {
      filters.min_amount = formData.numberRange_from || "";
      filters.max_amount = formData.numberRange_to || "";
    }

    // Date
    if (formData.joinedDate) {
      filters.start_date = formData.joinedDate[0];
      filters.end_date = formData.joinedDate[1];
    }

    // Time
    if (formData.TimeRange) {
      filters.start_time = formData.TimeRange[0];
      filters.end_time = formData.TimeRange[1];
    }

    // Stylist
    if (formData.stylist) {
      filters.stylist_ids = formData.stylist.map((s) => s.value).join(",");
    }

    // Service
    if (formData.service) {
      filters.service_ids = formData.service.map((s) => s.value).join(",");
    }

    dispatch(fetchAllAppointments(filters));
  };

  const handleViewBooking = (row) => {
    dispatch(fetchAppointmentDetails(row.bookingId));
  };

  const handleCancelBooking = (row) => {
    setSelectedBooking(row);
    setShowCancelPopup(true);
  };

  const handleEditBooking = async (row, data) => {
    const appointmentId = row.bookingId;

    const payload = {
      service_id: data.service_id?.[0],
      stylist_id: data.stylist_id?.[0],
      date: data.date,
      time: data.time_slot,
      amount: Number(data.amount) || 0,
      discount: Number(data.discount) || 0,
      status: data.booking_status?.[0],
      booking_note: data.booking_note || "",
      payment_status: data.payment_status?.[0],
    };

    try {
      await dispatch(updateAppointment({ appointmentId, payload })).unwrap();
      toast.success("Booking updated successfully!");
      dispatch(fetchAllAppointments());
    } catch (err) {
      console.error("Edit booking failed:", err);
      toast.error(err?.message || "Failed to update booking!");
    }
  };

  const handleAddBooking = async (formData) => {
    try {
      let clientPayload = {};

      // NEW CLIENT
      if (formData.clientType === "new") {
        clientPayload = {
          type: "new",
          name: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
        };
      }

      // EXISTING CLIENT
      if (formData.clientType === "existing") {
        clientPayload = {
          type: "existing",
          user_id: formData.user_id,
        };
      }

      const payload = {
        client: clientPayload,
        service_id: formData.service_id?.[0],
        stylist_id: formData.stylist_id?.[0],
        date: formData.appointmentDate,
        time_slot: formData.appointmentTime,

        amount: Number(formData.amount) || 0,
        discount: Number(formData.discount) || 0,
        payable_amount: Number(formData.payable) || 0,

        payment_status: formData.paymentStatus?.[0],
        payment_method:
          formData.paymentMethod?.[0] === "DebitCard" ||
            formData.paymentMethod?.[0] === "CreditCard"
            ? "Card"
            : formData.paymentMethod?.[0],

        booking_status: formData.bookingstatus?.[0],

        booking_note: formData.booking_note || "",
      };

      await dispatch(addAppointment(payload)).unwrap();
      toast.success("Booking added successfully!");
      dispatch(fetchAllAppointments());
    } catch (err) {
      console.error("Add booking failed:", err);
      toast.error("Failed to add booking!" || err?.message);
    }
  };

  const handleInitiateRefundClick = async (row) => {
    if (!row?.bookingId)
      return console.warn("No bookingId provided for refund");
    try {
      const response = await dispatch(
        fetchRefundSummary(row.bookingId)
      ).unwrap();
      setRefundData(response);
      setShowRefundPopup(true);
      setSelectedBooking(row);
    } catch (err) {
      console.error("Error fetching refund summary:", err);
    }
  };

  const handleConfirmRefund = (formData) => {
    if (!selectedBooking?.bookingId) {
      console.warn("No bookingId for refund confirm");
      return;
    }

    const payload = {
      confirm_amount: Number(formData.confirm_refund_amount),
      remarks: formData.remarks || "",
    };

    dispatch(
      confirmRefundThunk({
        appointmentId: selectedBooking.bookingId,
        confirm_amount: Number(formData.confirm_amount),
        remarks: formData.remarks || "",
      })
    )
      .unwrap()
      .then(() => {
        setShowRefundPopup(false);
        dispatch(fetchAllAppointments());
      })
      .catch((err) => console.error("Refund confirmation failed", err));
  };

  const handleBulkStatusUpdate = async (rows, status, reason = null) => {
    try {
      const bookingIds = rows.map((r) => r.booking_id || r.bookingId);

      const payload = { bookingIds, status };
      if (reason) payload.reason = reason;

      await dispatch(updateAppointmentStatus(payload)).unwrap();

      toast.success("Status updated successfully!");
      dispatch(fetchAllAppointments());
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error(err?.message || "Failed to update status!");
    }
  };

  const downloadActions = [
    {
      header: "Download List",
    },
    {
      label: "Download PDF",
      icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridPDF({
          rows: data,
          columns: getColumns(),
          filename: `appointment.pdf`,
          title: "Appointment Details",
        });
      },
    },
    {
      label: "Download CSV",
      icon: <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridCSV({
          rows: data,
          columns: getColumns(),
          filename: `appointment.csv`,
        });
      },
    },
  ];

  const columns = getColumns(
    handleViewBooking,
    handleEditBooking,
    handleInitiateRefundClick,
    handleBulkStatusUpdate
  );

  const formattedData = Array.isArray(data)
    ? data.map((item) => ({
      bookingId: item.booking_id,
      booking_number: item.booking_number,
      date: item.date,
      time: item.time,
      clientName: item.client
        ? {
          name: item.client.name || "N/A",
          email: item.client.email || "N/A",
          profile: item.client.profile_picture || item.client.avatar || "",
        }
        : { name: "N/A", email: "N/A", profile: "" },
      stylistName: item.stylist?.name || "N/A",
      stylistEmail: item.stylist?.email || "N/A",
      stylistPhone: item.stylist?.phone || "N/A",
      serviceNames: item.services?.map((s) => s.name).join(", ") || "N/A",
      amount: item.amount,
      discount: item.discount,
      status: item.status,
      paymentStatus: item.payment_status,
      bookingMode: item.booking_mode,
      saloonName: item.saloon?.name || "N/A",
    }))
    : [];

  const filteredData = formattedData.filter((row) => {
    if (!search) return true;
    const term = search.toLowerCase();

    return (
      row.bookingId?.toString().toLowerCase().includes(term) ||
      row.clientName?.name?.toLowerCase().includes(term) ||
      row.clientName?.email?.toLowerCase().includes(term) ||
      row.stylistName?.toLowerCase().includes(term) ||
      row.serviceNames?.toLowerCase().includes(term) ||
      row.status?.toLowerCase().includes(term) ||
      row.paymentStatus?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Buttons container */}
        <div className="flex items-center gap-2">
          {/* Download */}
          <ActionComponent
            actions={downloadActions}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

          {/* Filter */}
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={AppointmentFilterConfig}
                    onApply={handleApplyFilters}
                  />
                ),
              },
            ]}
            icon={<Filter className="w-4 h-4 text-[#02C8DE]" />}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          />

          {/* Add Appointment */}
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    key={existingClientOptions.length}
                    config={{
                      ...updatedConfig,
                      footer: {
                        ...updatedConfig.footer,
                        apply: {
                          ...updatedConfig.footer.apply,
                          onClick: handleAddBooking,
                        },
                      },
                    }}
                  />
                ),
              },
            ]}
            icon={
              <Image
                src="/icons/plusbutton.svg"
                alt="Add Appointment"
                width={18}
                height={18}
              />
            }
            text={<span className="hidden sm:inline">Add Appointments</span>}
            buttonClassName="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          />
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={filteredData || []}
          options={options}
          columns={columns?.map((col) => {
            if (col.key === "actions") {
              return {
                ...col,
                component: {
                  ...col.component,
                  options: {
                    ...col.component.options,
                    actions: (row) => col.component.options.actions(row),
                  },
                },
              };
            }
            return col;
          })}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
          bulkActionsConfig={(() => {
            const storedRole =
              typeof window !== "undefined" ? localStorage?.getItem("role") : null;
            const role = (user?.role || storedRole || "").toLowerCase();
            const isLoctitian = role === "loctitian";

            const baseActions = [
              {
                label: "Flag Booking",
                iconUrl: "/icons/flag.svg",
                type: "popUp",
                component: (
                  <PopupForm
                    config={flagBookingConfigAll}
                    width="500px"
                    onApply={(formData, rows) =>
                      handleBulkStatusUpdate(rows, "flagged", formData.reason)
                    }
                    onCancel={() => console.log("Flag cancelled")}
                  />
                ),
              },
              {
                label: "Export Selection",
                iconUrl: "/icons/download.svg",
                children: [
                  { header: "Download List" },
                  {
                    label: "Download PDF",
                    icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
                    onClick: (selectedRows) => {
                      exportGridPDF({
                        rows: selectedRows,
                        columns: getColumns(),
                        filename: "appointments.pdf",
                        title: "Appointments Report",
                      });
                    },
                  },
                  {
                    label: "Download CSV",
                    icon: <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />,
                    onClick: (selectedRows) => {
                      exportGridCSV({
                        rows: selectedRows,
                        columns: getColumns(),
                        filename: "appointments.csv",
                      });
                    },
                  },
                ],
              },
            ];

            const statusActions = isLoctitian
              ? [
                {
                  label: "Mark As Ongoing",
                  iconUrl: "/icons/markCompleted.svg",
                  onClick: (rows) => handleBulkStatusUpdate(rows, "ongoing"),
                },
                {
                  label: "Mark As Completed",
                  iconUrl: "/icons/markCompleted.svg",
                  onClick: (rows) => handleBulkStatusUpdate(rows, "completed"),
                },
              ]
              : [
                {
                  label: "Mark As Pending",
                  iconUrl: "/icons/markCompleted.svg",
                  onClick: (rows) => handleBulkStatusUpdate(rows, "pending"),
                },
                {
                  label: "Mark As Ongoing",
                  iconUrl: "/icons/markCompleted.svg",
                  onClick: (rows) => handleBulkStatusUpdate(rows, "ongoing"),
                },
                {
                  label: "Mark As Completed",
                  iconUrl: "/icons/markCompleted.svg",
                  onClick: (rows) => handleBulkStatusUpdate(rows, "completed"),
                },
              ];

            return [...statusActions, ...baseActions];
          })()}
        />
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Spinner />
        </div>
      )}

      {showCancelPopup && selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 shadow-md rounded-md"
          onClick={() => setShowCancelPopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PopupForm
              config={{
                ...cancelBookingConfig,
                data: selectedBooking,
              }}
              width="600px"
              onApply={(data) => {
                console.log("Booking cancelled", data);

                setShowCancelPopup(false);

                if (selectedBooking?.bookingId) {
                  dispatch(fetchRefundSummary(selectedBooking.bookingId))
                    .unwrap()
                    .then((response) => {
                      setRefundSummaryData(response?.data || response);
                      setShowRefundPopup(true);
                    })
                    .catch((err) => {
                      console.error("Error fetching refund summary:", err);
                    });
                } else {
                  console.warn("No bookingId found for selected booking");
                }
              }}
              onCancel={() => setShowCancelPopup(false)}
            />
          </div>
        </div>
      )}

      {showRefundPopup && refundData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowRefundPopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PopupForm
              config={refundDetailsConfig(refundData)}
              width="600px"
              data={selectedBooking}
              onApply={(data) => {
                handleConfirmRefund(data);
              }}
              onCancel={() => setShowRefundPopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
