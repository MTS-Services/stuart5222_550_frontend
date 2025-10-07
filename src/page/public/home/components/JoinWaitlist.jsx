// import { useEffect, useState } from "react";
// import { postData } from "../../../../utils/axiosInstance";
// import { Link } from "react-router-dom";

// export const JoinWaitlist = () => {
//   const [editData, setEditData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await postData(`postdata.json`);
//       setEditData(data || []);
//     } catch (err) {
//       console.error("Failed to fetch data:", err);
//       setError("Failed to load data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="w-full flex flex-col justify-start items-start gap-6 mt-8">
//       {/* Name Input */}
//       <input
//         type="text"
//         placeholder="Name"
//         className="w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
//       />

//       {/* Email Input */}
//       <input
//         type="email"
//         placeholder="E-mail"
//         className="w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
//       />

//       {/* Button */}
//       <div className="w-full">
//         <Link to={`welcome-scan`}>
//           <button
//             type="submit"
//             className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
//           >
//             Join the waitlist
//           </button>
//         </Link>
//       </div>
//     </form>
//   );
// };






import { useState } from "react";
import { postData } from "../../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const JoinWaitlist = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      console.log("Submitting data:", formData);

      const response = await postData("postdata.json", formData);
      console.log("Server Response:", response);

      // Success toast
      toast.success("Successfully joined the waitlist!");

      // Navigate after delay
      setTimeout(() => {
        navigate("/welcome-scan");
      }, 1500);
    } catch (err) {
      console.error("Failed to submit:", err);
      toast.error("Failed to submit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col justify-start items-start gap-6 mt-8"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
      />

      <input
        type="email"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleChange}
        className="w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="w-full">
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Join the waitlist"}
        </button>
      </div>
    </form>
  );
};
