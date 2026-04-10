import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput, FormTextarea, FormFileUpload } from "@/components/forms";
import { Button } from "@/components/ui/button";

const validationSchema = Yup.object({
  name: Yup.string().required("Vendor name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  company: Yup.string(),
  address: Yup.string(),
  notes: Yup.string(),
  profile: Yup.mixed(),
});

const CreateVendorForm = ({ onSubmit, onCancel }) => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    notes: "",
    profile: null,
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
            <h3 className="text-lg font-bold text-gray-900 mb-1">Add Vendor</h3>
            <p className="text-sm text-gray-500 mb-3">
              Add a new vendor by entering their basic details.
            </p>
            <hr className="border-gray-200" />
          </div>

          <FormFileUpload
            name="profile"
            label="Vendor Photo"
            maxFiles={1}
          />

          <FormInput
            name="name"
            label="Vendor Name"
            placeholder="e.g, John Doe"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="vendor@example.com"
              required
            />
            <FormInput
              name="phone"
              label="Phone"
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          <FormInput
            name="company"
            label="Company"
            placeholder="Company name"
          />

          <FormInput
            name="address"
            label="Address"
            placeholder="Full address"
          />

          <FormTextarea
            name="notes"
            label="Notes"
            placeholder="Any additional notes about this vendor"
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
              {isSubmitting ? "Adding..." : "Add Vendor"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateVendorForm;
