import ActionComponent from "@/components/grid/actionComponent";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import { Plus } from "lucide-react";
import React from "react";
import { addHolidayConfig, editHolidayConfig } from "./config";
import { Holiday_Columns } from "./column";
import { holiday_data } from "./holiday_data";
import Image from "next/image";

const HolidayPage = () => {
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
                component: <DynamicForm config={addHolidayConfig} />,
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
          data={holiday_data}
          columns={Holiday_Columns}
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
