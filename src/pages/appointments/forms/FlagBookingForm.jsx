import React from "react";
import { Formik, Form } from "formik";
import { FormCheckboxGroup, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";

const FlagBookingForm = ({ onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{ reason: [], note: "" }}
      onSubmit={(values) => {
        let finalReason = values.reason?.[0] || "";
        if (finalReason === "Other" && values.note) {
          finalReason = `Other: ${values.note}`;
        }
        onSubmit({ reason: finalReason });
      }}
    >
      {({ values }) => (
        <Form className="flex flex-col h-full">
          <div className="grow space-y-6">
            <div>
              <h3 className="text-xl font-bold font-inter text-[#111111]">
                Flag This Booking?
              </h3>
              <p className="text-sm font-inter text-[#7B7B7B] mt-1">
                Are you sure you want to flag this booking for further review?
                Flagged bookings will be marked in the system and may require
                follow-up by the support or moderation team.
              </p>
            </div>

            <div className="space-y-4">
              <FormCheckboxGroup
                name="reason"
                label="Please select a reason for flagging this Booking"
                options={[
                  { label: "Suspicious activity", value: "Suspicious activity" },
                  { label: "Payment discrepancy", value: "Payment discrepancy" },
                  { label: "Client complaint", value: "Client complaint" },
                  { label: "No-show without update", value: "No-show without update" },
                  { label: "Stylist issue", value: "Stylist issue" },
                  { label: "Other", value: "Other" },
                ]}
              />

              {values.reason?.includes("Other") && (
                <FormTextarea
                  name="note"
                  label="Note"
                  placeholder="Add note for 'Other'"
                />
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FlagBookingForm;
