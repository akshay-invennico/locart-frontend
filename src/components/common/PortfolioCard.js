"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  FaUser,
  FaScissors,
  FaCalendar,
  FaSackDollar,
  FaArrowUp,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummary } from "@/state/dashboard/dashboardSlice";

// Helper functions to map API keys to colors, icons, and titles
const getColorForKey = (key) => {
  switch (key) {
    case "totalClients":
      return "bg-primary1";
    case "activeStylists":
      return "bg-secondary1";
    case "todaysAppointments":
      return "bg-tertiary1";
    case "bookingRevenue":
      return "bg-quaternary1";
    case "productRevenue":
      return "bg-quinary1";
    case "totalAppointments":
      return "bg-primary1";
    case "upcomingAppointments":
      return "bg-secondary1";
    default:
      return "bg-gray-500";
  }
};

const getIconForKey = (key) => {
  switch (key) {
    case "totalClients":
      return <FaUser size={20} color={"var(--color-primary1)"} />;
    case "activeStylists":
      return <FaScissors size={20} color={"var(--color-secondary1)"} />;
    case "todaysAppointments":
      return <FaCalendar size={20} color={"var(--color-tertiary1)"} />;
    case "bookingRevenue":
      return <FaSackDollar size={20} color={"var(--color-quaternary1)"} />;
    case "productRevenue":
      return <FaSackDollar size={20} color={"var(--color-quinary1)"} />;
    case "totalAppointments":
      return <FaCalendar size={20} color={"var(--color-primary1)"} />;
    case "upcomingAppointments":
      return <FaCalendar size={20} color={"var(--color-secondary1)"} />;
    default:
      return null;
  }
};

const getHeadForKey = (key) => {
  switch (key) {
    case "totalClients":
      return "Total Clients";
    case "activeStylists":
      return "Active Stylists";
    case "todaysAppointments":
      return "Today's Appointments";
    case "bookingRevenue":
      return "Booking Revenue";
    case "productRevenue":
      return "Product Revenue";
    case "totalAppointments":
      return "Total Appointments";
    case "upcomingAppointments":
      return "Upcoming Appointments";
    default:
      return "";
  }
};

const formatMessageNumberWithText = (str) => {
  if (!str) return "";

  const match = str.match(/-?\$?([\d.,]+)/);
  if (!match) return str;

  const num = parseFloat(match[1].replace(/,/g, ""));
  const formatted = num.toFixed(2);

  return str.replace(match[1], formatted);
};


const ResponsiveDashboard = () => {
  const dispatch = useDispatch();
  const { summaryBoxes = [] } = useSelector((state) => {
    return state.dashboard || {}
  })
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    dispatch(fetchDashboardSummary());

    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [dispatch]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleDotClick = (index) => setCurrentIndex(index);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    e.target.dataset.startX = touch.clientX;
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    const touch = e.changedTouches[0];
    const startX = parseFloat(e.target.dataset.startX);
    const endX = touch.clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < (normalizedSummary?.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const normalizedSummary = Array.isArray(summaryBoxes)
    ? summaryBoxes
    : [
      { key: "totalAppointments", value: summaryBoxes?.totalAppointments },
      { key: "todaysAppointments", value: summaryBoxes?.todaysAppointments },
      { key: "upcomingAppointments", value: summaryBoxes?.upcomingAppointments },
    ];

  // Map API response to UI structure
  let PortfolioData =
    normalizedSummary?.map((item) => ({
      color: getColorForKey(item.key),
      head: getHeadForKey(item.key),
      value: item.value ?? 0,
      message: item.message ?? " ",
      MainIcon: getIconForKey(item.key),
      upCount: "0", // placeholder for percent changes if available
    })) || [];

  if (role === "loctitian") {
    PortfolioData = PortfolioData.slice(0, 3);
  } else if (role === "admin") {
    PortfolioData = PortfolioData.slice(0, 5);
  }

  const gridCols = `grid-cols-${Math.min(
    PortfolioData.length,
    role === "loctitian" ? 3 : 5
  )}`;

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden w-full gap-2">
        <div
          className="relative w-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {PortfolioData.map((item, index) => (

              <div key={index} className="w-full flex-shrink-0 md:px-4 px-0">
                <Card className={item.color + " rounded-[8px] text-white"}>
                  <div className="flex flex-col gap-[12px] px-[12px] md:py-[16px] py-[8px]">
                    <div className="flex justify-between items-center text-white">
                      <h3 className="text-[16px] font-medium">{item.head}</h3>
                      <div className="flex items-center gap-[4px]">
                        <div className="flex justify-center items-center w-[13px] h-[13px] bg-white rounded-full">
                          <FaArrowUp
                            size={10}
                            color={`var(--color-${item.color.replace(
                              "bg-",
                              ""
                            )})`}
                          />
                        </div>
                        {item.upCount || 0} %
                      </div>
                    </div>
                    <div className="flex flex-row gap-[8px] items-center">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        {item.MainIcon || ""}
                      </div>
                      <p className="text-[24px] font-medium text-white">
                        {/* {(item.value ?? 0).toFixed(2)} */}
                        {(Number(item.value) || 0).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-[14px] font-medium text-white">
                      {formatMessageNumberWithText(item.message)}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {PortfolioData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                ? "bg-cyan-400 w-6"
                : "bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className={`grid ${gridCols} gap-4 text-white`}>
          {PortfolioData.map((item, index) => (
            <Card key={index} className={item.color + " rounded-[8px]"}>
              <div className="flex flex-col gap-[12px] px-[12px]">
                <div className="flex justify-between items-center text-white">
                  <h3 className="text-[16px] flex-1 font-medium">
                    {item.head}
                  </h3>
                  <div className="flex items-center gap-[4px]">
                    <div className="flex justify-center items-center w-[13px] h-[13px] bg-white rounded-full">
                      <FaArrowUp
                        size={10}
                        color={`var(--color-${item.color.replace("bg-", "")})`}
                      />
                    </div>
                    {item.upCount || 0} %
                  </div>
                </div>
                <div className="flex flex-row gap-[8px] items-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    {item.MainIcon || ""}
                  </div>
                  <p className="text-[24px] font-medium text-white">
                    {(Number(item.value) || 0).toFixed(2)}
                  </p>
                </div>
                <p className="text-[14px] font-medium text-white">
                  {formatMessageNumberWithText(item.message)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResponsiveDashboard;
