"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Charts from "@/components/charts/Charts";
import PortfolioCard from "@/components/common/PortfolioCard";
import {
  fetchDashboardSummary,
  fetchTopPerformingStylist,
  fetchTopSellingProducts,
  fetchRecentActivities,
} from "@/state/dashboard/dashboardSlice";
import StylistSection from "./stylist/StylistSection";
import ProductSection from "./topProducts/ProductSection";
import ActivitySection from "./activity/ActivitySection";
import Spinner from "@/components/common/Spinner";

const DashboardView = () => {
  const dispatch = useDispatch();

  const { summaryBoxes, stylists, products, activities } = useSelector(
    (state) => state.dashboard
  );
  const role = useSelector((state) => state?.auth?.role);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        await Promise.all([
          dispatch(fetchDashboardSummary()),
          dispatch(fetchTopPerformingStylist()),
          dispatch(fetchTopSellingProducts()),
          dispatch(fetchRecentActivities()),
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] h-screen overflow-y-auto">
      <PortfolioCard summaryBoxes={summaryBoxes} />
      <Charts />
      {(role === "admin" || role === "merchant") && (
        <>
          <StylistSection stylists={stylists} />
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="lg:w-1/2 w-full h-[417px]">
              <ProductSection products={products} />
            </div>
            <div className="lg:w-1/2 w-full h-[417px]">
              <ActivitySection activities={activities} />
            </div>
          </div>
        </>
      )}

      {role === "loctitian" && (
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="w-full">
            <ActivitySection />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
