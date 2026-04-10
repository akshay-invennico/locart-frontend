import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput, FormTextarea, FormSelect, FormFileUpload } from "@/components/forms";
import { Button } from "@/components/ui/button";

const salesTypeOptions = [
  { label: "Regular", value: "regular" },
  { label: "Consignment", value: "consignment" },
];

const vendorPaymentTypeOptions = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed ($)", value: "fixed" },
];

const validationSchema = Yup.object({
  productName: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").positive("Must be positive"),
  stock: Yup.number().required("Stock is required").min(0, "Cannot be negative"),
  description: Yup.string(),
  products: Yup.mixed(),
  vendor: Yup.string(),
  salesPrice: Yup.number().when("vendor", {
    is: (val) => !!val,
    then: (schema) => schema.required("Sales price is required").positive("Must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
  salesType: Yup.string().when("vendor", {
    is: (val) => !!val,
    then: (schema) => schema.required("Sales type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  vendorPaymentType: Yup.string().when("vendor", {
    is: (val) => !!val,
    then: (schema) => schema.required("Payment type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  vendorPaymentValue: Yup.number().when("vendor", {
    is: (val) => !!val,
    then: (schema) => schema.required("Payment value is required").positive("Must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const CreateProductForm = ({ categoryOptions = [], vendorOptions = [], onSubmit, onCancel }) => {
  const initialValues = {
    productName: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    products: null,
    vendor: "",
    salesPrice: "",
    salesType: "",
    vendorPaymentType: "percentage",
    vendorPaymentValue: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Add Product</h3>
            <p className="text-sm text-gray-500 mb-3">
              Add a new item to your store catalogue by entering product details.
            </p>
            <hr className="border-gray-200" />
          </div>

          <FormFileUpload
            name="products"
            label="Product Photos"
            multiple
            maxFiles={5}
          />

          <FormInput
            name="productName"
            label="Product Name"
            placeholder="e.g, Loc Retwist"
            required
          />

          <FormSelect
            name="category"
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              name="price"
              label="Price"
              type="number"
              placeholder="$99"
              required
            />
            <FormInput
              name="stock"
              label="Stock"
              type="number"
              placeholder="230"
              required
            />
          </div>

          <FormTextarea
            name="description"
            label="Description"
            placeholder="Product Description"
          />

          <hr className="border-gray-200" />

          <FormSelect
            name="vendor"
            label="Vendor"
            placeholder="Select a vendor (optional)"
            options={vendorOptions}
            onChange={(e) => {
              const val = e.target.value;
              setFieldValue("vendor", val);
              if (!val) {
                setFieldValue("salesPrice", "");
                setFieldValue("salesType", "");
                setFieldValue("vendorPaymentType", "percentage");
                setFieldValue("vendorPaymentValue", "");
              }
            }}
          />

          {values.vendor && (
            <div className="space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-700">Vendor Pricing</p>

              <FormInput
                name="salesPrice"
                label="Sales Price"
                type="number"
                placeholder="Enter sales price"
                required
              />

              <FormSelect
                name="salesType"
                label="Sales Type"
                placeholder="Select sales type"
                options={salesTypeOptions}
                required
              />

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Vendor Payment</p>
                <div className="grid grid-cols-2 gap-3">
                  <FormSelect
                    name="vendorPaymentType"
                    label="Type"
                    options={vendorPaymentTypeOptions}
                    required
                  />
                  <FormInput
                    name="vendorPaymentValue"
                    label={values.vendorPaymentType === "percentage" ? "Value (%)" : "Value ($)"}
                    type="number"
                    placeholder={values.vendorPaymentType === "percentage" ? "e.g, 15" : "e.g, 20"}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#02C8DE] text-[#02C8DE]"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateProductForm;
