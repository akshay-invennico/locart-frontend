import ActionComponent from "@/components/grid/actionComponent";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addHolidayConfig, editHolidayConfig } from "./config";
import { Holiday_Columns } from "./column";
import Image from "next/image";
import {
  fetchAllHolidays,
  createHoliday,
  fetchStoreDetails,
  removeHoliday,
  editHoliday,
} from "@/state/store/storeSlice";

const HolidayPage = () => {
  const dispatch = useDispatch();
  const { store, holidays, loading } = useSelector((state) => state.salon);
  const storeId = store?._id;

  useEffect(() => {
    dispatch(fetchStoreDetails());
    dispatch(fetchAllHolidays());
  }, [dispatch]);

  const handleAddHoliday = async (formData, closeSidebar) => {
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
      closeSidebar();
    } else {
      console.error("Holiday Creation Failed:", res);
    }
  };

  const handleDelete = async (id, closePopup) => {
    const res = await dispatch(removeHoliday(id));

    if (res?.meta?.requestStatus === "fulfilled") {
      await dispatch(fetchAllHolidays());
      closePopup();
    } else {
      console.error("Holiday Delete Failed:", res);
    }
  };

  const handleEditHoliday = async (formData, closeSidebar, row) => {
    const payload = {
      date: new Date(formData.date).toISOString().split("T")[0],
      occasion: formData.occasion,
      // description: formData.description,
    };

    const res = await dispatch(
      editHoliday({
        id: row._id,
        data: payload,
      })
    );

    if (res?.meta?.requestStatus === "fulfilled") {
      await dispatch(fetchAllHolidays());
      closeSidebar();
    } else {
      console.error("Holiday Update Failed:", res);
    }
  };

  const options = {
    select: false,
    order: true,
    sortable: true,
  };
  return (
    <div className="w-full border rounded-lg p-4">
      <div className="mt-2">
        <div className="flex justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">
            Holiday & Blackout Dates
          </h2>

          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={addHolidayConfig}
                    onApply={handleAddHoliday}
                  />
                ),
              },
            ]}
            icon={
              <Image
                src="/icons/plusbutton.svg"
                alt="Add Services"
                width={18}
                height={18}
              />
            }
            text="Add Holiday"
            buttonClassName="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          />
        </div>
        <GridCommonComponent
          data={holidays || []}
          columns={Holiday_Columns(handleDelete, handleEditHoliday)}
          // options={options}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
          }}
        />
      </div>
    </div>
  );
};

export default HolidayPage;
