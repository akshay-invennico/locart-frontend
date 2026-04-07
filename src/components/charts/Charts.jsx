import React from "react";
import LineChartByYear from "./LineChartByYear";
import PieChart from "./PieChart";

const Charts = () => {
  return (
    <div className="flex md:flex-row flex-col gap-[16px] w-full h-full">
      <div className="w-full md:w-[60%]">
        <LineChartByYear />
      </div>
      <div className="w-full md:w-[40%]">
        <PieChart />
      </div>
    </div>
  );
};

export default Charts;
