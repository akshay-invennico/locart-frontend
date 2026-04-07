import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { fetchAppointmentDetails } from "@/state/appointment/appointmentSlice";
import { FormInput, FormSelect, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/Spinner";

const statusOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentStatusOptions = [
  { value: "unpaid", label: "Unpaid" },
  { value: "partial_paid", label: "Partial Paid" },
  { value: "paid", label: "Paid" },
];

const EditBookingForm = ({ row, onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const id = row.booking_id || row.id;
        const res = await dispatch(fetchAppointmentDetails(id)).unwrap();
        const data = res.data || res;

        setBookingData({
          booking_number: data.booking_number || "",
          time_slot: data.time || data.service_start_time || "",
          booking_status: data.status || data.booking_status || "",
          payment_status: data.payment?.payment_status || data.payment_status || "",
          paid_amount: data.payment?.amount_paid || data.amount_paid || data.paid_amount || 0,
          booking_note: data.notes || data.booking_note || "",
        });
      } catch (err) {
        console.error("Failed to load appointment details", err);
      } finally {
        setLoading(false);
      }
    }
    if (row) loadData();
  }, [row, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (!bookingData) {
    return <div className="p-8">Failed to load booking data.</div>;
  }

  return (
    <Formik
      initialValues={bookingData}
      onSubmit={(values) => onSubmit(values, row)}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Edit Booking</h3>
            <p className="text-sm text-gray-500 mb-3">
              Update booking details to reflect the latest information.
            </p>
            <hr className="border-gray-200" />
          </div>

          <FormInput name="booking_number" label="Booking ID" disabled />
          <FormInput name="time_slot" label="Booking Time (HH:mm)" placeholder="e.g. 14:30" />
          <FormSelect name="booking_status" label="Booking Status" options={statusOptions} />
          <FormSelect name="payment_status" label="Payment Status" options={paymentStatusOptions} />
          <FormInput name="paid_amount" label="Paid Amount" type="number" placeholder="e.g. 50" />
          <FormTextarea name="booking_note" label="Booking Note" rows={3} />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 border-[#02C8DE] text-[#02C8DE]" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#02C8DE] hover:bg-[#02C8DE]/90 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Booking"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditBookingForm;
