import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RequestUserTable } from "./components/RequestUserTable";
import { adminUserDraftProfile } from "../../../features/admin/management/usreFetch";
import Overviews from "../common/Overviews";
import { TableDropDown } from "./components/TableDropDown";

const UserManageView = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("DRAFT");

  useEffect(() => {
    dispatch(adminUserDraftProfile({ page: 1, limit: 50, status: status })); // ✅
  }, [dispatch, status]); // ✅

  return (
    <div className="bg-[#F9FAFB] font-raleway md:p-8">
      <Overviews />
      <div className="">
        <div className="flex items-center justify-between">
          <h2 className="my-3 text-[28px] font-semibold text-black sm:my-4 md:my-5 lg:my-6 xl:my-7">
            Approved User
          </h2>

          <TableDropDown value={status} onChange={setStatus} />
        </div>
        <RequestUserTable />
      </div>
    </div>
  );
};

export default UserManageView;
