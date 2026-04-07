import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormSelect, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";

const reasonSchema = Yup.object({
  reason: Yup.string().required("Please select a reason"),
  note: Yup.string(),
});

/**
 * Reusable form for flag/cancel/suspend actions that need a reason + note.
 */
const ReasonForm = ({
  title,
  description,
  reasons = [],
  reasonLabel = "Select Reason",
  noteLabel = "Note",
  notePlaceholder = "Add note if 'Other' selected",
  submitLabel = "Confirm",
  submitVariant = "default",
  onSubmit,
  onCancel,
}) => {
  return (
    <Formik
      initialValues={{ reason: "", note: "" }}
      validationSchema={reasonSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            {typeof description === "string" ? (
              <p className="text-sm text-gray-500 mb-3">{description}</p>
            ) : (
              <div className="mb-3">{description}</div>
            )}
            <hr className="border-gray-200" />
          </div>

          <FormSelect
            name="reason"
            label={reasonLabel}
            options={reasons}
            required
          />
          <FormTextarea
            name="note"
            label={noteLabel}
            placeholder={notePlaceholder}
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={submitVariant}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : submitLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ReasonForm;
