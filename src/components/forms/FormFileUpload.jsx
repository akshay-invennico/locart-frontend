import { useField, useFormikContext } from "formik";
import { useRef, useState } from "react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";

const FormFileUpload = ({
  label,
  name,
  required,
  className,
  accept = "image/png,image/jpeg",
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 2,
  formatsLabel = "PNG, JPEG",
  disabled,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const files = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];

  const acceptFiles = (incoming) => {
    const selected = Array.from(incoming || []).filter(
      (f) => f.size <= maxSizeMB * 1024 * 1024
    );
    if (!selected.length) return;

    const newFiles = multiple ? [...files, ...selected].slice(0, maxFiles) : selected.slice(0, 1);
    setFieldValue(name, multiple ? newFiles : newFiles[0]);
    setFieldTouched(name, true, false);

    const addedPreviews = selected.map((file) =>
      file instanceof File && file.type.startsWith("image/") ? URL.createObjectURL(file) : null
    );
    setPreviews(
      multiple ? [...previews, ...addedPreviews].slice(0, maxFiles) : addedPreviews
    );
  };

  const handleChange = (e) => acceptFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    acceptFiles(e.dataTransfer.files);
  };

  const handleRemove = (index) => {
    if (previews[index]) URL.revokeObjectURL(previews[index]);
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFieldValue(name, multiple ? newFiles : newFiles[0] || null);
    setPreviews(newPreviews);
  };

  const limitLabel = multiple ? `(Max ${maxFiles} files)` : null;

  return (
    <FormField
      label={
        label && (
          <span className="flex w-full items-center justify-between">
            <span className="font-semibold text-gray-900">{label}</span>
            {limitLabel && <span className="text-xs text-gray-400">{limitLabel}</span>}
          </span>
        )
      }
      name={name}
      error={meta.error}
      touched={meta.touched}
      required={required}
      className={className}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={handleChange}
      />

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center cursor-pointer transition-colors",
          "hover:border-primary1/60 hover:bg-primary1/5",
          isDragging && "border-primary1 bg-primary1/5",
          meta.touched && meta.error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-400">
          <ImageIcon className="h-5 w-5" />
        </div>
        <p className="text-sm text-gray-600">Upload or drop a file right here</p>
        <p className="text-xs text-gray-400">(File Format – {formatsLabel})</p>
        <p className="text-xs text-gray-400">(Max File Size {maxSizeMB}MB/File)</p>
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              {src ? (
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-16 h-16 object-cover rounded-md border"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center rounded-md border bg-gray-50 text-xs text-gray-400">
                  File
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
                className="absolute -top-1.5 -right-1.5 bg-white border rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </FormField>
  );
};

export default FormFileUpload;
