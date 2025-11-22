import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Overviews from "../common/Overviews";
import { WaitListTable } from "./components/WaitListTable";
import { adminUserList } from "../../../features/admin/management/usreFetch";
import { TableDropDown } from "./components/TableDropDown";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("WAITLIST");
  const {
    list: users,
    isLoading,
    pagination,
  } = useSelector((state) => state.adminUsers.users);

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(adminUserList({ page: page, limit: limit, status: status }));
  }, [dispatch, page, limit, status]);

  const hasPrevPage = pagination?.page > 1;
  const hasNextPage = pagination?.page < pagination?.totalPages;

  return (
    <div className="text-black md:p-8">
      {/* Header */}
      <Overviews />
      <div>
        <div className="flex items-center justify-between py-8">
          <h2 className="font-raleway text-2xl font-semibold uppercase text-[#002244]">
            {status}-LIST
          </h2>
          <div className="flex items-center gap-4">
            <TableDropDown value={status} onChange={setStatus} />
          </div>
        </div>
        {/* 🧾 Waitlist Table */}
        <WaitListTable list={users} isLoading={isLoading} />

        {/* Pagination */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!hasPrevPage}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-700">
            Page {pagination?.page} of {pagination?.totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) =>
                hasNextPage ? Math.min(pagination.totalPages, p + 1) : p,
              )
            }
            disabled={!hasNextPage}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
