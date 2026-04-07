import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormSelect } from "@/components/forms";
import { Button } from "@/components/ui/button";

const badgeOptions = [
  { value: "FreshStart", label: "Fresh Start" },
  { value: "ReferralKing", label: "Referral King" },
  { value: "ProductLover", label: "Product Lover" },
  { value: "LoyalLocer", label: "Loyal Lo'cer" },
  { value: "ReviewRockstar", label: "Review Rockstar" },
  { value: "MonthlyHero", label: "Monthly Hero" },
  { value: "ComboKing", label: "Combo King" },
  { value: "ProfilePro", label: "Profile Pro" },
];

const reasonOptions = [
  { value: "Bookingnotcredited", label: "Booking not credited" },
  { value: "Referralissue", label: "Referral issue" },
  { value: "Manualadjustment", label: "Manual adjustment" },
  { value: "Other", label: "Other" },
];

const schema = Yup.object({
  badge: Yup.string().required("Please select a badge"),
  reason: Yup.string().required("Please select a reason"),
});

const AddBadgeForm = ({ onSubmit, onCancel }) => (
  <Formik
    initialValues={{ badge: "", reason: "" }}
    validationSchema={schema}
    onSubmit={onSubmit}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4">
        <FormSelect name="badge" label="Select Badge" options={badgeOptions} required />
        <FormSelect name="reason" label="Select Reason" options={reasonOptions} required />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1 border-[#02C8DE] text-[#02C8DE]" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white" disabled={isSubmitting}>
            Add Badge
          </Button>
        </div>
      </Form>
    )}
  </Formik>
);

export default AddBadgeForm;
