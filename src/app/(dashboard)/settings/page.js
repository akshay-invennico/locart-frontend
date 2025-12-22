import React from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { columns } from "./column";

const options = {
  select: true,
  order: false,
};

const page = () => {
  return (
    <>
      <div className="w-full">
        {/* <GridCommonComponent
          data={UserData}
          options={options}
          columns={columns}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
        /> */}
      </div>
    </>
  );
};

export default page;
