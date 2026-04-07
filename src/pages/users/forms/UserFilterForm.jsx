import { Formik, Form } from "formik";
import { FormCheckboxGroup, FormDateRangePicker, FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspend", label: "Suspended" },
];

const UserFilterForm = ({ initialValues, onSubmit, onReset }) => {
  const defaults = {
    status: [],
    joinedFrom: "",
    joinedTo: "",
    minSpent: "",
    maxSpent: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaults}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ resetForm }) => (
        <Form className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Advanced Filters</h3>
            <p className="text-sm text-gray-500 mb-3">
              Refine your search results using custom criteria across modules.
            </p>
            <hr className="border-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-600">Filter By:</p>
          </div>

          <FormCheckboxGroup
            name="status"
            label="Status"
            options={statusOptions}
            singleSelect
          />

          <FormDateRangePicker
            label="Join Date"
            nameFrom="joinedFrom"
            nameTo="joinedTo"
          />

          <div>
            <p className="text-sm font-medium mb-2">Spent Amount</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="minSpent" type="number" placeholder="Min" />
              <FormInput name="maxSpent" type="number" placeholder="Max" />
            </div>
          </div>

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
              Reset
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

export default UserFilterForm;
