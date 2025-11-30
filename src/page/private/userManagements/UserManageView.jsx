import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Overviews from "../common/Overviews";
import { TableDropDown } from "./components/TableDropDown";
import { RequestUserTable } from "./components/RequestUserTable";
import { adminUserDraftProfile } from "../../../features/admin/management/usreFetch";

const UserManageView = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("DRAFT");

  useEffect(() => {
    dispatch(adminUserDraftProfile({ page: 1, limit: 50, status: status }));
  }, [dispatch, status]);

  return (
    <div className="bg-[#F9FAFB] font-raleway md:p-8">
      <Overviews />
      <div className="">
        <div className="my-8 flex items-center justify-between">
          <h2 className="font-raleway text-2xl font-semibold uppercase text-[#002244]">
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
