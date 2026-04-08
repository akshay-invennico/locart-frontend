import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientBookings } from "@/state/client/clientSlice";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { columns } from "./columns";
import { SlidePanel } from "@/components/feedback";
import BookingFilterForm from "./forms/BookingFilterForm";
import {
  fetchAppointmentDetails,
  updateAppointmentStatus,
  updateAppointment,
} from "@/state/appointment/appointmentSlice";
import { toast } from "sonner";
import { generateInvoicePDF } from "@/lib/HelpFulFunction";

export default function UserBookingPage() {
  const [searchText, setSearchText] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.client);

  const transformedBookings = (bookings || []).map((booking) => ({
    ...booking,
    stylist: booking.stylist?.name || "N/A",
    service: booking.service?.name || "—",
  }));

  const filteredBookings = transformedBookings.filter((booking) => {
    // Search
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      const matchesSearch =
        booking.stylist.toLowerCase().includes(lowerSearch) ||
        booking.service.toLowerCase().includes(lowerSearch) ||
        booking.booking_id?.toString().includes(lowerSearch);
      if (!matchesSearch) return false;
    }

    // Status
    const statuses = (filterValues?.status || []).filter(
      (s) => s && s !== "all"
    );
    if (statuses.length > 0) {
      const bookingStatus = (booking.status || "").toLowerCase();
      if (!statuses.map((s) => s.toLowerCase()).includes(bookingStatus)) {
        return false;
      }
    }

    // Date range
    const bookingDate = booking.date ? new Date(booking.date) : null;
    if (filterValues?.dateFrom) {
      const from = new Date(filterValues.dateFrom);
      if (!bookingDate || bookingDate < from) return false;
    }
    if (filterValues?.dateTo) {
      const to = new Date(filterValues.dateTo);
      if (!bookingDate || bookingDate > to) return false;
    }

    // Amount range
    const amount = Number(
      booking.amount_paid ?? booking.amount ?? 0
    );
    if (filterValues?.minAmount !== "" && filterValues?.minAmount != null) {
      if (amount < Number(filterValues.minAmount)) return false;
    }
    if (filterValues?.maxAmount !== "" && filterValues?.maxAmount != null) {
      if (amount > Number(filterValues.maxAmount)) return false;
    }

    return true;
  });

  useEffect(() => {
    if (id) dispatch(fetchClientBookings(id));
  }, [id, dispatch]);

  const handleViewBooking = async (row) => {
    await dispatch(fetchAppointmentDetails(row.booking_id));
  };

  const handleEditBooking = async (formData, row) => {
    try {
      const payload = {};
      if (formData.date) payload.date = formData.date;
      if (formData.time) payload.time = formData.time;
      if (formData.stylist_id) payload.stylist_id = formData.stylist_id;
      if (formData.status) payload.status = formData.status;

      await dispatch(
        updateAppointment({ appointmentId: row.booking_id, payload })
      ).unwrap();

      dispatch(fetchClientBookings(id));
      toast.success("Booking updated successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to update booking.");
    }
  };

  const handleDownloadInvoice = async (row) => {
    try {
      const res = await dispatch(fetchAppointmentDetails(row.booking_id));
      const bookingData = res?.payload?.data || res?.payload;

      if (!bookingData) {
        toast.error("Could not fetch booking details.");
        return;
      }

      const services = bookingData.services || [];
      const amount = bookingData.amount_paid || bookingData.amount || 0;
      const discount = bookingData.discount || 0;
      const subtotal =
        bookingData.invoice?.service_charges ?? amount - discount;
      const tax = bookingData.invoice?.taxes ?? amount * 0.08;
      const total =
        bookingData.invoice?.total_payable ?? subtotal + tax;

      const invoiceData = {
        invoiceNo:
          bookingData.booking_number || bookingData.invoice_id || bookingData.booking_id || "000",
        issueDate:
          bookingData.booked_on || bookingData.date || new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        deliveryDate: bookingData.date,
        client: {
          name: bookingData.client?.name || "N/A",
          address: bookingData.client?.address || "Sarabhai Campus, K10 Grand",
          cityState: bookingData.client?.city || "390012 Vadodara Gujarat",
          country: bookingData.client?.country || "India",
        },
        items:
          services.length > 0
            ? services.map((service) => ({
              description: service.name || "Service",
              quantity: "1 hours",
              price: service.price || 0,
              discount: 0,
              amount: service.price || 0,
            }))
            : [
              {
                description: bookingData.service?.name || "Service",
                quantity: "1 hours",
                price: amount,
                discount: discount,
                amount: amount - discount,
              },
            ],
        subtotal: Number(subtotal).toFixed(2),
        tax: Number(tax).toFixed(2),
        total: Number(total).toFixed(2),
      };

      generateInvoicePDF(invoiceData);
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download invoice.");
    }
  };

  const handleBulkStatusUpdate = async (rows, status, reason = null) => {
    const bookingIds = rows.map((r) => r.booking_id || r.bookingId);
    const payload = { bookingIds, status };
    if (reason) payload.reason = reason;

    try {
      await dispatch(updateAppointmentStatus(payload)).unwrap();
      dispatch(fetchClientBookings(id));
      toast.success("Status updated successfully!");
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const applyFilters = (values) => {
    setFilterValues(values);
    setFilterOpen(false);
  };

  const getColumns = columns({
    handleViewBooking,
    handleBulkStatusUpdate,
    handleEditBooking,
    handleDownloadInvoice,
  });

  const gridOptions = { select: false, order: false };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative mb-2 w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search here..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>
        </div>
      </div>

      <GridCommonComponent
        data={filteredBookings}
        options={gridOptions}
        columns={getColumns}
        theme={{
          border: "border-gray-300",
          header: { bg: "bg-gray-100" },
        }}
      />

      <SlidePanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        width="sm:max-w-md"
      >
        <BookingFilterForm
          initialValues={filterValues}
          onSubmit={applyFilters}
          onReset={() => {
            setFilterValues({});
            setFilterOpen(false);
          }}
        />
      </SlidePanel>
    </div>
  );
}
