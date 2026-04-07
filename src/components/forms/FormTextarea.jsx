import { useField } from "formik";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

const FormTextarea = ({
  label,
  label2,
  name,
  required,
  className,
  textareaClassName,
  placeholder,
  rows = 4,
  disabled,
  ...props
}) => {
  const [field, meta] = useField(name);

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
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          meta.touched && meta.error && "border-destructive",
          textareaClassName
        )}
        {...field}
        {...props}
      />
    </FormField>
  );
};

export default FormTextarea;
