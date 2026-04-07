import { useField, useFormikContext } from "formik";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

const FormToggle = ({
  label,
  label2,
  name,
  options = [],
  required,
  className,
  disabled,
  onChange,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <FormField
      label={label}
      label2={label2}
      name={name}
      error={meta.error}
      touched={meta.touched}
      required={required}
      className={className}
    >
      <div className="flex rounded-lg border border-[#E4E4E6] bg-white p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              field.value === opt.value
                ? "bg-[#02C8DE] text-white shadow-sm"
                : "bg-transparent text-[#7B7B7B] hover:bg-[#F5F5F5]",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => {
              setFieldValue(name, opt.value);
              setFieldTouched(name, true, false);
              if (onChange) {
                onChange(opt.value);
              }
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </FormField>
  );
};

export default FormToggle;
