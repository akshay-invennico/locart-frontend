import { useField, useFormikContext } from "formik";
import { useState } from "react";
import FormField from "./FormField";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

const FormSelect = ({
  label,
  label2,
  name,
  options = [],
  required,
  className,
  selectClassName,
  displayValue,
  placeholder = "Select...",
  disabled,
  isMulti = false,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [open, setOpen] = useState(false);

  const currentValue = isMulti
    ? Array.isArray(field.value)
      ? field.value
      : []
    : field.value ?? "";

  const isSelected = (value) =>
    isMulti ? currentValue.includes(value) : currentValue === value;

  const handleSelect = (value) => {
    if (isMulti) {
      const next = currentValue.includes(value)
        ? currentValue.filter((v) => v !== value)
        : [...currentValue, value];
      setFieldValue(name, next);
    } else {
      setFieldValue(name, value);
      setOpen(false);
    }
    setFieldTouched(name, true, false);
  };

  const selectedLabel = isMulti
    ? currentValue.length
      ? options
          .filter((o) => currentValue.includes(o.value))
          .map((o) => o.label)
          .join(", ")
      : ""
    : options.find((o) => o.value === currentValue)?.label ?? "";
  const displayText =
    displayValue !== undefined && displayValue !== null
      ? displayValue
      : selectedLabel || placeholder;

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
      <Popover open={open} onOpenChange={(v) => !disabled && setOpen(v)}>
        <PopoverTrigger asChild>
          <button
            id={name}
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-colors",
              "hover:border-gray-300 focus:border-primary1",
              !selectedLabel && "text-gray-400",
              meta.touched && meta.error && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed",
              selectClassName
            )}
          >
            <span className="truncate text-left">{displayText}</span>
            <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[var(--radix-popover-trigger-width)] max-h-60 overflow-y-auto overscroll-contain p-1 rounded-lg shadow-lg border border-gray-100"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ul>
            {options.map((opt) => {
              const selected = isSelected(opt.value);
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-50",
                      selected ? "text-primary1 font-medium" : "text-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                        selected
                          ? "bg-primary1 border-primary1 text-white"
                          : "border-gray-300 text-gray-300"
                      )}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="truncate text-left">{opt.label}</span>
                  </button>
                </li>
              );
            })}
            {!options.length && (
              <li className="px-3 py-2 text-sm text-gray-400">No options</li>
            )}
          </ul>
        </PopoverContent>
      </Popover>
    </FormField>
  );
};

export default FormSelect;
