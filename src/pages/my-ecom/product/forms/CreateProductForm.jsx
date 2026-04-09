import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput, FormTextarea, FormSelect, FormFileUpload } from "@/components/forms";
import { Button } from "@/components/ui/button";

const validationSchema = Yup.object({
  productName: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").positive("Must be positive"),
  stock: Yup.number().required("Stock is required").min(0, "Cannot be negative"),
  description: Yup.string(),
  products: Yup.mixed(),
});

const CreateProductForm = ({ categoryOptions = [], onSubmit, onCancel }) => {
  const initialValues = {
    productName: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    products: null,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
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
