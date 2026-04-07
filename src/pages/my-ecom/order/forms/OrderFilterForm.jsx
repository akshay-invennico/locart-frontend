import { Formik, Form } from "formik";
import { FormCheckboxGroup, FormDateRangePicker, FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";

const orderStatusOptions = [
  { value: "All", label: "All" },
  { value: "Placed", label: "Placed" },
  { value: "Processing", label: "Processing" },
  { value: "Dispatched", label: "Dispatched" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Returned", label: "Returned" },
];

const paymentStatusOptions = [
  { value: "All", label: "All" },
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
  { value: "Refunded", label: "Refunded" },
];

const OrderFilterForm = ({ initialValues, onSubmit, onReset }) => {
  const defaults = {
    orderStatus: [],
    paymentStatus: [],
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
    ...initialValues,
  };

  return (
    <Formik initialValues={defaults} onSubmit={onSubmit} enableReinitialize>
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
            name="orderStatus"
            label="Order Status"
            options={orderStatusOptions}
            singleSelect
          />

          <FormCheckboxGroup
            name="paymentStatus"
            label="Payment Status"
            options={paymentStatusOptions}
            singleSelect
          />

          <FormDateRangePicker
            label="Date Range"
            nameFrom="dateFrom"
            nameTo="dateTo"
          />

          <div>
            <p className="text-sm font-medium mb-2">Amount Range</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="amountMin" type="number" placeholder="Min" />
              <FormInput name="amountMax" type="number" placeholder="Max" />
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

export default OrderFilterForm;
