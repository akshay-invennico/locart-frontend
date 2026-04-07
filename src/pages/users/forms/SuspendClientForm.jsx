import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormSelect, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";

const suspendReasons = [
  { value: "Inappropriate behavior", label: "Inappropriate behavior" },
  { value: "Multiple no-shows", label: "Multiple no-shows" },
  { value: "Spam or fake account", label: "Spam or fake account" },
  { value: "Client request", label: "Client request" },
  { value: "Missing essential Client details.", label: "Missing essential Client details" },
  { value: "Other", label: "Other" },
];

const suspendSchema = Yup.object({
  suspend_reason: Yup.string().required("Please select a reason"),
  note: Yup.string(),
});

const SuspendClientForm = ({ onSubmit, onCancel, bulk = false, count = 0 }) => {
  return (
    <Formik
      initialValues={{ suspend_reason: "", note: "" }}
      validationSchema={suspendSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {bulk ? "Suspend Selected Clients" : "Suspend Client"}
            </h3>
            {bulk ? (
              <>
                <p className="text-sm text-gray-500">You are about to suspend {count} clients.</p>
                <p className="text-sm text-gray-500">They will lose access to all app features until reactivated.</p>
                <p className="text-sm text-gray-500 mb-3">Please select a common reason for suspension.</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 mb-3">
                Select reason for suspension and optionally add notes.
              </p>
            )}
            <hr className="border-gray-200" />
          </div>

          <FormSelect
            name="suspend_reason"
            label="Select Reason"
            options={suspendReasons}
            required
          />
          <FormTextarea
            name="note"
            label="Note"
            placeholder="Add note if 'Other' selected"
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suspending..." : bulk ? "Confirm Suspend All" : "Suspend Client"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SuspendClientForm;
