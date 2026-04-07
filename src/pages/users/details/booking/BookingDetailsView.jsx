import { useSelector } from "react-redux";
import Spinner from "@/components/common/Spinner";

const InfoItem = ({ label, value, valueStyle }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm font-medium" style={valueStyle}>{value || "N/A"}</p>
  </div>
);

const BookingDetailsView = () => {
  const { selectedAppointment, loading } = useSelector(
    (state) => state.appointment
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner />
      </div>
    );

  if (!selectedAppointment)
    return (
      <p className="flex justify-center items-center h-[60vh]">
        No booking details found
      </p>
    );

  const {
    date = "",
    time = "",
    booked_on = "",
    status = "",
    stylist = {},
    services = [],
    payment = {},
    invoice = {},
    booking_number = "",
    invoice_id = "",
  } = selectedAppointment;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1">Booking Details</h3>
        <p className="text-sm text-gray-500">
          Review booking information with accuracy and ease.
        </p>
      </div>

      {/* Booking Summary */}
      <div>
        <h4 className="font-semibold mb-3">Booking Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Booking ID" value={booking_number} valueStyle={{ color: "#02C8DE" }} />
          <InfoItem label="Date & Time" value={date && time ? `${date} ${time}` : undefined} />
          <InfoItem
            label="Services"
            value={services?.length ? services.map((s) => s.name).join(", ") : undefined}
          />
          <InfoItem label="Booked On" value={booked_on} />
          <InfoItem label="Stylist" value={stylist?.name} />
          <InfoItem label="Status" value={status} valueStyle={{ color: "#02C8DE" }} />
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <h4 className="font-semibold mb-3">Payment Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Amount Paid"
            value={payment?.amount_paid ? `$${payment.amount_paid}` : "$0.00"}
          />
          <InfoItem
            label="Status"
            value={payment?.payment_status}
            valueStyle={{ color: "#02C8DE" }}
          />
        </div>
      </div>

      {/* Invoice Details */}
      <div>
        <h4 className="font-semibold mb-3">Invoice Details</h4>
        <p className="text-xs text-gray-500 mb-2">
          Invoice ID: {invoice_id ? `#${invoice_id}` : "N/A"}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Service Charges</span>
            <span>${invoice?.service_charges || "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Taxes</span>
            <span>${invoice?.taxes || "0.00"}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${invoice?.total_payable || "0.00"}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>Loyalty Points Discount</span>
            <span>- ${invoice?.loyalty_discount || "0.00"}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <span>Total Payable Amount</span>
            <span>${invoice?.payable_amount || "0.00"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;
