import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { SlidePanel, ConfirmDialog } from "@/components/feedback";
import Spinner from "@/components/common/Spinner";

import {
  getMyAppointments,
  getMyAppointmentById,
  updateMyAppointment,
  updateMyAppointmentStatus,
} from "@/state/stylist/stylistMeService";
import { useStylistApi } from "../_shared/useStylistApi";

import { getColumns } from "@/pages/appointments/columns";
import AppointmentFilterForm from "@/pages/appointments/forms/AppointmentFilterForm";
import EditAppointmentForm from "@/pages/appointments/forms/EditAppointmentForm";
import BookingDetailsView from "@/pages/appointments/forms/BookingDetailsView";
import FlagBookingForm from "@/pages/appointments/forms/FlagBookingForm";

const GRID_OPTIONS = { select: true, order: false };
const ITEMS_PER_PAGE = 10;

const toFilterParams = (form = {}, page = 1) => {
  const params = { page, limit: ITEMS_PER_PAGE };
  if (Array.isArray(form.status) && form.status.length) params.status = form.status;
  if (form.joinedFrom) params.from = form.joinedFrom;
  if (form.joinedTo) params.to = form.joinedTo;
  if (form.numberRange_from) params.amountFrom = form.numberRange_from;
  if (form.numberRange_to) params.amountTo = form.numberRange_to;
  if (Array.isArray(form.TimeRange) && form.TimeRange[0]) params.TimeRange = form.TimeRange;
  const toIds = (arr) =>
    (arr || [])
      .map((s) => (typeof s === "object" ? s.value || s._id || s.id : s))
      .filter(Boolean);
  const serviceIds = toIds(form.service);
  if (serviceIds.length) params.service = serviceIds;
  return params;
};

const StylistAppointmentsPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterFormValues, setFilterFormValues] = useState({});

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showFlagPopup, setShowFlagPopup] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [mutating, setMutating] = useState(false);

  const authUser = useSelector((state) => state.auth?.user);
  console.log(authUser, "auth user")

  const { data, loading, error, run } = useStylistApi(
    () =>
      getMyAppointments({
        ...toFilterParams(filterFormValues, currentPage),
        search: search || undefined,
      }),
    [currentPage, filterFormValues, search]
  );

  const appointments = data?.appointments || data?.data || data || [];
  const pagination = data?.pagination || {};

  const serviceOptions = useMemo(() => {
    const map = new Map();
    (appointments || []).forEach((a) => {
      (a.services || []).forEach((s) => {
        const id = s._id || s.id;
        if (id && !map.has(id)) map.set(id, { value: id, label: s.name });
      });
    });
    return Array.from(map.values());
  }, [appointments]);

  const refresh = () => run().catch(() => { });

  /* ----------------------------- handlers ------------------------------- */

  const handleApplyFilters = (formData) => {
    setFilterFormValues(formData);
    setCurrentPage(1);
    setShowFilterPanel(false);
  };

  const handleResetFilters = () => {
    setFilterFormValues({});
    setCurrentPage(1);
  };

  const handleViewBooking = async (row) => {
    try {
      const res = await getMyAppointmentById(row.bookingId || row.booking_id);
      setSelectedAppointment(res?.data || res);
      setShowDetailPanel(true);
    } catch {
      toast.error("Failed to fetch booking details");
    }
  };

  const handleBeginEdit = async (row) => {
    setSelectedBooking(row);
    try {
      const res = await getMyAppointmentById(row.bookingId || row.booking_id);
      setSelectedAppointment(res?.data || res);
      setShowEditPanel(true);
    } catch {
      toast.error("Failed to load booking for edit.");
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
        ? appt.services.map((s) => s._id || s.id)
        : appt.service_id
          ? [appt.service_id]
          : [],
      stylist_id: appt.stylist?.id || appt.stylist?._id || appt.stylist_id || "",
      time_slot: appt.time || appt.time_slot || "",
      amount: appt.amount || 0,
      discount: appt.discount || 0,
      booking_status: appt.status ? [appt.status.toLowerCase()] : [],
      payment_status:
        appt.payment?.payment_status?.toLowerCase() ||
        appt.payment_status?.toLowerCase(),
      booking_note: appt.booking_note || "",
    };
  };

  const handleEditSubmit = async (form) => {
    if (!selectedBooking) return;
    const id = selectedBooking.bookingId || selectedBooking.booking_id;
    const payload = {
      service_id:
        Array.isArray(form.service_id) && form.service_id.length > 0
          ? form.service_id[0]
          : form.service_id,
      time: form.time_slot || form.time,
      amount: Number(form.amount) || 0,
      discount: Number(form.discount) || 0,
      status: form.booking_status?.[0] || form.booking_status,
      booking_note: form.booking_note || "",
      payment_status: form.payment_status,
    };
    try {
      setMutating(true);
      await updateMyAppointment(id, payload);
      toast.success("Booking updated successfully!");
      setShowEditPanel(false);
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update booking");
    } finally {
      setMutating(false);
    }
  };

  const handleStatusUpdate = async (rows, status, reason) => {
    try {
      setMutating(true);
      await Promise.all(
        rows.map((r) =>
          updateMyAppointmentStatus(r.bookingId || r.booking_id, status, reason)
        )
      );
      toast.success("Status updated successfully!");
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setMutating(false);
    }
  };

  /* ------------------------------ columns ------------------------------- */

  const columns = getColumns({
    onView: handleViewBooking,
    onEdit: handleBeginEdit,
    onStatusUpdate: handleStatusUpdate,
    onFlag: (row) => {
      setSelectedRows([row]);
      setShowFlagPopup(true);
    },
    onManageAvailability: () => toast.info("Manage availability opens"),
    isLoctitian: true,
  });

  const formattedData = useMemo(
    () =>
      (Array.isArray(appointments) ? appointments : []).map((item) => ({
        bookingId: item.booking_id || item._id,
        booking_number: item.booking_number || item.booking_id || item._id,
        date: item.date,
        time: item.time || item.start_time,
        clientName: item.client
          ? {
            name: item.client.name || "N/A",
            email: item.client.email || "N/A",
            profilePhoto: item.client.profile || "",
          }
          : { name: "N/A", email: "N/A", profilePhoto: "" },
        stylistName: item.stylist
          ? {
            name: item.stylist.name || "N/A",
            email: item.stylist.email || "N/A",
            profilePhoto: item.stylist.profile || "",
          }
          : {
            name: authUser?.name || "N/A",
            email: authUser?.email_address || authUser?.email || "N/A",
            profilePhoto: authUser?.profile || "",
          },
        serviceNames:
          item.services?.map((s) => s.name).join(", ") ||
          item.service?.name ||
          "N/A",
        amount: item.amount,
        discount: item.discount,
        status: item.status,
        paymentStatus: item.payment_status,
      })),
    [appointments]
  );

  const filteredData = useMemo(() => {
    if (!search) return formattedData;
    const term = search.toLowerCase();
    return formattedData.filter(
      (row) =>
        row.booking_number?.toString().toLowerCase().includes(term) ||
        row.clientName?.name?.toLowerCase().includes(term) ||
        row.clientName?.email?.toLowerCase().includes(term) ||
        row.serviceNames?.toLowerCase().includes(term) ||
        row.status?.toLowerCase().includes(term)
    );
  }, [formattedData, search]);

  /* ------------------------------- render ------------------------------- */

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="relative w-full max-w-[400px] min-w-[150px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="h-10 w-full rounded-md border border-gray-300 pl-10"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowFilterPanel(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#02C8DE] bg-white shadow-sm hover:bg-gray-50 sm:w-auto sm:px-3 sm:py-2"
          aria-label="Open filters"
        >
          <Filter className="h-4 w-4 text-[#02C8DE]" />
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <GridCommonComponent
          data={filteredData}
          options={GRID_OPTIONS}
          columns={columns}
          pagination={{
            currentPage: pagination?.page || currentPage,
            totalPages: pagination?.totalPages || 1,
            totalItems: pagination?.total || filteredData.length,
            itemsPerPage: pagination?.limit || ITEMS_PER_PAGE,
            onPageChange: (page) => setCurrentPage(page),
          }}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
          }}
          bulkActionsConfig={[
            {
              label: "Mark As Ongoing",
              iconUrl: "/icons/markCompleted.svg",
              onClick: (rows) => handleStatusUpdate(rows, "ongoing"),
            },
            {
              label: "Mark As Completed",
              iconUrl: "/icons/markCompleted.svg",
              onClick: (rows) => handleStatusUpdate(rows, "completed"),
            },
            {
              label: "Flag Booking",
              iconUrl: "/icons/flag.svg",
              type: "action",
              onClick: (rows) => {
                setSelectedRows(rows);
                setShowFlagPopup(true);
              },
            },
          ]}
        />
      )}

      {(loading || mutating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Spinner />
        </div>
      )}

      {/* Filter Panel */}
      <SlidePanel
        open={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        title=""
        width="sm:max-w-md"
      >
        <AppointmentFilterForm
          initialValues={filterFormValues}
          stylistOptions={[]}
          serviceOptions={serviceOptions}
          isLoctitian
          onSubmit={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </SlidePanel>

      {/* Details Panel */}
      <SlidePanel
        open={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        title=""
        width="sm:max-w-[700px]"
      >
        {selectedAppointment && (
          <BookingDetailsView
            booking={selectedAppointment?.data || selectedAppointment}
            isLoctitian
            paymentStatus={
              selectedAppointment?.data?.payment?.payment_status ||
              selectedAppointment?.payment?.payment_status ||
              "Paid"
            }
          />
        )}
      </SlidePanel>

      {/* Edit Panel */}
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
            stylistOptions={[]}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEditPanel(false)}
          />
        )}
      </SlidePanel>

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
            handleStatusUpdate(selectedRows, "flagged", values.reason);
            setShowFlagPopup(false);
            setSelectedRows([]);
          }}
          onCancel={() => {
            setShowFlagPopup(false);
            setSelectedRows([]);
          }}
        />
      </ConfirmDialog>
    </div>
  );
};

export default StylistAppointmentsPage;
