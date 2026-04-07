import React from "react";
import { Formik, Form } from "formik";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckboxGroup,
} from "@/components/forms";
import { Button } from "@/components/ui/button";

const EditAppointmentForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  serviceOptions = [],
  stylistOptions = [],
}) => {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form className="flex flex-col h-full">
          <div className="flex-grow p-6 overflow-y-auto w-full space-y-6">
            <div>
              <h3 className="text-xl font-bold font-inter text-[#111111]">
                Edit Booking
              </h3>
              <p className="text-sm font-inter text-[#7B7B7B] mt-1">
                Update booking details to reflect the latest information.
              </p>
              <hr className="my-4 border-[#E4E4E6]" />
            </div>

            <div className="space-y-6">
              <div className="opacity-70 pointer-events-none bg-gray-50 p-2 rounded-md border border-gray-200">
                <FormInput
                  name="booking_id"
                  label="Booking ID"
                  placeholder="#BK1023"
                  readOnly
                />
              </div>

              <div className="opacity-70 pointer-events-none bg-gray-50 p-2 rounded-md border border-gray-200">
                <FormInput
                  name="date"
                  label="Booking Date"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4 opacity-70 pointer-events-none bg-gray-50 p-2 rounded-md border border-gray-200">
                <FormInput
                  name="client_name"
                  label="Client Name"
                  readOnly
                />
                <FormInput
                  name="client_mobile"
                  label="Client Mobile"
                  readOnly
                />
              </div>

              <FormCheckboxGroup
                name="service_id"
                label="Select Service"
                options={serviceOptions}
              />

              <div className="text-sm font-bold">
                Select Stylist
                <FormSelect
                  name="stylist_id"
                  options={stylistOptions}
                />
              </div>

              <FormInput
                type="time"
                name="time_slot"
                label="Time"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  name="amount"
                  label="Amount"
                  type="number"
                />
                <FormInput
                  name="discount"
                  label="Discount"
                  type="number"
                />
              </div>

              <div className="text-sm font-bold">
                Payment Status
                <FormSelect
                  name="payment_status"
                  options={[
                    { value: "unpaid", label: "Unpaid" },
                    { value: "paid", label: "Paid" },
                  ]}
                />
              </div>

              <FormCheckboxGroup
                name="booking_status"
                label="Booking Status"
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "ongoing", label: "No-Show" },
                  { value: "refunded", label: "Refunded" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />

              <FormTextarea
                name="booking_note"
                label="Booking Note"
                label2="Max 200 Words | Optional"
                placeholder="Note"
              />
            </div>
          </div>

          <div className="p-4 border-t border-[#E4E4E6] flex gap-4 w-full bg-white mt-auto sticky bottom-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white border-[#02C8DE] text-[#02C8DE] hover:bg-[#02C8DE] hover:text-[#111111] hover:border-[#02C8DE]"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#02C8DE] text-white hover:bg-[#02C8DE] hover:text-[#111111]"
            >
              Update Booking
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditAppointmentForm;
