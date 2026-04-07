import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormSelect } from "@/components/forms";
import { Button } from "@/components/ui/button";

const pointsOptions = [
  { value: "10", label: "10 pts" },
  { value: "20", label: "20 pts" },
  { value: "30", label: "30 pts" },
  { value: "40", label: "40 pts" },
];

const reasonOptions = [
  { value: "Bookingnotcredited", label: "Booking not credited" },
  { value: "Referralissue", label: "Referral issue" },
  { value: "Manualadjustment", label: "Manual adjustment" },
  { value: "Other", label: "Other" },
];

const schema = Yup.object({
  points: Yup.string().required("Please select points"),
  reason: Yup.string().required("Please select a reason"),
});

const AddPointsForm = ({ onSubmit, onCancel }) => (
  <Formik
    initialValues={{ points: "", reason: "" }}
    validationSchema={schema}
    onSubmit={onSubmit}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4">
        <FormSelect name="points" label="Points to Add" options={pointsOptions} required />
        <FormSelect name="reason" label="Select Reason" options={reasonOptions} required />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1 border-[#02C8DE] text-[#02C8DE]" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white" disabled={isSubmitting}>
            Add Points
          </Button>
        </div>
      </Form>
    )}
  </Formik>
);

export default AddPointsForm;
