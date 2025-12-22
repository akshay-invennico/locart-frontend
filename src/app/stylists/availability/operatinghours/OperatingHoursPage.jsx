"use client";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import React from "react";
import { OperatingHours_Columns } from "./column";
import { operatingHours_data } from "./operatingHours_data";

const OperatingHoursPage = () => {
  const [data, setData] = React.useState(operatingHours_data);

  const handleTimeChange = (id, value) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...value } : row))
    );
  };

  const handleToggle = (id) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, active: !row.active } : row))
    );
  };
  const options = {
    select: false,
    order: true,
    sortable: true,
  };
  return (
    <div className="w-full border rounded-lg p-4">
      <div className="mt-2">
        <h2 className="text-lg font-semibold mb-2">Operating Hours</h2>

        {/* <GridCommonComponent
                data={operatingHours_data}
                columns={OperatingHours_Columns}
                // options={options}
                theme={{
                  border: "border-gray-300",
                  header: { bg: "bg-gray-100" },
                }}
              /> */}
        {/* <GridCommonComponent
          data={data}
          columns={OperatingHours_Columns.map((col) => ({
            ...col,
            component:
              col.key === "openTime" || col.key === "closeTime"
                ? (props) => (
                    <TimeRangeCell
                      row={props.row}
                      fieldName={col.key}
                      onChange: {handleTimeChange}
                    />
                  )
                : col.component,
          }))}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
          }}
          // pass toggle handler for Actions column
          onToggle={handleToggle}
        /> */}

        <GridCommonComponent
          data={data.map((row) => ({
            ...row,
            onChange: handleTimeChange,
            onToggle: handleToggle,
          }))}
          columns={OperatingHours_Columns}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
          }}
        />
      </div>
    </div>
  );
};

export default OperatingHoursPage;
