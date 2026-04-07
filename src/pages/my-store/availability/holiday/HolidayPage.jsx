import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import {
  fetchAllHolidays,
  createHoliday,
  fetchStoreDetails,
  removeHoliday,
  editHoliday,
} from "@/state/store/storeSlice";
import { getHolidayColumns } from "./columns";
import HolidayForm from "./forms/HolidayForm";
import SlidePanel from "@/components/feedback/SlidePanel";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";

const HolidayPage = () => {
  const dispatch = useDispatch();
  const { store, holidays } = useSelector((state) => state.salon);
  const storeId = store?._id;

  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  useEffect(() => {
    dispatch(fetchStoreDetails());
    dispatch(fetchAllHolidays());
  }, [dispatch]);

  const handleAddHoliday = async (formData) => {
    if (!storeId) {
      console.error("Store ID not found!");
      return;
    }
    const payload = {
      salonId: storeId,
      date: new Date(formData.date).toISOString().split("T")[0],
      occasion: formData.occasion,
      description: formData.occasion,
    };

    const res = await dispatch(createHoliday(payload));
    if (res?.meta?.requestStatus === "fulfilled") {
      await dispatch(fetchAllHolidays());
      setShowAdd(false);
    } else {
      console.error("Holiday Creation Failed:", res);
    }
  };

  const handleDelete = async () => {
    if (!deleteRow) return;
    const res = await dispatch(removeHoliday(deleteRow._id));
    if (res?.meta?.requestStatus === "fulfilled") {
      await dispatch(fetchAllHolidays());
      setDeleteRow(null);
    } else {
      console.error("Holiday Delete Failed:", res);
    }
  };

  const handleEditHoliday = async (formData) => {
    if (!editRow) return;
    const payload = {
      date: new Date(formData.date).toISOString().split("T")[0],
      occasion: formData.occasion,
    };

    const res = await dispatch(
      editHoliday({
        id: editRow._id,
        data: payload,
      })
    );

    if (res?.meta?.requestStatus === "fulfilled") {
      await dispatch(fetchAllHolidays());
      setEditRow(null);
    } else {
      console.error("Holiday Update Failed:", res);
    }
  };

  const columns = getHolidayColumns(
    (row) => setDeleteRow(row),
    (row) => setEditRow(row)
  );

  return (
    <div className="w-full border rounded-lg p-4">
      <div className="mt-2">
        <div className="flex justify-between gap-4 mb-4 items-center">
          <h2 className="text-lg font-semibold">Holiday & Blackout Dates</h2>

          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE]/90 text-sm font-medium"
          >
            <img
              src="/icons/plusbutton.svg"
              alt="Add Holiday"
              width={16}
              height={16}
            />
            Add Holiday
          </button>
        </div>

        <GridCommonComponent
          data={holidays || []}
          columns={columns?.map((col) => {
            if (col.key === "actions") {
              return {
                ...col,
                component: {
                  ...col.component,
                  options: {
                    ...col.component.options,
                    actions: (row) => col.component.options.actions(row),
                  },
                },
              };
            }
            return col;
          })}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
          }}
        />
      </div>

      <SlidePanel
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title=""
        width="sm:max-w-md"
      >
        <HolidayForm onSubmit={handleAddHoliday} onCancel={() => setShowAdd(false)} />
      </SlidePanel>

      <SlidePanel
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title=""
        width="sm:max-w-md"
      >
        <HolidayForm
          isEdit
          initialValues={
            editRow
              ? {
                  date: editRow.date?.split("T")[0] || "",
                  occasion: editRow.occasion || "",
                }
              : {}
          }
          onSubmit={handleEditHoliday}
          onCancel={() => setEditRow(null)}
        />
      </SlidePanel>

      <ConfirmDialog
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        onConfirm={handleDelete}
        title="Delete Holiday?"
        description="Are you certain you want to permanently delete this holiday? This action is irreversible and will erase all associated details."
        confirmLabel="Yes, Delete"
        cancelLabel="No, Keep it"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default HolidayPage;
