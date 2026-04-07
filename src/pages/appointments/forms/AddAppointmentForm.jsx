import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { FormInput, FormSelect, FormTextarea, FormToggle } from "@/components/forms";
import { Button } from "@/components/ui/button";

const AddAppointmentSchema = Yup.object().shape({
  clientType: Yup.string().required("Client type is required"),
  existingClient: Yup.string().when("clientType", {
    is: "existing",
    then: () => Yup.string().required("Please select an existing client"),
    otherwise: () => Yup.string().nullable(),
  }),
  clientName: Yup.string().when("clientType", {
    is: "new",
    then: () => Yup.string().required("Client name is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  clientPhone: Yup.string().when("clientType", {
    is: "new",
    then: () => Yup.string().required("Client phone is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  service_id: Yup.array()
    .min(1, "Please select at least one service")
    .required("Service is required"),
  stylist_id: Yup.string().required("Stylist is required"),
  appointmentDate: Yup.string().required("Date is required"),
  appointmentTime: Yup.string().required("Time is required"),
});

const AddAppointmentForm = ({
  onSubmit,
  onCancel,
  existingClientOptions = [],
  serviceOptions = [],
  stylistOptions = [],
  timeSlotOptions = [],
}) => {
  return (
    <Formik
      initialValues={{
        clientType: "existing",
        existingClient: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        service_id: [],
        stylist_id: "",
        appointmentDate: "",
        appointmentTime: "",
        amount: "",
        discount: "",
        payable: "",
        paymentStatus: "",
        paymentMethod: "",
        bookingstatus: "",
        booking_note: "",
      }}
      validationSchema={AddAppointmentSchema}
      onSubmit={(values) => {
        // Map Formik data back to Page expectation
        const formattedData = {
          ...values,
          user_id: values.existingClient || undefined,
          service_id: Array.isArray(values.service_id)
            ? values.service_id
            : values.service_id
              ? [values.service_id]
              : [],
          stylist_id: values.stylist_id ? [values.stylist_id] : [],
          paymentStatus: values.paymentStatus ? [values.paymentStatus] : [],
          paymentMethod: values.paymentMethod ? [values.paymentMethod] : [],
          bookingstatus: values.bookingstatus ? [values.bookingstatus] : [],
        };
        onSubmit(formattedData);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col h-full font-inter text-[#111111]">
          <div className="grow overflow-y-auto w-full space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#111111]">Add Appointment</h3>
              <p className="text-sm text-[#7B7B7B] mt-1">
                Create a new booking by selecting Client, service, stylist, and time.
              </p>
              <hr className="my-4 border-[#E4E4E6]" />
            </div>

            <div className="space-y-5">
              <FormToggle
                name="clientType"
                label={null}
                options={[
                  { label: "Existing Client", value: "existing" },
                  { label: "New Client", value: "new" },
                ]}
                onChange={() => {
                  setFieldValue("existingClient", "");
                  setFieldValue("clientName", "");
                  setFieldValue("clientEmail", "");
                  setFieldValue("clientPhone", "");
                }}
              />

              {values.clientType === "existing" && (
                <FormSelect
                  name="existingClient"
                  label="Client Name"
                  options={existingClientOptions}
                  placeholder="Search or Select Client"
                  selectClassName="bg-white border-[#E4E4E6]"
                />
              )}

              {values.clientType === "new" && (
                <div className="space-y-4">
                  <FormInput
                    name="clientName"
                    label="Client Name"
                    placeholder="Enter full name"
                    inputClassName="border-[#E4E4E6]"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      name="clientEmail"
                      label="Email"
                      placeholder="Enter email"
                      inputClassName="border-[#E4E4E6]"
                    />
                    <FormInput
                      name="clientPhone"
                      label="Phone Number"
                      placeholder="Enter phone"
                      inputClassName="border-[#E4E4E6]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <FormSelect
                  name="service_id"
                  label="Select Service"
                  options={serviceOptions}
                  placeholder="Select Service"
                  isMulti
                  displayValue={values.service_id.length ? "Select Service" : undefined}
                  selectClassName="bg-white border-[#E4E4E6] text-gray-400"
                />
                {values.service_id?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions
                      .filter((opt) => values.service_id.includes(opt.value))
                      .map((opt) => (
                        <span
                          key={opt.value}
                          className="inline-flex items-center gap-2 rounded-md bg-[#E6F9FC] px-2.5 py-1 text-xs font-medium text-[#02C8DE]"
                        >
                          {opt.label}
                          <button
                            type="button"
                            className="text-[#02C8DE] hover:text-[#028FA1]"
                            onClick={() =>
                              setFieldValue(
                                "service_id",
                                values.service_id.filter((id) => id !== opt.value)
                              )
                            }
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <FormSelect
                name="stylist_id"
                label="Stylist"
                options={stylistOptions}
                placeholder="Select Stylist"
                selectClassName="bg-white border-[#E4E4E6]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  type="date"
                  name="appointmentDate"
                  label="Date"
                  inputClassName="border-[#E4E4E6]"
                />
                {timeSlotOptions.length > 0 ? (
                  <FormSelect
                    name="appointmentTime"
                    label="Time Slot"
                    options={timeSlotOptions}
                    placeholder="Pick Time Slot"
                    selectClassName="bg-white border-[#E4E4E6]"
                  />
                ) : (
                  <FormInput
                    type="time"
                    name="appointmentTime"
                    label="Time Slot"
                    placeholder="Pick Time Slot"
                    inputClassName="border-[#E4E4E6]"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput
                  name="amount"
                  label="Amount"
                  placeholder="$99"
                  inputClassName="border-[#E4E4E6]"
                />
                <FormInput
                  name="discount"
                  label="Discount"
                  placeholder="2%"
                  inputClassName="border-[#E4E4E6]"
                />
                <FormInput
                  name="payable"
                  label="Payable Amount"
                  label2="(Optional)"
                  placeholder="$97"
                  inputClassName="border-[#E4E4E6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  name="paymentStatus"
                  label="Payment Status"
                  placeholder="Select Status"
                  options={[
                    { value: "Unpaid", label: "Unpaid" },
                    { value: "Paid", label: "Paid" },
                  ]}
                  selectClassName="bg-white border-[#E4E4E6]"
                />
                <FormSelect
                  name="paymentMethod"
                  label="Payment Method"
                  placeholder="Select Method"
                  options={[
                    { value: "Cash", label: "Cash" },
                    { value: "DebitCard", label: "Debit Card" },
                    { value: "CreditCard", label: "Credit Card" },
                  ]}
                  selectClassName="bg-white border-[#E4E4E6]"
                />
              </div>

              <FormSelect
                name="bookingstatus"
                label="Booking Status"
                placeholder="Select Status"
                options={[
                  { value: "Upcoming", label: "Upcoming" },
                  { value: "Ongoing", label: "No-Show" },
                  { value: "Refunded", label: "Refunded" },
                  { value: "Completed", label: "Completed" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
                selectClassName="bg-white border-[#E4E4E6]"
              />

              <FormTextarea
                name="booking_note"
                label="Booking Note"
                label2="Max 250 Word | Optional"
                placeholder="Note"
                textareaClassName="border-[#E4E4E6] bg-white"
              />
            </div>
          </div>

          <div className="p-4 border-t border-[#E4E4E6] flex gap-4 w-full bg-white mt-auto sticky bottom-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 bg-white border-[#02C8DE] text-[#02C8DE] hover:bg-[#02C8DE] hover:text-[#111111] hover:border-[#02C8DE]"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-[#02C8DE] text-white hover:bg-[#02C8DE] hover:text-[#111111]"
            >
              Confirm Booking
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddAppointmentForm;
