import React from "react";
import { Download } from "lucide-react";

const InfoItem = ({ label, value, valueClassName = "" }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className={`text-sm font-medium ${valueClassName}`}>{value || "-"}</p>
  </div>
);

const BookingDetailsView = ({
  booking,
  isLoctitian = false,
  paymentStatus = "Paid",
  onDownloadInvoice,
}) => {
  if (!booking) return <div className="p-4">No booking data available</div>;

  const paymentColor = paymentStatus?.toLowerCase() === "paid" ? "text-[#02C8DE]" : "text-red-500";

  return (
    <div className="space-y-8 flex flex-col pt-3 pb-8 px-2 max-w-[600px] mx-auto">
      <div>
        <h3 className="text-lg font-bold mb-1">Booking Details</h3>
        <p className="text-sm text-gray-500">
          Review booking information with accuracy and ease.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-800">Booking Summary</h4>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <InfoItem label="Booking ID" value={booking.booking_number || booking.bookingId} valueClassName="text-[#02C8DE]" />
          <InfoItem label="Date & Time" value={`${booking.date || "-"} ${booking.time || "-"}`} />
          <InfoItem 
            label="Services" 
            value={Array.isArray(booking.services) ? booking.services.map(s => typeof s ==='string'? s: s.name).join(", ") : booking.serviceNames || "-"} 
          />
          <InfoItem label="Booked On" value={booking.booked_on ? new Date(booking.booked_on).toLocaleDateString() : booking.date || "-"} />
          <InfoItem label="Stylist" value={booking.stylist?.name || booking.stylistName || "-"} />
          <InfoItem label="Status" value={booking.status || "-"} valueClassName="text-[#02C8DE]" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-800">Payment Details</h4>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <InfoItem label="Amount Paid" value={`$${booking.amount || "0.00"}`} valueClassName="text-black" />
          <InfoItem label="Status" value={paymentStatus} valueClassName={paymentColor} />
        </div>
      </div>

      {paymentStatus?.toLowerCase() === "refunded" && (
        <div className="space-y-4">
           <div className="grid grid-cols-1 gap-y-6 gap-x-4">
             <InfoItem label="Refund Reason" value={booking.refund_reason || "Service was cancelled by Client."} valueClassName="text-black" />
           </div>
        </div>
      )}

      {!isLoctitian && (
        <div className="space-y-4 border rounded-md p-4 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
            <h4 className="text-base font-semibold text-gray-800">
              Invoice Details
            </h4>
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate text-xs text-gray-500 font-medium bg-gray-200 px-2 py-1 rounded max-w-[180px]">
                {booking.invoiceId || booking.booking_number || booking.bookingId}
              </span>
              {onDownloadInvoice && (
                <button
                  type="button"
                  onClick={() => onDownloadInvoice(booking)}
                  className="shrink-0 inline-flex items-center gap-1 text-[#02C8DE] border border-[#02C8DE] hover:bg-[#02C8DE]/10 px-2 py-1 rounded-md transition-colors text-xs"
                  title="Download Invoice"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service Charges</span>
              <span className="font-medium text-gray-800">${booking.amount || "0.00"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Taxes</span>
              <span className="font-medium text-gray-800">${booking.taxes || "0.00"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-medium text-gray-800">${Number(booking.amount || 0) + Number(booking.taxes || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Loyalty Points Discount</span>
              <span className="font-medium text-red-500">-${booking.discount || "0.00"}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 mt-2">
              <span className="text-gray-900">Total Payable Amount</span>
              <span className="text-gray-900">${(Number(booking.amount || 0) + Number(booking.taxes || 0) - Number(booking.discount || 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsView;
