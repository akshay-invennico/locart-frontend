import { Formik, Form } from "formik";
import { FormInput, FormCheckboxGroup } from "@/components/forms";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const VendorFilterForm = ({ initialValues, onSubmit, onReset }) => {
  const defaults = {
    status: [],
    ...initialValues,
  };

  return (
    <Formik initialValues={defaults} onSubmit={onSubmit} enableReinitialize>
      {({ resetForm }) => (
        <Form className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Filter Vendors</h3>
            <p className="text-sm text-gray-500 mb-3">
              Narrow down the vendor list using filters.
            </p>
            <hr className="border-gray-200" />
          </div>

          <FormCheckboxGroup
            name="status"
            label="Vendor Status"
            options={statusOptions}
            singleSelect
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#02C8DE] text-[#02C8DE]"
              onClick={() => {
                resetForm();
                onReset?.();
              }}
            >
              Reset Filters
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VendorFilterForm;
