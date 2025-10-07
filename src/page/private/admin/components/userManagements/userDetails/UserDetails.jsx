// import { useState } from "react";
// import { FiEdit } from "react-icons/fi";

// export const UserDetails = () => {
//   const [personalDetails, setPersonalDetails] = useState({
//     firstName: "Jenny",
//     lastName: "Wilson",
//     email: "alma.lawson@example.com",
//     phone: "0412 345 678",
//   });

//   const [passwordDetails, setPasswordDetails] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;

//     const data = {
//       firstName: form.firstName.value,
//       lastName: form.lastName.value,
//       email: form.email.value,
//       tel: form.tel.value,
//       oldPassword: form.oldPassword.value,
//       newPassword: form.newPassword.value,
//       confirmPassword: form.confirmPassword.value,
//     };
//     console.log(data);
//   };

//   return (
//     <div className="bg-[#F9FAFB] md:p-8 p-3">
//       <div className="">
//         <h2 className="text-2xl text-[#002244] font-semibold font-poppins">
//           Settings
//         </h2>
//         <p className="justify-start text-[#464646] text-base font-normal font-lato leading-normal mb-4 mt-1">
//           Manage your account settings and preferences
//         </p>
//       </div>
//       {/* Input Fiend */}
//       <div className="min-h-screen bg-gray-50 md:p-8 p-4">
//         <div className="max-w-7xl mx-auto">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Personal Details Section */}
//               <div className="bg-white rounded-lg p-8 shadow-sm">
//                 <div className="flex items-center justify-between mb-8">
//                   <h2 className="text-2xl font-poppins font-semibold text-gray-900">
//                     Personal Details
//                   </h2>
//                   <button className="text-gray-600 hover:text-gray-900">
//                     <FiEdit className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-p font-medium text-gray-700 mb-2">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={personalDetails.firstName}
//                         onChange={(e) =>
//                           setPersonalDetails({
//                             ...personalDetails,
//                             firstName: e.target.value,
//                           })
//                         }
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={personalDetails.lastName}
//                         onChange={(e) =>
//                           setPersonalDetails({
//                             ...personalDetails,
//                             lastName: e.target.value,
//                           })
//                         }
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={personalDetails.email}
//                       onChange={(e) =>
//                         setPersonalDetails({
//                           ...personalDetails,
//                           email: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       name="tel"
//                       value={personalDetails.phone}
//                       onChange={(e) =>
//                         setPersonalDetails({
//                           ...personalDetails,
//                           phone: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Account Password Section */}
//               <div className="bg-white rounded-lg md:p-8 p-4 shadow-sm">
//                 <div className="flex items-center justify-between mb-8">
//                   <h2 className="text-2xl font-semibold text-gray-900">
//                     Account Password
//                   </h2>
//                   <button className="text-gray-600 hover:text-gray-900">
//                     <FiEdit className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Old Password
//                     </label>
//                     <input
//                       type="password"
//                       name="oldPass"
//                       value={passwordDetails.oldPassword}
//                       onChange={(e) =>
//                         setPasswordDetails({
//                           ...passwordDetails,
//                           oldPassword: e.target.value,
//                         })
//                       }
//                       placeholder="******"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       New Password
//                     </label>
//                     <input
//                       type="password"
//                       name="newPass"
//                       value={passwordDetails.newPassword}
//                       onChange={(e) =>
//                         setPasswordDetails({
//                           ...passwordDetails,
//                           newPassword: e.target.value,
//                         })
//                       }
//                       placeholder="******"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Confirm New Password
//                     </label>
//                     <input
//                       type="password"
//                       name="newPass"
//                       value={passwordDetails.confirmPassword}
//                       onChange={(e) =>
//                         setPasswordDetails({
//                           ...passwordDetails,
//                           confirmPassword: e.target.value,
//                         })
//                       }
//                       placeholder="******"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <button
//               type="submit"
//               className="bg-[#FF8C00] text-black w-full py-2 rounded-[4px] mt-14"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };





import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import { postData } from "../../../../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export const UserDetails = () => {
  const navigate = useNavigate();

  const [personalDetails, setPersonalDetails] = useState({
    firstName: "Jenny",
    lastName: "Wilson",
    email: "alma.lawson@example.com",
    phone: "0412 345 678",
  });

  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      tel: form.tel.value,
      oldPassword: form.oldPassword.value,
      newPassword: form.newPassword.value,
      confirmPassword: form.confirmPassword.value,
    };

    try {
      console.log("📦 Submitting data:", data);

      // ✅ POST to scan_me route (backend ready)
      const response = await postData("submit_user", data);
      console.log("Server Response:", response);

      toast.success("Your data has been submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // ✅ Reset form
      form.reset();
      setPersonalDetails({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
      setPasswordDetails({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // ✅ Navigate after success
      // setTimeout(() => navigate("/welcome-scan"), 1500);
    } catch (err) {
      console.error("Failed to submit data:", err);
      toast.error("Failed to submit your data. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="bg-[#F9FAFB] md:p-8 p-3">
      <div>
        <h2 className="text-2xl text-[#002244] font-semibold font-poppins">
          Settings
        </h2>
        <p className="justify-start text-[#464646] text-base font-normal font-lato leading-normal mb-4 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="min-h-screen bg-gray-50 md:p-8 p-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Details Section */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-poppins font-semibold text-gray-900">
                    Personal Details
                  </h2>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FiEdit className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={personalDetails.firstName}
                        onChange={(e) =>
                          setPersonalDetails({
                            ...personalDetails,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={personalDetails.lastName}
                        onChange={(e) =>
                          setPersonalDetails({
                            ...personalDetails,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={personalDetails.email}
                      onChange={(e) =>
                        setPersonalDetails({
                          ...personalDetails,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="tel"
                      value={personalDetails.phone}
                      onChange={(e) =>
                        setPersonalDetails({
                          ...personalDetails,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Account Password Section */}
              <div className="bg-white rounded-lg md:p-8 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Account Password
                  </h2>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FiEdit className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Old Password
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordDetails.oldPassword}
                      onChange={(e) =>
                        setPasswordDetails({
                          ...passwordDetails,
                          oldPassword: e.target.value,
                        })
                      }
                      placeholder="******"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordDetails.newPassword}
                      onChange={(e) =>
                        setPasswordDetails({
                          ...passwordDetails,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="******"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordDetails.confirmPassword}
                      onChange={(e) =>
                        setPasswordDetails({
                          ...passwordDetails,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="******"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#FF8C00] text-black w-full py-2 rounded-[4px] mt-14"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
