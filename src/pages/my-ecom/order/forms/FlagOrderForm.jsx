import { ReasonForm } from "@/components/forms";

const flagReasons = [
  { value: "Suspicious activity", label: "Suspicious activity" },
  { value: "Payment discrepancy", label: "Payment discrepancy" },
  { value: "Client complaint", label: "Client complaint" },
  { value: "No-show without update", label: "No-show without update" },
  { value: "Stylist issue", label: "Stylist issue" },
  { value: "Other", label: "Other" },
];

const FlagOrderForm = ({ onSubmit, onCancel }) => {
  return (
    <ReasonForm
      title="Flag This Order?"
      description="Are you sure you want to flag this Order for further review? Flagged Orders will be marked in the system and may require follow-up by the support or moderation team."
      reasons={flagReasons}
      reasonLabel="Please select a reason for flagging this Order"
      noteLabel="Note"
      notePlaceholder="Add note if 'Other' selected"
      submitLabel="Confirm Flag"
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default FlagOrderForm;
