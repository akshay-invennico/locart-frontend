import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { FormInput, FormSelect, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { getMyServices } from "@/state/stylist/stylistMeService";

const schema = Yup.object({
  client_name: Yup.string().required("Client name is required"),
  client_phone: Yup.string().required("Phone number is required"),
  client_email: Yup.string().email("Invalid email"),
  service_id: Yup.string().required("Please select a service"),
  date: Yup.string().required("Date is required"),
  start_time: Yup.string().required("Start time is required"),
  notes: Yup.string(),
});

const CreateAppointmentForm = ({ onSubmit, onCancel }) => {
  const [serviceOptions, setServiceOptions] = useState([]);

  useEffect(() => {
    getMyServices()
      .then((res) => {
        const list = res?.data || res || [];
        setServiceOptions(
          list.map((s) => ({ value: s._id, label: `${s.name} ($${s.base_price})` }))
        );
      })
      .catch(() => setServiceOptions([]));
  }, []);

  return (
    <Formik
      initialValues={{
        client_name: "",
        client_phone: "",
        client_email: "",
        service_id: "",
        date: "",
        start_time: "",
        notes: "",
      }}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex h-full flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1 -mr-1">
            <FormInput name="client_name" label="Client Name" required />
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="client_phone" label="Phone Number" required />
              <FormInput name="client_email" label="Email" type="email" />
            </div>
            <FormSelect
              name="service_id"
              label="Service"
              options={serviceOptions}
              placeholder={
                serviceOptions.length ? "Select a service" : "No services available"
              }
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="date" label="Date" type="date" required />
              <FormInput name="start_time" label="Start Time" type="time" required />
            </div>
            <FormTextarea name="notes" label="Notes" rows={3} placeholder="Optional" />
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
              {isSubmitting ? "Creating…" : "Create Appointment"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateAppointmentForm;
