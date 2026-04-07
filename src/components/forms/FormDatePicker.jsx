import { useField, useFormikContext } from "formik";
import FormField from "./FormField";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

const FormDatePicker = ({
  label,
  name,
  required,
  className,
  inputClassName,
  placeholder = "Select date",
  min,
  max,
  disabled,
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
      <div className="relative">
        <input
          id={name}
          type="date"
          disabled={disabled}
          min={min}
          max={max}
          placeholder={placeholder}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50",
            meta.touched && meta.error && "border-destructive",
            inputClassName
          )}
          value={field.value || ""}
          onChange={(e) => setFieldValue(name, e.target.value)}
          onBlur={() => setFieldTouched(name, true)}
        />
      </div>
    </FormField>
  );
};

export default FormDatePicker;
