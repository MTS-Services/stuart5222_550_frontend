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
  const dispatch = useDispatch();
  const { overview, loading } = useSelector((state) => state.dashboard);
  const [slectedDate, setSlectedDate] = useState({ from: "", to: today });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(
      fetchDashboardData({
        from: slectedDate.from || null,
        to: slectedDate.to || null,
        range: filter || "ALL",
      }),
    );
  }, [slectedDate, filter, dispatch]);

  const handleReload = () => window.location.reload();
  const handleDateChange = (key, value) => {
    setSlectedDate((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-raleway text-2xl font-semibold uppercase text-[#002244]">
            Dashboard Overview
          </h2>
          <p className="mb-4 mt-1 font-raleway text-base font-normal text-[#464646]">
            Monitor your user performance
          </p>

          <h3 className="font-raleway text-base font-normal leading-normal text-[#111827]">
            {filter === "Today"
              ? "Today’s Overview"
              : filter === "This Week"
                ? "This Week’s Overview"
                : filter === "This Month"
                  ? "This Month’s Overview"
                  : "This Year’s Overview"}
          </h3>

          {/* 🗓 Date Filter */}
          <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-between md:py-2">
            {/* Filter Select */}
            <div className="w-full sm:w-auto">
              <CustomSelect
                options={["today", "week", "month", "year"]}
                value={filter}
                onChange={(val) => setFilter(val)}
                placeholder="Select Date"
              />
            </div>

            {/* Date Inputs */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
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

            {/* Reload Button */}
            <button
              onClick={handleReload}
              className="rounded-full bg-slate-200 p-2 hover:bg-slate-400"
            >
              <FaRedoAlt className="text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <AllCard loading={loading} filter={filter} dashboardData={overview} />
    </>
  );
};

export default Overviews;
