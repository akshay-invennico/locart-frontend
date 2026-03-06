"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAppointmentDetails } from "@/state/appointment/appointmentSlice";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import { editBookingConfig } from "./config";
import Spinner from "@/components/common/Spinner";

export default function EditBookingForm({ row, onApply, onCancel }) {
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
          ...data,
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
    <DynamicForm
      config={editBookingConfig(bookingData)}
      initialValues={bookingData}
      isEdit={true}
      onApply={onApply}
      onCancel={onCancel}
    />
  );
}
