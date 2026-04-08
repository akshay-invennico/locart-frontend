import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import ActionComponent from "@/components/grid/actionComponent";

import { SlidePanel, ConfirmDialog } from "@/components/feedback";

import {
  fetchAllAppointments,
  fetchAppointmentDetails,
  fetchRefundSummary,
  updateAppointment,
  addAppointment,
  confirmRefundThunk,
  updateAppointmentStatus,
} from "@/state/appointment/appointmentSlice";
import { getColumns } from "./columns";
import Spinner from "@/components/common/Spinner";
import { fetchStoreServices } from "@/state/store/storeSlice";
import { fetchStylists } from "@/state/stylist/stylistSlice";
import { exportGridCSV, exportGridPDF, generateInvoicePDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";

// Import all newly extracted Forms
import AddAppointmentForm from "./forms/AddAppointmentForm";
import EditAppointmentForm from "./forms/EditAppointmentForm";
import AppointmentFilterForm from "./forms/AppointmentFilterForm";
import BookingDetailsView from "./forms/BookingDetailsView";
import RefundForm from "./forms/RefundForm";
import FlagBookingForm from "./forms/FlagBookingForm";
import CancelBookingForm from "./forms/CancelBookingForm";

const options = {
  select: true,
  order: false,
};

const AppointmentsPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // SlidePanel states
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // Popup Dialog States
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [showFlagPopup, setShowFlagPopup] = useState(false);

  // Selected Booking Data Contexts
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // for bulk actions
  const [refundData, setRefundData] = useState(null);

  const [filterFormValues, setFilterFormValues] = useState({});

  const dispatch = useDispatch();
  const { data, loading, pagination, selectedAppointment } = useSelector(
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
    dispatch(fetchAllAppointments({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

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
        b.client?.id || b.client?.user_id,
        {
          user_id: b.client?.id || b.client?.user_id,
          name: b.client?.name,
          email: b.client?.email,
          phone: b.client?.phone,
          profile: b.client?.profile,
        },
      ])
    ).values()
  ).filter(c => c.user_id);

  const existingClientOptions = existingClients.map((c) => ({
    label: c.name,
    value: c.user_id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    profile: c.profile || "",
  }));

  const handleApplyFilters = (formData) => {
    setFilterFormValues(formData);
    setShowFilterPanel(false);

    const filters = { page: 1, limit: itemsPerPage };

    if (Array.isArray(formData.status) && formData.status.length > 0) {
      filters.status = formData.status;
    }

    if (formData.joinedFrom || formData.joinedTo) {
      filters.joinedDate = [formData.joinedFrom || "", formData.joinedTo || ""];
    }

    if (formData.numberRange_from || formData.numberRange_to) {
      filters.numberRange = [
        formData.numberRange_from || "",
        formData.numberRange_to || "",
      ];
    }

    if (Array.isArray(formData.TimeRange) && formData.TimeRange[0]) {
      filters.TimeRange = formData.TimeRange;
    }

    const toIds = (arr) =>
      (arr || [])
        .map((s) => (typeof s === "object" ? s.value || s._id || s.id : s))
        .filter(Boolean);

    const stylistIds = toIds(formData.stylist);
    if (stylistIds.length) filters.stylist = stylistIds;

    const serviceIds = toIds(formData.service);
    if (serviceIds.length) filters.service = serviceIds;

    setCurrentPage(1);
    dispatch(fetchAllAppointments(filters));
  };

  const handleResetFilters = () => {
    setFilterFormValues({});
    setCurrentPage(1);
    dispatch(fetchAllAppointments({ page: 1, limit: itemsPerPage }));
  };

  // Handlers for rows
  const handleViewBooking = async (row) => {
    try {
      await dispatch(fetchAppointmentDetails(row.bookingId || row.booking_id)).unwrap();
      setShowDetailPanel(true);
    } catch (e) {
      toast.error("Failed to fetch booking details");
    }
  };

  const getEditInitialValues = () => {
    const appt = selectedAppointment?.data || selectedAppointment;
    if (!appt) return {};

    return {
      booking_id: appt.booking_number || "",
      date: appt.date || "",
      client_name: appt.client?.name || "",
      client_mobile: appt.client?.phone || "",
      service_id: Array.isArray(appt.services)
        ? appt.services.map(s => s._id || s.id)
        : appt.service_id ? [appt.service_id] : [],
      stylist_id: appt.stylist?.id || appt.stylist?._id || appt.stylist_id || "",
      time_slot: appt.time || appt.time_slot || "",
      amount: appt.amount || 0,
      discount: appt.discount || 0,
      booking_status: appt.status ? [appt.status.toLowerCase()] : [],
      payment_status: appt.payment?.payment_status ? appt.payment.payment_status.toLowerCase() : appt.payment_status?.toLowerCase(),
      booking_note: appt.booking_note || "",
    }
  };

  const handleBeginEdit = async (row) => {
    setSelectedBooking(row);
    try {
      await dispatch(fetchAppointmentDetails(row.bookingId || row.booking_id)).unwrap();
      setShowEditPanel(true);
    } catch (err) {
      toast.error("Failed to load booking for edit.");
    }
  };

  const handleEditBookingSubmit = async (data) => {
    if (!selectedBooking) return;
    const appointmentId = selectedBooking.bookingId || selectedBooking.booking_id;

    const payload = {
      service_id: Array.isArray(data.service_id) && data.service_id.length > 0 ? data.service_id[0] : data.service_id,
      stylist_id: data.stylist_id,
      time: data.time_slot || data.time,
      amount: Number(data.amount) || 0,
      discount: Number(data.discount) || 0,
      status: data.booking_status?.[0] || data.booking_status,
      booking_note: data.booking_note || "",
      payment_status: data.payment_status,
    };

    try {
      await dispatch(updateAppointment({ appointmentId, payload })).unwrap();
      toast.success("Booking updated successfully!");
      setShowEditPanel(false);
      dispatch(fetchAllAppointments());
    } catch (err) {
      console.error("Edit booking failed:", err);
      toast.error(err?.message || "Failed to update booking!");
    }
  };

  const handleAddBookingSubmit = async (formData) => {
    try {
      let clientPayload = {};

      if (formData.clientType === "new") {
        clientPayload = {
          type: "new",
          name: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
        };
      } else if (formData.clientType === "existing") {
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
      setShowAddPanel(false);
      dispatch(fetchAllAppointments());
    } catch (err) {
      console.error("Add booking failed:", err);
      toast.error(err?.message || "Failed to add booking!");
    }
  };

  const handleInitiateRefundClick = async (row) => {
    const bookingId = row?.bookingId || row?.booking_id;
    if (!bookingId) return console.warn("No bookingId provided for refund");

    try {
      const response = await dispatch(fetchRefundSummary(bookingId)).unwrap();
      setRefundData(response?.data || response);
      setSelectedBooking(row);
      setShowRefundPopup(true);
    } catch (err) {
      console.error("Error fetching refund summary:", err);
      toast.error("Failed to load refund details");
    }
  };

  const handleConfirmRefund = (formData) => {
    const appointmentId = selectedBooking?.bookingId || selectedBooking?.booking_id;
    if (!appointmentId) return;

    dispatch(
      confirmRefundThunk({
        appointmentId,
        confirm_amount: Number(formData.confirm_amount),
        remarks: formData.remarks || "",
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Refund processed successfully");
        setShowRefundPopup(false);
        dispatch(fetchAllAppointments());
      })
      .catch((err) => {
        console.error("Refund confirmation failed", err)
        toast.error("Refund confirmation failed");
      });
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

  const handleDownloadInvoice = (row) => {
    try {
      const invoiceData = {
        invoiceNo: row.booking_number || "000",
        issueDate: row.date || new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        deliveryDate: row.date,
        client: {
          name: row.clientName?.name || "N/A",
          address: "Sarabhai Campus, K10 Grand",
          cityState: "390012 Vadodara Gujarat",
          country: "India",
        },
        items: [
          {
            description: row.serviceNames || "Service",
            quantity: "1 hours",
            price: row.amount || 0,
            discount: row.discount || 0,
            amount: (row.amount || 0) - (row.discount || 0),
          },
        ],
        subtotal: (row.amount || 0) - (row.discount || 0),
        tax: ((row.amount || 0) * 0.08).toFixed(2),
        total: ((row.amount || 0) - (row.discount || 0) + (row.amount || 0) * 0.08).toFixed(2),
      };

      generateInvoicePDF(invoiceData);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    }
  };

  const downloadActions = [
    { header: "Download List" },
    {
      label: "Download PDF",
      icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridPDF({
          rows: data,
          columns: getColumns({}), // minimal for PDF structure
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
          columns: getColumns({}),
          filename: `appointment.csv`,
        });
      },
    },
  ];

  const storedRole = localStorage?.getItem("role");
  const role = (user?.role || storedRole || "").toLowerCase();
  const isLoctitian = role === "loctitian";

  const columns = getColumns({
    onView: handleViewBooking,
    onEdit: handleBeginEdit,
    onRefund: handleInitiateRefundClick,
    onFlag: (row) => {
      setSelectedRows([row]);
      setShowFlagPopup(true);
    },
    onCancel: (row) => {
      setSelectedBooking(row);
      setShowCancelPopup(true);
    },
    onStatusUpdate: handleBulkStatusUpdate,
    onManageAvailability: () => { toast.info("Manage availability opens"); },
    onDownloadInvoice: handleDownloadInvoice,
    isLoctitian,
  });

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
          profilePhoto: item.client.profilePhoto || "",
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
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <ActionComponent
            actions={downloadActions}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

          <button
            onClick={() => setShowFilterPanel(true)}
            className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>

          <button
            onClick={() => setShowAddPanel(true)}
            className="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          >
            <img
              src="/icons/plusbutton.svg"
              alt="Add Appointment"
              width={18}
              height={18}
            />
            <span className="hidden sm:inline">Add Appointments</span>
          </button>
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
          pagination={{
            currentPage: pagination?.page || 1,
            totalPages: pagination?.totalPages || 1,
            totalItems: pagination?.total || 0,
            itemsPerPage: pagination?.limit || 10,
            onPageChange: (page) => setCurrentPage(page),
          }}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
          bulkActionsConfig={(() => {
            const baseActions = [
              {
                label: "Flag Booking",
                iconUrl: "/icons/flag.svg",
                type: "action",
                onClick: (rows) => {
                  setSelectedRows(rows);
                  setShowFlagPopup(true);
                }
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
                        columns: getColumns({}),
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
                        columns: getColumns({}),
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

      {/* Slide Panels */}

      {/* 1. Add Panel */}
      <SlidePanel
        open={showAddPanel}
        onClose={() => setShowAddPanel(false)}
        title=""
        width="sm:max-w-md"
      >
        <AddAppointmentForm
          existingClientOptions={existingClientOptions}
          serviceOptions={serviceOptions}
          stylistOptions={stylistOptions}
          onSubmit={handleAddBookingSubmit}
          onCancel={() => setShowAddPanel(false)}
        />
      </SlidePanel>

      {/* 2. Edit Panel */}
      <SlidePanel
        open={showEditPanel}
        onClose={() => setShowEditPanel(false)}
        title=""
        width="sm:max-w-md"
      >
        {showEditPanel && selectedAppointment && (
          <EditAppointmentForm
            initialValues={getEditInitialValues()}
            serviceOptions={serviceOptions}
            stylistOptions={stylistOptions}
            onSubmit={handleEditBookingSubmit}
            onCancel={() => setShowEditPanel(false)}
          />
        )}
      </SlidePanel>

      {/* 3. Filter Panel */}
      <SlidePanel
        open={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        title=""
        width="sm:max-w-md"
      >
        <AppointmentFilterForm
          initialValues={filterFormValues}
          stylistOptions={stylistOptions}
          serviceOptions={serviceOptions}
          isLoctitian={isLoctitian}
          onSubmit={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </SlidePanel>

      {/* 4. Details Panel */}
      <SlidePanel
        open={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        title=""
        width="sm:max-w-[700px]"
      >
        {selectedAppointment && (
          <BookingDetailsView
            booking={selectedAppointment?.data || selectedAppointment}
            isLoctitian={isLoctitian}
            paymentStatus={selectedAppointment?.data?.payment?.payment_status || "Paid"}
            onDownloadInvoice={handleDownloadInvoice}
          />
        )}
      </SlidePanel>

      {/* Dialogs */}

      {/* Flag Dialog */}
      <ConfirmDialog
        open={showFlagPopup}
        onClose={() => {
          setShowFlagPopup(false);
          setSelectedRows([]);
        }}
        title=""
      >
        <FlagBookingForm
          onSubmit={(values) => {
            handleBulkStatusUpdate(selectedRows, "flagged", values.reason);
            setShowFlagPopup(false);
            setSelectedRows([]);
          }}
          onCancel={() => {
            setShowFlagPopup(false);
            setSelectedRows([]);
          }}
        />
      </ConfirmDialog>

      {/* Cancel Dialog */}
      <ConfirmDialog
        open={showCancelPopup}
        onClose={() => {
          setShowCancelPopup(false);
          setSelectedBooking(null);
        }}
        title=""
      >
        <CancelBookingForm
          onSubmit={(values) => {
            handleBulkStatusUpdate([selectedBooking], "cancelled", values.reason);
            setShowCancelPopup(false);
            if (selectedBooking?.bookingId || selectedBooking?.booking_id) {
              handleInitiateRefundClick(selectedBooking);
            }
          }}
          onCancel={() => {
            setShowCancelPopup(false);
            setSelectedBooking(null);
          }}
        />
      </ConfirmDialog>

      {/* Refund Dialog */}
      <ConfirmDialog
        open={showRefundPopup}
        onClose={() => setShowRefundPopup(false)}
        title=""
      >
        {refundData && (
          <RefundForm
            bookingData={refundData.booking}
            paymentData={refundData.payment}
            onSubmit={handleConfirmRefund}
            onCancel={() => setShowRefundPopup(false)}
          />
        )}
      </ConfirmDialog>

    </div>
  );
};

export default AppointmentsPage;
