import { useField, useFormikContext } from "formik";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

const FormTimePicker = ({
  label,
  name,
  required,
  className,
  inputClassName,
  disabled,
  step,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <FormField
      label={label}
      name={name}
      error={meta.error}
      touched={meta.touched}
      required={required}
      className={className}
    >
      <input
        id={name}
        type="time"
        disabled={disabled}
        step={step}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50",
          meta.touched && meta.error && "border-destructive",
          inputClassName
        )}
        value={field.value || ""}
        onChange={(e) => setFieldValue(name, e.target.value)}
        onBlur={() => setFieldTouched(name, true)}
      />
    </FormField>
  );
};

export default FormTimePicker;
