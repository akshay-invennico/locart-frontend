"use client";
import React from "react";
import { SearchDropdown } from "@/app/(dashboard)/appointments/SearchDropdown";
import { fieldRegistry } from "../form-fields";
import useFormState from "@/hooks/useFormState";
import useDropdownState from "@/hooks/useDropdownState";

const DynamicForm = ({
  config,
  onCancel,
  onApply,
  isEdit = false,
  initialValues: initialValuesProp,
  recordKey,
}) => {
  const {
    formData,
    setFormData,
    durationDropdowns,
    setDurationDropdowns,
    handleChange,
    handleSelectClient,
  } = useFormState({ config, isEdit, initialValues: initialValuesProp, recordKey });

  const {
    showDropdowns,
    setShowDropdowns,
    showCalendars,
    setShowCalendars,
    timePeriods,
    setTimePeriods,
    searchTerms,
    setSearchTerms,
    imageLoaded,
    setImageLoaded,
  } = useDropdownState();

  const handleApply = (customData) => {
    const dataToSubmit = customData !== undefined ? customData : formData;
    onApply?.(dataToSubmit);
    if (onCancel) onCancel();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const sharedFieldProps = {
    formData,
    setFormData,
    showDropdowns,
    setShowDropdowns,
    showCalendars,
    setShowCalendars,
    durationDropdowns,
    setDurationDropdowns,
    timePeriods,
    setTimePeriods,
    searchTerms,
    setSearchTerms,
    imageLoaded,
    setImageLoaded,
  };

  const renderField = (field) => {
    switch (field.type) {
      case "conditional":
        return field.condition(formData)
          ? field.fields.map((subField, idx) => (
              <div key={`${subField.name || subField.type}-${idx}`}>
                {renderField(subField)}
              </div>
            ))
          : null;

      case "search_dropdown":
        return (
          <SearchDropdown
            field={field}
            formData={formData}
            handleSelectClient={handleSelectClient}
          />
        );

      case "inputGroup":
        return (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${
                field.columns || 1
              }, minmax(0, 1fr))`,
            }}
          >
            {field.fields?.map((childField, index) => (
              <div key={index}>{renderField(childField)}</div>
            ))}
          </div>
        );

      case "customComponent":
        if (typeof field.render === "function") {
          return (
            <div key={field.name} className="my-4">
              {field.render(formData, setFormData)}
            </div>
          );
        }
        return null;

      case "hidden":
        return null;

      default: {
        const FieldComponent = fieldRegistry[field.type];
        if (!FieldComponent) {
          console.warn(`Unknown field type: ${field.type}`);
          return null;
        }

        const commonProps = {
          name: field.name,
          value: formData[field.name] || "",
          onChange: (e) => handleChange(e, field.name),
          placeholder: field.placeholder || "",
          style: field.css || {},
          className: "form-field",
        };

        return (
          <FieldComponent
            field={field}
            commonProps={commonProps}
            {...sharedFieldProps}
          />
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4">
        {config?.title && (
          <h2 className="text-lg font-bold mb-4">{config?.title}</h2>
        )}
        {config?.fields?.map((field, index) => (
          <div
            key={field.name || `${field.type}-${index}`}
            className="form-group mb-2"
            style={field.containerCss || {}}
          >
            {renderField(field)}
          </div>
        ))}
      </div>

      {config?.footer && (
        <div className="flex gap-2 p-4 border-t bg-white shrink-0">
          {config?.footer?.cancel && (
            <button
              type="button"
              onClick={() => {
                if (config.footer.cancel.onClick) {
                  config.footer.cancel.onClick();
                }
                handleCancel();
              }}
              className={
                config?.footer?.cancel?.className ||
                "bg-[#02C8DE] text-white px-4 py-2 rounded w-full"
              }
            >
              {config?.footer?.cancel?.label || "Cancel"}
            </button>
          )}

          {config?.footer?.apply && (
            <button
              type="button"
              onClick={async () => {
                if (config.footer.apply.onClick) {
                  const result = await config.footer.apply.onClick(formData);
                  if (result === false) return;
                }
                handleApply(formData);
              }}
              className={
                config?.footer?.apply?.className ||
                "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded"
              }
            >
              {config?.footer?.apply?.label || "Apply"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
