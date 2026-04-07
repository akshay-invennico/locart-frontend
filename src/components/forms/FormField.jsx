import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const FormField = ({
  label,
  label2,
  name,
  error,
  touched,
  required,
  className,
  children,
}) => {
  const showError = touched && error;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={name} className={cn(showError && "text-destructive")}>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          {label2 && (
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {label2}
            </span>
          )}
        </div>
      )}
      {children}
      {showError && (
        <p className="text-xs text-destructive">{typeof error === "string" ? error : ""}</p>
      )}
    </div>
  );
};

export default FormField;
