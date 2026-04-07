import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput, FormTextarea, FormFileUpload } from "@/components/forms";
import { Button } from "@/components/ui/button";

const storeSchema = Yup.object({
  name: Yup.string().required("Store name is required"),
  streetAddress: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string().required("Zip code is required"),
  phone: Yup.string(),
  email: Yup.string().email("Invalid email"),
  about: Yup.string(),
});

const StoreEditForm = ({ initialValues, onSubmit, onCancel }) => {
  const defaults = {
    logo: null,
    coverImage: null,
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    mapLink: "",
    phone: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    about: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={storeSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Edit Store</h3>
            <p className="text-sm text-gray-500 mb-3">Update your store details.</p>
            <hr className="border-gray-200" />
          </div>

          <FormFileUpload name="logo" label="Store Logo" accept="image/*" />
          <FormFileUpload name="coverImage" label="Cover Image" accept="image/*" />
          <FormInput name="name" label="Store Name" placeholder="Store Name" required />
          <FormInput name="streetAddress" label="Street Address" placeholder="Street Name" required />

          <div className="grid grid-cols-2 gap-3">
            <FormInput name="city" label="City" placeholder="Enter City" required />
            <FormInput name="state" label="State" placeholder="Enter State" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput name="zipCode" label="Zip Code" placeholder="Zip Code" required />
            <FormInput name="mapLink" label="Map Link" placeholder="Map Link" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput name="phone" label="Phone" placeholder="Phone" />
            <FormInput name="email" label="Email" type="email" placeholder="Email" />
          </div>

          <FormInput name="website" label="Website" placeholder="URL" />

          <div className="grid grid-cols-2 gap-3">
            <FormInput name="facebook" label="Facebook" placeholder="Link" />
            <FormInput name="instagram" label="Instagram" placeholder="Link" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput name="linkedin" label="LinkedIn" placeholder="Link" />
            <FormInput name="twitter" label="Twitter" placeholder="Link" />
          </div>

          <FormTextarea name="about" label="About the Salon" placeholder="About the Salon" rows={4} />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 border-[#02C8DE] text-[#02C8DE]" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Store"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StoreEditForm;
