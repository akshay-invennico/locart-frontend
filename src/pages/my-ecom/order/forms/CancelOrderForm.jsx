import { ReasonForm } from "@/components/forms";

const cancelReasons = [
  { value: "Inappropriate behavior", label: "Inappropriate behavior" },
  { value: "Out of stock", label: "Out of stock" },
  { value: "Incorrect address", label: "Incorrect address" },
  { value: "Payment issue", label: "Payment issue" },
  { value: "Other", label: "Other" },
];

const CancelOrderForm = ({ onSubmit, onCancel }) => {
  return (
    <ReasonForm
      title="Cancel Product Order?"
      description="Are you sure you want to cancel this order? This action will notify the Client and initiate a refund process if applicable. Once cancelled, this order cannot be undone."
      reasons={cancelReasons}
      reasonLabel="Cancellation Reason"
      noteLabel="Note"
      notePlaceholder="Add note if 'Other' selected"
      submitLabel="Cancel Order"
      submitVariant="destructive"
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default CancelOrderForm;
