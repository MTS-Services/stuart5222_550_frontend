import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestWaitlist } from "../../../../features/public/user/userFetch";
import { STORAGE } from "../../../../config/storage/auth/authStorage";

export const JoinWaitlist = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const { loading, error } = useSelector((state) => state.user);

  const waitlistStatus = STORAGE.getWaitlist();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(requestWaitlist(formData)).unwrap();
    } catch (err) {
      console.error("❌ Request submission failed:", err);
    }
  };

  return (
    <>
      {waitlistStatus === "WAITLIST" ? (
        <div className="mt-8 w-full rounded-lg bg-green-100 p-6">
          <h1 className="text-center font-semibold text-green-500">
            Thank you for joining the waitlist! We'll be in touch soon. <br />
            Please check your email for this updates.
          </h1>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex w-full flex-col items-start justify-start gap-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="h-11 w-full rounded-lg bg-white p-2.5 text-base font-semibold text-neutral-700 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="h-11 w-full rounded-lg bg-white p-2.5 text-base font-semibold text-neutral-700 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="w-full">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 p-2.5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Join the waitlist"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};
