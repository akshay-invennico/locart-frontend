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

const EditVendorForm = ({ vendor, onSubmit, onCancel }) => {
  const initialValues = {
    name: vendor?.name || "",
    email: vendor?.email || "",
    phone: vendor?.phone || "",
    company: vendor?.company || "",
    address: vendor?.address || "",
    notes: vendor?.notes || "",
    profile: null,
  };

  const handleSubmit = (values) => {
    const { profile, ...rest } = values;
    const cleaned = { ...rest };
    const file = Array.isArray(profile) ? profile[0] : profile;
    if (file && file instanceof File) {
      cleaned.profile = file;
    }
    onSubmit(cleaned, vendor);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Edit Vendor</h3>
            <p className="text-sm text-gray-500 mb-3">
              Update vendor details below.
            </p>
            <hr className="border-gray-200" />
          </div>

          {vendor?.profile && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Current Photo</p>
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                <img
                  src={vendor.profile}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <FormFileUpload
            name="profile"
            label="Update Photo"
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
              {isSubmitting ? "Updating..." : "Update Vendor"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditVendorForm;
