import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormDatePicker, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";

const holidaySchema = Yup.object().shape({
  date: Yup.date().required("Date is required"),
  occasion: Yup.string().required("Occasion/Reason is required"),
});

const HolidayForm = ({ initialValues, onSubmit, onCancel, isEdit = false }) => {
  const defaults = {
    date: "",
    occasion: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={holidaySchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {isEdit ? "Edit Holiday" : "Add Holiday"}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Block specific dates to mark store unavailability.
            </p>
            <hr className="border-gray-200" />
          </div>

          <div className="space-y-4">
            <FormDatePicker name="date" label="Date" />
            <FormTextarea
              name="occasion"
              label="Occasion/Reason"
              placeholder="Enter occasion or reason"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="px-6 border-[#02C8DE] text-[#02C8DE]"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-[#02C8DE] text-white hover:bg-[#02C8DE]/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update Holiday" : "Add Holiday"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default HolidayForm;
