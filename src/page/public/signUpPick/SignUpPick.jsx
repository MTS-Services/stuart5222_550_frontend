// import { useEffect, useRef, useState } from "react";
// import { StuartImage } from "../../../components/allStuartImage/StuartImage";
// import { GiCheckMark } from "react-icons/gi";
// import { BiErrorCircle } from "react-icons/bi";
// import { PersonToPersonForm } from "./components/PersonToPersonForm";
// import { Yoursafety } from "./components/Yoursafety";
// import { UploadFile } from "./components/UploadFile";
// import { TravelMode } from "./components/TravelMode";
// import { postData } from "../../../utils/axiosInstance";
// import { Form } from "./components/Form";
// import { Camera, Upload } from "lucide-react";
// import { RiDeleteBinLine } from "react-icons/ri";
// import { PaymentMethod } from "./components/PaymentMethod";

// export const SignUpPick = () => {
//   const [signUp, setSignUp] = useState([]);
//   const [loading, setLoading] = useState(true);
//   console.log(signUp);
//   console.log(loading);

//   const fileInputRef = useRef(null);
//   const [files, setFiles] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//   };

//   const handleClick = () => {
//     fileInputRef.current.click();
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       const data = await postData(`requestuser.json`);
//       setSignUp(data || []);
//     } catch (err) {
//       console.error("Failed to fetch data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen text-white font-raleway">
//       <div className="max-w-[600px] mx-auto">
//         {/* Header */}
//         <div className="text-center">
//           <StuartImage />
//           <h2 className="font-raleway font-bold md:text-[32px] text-xl">
//             Sign Up and Pick your Plan
//           </h2>
//         </div>

//         {/* Price Section */}
//         <div className="border-t-2 border-[#F07400] rounded-lg bg-[#434343] p-6 md:mt-6 mt-4">
//           <div className="bg-[#FFFFFF33] p-4 rounded-lg">
//             <h2 className="text-[32px] font-semibold">
//               $69/{" "}
//               <span className="text-base font-semibold">Initial setup fee</span>
//             </h2>
//             <hr className="my-6 text-[#BFBFBF]" />

//             {[
//               "Delivery of cards",
//               "Profile page setup & review",
//               "Secure contact sharing",
//               "50 unique QR code cards",
//             ].map((item, index) => (
//               <h3
//                 key={index}
//                 className="flex items-center gap-3 font-medium text-base my-3 first:mt-0"
//               >
//                 <span className="rounded-lg p-2 bg-[#F07400] w-7 h-7 text-white flex items-center justify-center">
//                   <GiCheckMark className="w-6 h-6 font-semibold" />
//                 </span>
//                 {item}
//               </h3>
//             ))}
//           </div>
//         </div>

//         {/* Plus Section */}
//         <PaymentMethod />

//         {/* Form */}
//         {/* <Form /> */}
//         <div className="md:my-20 my-10">
//           <div className="self-stretch flex flex-col gap-2">
//             <label className="text-white text-xl font-medium">Name</label>
//             <input
//               type="text"
//               placeholder="Enter Display Name"
//               className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
//             />
//           </div>
//           <div className="self-stretch flex flex-col gap-2 my-5">
//             <label className="text-white text-xl font-medium">Age</label>
//             <input
//               type="text"
//               placeholder="Enter your date of birth"
//               className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
//             />
//             <p className="text-xs font-normal text-[#BEBEBE] font-raleway w-[350px] my-2">
//               (We only store your month and year of birth which will calculate
//               your age as of the 28th of your birth month.)
//             </p>
//             <p className="text-xs font-normal text-[#BEBEBE] font-raleway w-[350px] md:mb-2 mb-1 flex items-center gap-2">
//               <BiErrorCircle className="text-[#FF5E00] w-5 h-5" />
//               Must be 18 or older
//             </p>
//           </div>

//           <div className="flex items-center gap-4 w-full my-5">
//             <div className="self-stretch flex flex-col gap-2 w-full">
//               <label className="text-white text-xl font-medium ">Height</label>
//               <input
//                 type="text"
//                 placeholder="Enter your Height"
//                 className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
//               />
//             </div>
//             <div className="self-stretch flex flex-col gap-2 w-full">
//               <label className="text-white text-xl font-medium">
//                 Body Type
//               </label>
//               <input
//                 type="text"
//                 placeholder="Describe your body type"
//                 className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
//               />
//             </div>
//           </div>
//           <div className="self-stretch flex flex-col gap-2 w-full">
//             <label className="text-white text-xl font-medium">Area</label>
//             <input
//               type="text"
//               placeholder="Enter your country and state "
//               className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
//             />
//           </div>
//           <div className="self-stretch flex flex-col gap-2 w-full my-5">
//             <label className="text-white text-xl font-medium">
//               Dealbreakers
//             </label>
//             <input
//               type="text"
//               placeholder="Enter your no go’s "
//               className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
//             />
//           </div>
//           <div className="self-stretch flex flex-col gap-2 w-full my-5">
//             <label className="text-white text-xl font-medium mb-1">
//               Tell ‘em About You
//             </label>
//             <textarea
//               id="message"
//               rows="5"
//               placeholder="Write your message here..."
//               className="w-full max-h-[265px] min-h-[265px] px-3 pt-1 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
//             />
//           </div>
//         </div>

