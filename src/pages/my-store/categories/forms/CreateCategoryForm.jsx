import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FormInput,
  FormTextarea,
  FormFileUpload,
  FormSelect,
} from "@/components/forms";
import { Button } from "@/components/ui/button";

const categorySchema = Yup.object({
  name: Yup.string().required("Category name is required"),
});

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const CreateCategoryForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const defaults = {
    category_photo: null,
    name: "",
    description: "",
    status: "active",
    image: null,
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={categorySchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {isEdit ? "Edit Category" : "Add Category"}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {isEdit
                ? "Update category details."
                : "Add a new category to your store catalogue by entering product details."}
            </p>
            <hr className="border-gray-200" />
          </div>

          {isEdit && defaults.existingImage && (
            <div className="flex items-center gap-3">
              <img
                src={defaults.existingImage}
                alt="Current category"
                className="w-16 h-16 rounded object-cover border"
              />
              <span className="text-xs text-gray-500">
                Current icon — upload a new file to replace it.
              </span>
            </div>
          )}

          <FormFileUpload
            name={isEdit ? "image" : "category_photo"}
            label="Category Icon"
            accept="image/*"
          />

          <FormInput
            name="name"
            label="Category Name"
            placeholder="e.g, Loc Retwist"
            required
          />

          {isEdit && (
            <FormSelect
              name="status"
              label="Category Status"
              options={statusOptions}
            />
          )}

          <FormTextarea
            name="description"
            label="Description"
            placeholder="Category Description"
            rows={4}
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
              {isSubmitting
                ? "Processing..."
                : isEdit
                ? "Update Category"
                : "Add Category"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateCategoryForm;
