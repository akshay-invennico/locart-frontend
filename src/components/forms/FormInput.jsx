import { useField } from "formik";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const FormInput = ({
  label,
  label2,
  name,
  type = "text",
  required,
  className,
  inputClassName,
  placeholder,
  disabled,
  ...props
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

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
      <div className="relative">
        <Input
          id={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            meta.touched && meta.error && "border-destructive",
            isPassword && "pr-10",
            inputClassName
          )}
          {...field}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </FormField>
  );
};

export default FormInput;
