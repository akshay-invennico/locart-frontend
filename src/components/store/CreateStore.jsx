import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { storeCreate } from "@/state/store/storeSlice";
import { toast } from "sonner";
import { FormInput, FormTextarea, FormFileUpload } from "@/components/forms";
import { Button } from "@/components/ui/button";

const urlRule = Yup.string()
  .trim()
  .url("Enter a valid URL (including http:// or https://)")
  .nullable();

const storeSchema = Yup.object({
  logo: Yup.mixed().required("Store logo is required"),
  coverImage: Yup.mixed().required("Cover image is required"),
  name: Yup.string().trim().required("Store name is required"),
  streetAddress: Yup.string().trim().required("Street address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  zipCode: Yup.string()
    .trim()
    .matches(/^[0-9A-Za-z\s-]{3,10}$/, "Enter a valid zip code")
    .required("Zip code is required"),
  mapLink: urlRule,
  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\-()\s]{7,20}$/, "Enter a valid phone number")
    .required("Phone is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  website: urlRule,
  facebook: urlRule,
  instagram: urlRule,
  linkedin: urlRule,
  twitter: urlRule,
  about: Yup.string().trim().max(1000, "About must be 1000 characters or less"),
});

const initialValues = {
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
};

export default function CreateStore({ onClose }) {
  const dispatch = useDispatch();

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();

    if (values.logo) formData.append("logo", values.logo);
    if (values.coverImage) formData.append("coverImage", values.coverImage);

    const fields = [
      "name",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "mapLink",
      "phone",
      "email",
      "website",
      "facebook",
      "instagram",
      "linkedin",
      "twitter",
      "about",
    ];
    fields.forEach((key) => formData.append(key, values[key] ?? ""));

    dispatch(storeCreate(formData))
      .unwrap()
      .then(() => {
        toast.success("Store created successfully!");
        onClose();
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error(err?.message || err || "Error creating store");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold">Create Store</h2>
        <p className="text-gray-500 mb-6">
          Enter your store details to create your profile.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={storeSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormFileUpload
                name="logo"
                label="Store Logo"
                accept="image/png,image/jpeg"
                required
              />

              <FormFileUpload
                name="coverImage"
                label="Cover Image"
                accept="image/png,image/jpeg"
                required
              />

              <FormInput
                name="name"
                label="Store Name"
                placeholder="Store Name"
                required
              />

              <FormInput
                name="streetAddress"
                label="Street Address"
                placeholder="Street Address"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  name="city"
                  label="City"
                  placeholder="City"
                  required
                />
                <FormInput
                  name="state"
                  label="State"
                  placeholder="State"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  name="zipCode"
                  label="Zip Code"
                  placeholder="Zip Code"
                  required
                />
                <FormInput
                  name="mapLink"
                  label="Map Link"
                  placeholder="https://maps.example.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  name="phone"
                  label="Phone"
                  placeholder="Phone"
                  required
                />
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>

              <FormInput
                name="website"
                label="Website"
                placeholder="https://example.com"
              />

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  name="facebook"
                  label="Facebook"
                  placeholder="Facebook URL"
                />
                <FormInput
                  name="instagram"
                  label="Instagram"
                  placeholder="Instagram URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  name="linkedin"
                  label="LinkedIn"
                  placeholder="LinkedIn URL"
                />
                <FormInput
                  name="twitter"
                  label="Twitter"
                  placeholder="Twitter URL"
                />
              </div>

              <FormTextarea
                name="about"
                label="About"
                placeholder="Write something about the salon"
                rows={4}
              />

              <div className="flex justify-between mt-6 gap-x-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-300"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary1 hover:bg-primary1/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Store"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
