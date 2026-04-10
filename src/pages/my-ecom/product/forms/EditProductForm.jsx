import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput, FormTextarea, FormCheckboxGroup, FormFileUpload, FormSelect } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const salesTypeOptions = [
  { label: "Regular", value: "regular" },
  { label: "Consignment", value: "consignment" },
];

const vendorPaymentTypeOptions = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed ($)", value: "fixed" },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  category_id: Yup.array().min(1, "Select at least one category"),
  unit_price: Yup.number().required("Price is required").positive("Must be positive"),
  stock_quantity: Yup.number().required("Stock is required").min(0, "Cannot be negative"),
  description: Yup.string(),
  new_images: Yup.mixed(),
  vendor_id: Yup.string().nullable(),
  salesPrice: Yup.number().when("vendor_id", {
    is: (val) => !!val,
    then: (schema) => schema.required("Sales price is required").positive("Must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
  salesType: Yup.string().when("vendor_id", {
    is: (val) => !!val,
    then: (schema) => schema.required("Sales type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  vendorPaymentType: Yup.string().when("vendor_id", {
    is: (val) => !!val,
    then: (schema) => schema.required("Payment type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  vendorPaymentValue: Yup.number().when("vendor_id", {
    is: (val) => !!val,
    then: (schema) => schema.required("Payment value is required").positive("Must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const EditProductForm = ({ product, categoryOptions = [], vendorOptions = [], onSubmit, onCancel }) => {
  const categoryIds = Array.isArray(product?.category_id)
    ? product.category_id
    : product?.category_id
      ? [product.category_id]
      : Array.isArray(product?.category)
        ? product.category
          .map((c) => c?._id || c?.id || c?.category_id)
          .filter(Boolean)
        : product?.category?._id || product?.category?.id || product?.category?.category_id
          ? [product?.category?._id || product?.category?.id || product?.category?.category_id]
          : [];

  const initialValues = {
    name: product?.name || product?.productName || "",
    category_id: categoryIds,
    unit_price: product?.unit_price || product?.price?.$numberDecimal || product?.price || "",
    stock_quantity: product?.stock_quantity || product?.stock || "",
    description: product?.description || "",
    new_images: null,
    product_images: product?.images || product?.imageUrls || [],
    vendor_id: product?.vendor?._id || product?.vendor_id || "",
    salesPrice: product?.salesPrice || product?.sales_price || "",
    salesType: product?.salesType || product?.sales_type || "",
    vendorPaymentType: product?.vendorPaymentType || product?.vendor_payment_type || "percentage",
    vendorPaymentValue: product?.vendorPaymentValue || product?.vendor_payment_value || "",
  };

  const handleSubmit = (values) => {
    onSubmit(values, product);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Edit Product</h3>
            <p className="text-sm text-gray-500 mb-3">
              Edit complete product information, pricing, stock status.
            </p>
            <hr className="border-gray-200" />
          </div>

          <FormFileUpload
            name="new_images"
            label="Add New Photos"
            multiple
            maxFiles={5}
          />

          {/* Current images thumbnails */}
          {values.product_images?.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Current Product Photos</p>
              <div className="flex flex-wrap gap-2">
                {values.product_images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${i + 1}`}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = values.product_images.filter((_, idx) => idx !== i);
                        setFieldValue("product_images", updated);
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-white border rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FormInput
            name="name"
            label="Product Name"
            placeholder="Enter product name"
            required
          />

          <FormCheckboxGroup
            name="category_id"
            label="Categories"
            options={categoryOptions}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              name="unit_price"
              label="Price"
              type="number"
              placeholder="Enter price"
              required
            />
            <FormInput
              name="stock_quantity"
              label="Stock"
              type="number"
              placeholder="Enter stock quantity"
              required
            />
          </div>

          <FormTextarea
            name="description"
            label="Product Description"
            placeholder="Enter product description"
            rows={5}
          />

          <hr className="border-gray-200" />

          <FormSelect
            name="vendor_id"
            label="Vendor"
            placeholder="Select a vendor (optional)"
            options={vendorOptions}
            onChange={(e) => {
              const val = e.target.value;
              setFieldValue("vendor_id", val);
              if (!val) {
                setFieldValue("salesPrice", "");
                setFieldValue("salesType", "");
                setFieldValue("vendorPaymentType", "percentage");
                setFieldValue("vendorPaymentValue", "");
              }
            }}
          />

          {values.vendor_id && (
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
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditProductForm;
