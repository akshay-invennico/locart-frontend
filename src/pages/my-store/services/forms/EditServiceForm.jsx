import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput, FormSelect, FormTextarea, FormFileUpload } from "@/components/forms";
import { Button } from "@/components/ui/button";

const serviceSchema = Yup.object({
  name: Yup.string().required("Service name is required"),
  base_price: Yup.number().positive("Must be greater than 0").required("Base price is required"),
  duration: Yup.number().positive("Must be greater than 0").required("Duration is required"),
  category_id: Yup.string().required("Please select a category"),
  status: Yup.string().required("Status is required"),
});

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditServiceForm = ({ service, categoryOptions = [], onSubmit, onCancel }) => {
  const initialValues = {
    services: null,
    name: service?.name || "",
    base_price: service?.base_price ? String(service.base_price) : "",
    duration: service?.duration ? String(service.duration) : "",
    category_id: service?.category_id?._id || service?.category_id || "",
    status: service?.status
      ? service.status.charAt(0).toUpperCase() + service.status.slice(1)
      : "Active",
    description: service?.description || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={serviceSchema}
      onSubmit={(values) => onSubmit(service._id, values)}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Edit Service</h3>
            <p className="text-sm text-gray-500 mb-3">
              Update service details for booking and stylist assignment.
            </p>
            <hr className="border-gray-200" />
          </div>

          <FormFileUpload name="services" label="Service Images" accept="image/*" multiple maxFiles={5} />
          <FormInput name="name" label="Service Name" placeholder="e.g, Loc Retwist" required />
          <FormInput name="base_price" label="Base Price" type="number" placeholder="e.g, 160" required />
          <FormInput name="duration" label="Duration (in minutes)" type="number" placeholder="Enter Duration" required />
          <FormSelect name="category_id" label="Category" options={categoryOptions} required />
          <FormSelect name="status" label="Status" options={statusOptions} required />
          <FormTextarea name="description" label="Description" placeholder="About the service" rows={3} />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 border-[#02C8DE] text-[#02C8DE]" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Service"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditServiceForm;
