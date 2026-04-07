import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMemo, useState } from "react";
import {
  FormInput,
  FormTextarea,
  FormFileUpload,
  FormSelect,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const stylistSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  services: Yup.array().min(1, "Select at least one service").required(),
  workingDays: Yup.array().min(1, "Select at least one working day").required(),
  status: Yup.string().required("Status is required"),
});

const workingDayOptions = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "InActive", label: "In-active" },
];

const buildTimeOptions = () => {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const value = `${hh}:${mm}`;
      const period = h < 12 ? "AM" : "PM";
      const label12 = `${((h + 11) % 12) + 1}:${mm} ${period}`;
      out.push({ value, label: label12 });
    }
  }
  return out;
};
const timeOptions = buildTimeOptions();

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let s = "";
  for (let i = 0; i < 16; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const AddStylistForm = ({
  serviceOptions = [],
  initialValues,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const tempPassword = useMemo(() => initialValues?.tempPassword || generatePassword(), [initialValues?.tempPassword]);

  const defaults = {
    profile_photo: null,
    fullName: "",
    nickname: "",
    specialization: "",
    email: "",
    phoneNumber: "",
    services: [],
    workingDays: [],
    workingHours_from: "09:00",
    workingHours_to: "17:00",
    experience_years: "",
    status: "Active",
    about: "",
    ...initialValues,
    tempPassword,
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={stylistSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex h-full flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {isEdit ? "Edit Stylist" : "Add New Stylist"}
            </h3>
            <p className="text-sm text-gray-500">
              Register a new stylist and assign them to one or more Services.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1 -mr-1">
            <FormFileUpload
              name="profile_photo"
              label="Stylist Profile Photo"
              accept="image/png,image/jpeg"
              maxSizeMB={2}
            />

            <FormInput name="fullName" label="Full Name" required />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                name="nickname"
                label="Known as (Nick Name)"
                placeholder="e.g, The Loc Whisperer / Master"
              />
              <FormInput
                name="specialization"
                label="Specialization"
                placeholder="e.g, LocStylist"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="e.g., john.doe@example.com"
                required
              />
              <FormInput
                name="phoneNumber"
                label="Phone Number"
                placeholder="e.g., (555) 123-4567"
                required
              />
            </div>

            <FormSelect
              name="services"
              label="Services"
              options={serviceOptions}
              placeholder="Select Services"
              isMulti
              required
            />

            <FormSelect
              name="workingDays"
              label="Working Days"
              options={workingDayOptions}
              placeholder="Select Working Days"
              isMulti
              required
            />

            <div>
              <label className="text-sm font-medium text-gray-900">Working Hours</label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <FormSelect
                  name="workingHours_from"
                  options={timeOptions}
                  placeholder="From"
                />
                <FormSelect
                  name="workingHours_to"
                  options={timeOptions}
                  placeholder="To"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                name="experience_years"
                label="Experience"
                placeholder="e.g, 5 years"
              />
              <FormSelect
                name="status"
                label="Status"
                options={statusOptions}
                required
              />
            </div>

            <FormTextarea
              name="about"
              label="About Stylist"
              placeholder="Description"
              rows={4}
            />
          </div>

          <div className="sticky bottom-0 left-0 right-0 flex gap-3 bg-white pt-4 mt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 border-primary1 text-primary1 hover:bg-primary1/5"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-primary1 hover:bg-primary1/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : isEdit
                  ? "Update Stylist"
                  : "Add Stylist"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddStylistForm;
