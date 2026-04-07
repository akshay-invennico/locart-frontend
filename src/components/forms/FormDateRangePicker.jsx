import FormDatePicker from "./FormDatePicker";

const FormDateRangePicker = ({
  label,
  nameFrom,
  nameTo,
  required,
  className,
  disabled,
}) => {
  return (
    <div className={className}>
      {label && (
        <p className="text-sm font-medium mb-2">{label}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <FormDatePicker
          label="From"
          name={nameFrom}
          required={required}
          disabled={disabled}
        />
        <FormDatePicker
          label="To"
          name={nameTo}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FormDateRangePicker;
