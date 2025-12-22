"use client";
import React, { useEffect, useMemo, useState } from "react";
import { IoCalendarClear } from "react-icons/io5";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Card, CardContent } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingOverview } from "@/state/dashboard/dashboardSlice";


const MONTH_MAP = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

const chartConfig = {
  height: 300,
  width: "100%",
};

const LineChartByYear = () => {
  const dispatch = useDispatch();
  const { bookingOverview, loading } = useSelector((state) => state.dashboard);
  const [selected, setSelected] = useState(new Date().getFullYear().toString());


  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => String(current - 2 + i));
  }, []);


  useEffect(() => {
    dispatch(fetchBookingOverview({ filter: "year", year: Number(selected) }));
  }, [dispatch, selected]);

  const chartData = useMemo(() => {

    return bookingOverview.data;
  }, [bookingOverview]);

  const handleBarClick = (data) => {
    if (!data?.payload) return;
    const { label } = data.payload;
    if (bookingOverview.filter === "year") {
      const monthNum = MONTH_MAP[label];
      if (monthNum) {
        dispatch(
          fetchBookingOverview({
            filter: "month",
            year: bookingOverview.year,
            month: monthNum,
          })
        );
      }
    }
  };

  const handleBackToYear = () => {
    dispatch(fetchBookingOverview({ filter: "year", year: bookingOverview.year }));
  };
  return (
    <div className="border border-[var(--border-admin)] rounded-[8px] pb-6 h-full">
      <div className="border-b p-4 justify-between flex flex-row">
        <p className="text-black text-[18px] font-semibold ">
          Booking Overview
        </p>
        <div className="flex flex-row gap-2 items-center">
          {bookingOverview.filter === "month" && (
            <button
              onClick={handleBackToYear}
              className="text-[12px] text-[var(--color-primary1)] underline mr-2"
            >
              Back to Year
            </button>
          )}
          <p className="text-[#282928] text-[14px] font-medium">{selected}</p>
          <Popover>
            <PopoverTrigger>
              <IoCalendarClear size={20} className="cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent
              className="border w-[162px] border-[var(--border-admin)] rounded-[8px] p-[20px] "
              align="center"
              sideOffset={10}
            >
              {years.map((year) => (
                <div
                  key={year}
                  className={`flex flex-row gap-2 justify-between cursor-pointer p-2 rounded-[8px] ${year === selected ? "text-[var(--color-primary1)] bg-[#E5FCFF]" : ""
                    }`}
                  onClick={() => setSelected(year)}
                >
                  <p className="text-[14px] font-medium text-[var(--dark)]">{year}</p>
                  {year === selected && (
                    <IoIosCheckmarkCircle color="white" fill="var(--color-primary1) " />
                  )}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <CardContent className="p-4 md:p-6 lg:p-8">
        <ChartContainer config={chartConfig}>
          <BarChart
            width={250}
            height={300}
            barSize={20}
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fill="text-[#000000]"
              tickFormatter={(value) =>
                bookingOverview.filter === "year" ? String(value).slice(0, 3) : String(value)
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, "dataMax + 5"]}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="bookingValue"
              fill="var(--color-secondary1)"
              radius={[8, 8, 8, 8]}
              onClick={handleBarClick}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
};

export default LineChartByYear;