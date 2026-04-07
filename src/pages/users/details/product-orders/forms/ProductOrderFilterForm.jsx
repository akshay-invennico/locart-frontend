import { Formik, Form } from "formik";
import { FormCheckboxGroup, FormDateRangePicker, FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "shipped", label: "Shipped" },
  { value: "pending", label: "Pending" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "cancelled", label: "Cancelled" },
];

const ProductOrderFilterForm = ({ initialValues, onSubmit, onReset }) => {
  const defaults = {
    status: [],
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    ...initialValues,
  };

  return (
    <Formik initialValues={defaults} onSubmit={onSubmit} enableReinitialize>
      {({ resetForm }) => (
        <Form className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Advanced Filters</h3>
            <p className="text-sm text-gray-500 mb-3">
              Refine your search results using custom criteria.
            </p>
            <hr className="border-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-600">Filter By:</p>
          </div>

          <FormCheckboxGroup name="status" label="Delivery Status" options={statusOptions} singleSelect />
          <FormDateRangePicker label="Date Range" nameFrom="dateFrom" nameTo="dateTo" />

          <div>
            <p className="text-sm font-medium mb-2">Amount Range</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="minAmount" type="number" placeholder="Min" />
              <FormInput name="maxAmount" type="number" placeholder="Max" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#02C8DE] text-[#02C8DE]"
              onClick={() => { resetForm(); onReset?.(); }}
            >
              Reset
            </Button>
            <Button type="submit" className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white">
              Apply Filters
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductOrderFilterForm;