//         {/* Travel Mode */}
//         {/* <TravelMode /> */}
//         <div className="bg-[#434343] md:px-5 px-2 py-8 rounded-lg">
//           <h2 className="font-bold text-2xl">Travel Mode</h2>
//           <div className="w-full flex items-center md:gap-5 gap-3 my-6">
//             <div className="self-stretch flex flex-col gap-2 w-[48%]">
//               <label className="text-white text-base font-semibold">
//                 Start Date{" "}
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your Date"
//                 className="h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
//               />
//             </div>
//             <div className="self-stretch flex flex-col gap-2 w-[48%]">
//               <label className="text-white text-base font-semibold">
//                 End Date{" "}
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your date"
//                 className="h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
//               />
//             </div>
//           </div>
//           <div className="self-stretch flex flex-col gap-2 w-full">
//             <label className="text-white text-base font-semibold">
//               Location
//             </label>
//             <input
//               type="text"
//               placeholder="Enter your location"
//               className="h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
//             />
//           </div>
//         </div>

//         {/* Add Images */}
//         <div className="my-10 font-raleway">
//           <h2 className="font-medium text-xl">Add Images</h2>
//           <div className="px-3 py-8 flex items-center gap-4 bg-[#FFFFFF33] rounded-lg my-6">
//             <BiErrorCircle className="w-10 h-10 text-[#FF5E00]" />
//             <p className="font-normal text-base">
//               One showing eyes, one showing a toothy grin and one showing full
//               body. Be classy, not trashy. No nudes. G or PG rated photos only.
//             </p>
//           </div>
//         </div>

//         {/* Upload File or Image */}
//         {/* <UploadFile
//           handleClick={handleClick}
//           fileInputRef={fileInputRef}
//           handleFileChange={handleFileChange}
//           files={files}
//         /> */}
//         <div className="flex items-center justify-center p-4">
//           <div className="w-full max-w-md space-y-4">
//             {/* Upload Photos Card */}
//             <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center shadow-md">
//               {/* Upload Icon Box */}
//               <div
//                 className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:bg-orange-600 transition"
//                 onClick={handleClick}
//               >
//                 <Upload className="w-8 h-8 text-white" strokeWidth={2.5} />
//               </div>

//               {/* Title */}
//               <h2 className="text-gray-800 font-semibold text-lg mb-2">
//                 Upload Photos
//               </h2>

//               {/* Description */}
//               <p className="text-gray-500 text-sm text-center mb-4">
//                 A minimum of 3 required photos and up
//                 <br />
//                 to 10 additional images
//               </p>

//               {/* Hidden file input */}
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 ref={fileInputRef}
//                 className="hidden"
//                 onChange={handleFileChange}
//               />

//               {/* Preview selected files */}
//               {files.length > 0 && (
//                 <ul className="mt-4 text-sm text-gray-600">
//                   {files.map((file, idx) => (
//                     <li key={idx}>📷 {file.name}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* Divider */}
//             <div className="flex items-center gap-4">
//               <div className="flex-1 h-px text-white"></div>
//               <hr className="w-full bg-white" />
//               <span className="text-white text-sm">or</span>
//               <hr className="w-full bg-white" />
//             </div>

//             {/* Camera Button */}
//             <button className="w-full bg-white hover:bg-gray-50 rounded-xl py-4 px-6 flex items-center justify-center gap-3 transition-colors">
//               <Camera className="w-5 h-5 text-gray-700" />
//               <span className="text-gray-800 font-medium">
//                 Open Camera & Take Photo
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* Your safety */}
//         {/* <Yoursafety /> */}
//         <div className="">
//           <div className="bg-[#FFFFFF33] p-5 rounded-lg my-8">
//             <p className="font-normal text-lg">
//               Your safety is what inspired us. You don’t know anything about the
//               person you or your friend have given the card to. Please be smart
//               about what information you share. Choose a means that gives you a
//               level of protection - ie: a unique email and dedicated phone
//               number (google voice){" "}
//             </p>
//           </div>
//           <p className="font-medium text-xl md:my-14 my-4 px-3 md:py-8 py-6">
//             If you can’t find your person with 50 cards, you’ll need to order
//             more cards from us. There’s a re-order card included in your
//             original card order, so be sure not to hand that one out.
//           </p>

