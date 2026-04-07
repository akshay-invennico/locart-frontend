import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";

const RefundSchema = Yup.object().shape({
  confirm_amount: Yup.number()
    .required("Refund amount is required")
    .min(0.01, "Amount must be greater than 0"),
});

const InfoItem = ({ label, value, valueClassName = "" }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className={`text-sm font-medium ${valueClassName}`}>{value || "-"}</p>
  </div>
);

const RefundForm = ({
  bookingData = {},
  paymentData = {},
  onSubmit,
  onCancel,
}) => {
  const suggestedAmount = paymentData.total_amount 
    ? Number(paymentData.total_amount).toFixed(2)
    : "";

  return (
    <Formik
      initialValues={{ confirm_amount: suggestedAmount, remarks: "" }}
      validationSchema={RefundSchema}
      onSubmit={(values) => {
        onSubmit(values); // { confirm_amount, remarks }
      }}
    >
      {() => (
        <Form className="flex flex-col h-full w-full">
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold font-inter text-[#111111]">
                Initiate Refund?
              </h3>
              <p className="text-sm font-inter text-[#7B7B7B] mt-1">
                This booking has been cancelled. Please review the payment details
                below and confirm refund initiation.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h4 className="text-base font-semibold text-gray-800">Booking Summary</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <InfoItem label="Booking ID" value={bookingData.booking_id} valueClassName="text-[#02C8DE]" />
                <InfoItem 
                  label="Date & Time" 
                  value={bookingData.date_time ? new Date(bookingData.date_time).toLocaleString() : "-"} 
                />
                <InfoItem 
                  label="Services" 
                  value={Array.isArray(bookingData.services) 
                    ? bookingData.services.map(s => typeof s === "string" ? s : s.name).join(", ") 
                    : "-"} 
                />
                <InfoItem 
                  label="Booked On" 
                  value={bookingData.booked_on ? new Date(bookingData.booked_on).toLocaleDateString() : "-"} 
                />
                <InfoItem label="Stylist" value={bookingData.stylist?.name || bookingData.stylist} />
                <InfoItem label="Status" value={bookingData.status} valueClassName="text-[#02C8DE]" />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
              <h4 className="text-base font-semibold text-gray-800">Payment Summary</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <InfoItem label="Subtotal" value={`$${paymentData.subtotal || 0}`} />
                <InfoItem label="Tax" value={`$${paymentData.tax || 0}`} />
                <InfoItem label="Final Amount" value={`$${paymentData.total_amount || 0}`} valueClassName="text-black font-bold" />
                <InfoItem label="Paid Via" value={paymentData.paid_via || "-"} />
                <InfoItem label="Loyalty Discount" value={`-$${paymentData.loyalty_discount || 0}`} valueClassName="text-red-500" />
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="text-base font-semibold text-gray-800">Refund Amount</h4>
              <FormInput
                name="confirm_amount"
                type="number"
                label="Confirm Refund Amount"
                placeholder="e.g. 50.00"
              />
              <FormTextarea
                name="remarks"
                label="Remarks (Optional)"
                placeholder="Add any additional notes for this refund..."
              />
            </div>
          </div>

          <div className="p-4 border-t border-[#E4E4E6] flex gap-4 w-full bg-white mt-auto sticky bottom-0">
             <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                Stay Pending
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Refund
              </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RefundForm;
