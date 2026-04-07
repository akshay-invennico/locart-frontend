import React from "react";
import { Formik, Form } from "formik";
import { FormCheckboxGroup, FormDateRangePicker, FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Expired", label: "Expired" },
  { value: "Used", label: "Used" },
];

const OfferFilterForm = ({ initialValues, onApply, onReset, onCancel }) => {
  const defaults = {
    status: ["All"],
    dateFrom: "",
    dateTo: "",
    minDiscount: "",
    maxDiscount: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaults}
      enableReinitialize
      onSubmit={onApply}
    >
      {({ setValues }) => (
        <Form className="flex flex-col h-full gap-6">
          <div className="flex-1 space-y-6">
            <FormCheckboxGroup
              name="status"
              label="Offer Status"
              options={statusOptions}
              singleSelect
            />

            <FormDateRangePicker
              nameFrom="dateFrom"
              nameTo="dateTo"
              label="Date Range"
            />

            <div>
              <label className="block text-sm font-medium mb-3 text-[#111111]">
                Discount Range (in %)
              </label>
              <div className="flex items-center gap-2">
                <FormInput
                  name="minDiscount"
                  type="number"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <FormInput
                  name="maxDiscount"
                  type="number"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t mt-auto">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#02C8DE] text-[#02C8DE]"
              onClick={() => {
                setValues({
                  status: ["All"],
                  dateFrom: "",
                  dateTo: "",
                  minDiscount: "",
                  maxDiscount: "",
                });
                onReset();
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white"
            >
              Apply Filter
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OfferFilterForm;
