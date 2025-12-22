"use client";
import React, { useState } from "react";
import { CardContent } from "../ui/card";
import { useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodayAppointments } from "@/state/dashboard/dashboardSlice";

// const chartData = [
//   { name: "Completed", value: 260, color: "#02C8DE" },
//   { name: "Pending", value: 340, color: "#00A78E" },
// ];

const PieChartComponent = () => {
  const dispatch = useDispatch();
  const { todayAppointments, loading } = useSelector(
    (state) => state.dashboard
  );
  const [screenSize, setScreenSize] = useState("desktop");

  useEffect(() => {
    dispatch(fetchTodayAppointments());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const chartData = todayAppointments
    ? [
      {
        name: "Completed",
        value: todayAppointments.completed || 0,
        color: "#02C8DE",
      },
      {
        name: "Pending",
        value: todayAppointments.pending || 0,
        color: "#00A78E",
      },
    ]
    : [
      { name: "Completed", value: 0, color: "#02C8DE" },
      { name: "Pending", value: 0, color: "#00A78E" },
    ];

  const noData = chartData.every((d) => Number(d.value) === 0);

  // Responsive chart dimensions
  const chartWidth =
    screenSize === "mobile" ? 240 : screenSize === "tablet" ? 280 : 320;
  const chartHeight =
    screenSize === "mobile" ? 240 : screenSize === "tablet" ? 280 : 320;
  const innerRadius =
    screenSize === "mobile" ? 45 : screenSize === "tablet" ? 55 : 60;
  const outerRadius =
    screenSize === "mobile" ? 100 : screenSize === "tablet" ? 120 : 140;

  return (
    <div className="border border-[var(--border-admin)] rounded-[8px] pb-6 h-full">
      <div className="border-b p-4 justify-between flex flex-row">
        <p className="text-black text-[18px] font-semibold ">
          Today’s Appointment Overview
        </p>
      </div>

      <div className=" p-4 md:p-6 lg:p-8 w-full md:h-full flex flex-col items-center justify-center  ">
        <div className="relative">

          {noData ? (
            <div
              className="flex items-center justify-center"
              style={{ width: chartWidth, height: chartHeight }}
            >
              <span className="text-sm text-gray-500">No appointments today</span>
            </div>
          ) : (
            <ResponsiveContainer width={chartWidth} height={chartHeight}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={4}
                  stroke="#ffffff"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      cornerRadius={index === 0 ? 5 : 0}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {!noData && (
          <div
            className={`flex flex-row-reverse justify-center mt-2 
  ${screenSize === "mobile"
                ? "gap-3"
                : screenSize === "tablet"
                  ? "gap-5"
                  : "gap-8"
              }`}
          >
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex justify-center items-center gap-2"
              >
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-[14px] font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChartComponent;
