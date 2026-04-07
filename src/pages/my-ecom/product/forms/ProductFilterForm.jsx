import { Formik, Form } from "formik";
import { FormCheckboxGroup, FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "All", label: "All" },
  { value: "In-stock", label: "In-Stock" },
  { value: "Out-of-Stock", label: "Out-of-Stock" },
];

const categoryOptions = [
  { value: "Care Kit", label: "Care Kit" },
  { value: "Moisturizing Cream", label: "Moisturizing Cream" },
  { value: "Detangling Spray", label: "Detangling Spray" },
  { value: "Nourishing Oil", label: "Nourishing Oil" },
  { value: "Curl Defining Gel", label: "Curl Defining Gel" },
  { value: "Smoothing Serum", label: "Smoothing Serum" },
  { value: "Heat Protectant Spray", label: "Heat Protectant Spray" },
  { value: "Leave-In Conditioner", label: "Leave-In Conditioner" },
];

const ProductFilterForm = ({ initialValues, onSubmit, onReset }) => {
  const defaults = {
    status: [],
    category: [],
    stockMin: "",
    stockMax: "",
    priceMin: "",
    priceMax: "",
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
            name="status"
            label="Product Status"
            options={statusOptions}
            singleSelect
          />

          <FormCheckboxGroup
            name="category"
            label="Categories"
            options={categoryOptions}
            singleSelect
          />

          <div>
            <p className="text-sm font-medium mb-2">Stock Range</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="stockMin" type="number" placeholder="Min" />
              <FormInput name="stockMax" type="number" placeholder="Max" />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Price Range</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="priceMin" type="number" placeholder="Min" />
              <FormInput name="priceMax" type="number" placeholder="Max" />
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

export default ProductFilterForm;
