import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { formatDate } from "../../../../utils/formatDate";
import {
  toggleProfileActive,
  adminDeleteProfile,
} from "../../../../features/admin/management/usreFetch";
import ConfirmModal from "../../../../components/common/ConfirmModal";

export const UserEditTable = ({ list, isLoading, error }) => {
  const dispatch = useDispatch();
  const [loadingId, setLoadingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const closeConfirm = () => {
    if (loadingId) return;
    setConfirmAction(null);
  };

  const openToggleConfirm = (row) => {
    const isCurrentlyActive = row.isActive !== false;
    setConfirmAction({
      type: "toggle",
      profileId: row.id,
      displayName: row.displayName || row.user?.name || "this profile",
      isCurrentlyActive,
    });
  };

  const openDeleteConfirm = (row) => {
    setConfirmAction({
      type: "delete",
      profileId: row.id,
      displayName: row.displayName || row.user?.name || "this profile",
    });
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, profileId, isCurrentlyActive } = confirmAction;
    setLoadingId(profileId);
    try {
      if (type === "delete") {
        await dispatch(adminDeleteProfile({ profileId })).unwrap();
      } else {
        await dispatch(
          toggleProfileActive({
            profileId,
            isActive: !isCurrentlyActive,
          }),
        ).unwrap();
      }
      setConfirmAction(null);
    } catch {
      // Error toast handled by slice
    } finally {
      setLoadingId(null);
    }
  };

  const isDelete = confirmAction?.type === "delete";
  const isBusy = Boolean(loadingId);

  return (
    <div className="font-raleway">
      <div className="relative overflow-x-auto md:overflow-x-visible">
        {isLoading ? (
          <div>
            <p className="p-4 text-center">Loading...</p>
          </div>
        ) : error ? (
          <p className="py-10 text-center text-red-500">{error}</p>
        ) : list.length === 0 ? (
          <div className="rounded-md border-2 border-dashed border-gray-300 py-20">
            <p className="text-center">No user profiles found.</p>
          </div>
        ) : (
          <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
            <thead className="bg-white text-lg font-normal text-black">
              <tr>
                <th className="whitespace-nowrap px-7 py-3 font-raleway">
                  Date
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-raleway">
                  Display Name
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Age
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Height
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Body Type
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Status
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-base font-normal text-black">
              {list.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
                >
                  <td className="whitespace-nowrap px-7 py-3 font-raleway">
                    {formatDate(row.createdAt) || "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-raleway">
                    {row.user?.id ? (
                      <Link
                        to={`/admin/all-users/${row.user.id}`}
                        className="hover:text-orange-600 hover:underline"
                      >
                        {row.displayName || "—"}
                      </Link>
                    ) : (
                      <div>{row.displayName || "—"}</div>
                    )}
                    {row.user?.name && (
                      <div className="text-xs text-gray-500">
                        Legal: {row.user.name}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                    {row.age || "—"} <span>years</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                    {row.height || "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                    {row.bodyType || "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-center font-raleway">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        row.isActive !== false
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.isActive !== false ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-2.5">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openToggleConfirm(row)}
                        disabled={loadingId === row.id}
                        className={`inline-flex min-w-[90px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 font-raleway text-xs text-white transition disabled:opacity-70 ${
                          row.isActive !== false
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {loadingId === row.id ? (
                          "Loading..."
                        ) : row.isActive !== false ? (
                          "Deactivate"
                        ) : (
                          "Activate"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteConfirm(row)}
                        disabled={loadingId === row.id}
                        className="inline-flex min-w-[90px] items-center justify-center whitespace-nowrap rounded-xl bg-[#002244] px-3 py-2.5 font-raleway text-xs text-white transition hover:bg-[#00182f] disabled:opacity-70"
                      >
                        Delete
                      </button>
                      <Link to={`/admin/user-profile/${row.id}`}>
                        <button
                          type="button"
                          className="whitespace-nowrap rounded-xl bg-[#F07400] px-3 py-2.5 font-raleway text-xs text-white transition hover:bg-[#d16200]"
                        >
                          See Details
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(confirmAction)}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        loading={isBusy}
        title={
          isDelete
            ? "Delete profile?"
            : confirmAction?.isCurrentlyActive
              ? "Deactivate profile?"
              : "Activate profile?"
        }
        message={
          isDelete
            ? `Delete the public profile for "${confirmAction?.displayName}"? This permanently removes the profile and QR cards. The account remains so they can set up again.`
            : confirmAction?.isCurrentlyActive
              ? `Are you sure you want to deactivate "${confirmAction?.displayName}"? Their profile and QR cards will be hidden until activated again.`
              : `Are you sure you want to activate "${confirmAction?.displayName}"? Their profile and QR cards will become visible again.`
        }
        confirmLabel={
          isDelete
            ? "Yes, delete"
            : confirmAction?.isCurrentlyActive
              ? "Yes, deactivate"
              : "Yes, activate"
        }
        confirmVariant={
          isDelete || confirmAction?.isCurrentlyActive ? "danger" : "success"
        }
      />
    </div>
  );
};
