import { useField, useFormikContext } from "formik";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const FormSwitch = ({ label, name, disabled, className }) => {
  const [field] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 text-sm font-medium text-gray-800 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {label && <span>{label}</span>}
      <Switch
        checked={!!field.value}
        disabled={disabled}
        onCheckedChange={(v) => {
          setFieldValue(name, v);
          setFieldTouched(name, true, false);
        }}
      />
    </label>
  );
};

export default FormSwitch;
