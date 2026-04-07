import React from "react";
import { Formik, Form } from "formik";
import { FormCheckboxGroup, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";

const CancelBookingForm = ({ onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{ suspend_reason: [], note: "" }}
      onSubmit={(values) => {
        let finalReason = values.suspend_reason?.[0] || "";
        if (finalReason === "Other" && values.note) {
          finalReason = `Other: ${values.note}`;
        }
        onSubmit({ reason: finalReason });
      }}
    >
      {({ values }) => (
        <Form className="flex flex-col h-full">
          <div className="flex-grow p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-inter text-[#111111]">
                Cancel Booking?
              </h3>
              <p className="text-sm font-inter text-[#7B7B7B] mt-1 space-y-1">
                <span>Are you sure you want to cancel this Booking?</span>
                <br />
                <span>
                  This action will notify the Client and initiate a refund process
                  if applicable. Once cancelled, this order cannot be undone.
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <FormCheckboxGroup
                name="suspend_reason"
                label="Cancellation Reason"
                options={[
                  { label: "Inappropriate behavior", value: "Inappropriate behavior" },
                  { label: "Out of stock", value: "Out of stock" },
                  { label: "Incorrect address", value: "Incorrect address" },
                  { label: "Payment issue", value: "Payment issue" },
                  { label: "Other", value: "Other" },
                ]}
              />

              {values.suspend_reason?.includes("Other") && (
                <FormTextarea
                  name="note"
                  label="Note"
                  placeholder="Add note for 'Other'"
                />
              )}
            </div>
          </div>

          <div className="p-4 border-t border-[#E4E4E6] flex gap-4 w-full bg-white mt-auto">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
            >
              Cancel Booking
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CancelBookingForm;
