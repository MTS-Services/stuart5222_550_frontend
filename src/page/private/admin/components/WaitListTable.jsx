import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  adminApprove,
  adminReject,
} from '../../../../features/admin/management/usreFetch';
import { formatDate } from '../../../../utils/formatDate';

export const WaitListTable = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.adminUsers);

  // 🔹 Track which row is loading
  const [loadingRow, setLoadingRow] = useState({ approve: null, reject: null });

  const handleApprove = async (userId) => {
    setLoadingRow((prev) => ({ ...prev, approve: userId }));
    try {
      await dispatch(adminApprove({ user_id: userId })).unwrap();
    } catch (err) {
    } finally {
      setLoadingRow((prev) => ({ ...prev, approve: null }));
    }
  };

  const handleReject = async (userId) => {
    setLoadingRow((prev) => ({ ...prev, reject: userId }));
    try {
      await dispatch(adminReject({ user_id: userId })).unwrap();
    } catch (err) {
    } finally {
      setLoadingRow((prev) => ({ ...prev, reject: userId }));
    }
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan='5' className='text-center p-4'>
            Loading...
          </td>
        </tr>
      );
    }

    if (!users.length) {
      return (
        <tr>
          <td colSpan='5' className='text-center p-4 text-gray-500'>
            No users in waitlist.
          </td>
        </tr>
      );
    }

    return users.map((user) => (
      <tr key={user.id} className='hover:bg-gray-50'>
        <td className='p-2 border'>{user.id}</td>
        <td className='p-2 border'>{user.name}</td>
        <td className='p-2 border'>{user.email}</td>
        <td className='p-2 border text-center'>{formatDate(user.createdAt)}</td>
        <td className='p-2 border text-center flex justify-center gap-2'>
          <button
            onClick={() => handleApprove(user.id)}
            className={`bg-[#F07400] hover:bg-red-300 text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap ${
              loadingRow.approve ? 'bg-[#cfccc8]' : ''
            }`}
            disabled={loadingRow.approve === user.id}
          >
            {loadingRow.approve === user.id ? <p>Loading...</p> : '✓ Approve'}
          </button>

          <button
            onClick={() => handleReject(user.id)}
            className='flex justify-center items-center'
            disabled={loadingRow.reject === user.id}
          >
            {loadingRow.reject === user.id ? (
              <div>
                <span className='sr-only'>Loading...</span>
                <div className='w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin' />
              </div>
            ) : (
              <span className='text-xs bg-red-50 hover:bg-red-200 text-white p-2 transition rounded-full'>
                ❌
              </span>
            )}
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <table className='w-full border-collapse border border-gray-200 text-left'>
      <thead>
        <tr className='bg-gray-100'>
          <th className='p-2 border'>ID</th>
          <th className='p-2 border'>Name</th>
          <th className='p-2 border'>Email</th>
          <th className='p-2 border text-center'>Date</th>
          <th className='p-2 border text-center'>Action</th>
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
};
