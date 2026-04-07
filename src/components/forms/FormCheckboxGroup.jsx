import { useField, useFormikContext } from "formik";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FormField from "./FormField";

const FormCheckboxGroup = ({
  label,
  name,
  options = [],
  required,
  className,
  singleSelect = false,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const values = Array.isArray(field.value) ? field.value : [];

  const handleToggle = (optionValue) => {
    let next;
    if (singleSelect) {
      next = values.includes(optionValue) ? [] : [optionValue];
    } else {
      next = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
    }
    setFieldValue(name, next);
    setFieldTouched(name, true, false);
  };

  return (
    <FormField
      label={label}
      name={name}
      error={meta.error}
      touched={meta.touched}
      required={required}
      className={className}
    >
      <div className="flex flex-wrap gap-3 pt-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <Checkbox
              checked={values.includes(opt.value)}
              onCheckedChange={() => handleToggle(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </FormField>
  );
};

export default FormCheckboxGroup;
