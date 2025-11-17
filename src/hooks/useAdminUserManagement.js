// hooks/useAdminUserManagement.js
import { useSelector, useDispatch } from "react-redux";

export const useAdminUserManagement = () => {
  const dispatch = useDispatch();
  const adminUserManagement = useSelector((state) => state.adminUserManagement);

  return {
    ...adminUserManagement,
    dispatch,
  };
};
