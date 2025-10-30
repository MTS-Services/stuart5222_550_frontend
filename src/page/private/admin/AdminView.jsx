import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Overviews from "../common/Overviews";
import { WaitListTable } from "./components/WaitListTable";
import { adminUserList } from "../../../features/admin/management/usreFetch";
import { fetchDashboardData } from "../../../features/admin/home/dashboardFetch";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(adminUserList({ page: page, limit: 50, status: "WAITLIST" }));
  }, [dispatch, page]);

  return (
    <div className="text-black md:p-8">
      {/* Header */}
      <Overviews />
      <div>
        <h2 className="my-3 font-raleway font-semibold text-black md:text-[28px]">
          Wait List
        </h2>
        {/* 🧾 Waitlist Table */}
        <WaitListTable page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default AdminDashboard;
