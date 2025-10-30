import React, { useEffect, useState } from "react";
import { AllCard } from "./AllCard";
import { useDispatch, useSelector } from "react-redux";
import { FaRedoAlt } from "react-icons/fa";
import CustomSelect from "./CustomSelect";
import CustomDateInput from "./CustomDateInput";
import { fetchDashboardData } from "../../../features/admin/home/dashboardFetch";
import { filterFormate } from "../../../utils/formatDate";
const today = filterFormate(new Date());

const Overviews = () => {
  const { dashboardData, loading } = useSelector((state) => state.dashboard);
  const [slectedDate, setSlectedDate] = useState({ from: today, to: today });
  const [filter, setFilter] = useState("Today");
  const dispatch = useDispatch();

  useEffect(() => {
    if (slectedDate?.from && slectedDate?.to) {
      dispatch(
        fetchDashboardData({ from: slectedDate.from, to: slectedDate.to }),
      );
    }
  }, [slectedDate, dispatch]);

  const handleReload = () => window.location.reload();
  const handleDateChange = (key, value) => {
    setSlectedDate((prev) => ({ ...prev, [key]: value }));
  };

  // Get analytics data based on filter
  const getFilteredAnalytics = () => {
    if (!dashboardData?.analytics) return null;
    const { analytics } = dashboardData;
    switch (filter) {
      case "Today":
        return analytics.today;
      case "This Week":
        return analytics.week;
      case "This Month":
        return analytics.month;
      case "This Year":
        return analytics.year;
      default:
        return analytics.today;
    }
  };

  const analyticsData = getFilteredAnalytics();

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-poppins text-2xl font-semibold text-[#002244]">
            Dashboard Overview
          </h2>
          <p className="mb-4 mt-1 font-lato text-base font-normal text-[#464646]">
            Monitor your user performance
          </p>

          <h3 className="font-poppins text-base font-normal leading-normal text-[#111827]">
            {filter === "Today"
              ? "Today’s Overview"
              : filter === "This Week"
                ? "This Week’s Overview"
                : filter === "This Month"
                  ? "This Month’s Overview"
                  : "This Year’s Overview"}
          </h3>

          {/* 🗓 Date Filter */}
          <div className="mt-2 flex items-center gap-4 md:py-2">
            <CustomSelect
              options={["Today", "This Week", "This Month", "This Year"]}
              value={filter}
              onChange={(val) => setFilter(val)}
              placeholder="Select Date Range"
            />

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <CustomDateInput
                label="From"
                value={slectedDate.from || ""}
                onChange={(val) => handleDateChange("from", val)}
              />
              <CustomDateInput
                label="To"
                value={slectedDate.to || ""}
                onChange={(val) => handleDateChange("to", val)}
              />
            </div>

            <button
              onClick={handleReload}
              className="rounded-full bg-slate-200 p-1 hover:bg-slate-400"
            >
              <FaRedoAlt className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <AllCard
        loading={loading}
        filter={filter}
        analyticsData={analyticsData}
        dashboardData={dashboardData}
      />
    </>
  );
};

export default Overviews;
