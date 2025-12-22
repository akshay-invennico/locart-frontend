"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientBookings } from "@/state/client/clientSlice";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { columns } from "../column";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/registry";
import {
  fetchAppointmentDetails,
  updateAppointmentStatus,
} from "@/state/appointment/appointmentSlice";
import { toast } from "sonner";

const bookingConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Advanced Filters" },
    {
      type: "subheader",
      text: "Refine your search results using custom criteria across modules.",
    },
    { type: "divider" },
    { type: "filterBy", text: "Filter By:" },

    {
      type: "checkboxGroup",
      name: "status",
      label: "Status",
      options: [
        { value: "all", label: "All" },
        { value: "ongoing", label: "Ongoing" },
        { value: "upcoming", label: "Upcoming" },
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    { type: "dateRange", name: "DateRange", label: "Date Range" },
    { type: "numberRange", name: "AmountRange", label: "Amount Range" },

    {
      type: "timeRange",
      name: "timeRange",
      label: "Time Range",
    },

    {
      type: "selectCheckbox",
      name: "stylist",
      label: "Select Stylist",
      options: [
        { value: "AaliyahJohnson", label: "Aaliyah Johnson" },
        { value: "BennyCarter", label: "Benny Carter" },
        { value: "ChloeKim", label: "Chloe Kim" },
        { value: "DavidLee", label: "David Lee" },
        { value: "EvaMartinez", label: "Eva Martinez" },
      ],
    },
    {
      type: "selectCheckbox",
      name: "service",
      label: "Select Service",
      options: [
        { value: "LocDetox", label: "Loc Detox" },
        { value: "LocRetwist", label: "Loc Retwist" },
        { value: "StarterLocs", label: "Starter Locs" },
        { value: "Interlocking", label: "Interlocking" },
        { value: "LocStyling", label: "Loc Styling" },
        { value: "HotOilTreatment", label: "Hot Oil Treatment" },
        { value: "DeepConditioning", label: "Deep Conditioning" },
        { value: "ScalpExfoliation", label: "Scalp Exfoliation" },
        { value: "ProteinTreatment", label: "Protein Treatment" },
        { value: "HotOilMassage", label: "Hot Oil Massage" },
        { value: "KeratinSmoothing", label: "Keratin Smoothing" },
        { value: "BondRepairTherapy", label: "Bond Repair Therapy" },
      ],
    },
  ],
  footer: {
    cancel: {
      label: "Cancel",
      className:
        "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
      onClick: () => console.log("Cancelled"),
    },
    apply: {
      label: "Apply Filters",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log("Applied Filters", data),
    },
  },
};

export default function Page() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { id } = useParams();

  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.client);

  const transformedBookings = (bookings || []).map((booking) => ({
    ...booking,
    stylist: booking.stylist?.name || "N/A",
    service: booking.service?.name || "—",
  }));

  const filteredBookings = transformedBookings.filter((booking) => {
    if (!searchText) return true;
    const lowerSearch = searchText.toLowerCase();
    return (
      booking.stylist.toLowerCase().includes(lowerSearch) ||
      booking.service.toLowerCase().includes(lowerSearch) ||
      booking.booking_id?.toString().includes(lowerSearch)
    );
  });

  useEffect(() => {
    if (id) dispatch(fetchClientBookings(id));
  }, [id, dispatch]);

  const handleViewBooking = async (row) => {
    setSelectedBooking(row);

    const res = await dispatch(fetchAppointmentDetails(row.booking_id));

    if (res?.payload?.data) {
      setSelectedBooking(res.payload.data);
    }

    setOpenSidebar(true);
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
      console.error("Status update failed:", err);
      toast.error("Failed to update status.");
    }
  };

  const getColumns = columns({
    handleViewBooking,
    selectedBooking,
    handleBulkStatusUpdate,
  });

  const options = { select: false, order: false };
  return (
    <div className="w-full">
      {/* Top Controls */}
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
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                // component: <AddServices />,
                component: <DynamicForm config={bookingConfig} />,
              },
            ]}
            icon={<Filter className="w-4 h-4 text-[#02C8DE]" />}
            buttonClassName="inline-flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          />
        </div>
      </div>

      {/* Grid */}
      <GridCommonComponent
        //  loading={loading}
        data={filteredBookings}
        options={options}
        columns={getColumns}
        theme={{
          border: "border-gray-300",
          header: { bg: "bg-gray-100" },
        }}
      />
    </div>
  );
}
