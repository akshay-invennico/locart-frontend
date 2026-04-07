import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";

const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

const ChangePasswordForm = ({ onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={changePasswordSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Change Your Password
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Change your password to keep your account secure. Make sure it's strong and unique.
            </p>
            <hr className="border-gray-200 mb-4" />
          </div>

          <FormInput
            name="currentPassword"
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
          />
          <FormInput
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter your new password"
          />
          <FormInput
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your new password"
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