//           <div className="px-3 py-8 flex items-center gap-4 bg-[#FFFFFF33] rounded-lg my-10">
//             <RiDeleteBinLine className="w-14 h-14 text-[#FF5E00]" />
//             <p className="font-normal text-base">
//               Your cards will be sent to you after your profile has been
//               approved for not violating decency standards. Once the cards are
//               mailed to you, we delete your information
//             </p>
//           </div>
//         </div>

//         {/* Person To PersonForm */}
//         {/* <PersonToPersonForm /> */}
//         <div className="bg-[#434343] px-4 py-8 rounded-lg my-12">
//           <div className="max-w-[330px]  mx-auto">
//             <h2 className="font-semibold text-xl mb-4">
//               Person to person dating, but with a safer approach.
//             </h2>
//             <p className="font-normal text-base">
//               This is your “safe share” zone – just the details you choose to
//               pass along.
//             </p>
//           </div>
//           <div className="mt-6 max-w-[340px] mx-auto">
//             <div className="self-stretch flex flex-col gap-2">
//               <label className="text-white text-base font-semibold">Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter your display name"
//                 className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
//               />
//             </div>
//             <div className="self-stretch flex flex-col gap-2 mt-6">
//               <label className="text-white text-base font-semibold">
//                 E-mail
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your unique email"
//                 className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
//               />
//             </div>
//             <div className="md:my-8 my-4">
//               <h2 className="text-base font-semibold text-center">and/or</h2>
//             </div>
//             <div className="self-stretch flex flex-col gap-2">
//               <label className="text-white text-base font-semibold">
//                 Phone number
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your dedicated phone number"
//                 className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full mt-6 p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
//             >
//               Submit for Review
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useEffect, useRef, useState } from "react";
import { StuartImage } from "../../../components/allStuartImage/StuartImage";
import { GiCheckMark } from "react-icons/gi";
import { BiErrorCircle } from "react-icons/bi";
import { postData } from "../../../utils/axiosInstance";
import { Camera, Upload } from "lucide-react";
import { RiDeleteBinLine } from "react-icons/ri";
import { PaymentMethod } from "./components/PaymentMethod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SignUpPick = () => {
  const [signUp, setSignUp] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await postData(`requestuser.json`);
      setSignUp(data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const data = {
      firstName: form.firstName.value,
      age: form.age.value,
      height: form.height.value,
      bodyType: form.bodyType.value,
      area: form.area.value,
      textArea: form.textArea.value,
      dealBreaks: form.dealBreaks.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      location: form.location.value,
      file: files, // array of File objects
      name: form.name.value,
      email: form.email.value,
      number: form.number.value,
    };

    console.log(data); // Log data in console

    // try {
    //   // Post data to backend
    //   await postData("submitUser.json", data);

    //   toast.success("Your data has been submitted successfully!", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });

    //   // Reset form and files
    //   form.reset();
    //   setFiles([]);
    // } catch (err) {
    //   console.error("Failed to submit data:", err);
    //   toast.error("Failed to submit your data. Please try again!", {
    //     position: "top-right",
    //     autoClose: 3000,
    //   });
    // }
  };

  return (
    <div className="px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen text-white font-raleway">
      <form onSubmit={handleSubmit}>
        <div className="max-w-[600px] mx-auto">
          {/* Header */}
          <div className="text-center">
            <StuartImage />
            <h2 className="font-raleway font-bold md:text-[32px] text-xl">
              Sign Up and Pick your Plan
            </h2>
          </div>

          {/* Price Section */}
          <div className="border-t-2 border-[#F07400] rounded-lg bg-[#434343] p-6 md:mt-6 mt-4">
            <div className="bg-[#FFFFFF33] p-4 rounded-lg">
              <h2 className="text-[32px] font-semibold">
                $69/{" "}
                <span className="text-base font-semibold">
                  Initial setup fee
                </span>
              </h2>
              <hr className="my-6 text-[#BFBFBF]" />
              {[
                "Delivery of cards",
                "Profile page setup & review",
                "Secure contact sharing",
                "50 unique QR code cards",
              ].map((item, index) => (
                <h3
                  key={index}
                  className="flex items-center gap-3 font-medium text-base my-3 first:mt-0"
                >
                  <span className="rounded-lg p-2 bg-[#F07400] w-7 h-7 text-white flex items-center justify-center">
                    <GiCheckMark className="w-6 h-6 font-semibold" />
                  </span>
                  {item}
                </h3>
              ))}
            </div>
          </div>

          {/* Plus Section */}
          <PaymentMethod />

          {/* Form Fields */}
          <div className="md:my-20 my-10">
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-white text-xl font-medium">Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter Display Name"
                className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
            </div>
            <div className="self-stretch flex flex-col gap-2 my-5">
              <label className="text-white text-xl font-medium">Age</label>
              <input
                type="text"
                name="age"
                placeholder="Enter your date of birth"
                className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
              <p className="text-xs font-normal text-[#BEBEBE] font-raleway w-[350px] my-2">
                (We only store your month and year of birth which will calculate
                your age as of the 28th of your birth month.)
              </p>
              <p className="text-xs font-normal text-[#BEBEBE] font-raleway w-[350px] md:mb-2 mb-1 flex items-center gap-2">
                <BiErrorCircle className="text-[#FF5E00] w-5 h-5" />
                Must be 18 or older
              </p>
            </div>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="self-stretch flex flex-col gap-2 w-full">
                <label className="text-white text-xl font-medium ">
                  Height
                </label>
                <input
                  type="text"
                  name="height"
                  placeholder="Enter your Height"
                  className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div className="self-stretch flex flex-col gap-2 w-full">
                <label className="text-white text-xl font-medium">
                  Body Type
                </label>
                <input
                  type="text"
                  name="bodyType"
                  placeholder="Describe your body type"
                  className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
                />
              </div>
            </div>
            <div className="self-stretch flex flex-col gap-2 w-full">
              <label className="text-white text-xl font-medium">Area</label>
              <input
                type="text"
                name="area"
                placeholder="Enter your country and state "
                className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
            </div>
            <div className="self-stretch flex flex-col gap-2 w-full my-5">
              <label className="text-white text-xl font-medium">
                Dealbreakers
              </label>
              <input
                type="text"
                name="dealBreaks"
                placeholder="Enter your no go’s "
                className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
            </div>
            <div className="self-stretch flex flex-col gap-2 w-full my-5">
              <label className="text-white text-xl font-medium mb-1">
                Tell ‘em About You
              </label>
              <textarea
                id="message"
                rows="5"
                name="textArea"
                placeholder="Write your message here..."
                className="w-full max-h-[265px] min-h-[265px] px-3 pt-1 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
            </div>
          </div>

          {/* Travel Mode */}
          <div className="bg-[#434343] md:px-5 px-2 py-8 rounded-lg">
            <h2 className="font-bold text-2xl">Travel Mode</h2>
            <div className="w-full flex items-center md:gap-5 gap-3 my-6">
              <div className="self-stretch flex flex-col gap-2 w-[48%]">
                <label className="text-white text-base font-semibold">
                  Start Date{" "}
                </label>
                <input
                  type="text"
                  name="startDate"
                  placeholder="Enter your Date"
                  className="h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="self-stretch flex flex-col gap-2 w-[48%]">
                <label className="text-white text-base font-semibold">
                  End Date{" "}
                </label>
                <input
                  type="text"
                  name="endDate"
                  placeholder="Enter your date"
                  className="h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div className="self-stretch flex flex-col gap-2 w-full">
              <label className="text-white text-base font-semibold">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter your location"
                className="h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
              <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center shadow-md">
                <div
                  className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:bg-orange-600 transition"
                  onClick={handleClick}
                >
                  <Upload className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-gray-800 font-semibold text-lg mb-2">
                  Upload Photos
                </h2>
                <p className="text-gray-500 text-sm text-center mb-4">
                  A minimum of 3 required photos and up to 10 additional images
                </p>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                {files.length > 0 && (
                  <ul className="mt-4 text-sm text-gray-600">
                    {files.map((file, idx) => (
                      <li key={idx}>📷 {file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Person to person */}
          <div className="bg-[#434343] px-4 py-8 rounded-lg my-12">
            <div className="max-w-[340px] mx-auto">
              <div className="self-stretch flex flex-col gap-2">
                <label className="text-white text-base font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your display name"
                  className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="self-stretch flex flex-col gap-2 mt-6">
                <label className="text-white text-base font-semibold">
                  E-mail
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your unique email"
                  className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="md:my-8 my-4">
                <h2 className="text-base font-semibold text-center">and/or</h2>
              </div>
              <div className="self-stretch flex flex-col gap-2">
                <label className="text-white text-base font-semibold">
                  Phone number
                </label>
                <input
                  type="text"
                  name="number"
                  placeholder="Enter your dedicated phone number"
                  className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
              >
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
