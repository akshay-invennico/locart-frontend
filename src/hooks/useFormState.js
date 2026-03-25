"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export default function useFormState({
  config,
  isEdit = false,
  initialValues: initialValuesProp,
  recordKey,
}) {
  const initialState = useMemo(() => {
    const src = initialValuesProp || config?.initialValues;
    return isEdit && src ? { ...src } : {};
  }, [isEdit, initialValuesProp, config?.initialValues]);

  const [formData, setFormData] = useState(initialState);
  const hydratedKeyRef = useRef(null);

  // Hydrate form data for edit mode when record changes
  const [durationDropdowns, setDurationDropdowns] = useState({});

  useEffect(() => {
    const sourceInitials = initialValuesProp || config?.initialValues;
    const key = recordKey || "__default__";
    const alreadyHydratedForKey = hydratedKeyRef.current === key;
    if (isEdit && sourceInitials && !alreadyHydratedForKey) {
      setFormData({ ...sourceInitials });
      hydratedKeyRef.current = key;
      if (Array.isArray(config.fields)) {
        const nextDurations = {};
        for (const f of config.fields) {
          if (
            f?.type === "timeDuration" &&
            f?.name &&
            sourceInitials[f.name] != null
          ) {
            nextDurations[f.name] = {
              show: false,
              value: sourceInitials[f.name],
            };
          }
        }
        if (Object.keys(nextDurations).length) {
          setDurationDropdowns((prev) => ({ ...prev, ...nextDurations }));
        }
      }
    }
  }, [isEdit, initialValuesProp, config?.initialValues, config?.fields, recordKey]);

  const handleChange = useCallback((e, fieldName) => {
    const { value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSelectClient = useCallback((client) => {
    setFormData((prev) => ({
      ...prev,
      existingClient: client,
      user_id: client ? client.value : null,
    }));
  }, []);

  return {
    formData,
    setFormData,
    durationDropdowns,
    setDurationDropdowns,
    handleChange,
    handleSelectClient,
  };
}
