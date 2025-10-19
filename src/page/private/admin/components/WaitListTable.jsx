import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  adminApprove,
  adminReject,
} from '../../../../features/admin/management/usreFetch';

export const WaitListTable = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.adminUsers);

  // 🔹 Track which row is loading
  const [loadingRow, setLoadingRow] = useState({ approve: null, reject: null });

  const handleApprove = async (userId) => {
    console.log('Approving user:', userId);
    setLoadingRow({ ...loadingRow, approve: userId });
    try {
      await dispatch(adminApprove({ user_id: userId })).unwrap();
      console.log(`✅ User ${userId} approved`);
    } catch (err) {
      console.error('❌ Approval failed:', err);
    } finally {
      setLoadingRow({ ...loadingRow, approve: null });
    }
  };

  const handleReject = async (userId) => {
    console.log('Rejecting user:', userId);
    setLoadingRow({ ...loadingRow, reject: userId });
    try {
      await dispatch(adminReject({ user_id: userId })).unwrap();
      console.log(`❌ User ${userId} rejected`);
    } catch (err) {
      console.error('❌ Rejection failed:', err);
    } finally {
      setLoadingRow({ ...loadingRow, reject: null });
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
        <td className='p-2 border text-center'>{user.createdAt}</td>
        <td className='p-2 border text-center flex justify-center gap-2'>
          <button
            onClick={() => handleApprove(user.id)}
            className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition'
            disabled={loadingRow.approve === user.id}
          >
            {loadingRow.approve === user.id ? 'Loading...' : '✓ Approve'}
          </button>
          <button
            onClick={() => handleReject(user.id)}
            className='bg-red-100 hover:bg-red-300 text-white px-3 py-1 rounded transition'
            disabled={loadingRow.reject === user.id}
          >
            {loadingRow.reject === user.id ? 'Loading...' : '❌'}
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
