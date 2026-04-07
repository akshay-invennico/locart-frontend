import { Formik, Form } from "formik";
import { FormCheckboxGroup } from "@/components/forms";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const CategoryFilterForm = ({ initialValues, onApply, onReset, onCancel }) => {
  const defaults = {
    status: [],
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaults}
      enableReinitialize
      onSubmit={(values) => {
        onApply(values);
      }}
    >
      {({ resetForm }) => (
        <Form className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Advanced Filters
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Refine your search results using custom criteria across modules.
            </p>
            <hr className="border-gray-200" />
          </div>

          <p className="text-sm font-medium text-gray-700">Filter By:</p>

          <FormCheckboxGroup
            name="status"
            label="Category Status"
            options={statusOptions}
            singleSelect
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#02C8DE] text-[#02C8DE]"
              onClick={() => {
                resetForm({ values: { status: [] } });
                onReset();
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

export default CategoryFilterForm;
