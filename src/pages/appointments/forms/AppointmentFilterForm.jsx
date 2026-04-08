import React from "react";
import { Formik, Form } from "formik";
import {
  FormCheckboxGroup,
  FormDateRangePicker,
  FormInput,
  FormSelect,
} from "@/components/forms";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "ongoing", label: "Ongoing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const AppointmentFilterForm = ({
  initialValues = {},
  onSubmit,
  onReset,
  stylistOptions = [],
  serviceOptions = [],
  isLoctitian = false,
}) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        status: initialValues.status || [],
        joinedFrom: initialValues.joinedFrom || "",
        joinedTo: initialValues.joinedTo || "",
        numberRange_from: initialValues.numberRange_from || "",
        numberRange_to: initialValues.numberRange_to || "",
        TimeRange: initialValues.TimeRange || [null, null],
        stylist: initialValues.stylist || [],
        service: initialValues.service || [],
      }}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, resetForm }) => (
        <Form className="flex flex-col h-full">
          <div className="grow overflow-y-auto w-full space-y-6">
            <div>
              <h3 className="text-xl font-bold font-inter text-[#111111]">
                Advanced Filters
              </h3>
              <p className="text-sm font-inter text-[#7B7B7B] mt-1">
                Refine your search results using custom criteria.
              </p>
              <hr className="my-4 border-[#E4E4E6]" />
            </div>

            <div className="space-y-6">
              <FormCheckboxGroup
                name="status"
                label="Status"
                options={statusOptions}
                singleSelect
              />

              <FormDateRangePicker nameFrom="joinedFrom" nameTo="joinedTo" label="Join Date Option" />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Amount Range
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <FormInput
                      name="numberRange_from"
                      placeholder="Min"
                      type="number"
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      name="numberRange_to"
                      placeholder="Max"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              {/* Assuming time range can just be implemented as two text inputs or native time inputs */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Time Range
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <FormInput
                      name="TimeRange[0]"
                      type="time"
                      placeholder="Start Time"
                      value={values.TimeRange?.[0] || ""}
                      onChange={(e) => {
                        const newTimeRange = [...(values.TimeRange || [null, null])];
                        newTimeRange[0] = e.target.value;
                        setFieldValue("TimeRange", newTimeRange);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      name="TimeRange[1]"
                      type="time"
                      placeholder="End Time"
                      value={values.TimeRange?.[1] || ""}
                      onChange={(e) => {
                        const newTimeRange = [...(values.TimeRange || [null, null])];
                        newTimeRange[1] = e.target.value;
                        setFieldValue("TimeRange", newTimeRange);
                      }}
                    />
                  </div>
                </div>
              </div>

              {!isLoctitian && (
                <div className="mb-4 text-sm font-bold">
                  Select Stylist
                  <FormSelect
                    name="stylist"
                    placeholder="Select Stylist"
                    isMulti
                    options={stylistOptions}
                  />
                </div>
              )}

              <div className="mb-4 text-sm font-bold">
                Select Service
                <FormSelect
                  name="service"
                  placeholder="Select Service"
                  isMulti
                  options={serviceOptions}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[#E4E4E6] flex gap-4 w-full bg-white mt-auto sticky bottom-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white border-[#02C8DE] text-[#02C8DE] hover:bg-[#02C8DE] hover:text-[#111111] hover:border-[#02C8DE]"
              onClick={() => {
                resetForm();
                if (onReset) onReset();
              }}
            >
              Reset Filters
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#02C8DE] text-white hover:bg-[#02C8DE] hover:text-[#111111]"
            >
              Apply Filters
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AppointmentFilterForm;
